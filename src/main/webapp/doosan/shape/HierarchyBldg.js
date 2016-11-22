OG.shape.elec.HierarchyBldg = function (label) {
    OG.shape.elec.HierarchyBldg.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.elec.HierarchyBldg';
    this.label = label;
    this.CONNECT_CLONEABLE = false;
    this.LABEL_EDITABLE = false;
    this.CONNECTABLE = false;
};
OG.shape.elec.HierarchyBldg.prototype = new OG.shape.HorizontalPoolShape();
OG.shape.elec.HierarchyBldg.superclass = OG.shape.HorizontalPoolShape;
OG.shape.elec.HierarchyBldg.prototype.constructor = OG.shape.elec.HierarchyBldg;
OG.HierarchyBldg = OG.shape.elec.HierarchyBldg;

OG.shape.elec.HierarchyBldg.prototype.createShape = function () {
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


OG.shape.elec.HierarchyBldg.prototype.createContextMenu = function () {
    var me = this;
    this.contextMenu = {
        'delete': true,
        'format': true,
        'text': true,
        'bringToFront': true,
        'sendToBack': true,
        'property': {
            name: '정보보기', callback: function () {
                $(me.currentCanvas.getRootElement()).trigger('showProperty', [me.currentElement]);
            }
        }
    };
    return this.contextMenu;
};