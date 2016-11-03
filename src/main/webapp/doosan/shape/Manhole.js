OG.shape.Manhole = function (label) {
    OG.shape.Manhole.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.Location';
    this.label = label;
    this.CONNECT_CLONEABLE = false;
    this.LABEL_EDITABLE = false;
};
OG.shape.Manhole.prototype = new OG.shape.RaceWay();
OG.shape.Manhole.superclass = OG.shape.RaceWay;
OG.shape.Manhole.prototype.constructor = OG.shape.Manhole;
OG.Manhole = OG.shape.Manhole;
OG.shape.Manhole.prototype.createShape = function () {
    var geom1, geom2, geom3, geomCollection = [];
    if (this.geom) {
        return this.geom;
    }

    geom1 = new OG.geometry.Circle([50, 50], 50);
    geom1.style = new OG.geometry.Style({
        "stroke-width": 3
    });

    geom2 = new OG.geometry.Line([25, 25], [75, 75]);
    geom2.style = new OG.geometry.Style({
        "stroke-width": 5
    });

    geom3 = new OG.geometry.Line([25, 75], [75, 25]);
    geom3.style = new OG.geometry.Style({
        "stroke-width": 5
    });

    geomCollection.push(geom1);
    geomCollection.push(geom2);
    geomCollection.push(geom3);

    this.geom = new OG.geometry.GeometryCollection(geomCollection);
    this.geom.style = new OG.geometry.Style({
        'label-position': 'bottom'
    });

    return this.geom;
};