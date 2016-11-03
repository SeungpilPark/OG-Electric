OG.shape.RaceWay = function (label) {
    OG.shape.RaceWay.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.Location';
    this.label = label;
    this.CONNECT_CLONEABLE = false;
    this.LABEL_EDITABLE = false;
};
OG.shape.RaceWay.prototype = new OG.shape.GeomShape();
OG.shape.RaceWay.superclass = OG.shape.GeomShape;
OG.shape.RaceWay.prototype.constructor = OG.shape.RaceWay;
OG.RaceWay = OG.shape.RaceWay;