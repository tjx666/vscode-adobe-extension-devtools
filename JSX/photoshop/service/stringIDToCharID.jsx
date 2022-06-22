(function () {
    /** @type {string[]} */
    var stringIDList = __stringIDList__;
    var charIDList = [];
    for (var i = 0; i < stringIDList.length; i++) {
        charIDList.push(typeIDToCharID(stringIDToTypeID(stringIDList[i])));
    }
    print(JSON.stringify(charIDList));
})();
