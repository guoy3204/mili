import {
    Injectable,
} from '@nestjs/common';
import * as stream from 'stream';
import * as uuid from 'uuid';
import * as mime from 'mime';
import axios from 'axios';
import * as moment from 'moment';
import * as util from 'util';
import * as OSSClient from 'ali-oss';
import { base64Encode, hmacSHA1 } from '../utils/security';
import { ConfigService } from '../config/config.service';
import { extName, urlBaseName } from '../utils/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Equal } from 'typeorm';
import { Image } from '../entity/image.entity';
import { APIPrefix } from '../constants/constants';

const PassThrough = stream.PassThrough;

@Injectable()
export class OSSService {
    constructor(
        private readonly configService: ConfigService,

        @InjectRepository(Image)
        private readonly imageRepository: Repository<Image>,
    ) { }

    private createOSSClient(): OSSClient {
        const aliyunOssCfg = this.configService.OSS.aliyun;
        const client = new OSSClient({
            region: aliyunOssCfg.region,
            accessKeyId: aliyunOssCfg.accessKeyID,
            accessKeySecret: aliyunOssCfg.accessKeySecret,
            bucket: aliyunOssCfg.bucket,
        });
        return client;
    }

    async requestPolicy(csrfToken: string = "") {
        if (this.configService.env === this.configService.DEVELOPMENT || this.configService.OSS.type === "fs") {
            const now = moment();
            const serverUrl = this.configService.server.url;
            const ossCfg = this.configService.OSS;
            const staticConfig = this.configService.static;
            const imgMaxSizeM = staticConfig.imgMaxSize;
            return {
                ossType: "fs",
                uploadActionURL: `${serverUrl}${APIPrefix}/common/oss/createimg`,
                uploadFieldName: ossCfg.uploadFieldName,
                uploadPrefix: ossCfg.uploadPrefix + '/' + now.year() + '/' + (now.month() + 1),
                imgFormat: staticConfig.imgFormat,
                imgMaxSize: imgMaxSizeM,
                imgMaxSizeError: util.format(staticConfig.imgMaxSizeError, staticConfig.imgMaxSize / 1024 / 1024),
                uploadData: {
                    'key': '', // 上传文件的object名称
                    'success_action_status': 201,
                },
                uploadImgURL: staticConfig.uploadImgURL,
                csrfToken: csrfToken
            };
        } else if (this.configService.OSS.type === "aliyun") {
            return this.requestAliyunOSSPolicy();
        }
    }
    async requestAliyunOSSPolicy() {
        const now = moment();
        const ossCfg = this.configService.OSS;
        const aliyunOssCfg = ossCfg.aliyun;
        const staticConfig = this.configService.static;
        const imgMaxSizeM = staticConfig.imgMaxSize;
        const policy = {
            // 设置Policy的失效时间, 以ISO8601 GMT时间表示
            // 超过失效时间，就无法通过此Policy上传文件
            expiration: moment().add(ossCfg.expiration, 'hours').toISOString(),
            conditions: [
                { bucket: aliyunOssCfg.bucket },
                ['starts-with', '$key', ossCfg.uploadPrefix],
                ['content-length-range', 1, imgMaxSizeM], // 设置上传文件的大小限制, 单位字节
            ],
        };

        const base64Policy = base64Encode(JSON.stringify(policy));
        const signature = hmacSHA1(aliyunOssCfg.accessKeySecret, base64Policy);
        const serverUrl = this.configService.server.url;
        const callbackObj = {
            callbackUrl: `${serverUrl}${APIPrefix}/common/oss/callback`,
            callbackBody: '{' + [
                '\"mimeType\":${mimeType}',
                '\"size\":${size}',
                '\"filename\":${object}',
                '\"width\":${imageInfo.width}',
                '\"height\":${imageInfo.height}',
                '\"format\":${imageInfo.format}',
                '\"callback-token\":${x:callback-token}',
            ].join(',') + '}',
            callbackBodyType: 'application/json',
        };
        const isDev = this.configService.env === this.configService.DEVELOPMENT;
        return {
            ossType: "aliyun",
            uploadActionURL: aliyunOssCfg.uploadActionURL,
            uploadFieldName: ossCfg.uploadFieldName,
            uploadPrefix: ossCfg.uploadPrefix + '/' + now.year() + '/' + (now.month() + 1),
            imgFormat: staticConfig.imgFormat,
            imgMaxSize: imgMaxSizeM,
            imgMaxSizeError: util.format(staticConfig.imgMaxSizeError, staticConfig.imgMaxSize / 1024 / 1024),
            uploadData: {
                'OSSAccessKeyId': aliyunOssCfg.accessKeyID,
                'policy': base64Policy,
                'Signature': signature,
                'key': '', // 上传文件的object名称
                'success_action_status': 201,
                'callback': !isDev ? base64Encode(JSON.stringify(callbackObj)) : undefined,
                'x:callback-token': !isDev ? ossCfg.callbackSecretToken : undefined,
            },
            uploadImgURL: staticConfig.uploadImgURL,
        };
    }

    async uploadFromStreamURL(url: string, pathname: string): Promise<string> {
        const client: OSSClient = this.createOSSClient();
        const res = await axios({
            method: 'get',
            url,
            responseType: 'stream',
        });
        const uploadName = `${this.configService.OSS.uploadPrefix}${pathname}`;
        const result = await client.putStream(uploadName, res.data.pipe(new PassThrough()));
        let name = result.name || '';
        if (name.charAt(0) !== '/') {
            name = '/' + name;
        }
        return this.getImageURL(name);
    }

    getImageURL(path: string) {
        if (path.indexOf('https://') === 0) {
            return path;
        }
        if (path.charAt(0) !== '/') {
            path = '/' + path;
        }
        const serverUrl = this.configService.server.url;
        if (this.configService.static.uploadImgURL) {
            return this.configService.static.uploadImgURL + path;
        } else {
            return `${serverUrl}${APIPrefix}/common/oss/img?key=${path}`;
        }
    }

    async getImageInfo(path: string): Promise<Image> {
        if (path.charAt(0) !== '/') {
            path = '/' + path;
        }
        if (this.configService.env === this.configService.DEVELOPMENT || this.configService.OSS.type === "fs") {
            return await this.imageRepository.findOne({
                where: {
                    url: Equal(path),
                },
            });
        }
        else if (this.configService.OSS.type === "aliyun") {
            const client = this.createOSSClient();
            let result;
            try {
                result = await client.get(path, { process: 'image/info' });
            } catch (err) {
                console.log(err);
                return null;
            }
            const imgData = JSON.parse(result.content.toString());
            let img = new Image();
            img.mime = mime.getType(imgData.Format.value);
            img.size = parseInt(imgData.FileSize.value, 10);
            img.url = path;
            img.width = parseInt(imgData.ImageWidth.value, 10);
            img.height = parseInt(imgData.ImageHeight.value, 10);
            img.format = imgData.Format.value;
            return img;
        }
    }

    async createImage(imgData) {
        const img: Image = new Image();
        img.format = imgData.format;
        img.mime = imgData.mime;
        img.width = imgData.width;
        img.height = imgData.height;
        img.size = imgData.size;
        img.url = imgData.url;
        return await this.imageRepository.save(img);
    }

    async findImages(ids: number[]): Promise<Image[]> {
        return await this.imageRepository.find({
            where: {
                id: In(ids),
            },
        });
    }
}