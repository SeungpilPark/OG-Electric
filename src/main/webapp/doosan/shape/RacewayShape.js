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
    if (this.data && this.data.selected) {
        style['stroke'] = '#d9534f';
        style['stroke-width'] = 2;
        style['multi'][2]['style']['pattern']['style']['stroke'] = '#d9534f';
    }
    this.geom.style = new OG.geometry.Style(style);
    return this.geom;
};


OG.shape.elec.RacewayShape.prototype.createContextMenu = function () {
    var me = this;
    var options = {'': ''};
    console.log(this.data.pathList);
    if (this.data && this.data.pathList) {
        for (var i = 0; i < this.data.pathList; i++) {
            var value = this.data.pathList[i]['value'];
            var name = this.data.pathList[i]['name'];
            options[value] = name;
        }
    }
    console.log(options);

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
            name: '라우트 보기',
            items: {
                'selectPath': {
                    name: '선택',
                    type: 'select',
                    options: options,
                    selected: '',
                    events: {
                        change: function (e) {
                            if (e.target.value !== '') {
                                $(me.currentCanvas.getRootElement()).trigger('showRouteList', [me.currentElement, e.target.value]);
                            }
                        }
                    }
                }
            }
        },
        'alternative': {
            name: '라우트 변경', callback: function () {
                $(me.currentCanvas.getRootElement()).trigger('changeRoute', [me.currentElement]);
            }
        }
    };
    return this.contextMenu;
};
