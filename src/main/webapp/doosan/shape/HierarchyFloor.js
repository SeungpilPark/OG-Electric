OG.shape.HierarchyFloor = function (label) {
    OG.shape.HierarchyFloor.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.HierarchyFloor';
    this.label = label;
    this.CONNECT_CLONEABLE = false;
    this.LABEL_EDITABLE = false;
    this.CONNECTABLE = false;
};
OG.shape.HierarchyFloor.prototype = new OG.shape.HorizontalPoolShape();
OG.shape.HierarchyFloor.superclass = OG.shape.HorizontalPoolShape;
OG.shape.HierarchyFloor.prototype.constructor = OG.shape.HierarchyFloor;
OG.HierarchyFloor = OG.shape.HierarchyFloor;