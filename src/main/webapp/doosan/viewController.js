/**
 * Created by Seungpil Park on 2016. 9. 6..
 */
var ViewContorller = function () {
    /**
     * 컨트롤러의 메시지 일람
     */
    this.message = {
        NO_EDITOR_OBJECT: 'NO_EDITOR_OBJECT',
        NEW: 'NEW',
        MOD: 'MOD'
    };

    /**
     * 캔버스 렌더러의 Constants 및 _CONFIG 사용용도(네임스페이스 이용)
     */
    this.Constants = new Renderer().Constants;
    this.Config = new Renderer()._CONFIG;

    /**
     * 현재 컨트롤러의 모드
     */
    this.currentMode = this.Constants.MODE.FEEDER;

    /**
     * 어사인 피더 에디터 캔버스
     * @type {null}
     */
    this.feederRenderer = null;
    this.feederRendererId = 'feederCanvas';

    /**
     * 라우트 에디터 캔버스
     * @type {null}
     */
    this.routeRenderer = null;
    this.routeRendererId = 'routeCanvas';

    /**
     * 하이어라키 에디터 캔버스
     * @type {null}
     */
    this.hierarchyRenderer = null;
    this.hierarchyRendererId = 'hierarchyCanvas';

    /**
     * 테오스와의 데이터 통신을 담당하는 컨트롤러
     * @type {DataController}
     */
    this.dataController = new DataController();

    /**
     * 프로젝트 데이터
     */
    this.projectData = undefined;

    /**
     * switch 리스트 reload를 위한 데이터
     */
    this.initUnusedSwitchList = [];
    this.usedSwitchList = [];

    /**
     * load 리스트 reload를 위한 데이터
     */
    this.initUnusedLoadList = [];
    this.usedLoadList = [];

    /**
     * 기존 피더에서 끌어와서 json데이터로 캔버스를 갱신할 경우.
     * json데이터로 그려진 캔버스의 도형들의 data를 리스트로 갖는다.
     * updateFeederList, deleteFeederList
     */
    this.feederMgtShapeList = [];
    this.updateFeederList = [];
    this.deleteFeederList = [];
    this.tempElement = null;
    this.parentSwitchElement = null;


    /**
     * hierarchyCanvas에 처음 그려지는 빌딩, 플로우, 피더의 정보를 담아낸다.
     * 최종적으로 정보를 통해서 변경된 스위치나 빌딩이 존재한다면
     * 피더 경우에는 hierarchy 피더 리스트가 삭제된 경우에는 최초 존재했던 피더를 캔버스에서 해당 피더를 지워야한다.
     * 추가된 피더는 사용자가 그릴테니 그건 패스,
     * 빌딩 추가시에는 기존 그려진 캔버스에서 겹치지 않게 임의의 위치에 해당 빌딩과 플로어를 그린다.
     * 피더리스트 그리드를 갱신하기 위한 객체 추가
     */
    this.feederHierarchyMgtShapeList = [];
    this.updateFeederHierarchyList = [];
    this.deleteFeederHierarchyList = [];

    this.initUnusedHierarchyFeederList = [];
    this.usedHierarchyFeederList = [];
    this.initHierarchyBldgs = [];
    this.initHierarchyFloors = [];
    this.initHierarchyFeeders = [];

    /**
     * 로케이션 초기 로드 데이터
     */
    this.initLocationReferenceList = [];

    /**
     * 빌딩 초기 로드 데이터
     */
    this.initBldgReferenceList = [];
    this.usedBldgReferenceList = [];

    /**
     * 레이스웨이 초기 로드 데이터
     */
    this.initRacewayReferenceList = [];

    /**
     * 라우트 초기 로드 데이터
     */
    this.initRouteReferenceList = [];

    this.removeFirstShapeTypeAtHierarchy = null;
    this.removeFirstShapeTypeAtRoute = null;

    /**
     * 테이블/트리 구조모델. 캔버스의 각 shape 모델과는 다른 의미이다.
     */
    this.model = {
        /**
         * 어사인된 로드리스트 (feederRenderer)
         */
        AssignedFeederList: {
            name: 'AssignedFeederList',
            panel: $('#AssignedFeederTree')
        },

        /**
         * 스위치기어 리스트 (feederRenderer)
         */
        SwgrList: {
            name: 'SwgrList',
            panel: $('#swgrGrid')
        },

        /**
         * 피더 리스트 (feederRenderer)
         */
        FeederList: {
            name: 'FeederList',
            panel: $('#feederGrid')
        },

        /**
         * 어사인 되지 않은 로드리스트 (feederRenderer)
         */
        UnAssignedLoadList: {
            name: 'UnAssignedLoadList',
            panel: $('#unAssignedLoadGrid')
        },

        /**
         * 하이어라키 트리 (hierarchyRenderer)
         */
        HierarchyTreeList: {
            name: 'HierarchyTreeList',
            panel: $('#hierarchyTree')
        },

        /**
         * 피더 리스트 (hierarchyRenderer)
         */
        HierarchyFeederList: {
            name: 'HierarchyFeederList',
            panel: $('#hierarchy-feederGrid')
        },

        /**
         * 로케이션 레퍼런스 (routeRenderer)
         */
        LocationReferenceList: {
            name: 'LocationReferenceList',
            panel: $('#locationRefGrid')
        },

        /**
         * 레이스웨이 레퍼런스 (routeRenderer)
         */
        RacewayReferenceList: {
            name: 'RacewayReferenceList',
            panel: $('#racewayRefGrid')
        },

        /**
         * 라우트 레퍼런스 (routeRenderer)
         */
        RouteReferenceList: {
            name: 'RouteReferenceList',
            panel: $('#routeRefGrid')
        },

        /**
         * 빌딩 레퍼런스 (routeRenderer)
         */
        BldgReferenceList: {
            name: 'BldgReferenceList',
            panel: $('#bldgRefGrid')
        },

        /**
         * 케이블 레퍼런스 (routeRenderer)
         */
        CableReferenceList: {
            name: 'CableReferenceList',
            panel: $('#cableRefGrid')
        }
    };
};
ViewContorller.prototype = {
		
    /**
     * 툴바의 드랍다운 메뉴를 활성화하고, 이벤트를 등록한다.
     */
    bindMenuEvent: function () {
        var me = this;
        
        // zoom fit
        $('#editor-zoomFit').click(function(){
        	var renderer = me.getRendererByMode(me.currentMode);
            var canvas = renderer.getCanvas();
        	canvas.setScale(1);
        	canvas.updateNavigatior();
        });
        
        // zoom in +
        $('#editor-zoomIn').click(function(){
        	var renderer = me.getRendererByMode(me.currentMode);
            var canvas = renderer.getCanvas();
        	var preScale = canvas.getScale();
            var cuScale = preScale + 0.1;
            canvas.setScale(cuScale);
            canvas.updateNavigatior();
        });
        
        // zoom out -
        $('#editor-zoomOut').click(function(){
        	var renderer = me.getRendererByMode(me.currentMode);
            var canvas = renderer.getCanvas();
        	var preScale = canvas.getScale();
            var cuScale = preScale - 0.1;
            canvas.setScale(cuScale);
            canvas.updateNavigatior();
        });
        // save click event binding
        $('#editor-save').click(function(){
        	
        	$.blockUI({ css: { 
                border: 'none', 
                padding: '15px', 
                backgroundColor: '#000', 
                '-webkit-border-radius': '10px', 
                '-moz-border-radius': '10px', 
                opacity: .5, 
                color: '#fff' 
            } }); 
        	
        	setTimeout(me.saveWrapper, 100, me);
        });
        
        // 데이터 유틸리티
        var dataModal = $('#dataBox');
        dataModal.find('[name=close]').click(function () {
            dataModal.find('.close').click();
        });
        
        $("li#menu-printJson").bind("click", function(){
	          dataModal.find('[name=save]').hide();
	          var renderer = me.getRendererByMode(me.currentMode);
	          var json = JSON.stringify(renderer.canvas.toJSON());
	          dataModal.find('textarea').val(json);
	          dataModal.modal({
	              show: true
	          });
        })
        
        $('li#menu-printXml').bind('click', function () {
            dataModal.find('[name=save]').hide();
            var renderer = me.getRendererByMode(me.currentMode);
            var xml = renderer.canvas.toXML();
            dataModal.find('textarea').val(xml);
            dataModal.modal({
                show: true
            });
        });

        $('li#menu-loadJson').bind('click', function () {
            dataModal.find('[name=save]').show();
            dataModal.find('[name=save]').unbind('click');
            dataModal.find('[name=save]').bind('click', function () {
                var val = dataModal.find('textarea').val();
                var json = JSON.parse(val);
                var renderer = me.getRendererByMode(me.currentMode);
                
            	$.blockUI({ css: { 
                    border: 'none', 
                    padding: '15px', 
                    backgroundColor: '#000', 
                    '-webkit-border-radius': '10px', 
                    '-moz-border-radius': '10px', 
                    opacity: .5, 
                    color: '#fff' 
                } }); 
            	
            	setTimeout(renderer.loadWrapper, 100, renderer, dataModal, 'json', json);
                
            });
            dataModal.find('textarea').val('');
            dataModal.modal({
                show: true
            });
        });
        
        
        $('li#menu-loadXml').bind('click', function () {
            dataModal.find('[name=save]').show();
            dataModal.find('[name=save]').unbind('click');
            dataModal.find('[name=save]').bind('click', function () {
                var xml = dataModal.find('textarea').val();
                var renderer = me.getRendererByMode(me.currentMode);
                
                $.blockUI({ css: { 
                    border: 'none', 
                    padding: '15px', 
                    backgroundColor: '#000', 
                    '-webkit-border-radius': '10px', 
                    '-moz-border-radius': '10px', 
                    opacity: .5, 
                    color: '#fff' 
                } }); 
            	
            	setTimeout(renderer.loadWrapper, 100, renderer, dataModal, 'xml', xml);
            });
            dataModal.find('textarea').val('');
            dataModal.modal({
                show: true
            });
        });

        //어노테이션 메뉴
        $('.ogCanvas').click(function (event) {
            var renderer = me.getRendererByMode(me.currentMode);
            var shapeInfo = renderer.getContainer().data('CLICK_SHAPE');
            if (shapeInfo) {
                var shape = eval('new ' + shapeInfo._shape_id + '()');
                var dropX = event.pageX - renderer.getContainer().offset().left + renderer.getContainer().get(0).scrollLeft;
                var dropY = event.pageY - renderer.getContainer().offset().top + renderer.getContainer().get(0).scrollTop;
                dropX = dropX / renderer.getCanvas()._CONFIG.SCALE;
                dropY = dropY / renderer.getCanvas()._CONFIG.SCALE;
                renderer.getCanvas().drawShape([dropX, dropY],
                    shape, [parseInt(shapeInfo._width, 10), parseInt(shapeInfo._height, 10)]);
                renderer.getContainer().removeData('CLICK_SHAPE');
                renderer.getContainer().css({
                    cursor: 'default'
                });
            }
        });

        $('.ogCanvas').mousedown(function (e) {
            if (e.button == 2) {
                var renderer = me.getRendererByMode(me.currentMode);
                renderer.getContainer().removeData('CLICK_SHAPE');
                renderer.getContainer().css({
                    cursor: 'default'
                });
                return false;
            }
            return true;
        });

        $('#editor-shape-menu').find('li').click(function () {
            var renderer = me.getRendererByMode(me.currentMode);
            var img = $(this).find('img');
            renderer.getContainer().data('CLICK_SHAPE', {
                '_shape_type': img.attr('_shape_type'),
                '_shape_id': img.attr('_shape_id'),
                '_width': img.attr('_width'),
                '_height': img.attr('_height')
            });
            renderer.getContainer().addClass('custom');
            renderer.getContainer().css({
                cursor: 'url(' + img.attr('src') + '), auto'
            });
        });

        // 백도어 메뉴
        var backdoorBtn = $('[name=menu-importBackdoor]');
        var backDoorSize = $('#backdoor-size-range');
        var backDoorOpacity = $('#backdoor-opacity-range');
        var fileInput = $('#backdoor-upload');
        backdoorBtn.click(function (e) {
            fileInput.click();
        });
        fileInput.bind('change', function (event) {
            var target = event.delegateTarget;
            if (target.files && target.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var renderer = me.getRendererByMode(me.currentMode);
                    renderer.addBackDoor(e.target.result, backDoorSize.val(), backDoorOpacity.val());
                };
                reader.readAsDataURL(target.files[0]);
            }
        });

        backDoorSize.bind('change', function (event) {
            var renderer = me.getRendererByMode(me.currentMode);
            renderer.updateBackDoor($(this).val(), null);
            $('#backdoor-size-range-text').html('Size : ' + $(this).val() + '%');
        });

        backDoorOpacity.bind('change', function (event) {
            var renderer = me.getRendererByMode(me.currentMode);
            renderer.updateBackDoor(null, $(this).val());
            $('#backdoor-opacity-range-text').html('Opacity : ' + $(this).val());
        });

        var preventClose = $('.preventClose');
        preventClose.bind('mousedown', function (event) {
            event.stopPropagation();
        });
        preventClose.bind('mouseup', function (event) {
            event.stopPropagation();
        });
        preventClose.bind('click', function (event) {
            event.stopPropagation();
        });
        
        $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
        // 해당 버튼을 클릭하면 swgr를 입력받을 수 있는 웹쪽 ui를 띄운다.
        // 주소는 제공받는걸
        $("#newSwgr").bind('click', function(event){
        	//parent.editSWGRInfo('', '', me.editSWGRInfoCallBack);
        });
        
        $("#swgr-nav").bind('click', function(event){
        	if($(this).hasClass('clickedTab')) {
        		return;
        	} else {
        		$(this).addClass('clickedTab');
        	}
        	var panel = me.model.SwgrList.panel;
        	setTimeout(me.redrawDataTables, 160, panel, me.initUnusedSwitchList, me);
        });
        
        $("#load-nav").bind('click', function(event){
        	if($(this).hasClass('clickedTab')) {
        		return;
        	} else {
        		$(this).addClass('clickedTab');
        	}
        	var panel = me.model.UnAssignedLoadList.panel;
            setTimeout(me.redrawDataTables, 170, panel, me.initUnusedLoadList, me);
        });
        $("#hier-feeder").bind('click', function(event){
        	if($(this).hasClass('clickedTab')) {
        		return;
        	} else {
        		$(this).addClass('clickedTab');
        	}
        	var panel = me.model.HierarchyFeederList.panel;
        	setTimeout(me.redrawDataTables, 170, panel, me.initUnusedHierarchyFeederList, me);
        });
        $("#bldgRefTab").bind('click', function(event){
//        	if($(this).hasClass('clickedTab')) {
//        		return;
//        	} else {
//        		$(this).addClass('clickedTab');
//        	}
        	var panel = me.model.BldgReferenceList.panel;
        	setTimeout(me.redrawDataTables, 170, panel, me.initBldgReferenceList, me);
        });
        
        $("#locationParentTab").bind('click', function(event){
        	var panel = me.model.BldgReferenceList.panel;
        	setTimeout(me.redrawDataTables, 170, panel, me.initBldgReferenceList, me);
        });
        
        $("#racewayRefTab").bind('click', function(event){
        	if($(this).hasClass('clickedTab')) {
        		return;
        	} else {
        		$(this).addClass('clickedTab');
        	}
        	var panel = me.model.RacewayReferenceList.panel;
        	setTimeout(me.redrawDataTables, 170, panel, me.initRacewayReferenceList, me);
        });
        $("#routeParentTab").bind('click', function(event){
        	if($(this).hasClass('clickedTab')) {
        		return;
        	} else {
        		$(this).addClass('clickedTab');
        	}
        	var panel = me.model.RouteReferenceList.panel;
        	setTimeout(me.redrawDataTables, 170, panel, me.initRouteReferenceList, me);
        	$('#routeChildTab').addClass('clickedTab');
        });
        $("#cableRefTab").bind('click', function(event){
        	if($(this).hasClass('clickedTab')) {
        		return;
        	} else {
        		$(this).addClass('clickedTab');
        	}
        	var panel = me.model.CableReferenceList.panel;
        	setTimeout(me.redrawDataTables, 170, panel, me.initCableReferenceList, me);
        });
        
    },

    redrawDataTables: function(panel, gridData, viewController) {
    	
    	if(panel[0].id == 'bldgRefGrid') {
    		var newData = [];
    		var usedBldgReferenceList = viewController.usedBldgReferenceList;
    		gridData.forEach(function(gridItem){
    			var dup = false;
    			usedBldgReferenceList.some(function(useItem){
    				if(gridItem.loc_ref_seq == useItem.loc_ref_seq) {
    					dup = true;
    				}
    			});
    			if(!dup) {
    				newData.push(gridItem);
    			}
    		})
    		gridData = newData;
    	}
    	//loc_ref_seq
        var dataTable = panel.dataTable().api();
        var currentPage = dataTable.page();
        dataTable.clear();
        dataTable.rows.add(gridData);
        dataTable.draw();
        dataTable.page(currentPage).draw(false);
        $('.DTFC_LeftBodyWrapper').addClass('DTFC_TOP');
    	$('.DTFC_LeftBodyLiner').addClass('DTFC_TOP');
    },
    
    addRowDataTables: function(panel, data) {
    	var dataTable = panel.dataTable().api();
    	var currentPage = dataTable.page();
        dataTable.rows.add(data);
        dataTable.draw();
        dataTable.page(currentPage).draw(false);
    },
    
    routeTabClickEvent: function(me) {
    	$.blockUI({ css: { 
            border: 'none', 
            padding: '15px', 
            backgroundColor: '#000', 
            '-webkit-border-radius': '10px', 
            '-moz-border-radius': '10px', 
            opacity: .5, 
            color: '#fff' 
        } });

        /**
         * 클릭할때마다 프로젝트 정보를 가져온다.
         * 이유는 웹에서 변경이 될 경우도 있기 때문이다.
         * 최초에는 캔버스를 클리어
         */
    	var projectInfo = me.projectData;
    	var routeJSON  = projectInfo.gui_route_json;
    	
    	if((routeJSON !=null && routeJSON !== undefined ) && typeof routeJSON == 'string'){
    		routeJSON = JSON.parse(routeJSON);
    	}
    	
    	var renderer = me.getRendererByMode(me.Constants.MODE.ROUTE);
    	if(routeJSON == null) {
    		setTimeout(me.drawToCanvasFromServerDataWrapper, 100, renderer, me, me.Constants.MODE.ROUTE);
    	} else {
    		// 있다면
        	setTimeout(renderer.loadWrapper, 100, renderer, null, 'json', routeJSON);
    	}
    	//me.refreshGridAndTree(me.Constants.MODE.HIERARCHY, renderer);
    },
    
    hierarchyTabClickEvent: function(me) {
    	$.blockUI({ css: { 
            border: 'none', 
            padding: '15px', 
            backgroundColor: '#000', 
            '-webkit-border-radius': '10px', 
            '-moz-border-radius': '10px', 
            opacity: .5, 
            color: '#fff' 
        } }); 
    	
    	/**
         * 클릭할때마다 프로젝트 정보를 가져온다.
         * 이유는 웹에서 변경이 될 경우도 있기 때문이다.
         * 최초에는 캔버스를 클리어
    	 */
    	var projectInfo = me.projectData;
    	var hierJSON  = projectInfo.gui_hier_json;
    	
    	if((hierJSON !=null && hierJSON != '' ) && typeof hierJSON == 'string'){
    		hierJSON = JSON.parse(hierJSON);
    	}
    	
    	var renderer = me.getRendererByMode(me.Constants.MODE.HIERARCHY);
    	if(hierJSON == null || hierJSON == '') {
    		setTimeout(me.drawToCanvasFromServerDataWrapper, 100, renderer, me, me.Constants.MODE.HIERARCHY);
    	} else {
    		// 있다면
        	setTimeout(renderer.loadWrapper, 100, renderer, null, 'json', hierJSON);
    	}
    	//me.refreshGridAndTree(me.Constants.MODE.HIERARCHY, renderer);
    },
    
    /**
     *  프로젝트에 hierarchy의 제이슨 정보가 없다면
     */
    drawToCanvasFromServerDataWrapper: function(renderer, viewController, mode) {
    	if(mode == viewController.Constants.MODE.HIERARCHY) {
    		renderer.drawToHierarchyCanvasFromServerData(mode);
    	} else if(mode == viewController.Constants.MODE.ROUTE) {
    		renderer.drawToRouteCanvasFromServerData(mode);
    	}
    },
    
    init: function () {
        var me = this;
        $(window).resize(function () {
            me.resizeContent();
        });

        var feederTab = $('.feederTab');
        var feederContent = $('.feeder-content');
        var hierarchyTab = $('.hierarchyTab');
        var hierarchyContent = $('.hierarchy-content');
        var routeTab = $('.routeTab');
        var routeContent = $('.route-content');
        feederTab.click(function () {
            $('.delayTab').removeClass('active');
            feederTab.addClass('active');
            feederContent.show();
            hierarchyContent.hide();
            routeContent.hide();
        });
        hierarchyTab.click(function () {
            $('.delayTab').removeClass('active');
            hierarchyTab.addClass('active');
            feederContent.hide();
            hierarchyContent.show();
            routeContent.hide();
            me.hierarchyTabClickEvent(me);
        });
        routeTab.click(function () {
            $('.delayTab').removeClass('active');
            routeTab.addClass('active');
            feederContent.hide();
            hierarchyContent.hide();
            routeContent.show();
            var panel = me.model.BldgReferenceList.panel;
        	setTimeout(me.redrawDataTables, 160, panel, me.initBldgReferenceList, me);
        });

        /**
         * delayTab 클래스가 붙은 Dom 은 에디터 선택 탭중, active 가 아닌것들이다.
         * active 가 아닌 탭의 콘텐츠는 css width,height 가 최초 탭 선택시 설정되므로, 최초 클릭에 한해 캔버스 사이즈도 맞추어서 그려주도록 한다.
         */
        $('.delayTab').click(function () {
            var mode = $(this).data('canvas');
            if (!$(this).data('isTabClicked')) {
                $(this).data('isTabClicked', true);
                setTimeout(function () {
                    if (mode == me.Constants.MODE.FEEDER) {
                        me.feederRenderer.setCanvasSize(
                            [$('#' + me.feederRendererId).width(), $('#' + me.feederRendererId).height()]);
                        $('#editor-backdoor').hide();
                    }
                    if (mode == me.Constants.MODE.HIERARCHY) {
                        me.hierarchyRenderer.setCanvasSize(
                            [$('#' + me.hierarchyRendererId).width(), $('#' + me.hierarchyRendererId).height()]);
                        me.hierarchyTabClickEvent(me);
                        $('#editor-backdoor').hide();
                    }
                    if (mode == me.Constants.MODE.ROUTE) {
                        me.routeRenderer.setCanvasSize(
                            [$('#' + me.routeRendererId).width(), $('#' + me.routeRendererId).height()]);
                        $('#editor-backdoor').show();
                        //var panel = me.model.BldgReferenceList.panel;
                        //setTimeout(me.redrawDataTables, 170, panel, me.initBldgReferenceList, me);
                        $('#bldgRefTab').addClass('clickedTab');
                        me.routeTabClickEvent(me);
                    }
                    me.activeCanvasSlider(mode);
                    me.currentMode = mode;
                }, 200);
            } else {
                me.activeCanvasSlider(mode);
                me.currentMode = mode;
                if (mode == me.Constants.MODE.ROUTE) {
                    $('#editor-backdoor').show();
                } else {
                    $('#editor-backdoor').hide();
                }
            }
        });

        /**
         * 화면 리사이징 후 캔버스를 렌더링한다.
         */
        me.resizeContent();
        me.feederRenderer = new Renderer(me.Constants.MODE.FEEDER, me.feederRendererId, this);
        me.hierarchyRenderer = new Renderer(me.Constants.MODE.HIERARCHY, me.hierarchyRendererId, this);
        me.routeRenderer = new Renderer(me.Constants.MODE.ROUTE, me.routeRendererId, this);

        me.resizeContent();
        /**
         * feederCanvas 는 처음에 슬라이더를 active 시킨다.
         */
        me.activeCanvasSlider('feeder');

        /**
         * 트리 노드의 드래그 드랍 이벤트를 Document 에 설정한다.
         */
        me.bindTreeDragDrop();

        /**
         * 프로젝트 데이터
         */
        me.renderProjectReference();
        /**
         * SWGR / Assigned Feeder Editor 그리드
         */
        me.renderSwgrSelectBox();
        me.renderGrid(me.model.FeederList.name);
        me.renderGrid(me.model.UnAssignedLoadList.name);
        $('#editor-backdoor').hide();
        Pace.on("done", function(){
            setTimeout(me.settingOtherMenuLoad, 1500, me);
        });
    },
    
    settingOtherMenuLoad: function(viewController) {
    	viewController.settingFeederEditorMenu(viewController);
        /**
         * Hierarchy Editor 그리드
         */
    	viewController.settingHierarchyEditorMenu(viewController);
        /**
         * BLDG / Route Editor 그리드
         */
    	viewController.settingRouteEditorMenu(viewController);
    	viewController.bindLocationDragDrop();
    	viewController.bindMenuEvent();
    },
    
    saveWrapper: function(me) {
    	me.dataController.saveGui(me);
    },

    /**
     * 현재 모드를 불러온다.
     */
    getCurrentMode: function(){
        return this.currentMode;
    },

    /**
     * 피더 세이브 모드를 불러온다
     */
    getFeederSaveMode: function() {
        return this.Constants.FEEDER_SAVE_MODE.ISNEW;
    },

    /**
     * 피더 세이브 모드를 세팅한다.
     */
    setFeederSaveMode: function(saveMode) {
        this.Constants.FEEDER_SAVE_MODE.ISNEW = saveMode;
    },

    /**
     * 하이어라키 세이브 모드를 불러온다
     */
    getHierarchySaveMode: function() {
        return this.Constants.HIERARCHY_SAVE_MODE.ISNEW;
    },

    /**
     * 하이어라키 모드를 세팅한다.
     */
    setHierarchySaveMode: function(saveMode) {
        this.Constants.HIERARCHY_SAVE_MODE.ISNEW = saveMode;
    },

    /**
     * 라우트 세이브 모드를 불러온다
     */
    getRouteSaveMode: function() {
        return this.Constants.ROUTE_SAVE_MODE.ISNEW;
    },

    /**
     * 라우트 모드를 세팅한다.
     */
    setRouteSaveMode: function(saveMode) {
        this.Constants.ROUTE_SAVE_MODE.ISNEW = saveMode;
    },

    /**
     * 모드에 해당하는 캔버스 렌더러를 리턴한다.
     * @param mode
     */
    getRendererByMode: function (mode) {
        if (mode == this.Constants.MODE.FEEDER) {
            return this.feederRenderer;
        }
        if (mode == this.Constants.MODE.HIERARCHY) {
            return this.hierarchyRenderer;
        }
        if (mode == this.Constants.MODE.ROUTE) {
            return this.routeRenderer;
        }
        return null;
    },

    /**
     * 테이블/트리 모델명으로 표현되야할 캔버스 렌더러를 리턴한다.
     * @param modelName
     * @returns {*}
     */
    getRendererByModel: function (modelName) {
        var me = this;
        var feederRenderer = [
            me.model.AssignedFeederList.name,
            me.model.SwgrList.name,
            me.model.FeederList.name,
            me.model.UnAssignedLoadList.name
        ];
        var hierarchyRenderer = [
            me.model.HierarchyTreeList.name,
            me.model.HierarchyFeederList.name
        ];
        var routeRenderer = [
            me.model.LocationReferenceList.name,
            me.model.RacewayReferenceList.name,
            me.model.RouteReferenceList.name,
            me.model.BldgReferenceList.name,
            me.model.CableReferenceList.name
        ];

        if (feederRenderer.indexOf(modelName) != -1) {
            return this.feederRenderer;
        }
        if (hierarchyRenderer.indexOf(modelName) != -1) {
            return this.hierarchyRenderer;
        }
        if (routeRenderer.indexOf(modelName) != -1) {
            return this.routeRenderer;
        }
        return null;
    },
    /**
     * 테이블/트리 모델명으로 표현되야할 캔버스의 모드를 리턴한다.
     * @param modelName
     * @returns {*}
     */
    getModeByModel: function (modelName) {
        var mode;
        var rendererByModel = this.getRendererByModel(modelName);
        if (rendererByModel) {
            mode = rendererByModel.getMode();
        }
        return mode;
    },

    activeCanvasSlider: function (mode) {
        var me = this;
        if (mode == me.Constants.MODE.FEEDER) {
            me.feederRenderer.showSlider(true);
            me.feederRenderer.showDialog(true);

            me.hierarchyRenderer.showSlider(false);
            me.hierarchyRenderer.showDialog(false);

            me.routeRenderer.showSlider(false);
            me.routeRenderer.showDialog(false);
        }
        if (mode == me.Constants.MODE.HIERARCHY) {
            me.feederRenderer.showSlider(false);
            me.feederRenderer.showDialog(false);

            me.hierarchyRenderer.showSlider(true);
            me.hierarchyRenderer.showDialog(true);

            me.routeRenderer.showSlider(false);
            me.routeRenderer.showDialog(false);
        }
        if (mode == me.Constants.MODE.ROUTE) {
            me.feederRenderer.showSlider(false);
            me.feederRenderer.showDialog(false);

            me.hierarchyRenderer.showSlider(false);
            me.hierarchyRenderer.showDialog(false);

            me.routeRenderer.showSlider(true);
            me.routeRenderer.showDialog(true);
        }
    },
    /**
     * 윈도우의 높이에 맞추어서 콘텐츠를 담당하는 Dom 의 높이를 조절한다.
     */
    resizeContent: function () {
        var top = $('#feeder-content-wrapper').offset().top;
        var windowHeight = $(window).height();
        $('#feeder-content-wrapper').css('height', windowHeight - top - 30 + 'px');
        $('#hierarchy-content-wrapper').css('height', windowHeight - top - 30 + 'px');
        $('#route-content-wrapper').css('height', windowHeight - top - 30 + 'px');
    },
    /**
     * 데이터 테이블의 부가 기능 화면 css 를 재조정한다.
     * @param gridPanelId
     */
    modifyDataTablesStyle: function (gridPanelId) {
        var dataTable = $('#' + gridPanelId + '_wrapper');
        $(dataTable.find('.dataTables_filter')).parent().removeClass('col-sm-6');
        $(dataTable.find('.dataTables_filter')).parent().addClass('col-sm-12');
        $(dataTable.find('.dataTables_paginate')).parent().removeClass('col-sm-7');
        $(dataTable.find('.dataTables_paginate')).parent().addClass('col-sm-12');
        $(dataTable.find('.dataTables_paginate')).css('text-align', 'center');
    },
    
    /**
     * 캔버스 렌더러 로부터 메시지가 전달된 경우
     * @param renderer
     * @param data
     * @param message
     */
    onMessage: function (renderer, data, message, panel) {
        var me = this;
        var model = data['model'];
        var mode = me.getModeByModel(model);
        var infoMessage;

        /**
         * 캔버스에 에디팅 대상 오브젝트가 없을 경우
         */
        if (message == me.message.NO_EDITOR_OBJECT) {
            if (mode == me.Constants.MODE.FEEDER) {
                infoMessage = 'It is not Assigned Location of Editing Target to Canvas';
            }
            if (mode == me.Constants.MODE.HIERARCHY) {
                infoMessage = 'It is not Assigned Building of Editing Target to Canvas.';
            }
            if (mode == me.Constants.MODE.ROUTE) {
                infoMessage = 'It is not Assigned Project of Editing Target to Canvas.';
            }
            if (infoMessage) {
                msgBox(infoMessage);
            }
        }

        /**
         * 캔버스에 새로운 에디팅 대상 오브젝트를 세팅할경우
         */
        if (message == me.message.NEW) {
            //캔버스가 변경되었지만 저장되지 않았을 경우
            if (renderer.getIsUpdated()) {
                if (mode == me.Constants.MODE.FEEDER) {
                    infoMessage = 'You Do not Save Yet Working Feeder. Do You Open New Feeder?';
                }
                if (mode == me.Constants.MODE.HIERARCHY) {
                    infoMessage = 'You Do not Save Yet Working Hierarchy. Do You Open New Hierarchy?';
                }
                if (mode == me.Constants.MODE.ROUTE) {
                    infoMessage = 'You Do not Save Yet Working Route Project. Do You Open New Route Project?';
                }
                confirmBox(infoMessage, function (result) {
                    if (result) {
                        me.setEditingObject(renderer, data, panel);
                        me.renderGrid(me.model.SwgrList.name);
                        me.renderGrid(me.model.UnAssignedLoadList.name);
                        me.initTabClass();
                    }
                });
            }
            //캔버스가 변경되지 않았을 경우(저장을 마치거나, 아직 에디팅할 오브젝트가 반영되지 않았을 경우이다.)
            else {
                me.setEditingObject(renderer, data, panel);
                me.renderGrid(me.model.SwgrList.name);
                me.renderGrid(me.model.UnAssignedLoadList.name);
                me.initTabClass();
            }
        } else if (message == me.message.MOD) {
            //캔버스가 변경되었지만 저장되지 않았을 경우
            if (renderer.getIsUpdated()) {
                if (mode == me.Constants.MODE.FEEDER) {
                    infoMessage = 'You Do not Save Yet Working Feeder. Do You Open New Feeder?';
                }
                if (mode == me.Constants.MODE.HIERARCHY) {
                    infoMessage = 'You Do not Save Yet Working Hierarchy. Do You Open New Hierarchy?';
                }
                if (mode == me.Constants.MODE.ROUTE) {
                    infoMessage = 'You Do not Save Yet Working Route Project. Do You Open New Route Project?';
                }
                confirmBox(infoMessage, function (result) {
                    if (result) {
                    	
                    	$.blockUI({ css: { 
                            border: 'none', 
                            padding: '15px', 
                            backgroundColor: '#000', 
                            '-webkit-border-radius': '10px', 
                            '-moz-border-radius': '10px', 
                            opacity: .5, 
                            color: '#fff' 
                        } }); 
                    	
                    	setTimeout(me.setEditingObjectFromLoadDataWrapper, 100, me, renderer, data, panel);
                    }
                });
            }
            // 캔버스가 변경되지 않았을 경우(저장을 마치거나, 아직 에디팅할 오브젝트가 반영되지 않았을 경우이다.)
            else {
            	$.blockUI({ css: { 
                    border: 'none', 
                    padding: '15px', 
                    backgroundColor: '#000', 
                    '-webkit-border-radius': '10px', 
                    '-moz-border-radius': '10px', 
                    opacity: .5, 
                    color: '#fff' 
                } }); 
            	
            	setTimeout(me.setEditingObjectFromLoadDataWrapper, 100, me, renderer, data, panel);
            }
        }
    },

    initTabClass: function() {
    	$('li').removeClass('clickedTab');
    },
    
    setEditingObjectFromLoadDataWrapper: function(me, renderer, data, panel) {
    	me.setEditingObjectFromLoadData(renderer, data, panel);
    	me.renderGrid(me.model.SwgrList.name);
    	me.renderGrid(me.model.UnAssignedLoadList.name);
        me.initTabClass();
    },

    /**
     * json 또는 xml로 캔버스에 로딩할때 setEditingObject를 세팅한다.
     * @param renderer
     * @param loadData
     */
    setEditingObjectFromLoadData: function (renderer, shapeData, panel) {
    	
    	var me = this;
    	
        if (!renderer || !shapeData) {
            return;
        }
    	
        if(shapeData.content == '' || shapeData.content == null) {
        	renderer.drawToFeederCanvasFromServerData(shapeData, panel);
        } else {
        	var json = JSON.parse(shapeData.content);
        	renderer.canvas.loadJSON(json);
        }

        //데이터 혼용을 막기 위한 조치
        var data = JSON.parse(JSON.stringify(shapeData));

        //타이틀 박스를 세팅한다.
        var title = '';
        var containerId = renderer.getContainerId();
        var mode = renderer.getMode();
        if (mode == me.Constants.MODE.FEEDER) {
            title = 'FEEDER - ' + data['swgr_name'];
        }
        if (mode == me.Constants.MODE.HIERARCHY) {
            title = 'HIERARCHY PROJECT - ' + data['pjt_nm'];
        }
        if (mode == me.Constants.MODE.ROUTE) {
            title = 'BLDG/ROUTE PROJECT - ' + data['pjt_nm'];
        }
        var titleBox = $('#' + containerId + '-title');
        //titleBox.show();
        titleBox.html(title);

        //렌더러에 에디팅 오브젝트를 설정한다.
        renderer.editingObject = data;
        if(panel != null) {
            var panelId = panel[0].id;
            if(panelId == 'feederGrid') {
                renderer.editingObject['onDrop'] = panelId;
            }
        }
        renderer.setIsUpdated(false);

        /**
         * canvas에 그려진 도형들의 list를 생성해서 세팅한다.
         * 또한 그려진 canvas의 정보와 GUI가 아닌 웹상에서 해당 피더에 달려 있는 로드를 지웠을 경우에는
         * 그 로드를 찾아서 캔바스에서 지워야 한다.
         * me.feederMgtShapeList에서 해당 로드를 찾아서 지운다.
         */
        try {
            me.feederMgtShapeList = parent.getFeederInfo(renderer.editingObject.swgr_list_seq);
        }catch(e) {
            /** 珥덇린?솕 */
            me.updateFeederList = [];
            me.usedLoadList = [];
            me.deleteFeederList = [];
            return;
        }
        var geomShapeTypeElementList = [];
        
        var currentCanvas = renderer.getCanvas();
        var shapeList = currentCanvas.getAllShapes();
        for(var i=0; i<shapeList.length; i++) {
        	var selectShapeType = $(shapeList[i]).attr('_shape');
            if(selectShapeType == 'GEOM') {
                var selectItemData = shapeList[i].shape.data;
                geomShapeTypeElementList.push(shapeList[i]);
                if(i==0) {
                	me.parentSwitchElement = selectItemData;
                }
            }
            
        }

        /**
         * canvas의 제이슨 정보와 GUI가 아닌 웹상에서 해당 피더에 달려 있는 로드를 지웠을 경우에는
         * 그 로드를 찾아서 캔바스에서 지워야 한다.
         * me.feederMgtShapeList에서 해당 로드를 찾아서 지운다.
         */
        if(shapeData.content != '' && shapeData.content != null) {
        	
        	for(var j=0; j<geomShapeTypeElementList.length; j++) {
        		var elementData = geomShapeTypeElementList[j].shape.data;
        		var isDelete = true;
        		
        		if(elementData.fe_swgr_load_div == 'S') {
	        		me.feederMgtShapeList.some(function(item) {
	        			if(elementData.swgr_list_seq == item.swgr_list_seq && item.fe_swgr_load_div == 'S') {
	        				isDelete = false;
	        			}
	        		});
        		} else if(elementData.fe_swgr_load_div == 'L') {
        			me.feederMgtShapeList.some(function(item) {
	        			if(elementData.load_list_seq == item.load_list_seq && item.fe_swgr_load_div == 'L') {
	        				isDelete = false;
	        			}
	        		});
        		} else if(!elementData.hasOwnProperty('fe_swgr_load_div')) {
        			var shapeType = elementData.shapeType;
        			if(shapeType.indexOf('Load') > -1) {
        				elementData['fe_swgr_load_div'] = 'L';
        				me.feederMgtShapeList.some(function(item) {
    	        			if(elementData.load_list_seq == item.load_list_seq && item.fe_swgr_load_div == 'L') {
    	        				isDelete = false;
    	        			}
    	        		});
        			}
        			
        		}
        		
        		if(isDelete) {
        			renderer.canvas.removeShape(geomShapeTypeElementList[j]);
        		}
        	}
        	
        	$.unblockUI();
        }
        
        /** 초기화 */
        me.updateFeederList = [];
        me.usedLoadList = [];
        me.deleteFeederList = [];
        
        
    },

    /**
     * 하이어라키 빌딩/플로어 체크 로직
     */
    checkBldgsAndFloors: function(renderer, shapeData) {
    	
    	var currentCanvas = renderer.getCanvas();
    	var checkedData = {};
    	var msg = '';
    	var shapeList = currentCanvas.getAllShapes();
    	var isDraw = true;
    	var msg = '';
    	
    	if(shapeData.shapeType == renderer.Constants.TYPE.HIERARCHY_BLDG) {
    		shapeList.some(function(shapeElement){
    			if(shapeElement.shape.data.shapeType == renderer.Constants.TYPE.HIERARCHY_BLDG &&
    			   shapeElement.shape.data.hier_seq == shapeData.hier_seq		
    				){
    				isDraw = false;
    			}
    		});
    		checkedData['isDraw'] = isDraw;
    		if(!isDraw) {
    			msg = "Select Building Already Extits on Canvas.";
    		}
    		
    	} else if(shapeData.shapeType == renderer.Constants.TYPE.HIERARCHY_FLOOR) {
    		
    		shapeList.some(function(shapeElement){
    			if(shapeElement.shape.data.shapeType == renderer.Constants.TYPE.HIERARCHY_FLOOR &&
    	    			   shapeElement.shape.data.hier_seq == shapeData.hier_seq		
    	    		){
    				isDraw = false;
    	    	}
    		});
    		checkedData['isDraw'] = isDraw;
    		if(!isDraw) {
    			msg = "Select Floor Already Extits on Canvas.";
    		}
    	}
    	
    	checkedData['isDraw'] = isDraw;
    	checkedData['msg'] = msg;
    	
    	return checkedData;
    },

    /**
     * save한 이후에는 새로운 setEditingObject를 세팅해야 한다.
     * @param renderer
     */
    setEditingObjectFromSave: function (renderer) {

        var me = this;

        //타이틀 박스를 세팅한다.
        var title = '';
        var containerId = renderer.getContainerId();
        var mode = renderer.getMode();
        if (mode == me.Constants.MODE.FEEDER) {
            title = 'FEEDER - ' + renderer.editingObject['swgr_name'];
        }
        if (mode == me.Constants.MODE.HIERARCHY) {
            title = 'HIERARCHY PROJECT - ' + renderer.editingObject['pjt_nm'];
        }
        if (mode == me.Constants.MODE.ROUTE) {
            title = 'BLDG/ROUTE PROJECT - ' + renderer.editingObject['pjt_nm'];
        }
        var titleBox = $('#' + containerId + '-title');
        //titleBox.show();
        titleBox.html(title);

        //feeder정보를 가져온다.
        var feederInfo = [renderer.editingObject];
        feederInfo[0]['shapeType'] = me.Constants.TYPE.MODIFY_FEEDER;
        //렌더러에 에디팅 오브젝트를 설정한다.
        renderer.editingObject = feederInfo[0];
        renderer.setIsUpdated(false);

        /**
         * canvas에 그려진 도형들의 list를 생성해서 세팅한다.
         */
        me.feederMgtShapeList = feederInfo;
        
        var currentCanvas = renderer.getCanvas();
        var shapeList = currentCanvas.getAllShapes();
        for(var i=0; i<shapeList.length; i++) {
            var selectShapeType = $(shapeList[i]).attr('_shape');
            if(selectShapeType == 'GEOM' && i==0) {
                var selectShapeId = $(shapeList[i]).attr('_shape_id');
                var selectElement = currentCanvas.getElementsByShapeId(selectShapeId);
                var selectItemData = currentCanvas.getCustomData(shapeList[i]);
            	me.parentSwitchElement = selectItemData;
            	break;
            }
        }
        
        /** 초기화 */
        me.updateFeederList = [];
        me.usedLoadList = [];
        me.deleteFeederList = [];
        
    },

    /**
     * 렌더러에 새로운 에디팅 오브젝트를 설정하고, 타이틀을 세팅한다.
     * @param renderer
     * @param shapeData
     */
    setEditingObject: function (renderer, shapeData) {
        if (!renderer || !shapeData) {
            return;
        }
        var me = this;
        //데이터 혼용을 막기 위한 조치
        var data = JSON.parse(JSON.stringify(shapeData));

        //타이틀 박스를 세팅한다.
        var title = '';
        var containerId = renderer.getContainerId();
        var mode = renderer.getMode();
        if (mode == me.Constants.MODE.FEEDER) {
            title = 'FEEDER - ' + data['swgr_name'];
        }
        if (mode == me.Constants.MODE.HIERARCHY) {
            title = 'HIERARCHY PROJECT - ' + data['pjt_nm'];
        }
        if (mode == me.Constants.MODE.ROUTE) {
            title = 'BLDG/ROUTE PROJECT - ' + data['pjt_nm'];
        }
        var titleBox = $('#' + containerId + '-title');
        //titleBox.show();
        titleBox.html(title);

        //렌더러를 초기화한다.
        renderer.getCanvas().clear();
        renderer.getCanvas().setScale(1);
        renderer.fitCanvasSize();

        //렌더러에 에디팅 오브젝트를 설정한다.
        renderer.editingObject = data;
        me.parentSwitchElement = data;
        //이때, 도형을 모두 그린 후 캔버스가 업데이트 되지 않은 상태로 변경한다.
        if (data['shapeType'] == me.Constants.TYPE.MODIFY_FEEDER) {
            //TODO 기존의 오브젝트인 경우 xml 을 바탕으로 캔버스에 새로 렌더링한다.
            data['shapeType'] = me.Constants.TYPE.SWITCH_GEAR;
            renderer.drawImmediately(null, data);
            renderer.setIsUpdated(false);
        }

        //아닌경우, 렌더러에 새로 생성할 도형을 그린다. 캔버스가 업데이트 된 처리를 하도록 한다.
        if (data['shapeType'] == me.Constants.TYPE.NEW_FEEDER) {
            data['shapeType'] = me.Constants.TYPE.SWITCH_GEAR;
            renderer.drawImmediately(null, data);
            renderer.setIsUpdated(true);
        }
    },

    /**
     * 프로젝트 정보를 불러와서 내용을 등록한다.
     */
    renderProjectReference: function () {
        var me = this;
        me.dataController.getProjectInfo(function (err, data) {
            if (err) {
                console.log(err);
                msgBox('Do not Load Project Information.');
            }
            me.projectData = data;
            me.setEditingObject(me.routeRenderer, data);
            me.setEditingObject(me.hierarchyRenderer, data);
        });
    },
    /**
     * 스위치 셀렉트 박스의 내용을 등록한다.
     */
    renderSwgrSelectBox: function () {
        var me = this;
        var selectBox = $('#swgrSelectBox');
        me.dataController.getSwitchgearTypeList(function (err, data) {
            if (err) {
                console.log(err);
                msgBox('Do no Load Switch Type Select Box List.');
            }
            selectBox.append('<option value="" selected>--select new swgr type--</option>')
            for (var i = 0, leni = data.length; i < leni; i++) {
                selectBox.append('<option value="' + data[i]['dtl_cd'] + '">' + data[i]['label'] + '</option>')
            }
        });
    },

    onlyRacewayPath: function(itemData) {
    	var me = this;
    	var renderer = me.getRendererByMode(me.currentMode);
    	renderer.onRoutePathToDialog(itemData, 'path');
    },
    
    /**
     * Feeder Editor Grid And Tree Setting
     */
    settingFeederEditorMenu: function(viewController) {
    	viewController.renderGrid(viewController.model.SwgrList.name);
    	viewController.renderTree(viewController.model.AssignedFeederList.name);
    },

    /**
     * Hierarchy Editor Grid And Tree Setting
     */
    settingHierarchyEditorMenu: function(viewController) {
    	viewController.renderTree(viewController.model.HierarchyTreeList.name);
    	viewController.renderGrid(viewController.model.HierarchyFeederList.name);
    },
    
    /**
     * Route Editor Grid Setting
     */
    settingRouteEditorMenu: function(viewController) {
    	viewController.renderGrid(viewController.model.BldgReferenceList.name);
    	viewController.renderGrid(viewController.model.RacewayReferenceList.name);
    	viewController.renderGrid(viewController.model.RouteReferenceList.name);
    	viewController.renderGrid(viewController.model.CableReferenceList.name);
    },
    
    /**
     * 로케이션 드래그 드랍 이벤트를 담당한다.
     */
    bindLocationDragDrop: function () {
        var me = this;
        var canvas = me.routeRenderer;
        var randomRefName = function () {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            for (var i = 0; i < 2; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        };
        if (canvas) {
            $('#newPoint').draggable({
                start: function () {

                },
                helper: 'clone',
                appendTo: 'body',
                stop: function (event) {
                    //TODO 여기서, 로케이션 및 맨홀 데이터를 드랍한 후 서버에서 REF_NAME_TO 값을 받아와야 하는 것으로 추정한다.
                    //그리고, 캔버스쪽에서는 이 로케이션이 빌딩위로 드랍된 것 을 감지하여, 이 로케이션의 LOC_REF_NAME 를 변경해야 한다.
                    var refName = randomRefName();
                    var itemData = {
                        shapeLabel: refName,
                        shapeType: me.Constants.TYPE.LOCATION,
                        "pjt_sq": "",
                        "loc_ref_name_to": refName
                    };
                    canvas.getContainer().trigger('drop.viewController', [event, itemData]);
                }
            });

            $('#newManhole').draggable({
                start: function () {

                },
                helper: 'clone',
                appendTo: 'body',
                stop: function (event) {
                    //TODO 여기서, 로케이션 및 맨홀 데이터를 드랍한 후 서버에서 REF_NAME_TO 값을 받아와야 하는 것으로 추정한다.
                    //그리고, 캔버스쪽에서는 이 로케이션이 빌딩위로 드랍된 것 을 감지하여, 이 로케이션의 LOC_REF_NAME 를 변경해야 한다.
                    var refName = randomRefName();
                    var itemData = {
                        shapeLabel: refName,
                        shapeType: me.Constants.TYPE.MANHOLE,
                        "pjt_sq": "",
                        "loc_ref_name_to": refName
                    };
                    canvas.getContainer().trigger('drop.viewController', [event, itemData]);
                }
            });
        }
    },
    /**
     * 트리의 드래그 드랍 이벤트를 담당한다.
     */
    bindTreeDragDrop: function () {
        var me = this;
        var getJsonDataAndCanvas = function (event, data) {
            var nodeId = data.data.nodes[0];
            var nodeData = $(data.data.obj.context).jstree(true).get_node(nodeId);
            var canvas;
            if (nodeData) {
                var jsonData = nodeData.data;
                canvas = me.getRendererByModel(jsonData.model);
            }
            return {
                canvas: canvas,
                jsonData: jsonData
            }
        };
        $(document).bind('dnd_stop.vakata', function (event, data) {
            var jsonDataAndCanvas = getJsonDataAndCanvas(event, data);
            if (!jsonDataAndCanvas.canvas || !jsonDataAndCanvas.jsonData) {
                return;
            }
            jsonDataAndCanvas.canvas.getContainer().trigger('drop.viewController', [data.event, jsonDataAndCanvas.jsonData]);
        });
    },
    /**
     * 우측 메뉴의 트리구조를 생성한다.
     * @param model 모델명
     */
    renderTree: function (model) {
        var me = this;
        var panel = me.model[model].panel;
        var treeOptions = {};
        var renderTreeAction = function (treeOptions, treeData) {
            if (!panel) {
                return;
            }
            if (!panel.data('tree')) {
                panel.jstree(treeOptions)
                    .on("dblclick.jstree", function (event, data) {
                        //var node = $(event.target).closest("li");
                        //console.log(data);
                    })
                    .on("select_node.jstree", function (evt, data) {
                        //console.log(data);
                    })
                    .on('dnd_start.vakata', function (e, data) {
                        //console.log(data);
                    });
                //2018

            } else {
                panel.jstree(true).settings.core.data = treeData;
                panel.jstree(true).refresh();
            }
        };
        if (model == me.model.AssignedFeederList.name) {
            me.dataController.getAssignedFeederList(function (err, treeData) {
                if (err) {
                    console.log(err);
                    if (typeof err == 'string') {
                        msgBox(err);
                    } else {
                        msgBox('Do not Load Assigned Load List');
                    }
                    return;
                }
                /**
                 * 트리 구조는 디폴트로 model 프로퍼티를 등록한다.(테이블/트리 모델명)
                 * 트리 구조중 스위치인 것은 드래그 시 MODIFY_FEEDER 로 넘어간다.(피더 수정.)
                 * 트리 구조중 로드인 것은 드래그 시 아무일도 하지 않는다.
                 */
                for (var i = 0; i < treeData.length; i++) {
                    treeData[i]['data']['model'] = model;
                    if (treeData[i]['data']['fe_swgr_load_div'] == 'S') {
                        treeData[i]['data']['shapeType'] = me.Constants.TYPE.MODIFY_FEEDER;
                        treeData[i]['data']['shapeLabel'] = treeData[i]['data']['swgr_name'];
                    }
                }
                treeOptions = {
                    plugins: ["themes", "json_data", "ui", "cookies", "types", "dnd", "contextmenu"],
                    'core': {
                        'data': treeData
                    },
                    'types': {
                        'load': {
                            'icon': 'glyphicon glyphicon-flash'
                        },
                        'swgr': {
                            'icon': 'glyphicon glyphicon-random'
                        },
                        'default': {
                            'icon': 'glyphicon glyphicon-random'
                        }
                    },
                    "contextmenu": {
                        "items": function ($node) {
                            var tree = panel.jstree(true);
                            return {
                                "UnAssign": {
                                    "separator_before": false,
                                    "separator_after": false,
                                    "label": "UnAssign",
                                    "action": function (obj) {
                                        //$node = tree.create_node($node);
                                        //Do something
                                        var infoMessage = "Do You Delete Select Node Item?";
                                        confirmBox(infoMessage, function (result) {
                                            if (result) {
                                                var targetSeq = $node.data.feeder_list_mgt_seq;
                                                var resultData = me.dataController.deleteFeeder(targetSeq);
                                                if(resultData == '0') {
                                                    //새로운 데이터를 받아서 트리를 다시 그린다.
                                                    var renderer = me.getRendererByMode(me.currentMode);
                                                    me.dataController.getUpdateTree(tree, renderer, me.Constants.MODE.FEEDER);
                                                    me.renderGrid(me.model.SwgrList.name);
                                                    me.renderGrid(me.model.UnAssignedLoadList.name);
                                                    me.renderGrid(me.model.FeederList.name);
                                                    me.renderGrid(me.model.HierarchyFeederList.name);
                                                    msgBox('삭제되었습니다.');
                                                    setTimeout(msgBoxClose, 1000);
                                                } else {
                                                    //에러시 status : 1, 에러메세지를 보낸다.
                                                    //do Something...
                                                }
                                            }
                                        });
                                    	
                                    }
                                }
                            };
                        }
                    }
                };
                renderTreeAction(treeOptions, treeData);
            });
        }
        if (model == me.model.HierarchyTreeList.name) {
            me.dataController.getHierarchyTreeList(function (err, treeData) {
                if (err) {
                    console.log(err);
                    if (typeof err == 'string') {
                        msgBox(err);
                    } else {
                        msgBox('Do not Load Hierarchy Tree List.');
                    }
                    return;
                }
                /**
                 * 트리 구조는 디폴트로 model 프로퍼티를 등록한다.(테이블/트리 모델명)
                 * 트리 구조중 빌딩인 것은 HIERARCHY_BLDG 로 넘긴다.
                 * 트리 구조중 플루어 인 것은 HIERARCHY_FLOOR 로 넘긴다.
                 */
                if(treeData !== undefined) {
                    for (var i = 0; i < treeData.length; i++) {
                        treeData[i]['data']['model'] = model;
                        if (treeData[i]['data']['lv'] == 1) {
                            treeData[i]['data']['shapeType'] = me.Constants.TYPE.HIERARCHY_BLDG;
                            treeData[i]['data']['shapeLabel'] = treeData[i]['data']['nm'];
                        }
                        if (treeData[i]['data']['lv'] == 2) {
                            treeData[i]['data']['shapeType'] = me.Constants.TYPE.HIERARCHY_FLOOR;
                            treeData[i]['data']['shapeLabel'] = treeData[i]['data']['nm'];
                        }
                    }
                }
                treeOptions = {
                    plugins: ["themes", "json_data", "ui", "cookies", "types", "dnd"],
                    'core': {
                        'data': treeData
                    },
                    'types': {
                        'floor': {
                            'icon': 'fa fa-align-justify'
                        },
                        'bldg': {
                            'icon': 'glyphicon glyphicon-subtitles'
                        },
                        'default': {
                            'icon': 'glyphicon glyphicon-subtitles'
                        }
                    }
                };
                renderTreeAction(treeOptions, treeData);
            });
        }
    },
    
    /**
     * editSWGRInfoCallBack function
     */
    editSWGRInfoCallBack: function (returnData) {
    	me.renderGrid(me.model.SwgrList.name);
    },

    /**
     * 우측 메뉴의 그리드 테이블을 생성한다.
     * @param model 테이블/트리 모델명
     */
    renderGrid: function (model) {
        var me = this;
        var panel = me.model[model].panel;
        var panelId = panel.attr('id');
        var updateLoadData;
        var greedOptions = {};
        var canvas = me.getRendererByModel(model);

        var renderGridAction = function (gridOptions, gridData) {
            if (!panel.data('table')) {
                panel.data('table', true);
                panel.DataTable(gridOptions);
                me.modifyDataTablesStyle(panelId);
            }
            
            if(panel[0].id == "unAssignedLoadGrid") {
            	updateLoadData = gridData;
            } else if(panel[0].id == "hierarchy-feederGrid") {
            	me.unUsedHierarchyFeederList  = gridData;
            }

            var gridPanelDiv = $('#' + panelId + '_wrapper');
            var nameClickEvent = function (element, itemData) {
                element.unbind('click');
                element.click(function (event) {
                    event.stopPropagation();
                    if(itemData.hasOwnProperty('popRouteDialog') && itemData.popRouteDialog == 'Y') {
                    	var renderer = me.getRendererByMode(me.currentMode);
                    	renderer.onRoutePathToDialog(itemData, 'find');
                    } else {
                    	console.log(itemData);
                    }
                });
            };

            var showClickEvent = function (element, itemData) {
                element.unbind('click');
                element.click(function (event) {
                    event.stopPropagation();
                	var renderer = me.getRendererByMode(me.currentMode);
                	renderer.onRoutePathToDialog(itemData, 'click');
                });
            };
            
            var refreshGrid = function(dataTable) {
            	
            	dataTable.clear().draw();
            	dataTable.rows.add(updateLoadData);
            	dataTable.columns.adjust().draw();
            };
            
            var canvasDropEvent = function (element, itemData) {
                if (canvas) {
                    element.draggable({
                        start: function () {

                        },
                        helper: 'clone',
                        appendTo: 'body',
                        stop: function (event) {
                        	 canvas.getContainer().trigger('drop.viewController', [event, itemData, panel]);
                        }
                    });
                }
            };

            // page event
            panel.unbind('draw.dt');
            panel.on('draw.dt', function () {
                var item = gridPanelDiv.find("[name=item]");
                item.each(function (index, aTag) {
                    var element = $(aTag);
                    var dataIndex = element.data('index');
                    var itemData = gridData[parseInt(dataIndex)];
                    nameClickEvent(element, itemData);
                    canvasDropEvent(element, itemData);
                });
                
                var showItem = gridPanelDiv.find("[name=show]");
                showItem.each(function (index, aTag) {
                    var element = $(aTag);
                    var dataIndex = element.data('index');
                    var itemData = gridData[parseInt(dataIndex)];
                    showClickEvent(element, itemData);
                });
                
                blockStop();
            });

            var dataTable = panel.dataTable().api();
            dataTable.clear();
            dataTable.rows.add(gridData);
            dataTable.draw();
        	$(".dataTables_paginate").find('a').css("font-size", "11px");
        	panel.on('draw.dt', function () {
        		$(".dataTables_paginate").find('a').css("font-size", "11px");
        	});
        };
        if (model == me.model.SwgrList.name) {
            me.dataController.getSwitchgearUnused(function (err, gridData) {
                if (err) {
                    console.log(err);
                    msgBox('Do not Load Assigned Switch Gear List.');
                } else {
                    /**
                     * 어사인 되지 않은 스위치 리스트중 SWGR_TYPE 이 TR(트랜스포머) 인 것은 프랜스포머로 넘어간다.
                     * 트랜스포머가 아닌것은 NEW_FEEDER 로 넘어간다.
                     */
                	if(gridData !== undefined) {
	                    for (var i = 0; i < gridData.length; i++) {
	                        if (gridData[i]['swgr_type'] == 'TR') {
	                            gridData[i]['shapeType'] = me.Constants.TYPE.TRANSFORMER;
	                        } else {
	                            gridData[i]['shapeType'] = me.Constants.TYPE.NEW_FEEDER;
	                        }
	                        gridData[i]['shapeLabel'] = gridData[i]['swgr_name'];
	                        gridData[i]['model'] = model;
	                        gridData[i]['label'] = '<a href="javascript:void(0)" name="item" data-index="' + i + '" style="margin-left: 5px;margin-right: 5px;">' + gridData[i]['swgr_name'] + '</a>';
	                    }
                	}
                    greedOptions = {
                        data: gridData,
                        columns: [
                            {
                                data: 'label',
                                title: 'SWGR',
                                defaultContent: ''
                            },
                            {
                                data: 'swgr_type',
                                title: 'Type',
                                defaultContent: ''
                            },
                            {
                                data: 'swgr_owner_nm',
                                title: 'Owner',
                                defaultContent: ''
                            }
                        ],
                        columnDefs: [
 									{
 										 className: 'dt-left', 
 										 targets: [0]
 									},
                                      {
                                     	 className: 'dt-center', 
                                     	 targets: [1,2]
                                      }
                         ],
                        pageLength: 50,
                        lengthChange: false,
                        info: false,
                        scrollY: 600,
                        scrollX: true,
                        scrollCollapse: true
                    };
                }
                
                me.initUnusedSwitchList = gridData;
                renderGridAction(greedOptions, gridData);
            });
        }
        
        if (model == me.model.FeederList.name) {
            me.dataController.getFeederList(function (err, gridData) {
                if (err) {
                    console.log(err);
                    msgBox('Do no Load Feeder List.');
                } else {
                    /**
                     * FeederList(어사인 피더) 는 MODIFY_FEEDER(기존 피더 수정) 로 전달한다.
                     */
                	if(gridData !== undefined) {
	                    for (var i = 0; i < gridData.length; i++) {
	                        gridData[i]['shapeType'] = me.Constants.TYPE.MODIFY_FEEDER;
	                        gridData[i]['shapeLabel'] = gridData[i]['swgr_name'];
	                        gridData[i]['model'] = model;
	                        gridData[i]['label'] = '<a href="javascript:void(0)" name="item" data-index="' + i + '" style="margin-left: 5px;margin-right: 5px;">' + gridData[i]['swgr_name'] + '</a>';
	                    }
                	}
                    greedOptions = {
                        data: gridData,
                        columns: [
                            {
                                data: 'label',
                                title: 'Equipment Description',
                                defaultContent: ''
                            },
                            {
                                data: 'swgr_type',
                                title: 'Type',
                                defaultContent: ''
                            },
                            {
                                data: 'swgr_total_kva',
                                title: 'Total Load(Kva)',
                                defaultContent: ''
                            }
                        ],
                        columnDefs: [
									{
										 className: 'dt-left', 
										 targets: [0]
									},
                                     {
                                    	 className: 'dt-center', 
                                    	 targets: [1,2]
                                     }
                        ],
                        pageLength: 50,
                        lengthChange: false,
                        info: false,
                        scrollY: 600,
                        scrollX: true,
                        scrollCollapse: true
                    };
                }
                renderGridAction(greedOptions, gridData);
            });
        }
        
        if (model == me.model.HierarchyFeederList.name) {
            me.dataController.getHierarchyFeederList(function (err, gridData) {
                if (err) {
                    console.log(err);
                    msgBox('Do not Load Hierarchy Feeder List.');
                } else {
                    /**
                     * HierarchyFeederList(하이어라키 에디터의 피더) 는 HIERARCHY_FEEDER 로 전달한다.
                     */
                	if(gridData !== undefined) {
	                    for (var i = 0; i < gridData.length; i++) {
	                        gridData[i]['shapeType'] = me.Constants.TYPE.HIERARCHY_FEEDER;
	                        gridData[i]['shapeLabel'] = gridData[i]['swgr_name'];
	                        gridData[i]['model'] = model;
	                        gridData[i]['label'] = '<a href="javascript:void(0)" name="item" data-index="' + i + '" style="margin-left: 5px;margin-right: 5px;">' + gridData[i]['swgr_name'] + '</a>';
	                    }
                	}
                    greedOptions = {
                        data: gridData,
                        columns: [
                            {
                                data: 'label',
                                title: 'Equipment Description',
                                defaultContent: ''
                            },
                            {
                                data: 'swgr_type_nm',
                                title: 'Type',
                                defaultContent: ''
                            },
                            {
                                data: 'swgr_total_kva',
                                title: 'Total LY(Kva)',
                                defaultContent: ''
                            }
                        ],
                        columnDefs: [
 									{
										 className: 'dt-left', 
										 targets: [0]
									},
                                    {
                                   	 className: 'dt-center', 
                                   	 targets: [1,2]
                                    }
                        ],
                        pageLength: 50,
                        lengthChange: false,
                        info: false,
                        scrollY: 600,
                        scrollX: true,
                        scrollCollapse: true
                    };
                }
                me.initUnusedHierarchyFeederList = gridData;
                renderGridAction(greedOptions, gridData);
            });
        }
        
        if (model == me.model.UnAssignedLoadList.name) {
            me.dataController.getLoadUnused(function (err, gridData) {
                if (err) {
                    console.log(err);
                    msgBox('Do not Load UnAssigned Load List.');
                } else {
                    /**
                     * UnAssignedLoadList 는 로드 타입별로 shapeType 을 지정해 넘긴다.
                     */
                	if(gridData !== undefined) {
	                    for (var i = 0; i < gridData.length; i++) {
	                        if (gridData[i]['lo_type'] == 'NM') {
	                            gridData[i]['shapeType'] = me.Constants.TYPE.NMLOAD;
	                        }
	                        if (gridData[i]['lo_type'] == 'SH') {
	                            gridData[i]['shapeType'] = me.Constants.TYPE.SHLOAD;
	                        }
	                        if (gridData[i]['lo_type'] == 'EH') {
	                            gridData[i]['shapeType'] = me.Constants.TYPE.EHLOAD;
	                        }
	                        if (gridData[i]['lo_type'] == 'EHS') {
	                            gridData[i]['shapeType'] = me.Constants.TYPE.EHSLOAD;
	                        }
	                        if (gridData[i]['lo_type'] == 'MI') {
	                            gridData[i]['shapeType'] = me.Constants.TYPE.MILOAD;
	                        }
	                        if (gridData[i]['lo_type'] == 'MK') {
	                            gridData[i]['shapeType'] = me.Constants.TYPE.MKLOAD;
	                        }
	                        if (gridData[i]['lo_type'] == 'MO') {
	                            gridData[i]['shapeType'] = me.Constants.TYPE.MOLOAD;
	                        }
	                        if (gridData[i]['lo_type'] == 'PKG') {
	                            gridData[i]['shapeType'] = me.Constants.TYPE.PKGLOAD;
	                        }
	                        gridData[i]['shapeLabel'] = gridData[i]['lo_equip_tag_no'];
	                        gridData[i]['model'] = model;
	                        gridData[i]['label'] = '<a href="javascript:void(0);" name="item" data-index="' + i + '" style="margin-left: 5px;margin-right: 5px;">' + gridData[i]['lo_equip_tag_no'] + '</a>';
	                        gridData[i]['lo_equip_desc_style'] = '<span style="margin-left: 5px;margin-right: 5px;">' + gridData[i]['lo_equip_desc'] + '</span>';
	                        gridData[i]['lo_unit_style'] = '<span style="margin-left: 5px;margin-right: 5px;">' + gridData[i]['lo_unit'] + '</span>';
	                        gridData[i]['lo_proc_sys_style'] = '<span style="margin-left: 5px;margin-right: 5px;">' + gridData[i]['lo_proc_sys'] + '</span>';
	                        gridData[i]['lo_equip_loc_style'] = '<span style="margin-left: 5px;margin-right: 5px;">' + gridData[i]['lo_equip_loc'] + '</span>';
	                    }
                	}
                    greedOptions = {
                        data: gridData,
                        columns: [
                            {
                                data: 'label',
                                title: 'Equipment Tag No.',
                                defaultContent: ''
                            },
                            
                            {
                                data: 'lo_equip_desc_style',
                                title: 'Equipment Description',
                                defaultContent: ''
                            },
                            {
                                data: 'lo_type',
                                title: 'Type',
                                defaultContent: ''
                            },
                            {
                                data: 'lo_pow_sou',
                                title: 'Power Source',
                                defaultContent: ''
                            },
                            {
                                data: 'lo_equip_vol',
                                title: 'Equipment Voltage',
                                defaultContent: ''
                            },
                            {
                                data: 'lo_rated_pow',
                                title: 'Rated Power',
                                defaultContent: ''
                            },
                            {
                                data: 'lo_unit_style',
                                title: 'Unit',
                                defaultContent: ''
                            },
                            {
                                data: 'lo_proc_sys_style',
                                title: 'Process/System',
                                defaultContent: ''
                            },
                            {
                                data: 'lo_equip_loc_style',
                                title: 'Equipment Location',
                                defaultContent: ''
                            },
                            {
                                data: 'lo_duty',
                                title: 'Duty',
                                defaultContent: ''
                            }
                        ],
                        columnDefs: [
  									{
 										 className: 'dt-left', 
 										 targets: [0, 1, 7, 8]
 									},
 									
                                    {
                                   	 className: 'dt-right', 
                                   	 targets: [4, 5]
                                    },
                                     {
                                    	 className: 'dt-center', 
                                    	 targets: '_all'
                                     }
                         ],
                        pageLength: 50,
                        lengthChange: false,
                        info: false,
                        scrollY: 600,
                        scrollX: true,
                        scrollCollapse: true,
                        fixedColumns:true
                    };
                }
                me.initUnusedLoadList = gridData;
                renderGridAction(greedOptions, gridData);
            });
        }
        if (model == me.model.LocationReferenceList.name) {
            me.dataController.getLocationReferenceList(function (err, gridData) {
                if (err) {
                    console.log(err);
                    msgBox('Do not Load Location Reference List.');
                } else {
                	if(gridData !== undefined) {
	                    for (var i = 0; i < gridData.length; i++) {
	                        gridData[i]['model'] = model;
	                        gridData[i]['label'] = '<a href="javascript:void(0);" name="item" data-index="' + i + '" style="margin-left: 5px;margin-right: 5px;">' + gridData[i]['loc_ref_name'] + '</a>';
	                    }
                	}
                    greedOptions = {
                        data: gridData,
                        columns: [
                            {
                                data: 'label',
                                title: 'Location',
                                defaultContent: ''
                            },
                            {
                                data: 'loc_ref_name_to',
                                title: 'Point',
                                defaultContent: ''
                            },
                            {
                                data: 'loc_ref_temp',
                                title: 'Temp',
                                defaultContent: ''
                            },
                            {
                                data: 'loc_ref_length',
                                title: 'Length',
                                defaultContent: ''
                            }
                        ],
                        columnDefs: [
									{
										 className: 'dt-left', 
										 targets: [0]
									},
                                     {
                                    	 className: 'dt-center', 
                                    	 targets: '_all'
                                     }
                        ],
                        pageLength: 50,
                        lengthChange: false,
                        info: false,
                        scrollY: 600,
                        scrollX: true,
                        scrollCollapse: true
                    };
                }
                me.initLocationReferenceList = gridData;
                renderGridAction(greedOptions, gridData);
            });
        }
        if (model == me.model.RacewayReferenceList.name) {
            me.dataController.getRacewayReferenceList(function (err, gridData) {
                if (err) {
                    console.log(err);
                    msgBox('Do not Load Raceway Reference List.');
                } else {
                	if(gridData !== undefined) {
	                    for (var i = 0; i < gridData.length; i++) {
	                        gridData[i]['model'] = model;
	                        gridData[i]['label'] = '<a href="javascript:void(0);" name="item" data-index="' + i + '" style="margin-left: 5px;margin-right: 5px;">' + gridData[i]['race_ref_trayedm_no'] + '</a>';
	                    }
                	}
                    greedOptions = {
                        data: gridData,
                        columns: [
                            {
                                data: 'label',
                                title: 'Raceway Number',
                                defaultContent: ''
                            },
                            {
                                data: 'race_ref_from',
                                title: 'From',
                                defaultContent: ''
                            },
                            {
                                data: 'race_ref_to',
                                title: 'To',
                                defaultContent: ''
                            },
                            {
                                data: 'race_ref_len',
                                title: 'Length',
                                defaultContent: ''
                            }
                        ],
                        columnDefs: [
									{
										 className: 'dt-left', 
										 targets: [0]
									},
									{
										 className: 'dt-right', 
										 targets: [3]
									},
                                     {
                                    	 className: 'dt-center', 
                                    	 targets: '_all'
                                     }
                        ],
                        pageLength: 50,
                        lengthChange: false,
                        info: false,
                        scrollY: 600,
                        scrollX: true,
                        scrollCollapse: true
                    };
                }
                me.initRacewayReferenceList = gridData;
                renderGridAction(greedOptions, gridData);
            });
        }
        if (model == me.model.RouteReferenceList.name) {
            me.dataController.getRouteReferenceList(function (err, gridData) {
                if (err) {
                    console.log(err);
                    msgBox('Do not Load Route Reference List.');
                } else {
                	if(gridData !== undefined) {
	                    for (var i = 0; i < gridData.length; i++) {
	                        gridData[i]['model'] = model;
	                        gridData[i]['fromLabel'] = '<a href="javascript:void(0);" name="item" data-index="' + i + '" style="margin-left: 5px;margin-right: 5px;">' + gridData[i]['rou_ref_from'] + '</a>';
	                        gridData[i]['toLabel'] = '<a href="javascript:void(0);" name="item" data-index="' + i + '" style="margin-left: 5px;margin-right: 5px;">' + gridData[i]['rou_ref_to'] + '</a>';
	                    }
                	}
                    greedOptions = {
                        data: gridData,
                        columns: [
                            {
                                data: 'fromLabel',
                                title: 'From',
                                defaultContent: ''
                            },
                            {
                                data: 'toLabel',
                                title: 'To',
                                defaultContent: ''
                            },
                            {
                                data: 'rou_ref_tot_len',
                                title: 'Length',
                                defaultContent: ''
                            }
                        ],
                        columnDefs: [
 									 {
										 className: 'dt-left', 
										 targets: [0, 1]
									 },
                                     {
                                    	 className: 'dt-right', 
                                    	 targets: '_all'
                                     }
                        ],
                        pageLength: 50,
                        lengthChange: false,
                        info: false,
                        scrollY: 600,
                        scrollX: true,
                        scrollCollapse: true
                    };
                }
                me.initRouteReferenceList = gridData;
                renderGridAction(greedOptions, gridData);
            });
        }
        if (model == me.model.BldgReferenceList.name) {
            me.dataController.getBldgReferenceList(function (err, gridData) {
                if (err) {
                    console.log(err);
                    msgBox('Do not Load Building Reference List.');
                } else {
                    /**
                     * BldgReferenceList(라우트 에디터) 는 BLDG 로 넘긴다.
                     */
                	if(gridData !== undefined) {
	                    for (var i = 0; i < gridData.length; i++) {
	                        gridData[i]['shapeType'] = me.Constants.TYPE.BLDG;
	                        gridData[i]['shapeLabel'] = gridData[i]['loc_ref_name'];
	                        gridData[i]['model'] = model;
	                        gridData[i]['label'] = '<a href="javascript:void(0);" name="item" data-index="' + i + '" style="margin-left: 5px;margin-right: 5px;">' + gridData[i]['loc_ref_name'] + '</a>';
	                        //gridData[i]['dscr_style'] = '<span style="margin-left: 5px;margin-right: 5px;">' + gridData[i]['dscr'] + '</span>';
	                        gridData[i]['dscr_style'] = '<span style="margin-left: 5px;margin-right: 5px;"></span>';
	                    }
                	}
                    greedOptions = {
                        data: gridData,
                        columns: [
                            {
                                data: 'label',
                                title: 'Name',
                                defaultContent: ''
                            },
                            {
                                data: 'dscr_style',
                                title: 'Description',
                                defaultContent: ''
                            }
                        ],
                        columnDefs: [
									{
										 className: 'dt-left', 
										 targets: '_all'
									}
                        ],
                        bAutoWidth: true,
                        pageLength: 50,
                        lengthChange: false,
                        info: false,
                        scrollY: 600,
                        scrollX: true,
                        scrollCollapse: true
                    };
                }
                me.initBldgReferenceList = gridData;
                renderGridAction(greedOptions, gridData);
            });
        }
        if (model == me.model.CableReferenceList.name) {
            me.dataController.getCableReferenceList(function (err, gridData) {
                if (err) {
                    console.log(err);
                    msgBox('Do not Load Cable Reference List.');
                } else {
                    /**
                     * CableReferenceList(라우트 에디터) 는 BLDG 로 넘긴다.
                     */
                	if(gridData !== undefined) {
	                    for (var i = 0; i < gridData.length; i++) {
	                        gridData[i]['shapeType'] = me.Constants.TYPE.BLDG;
	                        gridData[i]['shapeLabel'] = gridData[i]['rou_ref_tot_path'];
	                        gridData[i]['model'] = model;
	                        gridData[i]['rou_ref_from_style'] = '<span style="margin-left: 5px;margin-right: 5px;">'+ gridData[i]['rou_ref_from'] +'</span>';
	                        gridData[i]['rou_ref_to_style'] = '<span style="margin-left: 5px;margin-right: 5px;">'+ gridData[i]['rou_ref_to'] +'</span>';
	                        gridData[i]['equip_nm_to_style'] = '<span style="margin-left: 5px;margin-right: 5px;">'+ gridData[i]['equip_nm_to'] +'</span>';
							gridData[i]['find'] = '<a href="javascript:void(0);" name="item" data-index="' + i + '" style="margin-left:5px"><img width="16" height="16" src="resources/images/new_link.png"/></a>';
	                        gridData[i]['popRouteDialog'] = 'Y';
	                        gridData[i]['label'] = '<a href="javascript:void(0);" name="show" data-index="' + i + '" style="margin-left:5px">' + (gridData[i]['rou_ref_tot_path']==null?'':gridData[i]['rou_ref_tot_path']) + '</a>';
	                    }
                	}
                    greedOptions = {
                        data: gridData,
                        columns: [
                            {
                                data: 'rou_ref_from_style',
                                title: 'SWGR_Location',
                                defaultContent: ''
                            },
                            {
                                data: 'equip_nm_from',
                                title: 'SWGR_Group',
                                defaultContent: ''
                            },
                            {
                                data: 'rou_ref_to_style',
                                title: 'Load_Location',
                                defaultContent: ''
                            },
                            {
                                data: 'equip_nm_to_style',
                                title: 'KKS_NUMBER',
                                defaultContent: ''
                            },
                            {
	                            data: 'label',
	                            title: 'Path',
	                            defaultContent: ''
	                        },
                            {
                                data: 'rou_ref_tot_len',
                                title: 'Length',
                                defaultContent: ''
                            },
                            {
                                data: 'find',
                                title: 'find',
                                defaultContent: ''
                            }
                        ],
                        columnDefs: [
                                     {
										 className: 'dt-left', 
										 targets: [0, 2, 3, 4]
									 },
									 {
										 className: 'dt-right', 
										 targets: [5]
									 },
                                     {
                                    	 className: 'dt-center', 
                                    	 targets: '_all'
                                     }
                        ],
                        pageLength: 50,
                        lengthChange: false,
                        info: false,
                        scrollY: 600,
                        scrollX: true,
                        scrollCollapse: true
                    };
                }
                me.initCableReferenceList = gridData;
                renderGridAction(greedOptions, gridData);
            });
        }
    },

    /**
     * 저장 이후 그리드 및 트리를 새로 그린다.
     * 피더에서 이벤트 발생시에는 피더 에디터의 그리드 및 트리를 리프레쉬한다.
     * 추가적으로 피더일때는 하이어라키의 피더리스트도 갱신해야한다.
     *
     */
    refreshGridAndTree: function (mode, renderer) {
    	var me = this;
    	/**
    	 * 피더에서 넘어왔다면
    	 */
    	if(mode == me.Constants.MODE.FEEDER) {
    		me.renderSwgrSelectBox();
            me.renderGrid(me.model.SwgrList.name);
            me.renderGrid(me.model.UnAssignedLoadList.name);
            //update
            var tree = me.model.AssignedFeederList.panel.jstree(true).destroy();
            me.renderTree(me.model.AssignedFeederList.name);
            
            me.renderGrid(me.model.FeederList.name);
            me.renderGrid(me.model.HierarchyFeederList.name);
            /**
             * 기존의 변수들의 값들을 초기화 하고 setEditingObjectFromLoadData을 태워서
             * 바뀐 정보들로 채워넣어야 한다.
             */
            me.setEditingObjectFromSave(renderer);
    	} else if(mode == me.Constants.MODE.HIERARCHY) {
    		
    		me.renderGrid(me.model.HierarchyFeederList.name);
    		//update
            var tree = me.model.HierarchyTreeList.panel.jstree(true).destroy();
            me.renderTree(me.model.HierarchyTreeList.name);
            
            me.saveSettingHierarchyMode(renderer);
            
    	} else if(mode == me.Constants.MODE.ROUTE) {
    		
    		me.renderGrid(me.model.BldgReferenceList.name);
            //me.renderGrid(me.model.LocationReferenceList.name);
            me.renderGrid(me.model.RacewayReferenceList.name);
            me.renderGrid(me.model.RouteReferenceList.name);
            me.renderGrid(me.model.CableReferenceList.name);
    		me.saveSettingRouteMode(renderer);
    	}
    },

    /**
     * 하이어라키 에디터에서 저장이후 모드값들 후처리
     */
    saveSettingRouteMode: function(renderer) {
        var me = this;
        var currentCanvas = renderer.getCanvas();
        me.projectData.gui_route_json = currentCanvas.toJSON();
        me.setRouteSaveMode(true);

    },

    /**
     * 하이어라키 에디터에서 저장이후 모드값들 후처리
     */
    saveSettingHierarchyMode: function(renderer) {
    	var me = this;
    	var currentCanvas = renderer.getCanvas();
    	me.projectData.gui_hier_json = currentCanvas.toJSON();
    	me.setHierarchySaveMode(true);
    	
    	var shapeList = currentCanvas.getAllShapes();
    	me.feederHierarchyMgtShapeList = [];
    	shapeList.forEach(function(element){
        	if(element.shape instanceof OG.HierarchyFloor) {
        		
        		var childShape = currentCanvas.getChilds(element);
        		childShape.forEach(function(child){
        			
        			if(child.shape.data.hasOwnProperty('label')) {
        				delete child.shape.data['label'];
        			}
        			
        			var jsonData = {};

        			jsonData['feeder_list_mgt_seq'] = child.shape.data.feeder_list_mgt_seq;
        			jsonData['hier_seq'] = element.shape.data.hier_seq; 
        			jsonData['up_hier_seq'] = element.shape.data.up_hier_seq;

                    /**
                     * prevEdges가 있다는 것은 상위 피더가 있다는 것.
                     * 없다면 자신이 상위이기 때문에
                     */
        			var prevEdges = currentCanvas.getPrevEdges(child);
        			var nextEdges = currentCanvas.getNextEdges(child);
        			if(prevEdges.length > 0) {
        				prevEdges.forEach(function(edge){
        					var edge = currentCanvas.getRelatedElementsFromEdge(edge);
        					var fromShapeData = edge.from.shape.data;
        					// ?옄湲? ?옄?떊?씠硫? ?옄?떊?씠 ?긽?쐞?씠湲? ?븣臾몄뿉 pass
        					if(fromShapeData.feeder_list_mgt_seq != child.shape.data.feeder_list_mgt_seq) {
        						jsonData['up_feeder_list_mgt_seq'] = fromShapeData.feeder_list_mgt_seq;
        					}
        				});
        			}
        			
        			jsonData['status'] = 'U';
        			me.feederHierarchyMgtShapeList.push(jsonData);
        			
        		});
        	}
        });
    	
    	me.usedHierarchyFeederList = [];
    	me.updateFeederHierarchyList = [];
    	me.deleteFeederHierarchyList = [];
    }
}
;
ViewContorller.prototype.constructor = ViewContorller;

$(function () {
    var viewContorller = new ViewContorller();
    viewContorller.init();
});