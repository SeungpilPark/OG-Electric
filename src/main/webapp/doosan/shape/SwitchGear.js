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

    var geomCollection = [];
    if (this.geom) {
        return this.geom;
    }

    var line1 = new OG.geometry.Line([-100, 10], [100, 10]);
    var line2 = new OG.geometry.Line([-100, -10], [100, -10]);
    var line3 = new OG.geometry.Line([100, 10], [100, -10]);
    var line4 = new OG.geometry.Line([-100, 10], [-100, -10]);

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


OG.shape.elec.SwitchGear.prototype.createSubShape = function () {
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
            shape: new OG.TextShape('SWGR_TAG_NO : ' + this.data['SWGR_TAG_NO']
                + '\n' + 'FE_OWNER_ID : ' + this.data['FE_OWNER_ID']
                + '\n' + 'SWGR_LOCATION : ' + this.data['SWGR_LOCATION']
                + '\n' + 'SWGR_OWNER_NM : ' + this.data['SWGR_OWNER_NM']),
            width: 98,
            height: 50,
            left: 0,
            top: 5,
            style: {
                'font-size': 8,
                'font-color': 'gray',
                'text-anchor': 'end',
                'vertical-align': 'top'
            }
        },
        {
            shape: new OG.RectangleShape(),
            width: 25,
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
                [85, 80]
            ],
            style: {
                'multi': multi
            }
        }
    ];


    var graphKey = ['SWGR_VOLTAGE', 'SWGR_BUS_RATING'];
    for (var i = 0; i < graphKey.length; i++) {
        var width = this.data[graphKey[i]] / 10;
        if (width > 70) {
            width = 70
        }
        var percentBar = {
            shape: new OG.RectangleShape(),
            width: width,
            height: 1,
            left: 25,
            top: -5 - (i * 5),
            style: {
                'stroke': 'orange',
                'fill': 'orange',
                'fill-opacity': 1
            }
        };
        var text =
        {
            shape: new OG.TextShape(graphKey[i] + ' : ' + this.data[graphKey[i]]),
            width: 100,
            height: 1,
            left: 0,
            top: -5 - (i * 5),
            style: {
                'font-size': 8,
                'font-color': 'gray',
                'text-anchor': 'start',
                'word-wrap' : 'none'
            }
        };
        this.sub.push(percentBar);
        this.sub.push(text);
    }
    return this.sub;
}
;