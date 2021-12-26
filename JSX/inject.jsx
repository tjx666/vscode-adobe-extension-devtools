(function () {
    function print(str) {
        var file = new File(__output_file__);
        file.open('a');
        file.encoding = 'UTF-8';
        file.write(str);
        file.close();
    }

    function println(str) {
        print(str + '\n');
    }

    // ${executeScriptCode}
})();
