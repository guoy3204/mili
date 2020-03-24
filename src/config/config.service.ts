import * as _ from 'lodash';
import defaultJSON from './cfg.default';
import developmentJSON from './cfg.development';
import testJSON from './cfg.test';
import productionJSON from './cfg.production';
import DBConfig from './type/DBConfig';
import StatsDConfig from './type/StatsDConfig';
import { ServerConfig } from './type/ServerConfig';
import StaticConfig from './type/StaticConfig';
import OSSConfig from './type/OSSConfig';
import AliyunSMSConfig from './type/AliyunSMSConfig';
import GeetestCaptcha from './type/GeetestCaptcha';
import WeiboConfig from './type/WeiboConfig';
import OAuthConfig from './type/OAuthConfig';
import RedisConfig from './type/RedisConfig';

export class ConfigService {
    readonly DEVELOPMENT = 'development';
    readonly TEST = 'test';
    readonly PRODUCTION = 'production';

    readonly env: string;
    readonly db: DBConfig;
    readonly redis: RedisConfig;
    readonly statsD: StatsDConfig;
    readonly server: ServerConfig;
    readonly static: StaticConfig;
    readonly OSS: OSSConfig;
    readonly aliyunSMS: AliyunSMSConfig;
    readonly geetestCaptcha: GeetestCaptcha;
    readonly oauth: OAuthConfig;
    readonly weibo: WeiboConfig;

    constructor() {
        const envConfigMap = {
            development: developmentJSON,
            test: testJSON,
            production: productionJSON,
        };
        if (envConfigMap[process.env.NODE_ENV]) {
            _.merge(defaultJSON, envConfigMap[process.env.NODE_ENV]);
            this.env = process.env.NODE_ENV;
        } else {
            this.env = this.DEVELOPMENT;
        }
        this.db = new DBConfig(defaultJSON.db);
        if (this.env !== this.DEVELOPMENT && this.db.synchronize) {
            process.exit(-1);
        }
        this.redis = new RedisConfig(defaultJSON.redis);
        this.statsD = new StatsDConfig(defaultJSON.statsD);
        this.server = new ServerConfig(defaultJSON.server);
        this.static = new StaticConfig(defaultJSON.static);
        this.OSS = new OSSConfig(defaultJSON.OSS);
        this.aliyunSMS = new AliyunSMSConfig(defaultJSON.aliyunSMS);
        this.geetestCaptcha = new GeetestCaptcha(defaultJSON.geetestCaptcha);
        this.oauth = new OAuthConfig(defaultJSON.oauth);
        this.weibo = new WeiboConfig(defaultJSON.weibo);
    }
}
