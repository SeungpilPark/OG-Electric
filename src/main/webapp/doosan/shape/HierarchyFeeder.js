OG.shape.elec.HierarchyFeeder = function (label) {
    OG.shape.elec.HierarchyFeeder.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.elec.HierarchyFeeder';
    this.label = label;
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
OG.shape.elec.HierarchyFeeder.prototype = new OG.shape.GeomShape();
OG.shape.elec.HierarchyFeeder.superclass = OG.shape.GeomShape;
OG.shape.elec.HierarchyFeeder.prototype.constructor = OG.shape.elec.HierarchyFeeder;
OG.HierarchyFeeder = OG.shape.elec.HierarchyFeeder;

OG.shape.elec.HierarchyFeeder.prototype.createShape = function () {
    var geom1, geom2, geomCollection = [];
    if (this.geom) {
        return this.geom;
    }

    geom1 = new OG.geometry.Circle([50, 50], 50);
    geom1.style = new OG.geometry.Style({
        "stroke-width": 4
    });

    geom2 = new OG.geometry.Polygon([
        [30, 80],
        [30, 20],
        [70, 20],
        [70, 30],
        [40, 30],
        [40, 40],
        [70, 40],
        [70, 50],
        [40, 50],
        [40, 80],
        [30, 80]
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


OG.shape.elec.HierarchyFeeder.prototype.createSubShape = function () {
    if (!this.data) {
        return;
    }

    this.sub = [
        {
            shape: new OG.TextShape(this.data['SWGR_TYPE'] + ' Swgr'),
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

