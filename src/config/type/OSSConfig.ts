import BaseConfig from './BaseConfig';

export default class OSSConfig extends BaseConfig {
    readonly type: string;  // 本地 fs ，阿里云 aliyun
    readonly uploadPrefix: string; // 本地开发时，上传路径加个前缀
    readonly uploadFieldName: string;
    readonly expiration: number; // 设置Policy的失效时间, 单位小时
    readonly callbackSecretToken: string;
    readonly aliyun: {
        readonly uploadActionURL: string;
        readonly accessKeyID: string;
        readonly accessKeySecret: string;
        readonly bucket: string;
        readonly region: string;
    };

    constructor(cfg) {
        super(cfg);
    }
}