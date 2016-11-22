OG.shape.elec.SHLoad = function (label) {
    OG.shape.elec.SHLoad.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.elec.SHLoad';
    this.label = label;
    this.CONNECT_CLONEABLE = false;
    this.LABEL_EDITABLE = false;
    this.ENABLE_FROM = false;
};
OG.shape.elec.SHLoad.prototype = new OG.shape.elec.Load();
OG.shape.elec.SHLoad.superclass = OG.shape.elec.Load;
OG.shape.elec.SHLoad.prototype.constructor = OG.shape.elec.SHLoad;
OG.SHLoad = OG.shape.elec.SHLoad;

OG.shape.elec.SHLoad.prototype.createShape = function () {
    var geom1, geom2, geomCollection = [];
    if (this.geom) {
        return this.geom;
    }

    geom1 = new OG.geometry.Circle([50, 50], 50);
    geom1.style = new OG.geometry.Style({
        "stroke-width": 4
    });

    geom2 = new OG.geometry.Polygon([
        [20, 20],
        [20, 80],
        [30, 80],
        [30, 50],
        [70, 50],
        [70, 80],
        [80, 80],
        [80, 20],
        [70, 20],
        [70, 40],
        [30, 40],
        [30, 20],
        [20, 20]
    ]);
    geom2.style = new OG.geometry.Style({
        "fill": "black",
        "fill-opacity": 1
    });

    geomCollection.push(geom1);
    geomCollection.push(geom2);

    this.geom = new OG.geometry.GeometryCollection(geomCollection);
    this.geom.style = new OG.geometry.Style({
        'label-position': 'bottom',
        'label-width': 200
    });

    return this.geom;
};

OG.shape.elec.SHLoad.prototype.createSubShape = function () {
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