OG.shape.Location = function (label) {
    OG.shape.Location.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.Location';
    this.label = label;
    this.CONNECT_CLONEABLE = false;
    this.LABEL_EDITABLE = false;
};
OG.shape.Location.prototype = new OG.shape.GeomShape();
OG.shape.Location.superclass = OG.shape.GeomShape;
OG.shape.Location.prototype.constructor = OG.shape.Location;
OG.Location = OG.shape.Location;
OG.shape.Location.prototype.createShape = function () {
    if (this.geom) {
        return this.geom;
    }

    this.geom = new OG.geometry.Rectangle([0, 0], 100, 100);
    this.geom.style = new OG.geometry.Style({
        'fill-r': 1,
        'fill-cx': .1,
        'fill-cy': .1,
        "stroke-width": 1.2,
        fill: 'r(.1, .1)#FFFFFF-#FFFFCC',
        'fill-opacity': 1,
        r: '10'
    });

    return this.geom;
};