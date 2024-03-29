(function setup() {
    'use strict';

    // 开启 debug 模式
    $.level = 2;
    // 开启严格模式禁止对对象只读属性进行写操作
    $.strict = true;

    // 设置 JSX engin 内存缓存 100MB
    const MAX_MEMORY_CACHE_SIZE = 1024 * 1024 * 100;
    // 默认是 100k
    if ($.memCache < MAX_MEMORY_CACHE_SIZE) {
        $.memCache = MAX_MEMORY_CACHE_SIZE;
    }

    // reset API entry
    $.global.vscDevtools = {};

    // define some global variable
    $.global.s2t = stringIDToTypeID;
    $.global.c2t = charIDToTypeID;

    // prettier-ignore
    try {
        // polyfill
        // @include '../../polyfill/json2.jsx'
        // @include '../../polyfill/Array.jsx'
        // @include '../../polyfill/Object.jsx'

        // utils
        // @include '../../utils/exception.jsx'
        // @include './externalObjects.jsx'
        // @include './xmp.jsx'
        // @include './descriptorInfo.jsx'
        // @include './layer.jsx'
    } catch(error) {
        alert('load modules error!\n' + $.global.vscDevtools.exception.getErrorDetails(error));
    }
})();
