import * as url from 'url';
import * as fs from "fs";
import * as path from 'path';

export const strToPage = (pageStr: string) => {
    let page: number = parseInt(pageStr, 10);
    if (isNaN(page)) {
        page = 1;
    }
    return page;
};

export const urlBaseName = (urlStr: string) => {
    const pathname = url.parse(urlStr).pathname;
    const pathArr = pathname.split('/');
    return pathArr[pathArr.length - 1];
};

export const extName = (urlStr: string) => {
    let ext = '';
    const index = urlStr.lastIndexOf('.');
    if (index >= 0) {
        ext = urlStr.substr(index);
    }
    return ext;
};

export const clampNumber = (num: number, min: number, max: number) => {
    if (typeof num === 'undefined') {
        return min;
    }
    num = Math.min(num, max);
    num = Math.max(num, min);
    return num;
};

export const getContentTypeFromHeaders = (headers): string => {
    headers || {};
    for (const key in headers) {
        if (key.toLocaleLowerCase() === 'content-type') {
            return headers[key];
        }
    }
    return '';
};

export function createDir(dirPath: string) {
    let parentPath = path.dirname(dirPath);
    if (!fs.existsSync(parentPath)) {
        createDir(parentPath);
    }
    fs.mkdirSync(dirPath);
    return true;
}
