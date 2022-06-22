(function () {
    /** @type {string[]} */
    var charIDList = __charIDList__;
    var stringIDList = [];
    for (var i = 0; i < charIDList.length; i++) {
        stringIDList.push(typeIDToStringID(charIDToTypeID(charIDList[i])));
    }
    print(JSON.stringify(stringIDList));
})();
