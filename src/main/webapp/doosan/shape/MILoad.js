OG.shape.elec.MILoad = function (label) {
    OG.shape.elec.MILoad.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.elec.MILoad';
    this.label = label;
    this.CONNECT_CLONEABLE = false;
    this.LABEL_EDITABLE = false;
    this.ENABLE_FROM = false;
};
OG.shape.elec.MILoad.prototype = new OG.shape.elec.Load();
OG.shape.elec.MILoad.superclass = OG.shape.elec.Load;
OG.shape.elec.MILoad.prototype.constructor = OG.shape.elec.MILoad;
OG.MILoad = OG.shape.elec.MILoad;

OG.shape.elec.MILoad.prototype.createShape = function () {
    var geom1, geom2, geom3, geom4, geom5,
        geom6, geom7, geom8, geom9, geom10,
        geom11, geom12, geomCollection = [];
    if (this.geom) {
        return this.geom;
    }

    geom1 = new OG.geometry.Polygon([[10, 0], [27, 10], [10, 20]]);
    geom2 = new OG.geometry.Polygon([[44, 0], [27, 10], [44, 20]]);
    geom3 = new OG.geometry.Line([27, 10], [27, 20]);
    geom4 = new OG.geometry.Circle([27, 27], 7);
    geom5 = new OG.geometry.PolyLine([[24, 30], [24, 24], [27, 28], [30, 24], [30, 30]]);

    geom6 = new OG.geometry.Polygon([[10, 40], [27, 50], [10, 60]]);
    geom7 = new OG.geometry.Polygon([[44, 40], [27, 50], [44, 60]]);
    geom8 = new OG.geometry.Line([27, 50], [27, 60]);
    geom9 = new OG.geometry.Circle([27, 67], 7);
    geom10 = new OG.geometry.PolyLine([[24, 70], [24, 64], [27, 68], [30, 64], [30, 70]]);

    geom11 = new OG.geometry.PolyLine([[10, 10], [0, 10], [0, 34], [10, 34], [10, 40]]);
    geom12 = new OG.geometry.PolyLine([[44, 10], [54, 10], [54, 34], [44, 34], [44, 40]]);

    geomCollection.push(geom1);
    geomCollection.push(geom2);
    geomCollection.push(geom3);
    geomCollection.push(geom4);
    geomCollection.push(geom5);
    geomCollection.push(geom6);
    geomCollection.push(geom7);
    geomCollection.push(geom8);
    geomCollection.push(geom9);
    geomCollection.push(geom10);
    geomCollection.push(geom11);
    geomCollection.push(geom12);

    this.geom = new OG.geometry.GeometryCollection(geomCollection);
    this.geom.style = new OG.geometry.Style({
        'label-position': 'bottom',
        'label-width': 200,
        'stroke-width': 2
    });

    return this.geom;
};


OG.shape.elec.MILoad.prototype.createSubShape = function () {
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