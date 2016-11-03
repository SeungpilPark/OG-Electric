var Renderer = function (mode, container) {
    this.Constants = {
        MODE: {
            ROUTE: 'route',
            FEEDER: 'feeder',
            HIERARCHY: 'hierarchy',
        },
        TYPE: {
            SWITCH_GEAR: 'SwitchGear',
            LOAD: 'Load',
            NMLOAD: 'NMLoad',
            SHLOAD: 'SHLoad',

            HIERARCHY_BLDG: 'HierarchyBldg',
            HIERARCHY_FLOOR: 'HierarchyFloor',
            HIERARCHY_FEEDER: 'HierarchyFeeder',

            BLDG: 'Bldg',
            LOCATION: 'Location',
            RACEWAY: 'Raceway',
            MANHOLE: 'Manhole',

            NEW_FEEDER: 'NewFeeder',
            NEW_HIERARCHY_BLDG: 'NewHierarchyBldg'
        },
        PREFIX: {
            EXPANDER: "-expander",
            EXPANDER_FROM: "-expanderFrom",
            EXPANDER_TO: "-expanderTo",
            MAPPING_EDGE: "-mappingEdge",
            MAPPING_LABEL: "-mapping-label",
            SELECTED_LABEL: "-selected-label",
            ACTIVITY_REL: "-activity-rel"
        }
    };
    this._CONFIG = {
        DEFAULT_SIZE: {
            SWITCH_GEAR: [400, 50],
            LOAD: [30, 30],
            HIERARCHY_BLDG: [300, 200],
            HIERARCHY_FLOOR: [300, 200],
            HIERARCHY_FEEDER: [30, 30],
            BLDG: [80, 80],
            LOCATION: [30, 30],
            MANHOLE: [30, 30]
        }
    };

    /**
     * 모드 또는 콘테이너가 없을 경우 리턴
     */
    if (!mode || !container) {
        return;
    }

    /**
     * 인 데이터 그룹의 가상의 activity 와 targetActivity 사이의 가상 익스팬더 상황 데이터
     * @type {Array}
     * @private
     */
    this._INCOLLAPSE = [];
    this._STORAGE = {};
    this._VIEWDATA = {};
    this._CONTAINER = $('#' + container);

    // Canvas
    this.canvas = new OG.Canvas(container, [this._CONTAINER.width(), this._CONTAINER.height()], 'white', 'url(resources/images/symbol/grid.gif)');
    this.canvas._CONFIG.DEFAULT_STYLE.EDGE["edge-type"] = "plain";

    this.canvas.initConfig({
        selectable: true,
        dragSelectable: true,
        movable: true,
        resizable: true,
        connectable: true,
        selfConnectable: false,
        connectCloneable: false,
        connectRequired: true,
        labelEditable: true,
        groupDropable: true,
        collapsible: true,
        enableHotKey: true,
        enableContextMenu: true,
        useSlider: true,
        stickGuide: true,
        checkBridgeEdge: false
    });
    this.canvas._CONFIG.LABEL_MIN_SIZE = this._CONFIG.LABEL_MIN_SIZE;
    this.canvas._CONFIG.LABEL_MAX_SIZE = this._CONFIG.LABEL_MAX_SIZE;

    this._RENDERER = this.canvas._RENDERER;
    this._HANDLER = this.canvas._HANDLER;
    this.init();

};
Renderer.prototype = {
    init: function () {
        var me = this;
        me.bindDropEvent();
    },
    getContainer: function () {
        return this._CONTAINER;
    },
    getCanvas: function () {
        return this.canvas;
    },
    setCanvasSize: function(size){
        this.canvas.setCanvasSize(size);
    },
    bindDropEvent: function () {
        var me = this;
        me.getContainer().droppable({
            drop: function (event, ui) {
                var shapeInfo = me.getContainer().data('DRAG_SHAPE'), shape, element, id, size;
                if (shapeInfo && shapeInfo['shapeType']) {
                    var shapeType = shapeInfo['shapeType'];
                    var shapeLabel = shapeInfo['shapeLabel'] ? shapeInfo['shapeLabel'] : '';

                    //렌더링 대상들
                    if (shapeType == me.Constants.TYPE.SWITCH_GEAR) {
                        shape = new OG.SwitchGear(shapeLabel);
                        size = me._CONFIG.DEFAULT_SIZE.SWITCH_GEAR;
                    } else if (shapeType == me.Constants.TYPE.NMLOAD) {
                        shape = new OG.NMLoad(shapeLabel);
                        size = me._CONFIG.DEFAULT_SIZE.LOAD;
                    } else if (shapeType == me.Constants.TYPE.SHLOAD) {
                        shape = new OG.SHLoad(shapeLabel);
                        size = me._CONFIG.DEFAULT_SIZE.LOAD;
                    } else if (shapeType == me.Constants.TYPE.HIERARCHY_FLOOR) {
                        shape = new OG.HierarchyFloor(shapeLabel);
                        size = me._CONFIG.DEFAULT_SIZE.HIERARCHY_FLOOR;
                    } else if (shapeType == me.Constants.TYPE.HIERARCHY_FEEDER) {
                        shape = new OG.HierarchyFeeder(shapeLabel);
                        size = me._CONFIG.DEFAULT_SIZE.HIERARCHY_FEEDER;
                    } else if (shapeType == me.Constants.TYPE.BLDG) {
                        shape = new OG.BLDG(shapeLabel);
                        size = me._CONFIG.DEFAULT_SIZE.BLDG;
                    } else if (shapeType == me.Constants.TYPE.LOCATION) {
                        shape = new OG.Location(shapeLabel);
                        size = me._CONFIG.DEFAULT_SIZE.LOCATION;
                    } else if (shapeType == me.Constants.TYPE.MANHOLE) {
                        shape = new OG.Manhole(shapeLabel);
                        size = me._CONFIG.DEFAULT_SIZE.MANHOLE;
                    }

                    //viewController 에 전달해야 하는 대상들
                    else if (shapeType == me.Constants.TYPE.NEW_FEEDER) {
                        return;
                    } else if (shapeType == me.Constants.TYPE.NEW_HIERARCHY_BLDG) {
                        return;
                    }

                    if (shape) {
                        element = me.getCanvas().drawShape([
                                event.pageX - me.getContainer().offset().left + me.getContainer()[0].scrollLeft,
                                event.pageY - me.getContainer().offset().top + me.getContainer()[0].scrollTop],
                            shape, size);
                        me.getContainer().removeData('DRAG_SHAPE');
                        me.getCanvas().setCustomData(element, {
                            properties: shapeInfo
                        });
                    }
                }
            }
        });
    }
};
Renderer.prototype.constructor = Renderer;