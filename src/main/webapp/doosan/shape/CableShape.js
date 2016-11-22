/**
 * ELECTRONIC : CableShape
 *
 * @class
 * @extends OG.shape.CableShape
 * @requires OG.common.*
 * @requires OG.geometry.*
 *
 * @param {Number[]} from 와이어 시작 좌표
 * @param {Number[]} to 와이어 끝 좌표
 * @param {String} label 라벨 [Optional]
 * @author <a href="mailto:sppark@uengine.org">Seungpil Park</a>
 * @private
 */
OG.shape.elec.CableShape = function (from, to, label) {
    OG.shape.elec.CableShape.superclass.call(this, from, to, label);

    this.SHAPE_ID = 'OG.shape.elec.CableShape';
};
OG.shape.elec.CableShape.prototype = new OG.shape.elec.WireShape();
OG.shape.elec.CableShape.superclass = OG.shape.elec.WireShape;
OG.shape.elec.CableShape.prototype.constructor = OG.shape.elec.CableShape;
OG.CableShape = OG.shape.elec.CableShape;

/**
 * 드로잉할 Shape 을 생성하여 반환한다.
 *
 * @return {OG.geometry.Geometry} Shape 정보
 * @override
 */
OG.shape.elec.CableShape.prototype.createShape = function () {
    if (this.geom) {
        return this.geom;
    }

    this.geom = new OG.PolyLine([this.from || [0, 0], this.to || [70, 0]]);
    this.geom.style = new OG.geometry.Style({
        'multi': [
            {
                top: 0,
                from: 'start',
                to: 'center',
                style: {
                    'marker': {
                        'end': {
                            'id': 'OG.marker.SwitchLMarker',
                            'size': [20, 8],
                            'ref': [3, 0]
                        }
                    }
                }
            },
            {
                top: 0,
                from: 'center',
                to: 'end',
                style: {
                    'marker': {
                        'start': {
                            'id': 'OG.marker.SwitchXMarker',
                            'size': [6, 6]
                        }
                    }
                }
            }
        ]
    });
    return this.geom;
};
