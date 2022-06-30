(function () {
    if (typeof __adobeExtensionDevtools__ === 'undefined') {
        var indexFile = new File($.fileName);
        indexFile.changePath('../../utils/index.jsx');
        $.evalFile(indexFile);
        print = function (str) {
            $.writeln(str);
        };
    }

    var descriptorInfo = vscDevtools.descriptorInfo;

    if (app.documents.length === 0 || activeDocument.activeLayer === undefined) return;

    var docRef = new ActionReference();
    docRef.putIdentifier(s2t('document'), activeDocument.id);
    var docDesc = executeActionGet(docRef);
    var docDescJSON = JSON.stringify(descriptorInfo.getProperties(docDesc), null, 4);
    print(docDescJSON);
})();
