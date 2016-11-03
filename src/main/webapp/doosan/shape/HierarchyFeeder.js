OG.shape.HierarchyFeeder = function (label) {
    OG.shape.HierarchyFeeder.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.HierarchyFeeder';
    this.label = label;
    this.CONNECT_CLONEABLE = false;
    this.LABEL_EDITABLE = false;
};
OG.shape.HierarchyFeeder.prototype = new OG.shape.GeomShape();
OG.shape.HierarchyFeeder.superclass = OG.shape.GeomShape;
OG.shape.HierarchyFeeder.prototype.constructor = OG.shape.HierarchyFeeder;
OG.HierarchyFeeder = OG.shape.HierarchyFeeder;

OG.shape.HierarchyFeeder.prototype.createShape = function () {
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
        'font-size': 10,
        'label-width':200
    });

    return this.geom;
};