OG.shape.elec.SwitchGear = function (label) {
    OG.shape.elec.SwitchGear.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.elec.SwitchGear';
    this.label = label;
    this.DELETABLE = false;
    this.ENABLE_TO = false;
    this.CONNECT_CLONEABLE = false;
    this.LABEL_EDITABLE = false;

    this.textList = [
        {
            text: 'cable',
            label: '',
            shape: 'OG.CableShape'
        },
        {
            text: 'IPB',
            label: 'IPB',
            shape: 'OG.BusductShape'
        },
        {
            text: 'SPB',
            label: 'SPB',
            shape: 'OG.BusductShape'
        },
        {
            text: 'NSPB',
            label: 'NSPB',
            shape: 'OG.BusductShape'
        },
        {
            text: 'CRB',
            label: 'CRB',
            shape: 'OG.BusductShape'
        }
    ];
};
OG.shape.elec.SwitchGear.prototype = new OG.shape.GeomShape();
OG.shape.elec.SwitchGear.superclass = OG.shape.GeomShape;
OG.shape.elec.SwitchGear.prototype.constructor = OG.shape.elec.SwitchGear;
OG.SwitchGear = OG.shape.elec.SwitchGear;

OG.shape.elec.SwitchGear.prototype.createShape = function () {
    if (this.geom) {
        return this.geom;
    }

    this.geom = new OG.geometry.Line([-100, 0], [100, 0]);
    this.geom.style = new OG.geometry.Style({
        'cursor': 'default',
        'stroke': '#d9534f',
        'stroke-width': '3',
        'fill': 'none',
        'fill-opacity': 0
    });
    return this.geom;
};


OG.shape.elec.SwitchGear.prototype.createSubShape = function () {
    if (!this.data) {
        return;
    }

    this.sub = [
        {
            shape: new OG.TextShape(this.data['PJT_SQ']),
            width: '100%',
            height: '15px',
            right: '0px',
            top: '-25px',
            style: {
                'font-size': 12,
                'font-color': 'red',
                'text-anchor': 'end'
            }
        }
    ];

    return this.sub;
};


OG.shape.elec.SwitchGear.prototype.createContextMenu = function () {
    var me = this;
    this.contextMenu = {
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