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

    var ref = new ActionReference();
    ref.putEnumerated(
        s2t('application'),
        s2t('ordinal'),
        s2t('targetEnum'),
    );
    var appDesc = executeActionGet(ref);

    var appDescJSON = JSON.stringify(
        descriptorInfo.getProperties(appDesc, {
            filterKeys: ['systemInfo'],
        }),
        null,
        4,
    );
    print(appDescJSON);
})();
