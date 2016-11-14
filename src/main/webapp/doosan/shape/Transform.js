/**
 * ELECTRONIC : Transform Shape
 *
 * @class
 * @extends OG.shape.Transform
 * @requires OG.common.*
 * @requires OG.geometry.*
 *
 * @param {String} label 라벨 [Optional]
 * @author <a href="mailto:sppark@uengine.org">Seungpil Park</a>
 * @private
 */
OG.shape.elec.Transform = function (label) {
    OG.shape.elec.Transform.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.elec.Transform';
    this.label = label;
    this.DELETABLE = false;
    this.ENABLE_TO = false;
    this.CONNECT_CLONEABLE = false;
    this.LABEL_EDITABLE = false;

};
OG.shape.elec.Transform.prototype = new OG.shape.GeomShape();
OG.shape.elec.Transform.superclass = OG.shape.GeomShape;
OG.shape.elec.Transform.prototype.constructor = OG.shape.elec.Transform;
OG.Transform = OG.shape.elec.Transform;

/**
 * 드로잉할 Shape 을 생성하여 반환한다.
 *
 * @return {OG.geometry.Geometry} Shape 정보
 * @override
 */
OG.shape.elec.Transform.prototype.createShape = function () {
    var geom1, geom2, geomCollection = [];
    if (this.geom) {
        return this.geom;
    }

    geom1 = new OG.geometry.Circle([50, 50], 50);
    geom2 = new OG.geometry.Circle([50, 125], 50);

    geomCollection.push(geom1);
    geomCollection.push(geom2);

    this.geom = new OG.geometry.GeometryCollection(geomCollection);

    return this.geom;
};