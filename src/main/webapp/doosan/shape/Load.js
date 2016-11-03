OG.shape.Load = function (label) {
    OG.shape.Load.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.Load';
    this.label = label;
};
OG.shape.Load.prototype = new OG.shape.GeomShape();
OG.shape.Load.superclass = OG.shape.GeomShape;
OG.shape.Load.prototype.constructor = OG.shape.Load;
OG.Load = OG.shape.Load;