OG.shape.elec.SwitchTransformer = function (label) {
    OG.shape.elec.SwitchTransformer.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.elec.SwitchTransformer';
    this.label = label;
    this.DELETABLE = false;
    this.ENABLE_TO = false;
    this.CONNECT_CLONEABLE = false;
    this.LABEL_EDITABLE = false;
};
OG.shape.elec.SwitchTransformer.prototype = new OG.shape.GeomShape();
OG.shape.elec.SwitchTransformer.superclass = OG.shape.GeomShape;
OG.shape.elec.SwitchTransformer.prototype.constructor = OG.shape.elec.SwitchTransformer;
OG.SwitchTransformer = OG.shape.elec.SwitchTransformer;

OG.shape.elec.SwitchTransformer.prototype.createShape = function () {
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


OG.shape.elec.SwitchTransformer.prototype.createSubShape = function () {
    if (!this.data) {
        return;
    }

    var multi = [];
    for (var i = 0; i < 5; i++) {
        var data = {
            top: -10 + (i * 4),
            from: 'start',
            to: 'end',
            style: {
                'marker': {
                    'start': {
                        'id': 'OG.marker.CircleMarker',
                        'size': [6, 6]
                    },
                    'end': {
                        'id': 'OG.marker.ArrowMarker',
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
            shape: new OG.Transform(),
            width: 20,
            height: 70,
            left: 5,
            top: 20,
            style: {
                'fill-opacity': 0
            }
        },
        {
            shape: new OG.EdgeShape(),
            vertices: [
                [25, 65],
                [35, 65],
                [80, 80],
                [90, 80]
            ],
            style: {
                'multi': multi
            }
        },
        {
            shape: new OG.EdgeShape(),
            vertices: [
                [25, 80],
                [35, 80],
                [80, 65],
                [90, 65]
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