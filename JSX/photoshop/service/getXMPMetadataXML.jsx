(function () {
    if (typeof __adobeExtensionDevtools__ === 'undefined') {
        var indexFile = new File($.fileName);
        indexFile.changePath('../../utils/index.jsx');
        $.evalFile(indexFile);
        print = function (str) {
            $.writeln(str);
        };
    }

    if (app.documents.length === 0 || activeDocument.activeLayer === undefined) return;

    var xmpMetadata = activeDocument.xmpMetadata.rawData;
    print(
        JSON.stringify({
            xmpMetadata: xmpMetadata,
        }),
    );
})();
