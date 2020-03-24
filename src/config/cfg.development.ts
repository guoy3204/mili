export default {
    db: {
        type: 'mysql',
        host: 'localhost',
        port: 8889,
        username: 'root',
        password: 'root',
    },
    redis: {
        host: 'redis.zk2x.com',
        port: 6379,
        keyPrefix: 'cms:',
        family: 4, // 4 (IPv4) or 6 (IPv6)
        password: 'DMb03mNHf3QAbJs4dPNOU21Qi46',
        db: 0,
    }
};
