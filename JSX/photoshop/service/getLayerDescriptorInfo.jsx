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
    var layerHelper = vscDevtools.layer;

    if (app.documents.length === 0 || activeDocument.activeLayer === undefined) return;

    var layerDesc = layerHelper.getLayerDesc(activeDocument.activeLayer.id);
    var layerDescJSON = JSON.stringify(descriptorInfo.getProperties(layerDesc), null, 4);
    print(layerDescJSON);
})();
