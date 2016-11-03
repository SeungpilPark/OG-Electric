OG.shape.NMLoad = function (label) {
    OG.shape.NMLoad.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.NMLoad';
    this.label = label;
    this.CONNECT_CLONEABLE = false;
    this.LABEL_EDITABLE = false;
    this.ENABLE_FROM = false;
};
OG.shape.NMLoad.prototype = new OG.shape.Load();
OG.shape.NMLoad.superclass = OG.shape.Load;
OG.shape.NMLoad.prototype.constructor = OG.shape.NMLoad;
OG.NMLoad = OG.shape.NMLoad;

OG.shape.NMLoad.prototype.createShape = function () {
    var geom1, geom2, geomCollection = [];
    if (this.geom) {
        return this.geom;
    }

    geom1 = new OG.geometry.Circle([50, 50], 50);
    geom1.style = new OG.geometry.Style({
        "stroke-width": 4
    });

    geom2 = new OG.geometry.Polygon([
        [20, 75],
        [40, 30],
        [60, 60],
        [80, 20],
        [60, 75],
        [40, 50]

    ]);
    geom2.style = new OG.geometry.Style({
        "fill": "black",
        "fill-opacity": 1
    });

    geomCollection.push(geom1);
    geomCollection.push(geom2);

    this.geom = new OG.geometry.GeometryCollection(geomCollection);
    this.geom.style = new OG.geometry.Style({
        'label-position': 'bottom',
        'font-size': 10,
        'label-width':200
    });

    return this.geom;
};