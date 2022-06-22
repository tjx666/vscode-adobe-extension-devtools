(function () {
    /** @type {string[]} */
    var typeIDList = __typeIDList__;
    var charIDList = [];
    for (var i = 0; i < typeIDList.length; i++) {
        charIDList.push(typeIDToCharID(typeIDList[i]));
    }
    print(JSON.stringify(charIDList));
})();
