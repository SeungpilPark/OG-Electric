OG.shape.elec.Location = function (label) {
    OG.shape.elec.Location.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.elec.Location';
    this.label = label;
    this.CONNECT_CLONEABLE = false;
    this.LABEL_EDITABLE = false;

    this.textList = [
        {
            text: 'Raceway',
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
        {
            shape: new OG.TextShape(
                'LOC_REF_NAME : ' + this.data['LOC_REF_NAME']
                + '\n' + 'LOC_REF_TEMP : ' + this.data['LOC_REF_TEMP']
                + '\n' + 'LOC_REF_LENGTH : ' + this.data['LOC_REF_LENGTH']
                + '\n' + 'LOC_REF_REM : ' + this.data['LOC_REF_REM']
            ),
            width: 1000,
            height: 80,
            left: 120,
            top: 5,
            style: {
                'font-size': 8,
                'font-color': 'gray',
                'text-anchor': 'start',
                'vertical-align': 'top'
            }
        }
    ];
    return this.sub;
};