var Renderer = function (mode, container, controller) {

    this.MSGMessages = {
        POINTMSG: '����Ʈ�� �����ؾ� �մϴ�.',
        MHPOINTMSG: '��Ȧ ����Ʈ�� �����ؾ� �մϴ�.',
        DUPLICATEMSG: '�Է��� ��Ī�� �̹� �����մϴ�.',
        LENGTHMSG: 'Legnth�� �����ؾ� �մϴ�.',
        LENGTHCKMSG: 'Length�� ���ڸ� �Է��� �� �ֽ��ϴ�.',
        TEMPMSG: 'Temp�� �����ؾ� �մϴ�.',
        TEMPCKMSG: 'Temp�� ���ڸ� �Է��� �� �ֽ��ϴ�.',
        TEMPINPUTCHK: '�Ҽ������ϸ� �Է��Ͻʽÿ�.',
        TEMPDECIMALPOINTCHK: 'Temp�� �Ҽ��� 3�ڸ������� ����մϴ�.',
        TEMPSIZECHK: 'Temp�� 80���Ϸ� �Է��ؾ� �մϴ�.',
        REMARKMSG: 'Remark�� �Է��ؾ� �մϴ�.',
        SAVEMSG: '������ �Ϸ�Ǿ����ϴ�.',
        SAVEERRORMSG: '����� ������ �߻��Ͽ����ϴ�. �����ڿ��� �����Ͻʽÿ�.',
        NOPATH: 'Path�� �����ϴ�.',
        SAMELOCATION: '���� Location�� �ֽ��ϴ�.',
        SELECTRACEWAY: '��ü ��θ� �����ؾ� �մϴ�.',
        NOOBJECTSAVE: '������ ������Ʈ�� �������� �ʽ��ϴ�.',
        POINTTOPOINTCHK: 'Point���� ������ ������ �ʽ��ϴ�.',
        SWITCHCONNECTIONCHK: '�����Ϸ��� �Ǵ� ����ġ�� �̹� ���� �Ǵ� ����ġ�� ������ �ֽ��ϴ�.',
        FEEDERINFLOOR: '�Ǵ��� ��ġ�� �÷ξ�ȿ� �������� �մϴ�.',
        POINTINLOCATION: '����Ʈ�� ��ġ�� �����̼Ǿȿ� �������� �մϴ�.',
        FEEDERTYPETR: 'Ÿ���� TR�̸� ĵ������ �׸� �� �����ϴ�.'
    }

    this.Constants = {
        MODE: {
            FEEDER: 'feeder',
            HIERARCHY: 'hierarchy',
            ROUTE: 'route',
        },

        FROM : {
            ISFROM : true
        },

        SHAPE : {
            EDGE : 'EDGE',
            GEOM : 'GEOM',
            GROUP: 'GROUP'
        },

        /**
         * FEEDER EDITOR MODE�� ���� �޴� Ŭ���� ���� SaveMODE�� �������Ѵ�.
         * SWGR�� ��쿡�� ����� new, load�� ��쿡�� �ش� �ε��Ͽ��� ����� dataTables�� �����ؾ��Ѵ�...
         * 1. ����� �޴����� ����, ĵ�������� ����� �ε� �����ÿ��� �ٽ� dataTables ��Ͽ� ����....
         * FEEDER_FEEDER���� ���� �°�쿡�� ������ �ִ� ��.
         * ���� ������ ����ġ���� �ε带 �÷����� �� �ش� load�� ������ �ؾ��ϱ� ������ � �޴����� ��� �����Դ��� �˾ƾ� �Ѵ�.
         * ������ �����Ϳ� ���� ���̺� ��带 ������.
         *
         */
        FEEDER_SAVE_MODE: {
            ISNEW : false
        },

        HIERARCHY_SAVE_MODE: {
            ISNEW : false
        },

        ROUTE_SAVE_MODE: {
            ISNEW : false
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
            LOAD: [35, 35],
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
     * ĵ������ ������ ��� ��ü - ��쿡 ���� �� ��ü�� ���ٸ� ���� �׸��⸦ ������� �ʴ´�.
     */
    this.editingObject = undefined;

    /**
     * ĵ������ ������ ��� ��ü�� GUI ��ȭ ����
     */
    this.isUpdated = false;

    /**
     * ����� �����Ϳ��� json���� ĵ������ �׸� �� ���̺� ���� �������� ���� �׸���.
     * �� ���� raceWay ������Ƽ â�� ����� �ʾƾ� �Ѵ�.
     */
    this.isRedrawRaceWayFromJson = false;

    /**
     * ���, �����̳�, ��Ʈ�ѷ� ��� (������ ��� ����)
     */
    if (!mode || !container || !controller) {
        return;
    }
    this._MODE = mode;
    this._CONTROLLER = controller;
    this._DATA_CONTROLLER = controller.dataController;
    this._CONTAINER = $('#' + container);
    this._CONTAINER_ID = container;
    this._SLIDER = null;

    // Canvas
    this.canvas = new OG.Canvas(container, [this._CONTAINER.width(), this._CONTAINER.height()], 'transparent', 'url(resources/images/symbol/grid.gif)');
    this.canvas._CONFIG.DEFAULT_STYLE.EDGE["edge-type"] = "plain";
    /**
     * �� ������
     */
    this.canvas._CONFIG.WHEEL_SCALABLE = true;
    /**
     * �巡�� ȭ�� �̵�
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
        enableContextMenu: false,
        useSlider: true,
        stickGuide: true,
        checkBridgeEdge: false,
        autoHistory: false
    });
    this.canvas._CONFIG.LABEL_MIN_SIZE = this._CONFIG.LABEL_MIN_SIZE;
    this.canvas._CONFIG.LABEL_MAX_SIZE = this._CONFIG.LABEL_MAX_SIZE;

    /**
     * ��Ű : Ctrl+C ���� Ű ���ɿ���
     */
    this.canvas._CONFIG.ENABLE_HOTKEY_CTRL_C = false;
    /**
     * ��Ű : Ctrl+V �ٿ��ֱ� Ű ���ɿ���
     */
    this.canvas._CONFIG.ENABLE_HOTKEY_CTRL_V = false;
    /**
     * ��Ű : Ctrl+D �����ϱ� Ű ���ɿ���
     */
    this.canvas._CONFIG.ENABLE_HOTKEY_CTRL_D = false;

    /**
     * ��Ű : DELETE ���� Ű ���ɿ���
     */
    this.canvas._CONFIG.ENABLE_HOTKEY_DELETE = false;

    /**
     * ��Ű : Ctrl+G �׷� Ű ���ɿ���
     */
    this.canvas._CONFIG.ENABLE_HOTKEY_CTRL_G = false;
    /**
     * ��Ű : Ctrl+U ��׷� Ű ���ɿ���
     */
    this.canvas._CONFIG.ENABLE_HOTKEY_CTRL_U = false;

    /**
     * ��Ű : UNDO REDO Ű ���ɿ���
     */
    this.canvas._CONFIG.ENABLE_HOTKEY_CTRL_Z = false;

    this._RENDERER = this.canvas._RENDERER;
    this._HANDLER = this.canvas._HANDLER;
    this.init();

    //ĵ���� ������ ���� ���̾Ʒα׵� �����Ѵ�.
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
     * �ش� �������� ���õ� ���̾Ʒα� â�� ����ų� ���δ�.
     * @param show
     */
    showDialog: function (show) {
        var me = this;
        //���� ��ȭ���� ���� ��� �����ϵ��� �Ѵ�.
        var dialogName = me._CONTAINER_ID + me.Constants.PREFIX.DIALOG;
        if (show) {
            $('[name=' + dialogName + ']').closest(".ui-dialog").show();
        } else {
            $('[name=' + dialogName + ']').closest(".ui-dialog").hide();
        }
    },
    /**
     * ������ ���̾Ʒα� â�� �����Ѵ�.
     * @param element
     * @param options
     * @returns {Mixed|jQuery|HTMLElement}
     */
    createDialog: function (element, options) {
        var me = this;

        //��ȭâ�� ���ӽ����̽�
        var dialogName = me._CONTAINER_ID + me.Constants.PREFIX.DIALOG;
        var dialogId = me._CONTAINER_ID + element.id;

        //��ȭâ�� �˾���Ų��.
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
     * ������ ���̾Ʒα�â�� �����Ѵ�.
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

    /**
     * HierarchyCanvas�� ���� ������ �׸���.
     */
    drawToHierarchyCanvasFromServerData: function(mode) {
        var me = this;

        if(mode == me.Constants.MODE.HIERARCHY ) {

            var dataInfo;
            try{
                dataInfo = parent.getFeederSWGRTree();
            } catch(e) {
                $.ajax({
                    url: 'doosan/data/hierarchy-list.json',
                    dataType: 'json',
                    async:false,
                    success: function (data) {
                        dataInfo = data;
                    },
                    error: function (err) {
                        dataInfo = [];
                    }
                });
            }

            /**
             * ������ �÷ο츦 �����ؼ� ������ ����Ʈ�� �ִ´�.
             */
            var bldgList = [];
            var floorList = [];
            dataInfo.forEach(function(item) {
                if(item.lv == 1) {
                    item['shapeType'] = me.Constants.TYPE.HIERARCHY_BLDG;
                    item['shapeLabel'] = item.nm;
                    bldgList.push(item);
                } else if(item.lv == 2) {
                    item['shapeType'] = me.Constants.TYPE.HIERARCHY_FLOOR;
                    item['shapeLabel'] = item.nm;
                    floorList.push(item);
                }
            });

            /**
             * ĵ���� ������ ����
             */
            var initHeight = (me._CONFIG.DEFAULT_SIZE.HIERARCHY_FLOOR[1] + 40) * floorList.length + (100 * floorList.length);
            if(initHeight < me.getContainer().height()) {
                initHeight = me.getContainer().height();
            }
            //canvas�� ����� �������Ѵ�.
            var size = [
                me.getContainer().width(),
                initHeight
            ];

            me.getCanvas().clear();
            me.getCanvas().setScale(1);


            me.getCanvas().setCanvasSize(size);

            /**
             * ������ ĵ������ �׸��� ���� ����
             * �ش� ������ ���� floor�� ���ڸ�ū ĵ������ ���̸� �÷��� �����Ѵ�.
             * idx�� ���� ���� ������ ��ġ�� �����ϰ� �� ���� �׷����� ������
             * ���� �������� ������ �׸���.
             * ���� ������ ĵ���� ���� ������� ���� ����, ���κ��� 100�� ����� �׸���.
             */
            var bldgIdx = 0;
            var totalBldgHeight = 0;
            bldgList.forEach(function(bldg, idx) {
                var bldgInFloorIdx = 0;
                floorList.forEach(function(floor){
                    if(bldg.hier_seq == floor.up_hier_seq) {
                        bldgInFloorIdx ++;
                    }
                });

                /**
                 * ������ ���̸� �� �����Ѵ�. bldgInFloorIdx�� ������ŭ �÷ξ��� ���� +40�� ���ؼ� ���Ѵ�.
                 * offset ������ �Բ� �־��ش�.
                 */
                var bldgHeight = (me._CONFIG.DEFAULT_SIZE.HIERARCHY_FLOOR[1] + 40) * bldgInFloorIdx;
                var adjustBldgY = 0;
                if( bldgIdx == 0) {
                    adjustBldgY = bldgHeight/2;
                    totalBldgHeight = bldgHeight + 50;
                } else {
                    adjustBldgY = totalBldgHeight + bldgHeight/2;
                    totalBldgHeight = totalBldgHeight + bldgHeight + 50;
                }

                var bldgSize = [me._CONFIG.DEFAULT_SIZE.HIERARCHY_BLDG[0], bldgHeight, adjustBldgY];

                me.drawImmediately(null, bldg, null, bldgSize ,false);
                bldgIdx++;
            });

            var bldgElements = me.getCanvas().getAllShapes();
            bldgElements.forEach(function(bldg){

                var upperCenterY = bldg.shape.geom.boundary._upperCenter.y;
                var centroidX = bldg.shape.geom.boundary._centroid.x;
                var centroidY = bldg.shape.geom.boundary._centroid.y;
                /**
                 * �ش� ������ upperCenterY�κ��� ������ 20�� ��� �׸���.
                 * ���� x��ǥ�� ������ x��ǥ�� �����Ѵ�.
                 * floor�� ĵ������ �׸��� ���� ����
                 *
                 */
                var floorIdx = 0;
                var preveFloorCenterY = 0;
                floorList.forEach(function(floor, idx) {
                    if(bldg.data.hier_seq == floor.up_hier_seq) {

                        var newCenterY = 0;
                        if(floorIdx == 0 ) {
                            newCenterY = upperCenterY + me._CONFIG.DEFAULT_SIZE.HIERARCHY_FLOOR[1]/2;
                        } else {
                            newCenterY = preveFloorCenterY + me._CONFIG.DEFAULT_SIZE.HIERARCHY_FLOOR[1] + 40;
                        }

                        preveFloorCenterY = newCenterY;
                        var floorSize = [centroidX, newCenterY];

                        me.drawImmediately(null, floor, null, floorSize ,false);
                        floorIdx++;
                    }
                });
            });

            //       me.drawImmediately(null, feederSwgrList[i], null, ,false);
        }
        $.unblockUI();

    },

    drawToRouteCanvasFromServerData: function(mode) {
        var me = this;
        me._CONTROLLER.settingRouteEditorMenu(me._CONTROLLER);
        var panel = me._CONTROLLER.model.BldgReferenceList.panel;
        setTimeout(me._CONTROLLER.redrawDataTables, 160, panel, me._CONTROLLER.initBldgReferenceList, me._CONTROLLER);
        $.unblockUI();
    },

    /**
     * compared is boolean
     */
    compareAndRemove: function(compared) {
        var me = this;
        var currentCanvas = me.getCanvas();
        var feederList;
        try {
            feederList = parent.getFeederList();
        } catch(e) {
            feederList = [];
        }
        var allShape = currentCanvas.getAllShapes();
        if(compared) {
            allShape.forEach(function(shapeElement){
                if(shapeElement.shape instanceof OG.HierarchyFeeder) {
                    var deleteItem = true;
                    feederList.some(function(feeder){
                        // ������ �����ȴٴ� ���� �����ϴ� item�̱� ������ deleteItem�� �ƴϴ�.
                        if(feeder.fe_swgr_load_div == 'S' && feeder.swgr_seq == shapeElement.shape.data.swgr_seq) {
                            deleteItem = false;
                        }
                    });
                    // true��� ���� �ᱹ ������ item�̱⶧���� ������ �Ѵ�.
                    if(deleteItem) {
                        me._CONTROLLER.deleteFeederHierarchyList.push(shapeElement.shape.data);
                        currentCanvas.removeShape(shapeElement);
                    }
                }
            });
        }
    },

    // renderer.canvas, dataModal, 'json', data
    loadWrapper: function(renderer, modal, type, data) {
        if(modal != null) {
            modal.find('.close').click();
        }

        var canvas = renderer.getCanvas();

        if(type == 'json') {
            canvas.loadJSON(data);
        } else {
            canvas.loadXML(data)
        }

        if(renderer.getMode() == renderer.Constants.MODE.HIERARCHY) {
            /**
             * ������ ����ġ�Ǵ��� �ִ��� üũ�ϰ� �ش� ����ġ �Ǵ��� �����.
             * ������ ���̾��Ű �Ǵ� ����Ʈ�� �̹� ������ �Ǵ��� �����ϱ� ������
             * ���� �� �Ķ���͸� ���� �׸��带 ������� �ʰ� �����.
             */
            renderer.compareAndRemove(true);
            renderer._CONTROLLER.saveSettingHierarchyMode(renderer);
            renderer._CONTROLLER.initHierarchyClickTab = true;
        } else if(renderer.getMode() == renderer.Constants.MODE.ROUTE) {
            renderer._CONTROLLER.settingRouteEditorMenu(renderer._CONTROLLER);
            var panel = renderer._CONTROLLER.model.BldgReferenceList.panel;
            setTimeout(renderer._CONTROLLER.redrawDataTables, 160, panel, renderer._CONTROLLER.initBldgReferenceList, renderer._CONTROLLER);
            /**
             * ROUTE�� �׸��� �� ���� ĵ������ �׸��� Bldg�� ������ �׸��带 ���� �׷��� �Ѵ�.
             */

            var shapeList = canvas.getAllShapes();
            shapeList.forEach(function(shapeElement){
                if(shapeElement.shape instanceof OG.BLDG) {
                    renderer._CONTROLLER.usedBldgReferenceList.push(shapeElement.shape.data);
                }
            });

            var updateList = renderer._CONTROLLER.usedBldgReferenceList;

            // ��ü ������ �׸� ���Ŀ� ����� load item�� �����ϰ� �ش� �׸��带 �ٽ� �׷��� �Ѵ�.
            var unUsedBldgReferenceList = renderer._CONTROLLER.initBldgReferenceList;
            var newList = [];
            for (var k = 0; k < unUsedBldgReferenceList.length; k++) {
                var isDuplicated = false;
                for (var j = 0; j < updateList.length; j++) {
                    if (unUsedBldgReferenceList[k].loc_ref_seq == updateList[j].loc_ref_seq) {
                        isDuplicated = true;
                    }
                }

                if (!isDuplicated) {
                    newList.push(unUsedBldgReferenceList[k]);
                }
            }

            var panel = renderer._CONTROLLER.model.BldgReferenceList.panel;
            renderer._CONTROLLER.redrawDataTables(panel, newList, renderer._CONTROLLER);

        }
        $.unblockUI();
    },

    //TODO
    // ���ٿ� �ؽ�Ʈ, ��Ÿ shape ������Ʈ �߰�.
    // ���� ������ �ľ��Ͽ� �����̼� ���� ��Ȯ�ϰ� �����
    // ���� CRUD �����


    /**
     * �׸���κ��� ���� �������� canvas�� �׸� json������ ���ٸ� �ش� ��ü�� seq�ѹ��� ���� ��ü ����Ʈ�� �����´�.
     * �� ����Ʈ�� ĵ�ٽ��� ���� �׸���.
     *
     */
    drawToFeederCanvasFromServerData: function(shapeData, panel) {
        //var startDate =  new Date();

        var me = this;
        var list = parent.getFeederInfo(shapeData.swgr_list_seq);
        var data = JSON.parse(JSON.stringify(shapeData));
        var totalList = [];

        //�������� ������ ������Ʈ�� �����Ѵ�.
        me.editingObject = data;

        var switchGear = null;
        for(var i=0; i<list.length; i++) {
            var item = list[i];
            if(item.fe_swgr_load_div == 'S' && item.swgr_seq == shapeData.swgr_seq) {
                switchGear = item;
                continue;
            }

            if(item.fe_swgr_load_div != 'SPARE') {
                totalList.push(item);
            }
        }

        switchGear['shapeType'] = me.Constants.TYPE.SWITCH_GEAR;
        var defaultSwitchGearSize = me._CONFIG.DEFAULT_SIZE.SWITCH_GEAR;
        /**
         * 1. list�� ����� ���ϰ� �ε��� ����Ʈ ����� ���� ������ ���� +20�� ���Ѵ�.
         * 2. �� ���� ���� ����� ���� �������� ���� �ȴ�.
         */
        var shapeResize = defaultSwitchGearSize[0];
        if(totalList.length > 1) {
            shapeResize = ( (totalList.length-1)*(me._CONFIG.DEFAULT_SIZE.LOAD[0]+20) );
            if(shapeResize < defaultSwitchGearSize[0]) {
                shapeResize = defaultSwitchGearSize[0];
            }
        }

        /**
         * ĵ������ �ʱ� ����� ����ġ�� ��ü ���̿��� 200�� ���� ��ŭ �����Ѵ�.
         */
        var adjustNewWidth = shapeResize + 200;
        if(adjustNewWidth < me.getContainer().width()) {
            adjustNewWidth = me.getContainer().width();
        }

        me.getCanvas().clear();
        me.getCanvas().setScale(1);
        //canvas�� ����� �������Ѵ�.
        var size = [
            adjustNewWidth,
            me.getContainer().height()
        ];

        me.getCanvas().setCanvasSize(size);

        // ���߾� ��ǥ�� position = [me.getContainer().width() / 2, me.getContainer().height() / 2]
        // ���� ����ġ�� �� �߾� ��ǥ���� ���� ���� ��ǥ�� (me.getContainer().width()/2) - (adjustNewWidth/2)
        var newCenterPosition = shapeResize/2 + 100;
        // ����ġ�� ���̰� ������� ���� �����ؼ� ĵ���� �� ������ 100������ ������ ����� �߾��� ��� �׸���.
        var newShapeAdjustSize = [shapeResize, newCenterPosition, 100];
        // ���� ����ġ�� ���� �׸���.
        me.drawImmediately(null, switchGear, null, newShapeAdjustSize);

        /**
         * web worker�� ���� �� �� �ٵ�� �ɷ�
         * ����� rough�ϰ� �ڵ� �׽��ø� Ȯ��
         *
         */

        //worker.postMessage(totalList.length);
        var initLeftPosition = 0;
        //worker.onmessage = function (event) {

        me.getCanvas().fastLoadingON();
        totalList.forEach(function(element){
            if(element.fe_swgr_load_div == 'L') {
                element['shapeType'] = element.lo_type+"Load";
                element['shapeLabel'] = element.lo_equip_tag_no;
            } else if(element.fe_swgr_load_div == 'S') {
                element['shapeType'] = me.Constants.TYPE.TRANSFORMER;
                element['shapeLabel'] = element.swgr_name;
            } else if(element.fe_swgr_load_div == 'SPARE') {
                return;
            }
            if(initLeftPosition == 0) {
                // ���� ��ġ�� ����ġ �� �� ��ǥ�κ��� �������� �ε��� �߾� �������� ���ݸ�ŭ �̵����Ѿ��Ѵ�.
                // ����ġ�� �� ���� ĵ�ٽ� ���� ������ 100�� ����� �׷ȱ� ������
                initLeftPosition = 100 + me._CONFIG.DEFAULT_SIZE.LOAD[0]/2;
            } else {
                // ���ʿ� �׷��� ���� �ƴ϶�� ���� �����ǿ��� �ε��� ���ݸ�ŭ �̵���Ų��. �׸���
                // ����ġ�� width�� ������ �� �ε� �Ǵ� Ʈ�������� ����ŭ +20�� �߱� ������ �� ���ڵ� �Բ� ������.
                initLeftPosition = initLeftPosition + me._CONFIG.DEFAULT_SIZE.LOAD[0] + 20;
            }
            var initShapeAdjustSize = [0, initLeftPosition, -100];
            me.drawImmediately(null, element, null, initShapeAdjustSize, me.Constants.FROM.ISFROM);
        });
        me.getCanvas().fastLoadingOFF();
        $.unblockUI();

        //var endDate = new Date();
        //var diff = endDate - startDate;
        //console.log('Diff: ' + diff);
    },

    /**
     * drawImmediately���Ŀ� �׸��� redraw�� ���� ������ �¿��.
     */
    reloadGridAfterDrawImmediately: function(shape, shapeInfo, panel) {

        var me = this;

        // �ѹ��� üũ�� �ƿ� �ؿ� ���� �¿�� ������ üũ�Ѵ�.
        if (!me.editingObject) {
            return false;
        }

        var newList = [];
        //�ش� �������� �ε��̰� UnAssignedLoadList���� �Ѿ�� �������̶��
        if(shape instanceof OG.Load &&
            (shapeInfo.model == me._CONTROLLER.model.UnAssignedLoadList.name)
        ) {

            //�ش� �������� ���� loadlist�� ������ �����Ѵ�.
            var usedLoadList = me._CONTROLLER.usedLoadList;
            usedLoadList.push(shapeInfo);
            // ��ü ������ �׸� ���Ŀ� ����� load item�� �����ϰ� �ش� �׸��带 �ٽ� �׷��� �Ѵ�.
            var unloadList = me._CONTROLLER.initUnusedLoadList;
            for(var i=0; i<unloadList.length; i++) {
                var isDuplicated = false;
                for(var j=0; j<usedLoadList.length; j++) {
                    if(unloadList[i].load_list_seq == usedLoadList[j].load_list_seq) {
                        isDuplicated = true;
                    }
                }

                if(!isDuplicated) {
                    newList.push(unloadList[i]);
                }
            }

            // �ش� �׸��� ���� �׸���.
            var dataTable = panel.dataTable().api();
            var currentPage = dataTable.page();
            dataTable.clear();
            dataTable.rows.add(newList);
            dataTable.draw();
            dataTable.page(currentPage).draw(false);

        }
        // �ش� �������� Ʈ���������̰� model�� SwgrList���
        else if(shape instanceof OG.SwitchTransformer &&
            (shapeInfo.model == me._CONTROLLER.model.SwgrList.name)
        ) {

            //�ش� �������� ���� switchlist�� ������ �����Ѵ�.
            var usedSwitchList = me._CONTROLLER.usedSwitchList;
            usedSwitchList.push(shapeInfo);
            // ��ü ������ �׸� ���Ŀ� ����� load item�� �����ϰ� �ش� �׸��带 �ٽ� �׷��� �Ѵ�.
            var unswitchList = me._CONTROLLER.initUnusedSwitchList;
            for(var i=0; i<unswitchList.length; i++) {
                var isDuplicated = false;
                for(var j=0; j<usedSwitchList.length; j++) {
                    if(unswitchList[i].swgr_list_seq == usedSwitchList[j].swgr_list_seq) {
                        isDuplicated = true;
                    }
                }

                if(!isDuplicated) {
                    newList.push(unswitchList[i]);
                }
            }

            // �ش� �׸��� ���� �׸���.
            var dataTable = panel.dataTable().api();
            var currentPage = dataTable.page();
            dataTable.clear();
            dataTable.rows.add(newList);
            dataTable.draw();
            dataTable.page(currentPage).draw(false);

        }
        // �ش� �������� ����ġ�̰� model�� SwgrList���
        else if(shape instanceof OG.HierarchyFeeder &&
            (shapeInfo.model == me._CONTROLLER.model.HierarchyFeederList.name)
        ) {

            //�ش� �������� ���� switchlist�� ������ �����Ѵ�.
            var usedHierarchyFeederList = me._CONTROLLER.usedHierarchyFeederList;
            usedHierarchyFeederList.push(shapeInfo);
            // ��ü ������ �׸� ���Ŀ� ����� load item�� �����ϰ� �ش� �׸��带 �ٽ� �׷��� �Ѵ�.
            var unUsedHierarchyFeederList = me._CONTROLLER.initUnusedHierarchyFeederList;
            for(var i=0; i<unUsedHierarchyFeederList.length; i++) {
                var isDuplicated = false;
                for(var j=0; j<usedHierarchyFeederList.length; j++) {
                    if(unUsedHierarchyFeederList[i].swgr_seq == usedHierarchyFeederList[j].swgr_seq) {
                        isDuplicated = true;
                    }
                }

                if(!isDuplicated) {
                    newList.push(unUsedHierarchyFeederList[i]);
                }
            }

            // �ش� �׸��� ���� �׸���.
            var dataTable = panel.dataTable().api();
            var currentPage = dataTable.page();
            dataTable.clear();
            dataTable.rows.add(newList);
            dataTable.draw();
            dataTable.page(currentPage).draw(false);

        }
        // �ش� �������� �����̰� model�� SwgrList���.
        else if(shape instanceof OG.BLDG &&
            (shapeInfo.model == me._CONTROLLER.model.BldgReferenceList.name)
        ) {

            //�ش� �������� ���� switchlist�� ������ �����Ѵ�.
            var usedBldgReferenceList = me._CONTROLLER.usedBldgReferenceList;
            usedBldgReferenceList.push(shapeInfo);
            // ��ü ������ �׸� ���Ŀ� ����� load item�� �����ϰ� �ش� �׸��带 �ٽ� �׷��� �Ѵ�.
            var unUsedBldgReferenceList = me._CONTROLLER.initBldgReferenceList;
            for(var i=0; i<unUsedBldgReferenceList.length; i++) {
                var isDuplicated = false;
                for(var j=0; j<usedBldgReferenceList.length; j++) {
                    if(unUsedBldgReferenceList[i].loc_ref_seq == usedBldgReferenceList[j].loc_ref_seq) {
                        isDuplicated = true;
                    }
                }

                if(!isDuplicated) {
                    newList.push(unUsedBldgReferenceList[i]);
                }
            }

            // �ش� �׸��� ���� �׸���.
            var dataTable = panel.dataTable().api();
            var currentPage = dataTable.page();
            dataTable.clear();
            dataTable.rows.add(newList);
            dataTable.draw();
            dataTable.page(currentPage).draw(false);

        }
    },

    /**
     * �� ��Ʈ�ѷ����� �޾ƿ� �����͸� �������� ĵ������ ������ �׸���.
     * @param offset
     * @param shapeInfo
     */
    drawImmediately: function (offset, shapeInfo, panel, newShapeAdjustSize, from) {
        var me = this;
        var shape, element, id, size, position;
        if (shapeInfo && shapeInfo['shapeType']) {
            var shapeType = shapeInfo['shapeType'];
            var shapeLabel = shapeInfo['shapeLabel'] ? shapeInfo['shapeLabel'] : '';

            //������ ����
            if (shapeType == me.Constants.TYPE.SWITCH_GEAR) {
                shape = new OG.SwitchGear(shapeLabel);
                size = me._CONFIG.DEFAULT_SIZE.SWITCH_GEAR;
                if(newShapeAdjustSize != null) {
                    if(newShapeAdjustSize[0] !=0) {
                        size = [newShapeAdjustSize[0], 50];
                    }
                }
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
                if(newShapeAdjustSize != null) {
                    //SWITCH_GEAR: [350, 50]
                    size = newShapeAdjustSize;
                }
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
                shape = new OG.Manhole('resources/images/elec/manhole.png', shapeLabel);
                size = me._CONFIG.DEFAULT_SIZE.MANHOLE;
            }

            //viewController �� �����ؾ� �ϴ� ����
            else if (shapeType == me.Constants.TYPE.NEW_FEEDER) {
                me._CONTROLLER.onMessage(me, shapeInfo, me._CONTROLLER.message.NEW, panel);
                return;
            } else if (shapeType == me.Constants.TYPE.MODIFY_FEEDER) {
                me._CONTROLLER.onMessage(me, shapeInfo, me._CONTROLLER.message.NEW, panel);
                return;
            }

            if (shape) {
                //offset �� ���ٸ� �����̳��� �߾��� �������� ��´�.
                if (!offset) {
                    var initWidth = me.getContainer().width() / 2;
                    var initHeight = me.getContainer().height() / 2;
                    // ���ο� �������� �����Ѵٸ�
                    if(newShapeAdjustSize != null) {
                        if(shapeType == me.Constants.TYPE.HIERARCHY_BLDG) {
                            initWidth = newShapeAdjustSize[0]/2  + 100;
                            initHeight = newShapeAdjustSize[2] + 50;
                        } else if(shapeType == me.Constants.TYPE.HIERARCHY_FLOOR) {
                            initWidth = newShapeAdjustSize[0];
                            initHeight = newShapeAdjustSize[1] + 20;
                        } else {
                            initWidth = newShapeAdjustSize[1];
                            // �ؿ� ���� �ε� �� Ʈ�������Ӹ� ���� ���� 100���� �ø���.
                            initHeight = initHeight - newShapeAdjustSize[2];
                        }
                    }

                    position = [initWidth, initHeight];
                } else {
                    position = [
                        offset[0] - me.getContainer().offset().left + me.getContainer()[0].scrollLeft,
                        offset[1] - me.getContainer().offset().top + me.getContainer()[0].scrollTop
                    ];
                }
                position[0] = position[0] / me.canvas._CONFIG.SCALE;
                position[1] = position[1] / me.canvas._CONFIG.SCALE;
                //ĵ������ editingObject (������ ��ü) �� ���ٸ� �׸��� �ʴ´�.
                if (!me.editingObject) {
                    me._CONTROLLER.onMessage(me, shapeInfo, me._CONTROLLER.message.NO_EDITOR_OBJECT, panel);

                } else {
                    shape.data = shapeInfo;

                    // �ε� ����Ʈ���� �Ѿ�� ������� 
                    if(shape.data.model == me._CONTROLLER.model.UnAssignedLoadList.name) {
                        // parent.checkLSValidator(load_seq, swgr_seq)�� üũ�Ѵ�.
                        // false�� �׸��� ���� ���. return
                        // returnData JSONList
                        //{error : "false", msg : ''
                        var isValidate = true;
                        var validateData = me._DATA_CONTROLLER.makeCheckLSValidatorData(me);
                        //parent.checkLSValidator(shape.data.load_list_seq, validateData, function(checked){
                            //    if(checked == 'true') {
                            element = me.getCanvas().drawShape(position, shape, size);
                            me.getContainer().removeData('DRAG_SHAPE');

                            //Load �� ��� onLoadDrop ȣ��
                            //Ʈ���������� ��쵵 onLoadDrop ȣ��
                            if (shape instanceof OG.Load || shape instanceof OG.SwitchTransformer) {
                                me.onLoadDrop(element, from);
                            }

                            me.reloadGridAfterDrawImmediately(shape, shapeInfo, panel);
                            //	}
                            //});

                        return;
                    }

                    element = me.getCanvas().drawShape(position, shape, size);
                    $(element).bind('dblclick', function (event) {
                        if(me.getMode() == me.Constants.MODE.ROUTE) {
                            if(element.shape.data.shapeType == me.Constants.TYPE.LOCATION) {
                                me.showPointDialog(null, null, panel, element, 'dblclick');
                                event.stopPropagation();
                            } else if(element.shape.data.shapeType == me.Constants.TYPE.MANHOLE) {
                                me.showManholeDialog(null, null, panel, element, 'dblclick');
                                event.stopPropagation();
                            } else if(element.shape.data.shapeType == me.Constants.TYPE.BLDG) {
                                me.showLocationDialog(null, null, panel, element, 'dblclick');
                                event.stopPropagation();
                            }
                        }
                    });
                    me.getContainer().removeData('DRAG_SHAPE');

                    //Load �� ��� onLoadDrop ȣ��
                    //Ʈ���������� ��쵵 onLoadDrop ȣ��
                    if (shape instanceof OG.Load || shape instanceof OG.SwitchTransformer) {
                        me.onLoadDrop(element, from);
                    }

                    // ���̶�Ű�� �Ǵ����� �Ѿ�Դٸ�
                    if(shape.data.shapeType == me.Constants.TYPE.HIERARCHY_FEEDER) {
                        me._CONTROLLER.updateFeederHierarchyList.push(shape.data);
                    }
                }
            }
        }

        /**
         *  drawImmediately���Ŀ� �׸��� redraw�� ���� ������ �¿��.
         */
        me.reloadGridAfterDrawImmediately(shape, shapeInfo, panel);

    },

    /**
     * �� ��Ʈ�ѷ����� ��� �̺�Ʈ�� �� ����� ó��.
     * ��� �� ������ ĵ���� �����̳� ���� ���� ��츸 ó���Ѵ�.
     */
    bindDropEvent: function () {
        var me = this;
        me.getContainer().bind('drop.viewController', function (event, controllerEvent, jsonData, panel) {
            var pageX = controllerEvent.pageX;
            var pageY = controllerEvent.pageY;

            var left = me.getContainer().offset().left;
            var top = me.getContainer().offset().top;
            var right = left + me.getContainer().width();
            var bottom = top + me.getContainer().height();
            if (pageX > left && pageX < right && pageY > top && pageY < bottom) {

                if(jsonData.shapeType == me.Constants.TYPE.MODIFY_FEEDER){

                    if( (jsonData.model == me._CONTROLLER.model.FeederList.name || jsonData.model == me._CONTROLLER.model.AssignedFeederList.name)
                        && jsonData.swgr_type == 'TR' ) {
                        msgBox(me.MSGMessages.FEEDERTYPETR);
                        return;
                    }
                    me._CONTROLLER.onMessage(me, jsonData, me._CONTROLLER.message.MOD, panel);

                } else {
                    if(me.getMode() == me.Constants.MODE.HIERARCHY) {
                        // Ʈ������ �Ѿ�Դٸ� panel�� undefined
                        if(!panel) {
                            /**
                             * canvas�� �巡�� ����� ����, floor�� �̹� �����Ѵٸ�
                             * �׸��� �ʴ´�.
                             * üũ ���� �߰�
                             */
                            var checkedData = me._CONTROLLER.checkBldgsAndFloors(me, jsonData);
                            if(checkedData.isDraw) {
                                me.drawImmediately([pageX, pageY], jsonData, panel);
                            } else {
                                msgBox(checkedData.msg);
                            }
                        } else {


                            if(jsonData.fe_type == 'TR') {
                                me.drawImmediately([pageX, pageY], jsonData, panel);

                                // select Parent feeder_list_mgt_seq : up_feeder_list_mgt_seq
                                var parentFeederListMgtSeq = jsonData.up_feeder_list_mgt_seq;
                                var parentFeeder = null;
                                var initUnusedHierarchyFeederList = me._CONTROLLER.initUnusedHierarchyFeederList;
                                initUnusedHierarchyFeederList.some(function(item) {
                                    if(item.feeder_list_mgt_seq == parentFeederListMgtSeq) {
                                        parentFeeder = item;
                                    }
                                });

                                if(parentFeeder != null) {
                                    var currentCanvas = me.getCanvas();
                                    var checkShapeList = currentCanvas.getAllShapes();
                                    /**
                                     * �׸��� ���� ��ü �ѹ� �׷����ٰ� �ϳ��� ������ ��찡 �ִٸ� parent�� �׸��� �ȵȴ�.
                                     * üũ ������ �ѹ� �� ����.
                                     */
                                    var isDraw = true;
                                    checkShapeList.some(function(shapeElement){
                                        if(shapeElement.shape instanceof OG.HierarchyFeeder) {
                                            if(shapeElement.shape.data.feeder_list_mgt_seq == parentFeeder.feeder_list_mgt_seq) {
                                                isDraw = false;
                                            }
                                        }
                                    });

                                    if(isDraw) {
                                        me.drawImmediately([pageX+150, pageY], parentFeeder, panel);
                                    }
                                    // parent�� child�� element�� ã�Ƽ� �����Ѵ�.
                                    var parentElement, childElement;
                                    var shapeList = currentCanvas.getAllShapes();
                                    shapeList.forEach(function(shapeElement){
                                        if(shapeElement.shape instanceof OG.HierarchyFeeder) {
                                            // parent element
                                            if(shapeElement.shape.data.feeder_list_mgt_seq == parentFeederListMgtSeq) {
                                                parentElement = shapeElement;
                                            } else if(shapeElement.shape.data.feeder_list_mgt_seq == jsonData.feeder_list_mgt_seq) {
                                                childElement = shapeElement;
                                            }
                                        }
                                    });
                                    me.canvas.connect(parentElement, childElement, null, null, null, null, null, null, new OG.CableShape());
                                }
                            } else {
                                me.drawImmediately([pageX, pageY], jsonData, panel);
                                var childFeeder = null;
                                var initUnusedHierarchyFeederList = me._CONTROLLER.initUnusedHierarchyFeederList;
                                initUnusedHierarchyFeederList.some(function(initItem) {
                                    if(initItem.fe_type == 'TR' && initItem.up_feeder_list_mgt_seq == jsonData.feeder_list_mgt_seq) {
                                        childFeeder = initItem;
                                    }
                                });

                                if(childFeeder != null) {
                                    var currentCanvas = me.getCanvas();
                                    var checkShapeList = currentCanvas.getAllShapes();
                                    var isDraw = true;
                                    checkShapeList.some(function(shapeElement){
                                        if(shapeElement.shape instanceof OG.HierarchyFeeder) {
                                            if(shapeElement.shape.data.feeder_list_mgt_seq == childFeeder.feeder_list_mgt_seq) {
                                                isDraw = false;
                                            }
                                        }
                                    });

                                    if(isDraw) {
                                        me.drawImmediately([pageX+150, pageY], childFeeder, panel);
                                    }
                                    // parent�� child�� element�� ã�Ƽ� �����Ѵ�.
                                    var currentCanvas = me.getCanvas();
                                    var shapeList = currentCanvas.getAllShapes();
                                    var parentElement, childElement;
                                    shapeList.forEach(function(shapeElement){
                                        if(shapeElement.shape instanceof OG.HierarchyFeeder) {
                                            // parent element
                                            if(shapeElement.shape.data.feeder_list_mgt_seq == jsonData.feeder_list_mgt_seq) {
                                                parentElement = shapeElement;
                                            } else if(shapeElement.shape.data.feeder_list_mgt_seq == childFeeder.feeder_list_mgt_seq) {
                                                childElement = shapeElement;
                                            }
                                        }
                                    });
                                    me.canvas.connect(parentElement, childElement, null, null, null, null, null, null, new OG.CableShape());


                                }
                            }


                        }
                    } else if(me.getMode() == me.Constants.MODE.ROUTE) {

                        if(jsonData.shapeType == me.Constants.TYPE.LOCATION) {
                            me.showPointDialog([pageX, pageY], jsonData, panel, null, 'ondrop');
                        } else if(jsonData.shapeType == me.Constants.TYPE.MANHOLE) {
                            me.showManholeDialog([pageX, pageY], jsonData, panel, null, 'ondrop');
                        }  else if(jsonData.shapeType == me.Constants.TYPE.BLDG) {
                            me.showLocationDialog([pageX, pageY], jsonData, panel, null, 'ondrop');
                        } else {
                            me.drawImmediately([pageX, pageY], jsonData, panel);
                        }
                    } else {
                        me.drawImmediately([pageX, pageY], jsonData, panel);
                    }
                }
            }
        });
    },

    /**
     * label����� ����� raceway�� �󺧵� ������ �Ǿ�� �Ѵ�.
     */
    changeEdgeLabel: function(shapeElement) {

        var me = this;
        var currentCanvas = me.getCanvas();

        var prevEdges = currentCanvas.getPrevEdges(shapeElement);
        var nextEdges = currentCanvas.getNextEdges(shapeElement);

        prevEdges.forEach(function(prevEdge){
            var relatedElementsFromEdge = currentCanvas.getRelatedElementsFromEdge(prevEdge);
            var edgeLabel = relatedElementsFromEdge.from.shape.label + relatedElementsFromEdge.to.shape.label;
            prevEdge.shape.data['race_ref_from'] = relatedElementsFromEdge.from.shape.label;
            prevEdge.shape.data['race_ref_to'] = relatedElementsFromEdge.to.shape.label;
            prevEdge.data['race_ref_from'] = relatedElementsFromEdge.from.shape.label;
            prevEdge.data['race_ref_to'] = relatedElementsFromEdge.to.shape.label;
            currentCanvas.drawLabel(prevEdge, edgeLabel);
        });

        nextEdges.forEach(function(nextEdge){
            var relatedElementsFromEdge = currentCanvas.getRelatedElementsFromEdge(nextEdge);
            var edgeLabel = relatedElementsFromEdge.from.shape.label + relatedElementsFromEdge.to.shape.label;
            nextEdge.shape.data['race_ref_from'] = relatedElementsFromEdge.from.shape.label;
            nextEdge.shape.data['race_ref_to'] = relatedElementsFromEdge.to.shape.label;
            nextEdge.data['race_ref_from'] = relatedElementsFromEdge.from.shape.label;
            nextEdge.data['race_ref_to'] = relatedElementsFromEdge.to.shape.label;
            currentCanvas.drawLabel(nextEdge, edgeLabel);
        });

    },

    /**
     * eventType�� ondrop�̸� �巡�� ������� ĵ������ �׸� ����̴�.
     * ���� 'dblclick'�̶�� �׷��� ������ �Ӽ��� �����ϱ� ���� �̺�Ʈ�̴�.
     */
    showLocationDialog: function(offset, jsonData, panel, shapeElement, eventType) {
        var me = this;
        var element ={};
        element['id'] = 'BldgDialog';
        element['shape'] = {};
        element.shape = {label:'Location Properties'};
        //���� ��ȭ���� ���� ��� �����ϵ��� �Ѵ�.
        var dialogName = me._CONTAINER_ID + me.Constants.PREFIX.DIALOG;
        me.destroyAllDialog($('#'+dialogName));
        // show Dialog
        var dialog = me.createDialog(element, {
            title: 'Location Properties',
            position: {my: "center", at: "center", of: document.getElementById(me._CONTAINER_ID)},
            height: 260,
            width: 340,
            closeOnEscape: false,
            resizable: false,
            dialogClass: "noClose"
        });

        $('.noClose .ui-dialog-titlebar-close').css('display', 'none');

        // �Ӽ� ���̺�
        var panel = $('#locationProperty').clone();
        panel[0].id = 'cloneLocationProperty';
        dialog.append(panel);
        // ���� ��ư
        var applyBtn = $('<button class="btn btn-primary" id="applyLocationProperty" type="button" style="margin-left:95px">Apply</button>');
        dialog.append(applyBtn);
        // ��� ��ư
        var cancelBtn = $('<button class="btn btn-white" id="cancelLocationProperty" type="button" style="left:29px">Cancel</button>');
        dialog.append(cancelBtn);

        $("#cancelLocationProperty").click(function(event){
            $(this).remove();
            dialog.dialog( "close" );
        });

        if(eventType == 'dblclick') {
            $("#cloneLocationProperty").find(".locationPoint").val(shapeElement.shape.data['shapeLabel']);
            $("#cloneLocationProperty").find(".locationLength").val(shapeElement.shape.data['loc_ref_length']);
            $("#cloneLocationProperty").find(".locationTemp").val(shapeElement.shape.data['loc_ref_temp']);
            $("#cloneLocationProperty").find(".locationRemark").val(shapeElement.shape.data['loc_ref_rem']);
        }

        $("#applyLocationProperty").click(function(event){

            if($("#cloneLocationProperty").find(".locationLength").val().trim().length == 0) {
                msgBox(me.MSGMessages.LENGTHMSG, $("#cloneLocationProperty").find(".locationLength"));
                return;
            }

            var regNumber = /^[0-9]*$/;
            if(!regNumber.test($("#cloneLocationProperty").find(".locationLength").val())) {
                msgBox(me.MSGMessages.LENGTHCKMSG, $("#cloneLocationProperty").find(".locationLength"));
                return;
            }

            if($("#cloneLocationProperty").find(".locationTemp").val().trim().length == 0) {
                msgBox(me.MSGMessages.TEMPMSG, $("#cloneLocationProperty").find(".locationTemp"));
                return;
            }

            if(!regNumber.test($("#cloneLocationProperty").find(".locationTemp").val())) {
                msgBox(me.MSGMessages.TEMPCKMSG, $("#cloneLocationProperty").find(".locationTemp"));
                return;
            }

            if(eventType == 'ondrop') {
                jsonData.loc_ref_length = $("#cloneLocationProperty").find(".locationLength").val().trim();
                jsonData.loc_ref_temp = $("#cloneLocationProperty").find(".locationTemp").val().trim()
                jsonData.loc_ref_rem = $("#cloneLocationProperty").find(".locationRemark").val().trim()
                $(this).remove();
                dialog.dialog( "close" );
                var gridPanel = me._CONTROLLER.model.BldgReferenceList.panel;
                me.drawImmediately(offset, jsonData, gridPanel);
            } else if(eventType == 'dblclick') {
                shapeElement.shape.data['loc_ref_length']  = $("#cloneLocationProperty").find(".locationLength").val().trim();
                shapeElement.shape.data['loc_ref_temp']    = $("#cloneLocationProperty").find(".locationTemp").val().trim();
                shapeElement.shape.data['loc_ref_rem']     = $("#cloneLocationProperty").find(".locationRemark").val().trim();

                shapeElement.data['loc_ref_length']  = $("#cloneLocationProperty").find(".locationLength").val().trim();
                shapeElement.data['loc_ref_temp'] 	 = $("#cloneLocationProperty").find(".locationTemp").val().trim();
                shapeElement.data['loc_ref_rem'] 	 = $("#cloneLocationProperty").find(".locationRemark").val().trim();
                me.canvas.drawLabel(shapeElement, $("#cloneLocationProperty").find(".locationPoint").val());
                /**
                 * �ڽ��� �߽����� ����� edge�� �󺧵� ������Ѿ� �Ѵ�.
                 */
                me.changeEdgeLabel(shapeElement);

                $(this).remove();
                dialog.dialog( "close" );
            }
        });

    },

    /**
     * eventType�� ondrop�̸� �巡�� ������� ĵ������ �׸� ����̴�.
     * ���� 'dblclick'�̶�� �׷��� ������ �Ӽ��� �����ϱ� ���� �̺�Ʈ�̴�.
     */
    showPointDialog: function(offset, jsonData, panel, shapeElement, eventType) {
        var me = this;
        var element ={};
        element['id'] = 'pointDialog';
        element['shape'] = {};
        element.shape = {label:'Point Properties'};
        //���� ��ȭ���� ���� ��� �����ϵ��� �Ѵ�.
        var dialogName = me._CONTAINER_ID + me.Constants.PREFIX.DIALOG;
        me.destroyAllDialog($('#'+dialogName));
        // show Dialog
        var dialog = me.createDialog(element, {
            title: 'Point Properties',
            position: {my: "center", at: "center", of: document.getElementById(me._CONTAINER_ID)},
            height: 180,
            width: 300,
            closeOnEscape: false,
            resizable: false,
            dialogClass: "noClose"
        });

        $('.noClose .ui-dialog-titlebar-close').css('display', 'none');

        // �Ӽ� ���̺�
        var panel = $('#pointProperty').clone();
        panel[0].id = 'clonePointProperty';
        dialog.append(panel);
        // ���� ��ư
        var applyBtn = $('<button class="btn btn-primary" id="applyPointProperty" type="button" style="margin-left:72px">Apply</button>');
        dialog.append(applyBtn);
        // ��� ��ư
        var cancelBtn = $('<button class="btn btn-white" id="cancelPointProperty" type="button" style="left:10px">Cancel</button>');
        dialog.append(cancelBtn);

        if(eventType == 'dblclick') {
            $("#clonePointProperty").find(".pointName").val(shapeElement.shape.data['shapeLabel']);
        }

        $("#cancelPointProperty").click(function(event){
            $(this).remove();
            dialog.dialog( "close" );
        });

        $("#applyPointProperty").click(function(event){

            if($("#clonePointProperty").find(".pointName").val().trim().length == 0) {
                msgBox(me.MSGMessages.POINTMSG, $("#clonePointProperty").find(".pointName"));
                return;
            } else {
                var isDuplicate = me.checkDuplicationPointName($("#clonePointProperty").find(".pointName").val().trim());
                if(eventType == 'dblclick') {
                    if($("#clonePointProperty").find(".pointName").val().trim() == shapeElement.shape.data['loc_ref_name_to']) {
                        isDuplicate = false;
                    }
                }
                if(isDuplicate) {
                    msgBox(me.MSGMessages.DUPLICATEMSG, $("#clonePointProperty").find(".pointName"));
                    return;
                }
            }

            if(eventType == 'ondrop') {
                jsonData.shapeLabel = $("#clonePointProperty").find(".pointName").val().trim();
                jsonData.loc_ref_name_to = $("#clonePointProperty").find(".pointName").val().trim();
                $(this).remove();
                dialog.dialog( "close" );
                me.drawImmediately(offset, jsonData, panel);
            } else if(eventType == 'dblclick') {
                shapeElement.shape.data['shapeLabel']	   = $("#clonePointProperty").find(".pointName").val().trim();
                shapeElement.shape.data['loc_ref_name_to'] = $("#clonePointProperty").find(".pointName").val().trim();

                shapeElement.data['shapeLabel']	  	 = $("#clonePointProperty").find(".pointName").val().trim();
                shapeElement.data['loc_ref_name_to'] = $("#clonePointProperty").find(".pointName").val().trim();
                me.canvas.drawLabel(shapeElement, $("#clonePointProperty").find(".pointName").val());
                /**
                 * �ڽ��� �߽����� ����� edge�� �󺧵� ������Ѿ� �Ѵ�.
                 */
                me.changeEdgeLabel(shapeElement);

                $(this).remove();
                dialog.dialog( "close" );
            }
        });

    },

    /**
     * ��Ȧ�� ������Ƽ â
     */
    showManholeDialog: function(offset, jsonData, panel, shapeElement, eventType) {
        var me = this;
        var element ={};
        element['id'] = 'manholeDialog';
        element['shape'] = {};
        element.shape = {label:'Manhole Properties'};
        //���� ��ȭ���� ���� ��� �����ϵ��� �Ѵ�.
        var dialogName = me._CONTAINER_ID + me.Constants.PREFIX.DIALOG;
        me.destroyAllDialog($('#'+dialogName));
        // show Dialog
        var dialog = me.createDialog(element, {
            title: 'Manhole Properties',
            position: {my: "center", at: "center", of: document.getElementById(me._CONTAINER_ID)},
            height: 180,
            width: 370,
            closeOnEscape: false,
            resizable: false,
            dialogClass: "noClose"
        });

        $('.noClose .ui-dialog-titlebar-close').css('display', 'none');

        // �Ӽ� ���̺�
        var panel = $('#manholeProperty').clone();
        panel[0].id = 'cloneManholeProperty';
        dialog.append(panel);
        // ���� ��ư
        var applyBtn = $('<button class="btn btn-primary" id="applyManholeProperty" type="button" style="margin-left:110px">Apply</button>');
        dialog.append(applyBtn);

        // ��� ��ư
        var cancelBtn = $('<button class="btn btn-white" id="cancelManholeProperty" type="button" style="left:50px">Cancel</button>');
        dialog.append(cancelBtn);

        if(eventType == 'dblclick') {
            $("#cloneManholeProperty").find(".manholeName").val(shapeElement.shape.data['shapeLabel']);
        }

        $("#cancelManholeProperty").click(function(event){
            $(this).remove();
            dialog.dialog( "close" );
        });

        $("#applyManholeProperty").click(function(event){

            if($("#cloneManholeProperty").find(".manholeName").val().trim().length == 0) {
                msgBox(me.MSGMessages.MHPOINTMSG, $("#cloneManholeProperty").find(".manholeName"));
                return;
            } else {
                // ����Ʈ�� üũ ����
                var isDuplicate = me.checkDuplicationPointName($("#cloneManholeProperty").find(".manholeName").val().trim());
                if(eventType == 'dblclick') {
                    if($("#cloneManholeProperty").find(".manholeName").val().trim() == shapeElement.shape.data['loc_ref_name_to']) {
                        isDuplicate = false;
                    }
                }
                if(isDuplicate) {
                    msgBox(me.MSGMessages.DUPLICATEMSG, $("#cloneManholeProperty").find(".manholeName"));
                    return;
                }
            }

            if(eventType == 'ondrop') {
                //jsonData.loc_ref_length = $("#cloneLocationProperty").find(".locationLength").val().trim();
                jsonData.shapeLabel = $("#cloneManholeProperty").find(".manholeName").val().trim();
                jsonData.loc_ref_name_to = $("#cloneManholeProperty").find(".manholeName").val().trim();

                $(this).remove();
                dialog.dialog( "close" );
                me.drawImmediately(offset, jsonData, panel);
            } else if(eventType == 'dblclick') {
                shapeElement.shape.data['shapeLabel'] = $("#cloneManholeProperty").find(".manholeName").val().trim();
                shapeElement.shape.data['loc_ref_name_to'] = $("#cloneManholeProperty").find(".manholeName").val().trim();
                shapeElement.data['shapeLabel']  = $("#cloneManholeProperty").find(".manholeName").val().trim();
                shapeElement.data['loc_ref_name_to']  = $("#cloneManholeProperty").find(".manholeName").val().trim();
                me.canvas.drawLabel(shapeElement, $("#cloneManholeProperty").find(".manholeName").val());
                /**
                 * �ڽ��� �߽����� ����� edge�� �󺧵� ������Ѿ� �Ѵ�.
                 */
                me.changeEdgeLabel(shapeElement);
                $(this).remove();
                dialog.dialog( "close" );

            }
        });

    },

    /**
     * ��Ȧ �� �����̼� ����Ʈ ������ �ߺ� üũ�� �ؾ� �Ѵ�.
     */
    checkDuplicationPointName: function(pointName) {
        var me = this;
        var currentCanvas = me.getCanvas();
        var shapeList = currentCanvas.getAllShapes();
        var isDuplicate = false;
        shapeList.some(function(element){
            if(element.shape instanceof OG.Location || element.shape instanceof OG.Manhole) {
                if(pointName == element.shape.data.loc_ref_name_to) {
                    isDuplicate = true;
                }
            }
        });

        return isDuplicate;
    },

    /**
     * ���̽����� ������Ƽâ
     */
    showRaceWayDialog: function(edgeElement, fromElement, toElement, eventType) {
        var me = this;
        var element ={};
        element['id'] = 'raceWayDialog';
        element['shape'] = {};
        element.shape = {label:'RaceWay Properties'};
        //���� ��ȭ���� ���� ��� �����ϵ��� �Ѵ�.
        var dialogName = me._CONTAINER_ID + me.Constants.PREFIX.DIALOG;
        me.destroyAllDialog($('#'+dialogName));
        // show Dialog
        var dialog = me.createDialog(element, {
            title: 'RaceWay Properties',
            position: {my: "center", at: "center", of: document.getElementById(me._CONTAINER_ID)},
            height: 350,
            width: 350,
            resizable: false,
            closeOnEscape: false,
            dialogClass: "noClose"
        });

        $('.noClose .ui-dialog-titlebar-close').css('display', 'none');

        var panel = $('#raceWayProperty').clone();
        panel[0].id = 'cloneRaceWayProperty';
        dialog.append(panel);
        $("#cloneRaceWayProperty").find(".raceWayFrom").html(fromElement.shape.data.shapeLabel);
        $("#cloneRaceWayProperty").find(".raceWayTo").html(toElement.shape.data.shapeLabel)

        // ���� ��ư
        var applyBtn = $('<button class="btn btn-primary" id="applyRaceWayProperty" type="button" style="margin-left:95px">Apply</button>');
        dialog.append(applyBtn);

        // ��� ��ư
        var cancelBtn = $('<button class="btn btn-white" id="cancelRaceWayProperty" type="button" style="left:34px">Cancel</button>');
        dialog.append(cancelBtn);

        if(eventType == 'dblclick') {
            $("#cloneRaceWayProperty").find(".raceWayLength").val(edgeElement.shape.data['race_ref_len']);
            $("#cloneRaceWayProperty").find(".raceWayTemp").val(edgeElement.shape.data['race_ref_temp']);
            $("#cloneRaceWayProperty").find(".race_ref_method").val(edgeElement.shape.data['race_ref_method']);
            $("#cloneRaceWayProperty").find(".raceWayRemark").val(edgeElement.shape.data['race_ref_rem']);
        }

        $("#cancelRaceWayProperty").click(function(event){
            if(eventType == 'connect') {
                me.getCanvas().removeShape(edgeElement);
            }
            $(this).remove();
            dialog.dialog( "close" );
        });

        $("#applyRaceWayProperty").click(function(event){

            if($("#cloneRaceWayProperty").find(".raceWayLength").val().trim().length == 0) {
                msgBox(me.MSGMessages.LENGTHMSG, $("#cloneRaceWayProperty").find(".raceWayLength"));
                return;
            }

            var lenghNumber = /^[0-9]*$/;
            if(!lenghNumber.test($("#cloneRaceWayProperty").find(".raceWayLength").val())) {
                msgBox(me.MSGMessages.LENGTHCKMSG, $("#cloneRaceWayProperty").find(".raceWayLength"));
                return;
            }

            var tempNumber = /^\d*(\.\d{0,3})?$/;
            if(!tempNumber.test($("#cloneRaceWayProperty").find(".raceWayTemp").val())) {

                if(isNaN($("#cloneRaceWayProperty").find(".raceWayTemp").val())) {
                    msgBox(me.MSGMessages.TEMPCKMSG, $("#cloneRaceWayProperty").find(".raceWayTemp"));
                } else {
                    msgBox(me.MSGMessages.TEMPDECIMALPOINTCHK, $("#cloneRaceWayProperty").find(".raceWayTemp"));
                }
                return;
            } else {

                var inputChk = $("#cloneRaceWayProperty").find(".raceWayTemp").val().split('.')[1];
                /**
                 * �Ҽ��� �Է��ϱ� ���� .�� �������.
                 */
                if(inputChk == '') {
                    msgBox(me.MSGMessages.TEMPINPUTCHK, $("#cloneRaceWayProperty").find(".raceWayTemp"));
                    return;
                }

                /**
                 * ������ üũ
                 */
                if(Number($("#cloneRaceWayProperty").find(".raceWayTemp").val()) > 80) {
                    msgBox(me.MSGMessages.TEMPSIZECHK, $("#cloneRaceWayProperty").find(".raceWayTemp"));
                    return;
                }

            }

            var edgeCustomData = {};
            edgeCustomData['race_ref_from'] = fromElement.shape.data.shapeLabel;
            edgeCustomData['race_ref_to'] = toElement.shape.data.shapeLabel;
            edgeCustomData['race_ref_len'] = $("#cloneRaceWayProperty").find(".raceWayLength").val().trim();
            edgeCustomData['race_ref_temp'] = $("#cloneRaceWayProperty").find(".raceWayTemp").val().trim();
            edgeCustomData['race_ref_method'] = $("#cloneRaceWayProperty").find(".race_ref_method").val().trim();
            edgeCustomData['race_ref_method_nm'] = $("#cloneRaceWayProperty").find(".race_ref_method").find(":selected").text();
            edgeCustomData['race_ref_rem'] = $("#cloneRaceWayProperty").find(".raceWayRemark").val().trim();
            edgeCustomData['race_ref_trayedm_no'] = fromElement.shape.data.shapeLabel + toElement.shape.data.shapeLabel;
            edgeCustomData['pjt_sq'] = me._CONTROLLER.projectData.pjt_sq;
            edgeCustomData['label'] = "<a href='#' name='item' data-index='"+me._CONTROLLER.initRacewayReferenceList.length+"' style='margin-left: 5px;margin-right: 5px;'>" + edgeCustomData['race_ref_trayedm_no'] + "</a>";
            edgeCustomData['model'] = me._CONTROLLER.model.RacewayReferenceList.name;
            edgeCustomData['sort_ord'] = null;
            me.getCanvas().setCustomData(edgeElement, edgeCustomData);
            $(this).remove();
            dialog.dialog( "close" );
            if(eventType == 'connect') {
                var panel = me._CONTROLLER.model.RacewayReferenceList.panel;
                me._CONTROLLER.initRacewayReferenceList.push(edgeCustomData);
                me._CONTROLLER.redrawDataTables(panel, me._CONTROLLER.initRacewayReferenceList, me._CONTROLLER);
            }
        });

    },

    /**
     * �ε尡 ĵ������ ����Ǿ��� ����� ó��
     */
    onLoadDrop: function (loadElement, from) {
        var me = this;
        var swgrElement = me.canvas.getElementsByShapeId('OG.shape.elec.SwitchGear').get(0);
        if (!swgrElement) {
            me.canvas.removeShape(loadElement);
        }

        /**
         * ����ġ ������� �͹̳� ������(fromP)�� ���Ѵ�.
         */
        var toBoundary = me.canvas.getBoundary(loadElement);
        var fromBoundary = me.canvas.getBoundary(swgrElement);

        var toX = toBoundary.getCentroid().x;
        var fLeft = fromBoundary.getLeftCenter().x;
        var fRight = fromBoundary.getRightCenter().x;
        var fCenter = fromBoundary.getCentroid();
        var fLow = fromBoundary.getLeftCenter().y;
        var fromP;

        //�ε��� x �� ����ġ�� �ʺ� ���� ���� ���
        if (toX > fLeft && toX < fRight) {
            fromP = [toX, fLow];
        }
        //�ε��� x �� ����ġ�� ������ ���
        else if (toX <= fLeft) {
            fromP = [fLeft, fCenter.y];
        }
        //�ε��� x �� ����ġ�� ������ ���
        else if (toX >= fRight) {
            fromP = [fRight, fCenter.y];
        }

        /**
         * ����ġ ���� �ε带 ���̺�� �����Ѵ�.
         */
        me.canvas.connect(swgrElement, loadElement, null, null, fromP, null, null, null, new OG.CableShape());

        /**
         * �ش� �ε� ������ updateList�� �����Ѵ�.
         * ������ �����κ��� �׷����� �ε�� �����ؾ��Ѵ�.
         */
        if( from == null ) {
            me._CONTROLLER.updateFeederList.push(loadElement.shape.data);
        }
    },


    /**
     * ����ڷ� ���� ĵ������ �̺�Ʈ�� �߻��Ͽ��� ��� ó��
     */
    bindEvent: function () {
        var me = this;
        //Action Event. �� �̺�Ʈ���� �������� isUpdated ���� true �� �����.
        me.canvas.onDrawShape(function (event, element) {
            me.isUpdated = true;

            if(element.shape instanceof OG.Location) {
                $(element).bind('dblclick', function(event){
                    event.stopPropagation();
                    me.showPointDialog(null, null, null, this, 'dblclick');
                });
            } else if(element.shape instanceof OG.Manhole) {
                $(element).bind('dblclick', function(event){
                    event.stopPropagation();
                    me.showManholeDialog(null, null, null, this, 'dblclick');
                });
            } else if(element.shape instanceof OG.BLDG) {
                $(element).bind('dblclick', function(event){
                    event.stopPropagation();
                    me.showLocationDialog(null, null, null, this, 'dblclick');
                });
            } else if(element.shape instanceof OG.RacewayShape) {
                $(element).bind('dblclick', function(event){
                    event.stopPropagation();
                    var relatedElementsFromEdge = me.getCanvas().getRelatedElementsFromEdge(element);
                    me.showRaceWayDialog(element, relatedElementsFromEdge.from, relatedElementsFromEdge.to, 'dblclick');
                });
            }
        });
        me.canvas.onRedrawShape(function (event, element) {
            me.isUpdated = true;
        });
        me.canvas.onRemoveShape(function (event, shapeElement) {
            me.isUpdated = true;
            if( me.getMode() == me.Constants.MODE.FEEDER && me._CONTROLLER.tempElement != null) {
                me._CONTROLLER.tempElement.shape.data['removeType'] = 'Y';
                me.canvas.removeShape(me._CONTROLLER.tempElement);
                return;
            } else if( me.getMode() == me.Constants.MODE.HIERARCHY) {
                if(me._CONTROLLER.tempElement != null) {
                    me._CONTROLLER.tempElement.shape.data['removeType'] = 'Y';
                    me.canvas.removeShape(me._CONTROLLER.tempElement);
                    me._CONTROLLER.tempElement = null;
                    return;
                }
            }
        });
        me.canvas.onMoveShape(function (event, element, offset) {
            me.isUpdated = true;
            if(element.shape instanceof OG.BLDG) {
                var bldgBoundary = me.canvas.getBoundary(element);
                /**
                 * allShapes
                 */
                var shapeList = me.canvas.getAllShapes();
                shapeList.forEach(function(childElement){
                    if(childElement.shape instanceof OG.Location) {
                        var locationPointBoundary = me.canvas.getBoundary(childElement);
                        var isContainsAll = bldgBoundary.isContainsAll(locationPointBoundary.getVertices());
                        if(isContainsAll) {
                            /**
                             * Ȥ�� �� �Ǽ� ���� �̹� ����Ʈ�� ������ ���ԵǾ� �ִٸ� �� ���� ���ܸ� �ؾ��Ѵ�.
                             */
                            if(me.canvas.getParent(childElement) != null && me.canvas.getParent(childElement).shape instanceof OG.BLDG) return;

                            me.canvas.appendChild(childElement, element);
                        }
                    }
                });
            }
        });
        me.canvas.onResizeShape(function (event, shapeElement, offset) {
            me.isUpdated = true;
            if(shapeElement.shape instanceof OG.BLDG) {
                var bldgBoundary = me.canvas.getBoundary(shapeElement);
                /**
                 * allShapes
                 */
                var shapeList = me.canvas.getAllShapes();
                shapeList.forEach(function(element){
                    if(element.shape instanceof OG.Location) {
                        var locationPointBoundary = me.canvas.getBoundary(element);
                        var isContainsAll = bldgBoundary.isContainsAll(locationPointBoundary.getVertices());
                        if(isContainsAll) {
                            if(me.canvas.getParent(element) != null && me.canvas.getParent(element).shape instanceof OG.BLDG) return;
                            me.canvas.appendChild(element, shapeElement);
                        }
                    }
                });
            }
        });
        me.canvas.onConnectShape(function (event, edgeElement, fromElement, toElement) {
            me.isUpdated = true;
            /**
             * ���̽� ���̰� �׷����� ��� �� �� location ���� shapeLabel �� �޾ƿ� from-to �� �󺧸��� �Ѵ�.
             */
            if (edgeElement.shape instanceof OG.RacewayShape) {
                me.canvas.drawLabel(edgeElement, fromElement.shape.label + toElement.shape.label);
                me.showRaceWayDialog(edgeElement, fromElement, toElement, 'connect');
            }
        });
        me.canvas.onDisconnectShape(function (event, edgeElement, fromElement, toElement) {
            me.isUpdated = true;
            if(me.getMode() == me.Constants.MODE.HIERARCHY) {
                if(me._CONTROLLER.removeFirstShapeTypeAtHierarchy == me.Constants.SHAPE.EDGE) {
                    me._CONTROLLER.removeFirstShapeTypeAtHierarchy = null;
                    return false;
                }
            } else if(me.getMode() == me.Constants.MODE.ROUTE) {
                if(me._CONTROLLER.removeFirstShapeTypeAtRoute == me.Constants.SHAPE.EDGE) {
                    me._CONTROLLER.removeFirstShapeTypeAtRoute = null;
                    return false;
                }
            } else {
                me._CONTROLLER.tempElement = toElement;
            }
        });
        me.canvas.onGroup(function (event, groupElement) {
            me.isUpdated = true;

        });
        me.canvas.onUnGroup(function (event, ungroupedElements) {
            me.isUpdated = true;
        });

        //Before Event
        me.canvas.onBeforeRemoveShape(function (event, shapeElement) {

            if( shapeElement.shape.TYPE == me.Constants.SHAPE.GEOM || shapeElement.shape.TYPE == me.Constants.SHAPE.GROUP) {

                if( me.getMode() == me.Constants.MODE.FEEDER ) {
                    if(!shapeElement.shape.data.hasOwnProperty('removeType')) {
                        if(shapeElement.shape.data.fe_swgr_load_div == 'S' &&
                            (shapeElement.shape.data.fe_swgr_load_div == me._CONTROLLER.parentSwitchElement.fe_swgr_load_div) &&
                            shapeElement.shape.data.swgr_list_seq == me._CONTROLLER.parentSwitchElement.swgr_list_seq
                        ) {
                            me._CONTROLLER.deleteFeederList.push(shapeElement.shape.data);
                        }

                        return;
                    }

                    /**
                     * viewController�� feederMgtShapeList���� �ش� shape�� ������ �ִٸ�
                     * ������ ������ �����ϱ� ���ؼ� deleteFeederList�� ������ �־�� �Ѵ�.
                     * @type {Array|*|updateList}
                     */
                    var feederMgtShapeList = me._CONTROLLER.feederMgtShapeList;
                    var updateFeederList = me._CONTROLLER.updateFeederList;
                    /** ���� �����Ϳ��� ������ �˻��Ѵ� */
                    var swgrKey = 'swgr_list_seq';
                    var loadKey = 'load_list_seq';
                    if(shapeElement.shape.data.fe_swgr_load_div == 'S') {
                        /**
                         * �� ������ ���ٴ� ���� �����κ��� ����� json���κ��� �׷��� ĵ���� ��ü�� ������
                         * �ϳ��� �������ٰ� �Ǵ��� �� �ִ�.
                         * �ش� �������� shape�� ����ġƮ�����۸����� �ε����� üũ���� �ϰ�
                         * ���� ������ �����ؾ��Ѵ�.
                         */
                        if(!shapeElement.shape.data.hasOwnProperty('model')){
                            shapeElement.shape.data['model'] = me._CONTROLLER.model.SwgrList.name;
                            shapeElement.shape.data['label'] = '<a href="javascript:popUpSWGRInfo(\''+ shapeElement.shape.data['swgr_list_seq']+'\');void(0)" name="item" data-index="' + (me._CONTROLLER.initUnusedSwitchList.length) + '" style="margin-left: 5px;margin-right: 5px;">' + shapeElement.shape.data['swgr_name'] + '</a>';
                            me._CONTROLLER.initUnusedSwitchList.push(shapeElement.shape.data);
                        }
                        feederMgtShapeList.some(function(item, idx){
                            if( item.hasOwnProperty(swgrKey) && item[swgrKey] == shapeElement.shape.data[swgrKey]) {
                                me._CONTROLLER.deleteFeederList.push(item);
                            }
                        });

                        /** updateList������ ��ȸ�� �ؾ��Ѵ� **/
                        updateFeederList.some(function(item, idx){
                            if( item.hasOwnProperty(swgrKey) && item[swgrKey] == shapeElement.shape.data[swgrKey]) {
                                updateFeederList.splice(idx, 1);
                            }
                        });

                    } else {
                        if(!shapeElement.shape.data.hasOwnProperty('model')){


                            var loadObj = parent.getLoad(shapeElement.shape.data.load_list_seq);

                            /**
                             * ������ ���� ������Ƽ���� �����ؾ� �Ѵ�.
                             */
                            loadObj['model'] = me._CONTROLLER.model.UnAssignedLoadList.name;
                            loadObj['shapeType']= shapeElement.shape.data['shapeType'];
                            loadObj['shapeLabel'] = shapeElement.shape.data['lo_equip_tag_no'];
                            loadObj['label'] = '<a href="#" name="item" data-index="' + (me._CONTROLLER.initUnusedLoadList.length) + '" style="margin-left: 5px;margin-right: 5px;">' + shapeElement.shape.data['lo_equip_tag_no'] + '</a>';
                            loadObj['lo_equip_desc_style'] = '<span style="margin-left: 5px;margin-right: 5px;">' + loadObj['lo_equip_desc'] + '</span>';
                            loadObj['lo_unit_style'] = '<span style="margin-left: 5px;margin-right: 5px;">' + loadObj['lo_unit'] + '</span>';
                            loadObj['lo_proc_sys_style'] = '<span style="margin-left: 5px;margin-right: 5px;">' + loadObj['lo_proc_sys'] + '</span>';
                            loadObj['lo_equip_loc_style'] = '<span style="margin-left: 5px;margin-right: 5px;">' + loadObj['lo_equip_loc'] + '</span>';
                            shapeElement.shape.data = loadObj;
                            me._CONTROLLER.initUnusedLoadList.push(loadObj);
                        }
                        feederMgtShapeList.some(function(item, idx){
                            if( item.hasOwnProperty(loadKey) && item[loadKey] == shapeElement.shape.data[loadKey]) {
                                me._CONTROLLER.deleteFeederList.push(item);
                            }
                        });

                        /** updateList������ ��ȸ�� �ؾ��Ѵ� **/
                        updateFeederList.some(function(item, idx){
                            if( item.hasOwnProperty(loadKey) && item[loadKey] == shapeElement.shape.data[loadKey]) {
                                updateFeederList.splice(idx, 1);
                            }
                        });
                    }

                    if(shapeElement.shape.data.model == me._CONTROLLER.model.UnAssignedLoadList.name) {

                        //�ش� �������� ���� loadlist���� �����Ѵ�.
                        var usedLoadList = me._CONTROLLER.usedLoadList;
                        var updateList = [];
                        for (var i = 0; i < usedLoadList.length; i++) {
                            if (usedLoadList[i].load_list_seq != shapeElement.shape.data.load_list_seq) {
                                updateList.push(usedLoadList[i]);
                            }
                        }

                        me._CONTROLLER.usedLoadList = updateList;

                        // ��ü ������ �׸� ���Ŀ� ����� load item�� �����ϰ� �ش� �׸��带 �ٽ� �׷��� �Ѵ�.
                        var unloadList = me._CONTROLLER.initUnusedLoadList;
                        var newList = [];
                        for (var k = 0; k < unloadList.length; k++) {
                            var isDuplicated = false;
                            for (var j = 0; j < updateList.length; j++) {
                                if (unloadList[k].load_list_seq == updateList[j].load_list_seq) {
                                    isDuplicated = true;
                                }
                            }

                            if (!isDuplicated) {
                                newList.push(unloadList[k]);
                            }
                        }

                        //var panel = me._CONTROLLER.model.UnAssignedLoadList.panel;
                        //me._CONTROLLER.redrawDataTables(panel, newList, me._CONTROLLER);
                        me._CONTROLLER.redrawUnssignedLoadTables(me._CONTROLLER.model.UnAssignedLoadList.panel);

                    }
                    //������ �ε尡 ���� switchtransfomer���
                    else if(shapeElement.shape.data.model == me._CONTROLLER.model.SwgrList.name) {

                        //this.initUnusedSwitchList = [];
                        //this.usedSwitchList = [];
                        //�ش� �������� ���� loadlist���� �����Ѵ�.
                        var usedSwitchList = me._CONTROLLER.usedSwitchList;
                        var updateList = [];
                        for (var i = 0; i < usedSwitchList.length; i++) {
                            if (usedSwitchList[i].swgr_list_seq != shapeElement.shape.data.swgr_list_seq) {
                                updateList.push(usedSwitchList[i]);
                            }
                        }

                        me._CONTROLLER.usedSwitchList = updateList;

                        // ��ü ������ �׸� ���Ŀ� ����� load item�� �����ϰ� �ش� �׸��带 �ٽ� �׷��� �Ѵ�.
                        var unswitchList = me._CONTROLLER.initUnusedSwitchList;
                        var newList = [];
                        for (var k = 0; k < unswitchList.length; k++) {
                            var isDuplicated = false;
                            for (var j = 0; j < updateList.length; j++) {
                                if (unswitchList[k].swgr_list_seq == updateList[j].swgr_list_seq) {
                                    isDuplicated = true;
                                }
                            }

                            if (!isDuplicated) {
                                newList.push(unswitchList[k]);
                            }
                        }

                        var panel = me._CONTROLLER.model.SwgrList.panel;
                        me._CONTROLLER.redrawDataTables(panel, newList, me._CONTROLLER);

                    }

                } else if(me.getMode() == me.Constants.MODE.HIERARCHY) {

                    // ������ ���� ������ Ÿ�� ������ �Ǵ� edge�� ����鼭 Ÿ�� ������ üũ�Ѵ�.
                    if(me._CONTROLLER.removeFirstShapeTypeAtHierarchy == null) {
                        me._CONTROLLER.removeFirstShapeTypeAtHierarchy = me.Constants.SHAPE.GEOM;
                    }
                    /**
                     * feeder��忡���� ������ edge�� �����Ѵ�. ������ load�� ��Ÿ type�� ����ġ�� ���� ���� ����ġ�� ����Ǳ� �����̴�.
                     * ������ hierarchy��忡���� �ϳ��� ������ �� �ִ�.
                     * ���� �ϳ��� ����� �ؾ��Ѵ�.
                     * me._CONTROLLER.tempElement�� ���� ������ �����ϰ� �����ϸ� �ȴ�.
                     * ������ ������ shape�� �������� ����ġ�Ǵ����� üũ
                     */
                    if(shapeElement.shape.data.model == me._CONTROLLER.model.HierarchyFeederList.name) {

                        var feederHierarchyMgtShapeList = me._CONTROLLER.feederHierarchyMgtShapeList;
                        var updateFeederHierarchyList = me._CONTROLLER.updateFeederHierarchyList;
                        var deleteFeederHierarchyList = me._CONTROLLER.deleteFeederHierarchyList;
                        if(!shapeElement.shape.data.hasOwnProperty('label')) {
                            shapeElement.shape.data.label = '<a href="javascript:popUpSWGRInfo(\''+ shapeElement.shape.data['swgr_seq']+'\');void(0)" name="item" data-index="' + (me._CONTROLLER.initUnusedHierarchyFeederList.length) + '" style="margin-left: 5px;margin-right: 5px;">' + shapeElement.shape.data['swgr_name'] + '</a>';
                        }
                        var isDup = false;
                        me._CONTROLLER.initUnusedHierarchyFeederList.some(function(item){
                            if(item.feeder_list_mgt_seq == shapeElement.shape.data.feeder_list_mgt_seq) {
                                isDup = true;
                            }
                        });

                        if(!isDup) {
                            me._CONTROLLER.initUnusedHierarchyFeederList.push(shapeElement.shape.data);
                        }
                        /**
                         *
                         */
                        feederHierarchyMgtShapeList.some(function(item, idx){
                            if(item.feeder_list_mgt_seq == shapeElement.shape.data.feeder_list_mgt_seq) {
                                me._CONTROLLER.deleteFeederHierarchyList.push(item);
                            }
                        });

                        /** updateList������ ��ȸ�� �ؾ��Ѵ� **/
                        updateFeederHierarchyList.some(function(item, idx){
                            if(item.feeder_list_mgt_seq == shapeElement.shape.data.feeder_list_mgt_seq) {
                                updateFeederHierarchyList.splice(idx, 1);
                            }
                        });

                        // ���� ����Ʈ�� Ȯ���Ѵ�.
                        //    this.initUnusedHierarchyFeederList = [];
                        // this.usedHierarchyFeederList = [];
                        var usedHierarchyFeederList = me._CONTROLLER.usedHierarchyFeederList;
                        var updateList = [];
                        for (var i = 0; i < usedHierarchyFeederList.length; i++) {
                            if (usedHierarchyFeederList[i].swgr_seq != shapeElement.shape.data.swgr_seq) {
                                updateList.push(usedHierarchyFeederList[i]);
                            }
                        }

                        me._CONTROLLER.usedHierarchyFeederList = updateList;

                        // ��ü ������ �׸� ���Ŀ� ����� load item�� �����ϰ� �ش� �׸��带 �ٽ� �׷��� �Ѵ�.
                        var unUsedHierarchyFeederList = me._CONTROLLER.initUnusedHierarchyFeederList;
                        var newList = [];
                        for (var k = 0; k < unUsedHierarchyFeederList.length; k++) {
                            var isDuplicated = false;
                            for (var j = 0; j < updateList.length; j++) {
                                if (unUsedHierarchyFeederList[k].swgr_seq == updateList[j].swgr_seq) {
                                    isDuplicated = true;
                                }
                            }

                            if (!isDuplicated) {
                                newList.push(unUsedHierarchyFeederList[k]);
                            }
                        }

                        var panel = me._CONTROLLER.model.HierarchyFeederList.panel;
                        me._CONTROLLER.redrawDataTables(panel, newList, me._CONTROLLER);

                    }
                } else if(me.getMode() == me.Constants.MODE.ROUTE) {

                    // ������ ���� ������ Ÿ�� ������ �Ǵ� edge�� ����鼭 Ÿ�� ������ üũ�Ѵ�.
                    if(me._CONTROLLER.removeFirstShapeTypeAtRoute == null) {
                        me._CONTROLLER.removeFirstShapeTypeAtRoute = me.Constants.SHAPE.GEOM;
                    }

                    /**
                     * ���� �׸��忡�� �Ѿ�� �������
                     */
                    if(shapeElement.shape.data.model == me._CONTROLLER.model.BldgReferenceList.name) {

                        var usedBldgReferenceList = me._CONTROLLER.usedBldgReferenceList;
                        var updateList = [];
                        for (var i = 0; i < usedBldgReferenceList.length; i++) {
                            if (usedBldgReferenceList[i].loc_ref_seq != shapeElement.shape.data.loc_ref_seq) {
                                updateList.push(usedBldgReferenceList[i]);
                            }
                        }

                        me._CONTROLLER.usedBldgReferenceList = updateList;

                        // ��ü ������ �׸� ���Ŀ� ����� load item�� �����ϰ� �ش� �׸��带 �ٽ� �׷��� �Ѵ�.
                        var unUsedBldgReferenceList = me._CONTROLLER.initBldgReferenceList;
                        var newList = [];
                        for (var k = 0; k < unUsedBldgReferenceList.length; k++) {
                            var isDuplicated = false;
                            for (var j = 0; j < updateList.length; j++) {
                                if (unUsedBldgReferenceList[k].loc_ref_seq == updateList[j].loc_ref_seq) {
                                    isDuplicated = true;
                                }
                            }

                            if (!isDuplicated) {
                                newList.push(unUsedBldgReferenceList[k]);
                            }
                        }

                        var panel = me._CONTROLLER.model.BldgReferenceList.panel;
                        me._CONTROLLER.redrawDataTables(panel, newList, me._CONTROLLER);

                    }

                }
            } else if( shapeElement.shape.TYPE == me.Constants.SHAPE.EDGE) {
                // ������ ���� ������ Ÿ�� ������ �Ǵ� edge�� ����鼭 Ÿ�� ������ üũ�Ѵ�.
                if(me.getMode() == me.Constants.MODE.HIERARCHY) {
                    if(me._CONTROLLER.removeFirstShapeTypeAtHierarchy == null) {
                        me._CONTROLLER.removeFirstShapeTypeAtHierarchy = me.Constants.SHAPE.EDGE;
                    }
                } else if(me.getMode() == me.Constants.MODE.ROUTE) {
                    if(me._CONTROLLER.removeFirstShapeTypeAtRoute == null) {
                        me._CONTROLLER.removeFirstShapeTypeAtRoute = me.Constants.SHAPE.EDGE;
                    }
                }

                var relatedElementsFromEdge = me.canvas.getRelatedElementsFromEdge(shapeElement);
                var targetElement = relatedElementsFromEdge

            }
            me._CONTROLLER.tempElement = null;
        });
        me.canvas.onBeforeConnectShape(function (event, edgeElement, fromElement, toElement) {

            var flag = true;
            var msg = '';
            /**
             * ����ؾ��� ����.
             * shape�� �̵��� ��� ���踦 �����ؼ� �� ������ ���¿� ���ΰ��� ����ؾ���
             */
            if( me.getMode() == me.Constants.MODE.HIERARCHY) {
                var prevEdges = me.canvas.getPrevEdges(toElement);
                if(prevEdges.length > 0) {
                    prevEdges.forEach(function(edge){
                        var edge = me.canvas.getRelatedElementsFromEdge(edge);
                        var fromShapeData = edge.from.shape.data;
                        // from �����Ͱ� �ڽŰ� ���ٸ� �ڽ��� �̹� ���� �Ǵ� ����Ʈ�̴�.
                        if(fromShapeData.feeder_list_mgt_seq != null && fromShapeData.feeder_list_mgt_seq != fromElement.shape.data.feeder_list_mgt_seq) {
                            flag = false;
                            msg = me.MSGMessages.SWITCHCONNECTIONCHK;
                        }
                    });
                }
            } else if( me.getMode() == me.Constants.MODE.ROUTE) {
                if(fromElement.shape instanceof OG.Location && toElement.shape instanceof OG.Location ) {
                    flag = false;
                    msg = me.MSGMessages.POINTTOPOINTCHK;
                }
            }

            if(!flag) {
                msgBox(msg);
                return false;
            }

        });

        /**
         * ���̺� ������ �Ͼ�� ��� �̺�Ʈ
         */
        $(me.canvas.getRootElement()).bind('cableChange', function (event, shapeElement, beforeShapeId, afterShapeId) {
            console.log(shapeElement, beforeShapeId, afterShapeId);
        });

        /**
         * ���Ʈ ���� �̺�Ʈ
         */
        $(me.canvas.getRootElement()).bind('showCableList', function (event, shapeElement) {
            me.onShowCableList(shapeElement, null);
        });

        /**
         * ���� ���� �̺�Ʈ
         */
        $(me.canvas.getRootElement()).bind('showProperty', function (event, shapeElement) {
            me.onShowProperty(shapeElement);
        });

        /**
         * ĵ���� �ε� �̺�Ʈ
         */
        me.canvas.onLoading(function (event, progress) {
            if (progress == 'start') {
                $.unblockUI();
                $.blockUI({
                    message: $('#canvas-progress').html()
                });
            }
            if (typeof progress == 'number') {
                $('.canvas-progress-bar').css('width', progress + '%');
                $('.canvas-progress-bar').attr('aria-valuenow', progress + '')
            }
            if (progress == 'end') {
                $.unblockUI();
            }
        });
    },

    /**
     * Route����
     */
    checkPointToPoint: function (edge, canvas) {

        var returnChk = true;
        var relatedElementsFromEdge = canvas.getRelatedElementsFromEdge(edge);

        if( (relatedElementsFromEdge.from !=null && relatedElementsFromEdge.to !=null) &&
            (relatedElementsFromEdge.from.shape instanceof OG.Location&& relatedElementsFromEdge.to.shape instanceof OG.Location) ) {
            returnChk = false;
        }

        return returnChk;
    },

    /**
     * ���� ���� �̺�Ʈ�� ó���Ѵ�.
     * @param element
     */
    onShowProperty: function (element) {
        var me = this;
        console.log(element.shape.data);

        if(element.shape.data.hasOwnProperty('showProperty')) {
            if(element.shape.data.showProperty) {
                if(element.shape.data.hasOwnProperty('swgr_list_seq')) {
                    parent.showSWGRInfo(element.shape.data.swgr_list_seq);
                } else {
                    parent.showSWGRInfo(element.shape.data.swgr_seq);
                }
            }
        }
    },

    highLightHierarchyFeeder: function(element) {
        var me = this;
        //���õ� HierarchyFeeder �ִϸ��̼�
        if (!element.shape.data) {
            element.shape.data = {};
        }
        element.shape.data.highlight = true;
        me.canvas.getRenderer().redrawShape(element);

        setTimeout(me.unHighLightHierarchyFeederWrapper, 5000, me, element);
    },

    unHighLightHierarchyFeederWrapper: function(renderer, element) {
        renderer.unHighLightHierarchyFeeder(element);
    },

    unHighLightHierarchyFeeder: function(element) {
        var me = this;
        //���õ� HierarchyFeeder �ִϸ��̼�
        if (!element.shape.data) {
            element.shape.data = {};
        }
        element.shape.data.highlight = false;
        me.canvas.getRenderer().redrawShape(element);
    },

    /**
     * �ش� ���̽����̸� ���̶���Ʈ ó���Ѵ�.
     * @param element
     * @param {Boolean} selected ���� ó�� ����
     */
    highLightRaceway: function (element, selected) {
        var me = this;

        //���õ� ���̽����� �ִϸ��̼�
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
     * �ش� ���̽������� ���̶���Ʈ�� �����Ѵ�.
     * @param element
     */
    unHighLightRaceway: function (element) {
        var me = this;
        //���õ� ���̽����� �ִϸ��̼�
        if (!element.shape.data) {
            element.shape.data = {};
        }
        element.shape.data.selected = false;
        element.shape.data.highlight = false;
        me.canvas.getRenderer().redrawShape(element);
    },
    /**
     * �־��� path (���� ���̵�) ������κ��� ���̽����� ����Ʈ�� ��ȯ�Ѵ�.
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
     * ���̺� ��ȭâ�� �����Ѵ�.
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

    onRoutePathToDialog: function(jsonData, clickEventFrom) {
        var me = this;
        var currentCanvas = me.getCanvas();
        console.log(jsonData);
        if(jsonData.rou_ref_tot_path == null) {
            msgBox(me.MSGMessages.NOPATH);
            return;
        }

        if(jsonData.same_loc == 'Y') {
            msgBox(me.MSGMessages.SAMELOCATION);
            return;
        }

        var rouRefTotPath = jsonData.rou_ref_tot_path;
        var allRaceWay = rouRefTotPath.split('>');
        var lastRaceWay = allRaceWay[allRaceWay.length-1];
        var allEdges = currentCanvas.getAllEdges();

        /**
         * ���̶���Ʈ �� ��� ���̽����� ����
         */
        allEdges.forEach(function(edge){
            me.unHighLightRaceway(edge);
        });

        allEdges.forEach(function(edge){
            for(var i=0; i<allRaceWay.length; i++) {
                if(i != 1 && edge.shape.data.race_ref_trayedm_no == allRaceWay[i]) {
                    me.highLightRaceway(edge);
                }
            }
            var label = edge.shape.data.race_ref_trayedm_no;
            if(clickEventFrom == 'find') {
                if(label == allRaceWay[1]) {
                    edge.shape.data['cable_list_seq'] = jsonData.cable_list_seq;
                    edge.shape.data['lastRaceWay'] = lastRaceWay;
                    me.onShowCableList(edge, 'fromGrid');
                }
            } else {
                if(label == allRaceWay[1]) {
                    me.highLightRaceway(edge, true);
                }
            }
        });

    },

    /**
     * �ش� ���̽����̸� ������ ���̺� ����Ʈ�� �˾��ϰ�, ���̺� ���ý� �ٸ� ���Ʈ ��θ� ���ð����ϰ� �Ѵ�.
     * @param element
     */
    onShowCableList: function (element, from) {
        var me = this;

        //���� ��ȭ���� ���� ��� �����ϵ��� �Ѵ�.
        var dialogName = me._CONTAINER_ID + me.Constants.PREFIX.DIALOG;
        me.destroyCableDialog($('[name=' + dialogName + ']'));

        //���̾�α� â�� ����.
        var dialog = me.createDialog(element, {
            title: 'Cables',
            height: 350,
            width: 530,
            closeOnEscape: false,
            resizable: false,
            dialogClass: "noClose",
            close: function (event, ui) {
                me.destroyCableDialog(dialog);
            }
        });

        $('.noClose .ui-dialog-titlebar-close').css('display', 'none');

        //���̶����� �� �н� ����Ʈ
        var currentPath;
        me.highLightRaceway(element, true);

        //���̺� �����͸� �ҷ��´�.
        var cables = me.getCablesWithRaceway(element);

        //�г��� ���ӽ����̽�
        var panelName = me._CONTAINER_ID + me.Constants.PREFIX.DIALOG_TABLE;
        var panelId = me._CONTAINER_ID + element.id + me.Constants.PREFIX.DIALOG_TABLE;


        //���̺� �׸����� ������ �����Ѵ�.
        var adjustCables = [];
        var idx = 0;
        for (var i = 0; i < cables.length; i++) {
            var totalRaceWay = cables[i]['name'].split('>');
            var lastWay = totalRaceWay[totalRaceWay.length-1];
            if(from == 'fromGrid') {
                if(lastWay == element.shape.data.lastRaceWay) {
                    cables[i]['name'] = 'Cable ' + idx + ' :' + cables[i]['realPath'];
                    cables[i]['label'] = '<a href="#" name="item" data-index="' + idx + '">' + cables[i]['name'] + '</a>';
                    adjustCables.push(cables[i]);
                    idx++;
                }
            } else {
                cables[i]['label'] = '<a href="#" name="item" data-index="' + i + '">' + cables[i]['name'] + '</a>';
                adjustCables.push(cables[i]);
            }
        }


        var gridOptions = {
            data: adjustCables,
            columns: [
                {
                    data: 'label',
                    title: 'Name',
                    defaultContent: ''
                }
            ],
            pageLength: 5,
            lengthChange: false,
            info: false,
            scrollY: 600,
            scrollX: true,
            scrollCollapse: true,
        };


        //��ȭâ�� �׸��带 �����Ѵ�.
        var panel = $('<table></table>');
        panel.attr('name', panelName);
        panel.attr('id', panelId);
        panel.css('font-size', me._CONFIG.DEFAULT_SIZE.GRID_FONT);
        panel.css('width', '100%');
        panel.addClass('display').addClass('gridTable').addClass('cell-border').addClass('table').addClass('table-bordered').addClass('table-hover');

        dialog.append(panel);
        if(from == 'fromGrid') {
            //��ȭâ�� ��ư�� �����Ѵ�.
            var alternativeBtn = $('<button class="btn btn-primary noClick" type="button" id="altRaceWayApply" style="margin-left:195px">Apply</button>');
            dialog.append(alternativeBtn);

            var cancelBtn = $('<button class="btn btn-white" type="button" id="cablesDClose" style="left:120px">Cancel</button>');
            dialog.append(cancelBtn);
        } else {
            var cancelBtn = $('<button class="btn btn-white" type="button" id="cablesDClose" style="margin-left:225px">Close</button>');
            dialog.append(cancelBtn);
        }

        if (!panel.data('table')) {
            panel.data('table', true);
            panel.DataTable(gridOptions);
            me._CONTROLLER.modifyDataTablesStyle(panelId);
        }

        $("#altRaceWayApply").click(function(event){
            if($(this).hasClass('noClick')){
                msgBox(me.MSGMessages.SELECTRACEWAY);
                return;
            }
        });

        $("#cablesDClose").click(function(event){
            $(this).remove();
            dialog.dialog( "close" );
        });

        var gridPanelDiv = $('#' + panelId + '_wrapper');

        /**
         * ���̺� Ŭ���� �ش� ���̺��� �н��� �������� ���̽����̸� ���̶���Ʈ ó���ϰ�, ���� ��ư�� Ȱ��ȭ�Ѵ�.
         * ���� ��ư�� Ŭ���� �׸����� ������ ���̺��� ������ �� �ִ� ���氡���� ���Ʈ ����Ʈ�� ��ȯȺ��.
         * ���氡���� ���Ʈ ����Ʈ�� �����ϸ� ���̺� ����.
         * @param item
         * @param itemData
         */
        var nameClickEvent = function (item, itemData) {
            item.unbind('click');
            item.click(function (event) {
                event.stopPropagation();
                var racewaysFromPath;

                var allEdges = me.getCanvas().getAllEdges();

                /**
                 * ���̶���Ʈ �� ��� ���̽����� ����
                 */
                allEdges.forEach(function(edge){
                    me.unHighLightRaceway(edge);
                });

                currentPath = itemData['path'];
                racewaysFromPath = me.getRacewaysFromPath(currentPath);
                var racewaysLength = 0;
                for (var i = 0; i < racewaysFromPath.length; i++) {
                    racewaysLength = racewaysLength + Number(racewaysFromPath[i].shape.data.race_ref_len);
                    if (racewaysFromPath[i].id == element.id) {
                        me.highLightRaceway(racewaysFromPath[i], true);
                    } else {
                        me.highLightRaceway(racewaysFromPath[i]);
                    }
                }

                itemData['totalLength'] = racewaysLength + Number(itemData.fromPointLen) + Number(itemData.toPointLen);
                //���ö��� ��ư Ŭ�� �̺�Ʈ�� ó���Ѵ�.
                if(from != null) {
                    alternativeBtn.removeClass('noClick');
                    alternativeBtn.unbind('click');
                    alternativeBtn.bind('click', function () {
                        console.log(itemData);
                        var updateCableData = {};
                        updateCableData['cable_list_seq'] = element.shape.data.cable_list_seq;
                        updateCableData['rou_ref_tot_path'] = itemData.realPath;
                        updateCableData['rou_ref_tot_len'] = itemData.totalLength;
                        //var returnData = parent.updateCablePath(updateCableData);
                        var returnData = '0';
                        if(returnData == '0') {
                            me._CONTROLLER.renderGrid(me._CONTROLLER.model.CableReferenceList.name);
                            $(this).remove();
                            dialog.dialog( "close" );
                            msgBox(me.MSGMessages.SAVEMSG);
                            setTimeout(msgBoxClose, 1000);
                        }
                    });
                }
            });
        };

        // page event
        panel.unbind('draw.dt');
        panel.on('draw.dt', function () {
            var item = gridPanelDiv.find("[name=item]");
            item.each(function (index, aTag) {
                var item = $(aTag);
                var dataIndex = item.data('index');
                var itemData = adjustCables[parseInt(dataIndex)];
                nameClickEvent(item, itemData);
            });
            blockStop();
        });

        var dataTable = panel.dataTable().api();
        dataTable.clear();
        dataTable.rows.add(adjustCables);
        dataTable.draw();
        $(".dataTables_paginate").find('a').css("font-size", "11px");
        panel.on('draw.dt', function () {
            $(".dataTables_paginate").find('a').css("font-size", "11px");
        });
    },
    /**
     * �ش� ���̽����̸� ������ ���̺� ����Ʈ�� ���Ѵ�.
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
            //�־��� ������ Location �� ��� fromPaths �Ǵ� toPaths �� �߰��� �� �����Ѵ�.
            if (element.shape instanceof OG.Location) {
                if (fromTo == 'from') {
                    fromPaths.push(paths);
                } else {
                    toPaths.push(paths);
                }
                return;
            }

            //�־��� ������ ����� �������� ã�´�.
            var prevShapes = me.canvas.getPrevShapes(element);
            var nextShapes = me.canvas.getNextShapes(element);

            //����� ������ excludeElement(�Ļ��Ǿ� �� ����) �� �����ϰ�, paths �� �ߺ��Ǵ� �� ���� �ı��Ѵ�.
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
                //paths �� �߰��Ѵ�.
                var newPath = JSON.parse(JSON.stringify(paths));
                newPath.push(relatedShapes[i].id);

                //����� ������ Location �� ��� fromPaths �Ǵ� toPaths �� �߰��� �� �����Ѵ�.
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
        //fromPaths,toPaths �� �ϳ��� �н��� �����Ѵ�. �̶� location �� ���� ���� ����Ʈ���� �����Ѵ�.
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
         * ���Ʈ ������ �����
         */
        var data = [];
        for (var i = 0, leni = routes.length; i < leni; i++) {
            var routeData = {};
            var fromBLDG;
            var toBLDG;
            var fromPointLength = 0;
            var toPointLength = 0;
            for (var c = 0, lenc = routes[i].length; c < lenc; c++) {
                //ó�� �Ǵ� ��(�����̼�) �̶��
                if (c == 0 || c == lenc - 1) {
                    var locationId = routes[i][c];
                    var location = me.canvas.getElementById(locationId);
                    if (location) {
                        var parent = me.canvas.getParent(location);
                        if (parent && parent.shape instanceof OG.BLDG) {
                            if (c == 0) {
                                fromBLDG = parent.shape.label;
                                fromPointLength = parent.shape.data.loc_ref_length;
                            } else {
                                toBLDG = parent.shape.label;
                                toPointLength = parent.shape.data.loc_ref_length;
                            }
                        }
                    }
                }
            }
            //����, �� �����̼��� ��� ���� �ȿ� �����ִٸ�
            if (fromBLDG && toBLDG) {
                routeData['path'] = routes[i];

                var realRoutePaths = [];

                var routeList = routes[i];

                for(var t=0; t<routeList.length; t++) {
                    if(t==0) {
                        realRoutePaths.push(me.canvas.getElementById(routeList[t]).shape.data.loc_ref_name_to);
                    } else if( t > 0) {
                        var setRoutePath = me.canvas.getElementById(routeList[t-1]).shape.data.loc_ref_name_to + me.canvas.getElementById(routeList[t]).shape.data.loc_ref_name_to;
                        realRoutePaths.push(setRoutePath);
                        if(t == routeList.length -1) {
                            setRoutePath = me.canvas.getElementById(routeList[t]).shape.data.loc_ref_name_to;
                            realRoutePaths.push(setRoutePath);
                        }
                    }

                }

                var realRoutePath = '';
                realRoutePaths.forEach(function(path, index){
                    if(index == 0) {
                        realRoutePath = fromBLDG + path;
                    } else if(index > 0) {
                        if(index == realRoutePaths.length-1) {
                            realRoutePath = realRoutePath + '>' + path + toBLDG;
                        } else {
                            realRoutePath = realRoutePath + '>' + path;
                        }
                    }
                });

                routeData['realPath'] = realRoutePath;
                routeData['from'] = fromBLDG;
                routeData['fromPointLen'] = fromPointLength;
                routeData['toPointLen'] = toPointLength;
                routeData['to'] = toBLDG;
                routeData['name'] = 'Cable ' + i + ' :' + realRoutePath;
                data.push(routeData);
            }
        }
        return data;
    }
};
Renderer.prototype.constructor = Renderer;