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

export { uuidV4 };
