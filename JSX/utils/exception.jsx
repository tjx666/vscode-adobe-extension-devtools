vscDevtools.exception = (function () {
    function getErrorDetails(e) {
        const name = e.name;
        const line = e.line;
        const fileName = e.fileName;
        const description = e.description;
        const sourceLine = e.source.split(/[\r\n]/)[line - 1] || '';
        var errorDetails = name + ' ' + e.number + ': ' + description + '\nat:';
        errorDetails += '\n  File: ' + fileName + ':' + line;
        errorDetails +=
            '\n  Line: ' +
            line +
            ' -> ' +
            (sourceLine.length < 300 ? sourceLine : sourceLine.substring(0, 300) + '...');

        if (e.start) {
            errorDetails += '\nBug: ' + e.source.substring(e.start - 1, e.end);
        }

        return errorDetails;
    }

    return {
        getErrorDetails: getErrorDetails,
    };
})();
