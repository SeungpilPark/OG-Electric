OG.shape.elec.MKLoad = function (label) {
    OG.shape.elec.MKLoad.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.elec.MKLoad';
    this.label = label;
    this.CONNECT_CLONEABLE = false;
    this.LABEL_EDITABLE = false;
    this.ENABLE_FROM = false;
};
OG.shape.elec.MKLoad.prototype = new OG.shape.elec.Load();
OG.shape.elec.MKLoad.superclass = OG.shape.elec.Load;
OG.shape.elec.MKLoad.prototype.constructor = OG.shape.elec.MKLoad;
OG.MKLoad = OG.shape.elec.MKLoad;

OG.shape.elec.MKLoad.prototype.createShape = function () {
    var geom1, geom2,geom3,geom4,geom5, geomCollection = [];
    if (this.geom) {
        return this.geom;
    }

    geom1 = new OG.geometry.Polygon([[10, 0],[27,10],[10,20]]);
    geom2 = new OG.geometry.Polygon([[44, 0],[27,10],[44,20]]);
    geom3 = new OG.geometry.Line([27,10],[27,20]);
    geom4 = new OG.geometry.Circle([27,27],7);
    geom5 = new OG.geometry.PolyLine([[24,30],[24,24],[27,28],[30,24],[30,30]]);

    geomCollection.push(geom1);
    geomCollection.push(geom2);
    geomCollection.push(geom3);
    geomCollection.push(geom4);
    geomCollection.push(geom5);

    this.geom = new OG.geometry.GeometryCollection(geomCollection);
    this.geom.style = new OG.geometry.Style({
        'label-position': 'bottom',
        'label-width': 200,
        'stroke-width': 2
    });

    return this.geom;
};


OG.shape.elec.MKLoad.prototype.createSubShape = function () {
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