OG.shape.elec.SwitchGearSample = function (label) {
    OG.shape.elec.SwitchGearSample.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.elec.SwitchGearSample';
    this.label = label;
    this.DELETABLE = false;
    this.ENABLE_TO = false;
    this.CONNECT_CLONEABLE = false;
    this.LABEL_EDITABLE = false;
};
OG.shape.elec.SwitchGearSample.prototype = new OG.shape.GeomShape();
OG.shape.elec.SwitchGearSample.superclass = OG.shape.GeomShape;
OG.shape.elec.SwitchGearSample.prototype.constructor = OG.shape.elec.SwitchGearSample;
OG.SwitchGearSample = OG.shape.elec.SwitchGearSample;

OG.shape.elec.SwitchGearSample.prototype.createShape = function () {
    if (this.geom) {
        return this.geom;
    }

    var geomCollection = [];
    if (this.geom) {
        return this.geom;
    }

    var line1 = new OG.geometry.Line([-100, 10], [100, 10]);
    var line2 = new OG.geometry.Line([-100, -10], [100, -10]);
    var line3 = new OG.geometry.Line([100, 10], [100, -10]);
    line3.style = new OG.geometry.Style({
        'stroke': 'none',
        'stroke-width': '3',
        'fill': 'none',
        'fill-opacity': 0
    });
    var line4 = new OG.geometry.Line([-100, 10], [-100, -10]);
    line4.style = new OG.geometry.Style({
        'stroke': 'none',
        'stroke-width': '3',
        'fill': 'none',
        'fill-opacity': 0
    });

    geomCollection.push(line1);
    geomCollection.push(line2);
    geomCollection.push(line3);
    geomCollection.push(line4);

    this.geom = new OG.geometry.GeometryCollection(geomCollection);

    this.geom.style = new OG.geometry.Style({
        'cursor': 'default',
        'stroke': '#d9534f',
        'stroke-width': '3',
        'fill': 'none',
        'fill-opacity': 0
    });
    return this.geom;
};


OG.shape.elec.SwitchGearSample.prototype.createSubShape = function () {
    if (!this.data) {
        return;
    }

    var multi = [];
    for (var i = 0; i < 10; i++) {
        var data = {
            top: -20 + (i * 4),
            from: 'start',
            to: 'end',
            style: {
                'marker': {
                    'start': {
                        'id': 'OG.marker.ArrowMarker',
                        'size': [6, 6]
                    },
                    'end': {
                        'id': 'OG.marker.CircleMarker',
                        'size': [6, 6]
                    }
                },
                'stroke': 'gray'
            }
        };
        multi.push(data);
    }

    this.sub = [
        {
            shape: new OG.TextShape(this.data['PJT_SQ']),
            width: 50,
            height: 15,
            left: 2,
            top: 2,
            style: {
                'font-size': 8,
                'font-color': 'red',
                'text-anchor': 'start'
            }
        },
        {
            shape: new OG.TextShape('SWGR_TAG_NO : ' + this.data['SWGR_TAG_NO']),
            width: 98,
            height: 15,
            left: 0,
            top: 5,
            style: {
                'font-size': 8,
                'font-color': 'gray',
                'text-anchor': 'end',
                'text-decoration' : 'underline'
            }
        },
        {
            shape: new OG.TextShape('FE_OWNER_ID : ' + this.data['FE_OWNER_ID']),
            width: 98,
            height: 15,
            left: 0,
            top: 15,
            style: {
                'font-size': 8,
                'font-color': 'gray',
                'text-anchor': 'end',
                'text-decoration' : 'underline'
            }
        },
        {
            shape: new OG.TextShape('SWGR_LOCATION : ' + this.data['SWGR_LOCATION']),
            width: 98,
            height: 15,
            left: 0,
            top: 25,
            style: {
                'font-size': 8,
                'font-color': 'gray',
                'text-anchor': 'end',
                'text-decoration' : 'underline'
            }
        },
        {
            shape: new OG.RectangleShape(),
            width: 30,
            height: 30,
            left: 2,
            top: 20,
            style: {
                pattern: {
                    'id': 'OG.pattern.RectPattern',
                    'unit-width': 12,
                    'unit-height': 12,
                    'pattern-width': 16,
                    'pattern-height': 16,
                    'patternTransform': 'rotate(35)',
                    'style': {
                        'stroke': 'black'
                    }
                },
                'fill-opacity': 1
            }
        },
        {
            shape: new OG.EdgeShape(),
            vertices: [
                [15, 50],
                [15, 80],
                [80, 80]
            ],
            style: {
                'multi': multi
            }
        }
    ];

    for (var i = 1; i < 6; i++) {
        var percentBar = {
            shape: new OG.RectangleShape(),
            width: (i * 10),
            height: 1,
            left: 8,
            top: -5 - (i * 5),
            style: {
                'stroke': 'orange',
                'fill': 'orange',
                'fill-opacity': 1
            }
        };
        var text =
        {
            shape: new OG.TextShape((i * 10) + '%'),
            width: 15,
            height: 1,
            left: 0,
            top: -5 - (i * 5),
            style: {
                'font-size': 8,
                'font-color': 'gray',
                'text-anchor': 'start'
            }
        };
        this.sub.push(percentBar);
        this.sub.push(text);
    }
    return this.sub;
}
;