import BaseConfig from './BaseConfig';

export default class OAuthConfig extends BaseConfig {
    readonly clientID: string;
    readonly clientSecret: string;
    readonly accessTokenURL: string;
    readonly userInfoURL: string;
    readonly authorizeURL: string;

    constructor(cfg) {
        super(cfg);
    }
}