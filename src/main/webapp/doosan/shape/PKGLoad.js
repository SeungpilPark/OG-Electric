OG.shape.elec.PKGLoad = function (label) {
    OG.shape.elec.PKGLoad.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.elec.PKGLoad';
    this.label = label;
    this.CONNECT_CLONEABLE = false;
    this.LABEL_EDITABLE = false;
    this.ENABLE_FROM = false;
};
OG.shape.elec.PKGLoad.prototype = new OG.shape.elec.Load();
OG.shape.elec.PKGLoad.superclass = OG.shape.elec.Load;
OG.shape.elec.PKGLoad.prototype.constructor = OG.shape.elec.PKGLoad;
OG.PKGLoad = OG.shape.elec.PKGLoad;

OG.shape.elec.PKGLoad.prototype.createShape = function () {
    if (this.geom) {
        return this.geom;
    }

    this.geom = new OG.geometry.Rectangle([0, 0], 100, 80);

    this.geom.style = new OG.geometry.Style({
        'label-position': 'bottom',
        'label-width': 200,
        'stroke-width': 2
    });

    return this.geom;
};


OG.shape.elec.PKGLoad.prototype.createSubShape = function () {
    this.sub = [
        {
            shape: new OG.TextShape('PKG'),
            width: '100%',
            height: '50%',
            align: 'center',
            'vertical-align': 'middle',
            style: {
                'font-size': 20,
                'font-color': 'black',
                'text-anchor': 'middle'
            }
        }
    ];
    if (this.data) {
        this.sub.push(
            {
                shape: new OG.TextShape(this.data['LO_TYPE'] + ' Load'),
                width: '200%',
                height: '15%',
                left: '-50%',
                top: '-20%',
                style: {
                    'font-size': 8,
                    'font-color': 'red',
                    'text-anchor': 'middle'
                }
            }
        )
    }
    return this.sub;
};