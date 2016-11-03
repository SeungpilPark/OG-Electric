OG.shape.SwitchGear = function (label) {
    OG.shape.SwitchGear.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.SwitchGear';
    this.label = label;
    this.DELETABLE = false;
    this.ENABLE_TO = false;
    this.CONNECT_CLONEABLE = false;
    this.LABEL_EDITABLE = false;
};
OG.shape.SwitchGear.prototype = new OG.shape.GeomShape();
OG.shape.SwitchGear.superclass = OG.shape.GeomShape;
OG.shape.SwitchGear.prototype.constructor = OG.shape.SwitchGear;
OG.SwitchGear = OG.shape.SwitchGear;

OG.shape.SwitchGear.prototype.createShape = function () {
    if (this.geom) {
        return this.geom;
    }

    var geomCollection = [];
    if (this.geom) {
        return this.geom;
    }

    var line1 = new OG.geometry.Line([-100, 10], [100, 10]);
    var line2 = new OG.geometry.Line([-100, -10], [100, -10]);
    geomCollection.push(line1);
    geomCollection.push(line2);

    this.geom = new OG.geometry.GeometryCollection(geomCollection);

    this.geom.style = new OG.geometry.Style({
        'cursor': 'default',
        'stroke': '#d9534f',
        'stroke-width': '3',
        'fill': 'none',
        'fill-opacity': 0,
        'font-size': 20,
        'text-anchor': 'middle'
    });
    return this.geom;
};