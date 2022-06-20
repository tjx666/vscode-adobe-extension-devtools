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

export {
    uuidV4,
    pathExists,
    getFileNameWithoutExt,
    toFixed,
    escapeStringAppleScript,
    dateFormat,
    once,
};
