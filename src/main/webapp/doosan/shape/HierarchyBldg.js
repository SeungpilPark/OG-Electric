OG.shape.HierarchyBldg = function (label) {
    OG.shape.HierarchyBldg.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.HierarchyBldg';
    this.label = label;
    this.CONNECT_CLONEABLE = false;
    this.LABEL_EDITABLE = false;
    this.CONNECTABLE = false;
};
OG.shape.HierarchyBldg.prototype = new OG.shape.HorizontalPoolShape();
OG.shape.HierarchyBldg.superclass = OG.shape.HorizontalPoolShape;
OG.shape.HierarchyBldg.prototype.constructor = OG.shape.HierarchyBldg;
OG.HierarchyBldg = OG.shape.HierarchyBldg;