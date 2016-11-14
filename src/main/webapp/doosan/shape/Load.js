OG.shape.elec.Load = function (label) {
    OG.shape.elec.Load.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.elec.Load';
    this.label = label;
};
OG.shape.elec.Load.prototype = new OG.shape.GeomShape();
OG.shape.elec.Load.superclass = OG.shape.GeomShape;
OG.shape.elec.Load.prototype.constructor = OG.shape.elec.Load;
OG.Load = OG.shape.elec.Load;