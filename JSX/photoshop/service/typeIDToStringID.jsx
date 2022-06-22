(function () {
    /** @type {string[]} */
    var typeIDList = __typeIDList__;
    var stringIDList = [];
    for (var i = 0; i < typeIDList.length; i++) {
        stringIDList.push(typeIDToStringID(typeIDList[i]));
    }
    print(JSON.stringify(stringIDList));
})();
