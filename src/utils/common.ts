import fs from 'fs/promises';
import { default as pathUtils } from 'path';
import { constants as FS_CONSTANTS } from 'fs';

/**
 * generate uuid of v4 format
 * @see https://stackoverflow.com/a/21963136/11027903
 * @returns {string}
 */
function uuidV4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function pathExists(path: string) {
    return fs
        .access(path, FS_CONSTANTS.F_OK)
        .then(() => true)
        .catch(() => false);
}

function getFileNameWithoutExt(path: string) {
    const basename = pathUtils.basename(path);
    return basename.slice(0, basename.lastIndexOf(pathUtils.extname(path)));
}

/**
 * like Number.prototype.toFixed, but will remove redundant zero and round decimal
 * @param {number} num
 * @param {number} [fractionDigits=3]
 */
function toFixed(num: number, fractionDigits = 3) {
    const numStr = num.toString(10);
    const dotIndex = numStr.indexOf('.');
    if (dotIndex === -1) return num;

    if (fractionDigits === undefined) fractionDigits = 3;
    const multiplex = Math.pow(10, fractionDigits);
    return Math.round(num * multiplex) / multiplex;
}

function escapeStringAppleScript(string: string) {
    return string.replace(/[\\"]/g, '\\$&');
}

function dateFormat(date: Date, formatStr: string, isUtc: boolean) {
    const getPrefix = isUtc ? 'getUTC' : 'get';
    return formatStr.replace(/%[YmdHMS]/g, (m: string) => {
        let replaceStrNum: number;
        switch (m) {
            case '%Y':
                return String(date[`${getPrefix}FullYear`]()); // no leading zeros required
            case '%m':
                replaceStrNum = 1 + date[`${getPrefix}Month`]();
                break;
            case '%d':
                replaceStrNum = date[`${getPrefix}Date`]();
                break;
            case '%H':
                replaceStrNum = date[`${getPrefix}Hours`]();
                break;
            case '%M':
                replaceStrNum = date[`${getPrefix}Minutes`]();
                break;
            case '%S':
                replaceStrNum = date[`${getPrefix}Seconds`]();
                break;
            default:
                return m.slice(1); // unknown code, remove %
        }
        // add leading zero if required
        return `0${replaceStrNum}`.slice(-2);
    });
}

// eslint-disable-next-line @typescript-eslint/ban-types
function once<F extends Function>(f: F) {
    let executed = false;
    let result: any;
    const functionName = f.name;
    const temp = {
        [functionName]: function () {
            if (executed) return result;
            else {
                executed = true;
                result = f();
                return result;
            }
        },
    };
    return temp[functionName];
}

function arrangeKeys<T extends object>(
    target: T,
    frontKeys: Array<keyof T> = [],
    backKeys: Array<keyof T> = [],
) {
    const keySet = new Set<keyof T>([...frontKeys, ...backKeys]);
    const result: Record<keyof T, any> = {} as any;

    function putKeys(keys: Array<keyof T>) {
        for (const key of keys) {
            if (Object.prototype.hasOwnProperty.call(target, key)) {
                result[key] = target[key];
            }
        }
    }

    if (frontKeys.length) {
        putKeys(frontKeys);
    }

    for (const [key, value] of Object.entries(target) as Array<[keyof T, any]>) {
        if (!keySet.has(key)) {
            result[key] = value;
        }
    }

    if (backKeys.length) {
        putKeys(backKeys);
    }

    return result;
}

function parsePropPathStrToArray(propPathStr: string) {
    return propPathStr
        .replaceAll(/^\[([^\r\n]*?)\]/g, '$1')
        .replaceAll(/\[([^\r\n]*?)\]/g, '.$1')
        .split('.');
}

function getIn<T>(object: object, path: string | Array<string | number>, defaultValue?: T): T {
    if (!(Array.isArray(path) || typeof path === 'string')) {
        throw new TypeError(`The path: ${path} is neither array nor string!`);
    }

    let propPath;
    if (Array.isArray(path)) {
        propPath = path;
    } else {
        // 特殊情况例如：'[1].b'，所以字符串头部的中括号需要特殊处理
        propPath = parsePropPathStrToArray(path);
    }

    let value: any = object;
    while (propPath.length && value !== undefined && value !== null) {
        const frontProp = propPath.shift()!;
        value = value[frontProp];
    }

    // getIn({ a: null }, 'a', 6) 返回 null
    // lodash _.get(null, [], 6) 返回 6 应该是 bug
    if (propPath.length === 0 && value === null) return value;

    return value ?? defaultValue;
}

export default getIn;

export {
    uuidV4,
    pathExists,
    getFileNameWithoutExt,
    toFixed,
    escapeStringAppleScript,
    dateFormat,
    once,
    arrangeKeys,
    getIn,
};
