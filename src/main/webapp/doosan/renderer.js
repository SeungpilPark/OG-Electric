var Renderer = function (mode, container, controller) {
	
	this.MSGMessages = {
			POINTMSG: '포인트를 지정해야 합니다.',
			MHPOINTMSG: '맨홀 포인트를 지정해야 합니다.',
			DUPLICATEMSG: '입력한 명칭이 이미 존재합니다.',
			LENGTHMSG: 'Legnth를 지정해야 합니다.',
			LENGTHCKMSG: 'Length는 숫자만 입력할 수 있습니다.',
			TEMPMSG: 'Temp를 지정해야 합니다.',
			TEMPCKMSG: 'Temp는 숫자만 입력할 수 있습니다.',
			TEMPINPUTCHK: '소수점이하를 입력하십시오.',
			TEMPDECIMALPOINTCHK: 'Temp는 소수점 3자리까지만 허용합니다.',
			TEMPSIZECHK: 'Temp는 80이하로 입력해야 합니다.',
			REMARKMSG: 'Remark를 입력해야 합니다.',
			SAVEMSG: '저장이 완료되었습니다.',
			NOPATH: 'Path가 없습니다.',
			SAMELOCATION: '동일 Location에 있습니다.',
			SELECTRACEWAY: '대체 경로를 선택해야 합니다.',
			NOOBJECTSAVE: '저장할 오브젝트가 존재하지 않습니다.',
			POINTTOPOINTCHK: 'Point간의 연결은 허용되지 않습니다.',
			SWITCHCONNECTIONCHK: '연결하려는 피더 스위치는 이미 상위 피더 스위치를 가지고 있습니다.',
			FEEDERINFLOOR: '피더의 위치는 플로어안에 놓여져야 합니다.',
			POINTINLOCATION: '포인트의 위치는 로케이션안에 놓여져야 합니다.',
			FEEDERTYPETR: '타입이 TR이면 캔버스에 그릴 수 없습니다.'
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
         * FEEDER EDITOR MODE시 우측 메뉴 클릭에 대한 SaveMODE를 가져야한다.
         * SWGR일 경우에는 저장시 new, load일 경우에는 해당 로드목록에서 드랍시 dataTables를 갱신해야한다...
         * 1. 드랍시 메뉴에서 제외, 캔버스에서 드랍한 로드 삭제시에는 다시 dataTables 목록에 갱신....
         * FEEDER_FEEDER에서 끌어 온경우에는 기존의 있는 넘.
         * 만일 기존의 스위치에서 로드를 올려놓을 시 해당 load만 업뎃을 해야하기 때문에 어떤 메뉴에서 어떻게 가져왔는지 알아야 한다.
         * 각각의 에디터에 대한 세이브 모드를 가진다. 
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
     * 라우터 에디터에서 json으로 캔버스를 그릴 때 케이블에 대한 정보들을 새로 그린다.
     * 이 때는 raceWay 프로퍼티 창을 띄우지 않아야 한다.
     */
    this.isRedrawRaceWayFromJson = false;
    
    /**
     * 모드, 컨테이너, 컨트롤러 등록 (누락일 경우 리턴)
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
        enableContextMenu: false,
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
     * 핫키 : DELETE 삭제 키 가능여부
     */
    this.canvas._CONFIG.ENABLE_HOTKEY_DELETE = false;
    
    /**
     * 핫키 : Ctrl+G 그룹 키 가능여부
     */
    this.canvas._CONFIG.ENABLE_HOTKEY_CTRL_G = false;
    /**
     * 핫키 : Ctrl+U 언그룹 키 가능여부
     */
    this.canvas._CONFIG.ENABLE_HOTKEY_CTRL_U = false;

    /**
     * 핫키 : UNDO REDO 키 가능여부
     */
    this.canvas._CONFIG.ENABLE_HOTKEY_CTRL_Z = false;
    
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
    
    /**
     * HierarchyCanvas에 기존 정보를 그린다.
     */
    drawToHierarchyCanvasFromServerData: function(mode) {
    	var me = this;
    	
    	if(mode == me.Constants.MODE.HIERARCHY ) {
    		
    		var dataInfo;
    		try{
    			dataInfo = parent.getFeederSWGRTree();
    		} catch(e) {
    			dataInfo = [];
    		}
    		
    		/**
    		 * 빌딩과 플로우를 추출해서 각각의 리스트에 넣는다.
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
    		 * 캔버스 사이즈 조정
    		 */
    		var initHeight = (me._CONFIG.DEFAULT_SIZE.HIERARCHY_FLOOR[1] + 40) * floorList.length + (100 * floorList.length);
    		if(initHeight < me.getContainer().height()) {
    			initHeight = me.getContainer().height();
    		}
    		//canvas의 사이즈를 재조절한다.
    		var size = [
    		            me.getContainer().width(),
    		            initHeight
    		            ];
    		
    		me.getCanvas().clear();
    		me.getCanvas().setScale(1);
    		
        	
        	me.getCanvas().setCanvasSize(size);
    		
    		/**
    		 * 빌딩을 캔버스에 그리기 위한 로직
    		 * 해당 빌딩에 속한 floor의 숫자만큰 캔버스의 높이를 늘려서 세팅한다.
    		 * idx를 통해 최초 빌딩의 위치를 선정하고 그 이후 그려지는 빌딩은
    		 * 일정 간격으로 밑으로 그린다.
    		 * 최초 빌딩은 캔버스 좌측 상단으로 부터 좌측, 위로부터 100을 띄워서 그린다.
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
    			 * 빌딩의 높이를 재 조정한다. bldgInFloorIdx의 갯수만큼 플로어의 높이 +40를 더해서 곱한다.
    			 * offset 정보도 함께 넣어준다.
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
    			 * 해당 빌딩의 upperCenterY로부터 밑으로 20을 띄워 그린다.
    			 * 센터 x좌표는 빌딩의 x좌표로 설정한다.
        		 * floor을 캔버스에 그리기 위한 로직
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
    	console.log('drawRouteCanvas');
    	$.unblockUI();
    },
    
    compareAndRemove: function() {
    	var me = this;
    	var currentCanvas = me.getCanvas();
    	var feederList;
    	try {
    		feederList = parent.getFeederList();
    	} catch(e) {
    		feederList = [];
    	}
    	var allShape = currentCanvas.getAllShapes();
    	allShape.forEach(function(shapeElement){
    		var deleteItem = false;
    		if(shapeElement.shape instanceof OG.HierarchyFeeder) {
    			feederList.some(function(feeder){
    				if(feeder.fe_swgr_load_div == 'S' && feeder.swgr_seq == shapeElement.shape.data.swgr_seq) {
    					deleteItem = true;
    				}
    			});
    		}
    		if(deleteItem) {
    			currentCanvas.removeShape(shapeElement);
    		}
    	});
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
    		 * 지워진 스위치피더가 있는지 체크하고 해당 스위치 피더는 지운다.
    		 * 하지만 하이어라키 피더 리스트는 이미 지워진 피더가 존재하기 때문에
    		 * 지울 때 파라미터를 통해 그리드를 상신하지 않게 만든다.
    		 */
    		renderer.compareAndRemove();
    		renderer._CONTROLLER.saveSettingHierarchyMode(renderer);
    	} else if(renderer.getMode() == renderer.Constants.MODE.ROUTE) {
    		
    		/**
    		 * ROUTE는 그리고 난 이후 캔버스에 그리진 Bldg를 제외한 그리드를 새로 그려야 한다.
    		 */
    		
    		var shapeList = canvas.getAllShapes();
    		shapeList.forEach(function(shapeElement){
    			if(shapeElement.shape instanceof OG.BLDG) {
    				renderer._CONTROLLER.usedBldgReferenceList.push(shapeElement.shape.data);
    			}
    		});

            var updateList = renderer._CONTROLLER.usedBldgReferenceList;

            // 전체 도형을 그린 이후에 사용한 load item은 제외하고 해당 그리드를 다시 그려야 한다.
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
    // 툴바에 텍스트, 기타 shape 오브젝트 추가.
    // 샘플 데이터 파악하여 릴레이션 관계 명확하게 만들기
    // 서버 CRUD 만들기

    
    /**
     * 그리드로부터 받은 정보에서 canvas에 그릴 json정보가 없다면 해당 객체의 seq넘버를 통해 전체 리스트를 가져온다.
     * 그 리스트로 캔바스에 모델을 그린다.
     * 
     */
    drawToFeederCanvasFromServerData: function(shapeData, panel) {
    	//var startDate =  new Date();
    	
    	var me = this;
    	var list = parent.getFeederInfo(shapeData.swgr_list_seq);
    	var data = JSON.parse(JSON.stringify(shapeData));
    	var totalList = [];
    	
        //렌더러에 에디팅 오브젝트를 설정한다.
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
         * 1. list의 사이즈를 구하고 로드의 디폴트 사이즈에 간격 조정을 위한 +20을 더한다.
         * 2. 이 값을 곱한 사이즈가 최종 리사이즈 값이 된다.   
         */
    	var shapeResize = defaultSwitchGearSize[0];
    	if(totalList.length > 1) {
    		shapeResize = ( (totalList.length-1)*(me._CONFIG.DEFAULT_SIZE.LOAD[0]+20) );
    		if(shapeResize < defaultSwitchGearSize[0]) {
    			shapeResize = defaultSwitchGearSize[0];
    		}
    	}
    	
    	/**
    	 * 캔버스의 초기 사이즈를 스위치의 전체 길이에서 200을 더한 만큼 설정한다.
    	 */
    	var adjustNewWidth = shapeResize + 200;
    	if(adjustNewWidth < me.getContainer().width()) {
    		adjustNewWidth = me.getContainer().width();
    	}
    	
    	me.getCanvas().clear();
    	me.getCanvas().setScale(1);
    	//canvas의 사이즈를 재조절한다.
        var size = [
                    adjustNewWidth,
                    me.getContainer().height()
                ];
    	
    	me.getCanvas().setCanvasSize(size);
    	
    	// 정중앙 좌표는 position = [me.getContainer().width() / 2, me.getContainer().height() / 2]
    	// 현재 스위치의 정 중앙 좌표에서 좌측 끝의 좌표는 (me.getContainer().width()/2) - (adjustNewWidth/2)
    	var newCenterPosition = shapeResize/2 + 100;
    	// 스위치의 길이가 길어지는 것을 예상해서 캔버스 맨 끝에서 100정도의 간격을 띄워서 중앙을 잡아 그린다.
    	var newShapeAdjustSize = [shapeResize, newCenterPosition, 100];
    	// 메인 스위치를 먼저 그린다.
		me.drawImmediately(null, switchGear, null, newShapeAdjustSize);
		
		/**
		 * web worker는 차후 좀 더 다듬는 걸로 
		 * 현재는 rough하게 코드 테스팅만 확인
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
    			// 최초 위치는 스위치 맨 끝 좌표로부터 우측으로 로드의 중앙 사이즈의 절반만큼 이동시켜야한다.
    			// 스위치의 맨 끝은 캔바스 좌측 끝에서 100을 띄워서 그렸기 때문에 
    			initLeftPosition = 100 + me._CONFIG.DEFAULT_SIZE.LOAD[0]/2;
    		} else {
    			// 최초에 그려진 것이 아니라면 기존 포지션에서 로드의 절반만큼 이동시킨다. 그리고 
    			// 스위치의 width를 결정할 때 로드 또는 트랜스포머 수만큼 +20을 했기 때문에 그 숫자도 함께 던진다.
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
     * drawImmediately이후에 그리드 redraw에 대한 로직을 태운다.
     */
    reloadGridAfterDrawImmediately: function(shape, shapeInfo, panel) {
    	
    	var me = this;
    	
	    // 한번더 체크로 아예 밑에 로직 태우는 유무를 체크한다.
		if (!me.editingObject) {
			return false;
		}
	    
		var newList = [];
	    //해당 아이템이 로드이고 UnAssignedLoadList에서 넘어온 아이템이라면
	    if(shape instanceof OG.Load && 
	    	(shapeInfo.model == me._CONTROLLER.model.UnAssignedLoadList.name)
	    	) {
	    	
	        //해당 아이템은 사용된 loadlist에 정보를 저장한다.
	        var usedLoadList = me._CONTROLLER.usedLoadList;
	        usedLoadList.push(shapeInfo);
	        // 전체 도형을 그린 이후에 사용한 load item은 제외하고 해당 그리드를 다시 그려야 한다.
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
	        
	        // 해당 그리드 새로 그린다.
	        var dataTable = panel.dataTable().api();
	        var currentPage = dataTable.page();
	        dataTable.clear();
	        dataTable.rows.add(newList);
	        dataTable.draw();
	        dataTable.page(currentPage).draw(false);
	        
	    }
	    // 해당 아이템이 트랜스포머이고 model이 SwgrList라면
	    else if(shape instanceof OG.SwitchTransformer &&
	    		(shapeInfo.model == me._CONTROLLER.model.SwgrList.name)
	    		) {
	    	
	        //해당 아이템은 사용된 switchlist에 정보를 저장한다.
	        var usedSwitchList = me._CONTROLLER.usedSwitchList;
	        usedSwitchList.push(shapeInfo);
	        // 전체 도형을 그린 이후에 사용한 load item은 제외하고 해당 그리드를 다시 그려야 한다.
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
	        
	        // 해당 그리드 새로 그린다.
	        var dataTable = panel.dataTable().api();
	        var currentPage = dataTable.page();
	        dataTable.clear();
	        dataTable.rows.add(newList);
	        dataTable.draw();
	        dataTable.page(currentPage).draw(false);
	        
	    }
	    // 해당 아이템이 스위치이고 model이 SwgrList라면
	    else if(shape instanceof OG.HierarchyFeeder &&
	    		(shapeInfo.model == me._CONTROLLER.model.HierarchyFeederList.name)
	    		) {
	    	
	        //해당 아이템은 사용된 switchlist에 정보를 저장한다.
	        var usedHierarchyFeederList = me._CONTROLLER.usedHierarchyFeederList;
	        usedHierarchyFeederList.push(shapeInfo);
	        // 전체 도형을 그린 이후에 사용한 load item은 제외하고 해당 그리드를 다시 그려야 한다.
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
	        
	        // 해당 그리드 새로 그린다.
	        var dataTable = panel.dataTable().api();
	        var currentPage = dataTable.page();
	        dataTable.clear();
	        dataTable.rows.add(newList);
	        dataTable.draw();
	        dataTable.page(currentPage).draw(false);
	        
	    }
	    // 해당 아이템이 빌딩이고 model이 SwgrList라면.
	    else if(shape instanceof OG.BLDG &&
	    		(shapeInfo.model == me._CONTROLLER.model.BldgReferenceList.name)
	    		) {
	    	
	        //해당 아이템은 사용된 switchlist에 정보를 저장한다.
	        var usedBldgReferenceList = me._CONTROLLER.usedBldgReferenceList;
	        usedBldgReferenceList.push(shapeInfo);
	        // 전체 도형을 그린 이후에 사용한 load item은 제외하고 해당 그리드를 다시 그려야 한다.
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
	        
	        // 해당 그리드 새로 그린다.
	        var dataTable = panel.dataTable().api();
	        var currentPage = dataTable.page();
	        dataTable.clear();
	        dataTable.rows.add(newList);
	        dataTable.draw();
	        dataTable.page(currentPage).draw(false);
	        
	    }
    },
    
    /**
     * 뷰 컨트롤러에서 받아온 데이터를 바탕으로 캔버스에 도형을 그린다.
     * @param offset
     * @param shapeInfo
     */
    drawImmediately: function (offset, shapeInfo, panel, newShapeAdjustSize, from) {
        var me = this;
        var shape, element, id, size, position;
        if (shapeInfo && shapeInfo['shapeType']) {
            var shapeType = shapeInfo['shapeType'];
            var shapeLabel = shapeInfo['shapeLabel'] ? shapeInfo['shapeLabel'] : '';

            //렌더링 대상들
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

            //viewController 에 전달해야 하는 대상들
            else if (shapeType == me.Constants.TYPE.NEW_FEEDER) {
                me._CONTROLLER.onMessage(me, shapeInfo, me._CONTROLLER.message.NEW, panel);
                return;
            } else if (shapeType == me.Constants.TYPE.MODIFY_FEEDER) {
                me._CONTROLLER.onMessage(me, shapeInfo, me._CONTROLLER.message.NEW, panel);
                return;
            }

            if (shape) {
                //offset 이 없다면 컨테이너의 중앙을 기준으로 삼는다.
                if (!offset) {
                	var initWidth = me.getContainer().width() / 2;
                	var initHeight = me.getContainer().height() / 2;
                	// 새로운 포지션이 존재한다면
                	if(newShapeAdjustSize != null) {
                		if(shapeType == me.Constants.TYPE.HIERARCHY_BLDG) {
                			initWidth = newShapeAdjustSize[0]/2  + 100;
                			initHeight = newShapeAdjustSize[2] + 50;
                		} else if(shapeType == me.Constants.TYPE.HIERARCHY_FLOOR) {
                			initWidth = newShapeAdjustSize[0];
                			initHeight = newShapeAdjustSize[1] + 20;
                    	} else {
                    		initWidth = newShapeAdjustSize[1];
                    		// 밑에 붙을 로드 및 트랜스포머를 위해 위로 100정도 올린다.
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
                //캔버스의 editingObject (에디팅 객체) 가 없다면 그리지 않는다.
                if (!me.editingObject) {
                    me._CONTROLLER.onMessage(me, shapeInfo, me._CONTROLLER.message.NO_EDITOR_OBJECT, panel);

                } else {
                    shape.data = shapeInfo;
                    
                    // 로드 리스트에서 넘어온 정보라면 
                    if(shape.data.model == me._CONTROLLER.model.UnAssignedLoadList.name) {
                    	// parent.checkLSValidator(load_seq, swgr_seq)을 체크한다. 
                    	// false면 그리지 않을 경우. return
                    	// returnData JSONList 
                    	//{error : "false", msg : ''
                    	var isValidate = true;
                    	var validateData = me._DATA_CONTROLLER.makeCheckLSValidatorData(me);
                    	parent.checkLSValidator(shape.data.load_list_seq, validateData, function(checked){
                    		if(checked == 'true') {
                    			 element = me.getCanvas().drawShape(position, shape, size);
                                 me.getContainer().removeData('DRAG_SHAPE');

                                 //Load 일 경우 onLoadDrop 호출
                                 //트랜스포머일 경우도 onLoadDrop 호출
                                 if (shape instanceof OG.Load || shape instanceof OG.SwitchTransformer) {
                             		me.onLoadDrop(element, from);
                                 }
                    			
                                 me.reloadGridAfterDrawImmediately(shape, shapeInfo, panel);
                    		}
                    	});
                    	
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

                    //Load 일 경우 onLoadDrop 호출
                    //트랜스포머일 경우도 onLoadDrop 호출
                    if (shape instanceof OG.Load || shape instanceof OG.SwitchTransformer) {
                		me.onLoadDrop(element, from);
                    }
                    
                    // 하이라키어 피더에서 넘어왔다면
                    if(shape.data.shapeType == me.Constants.TYPE.HIERARCHY_FEEDER) {
                    	me._CONTROLLER.updateFeederHierarchyList.push(shape.data);
                    }
                }
            }
        }

        /**
         *  drawImmediately이후에 그리드 redraw에 대한 로직을 태운다.
         */
        me.reloadGridAfterDrawImmediately(shape, shapeInfo, panel);
        
    },

    /**
     * 뷰 컨트롤러에서 드랍 이벤트가 올 경우의 처리.
     * 드랍 한 영역이 캔버스 컨테이너 영역 안일 경우만 처리한다.
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
                		// 트리에서 넘어왔다면 panel은 undefined
                		if(!panel) { 
	                		/**
	                		 * canvas에 드래그 드랍할 빌딩, floor가 이미 존재한다면
	                		 * 그리지 않는다. 
	                		 * 체크 로직 추가
	                		 */
	                		var checkedData = me._CONTROLLER.checkBldgsAndFloors(me, jsonData);
	                		if(checkedData.isDraw) {
	                			me.drawImmediately([pageX, pageY], jsonData, panel);
	                		} else {
	                			msgBox(checkedData.msg);
	                		}
                		} else {
                			// 그리드에서 넘어왔다면
                			// 밑에 로직을 태우기 전에 floor의 boundary영역 안으로 드래그한 것인지 체크해야한다.
                			// 아니라면 msgBox와 함께 그리지 않는다...
                			me.drawImmediately([pageX, pageY], jsonData, panel);
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
     * label변경시 연결된 raceway의 라벨도 변경이 되어야 한다.
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
     * eventType이 ondrop이면 드래그 드랍으로 캔버스에 그린 경우이다.
     * 만일 'dblclick'이라면 그려진 도형의 속성을 변경하기 위한 이벤트이다.
     */
    showLocationDialog: function(offset, jsonData, panel, shapeElement, eventType) {
    	var me = this;
    	var element ={};
        element['id'] = 'BldgDialog';
        element['shape'] = {};
        element.shape = {label:'Location Properties'};
    	//기존 대화장이 있을 경우 삭제하도록 한다.
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
        
        // 속성 테이블
        var panel = $('#locationProperty').clone();
        panel[0].id = 'cloneLocationProperty';
        dialog.append(panel);
       // 적용 버튼
        var applyBtn = $('<button class="btn btn-primary" id="applyLocationProperty" type="button" style="margin-left:95px">Apply</button>');
        dialog.append(applyBtn);
        // 취소 버튼
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
        		 * 자신을 중심으로 연결된 edge의 라벨도 변경시켜야 한다. 
        		 */
        		me.changeEdgeLabel(shapeElement);
        		
				$(this).remove();
	        	dialog.dialog( "close" );
        	}
        });
        
    },
    
    /**
     * eventType이 ondrop이면 드래그 드랍으로 캔버스에 그린 경우이다.
     * 만일 'dblclick'이라면 그려진 도형의 속성을 변경하기 위한 이벤트이다.
     */
    showPointDialog: function(offset, jsonData, panel, shapeElement, eventType) {
    	var me = this;
    	var element ={};
        element['id'] = 'pointDialog';
        element['shape'] = {};
        element.shape = {label:'Point Properties'};
    	//기존 대화장이 있을 경우 삭제하도록 한다.
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
        
        // 속성 테이블
        var panel = $('#pointProperty').clone();
        panel[0].id = 'clonePointProperty';
        dialog.append(panel);
       // 적용 버튼
        var applyBtn = $('<button class="btn btn-primary" id="applyPointProperty" type="button" style="margin-left:72px">Apply</button>');
        dialog.append(applyBtn);
        // 취소 버튼
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
        		 * 자신을 중심으로 연결된 edge의 라벨도 변경시켜야 한다. 
        		 */
        		me.changeEdgeLabel(shapeElement);
        		
				$(this).remove();
	        	dialog.dialog( "close" );
        	}
        });
        
    },
    
    /**
     * 맨홀의 프로퍼티 창
     */
    showManholeDialog: function(offset, jsonData, panel, shapeElement, eventType) {
    	var me = this;
    	var element ={};
        element['id'] = 'manholeDialog';
        element['shape'] = {};
        element.shape = {label:'Manhole Properties'};
    	//기존 대화장이 있을 경우 삭제하도록 한다.
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
        
        // 속성 테이블
        var panel = $('#manholeProperty').clone();
        panel[0].id = 'cloneManholeProperty';
        dialog.append(panel);
       // 적용 버튼
        var applyBtn = $('<button class="btn btn-primary" id="applyManholeProperty" type="button" style="margin-left:110px">Apply</button>');
        dialog.append(applyBtn);
        
        // 취소 버튼
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
        		// 포인트명 체크 로직
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
        		 * 자신을 중심으로 연결된 edge의 라벨도 변경시켜야 한다. 
        		 */
        		me.changeEdgeLabel(shapeElement);
				$(this).remove();
	        	dialog.dialog( "close" );
        		
        	}
        });
        
    },
    
    /**
     * 맨홀 및 로케이션 포인트 지정시 중복 체크를 해야 한다.
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
     * 레이스웨이 프로퍼티창
     */
    showRaceWayDialog: function(edgeElement, fromElement, toElement, eventType) {
    	var me = this;
    	var element ={};
        element['id'] = 'raceWayDialog';
        element['shape'] = {};
        element.shape = {label:'RaceWay Properties'};
    	//기존 대화장이 있을 경우 삭제하도록 한다.
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
        
        // 적용 버튼
        var applyBtn = $('<button class="btn btn-primary" id="applyRaceWayProperty" type="button" style="margin-left:95px">Apply</button>');
        dialog.append(applyBtn);
        
        // 취소 버튼
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
        		 * 소수점 입력하기 위해 .만 찍었을때.
        		 */
        		if(inputChk == '') {
        			msgBox(me.MSGMessages.TEMPINPUTCHK, $("#cloneRaceWayProperty").find(".raceWayTemp"));
            	    return;
        		}

        		/**
        		 * 사이즈 체크
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
     * 로드가 캔버스에 드랍되었을 경우의 처리
     */
    onLoadDrop: function (loadElement, from) {
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
        
        /**
         * 해당 로드 정보는 updateList에 저장한다.
         * 하지만 서버로부터 그려지는 로드는 제외해야한다.
         */
        if( from == null ) {
        	me._CONTROLLER.updateFeederList.push(loadElement.shape.data);
        }
    },


    /**
     * 사용자로 인해 캔버스에 이벤트가 발생하였을 경우 처리
     */
    bindEvent: function () {
        var me = this;
        //Action Event. 이 이벤트들은 렌더러의 isUpdated 값을 true 로 만든다.
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
	                 * viewController의 feederMgtShapeList에서 해당 shape의 정보가 있다면
	                 * 기존의 정보를 삭제하기 위해서 deleteFeederList에 정보를 넣어야 한다.
	                 * @type {Array|*|updateList}
	                 */
	                var feederMgtShapeList = me._CONTROLLER.feederMgtShapeList;
	                var updateFeederList = me._CONTROLLER.updateFeederList;
	                /** 기존 데이터에서 정보를 검색한다 */
	                var swgrKey = 'swgr_list_seq';
	                var loadKey = 'load_list_seq';
	                if(shapeElement.shape.data.fe_swgr_load_div == 'S') {
	                 	 /**
		                 * 이 정보가 없다는 것은 서버로부터 저장된 json으로부터 그려진 캔버스 객체의 정보중
		                 * 하나가 지워졌다고 판단할 수 있다.
		                 * 해당 지워지는 shape가 스위치트랜스퍼머인지 로드인지 체크부터 하고
		                 * 다음 로직을 수행해야한다.
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
	
	                    /** updateList에서도 조회를 해야한다 **/
	                    updateFeederList.some(function(item, idx){
	                        if( item.hasOwnProperty(swgrKey) && item[swgrKey] == shapeElement.shape.data[swgrKey]) {
	                            updateFeederList.splice(idx, 1);
	                        }
	                    });
	
	                } else {
	                	if(!shapeElement.shape.data.hasOwnProperty('model')){
	                		
	                		
	                		var loadObj = parent.getLoad(shapeElement.shape.data.load_list_seq);
	                		
	                		/**
	                		 * 기존에 없는 프로퍼티들을 설정해야 한다.
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
	
	                    /** updateList에서도 조회를 해야한다 **/
	                    updateFeederList.some(function(item, idx){
	                        if( item.hasOwnProperty(loadKey) && item[loadKey] == shapeElement.shape.data[loadKey]) {
	                            updateFeederList.splice(idx, 1);
	                        }
	                    });
	                }
	            	
	                if(shapeElement.shape.data.model == me._CONTROLLER.model.UnAssignedLoadList.name) {
	
	                    //해당 아이템은 사용된 loadlist에서 삭제한다.
	                    var usedLoadList = me._CONTROLLER.usedLoadList;
	                    var updateList = [];
	                    for (var i = 0; i < usedLoadList.length; i++) {
	                        if (usedLoadList[i].load_list_seq != shapeElement.shape.data.load_list_seq) {
	                            updateList.push(usedLoadList[i]);
	                        }
	                    }
	
	                    me._CONTROLLER.usedLoadList = updateList;
	
	                    // 전체 도형을 그린 이후에 사용한 load item은 제외하고 해당 그리드를 다시 그려야 한다.
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
	
	                    var panel = me._CONTROLLER.model.UnAssignedLoadList.panel;
                    	me._CONTROLLER.redrawDataTables(panel, newList, me._CONTROLLER);	
	                    
	                }
	                //지워진 로드가 만일 switchtransfomer라면
	                else if(shapeElement.shape.data.model == me._CONTROLLER.model.SwgrList.name) {
	                	
	                	//this.initUnusedSwitchList = [];
	                    //this.usedSwitchList = [];
	                    //해당 아이템은 사용된 loadlist에서 삭제한다.
	                    var usedSwitchList = me._CONTROLLER.usedSwitchList;
	                    var updateList = [];
	                    for (var i = 0; i < usedSwitchList.length; i++) {
	                        if (usedSwitchList[i].swgr_list_seq != shapeElement.shape.data.swgr_list_seq) {
	                            updateList.push(usedSwitchList[i]);
	                        }
	                    }
	
	                    me._CONTROLLER.usedSwitchList = updateList;
	
	                    // 전체 도형을 그린 이후에 사용한 load item은 제외하고 해당 그리드를 다시 그려야 한다.
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
            		
            		// 도형을 먼저 지워서 타고 오는지 또는 edge를 지우면서 타고 오는지 체크한다.
                	if(me._CONTROLLER.removeFirstShapeTypeAtHierarchy == null) {
                		me._CONTROLLER.removeFirstShapeTypeAtHierarchy = me.Constants.SHAPE.GEOM;
                	}
            		/**
            		 * feeder모드에서는 무조건 edge가 존재한다. 이유는 load나 여타 type이 스위치에 붙을 때는 스위치와 연결되기 때문이다.
            		 * 하지만 hierarchy모드에서는 하나만 존재할 수 있다.
            		 * 따라서 하나만 지우게 해야한다.
            		 * me._CONTROLLER.tempElement에 들어온 정보를 세팅하고 리턴하면 된다.
            		 * 하지만 지워진 shape이 빌딩인지 스위치피더인지 체크 
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
	
	                    /** updateList에서도 조회를 해야한다 **/
            			updateFeederHierarchyList.some(function(item, idx){
	                        if(item.feeder_list_mgt_seq == shapeElement.shape.data.feeder_list_mgt_seq) {
	                        	updateFeederHierarchyList.splice(idx, 1);
	                        }
	                    });
            			
            			// 사용된 리스트를 확인한다.
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
	
	                    // 전체 도형을 그린 이후에 사용한 load item은 제외하고 해당 그리드를 다시 그려야 한다.
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
            		
            		// 도형을 먼저 지워서 타고 오는지 또는 edge를 지우면서 타고 오는지 체크한다.
                	if(me._CONTROLLER.removeFirstShapeTypeAtRoute == null) {
                		me._CONTROLLER.removeFirstShapeTypeAtRoute = me.Constants.SHAPE.GEOM;
                	}
            		
                	/**
                	 * 빌딩 그리드에서 넘어온 정보라면
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
	
	                    // 전체 도형을 그린 이후에 사용한 load item은 제외하고 해당 그리드를 다시 그려야 한다.
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
            	// 도형을 먼저 지워서 타고 오는지 또는 edge를 지우면서 타고 오는지 체크한다.
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
        	 * 고려해야할 사항.
        	 * shape를 이동시 어떻게 관계를 설정해서 이 로직을 안태울 것인가를 고민해야함
        	 */
        	if( me.getMode() == me.Constants.MODE.HIERARCHY) {
        		var prevEdges = me.canvas.getPrevEdges(toElement);
        		if(prevEdges.length > 0) {
        			prevEdges.forEach(function(edge){
    					var edge = me.canvas.getRelatedElementsFromEdge(edge);
    					var fromShapeData = edge.from.shape.data;
    					// from 데이터가 자신과 같다면 자신은 이미 상위 피더 리스트이다. 
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
         * 케이블 변경이 일어났을 경우 이벤트
         */
        $(me.canvas.getRootElement()).bind('cableChange', function (event, shapeElement, beforeShapeId, afterShapeId) {
            console.log(shapeElement, beforeShapeId, afterShapeId);
        });

        /**
         * 라우트 보기 이벤트
         */
        $(me.canvas.getRootElement()).bind('showCableList', function (event, shapeElement) {
            me.onShowCableList(shapeElement, null);
        });

        /**
         * 정보 보기 이벤트
         */
        $(me.canvas.getRootElement()).bind('showProperty', function (event, shapeElement) {
            me.onShowProperty(shapeElement);
        });
      
        /**
         * 캔버스 로딩 이벤트
         */
        me.canvas.onLoading(function (event, progress) {
        	console.log(progress);
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
     * Route에서 
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
     * 정보 보기 이벤트를 처리한다.
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
        //서버에 바로 보내기
        //me._DATA_CONTROLLER.블라블라();
    },
    
    highLightHierarchyFeeder: function(element) {
    	var me = this;
        //선택된 HierarchyFeeder 애니메이션
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
         //선택된 HierarchyFeeder 애니메이션
         if (!element.shape.data) {
             element.shape.data = {};
         }
         element.shape.data.highlight = false;
         me.canvas.getRenderer().redrawShape(element);
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
    	 * 하이라이트 된 모든 레이스웨이 해제
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
     * 해당 레이스웨이를 지나는 케이블 리스트를 팝업하고, 케이블 선택시 다른 라우트 경로를 선택가능하게 한다.
     * @param element
     */
    onShowCableList: function (element, from) {
        var me = this;

        //기존 대화장이 있을 경우 삭제하도록 한다.
        var dialogName = me._CONTAINER_ID + me.Constants.PREFIX.DIALOG;
        me.destroyCableDialog($('[name=' + dialogName + ']'));

        //다이어로그 창을 띄운다.
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
        
        //하이라이팅 된 패스 리스트
        var currentPath;
        me.highLightRaceway(element, true);

        //케이블 데이터를 불러온다.
        var cables = me.getCablesWithRaceway(element);

        //패널의 네임스페이스
        var panelName = me._CONTAINER_ID + me.Constants.PREFIX.DIALOG_TABLE;
        var panelId = me._CONTAINER_ID + element.id + me.Constants.PREFIX.DIALOG_TABLE;


        //케이블 그리드의 내용을 구성한다.
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

        
        //대화창에 그리드를 삽입한다.
        var panel = $('<table></table>');
        panel.attr('name', panelName);
        panel.attr('id', panelId);
        panel.css('font-size', me._CONFIG.DEFAULT_SIZE.GRID_FONT);
        panel.css('width', '100%');
        panel.addClass('display').addClass('gridTable').addClass('cell-border').addClass('table').addClass('table-bordered').addClass('table-hover');
        
        dialog.append(panel);
        if(from == 'fromGrid') {
	        //대화창에 버튼을 삽입한다.
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
                
            	var allEdges = me.getCanvas().getAllEdges();
            	
            	/**
            	 * 하이라이트 된 모든 레이스웨이 해제
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
                //어플라이 버튼 클릭 이벤트를 처리한다.
                if(from != null) {
	                alternativeBtn.removeClass('noClick');
	                alternativeBtn.unbind('click');
	                alternativeBtn.bind('click', function () {
	                	console.log(itemData);
	                	var updateCableData = {};
	                	updateCableData['cable_list_seq'] = element.shape.data.cable_list_seq;
	                	updateCableData['rou_ref_tot_path'] = itemData.realPath;
	                	updateCableData['rou_ref_tot_len'] = itemData.totalLength;
	                	var returnData = parent.updateCablePath(updateCableData);
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
            var fromPointLength = 0;
            var toPointLength = 0;
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
                                fromPointLength = parent.shape.data.loc_ref_length;
                            } else {
                                toBLDG = parent.shape.label;
                                toPointLength = parent.shape.data.loc_ref_length;
                            }
                        }
                    }
                }
            }
            //시작, 끝 로케이션이 모두 빌딩 안에 속해있다면
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