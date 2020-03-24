import {
    Controller, Get, UseGuards, Post, Body, Req, Query, Res, UseInterceptors, UploadedFile
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { OSSService } from './oss.service';
import { APIPrefix } from '../constants/constants';
import { ActiveGuard } from '../core/guards/active.guard';
import { ConfigService } from '../config/config.service';
import { MyHttpException } from '../core/exception/my-http.exception';
import { ErrorCode } from '../constants/error';
import { Image } from '../entity/image.entity';
import { createWriteStream } from 'fs';
import { join } from 'path';
import * as fs from "fs";
import * as path from 'path';
import { createDir } from '../utils/common';
import { imageSize } from 'image-size';
import mime = require('mime');


@Controller()
export class CommonController {
    constructor(
        private readonly configService: ConfigService,
        private readonly ossService: OSSService,
    ) { }

    @Get(`${APIPrefix}/common/oss/policy`)
    @UseGuards(ActiveGuard)
    async ossPolicy(@Res() res: Response) {
        const uploadPolicy = await this.ossService.requestPolicy(res.locals.globalConfig.csrfToken);
        res.json({
            errorCode: ErrorCode.SUCCESS.CODE,
            data: {
                uploadPolicy,
            },
        });
    }

    @Post(`${APIPrefix}/common/oss/callback`)
    async ossCallback(@Body() body, @Req() req) {
        if (body['callback-token'] !== this.configService.OSS.callbackSecretToken) {
            return {
                Status: 'verdify not ok',
            };
        }
        console.log(JSON.stringify(body));

        const imgData = {
            mime: body.mimeType,
            size: body.size,
            url: body.filename,
            width: body.width,
            height: body.height,
            format: body.format,
        };
        const img: Image = await this.ossService.createImage(imgData);
        img.url = this.ossService.getImageURL(imgData.url);
        return img;
    }


    @Post(`${APIPrefix}/common/oss/createimg`)
    @UseInterceptors(FileInterceptor('file'))
    async createImg(@UploadedFile("file") file, @Body('key') key: string) {
        if (this.configService.env !== this.configService.DEVELOPMENT) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        if (!key) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
            });
        }
        if (!key) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
            });
        }

        let imgData = await this.ossService.getImageInfo(key);
        if (imgData) {
            throw new MyHttpException({
                errorCode: ErrorCode.ObjectExists.CODE,
            });
        }

        if (file) {
            let filePath = join(__dirname, '..', '../data/upload', `${key}`);
            let dirPath = path.dirname(filePath);
            if (!fs.existsSync(dirPath)) {
                createDir(dirPath)
            }
            let imgDimensions = imageSize(file.buffer)
            const writeImage = createWriteStream(filePath)
            writeImage.write(file.buffer)

            imgData = new Image();
            imgData.mime = mime.getType(filePath);
            imgData.size = file.buffer.length;
            imgData.url = key;
            imgData.width = imgDimensions.width;
            imgData.height = imgDimensions.height;
            imgData.format = imgDimensions.type;
            writeImage.close();
        }
        const img: Image = await this.ossService.createImage({
            ...imgData,
            url: imgData.url,
        });
        img.url = this.ossService.getImageURL(imgData.url);
        return img;
    }

    @Get(`${APIPrefix}/common/oss/img/`)
    async getImg(@Res() res: Response, @Query('key') key: string) {
        //仅仅开发环境支持
        if (this.configService.env !== this.configService.DEVELOPMENT) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotSupport.CODE,
            });
        }
        let filePath = join(__dirname, '..', '../data/upload', `${key}`);
        if (!fs.existsSync(filePath)) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        const stream = fs.createReadStream(filePath)
        res.set('content-type', mime.getType(filePath));//设置返回类型
        stream.pipe(res)
    }
}