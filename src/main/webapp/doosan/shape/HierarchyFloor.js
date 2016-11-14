OG.shape.elec.HierarchyFloor = function (label) {
    OG.shape.elec.HierarchyFloor.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.elec.HierarchyFloor';
    this.label = label;
    this.CONNECT_CLONEABLE = false;
    this.LABEL_EDITABLE = false;
    this.CONNECTABLE = false;
};
OG.shape.elec.HierarchyFloor.prototype = new OG.shape.HorizontalPoolShape();
OG.shape.elec.HierarchyFloor.superclass = OG.shape.HorizontalPoolShape;
OG.shape.elec.HierarchyFloor.prototype.constructor = OG.shape.elec.HierarchyFloor;
OG.HierarchyFloor = OG.shape.elec.HierarchyFloor;


OG.shape.elec.HierarchyFloor.prototype.createShape = function () {
    if (this.geom) {
        return this.geom;
    }

    this.geom = new OG.geometry.Rectangle([0, 0], 100, 100);
    this.geom.style = new OG.geometry.Style({
        'label-direction': 'vertical',
        'vertical-align' : 'top',
        'fill' : '#ffffff',
        'fill-opacity': 0,
        'title-size' : 26,
        'label-fill': '#428bca',
        'label-fill-opacity': 1,
        'font-weight': 700,
        'font-color' : 'white'
    });

    return this.geom;
};