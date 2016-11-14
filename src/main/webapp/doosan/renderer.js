var Renderer = function (mode, container, controller) {
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

            MODIFY_FEEDER: 'ModifyFeeder',
            NEW_FEEDER: 'NewFeeder',
            MODIFY_HIERARCHY_BLDG: 'ModifyHierarchyBldg',
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
            SWITCH_GEAR: [450, 250],
            LOAD: [70, 70],
            HIERARCHY_BLDG: [450, 300],
            HIERARCHY_FLOOR: [350, 200],
            HIERARCHY_FEEDER: [50, 50],
            BLDG: [150, 150],
            LOCATION: [50, 50],
            MANHOLE: [50, 50]
        }
    };

    /**
     * 캔버스의 에디팅 대상 객체 - 경우에 따라 이 객체가 없다면 도형 그리기를 허용하지 않는다.
     */
    this.editingObject = undefined;

    /**
     * 캔버스의 에디팅 대생 객체의 GUI 변화 여부
     */
    this.isUpdated = false;

    /**
     * 모드, 컨테이너, 컨트롤러 등록 (누락일 경우 리턴)
     */
    if (!mode || !container || !controller) {
        return;
    }
    this._MODE = mode;
    this._CONTROLLER = controller;
    this._CONTAINER = $('#' + container);
    this._CONTAINER_ID = container;

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
        me.bindEvent();
    },
    getContainer: function () {
        return this._CONTAINER;
    },
    getCanvas: function () {
        return this.canvas;
    },
    setCanvasSize: function (size) {
        this.canvas.setCanvasSize(size);
    },
    fitCanvasSize: function () {
        var size = [
            this.getContainer().width(),
            this.getContainer().height()
        ];
        this.canvas.setCanvasSize(size);
    },
    getMode: function () {
        return this._MODE;
    },
    setMode: function (mode) {
        this._MODE = mode;
    },
    getIsUpdated: function () {
        return this.isUpdated;
    },
    setIsUpdated: function (updated) {
        this.isUpdated = updated;
    },
    getContainerId: function () {
        return this._CONTAINER_ID;
    },
    setContainerId: function (id) {
        this._CONTAINER_ID = id;
    },

    //TODO
    // 드랍이벤트시 위치 체크 로직. -> ok
    // 빌딩 포인트와 레이스웨이(맨홀) 드래그 하는 로직 추가. -> 다음 할일
    // 툴바에 텍스트, 기타 shape 오브젝트 추가.
    // 뷰 컨트롤러에 생성 명령 콜백 -> 뷰 컨트롤러에서 캔버스 에디팅 여부 체크 -> 새로 생성 또는 기존 수정 보내기. ing
    // 캔버스에 생성자와 타이틀이 없다면 아무것도 못하게 함.

    // 샘플 데이터 파악하여 릴레이션 관계 명확하게 만들기
    // 서버 CRUD 만들기

    /**
     * 뷰 컨트롤러에서 받아온 데이터를 바탕으로 캔버스에 도형을 그린다.
     * @param offset
     * @param shapeInfo
     */
    drawImmediately: function (offset, shapeInfo) {
        var me = this;
        var shape, element, id, size, position;
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
            } else if (shapeType == me.Constants.TYPE.HIERARCHY_BLDG) {
                shape = new OG.HierarchyBldg(shapeLabel);
                size = me._CONFIG.DEFAULT_SIZE.HIERARCHY_BLDG;
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
                shape = new OG.Manhole('resources/images/elec/manhole.svg', shapeLabel);
                size = me._CONFIG.DEFAULT_SIZE.MANHOLE;
            }

            //viewController 에 전달해야 하는 대상들
            else if (shapeType == me.Constants.TYPE.NEW_FEEDER) {
                me._CONTROLLER.onMessage(me, shapeInfo, me._CONTROLLER.message.NEW);
                return;
            } else if (shapeType == me.Constants.TYPE.MODIFY_FEEDER) {
                me._CONTROLLER.onMessage(me, shapeInfo, me._CONTROLLER.message.NEW);
                return;
            } else if (shapeType == me.Constants.TYPE.MODIFY_HIERARCHY_BLDG) {
                me._CONTROLLER.onMessage(me, shapeInfo, me._CONTROLLER.message.NEW);
                return;
            } else if (shapeType == me.Constants.TYPE.NEW_HIERARCHY_BLDG) {
                me._CONTROLLER.onMessage(me, shapeInfo, me._CONTROLLER.message.NEW);
                return;
            }

            if (shape) {
                //offset 이 없다면 컨테이너의 중앙을 기준으로 삼는다.
                if (!offset) {
                    position = [me.getContainer().width() / 2, me.getContainer().height() / 2];
                } else {
                    position = [
                        offset[0] - me.getContainer().offset().left + me.getContainer()[0].scrollLeft,
                        offset[1] - me.getContainer().offset().top + me.getContainer()[0].scrollTop
                    ];
                }
                //캔버스의 editingObject (에디팅 객체) 가 없다면 그리지 않는다.
                if (!me.editingObject) {
                    me._CONTROLLER.onMessage(me, shapeInfo, me._CONTROLLER.message.NO_EDITOR_OBJECT);
                } else {
                    //가이드 선의 다양성을 확보한다.
                    //선을 이었을 때 EventHandler 에서 LINE_CONNECT_TEXT 검색, connectText 값이 라벨로 들어가게 된다.
                    //위의 단계를, 라인이 생성되었을 때 connectText 이벤트로 함께 오도록 조치한다.
                    //connectText 타입에 따라 엣지 형태를 변경할 수 있도록 한다.
                    //이 로직은 스위치, 그리고 하이어라키 피더에서 적용될 것임. 하이어라키 피더의 우측 텍스트들을 정리할 수 있도록 한다.
                    shape.data = shapeInfo;
                    element = me.getCanvas().drawShape(position, shape, size);


                    me.getContainer().removeData('DRAG_SHAPE');
                }
            }
        }
    },

    /**
     * 뷰 컨트롤러에서 드랍 이벤트가 올 경우의 처리.
     * 드랍 한 영역이 캔버스 컨테이너 영역 안일 경우만 처리한다.
     */
    bindDropEvent: function () {
        var me = this;
        me.getContainer().bind('drop.viewController', function (event, controllerEvent, jsonData) {
            var pageX = controllerEvent.pageX;
            var pageY = controllerEvent.pageY;

            var left = me.getContainer().offset().left;
            var top = me.getContainer().offset().top;
            var right = left + me.getContainer().width();
            var bottom = top + me.getContainer().height();
            if (pageX > left && pageX < right && pageY > top && pageY < bottom) {
                me.drawImmediately([pageX, pageY], jsonData);
            }
        });
    },

    /**
     * 사용자로 인해 캔버스에 이벤트가 발생하였을 경우 처리
     */
    bindEvent: function () {
        var me = this;
        //Action Event. 이 이벤트들은 렌더러의 isUpdated 값을 true 로 만든다.
        me.canvas.onDrawShape(function (event, element) {
            me.isUpdated = true;
        });
        me.canvas.onRedrawShape(function (event, element) {
            me.isUpdated = true;

        });
        me.canvas.onRemoveShape(function (event, shapeElement) {
            me.isUpdated = true;

        });
        me.canvas.onMoveShape(function (event, shapeElement, offset) {
            me.isUpdated = true;

        });
        me.canvas.onResizeShape(function (event, shapeElement, offset) {
            me.isUpdated = true;

        });
        me.canvas.onConnectShape(function (event, edgeElement, fromElement, toElement) {
            me.isUpdated = true;

        });
        me.canvas.onDisconnectShape(function (event, edgeElement, fromElement, toElement) {
            me.isUpdated = true;

        });
        me.canvas.onGroup(function (event, groupElement) {
            me.isUpdated = true;

        });
        me.canvas.onUnGroup(function (event, ungroupedElements) {
            me.isUpdated = true;
        });

        //Before Event
        me.canvas.onBeforeRemoveShape(function (event, shapeElement) {

        });
        me.canvas.onBeforeConnectShape(function (event, edgeElement, fromElement, toElement) {

        });
    }
};
Renderer.prototype.constructor = Renderer;