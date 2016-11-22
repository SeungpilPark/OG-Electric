OG.shape.elec.Location = function (label) {
    OG.shape.elec.Location.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.elec.Location';
    this.label = label;
    this.CONNECT_CLONEABLE = false;
    this.LABEL_EDITABLE = false;

    this.textList = [
        {
            text: 'Raceway',
            label: '',
            shape: 'OG.RacewayShape'
        }
    ];
};
OG.shape.elec.Location.prototype = new OG.shape.GeomShape();
OG.shape.elec.Location.superclass = OG.shape.GeomShape;
OG.shape.elec.Location.prototype.constructor = OG.shape.elec.Location;
OG.Location = OG.shape.elec.Location;
OG.shape.elec.Location.prototype.createShape = function () {
    if (this.geom) {
        return this.geom;
    }

    this.geom = new OG.geometry.Rectangle([0, 0], 100, 100);
    this.geom.style = new OG.geometry.Style({
        'fill-r': 1,
        'fill-cx': .1,
        'fill-cy': .1,
        "stroke-width": 1.2,
        fill: 'r(.1, .1)#428bca-#ffffff',
        'fill-opacity': 1,
        r: '10'
    });

    return this.geom;
};


OG.shape.elec.Location.prototype.createSubShape = function () {
    if (!this.data) {
        return;
    }

    this.sub = [

    ];
    return this.sub;
};

OG.shape.elec.Location.prototype.createContextMenu = function () {
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