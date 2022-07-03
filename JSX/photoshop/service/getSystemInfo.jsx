(function () {
    if (typeof __adobeExtensionDevtools__ === 'undefined') {
        var indexFile = new File($.fileName);
        indexFile.changePath('../../utils/index.jsx');
        $.evalFile(indexFile);
        print = function (str) {
            $.writeln(str);
        };
    }

    var ref = new ActionReference();
    ref.putProperty(s2t('property'), s2t('systemInfo'));
    ref.putEnumerated(s2t('application'), s2t('ordinal'), s2t('targetEnum'));
    var appDesc = executeActionGet(ref);
    var systemInfo = appDesc.getString(s2t('systemInfo'));
    print(JSON.stringify({
        systemInfo: systemInfo
    }));
})();
