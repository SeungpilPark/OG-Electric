/**
 * ELECTRONIC : Busduct Shape
 *
 * @class
 * @extends OG.shape.BusductShape
 * @requires OG.common.*
 * @requires OG.geometry.*
 *
 * @param {Number[]} from 와이어 시작 좌표
 * @param {Number[]} to 와이어 끝 좌표
 * @param {String} label 라벨 [Optional]
 * @author <a href="mailto:sppark@uengine.org">Seungpil Park</a>
 * @private
 */
OG.shape.elec.BusductShape = function (from, to, label) {
    OG.shape.elec.BusductShape.superclass.call(this, from, to, label);

    this.SHAPE_ID = 'OG.shape.elec.BusductShape';
};
OG.shape.elec.BusductShape.prototype = new OG.shape.elec.WireShape();
OG.shape.elec.BusductShape.superclass = OG.shape.elec.WireShape;
OG.shape.elec.BusductShape.prototype.constructor = OG.shape.elec.BusductShape;
OG.BusductShape = OG.shape.elec.BusductShape;

/**
 * 드로잉할 Shape 을 생성하여 반환한다.
 *
 * @return {OG.geometry.Geometry} Shape 정보
 * @override
 */
OG.shape.elec.BusductShape.prototype.createShape = function () {
    if (this.geom) {
        return this.geom;
    }

    this.geom = new OG.PolyLine([this.from || [0, 0], this.to || [70, 0]]);
    this.geom.style = new OG.geometry.Style({
        'multi': [
            {
                top: -10,
                from: '20px',
                to: 'end-20px',
                style: {
                    'marker': {
                        'start': {
                            'id': 'OG.marker.SwitchRMarker',
                            'size': [8, 8],
                            'ref': [8, 0]
                        },
                        'end': {
                            'id': 'OG.marker.SwitchLMarker',
                            'size': [8, 8],
                            'ref': [1, 0]
                        }
                    }
                }
            },
            {
                top: 10,
                from: '20px',
                to: 'end-20px',
                style: {
                    'marker': {
                        'start': {
                            'id': 'OG.marker.SwitchLMarker',
                            'size': [8, 8],
                            'ref': [7, 8]
                        },
                        'end': {
                            'id': 'OG.marker.SwitchRMarker',
                            'size': [8, 8],
                            'ref': [0, 8]
                        }
                    }
                }
            },
            {
                top: 0,
                from: 'start',
                to: 'end',
                style: {}
            }
        ]
    });
    return this.geom;
};
