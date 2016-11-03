OG.shape.BLDG = function (label) {
    OG.shape.BLDG.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.BLDG';
    this.label = label;
    this.CONNECT_CLONEABLE = false;
    this.LABEL_EDITABLE = false;
    this.CONNECTABLE = false;
};
OG.shape.BLDG.prototype = new OG.shape.GroupShape();
OG.shape.BLDG.superclass = OG.shape.GroupShape;
OG.shape.BLDG.prototype.constructor = OG.shape.BLDG;
OG.BLDG = OG.shape.BLDG;
OG.shape.BLDG.prototype.createShape = function () {
    if (this.geom) {
        return this.geom;
    }

    this.geom = new OG.geometry.Rectangle([0, 0], 100, 100);
    this.geom.style = new OG.geometry.Style({
        'r': 6,
        'fill': '#ffffff',
        'fill-opacity': 0,
        "vertical-align": "top",
        "text-anchor": "start",
        'stroke': 'black'
    });
    return this.geom;
};