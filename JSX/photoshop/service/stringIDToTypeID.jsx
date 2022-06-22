(function () {
    /** @type {string[]} */
    var stringIDList = __stringIDList__;
    var typeIDList = [];
    for (var i = 0; i < stringIDList.length; i++) {
        typeIDList.push(stringIDToTypeID(stringIDList[i]));
    }
    print(JSON.stringify(typeIDList));
})();
