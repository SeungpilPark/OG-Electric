OG.shape.elec.EHSLoad = function (label) {
    OG.shape.elec.EHSLoad.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.elec.EHSLoad';
    this.label = label;
    this.CONNECT_CLONEABLE = false;
    this.LABEL_EDITABLE = false;
    this.ENABLE_FROM = false;
};
OG.shape.elec.EHSLoad.prototype = new OG.shape.elec.Load();
OG.shape.elec.EHSLoad.superclass = OG.shape.elec.Load;
OG.shape.elec.EHSLoad.prototype.constructor = OG.shape.elec.EHSLoad;
OG.EHSLoad = OG.shape.elec.EHSLoad;

OG.shape.elec.EHSLoad.prototype.createShape = function () {
    var geom1, geom2,geom3,geom4, geomCollection = [];
    if (this.geom) {
        return this.geom;
    }

    geom1 = new OG.geometry.Circle([30, 30], 30);

    geom2 = new OG.geometry.Curve([
        [0, 0],
        [40, 10],
        [20, 20]
    ]);
    geom3 = new OG.geometry.Curve([
        [20, 20],
        [40, 30],
        [20, 40]
    ]);
    geom4 = new OG.geometry.Curve([
        [20, 40],
        [40, 50],
        [0, 60]
    ]);

    geomCollection.push(geom1);
    geomCollection.push(geom2);
    geomCollection.push(geom3);
    geomCollection.push(geom4);

    this.geom = new OG.geometry.GeometryCollection(geomCollection);
    this.geom.style = new OG.geometry.Style({
        'label-position': 'bottom',
        'label-width': 200,
        'stroke-width': 2
    });

    return this.geom;
};


OG.shape.elec.EHSLoad.prototype.createSubShape = function () {
    if (!this.data) {
        return;
    }

    this.sub = [
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
    ];
    return this.sub;
};