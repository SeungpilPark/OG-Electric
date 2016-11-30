/**
 * ELECTRONIC : Raceway Shape
 *
 * @class
 * @extends OG.shape.RacewayShape
 * @requires OG.common.*
 * @requires OG.geometry.*
 *
 * @param {Number[]} from 와이어 시작 좌표
 * @param {Number[]} to 와이어 끝 좌표
 * @param {String} label 라벨 [Optional]
 * @author <a href="mailto:sppark@uengine.org">Seungpil Park</a>
 * @private
 */
OG.shape.elec.RacewayShape = function (from, to, label) {
    OG.shape.elec.RacewayShape.superclass.call(this, from, to, label);

    this.SHAPE_ID = 'OG.shape.elec.RacewayShape';
};
OG.shape.elec.RacewayShape.prototype = new OG.shape.EdgeShape();
OG.shape.elec.RacewayShape.superclass = OG.shape.EdgeShape;
OG.shape.elec.RacewayShape.prototype.constructor = OG.shape.elec.RacewayShape;
OG.RacewayShape = OG.shape.elec.RacewayShape;

/**
 * 드로잉할 Shape 을 생성하여 반환한다.
 *
 * @return {OG.geometry.Geometry} Shape 정보
 * @override
 */
OG.shape.elec.RacewayShape.prototype.createShape = function () {
    if (this.geom) {
        return this.geom;
    }

    this.geom = new OG.Line(this.from || [0, 0], this.to || [70, 0]);

    var style = {
        'multi': [
            {
                top: -10,
                from: 'start',
                to: 'end',
                style: {}
            },
            {
                top: 10,
                from: 'start',
                to: 'end',
                style: {}
            },
            {
                top: 0,
                from: 'start',
                to: 'end',
                style: {
                    pattern: {
                        'id': 'OG.pattern.HatchedPattern',
                        'thickness': 10,
                        'unit-width': 12,
                        'unit-height': 12,
                        'pattern-width': 8,
                        'pattern-height': 8,
                        'style': {
                            'stroke': 'black'
                        }
                    },
                    'stroke': 'none'
                }
            }
        ]
    };

    this.geom.style = new OG.geometry.Style(style);
    return this.geom;
};


OG.shape.elec.RacewayShape.prototype.redrawShape = function () {
    if (!this.data) {
        return;
    }

    var multiStyle = [
        {
            top: -10,
            from: 'start',
            to: 'end',
            style: {}
        },
        {
            top: 10,
            from: 'start',
            to: 'end',
            style: {}
        },
        {
            top: 0,
            from: 'start',
            to: 'end',
            style: {
                pattern: {
                    'id': 'OG.pattern.HatchedPattern',
                    'thickness': 10,
                    'unit-width': 12,
                    'unit-height': 12,
                    'pattern-width': 8,
                    'pattern-height': 8,
                    'style': {
                        'stroke': 'black'
                    }
                },
                'stroke': 'none'
            }
        }
    ];

    if (this.data && this.data.selected) {
        multiStyle.push(
            {
                top: 0,
                from: 'start',
                to: 'end',
                style: {
                    'fill-opacity': 1,
                    animation: [
                        {
                            start: {
                                stroke: 'white'
                            },
                            to: {
                                stroke: '#d9534f'
                            },
                            ms: 1000
                        },
                        {
                            start: {
                                stroke: '#d9534f'
                            },
                            to: {
                                stroke: 'white'
                            },
                            ms: 1000,
                            delay: 1000
                        }
                    ],
                    'animation-repeat': true,
                    "stroke": "#d9534f",
                    "stroke-width": "5"
                }
            }
        )
    } else if (this.data && this.data.highlight) {
        multiStyle.push(
            {
                top: 0,
                from: 'start',
                to: 'end',
                style: {
                    'fill-opacity': 1,
                    "stroke": "#d9534f",
                    "stroke-width": "5"
                }
            }
        );
    }
    this.geom.style.map['multi'] = multiStyle;
};


OG.shape.elec.RacewayShape.prototype.createContextMenu = function () {
    var me = this;
    this.contextMenu = {
        'delete': true,
        'format': true,
        'text': true,
        'bringToFront': true,
        'sendToBack': true,
        'property': {
            name: '정보보기', callback: function () {
                $(me.currentCanvas.getRootElement()).trigger('showProperty', [me.currentElement]);
            }
        },
        'pathList': {
            name: '케이블 보기', callback: function () {
                $(me.currentCanvas.getRootElement()).trigger('showCableList', [me.currentElement]);
            }
        }
    };
    return this.contextMenu;
};
