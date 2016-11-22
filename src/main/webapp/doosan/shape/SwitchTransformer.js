OG.shape.elec.SwitchTransformer = function (label) {
    OG.shape.elec.SwitchTransformer.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.elec.SwitchTransformer';
    this.label = label;
    this.DELETABLE = false;
    this.ENABLE_TO = false;
    this.CONNECT_CLONEABLE = false;
    this.LABEL_EDITABLE = false;
};
OG.shape.elec.SwitchTransformer.prototype = new OG.shape.GeomShape();
OG.shape.elec.SwitchTransformer.superclass = OG.shape.GeomShape;
OG.shape.elec.SwitchTransformer.prototype.constructor = OG.shape.elec.SwitchTransformer;
OG.SwitchTransformer = OG.shape.elec.SwitchTransformer;

OG.shape.elec.SwitchTransformer.prototype.createShape = function () {
    var geom1, geom2, geomCollection = [];
    if (this.geom) {
        return this.geom;
    }

    geom1 = new OG.geometry.Circle([50, 50], 50);
    geom2 = new OG.geometry.Circle([50, 125], 50);

    geomCollection.push(geom1);
    geomCollection.push(geom2);

    this.geom = new OG.geometry.GeometryCollection(geomCollection);
    this.geom.style = new OG.geometry.Style({
        'label-position': 'bottom',
        'label-width': 300,
        'vertical-align': 'top'
    });

    return this.geom;
};
