var Renderer = function (mode, container, controller) {
    this.Constants = {
        MODE: {
            FEEDER: 'feeder',
            HIERARCHY: 'hierarchy',
            ROUTE: 'route',
        },
        TYPE: {
            SWITCH_GEAR: 'SwitchGear',
            TRANSFORMER: 'Transformer',
            LOAD: 'Load',
            NMLOAD: 'NMLoad',
            SHLOAD: 'SHLoad',
            EHLOAD: 'EHLoad',
            EHSLOAD: 'EHSLoad',
            MILOAD: 'MILoad',
            MKLOAD: 'MKLoad',
            MOLOAD: 'MOLoad',
            PKGLOAD: 'PKGLoad',

            HIERARCHY_BLDG: 'HierarchyBldg',
            HIERARCHY_FLOOR: 'HierarchyFloor',
            HIERARCHY_FEEDER: 'HierarchyFeeder',

            BLDG: 'Bldg',
            LOCATION: 'Location',
            RACEWAY: 'Raceway',
            MANHOLE: 'Manhole',

            MODIFY_FEEDER: 'ModifyFeeder',
            NEW_FEEDER: 'NewFeeder'
        },
        PREFIX: {
            DIALOG: '_DIALOG',
            DIALOG_TABLE: 'DIALOG_TABLE'
        }
    };
    this._CONFIG = {
        DEFAULT_SIZE: {
            SWITCH_GEAR: [350, 50],
            TRANSFORMER: [60, 90],
            LOAD: [70, 70],
            HIERARCHY_BLDG: [450, 300],
            HIERARCHY_FLOOR: [350, 200],
            HIERARCHY_FEEDER: [50, 50],
            BLDG: [150, 150],
            LOCATION: [50, 50],
            MANHOLE: [50, 50],
            GRID_FONT: '12px'
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
    this._SLIDER = null;

    // Canvas
    this.canvas = new OG.Canvas(container, [this._CONTAINER.width(), this._CONTAINER.height()], 'white', 'url(resources/images/symbol/grid.gif)');
    this.canvas._CONFIG.DEFAULT_STYLE.EDGE["edge-type"] = "plain";
    /**
     * 휠 스케일
     */
    this.canvas._CONFIG.WHEEL_SCALABLE = true;
    /**
     * 드래그 화면 이동
     */
    this.canvas._CONFIG.DRAG_PAGE_MOVABLE = true;

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

    /**
     * 핫키 : Ctrl+C 복사 키 가능여부
     */
    this.canvas._CONFIG.ENABLE_HOTKEY_CTRL_C = false;
    /**
     * 핫키 : Ctrl+V 붙여넣기 키 가능여부
     */
    this.canvas._CONFIG.ENABLE_HOTKEY_CTRL_V = false;
    /**
     * 핫키 : Ctrl+D 복제하기 키 가능여부
     */
    this.canvas._CONFIG.ENABLE_HOTKEY_CTRL_D = false;
    /**
     * 핫키 : Ctrl+G 그룹 키 가능여부
     */
    this.canvas._CONFIG.ENABLE_HOTKEY_CTRL_G = false;
    /**
     * 핫키 : Ctrl+U 언그룹 키 가능여부
     */
    this.canvas._CONFIG.ENABLE_HOTKEY_CTRL_U = false;

    this._RENDERER = this.canvas._RENDERER;
    this._HANDLER = this.canvas._HANDLER;
    this.init();

    //캔버스 삭제시 관련 다이아로그도 삭제한다.
    var me = this;
    $(this._CONTAINER).on("remove", function () {
        me.destroyAllDialog();
    });
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
    showSlider: function (show) {
        if (show) {
            if (!this._SLIDER) {
                var sliderId = this._CONTAINER_ID + '-slider';
                this._SLIDER = $('<div id="' + sliderId + '"></div>');
                this._CONTAINER.parent().append(this._SLIDER);

                this.canvas.addSlider({
                    slider: $('#' + sliderId),
                    width: 200,
                    height: 250,
                    appendTo: "body"
                });
            }
            this._SLIDER.closest(".ui-dialog").show();
        } else {
            if (this._SLIDER) {
                this._SLIDER.closest(".ui-dialog").hide();
            }
        }
    },
    /**
     * 해당 렌더러에 관련된 다이아로그 창을 숨기거나 보인다.
     * @param show
     */
    showDialog: function (show) {
        var me = this;
        //기존 대화장이 있을 경우 삭제하도록 한다.
        var dialogName = me._CONTAINER_ID + me.Constants.PREFIX.DIALOG;
        if (show) {
            $('[name=' + dialogName + ']').closest(".ui-dialog").show();
        } else {
            $('[name=' + dialogName + ']').closest(".ui-dialog").hide();
        }
    },
    /**
     * 도형의 다이아로그 창을 생성한다.
     * @param element
     * @param options
     * @returns {Mixed|jQuery|HTMLElement}
     */
    createDialog: function (element, options) {
        var me = this;

        //대화창의 네임스페이스
        var dialogName = me._CONTAINER_ID + me.Constants.PREFIX.DIALOG;
        var dialogId = me._CONTAINER_ID + element.id;

        //대화창을 팝업시킨다.
        var dialog = $('<div></div>');
        dialog.attr('name', dialogName);
        dialog.attr('id', dialogId);
        $('body').append(dialog);

        if (!options) {
            options = {};
        }

        var defaultOptions = {
            title: element.shape.label,
            position: {my: "left top", at: "left top", of: document.getElementById(me._CONTAINER_ID)},
            height: 400,
            width: 300,
            dialogClass: "",
            appendTo: 'body',
            close: function (event, ui) {
                me.destroyDialog(element);
            }
        };

        for (var key in options) {
            defaultOptions[key] = options[key];
        }
        dialog.dialog(defaultOptions);

        return dialog;
    },
    /**
     * 도형의 다이아로그창을 삭제한다.
     * @param element
     */
    destroyDialog: function (element) {
        var me = this;
        var dialogId = me._CONTAINER_ID + element.id;
        var dialog = $('#' + dialogId);
        if (dialog && dialog.length) {
            dialog.dialog('destroy');
            dialog.remove();
        }
    },
    destroyAllDialog: function () {
        var me = this;
        var dialogName = me._CONTAINER_ID + me.Constants.PREFIX.DIALOG;
        var dialogs = $('[name=' + dialogName + ']');
        dialogs.each(function () {
            $(this).dialog('destroy');
            $(this).remove();
        });
    },

    addBackDoor: function (url, scale, opacity) {
        var me = this, element;
        var drawBackDoor = function (url, width, height) {
            element = me.getCanvas().drawShape([width / 2, height / 2], new OG.Backdoor(url), [width, height], {
                opacity: opacity
            });
            me.getCanvas().toBack(element);
            me.getCanvas().setCustomData(element, {
                width: width,
                height: height
            });
            me.updateBackDoor(scale, opacity);
        };

        var image = new Image();
        image.src = url;
        image.onload = function () {
            var w = image.naturalWidth;
            var h = image.naturalHeight;

            //기존 백도어 삭제
            var existBackdoor = me.getCanvas().getElementsByShapeId('OG.shape.elec.Backdoor');
            if (existBackdoor && existBackdoor.length) {
                for (var i = 0; i < existBackdoor.length; i++) {
                    me.getCanvas().removeShape(existBackdoor[i]);
                }
            }
            drawBackDoor(url, w, h);
        };
    },
    updateBackDoor: function (scale, opacity) {
        var me = this;
        scale = scale ? scale : 100;
        var existBackdoor = me.getCanvas().getElementsByShapeId('OG.shape.elec.Backdoor');
        if (existBackdoor && existBackdoor.length) {
            for (var i = 0; i < existBackdoor.length; i++) {
                var boundary = me.canvas.getBoundary(existBackdoor[i]);
                var w = boundary.getWidth();
                var h = boundary.getHeight();
                var upper = boundary.getUpperLeft().y;
                var left = boundary.getUpperLeft().x;
                var customData = me.canvas.getCustomData(existBackdoor[i]);
                var width = customData.width;
                var height = customData.height;
                width = width ? width : w;
                height = height ? height : h;
                width = width * (scale / 100);
                height = height * (scale / 100);

                var style = {};
                if (opacity) {
                    style = {
                        'opacity': opacity
                    };
                    existBackdoor[i].shape.geom.style.map['opacity'] = opacity;
                }

                var resizeX = width - w;
                var resizeY = height - h;
                me.getCanvas().resize(existBackdoor[i], [0, resizeY, 0, resizeX]);
                me.getCanvas().move(existBackdoor[i], [-left, -upper]);
                me.getCanvas().setCanvasSize([width * me.canvas._CONFIG.SCALE, height * me.canvas._CONFIG.SCALE]);
                me.canvas.updateSlider();
            }
        }
    },

    //TODO
    // 툴바에 텍스트, 기타 shape 오브젝트 추가.
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

            console.log('shapeInfo', shapeInfo);
            //렌더링 대상들
            if (shapeType == me.Constants.TYPE.SWITCH_GEAR) {
                shape = new OG.SwitchGear(shapeLabel);
                size = me._CONFIG.DEFAULT_SIZE.SWITCH_GEAR;
            }
            else if (shapeType == me.Constants.TYPE.TRANSFORMER) {
                shape = new OG.SwitchTransformer(shapeLabel);
                size = me._CONFIG.DEFAULT_SIZE.TRANSFORMER;
            }
            else if (
                shapeType == me.Constants.TYPE.NMLOAD
                || shapeType == me.Constants.TYPE.SHLOAD
                || shapeType == me.Constants.TYPE.EHLOAD
                || shapeType == me.Constants.TYPE.EHSLOAD
                || shapeType == me.Constants.TYPE.MILOAD
                || shapeType == me.Constants.TYPE.MKLOAD
                || shapeType == me.Constants.TYPE.MOLOAD
                || shapeType == me.Constants.TYPE.PKGLOAD) {
                eval('shape = new OG.' + shapeType + '(shapeLabel)');
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
                position[0] = position[0] / me.canvas._CONFIG.SCALE;
                position[1] = position[1] / me.canvas._CONFIG.SCALE;
                //캔버스의 editingObject (에디팅 객체) 가 없다면 그리지 않는다.
                if (!me.editingObject) {
                    me._CONTROLLER.onMessage(me, shapeInfo, me._CONTROLLER.message.NO_EDITOR_OBJECT);

                } else {
                    shape.data = shapeInfo;
                    element = me.getCanvas().drawShape(position, shape, size);
                    me.getContainer().removeData('DRAG_SHAPE');

                    //Load 일 경우 onLoadDrop 호출
                    //트랜스포머일 경우도 onLoadDrop 호출
                    if (shape instanceof OG.Load || shape instanceof OG.SwitchTransformer) {
                        me.onLoadDrop(element);
                    }
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
     * 로드가 캔버스에 드랍되었을 경우의 처리
     */
    onLoadDrop: function (loadElement) {
        var me = this;
        var swgrElement = me.canvas.getElementsByShapeId('OG.shape.elec.SwitchGear').get(0);
        if (!swgrElement) {
            me.canvas.removeShape(loadElement);
        }

        /**
         * 스위치 기어쪽의 터미널 포지션(fromP)을 구한다.
         */
        var toBoundary = me.canvas.getBoundary(loadElement);
        var fromBoundary = me.canvas.getBoundary(swgrElement);

        var toX = toBoundary.getCentroid().x;
        var fLeft = fromBoundary.getLeftCenter().x;
        var fRight = fromBoundary.getRightCenter().x;
        var fCenter = fromBoundary.getCentroid();
        var fLow = fromBoundary.getLeftCenter().y;
        var fromP;

        //로드의 x 가 스위치의 너비 내에 있을 경우
        if (toX > fLeft && toX < fRight) {
            fromP = [toX, fLow];
        }
        //로드의 x 가 스위치의 좌측일 경우
        else if (toX <= fLeft) {
            fromP = [fLeft, fCenter.y];
        }
        //로드의 x 가 스위치의 우측일 경우
        else if (toX >= fRight) {
            fromP = [fRight, fCenter.y];
        }
        /**
         * 스위치 기어와 로드를 케이블로 연결한다.
         */
        me.canvas.connect(swgrElement, loadElement, null, null, fromP, null, null, null, new OG.CableShape());
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
        me.canvas.onMoveShape(function (event, element, offset) {
            me.isUpdated = true;
        });
        me.canvas.onResizeShape(function (event, shapeElement, offset) {
            me.isUpdated = true;
        });
        me.canvas.onConnectShape(function (event, edgeElement, fromElement, toElement) {
            me.isUpdated = true;

            /**
             * 레이스 웨이가 그려졌을 경우 전 후 location 에서 shapeLabel 을 받아와 from-to 로 라벨링을 한다.
             */
            if (edgeElement.shape instanceof OG.RacewayShape) {
                me.canvas.drawLabel(edgeElement, fromElement.shape.label + toElement.shape.label);
            }
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

        /**
         * 케이블 변경이 일어났을 경우 이벤트
         */
        $(me.canvas.getRootElement()).bind('cableChange', function (event, shapeElement, beforeShapeId, afterShapeId) {
            console.log(shapeElement, beforeShapeId, afterShapeId);
        });

        /**
         * 라우트 보기 이벤트
         */
        $(me.canvas.getRootElement()).bind('showCableList', function (event, shapeElement) {
            me.onShowCableList(shapeElement);
        });

        /**
         * 정보 보기 이벤트
         */
        $(me.canvas.getRootElement()).bind('showProperty', function (event, shapeElement) {
            me.onShowProperty(shapeElement);
        });
    },
    /**
     * 정보 보기 이벤트를 처리한다.
     * @param element
     */
    onShowProperty: function (element) {

    },
    /**
     * 해당 레이스웨이를 하이라이트 처리한다.
     * @param element
     * @param {Boolean} selected 선택 처리 여부
     */
    highLightRaceway: function (element, selected) {
        var me = this;

        //선택된 레이스웨이 애니메이션
        if (!element.shape.data) {
            element.shape.data = {};
        }
        if (selected) {
            element.shape.data.selected = true;
        } else {
            element.shape.data.highlight = true;
        }
        me.canvas.getRenderer().redrawShape(element);
    },
    /**
     * 해당 레이스웨이의 하이라이트를 종료한다.
     * @param element
     */
    unHighLightRaceway: function (element) {
        var me = this;
        //선택된 레이스웨이 애니메이션
        if (!element.shape.data) {
            element.shape.data = {};
        }
        element.shape.data.selected = false;
        element.shape.data.highlight = false;
        me.canvas.getRenderer().redrawShape(element);
    },
    /**
     * 주어진 path (도형 아이디) 목록으로부터 레이스웨이 리스트를 반환한다.
     * @param {Array} path
     * @returns {Array}
     */
    getRacewaysFromPath: function (path) {
        var me = this, from, to, edge;
        var list = [];
        if (!path || !path.length) {
            return list;
        }
        for (var i = 0, leni = path.length; i < leni; i++) {
            if (i < leni - 1) {
                from = me.canvas.getElementById(path[i]);
                to = me.canvas.getElementById(path[i + 1]);
                if (!from || !to) {
                    continue;
                }
                edge = me.canvas.getRelatedEdgeFromShapes([from, to]);
                list.push(edge);
            }
        }
        return list;
    },
    /**
     * 케이블 대화창을 삭제한다.
     * @param dialog
     * @param currentPath
     * @param selectedRaceway
     */
    destroyCableDialog: function (dialog) {
        var me = this;
        if (dialog && dialog.length) {
            dialog.dialog('destroy');
            dialog.remove();
            var raceways = me.canvas.getElementsByShapeId('OG.shape.elec.RacewayShape');
            for (var i = 0; i < raceways.length; i++) {
                me.unHighLightRaceway(raceways[i]);
            }
        }
    },
    /**
     * 해당 레이스웨이를 지나는 케이블 리스트를 팝업하고, 케이블 선택시 다른 라우트 경로를 선택가능하게 한다.
     * @param element
     */
    onShowCableList: function (element) {
        var me = this;

        //기존 대화장이 있을 경우 삭제하도록 한다.
        var dialogName = me._CONTAINER_ID + me.Constants.PREFIX.DIALOG;
        me.destroyCableDialog($('[name=' + dialogName + ']'));

        //다이어로그 창을 띄운다.
        var dialog = me.createDialog(element, {
            title: 'Cables',
            height: 400,
            width: 300,
            close: function (event, ui) {
                me.destroyCableDialog(dialog);
            }
        });
        //하이라이팅 된 패스 리스트
        var currentPath;
        me.highLightRaceway(element, true);

        //케이블 데이터를 불러온다.
        var cables = me.getCablesWithRaceway(element);

        //패널의 네임스페이스
        var panelName = me._CONTAINER_ID + me.Constants.PREFIX.DIALOG_TABLE;
        var panelId = me._CONTAINER_ID + element.id + me.Constants.PREFIX.DIALOG_TABLE;


        //케이블 그리드의 내용을 구성한다.
        for (var i = 0; i < cables.length; i++) {
            cables[i]['label'] = '<a href="#" name="item" data-index="' + i + '">' + cables[i]['name'] + '</a>';
        }
        var gridOptions = {
            data: cables,
            columns: [
                {
                    data: 'label',
                    title: 'Name',
                    defaultContent: ''
                }
            ],
            pageLength: 10,
            lengthChange: false,
            info: false
        };

        //대화창에 그리드를 삽입한다.
        var panel = $('<table></table>');
        panel.attr('name', panelName);
        panel.attr('id', panelId);
        panel.css('font-size', me._CONFIG.DEFAULT_SIZE.GRID_FONT);
        dialog.append(panel);

        //대화창에 버튼을 삽입한다.
        var alternativeBtn = $('<button class="btn-u btn-u-default" type="button" disabled>Show Alternative Route</button>');
        dialog.append(alternativeBtn);

        //어플라이 버튼을 삽입하고 숨김처리한다.
        var applyBtn = $('<button class="btn-u btn-u-default" type="button" disabled>Apply</button>');
        dialog.append(applyBtn);
        applyBtn.hide();

        if (!panel.data('table')) {
            panel.data('table', true);
            panel.DataTable(gridOptions);
            me._CONTROLLER.modifyDataTablesStyle(panelId);
        }

        var gridPanelDiv = $('#' + panelId + '_wrapper');

        /**
         * 케이블 클릭시 해당 케이블의 패스를 바탕으로 레이스웨이를 하이라이트 처리하고, 변경 버튼을 활성화한다.
         * 변경 버튼을 클릭시 그리드의 내용이 케이블이 지나갈 수 있는 변경가능한 라우트 리스트로 전환횐다.
         * 변경가능한 라우트 리스트를 선택하면 케이블에 적용.
         * @param item
         * @param itemData
         */
        var nameClickEvent = function (item, itemData) {
            item.unbind('click');
            item.click(function (event) {
                event.stopPropagation();
                var racewaysFromPath;
                if (currentPath) {
                    racewaysFromPath = me.getRacewaysFromPath(currentPath);
                    for (var i = 0; i < racewaysFromPath.length; i++) {
                        me.unHighLightRaceway(racewaysFromPath[i]);
                    }
                }

                currentPath = itemData['path'];

                racewaysFromPath = me.getRacewaysFromPath(currentPath);
                for (var i = 0; i < racewaysFromPath.length; i++) {
                    if (racewaysFromPath[i].id == element.id) {
                        me.highLightRaceway(racewaysFromPath[i], true);
                    } else {
                        me.highLightRaceway(racewaysFromPath[i]);
                    }
                }

                //어플라이 버튼 클릭 이벤트를 처리한다.
                alternativeBtn.removeAttr('disabled');
                alternativeBtn.removeClass('btn-u-default');
                alternativeBtn.unbind('click');
                alternativeBtn.bind('click', function () {

                });
            });
        };

        // page event
        panel.unbind('draw.dt');
        panel.on('draw.dt', function () {
            var item = gridPanelDiv.find("[name=item]");
            item.each(function (index, aTag) {
                var item = $(aTag);
                var dataIndex = item.data('index');
                var itemData = cables[parseInt(dataIndex)];
                nameClickEvent(item, itemData);
            });
            blockStop();
        });

        var dataTable = panel.dataTable().api();
        dataTable.clear();
        dataTable.rows.add(cables);
        dataTable.draw();
    },
    /**
     * 해당 레이스웨이를 지나는 케이블 리스트를 구한다.
     * @param element
     * @returns {Array}
     */
    getCablesWithRaceway: function (element) {
        var me = this;
        var routes = [];
        var relatedElementsFromEdge = me.canvas.getRelatedElementsFromEdge(element);
        var from = relatedElementsFromEdge.from;
        var to = relatedElementsFromEdge.to;
        if (!from || !to) {
            return routes;
        }

        var fromPaths = [];
        var toPaths = [];

        var isExcludeLocation = function (element, excludeElement, paths) {
            var isExclude = false;
            if (element.id == excludeElement.id) {
                isExclude = true;
            }
            for (var i = 0, leni = paths.length; i < leni; i++) {
                if (paths[i] == element.id) {
                    isExclude = true;
                }
            }
            return isExclude;
        };
        var findEndLocation = function (element, excludeElement, paths, fromTo) {
            //주어진 도형이 Location 일 경우 fromPaths 또는 toPaths 에 추가한 후 종료한다.
            if (element.shape instanceof OG.Location) {
                if (fromTo == 'from') {
                    fromPaths.push(paths);
                } else {
                    toPaths.push(paths);
                }
                return;
            }

            //주어진 도형에 연결된 도형들을 찾는다.
            var prevShapes = me.canvas.getPrevShapes(element);
            var nextShapes = me.canvas.getNextShapes(element);

            //연결된 도형중 excludeElement(파생되어 온 도형) 을 제외하고, paths 중 중복되는 것 또한 파기한다.
            var relatedShapes = [];
            for (var i = 0; i < prevShapes.length; i++) {
                if (!isExcludeLocation(prevShapes[i], excludeElement, paths)) {
                    relatedShapes.push(prevShapes[i]);
                }
            }
            for (var i = 0; i < nextShapes.length; i++) {
                if (!isExcludeLocation(nextShapes[i], excludeElement, paths)) {
                    relatedShapes.push(nextShapes[i]);
                }
            }
            for (var i = 0; i < relatedShapes.length; i++) {
                //paths 에 추가한다.
                var newPath = JSON.parse(JSON.stringify(paths));
                newPath.push(relatedShapes[i].id);

                //연결된 도형이 Location 일 경우 fromPaths 또는 toPaths 에 추가한 후 종료한다.
                if (relatedShapes[i].shape instanceof OG.Location) {
                    if (fromTo == 'from') {
                        fromPaths.push(newPath);
                    } else {
                        toPaths.push(newPath);
                    }
                    continue;
                }
                findEndLocation(relatedShapes[i], element, newPath, fromTo);
            }
        };
        findEndLocation(from, to, [from.id], 'from');
        findEndLocation(to, from, [to.id], 'to');

        var fromPath, toPath, concatPath, fromLocation, toLocation;
        //fromPaths,toPaths 를 하나의 패스로 연결한다. 이때 location 이 같은 것은 리스트에서 제외한다.
        for (var i = 0, leni = fromPaths.length; i < leni; i++) {
            fromPath = fromPaths[i];
            fromPath.reverse();
            for (var c = 0, lenc = toPaths.length; c < lenc; c++) {
                toPath = toPaths[c];
                fromLocation = fromPath[0];
                toLocation = toPath[toPath.length - 1];
                if (fromLocation != toLocation) {
                    concatPath = fromPath.concat(toPath);
                    routes.push(concatPath);
                }
            }
        }

        /**
         * 라우트 데이터 만들기
         */
        var data = [];
        for (var i = 0, leni = routes.length; i < leni; i++) {
            var routeData = {};
            var fromBLDG;
            var toBLDG;
            for (var c = 0, lenc = routes[i].length; c < lenc; c++) {
                //처음 또는 끝(로케이션) 이라면
                if (c == 0 || c == lenc - 1) {
                    var locationId = routes[i][c];
                    var location = me.canvas.getElementById(locationId);
                    if (location) {
                        var parent = me.canvas.getParent(location);
                        if (parent && parent.shape instanceof OG.BLDG) {
                            if (c == 0) {
                                fromBLDG = parent.shape.label;
                            } else {
                                toBLDG = parent.shape.label;
                            }
                        }
                    }
                }
            }
            //시작, 끝 로케이션이 모두 빌딩 안에 속해있다면
            if (fromBLDG && toBLDG) {
                routeData['path'] = routes[i];
                routeData['from'] = fromBLDG;
                routeData['to'] = toBLDG;
                routeData['name'] = 'Cable ' + i + ' :' + fromBLDG + ' - ' + toBLDG;
                data.push(routeData);
            }
        }
        return data;
    }
};
Renderer.prototype.constructor = Renderer;