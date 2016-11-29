OG.shape.elec.Backdoor = function (image, label) {
    OG.shape.elec.Backdoor.superclass.call(this, image, label);

    this.SHAPE_ID = 'OG.shape.elec.Backdoor';
    this.label = label;
    this.CONNECT_CLONEABLE = false;
    this.LABEL_EDITABLE = false;
    this.MOVABLE = false;
    this.CONNECTABLE = false;
    this.SELECTABLE = false;
    this.RESIZABLE = false;
};
OG.shape.elec.Backdoor.prototype = new OG.shape.ImageShape();
OG.shape.elec.Backdoor.superclass = OG.shape.ImageShape;
OG.shape.elec.Backdoor.prototype.constructor = OG.shape.elec.Backdoor;
OG.Backdoor = OG.shape.elec.Backdoor;