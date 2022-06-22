(function () {
    /** @type {string[]} */
    var charIDList = __charIDList__;
    var typeIDList = [];
    for (var i = 0; i < charIDList.length; i++) {
        typeIDList.push(charIDToTypeID(charIDList[i]));
    }
    print(JSON.stringify(typeIDList));
})();
