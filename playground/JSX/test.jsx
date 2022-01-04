(function(){
    /** @type {AVLayer} */
    var l = app.project.activeItem.layers[1];
    for (var i = 1; i <= l.numProperties; i++) {
        $.writeln(l.property(i).matchName);
    }
})();