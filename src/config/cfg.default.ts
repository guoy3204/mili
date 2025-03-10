import * as path from 'path';

const domain = 'local.cms.com';
const port = 9905;
const url = `http://${domain}:${port}`;

const mDomain = 'm-dev.cms.com';
const mURL = `http://${mDomain}`;

const staticURL = `http://local.cms.com:9906`;

export default {
    db: {
        type: 'mysql',
        host: '192.168.0.133',
        port: 8889,
        charset: 'utf8mb4',
        username: 'root',
        password: 'root',
        database: 'cms',
        synchronize: false,
        entities: [path.join(__dirname, '../entity/**/*.entity{.ts,.js}')],
        logging: 'all', // query, error, schema, warn, info, log, all
        logger: 'simple-console',
        maxQueryExecutionTime: 500, // 单位毫秒
    },
    redis: {
        host: '192.168.0.133',
        port: 6379,
        keyPrefix: 'cms:',
        family: 4, // 4 (IPv4) or 6 (IPv6)
        password: '',
        db: 0,
    },
    static: {
        staticURL,
        cssPath: `${staticURL}/styles`,
        jsPath: `${staticURL}/js`,
        imgPath: `${staticURL}/images`,
        fontPath: `${staticURL}/fonts`,
        uploadImgURL: ``, //开发环境为空，为空默认使用本地文件服务器
        imgFormat: ['jpg', 'jpeg', 'png'],
        imgMaxSize: 3 * 1024 * 1024,
        imgMaxSizeError: '图片大小不能超过%sM',
        userLevelChapterURL: 'https://www.cms.com/books/90/chapters/1515', // 用户等级在《如何使用点点》中的章节url
    },
    statsD: {
        host: '192.168.0.133',
        port: 8125,
        prefix: 'cms_',
        protocol: 'udp',
    },
    server: {
        siteName: '点点',
        companyName: '点点科技有限公司',
        icp: 'ICP备12345678号',
        url,
        mURL,
        domain,
        mDomain,
        allowOrigins: [],
        port,
        apiPrefix: '/api/v1',
        passSalt: 'u5o2law8xi',
        tokenName: 'token',
        tokenSecret: 'ema21ioirJikXIkLCJugmeiv',
        tokenMaxAge: 7 * 24 * 60 * 60 * 1000, // token多久过期，单位毫秒
        cookieSecret: 'aiwyskgun7cwimjq',
        rateLimitWindowMs: 15 * 60 * 1000, // 时间窗口，单位毫秒
        rateLimitMax: 1000, // limit each IP to rateLimitMax requests per windowMs
        swaggerPrefix: 'api/v1',
        postEmail: 'xiaoce@cms.com',
    },
    OSS: {
        type: "fs",
        uploadPrefix: 'local', // 上传路径加个前缀
        uploadFieldName: 'file',
        expiration: 6, // 上传凭证过期时间, 单位小时 
        callbackSecretToken: '123456789', // 用来验证是否是阿里云发过来的回调

        imgMaxSize: 3 * 1024 * 1024, // 设置上传图片的大小限制, 单位M
        imgMaxSizeError: '图片大小要小于%sM', // 图片大小超过限制时的提示 
        aliyun: {
            accessKeyID: '',
            accessKeySecret: '',
            bucket: '',
            region: '',
            uploadActionURL: '',
        }
    },
    aliyunSMS: {
        accessKeyID: '',
        accessKeySecret: '',
        signName: '',
        templateCode: '',
    },
    geetestCaptcha: {
        geetest_id: '',
        geetest_key: '',
    },
    oauth: {
        clientID: '',
        clientSecret: '',
        authorizeURL: 'https://oauth.com/login/oauth/authorize?scope=user&client_id=%s',
        accessTokenURL: 'https://oauth.com/login/oauth/access_token',
        userInfoURL: 'https://api.oauth.com/user?access_token=%s',
    },
    weibo: {
        appKey: '',
        appSecret: '',
        state: '', // 这个参数可用于防止跨站请求伪造（CSRF）攻击
        serverURL: url,
        redirectURL: '',
        // tslint:disable-next-line:max-line-length
        authorizeURL: 'https://api.weibo.com/oauth2/authorize?state=%s&scope=email&client_id=%s&response_type=code&redirect_uri=%s',
        // tslint:disable-next-line:max-line-length
        accessTokenURL: 'https://api.weibo.com/oauth2/access_token?client_id=%s&client_secret=%s&grant_type=authorization_code&redirect_uri=%s&code=%s',
        userInfoURL: 'https://api.weibo.com/2/users/show.json?access_token=%s&uid=%s',
    },
};
