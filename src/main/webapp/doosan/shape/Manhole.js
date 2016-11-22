OG.shape.elec.Manhole = function (image, label) {
    OG.shape.elec.Manhole.superclass.call(this, image, label);

    this.SHAPE_ID = 'OG.shape.elec.Manhole';
    this.label = label;
    this.CONNECT_CLONEABLE = false;
    this.LABEL_EDITABLE = false;

    if (!image) {
        this.image = 'resources/images/elec/manhole.svg'
    }

    this.textList = [
        {
            text: 'Raceway',
            label: '',
            shape: 'OG.RacewayShape'
        }
    ];
};
OG.shape.elec.Manhole.prototype = new OG.shape.ImageShape();
OG.shape.elec.Manhole.superclass = OG.shape.ImageShape;
OG.shape.elec.Manhole.prototype.constructor = OG.shape.elec.Manhole;
OG.Manhole = OG.shape.elec.Manhole;

OG.shape.elec.Manhole.prototype.createSubShape = function () {
    if (!this.data) {
        return;
    }

    this.sub = [

    ];
    return this.sub;
};


OG.shape.elec.Manhole.prototype.createContextMenu = function () {
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