(function setup() {
    'use strict';

    // 开启 debug 模式
    $.level = 2;
    // 开启严格模式禁止对对象只读属性进行写操作
    $.strict = true;

    // 设置 JSX engin 内存缓存 100MB
    var MAX_MEMORY_CACHE_SIZE = 1024 * 1024 * 100;
    // 默认是 100k
    if ($.memCache < MAX_MEMORY_CACHE_SIZE) {
        $.memCache = MAX_MEMORY_CACHE_SIZE;
    }

    // 回收资源
    function recycle() {
        if ($.global.vscDevtools) {
            $.global.vscDevtools = undefined;
            $.gc();
        }
    }
    recycle();

    // reset API entry
    $.global.vscDevtools = {};

    // prettier-ignore
    try {
        // polyfill
        // @include '../../polyfill/json2.jsx'
        // @include '../../polyfill/Array.jsx'

        // utils
        // @include '../../utils/exception.jsx'
    } catch(error) {
        alert('load modules error!\n' + $.global.vscDevtools.exception.getErrorDetails(error));
        recycle();
    }
})();
