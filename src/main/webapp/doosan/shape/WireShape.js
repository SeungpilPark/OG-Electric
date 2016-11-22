/**
 * ELECTRONIC : Wire Shape
 *
 * @class
 * @extends OG.shape.WireShape
 * @requires OG.common.*
 * @requires OG.geometry.*
 *
 * @param {Number[]} from 와이어 시작 좌표
 * @param {Number[]} to 와이어 끝 좌표
 * @param {String} label 라벨 [Optional]
 * @author <a href="mailto:sppark@uengine.org">Seungpil Park</a>
 * @private
 */
OG.shape.elec.WireShape = function (from, to, label) {
    OG.shape.elec.WireShape.superclass.call(this, from, to, label);

    this.SHAPE_ID = 'OG.shape.elec.WireShape';
};
OG.shape.elec.WireShape.prototype = new OG.shape.EdgeShape();
OG.shape.elec.WireShape.superclass = OG.shape.EdgeShape;
OG.shape.elec.WireShape.prototype.constructor = OG.shape.elec.WireShape;
OG.WireShape = OG.shape.elec.WireShape;

OG.shape.elec.WireShape.prototype.createContextMenu = function () {
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
        'changeShape': {
            name: '변경',
            items: {
                'Wire': {
                    name: 'Cable',
                    type: 'radio',
                    radio: 'changeShape',
                    value: 'OG.shape.elec.CableShape',
                    events: {
                        change: function (e) {
                            me.currentCanvas.getEventHandler().changeShape(e.target.value, null);
                        }
                    }
                },
                'IPB': {
                    name: 'IPB',
                    type: 'radio',
                    radio: 'changeShape',
                    value: 'OG.shape.elec.BusductShape',
                    events: {
                        change: function (e) {
                            me.currentCanvas.getEventHandler().changeShape(e.target.value, 'IPB');
                        }
                    }
                },
                'SPB': {
                    name: 'SPB',
                    type: 'radio',
                    radio: 'changeShape',
                    value: 'OG.shape.elec.BusductShape',
                    events: {
                        change: function (e) {
                            me.currentCanvas.getEventHandler().changeShape(e.target.value, 'SPB');
                        }
                    }
                },
                'NSPB': {
                    name: 'NSPB',
                    type: 'radio',
                    radio: 'changeShape',
                    value: 'OG.shape.elec.BusductShape',
                    events: {
                        change: function (e) {
                            me.currentCanvas.getEventHandler().changeShape(e.target.value, 'NSPB');
                        }
                    }
                },
                'CRB': {
                    name: 'CRB',
                    type: 'radio',
                    radio: 'changeShape',
                    value: 'OG.shape.elec.BusductShape',
                    events: {
                        change: function (e) {
                            me.currentCanvas.getEventHandler().changeShape(e.target.value, 'CRB');
                        }
                    }
                }
            }
        }
    };
    return this.contextMenu;
};
