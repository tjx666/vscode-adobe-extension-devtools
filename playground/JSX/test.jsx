(function(){
    var l = app.project.activeItem.layers[1];
    var comp = app.project.activeItem;
    $.writeln(app.project.activeItem.layers[1].property(1) instanceof PropertyBase);
})();