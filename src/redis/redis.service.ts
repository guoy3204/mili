import { Injectable } from '@nestjs/common';
import * as Redis from 'ioredis';
import * as util from 'util';
import * as _ from 'lodash';
import { User } from '../entity/user.entity';
import { ConfigService } from '../config/config.service';
import { Category } from '../entity/category.entity';

class CacheKeys {
    readonly user: string = 'user:%d';
    readonly signupCode: string = 'signupcode:%s';
    readonly userToken: string = 'usertoken:%d';
    readonly publishArticle: string = 'publisharticle:%d';
    readonly categories: string = 'categories';
}

@Injectable()
export class RedisService {
    readonly client: Redis.Redis;
    readonly cacheKeys: CacheKeys;

    decodeUrl(url: string): Redis.RedisOptions {
        // let url = "redis://:DMb03mNHf3QAbJs4dPNOU21Qi46@121.201.122.224:6381/12" || redis://:DMb03mNHf3QAbJs4dPNOU21Qi46@192.168.1.9:28017,192.168.1.9:29017,192.168.1.9:30017/12
        let opt: Redis.RedisOptions = {}
        if (url.indexOf("://:") === -1 || url.indexOf("@") === -1) {
            console.warn("redis decodeUrl fail,please check dbLog.json")
            return
        }
        let newUrl = url.split("://:")[1]
        if (newUrl.indexOf("/") === -1) {
            console.warn("redis decodeUrl fail,please check dbLog.json,url is not '/'")
            return
        }
        let pwdAndUrls = newUrl.split("@")
        opt.password = pwdAndUrls[0]
        let dbs = pwdAndUrls[1].split("/")
        opt.db = +dbs[1]
        if (dbs[0].indexOf(",") > 0) {
            let ips = dbs[0].split(",")
            opt.sentinels = []
            for (let ip of ips) {
                if (ip.indexOf(":") === -1) {
                    console.warn("redis decodeUrl fail,please check dbLog.json,ip is not ':'")
                    return
                }
                let value = ip.split(":")
                opt.sentinels.push({ host: value[0], port: +value[1] })
            }
            opt.name = 'mymaster'
        } else {
            if (dbs[0].indexOf(":") === -1) {
                console.warn("redis decodeUrl fail,please check dbLog.json,ip is not ':'")
                return
            }
            let uri = dbs[0].split(":")
            opt.host = uri[0]
            opt.port = +uri[1]
        }
        return opt
    }
    constructor(private readonly configService: ConfigService) {
        // this.client = new Redis(this.configService.redis);
        this.client = new Redis(this.decodeUrl("redis://:DMb03mNHf3QAbJs4dPNOU21Qi46@redis.zk2x.com:27380,redis.zk2x.com:27381,redis.zk2x.com:27382/15"))
        this.cacheKeys = new CacheKeys();
    }

    async getUser(userID): Promise<User> {
        const cacheKey = util.format(this.cacheKeys.user, userID);
        const userStr = await this.client.get(cacheKey);
        if (!userStr) {
            return null;
        }
        const user = JSON.parse(userStr);
        return user;
    }

    async setUser(user: User) {
        const cacheKey = util.format(this.cacheKeys.user, user.id);
        return await this.client.set(cacheKey, JSON.stringify(user), 'EX', 1 * 60 * 60);
    }

    async setSignupCode(phone: string, code: string) {
        const cacheKey = util.format(this.cacheKeys.signupCode, phone);
        return await this.client.set(cacheKey, code, 'EX', 10 * 60);
    }

    async getSignupCode(phone: string): Promise<string> {
        const cacheKey = util.format(this.cacheKeys.signupCode, phone);
        return await this.client.get(cacheKey);
    }

    async setUserToken(userID: number, token: string) {
        const cacheKey = util.format(this.cacheKeys.userToken, userID);
        const tokenMaxAge: number = this.configService.server.tokenMaxAge;
        return await this.client.set(cacheKey, token, 'EX', Math.floor(tokenMaxAge / 1000));
    }

    async getUserToken(userID: number) {
        const cacheKey = util.format(this.cacheKeys.userToken, userID);
        return await this.client.get(cacheKey);
    }

    async setPublishArticle(userID: number, article) {
        const cacheKey = util.format(this.cacheKeys.publishArticle, userID);
        return await this.client.set(cacheKey, JSON.stringify(article), 'EX', 60 * 60);
    }

    async getCategories(): Promise<Category[]> {
        const str = await this.client.get(this.cacheKeys.categories);
        if (!str) {
            return null;
        }
        return JSON.parse(str);
    }

    async setCategories(categories: Category[]) {
        return await this.client.set(this.cacheKeys.categories, JSON.stringify(categories), 'EX', 1 * 60 * 60);
    }

    async setCache(key: string, value: string, expire: number) {
        return await this.client.set(key, value, 'EX', expire);
    }

    async getCache(key: string) {
        return await this.client.get(key);
    }

    async delCache(key: string) {
        return await this.client.del(key);
    }
}