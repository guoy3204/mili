
## 👉 依赖的软件
| 软件 | 版本|  
|:---------|:-------:|
| nginx  |  1.17.1 |
| node.js     |  8.4.0 |
| mysql  |  5.6.35 |
| redis  |  4.0.1 |

## ⚙️ 配置
### 配置hosts
127.0.0.1 local.cms.com  

### 配置nginx 
请参考如下配置, 请修改日志目录

```
upstream cmsAPI {
    server 127.0.0.1:9905;
}

upstream cmsStatic {
    server 127.0.0.1:9906;
}

server {
    listen       80;
    server_name dev.cms.com;

    access_log /your/path/logs/cms.access.log;
    error_log /your/path/logs/cms.error.log;

    location /js  {
        proxy_pass  http://cmsStatic;
        proxy_set_header   Host             $host;
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
    }

    location /styles  {
        proxy_pass  http://cmsStatic;
        proxy_set_header   Host             $host;
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
    }

    location /images  {
        proxy_pass  http://cmsStatic;
        proxy_set_header   Host             $host;
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
    }

    location /fonts  {
        proxy_pass  http://cmsStatic;
        proxy_set_header   Host             $host;
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
    }

    location /sockjs-node {
        proxy_pass http://cmsStatic;
        proxy_read_timeout 3600s;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location /webpack-dev-server {
        proxy_pass  http://cmsStatic;
        proxy_set_header   Host             $host;
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
    }

    location /api/v1 {
        proxy_pass  http://cmsAPI;
        proxy_set_header   Host             $host;
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_set_header   x-forwarded-proto  https;
    }
    
    location / {
        proxy_pass  http://cmsAPI;
        proxy_set_header   Host             $host;
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_set_header   x-forwarded-proto  https;
    }
}
```

### 配置数据库
请修改{项目目录}/src/config/cfg.default.ts 文件中mysql的配置
```
export default {
    db: {
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        ...
    },
    redis: {
        host: '127.0.0.1',
        port: 6379,
        keyPrefix: 'cms:',
        family: 4, // 4 (IPv4) or 6 (IPv6)
        password: '',
        db: 0,
    },
    ...
}
```

## 🚀 安装
### 安装依赖的模块
进入项目目录，输入命令
```
npm install
```

进入 {项目目录}/pc 目录下，输入命令
```
npm install
```

再输入
```
npm start
```

## 🚕 运行
### 配置vscode
```
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Launch Program",
            "runtimeArgs": [
                "--nolazy",
                "-r",
                "ts-node/register",
            ],
            "args": [
                "${workspaceFolder}/src/main.ts",
                "|",
                "./node_modules/.bin/pino-pretty"
            ],
            "env": {
                "NODE_ENV": "development"
            },
            "sourceMaps": true,
            "cwd": "${workspaceFolder}",
            "protocol": "inspector",
            "console": "integratedTerminal",
            "internalConsoleOptions": "neverOpen"
        }
    ]
}
```

### 通过vscode来运行
按快捷键`F5`来运行项目

### 本地访问
首页: http://local.cmd.com    
管理后台: http://local.cmd.com/admin/  
用户名: admin  
密码: 123456

### 线上体验
 
 