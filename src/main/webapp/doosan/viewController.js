/**
 * Created by Seungpil Park on 2016. 9. 6..
 */
var ViewContorller = function () {
    /**
     * ��Ʈ�ѷ��� �޽��� �϶�
     */
    this.message = {
        NO_EDITOR_OBJECT: 'NO_EDITOR_OBJECT',
        NEW: 'NEW',
        MOD: 'MOD'
    };

    /**
     * ĵ���� �������� Constants �� _CONFIG ���뵵(���ӽ����̽� �̿�)
     */
    this.Constants = new Renderer().Constants;
    this.Config = new Renderer()._CONFIG;

    /**
     * ���� ��Ʈ�ѷ��� ���
     */
    this.currentMode = this.Constants.MODE.FEEDER;

    /**
     * ����� �Ǵ� ������ ĵ����
     * @type {null}
     */
    this.feederRenderer = null;
    this.feederRendererId = 'feederCanvas';

    /**
     * ���Ʈ ������ ĵ����
     * @type {null}
     */
    this.routeRenderer = null;
    this.routeRendererId = 'routeCanvas';

    /**
     * ���̾��Ű ������ ĵ����
     * @type {null}
     */
    this.hierarchyRenderer = null;
    this.hierarchyRendererId = 'hierarchyCanvas';

    /**
     * �׿������� ������ ����� ����ϴ� ��Ʈ�ѷ�
     * @type {DataController}
     */
    this.dataController = new DataController();

    /**
     * ������Ʈ ������
     */
    this.projectData = undefined;

    /**
     * switch ����Ʈ reload�� ���� ������
     */
    this.initUnusedSwitchList = [];
    this.usedSwitchList = [];

    /**
     * load ����Ʈ reload�� ���� ������
     */
    this.initUnusedLoadList = [];
    this.usedLoadList = [];

    /**
     * ���� �Ǵ����� ����ͼ� json�����ͷ� ĵ������ ������ ���.
     * json�����ͷ� �׷��� ĵ������ �������� data�� ����Ʈ�� ���´�.
     * updateFeederList, deleteFeederList
     */
    this.feederMgtShapeList = [];
    this.updateFeederList = [];
    this.deleteFeederList = [];
    this.tempElement = null;
    this.parentSwitchElement = null;


    /**
     * hierarchyCanvas�� ó�� �׷����� ����, �÷ο�, �Ǵ��� ������ ��Ƴ���.
     * ���������� ������ ���ؼ� ����� ����ġ�� ������ �����Ѵٸ�
     * �Ǵ� ��쿡�� hierarchy �Ǵ� ����Ʈ�� ������ ��쿡�� ���� �����ߴ� �Ǵ��� ĵ�������� �ش� �Ǵ��� �������Ѵ�.
     * �߰��� �Ǵ��� ����ڰ� �׸��״� �װ� �н�,
     * ���� �߰��ÿ��� ���� �׷��� ĵ�������� ��ġ�� �ʰ� ������ ��ġ�� �ش� ������ �÷ξ �׸���.
     * �Ǵ�����Ʈ �׸��带 �����ϱ� ���� ��ü �߰�
     */
    this.feederHierarchyMgtShapeList = [];
    this.updateFeederHierarchyList = [];
    this.deleteFeederHierarchyList = [];
    this.initHierarchyClickTab = false;
    this.initUnusedHierarchyFeederList = [];
    this.usedHierarchyFeederList = [];
    this.initHierarchyBldgs = [];
    this.initHierarchyFloors = [];
    this.initHierarchyFeeders = [];

    /**
     * �����̼� �ʱ� �ε� ������
     */
    this.initLocationReferenceList = [];

    /**
     * ���� �ʱ� �ε� ������
     */
    this.initBldgReferenceList = [];
    this.usedBldgReferenceList = [];

    /**
     * ���̽����� �ʱ� �ε� ������
     */
    this.initRacewayReferenceList = [];

    /**
     * ���Ʈ �ʱ� �ε� ������
     */
    this.initRouteReferenceList = [];

    this.removeFirstShapeTypeAtHierarchy = null;
    this.removeFirstShapeTypeAtRoute = null;

    /**
     * gui from menu;
     */

    this.FROMMENU = 'feeder';

    /**
     * ���̺�/Ʈ�� ������. ĵ������ �� shape �𵨰��� �ٸ� �ǹ��̴�.
     */
    this.model = {
        /**
         * ����ε� �ε帮��Ʈ (feederRenderer)
         */
        AssignedFeederList: {
            name: 'AssignedFeederList',
            panel: $('#AssignedFeederTree')
        },

        /**
         * ����ġ��� ����Ʈ (feederRenderer)
         */
        SwgrList: {
            name: 'SwgrList',
            panel: $('#swgrGrid')
        },

        /**
         * �Ǵ� ����Ʈ (feederRenderer)
         */
        FeederList: {
            name: 'FeederList',
            panel: $('#feederGrid')
        },

        /**
         * ����� ���� ���� �ε帮��Ʈ (feederRenderer)
         */
        UnAssignedLoadList: {
            name: 'UnAssignedLoadList',
            panel: $('#unAssignedLoadGrid')
        },

        /**
         * ���̾��Ű Ʈ�� (hierarchyRenderer)
         */
        HierarchyTreeList: {
            name: 'HierarchyTreeList',
            panel: $('#hierarchyTree')
        },

        /**
         * �Ǵ� ����Ʈ (hierarchyRenderer)
         */
        HierarchyFeederList: {
            name: 'HierarchyFeederList',
            panel: $('#hierarchy-feederGrid')
        },

        /**
         * �����̼� ���۷��� (routeRenderer)
         */
        LocationReferenceList: {
            name: 'LocationReferenceList',
            panel: $('#locationRefGrid')
        },

        /**
         * ���̽����� ���۷��� (routeRenderer)
         */
        RacewayReferenceList: {
            name: 'RacewayReferenceList',
            panel: $('#racewayRefGrid')
        },

        /**
         * ���Ʈ ���۷��� (routeRenderer)
         */
        RouteReferenceList: {
            name: 'RouteReferenceList',
            panel: $('#routeRefGrid')
        },

        /**
         * ���� ���۷��� (routeRenderer)
         */
        BldgReferenceList: {
            name: 'BldgReferenceList',
            panel: $('#bldgRefGrid')
        },

        /**
         * ���̺� ���۷��� (routeRenderer)
         */
        CableReferenceList: {
            name: 'CableReferenceList',
            panel: $('#cableRefGrid')
        }
    };
};
ViewContorller.prototype = {

    /**
     * gui�� ��� ������ �޴�
     */
    guiLoadingFromMenu:function() {
        var me = this;
        var fromMenu = 'feeder';
        me.FROMMENU = fromMenu;
    },

    /**
     * ������ ����ٿ� �޴��� Ȱ��ȭ�ϰ�, �̺�Ʈ�� ����Ѵ�.
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

        //������ ��ƿ��Ƽ
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

        //������̼� �޴�
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

        //�鵵�� �޴�
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
                    renderer.getCanvas().addBackDoor(e.target.result, backDoorSize.val(), backDoorOpacity.val());
                };
                reader.readAsDataURL(target.files[0]);
            }
        });

        backDoorSize.bind('change', function (event) {
            var renderer = me.getRendererByMode(me.currentMode);
            renderer.getCanvas().updateBackDoor($(this).val(), null);
            $('#backdoor-size-range-text').html('Size : ' + $(this).val() + '%');
        });

        backDoorOpacity.bind('change', function (event) {
            var renderer = me.getRendererByMode(me.currentMode);
            renderer.getCanvas().updateBackDoor(null, $(this).val());
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
        // �ش� ��ư�� Ŭ���ϸ� swgr�� �Է¹��� �� �ִ� ���� ui�� ����.
        // �ּҴ� �����޴°�
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

    redrawUnssignedLoadTables: function(panel) {
        var me = this;
        var gridData;
        $.ajax({
            url: 'doosan/data/load-list.json',
            dataType: 'json',
            success: function (data) {
                 gridData = data;
            },
            error: function (err) {
                console.log(err);
            }
        });

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
            gridData[i]['model'] = me.model.UnAssignedLoadList.name;
            gridData[i]['label'] = '<a href="javascript:void(0);" name="item" data-index="' + i + '" style="margin-left: 5px;margin-right: 5px;">' + gridData[i]['lo_equip_tag_no'] + '</a>';
            gridData[i]['lo_equip_desc_style'] = '<span style="margin-left: 5px;margin-right: 5px;">' + (gridData[i]['lo_equip_desc']==null?'':gridData[i]['lo_equip_desc']) + '</span>';
            gridData[i]['lo_unit_style'] = '<span style="margin-left: 5px;margin-right: 5px;">' + (gridData[i]['lo_unit']==null?'':gridData[i]['lo_unit']) + '</span>';
            gridData[i]['lo_proc_sys_style'] = '<span style="margin-left: 5px;margin-right: 5px;">' + (gridData[i]['lo_proc_sys']==null?'':gridData[i]['lo_proc_sys']) + '</span>';
            gridData[i]['lo_equip_loc_style'] = '<span style="margin-left: 5px;margin-right: 5px;">' + (gridData[i]['lo_equip_loc']==null?'':gridData[i]['lo_equip_loc']) + '</span>';
            gridData[i]['lo_pow_sou'] = gridData[i]['lo_pow_sou']==null?'':gridData[i]['lo_pow_sou'];
            gridData[i]['lo_equip_vol'] = gridData[i]['lo_equip_vol']==null?'':gridData[i]['lo_equip_vol'];
            gridData[i]['lo_rated_pow'] = gridData[i]['lo_rated_pow']==null?'':gridData[i]['lo_rated_pow'];
            gridData[i]['lo_type'] = gridData[i]['lo_type']==null?'':gridData[i]['lo_type'];
            gridData[i]['lo_duty'] = gridData[i]['lo_duty']==null?'':gridData[i]['lo_duty'];
        }

        var dataTable = panel.dataTable().api();
        var currentPage = dataTable.page();
        dataTable.clear();
        dataTable.rows.add(gridData);
        dataTable.draw();
        dataTable.page(currentPage).draw(false);

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

    feederTabClickEvent: function(me) {
        $.blockUI({ css: {
            border: 'none',
            padding: '15px',
            backgroundColor: '#000',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: .5,
            color: '#fff'
        } });

        setTimeout(me.settingFeederEditorMenu, 100, me);
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
         * Ŭ���Ҷ����� ������Ʈ ������ �����´�.
         * ������ ������ ������ �� ��쵵 �ֱ� �����̴�.
         * ���ʿ��� ĵ������ Ŭ����
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
         * Ŭ���Ҷ����� ������Ʈ ������ �����´�.
         * ������ ������ ������ �� ��쵵 �ֱ� �����̴�.
         * ���ʿ��� ĵ������ Ŭ����
         */
        var projectInfo = me.projectData;
        var hierJSON  = projectInfo.gui_hier_json;

        if((hierJSON !=null && hierJSON != '' ) && typeof hierJSON == 'string'){
            hierJSON = JSON.parse(hierJSON);
        }


        var renderer = me.getRendererByMode(me.Constants.MODE.HIERARCHY);
        if(hierJSON == null || hierJSON == '') {
            if(me.initHierarchyClickTab) {
                renderer.compareAndRemove(true);
                $.unblockUI();
                return;
            }
            setTimeout(me.drawToCanvasFromServerDataWrapper, 100, renderer, me, me.Constants.MODE.HIERARCHY);
        } else {
            //�ִٸ�....
            if(me.initHierarchyClickTab) {
                renderer.compareAndRemove(true);
                $.unblockUI();
                return;
            }
            setTimeout(renderer.loadWrapper, 100, renderer, null, 'json', hierJSON);
        }
        //me.refreshGridAndTree(me.Constants.MODE.HIERARCHY, renderer);
    },

    /**
     * ������Ʈ�� hierarchy�� ���̽� ������ ���ٸ�
     */
    drawToCanvasFromServerDataWrapper: function(renderer, viewController, mode) {
        if(mode == viewController.Constants.MODE.HIERARCHY) {
            renderer.drawToHierarchyCanvasFromServerData(mode);
            viewController.initHierarchyClickTab = true;
        } else if(mode == viewController.Constants.MODE.ROUTE) {
            renderer.drawToRouteCanvasFromServerData(mode);
        }
    },

    init: function () {
        var me = this;
        $(window).resize(function () {
            me.resizeContent();
        });

        me.guiLoadingFromMenu();

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
        });

        /**
         * delayTab Ŭ������ ���� Dom �� ������ ���� ����, active �� �ƴѰ͵��̴�.
         * active �� �ƴ� ���� �������� css width,height �� ���� �� ���ý� �����ǹǷ�, ���� Ŭ���� ���� ĵ���� ����� ���߾ �׷��ֵ��� �Ѵ�.
         */
        $('.delayTab').click(function () {
            var mode = $(this).data('canvas');
            if (!$(this).data('isTabClicked')) {
                $(this).data('isTabClicked', true);
                setTimeout(function () {
                    if (mode == me.Constants.MODE.FEEDER) {
                        me.feederRenderer.setCanvasSize(
                            [$('#' + me.feederRendererId).width(), $('#' + me.feederRendererId).height()]);
                        if(me.FROMMENU != 'feeder') {
                            me.feederTabClickEvent(me);
                        }
                        $('#editor-backdoor').hide();
                    }
                    if (mode == me.Constants.MODE.HIERARCHY) {
                        me.hierarchyRenderer.setCanvasSize(
                            [$('#' + me.hierarchyRendererId).width(), $('#' + me.hierarchyRendererId).height()]);
                        me.settingHierarchyEditorMenu(me);
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
         * ȭ�� ������¡ �� ĵ������ �������Ѵ�.
         */
        me.resizeContent();
        me.feederRenderer = new Renderer(me.Constants.MODE.FEEDER, me.feederRendererId, this);
        me.hierarchyRenderer = new Renderer(me.Constants.MODE.HIERARCHY, me.hierarchyRendererId, this);
        me.routeRenderer = new Renderer(me.Constants.MODE.ROUTE, me.routeRendererId, this);

        me.resizeContent();
        /**
         * feederCanvas �� ó���� �����̴��� active ��Ų��.
         */
        me.activeCanvasSlider('feeder');

        /**
         * Ʈ�� ����� �巡�� ��� �̺�Ʈ�� Document �� �����Ѵ�.
         */
        me.bindTreeDragDrop();

        /**
         * ������Ʈ ������
         */
        me.renderProjectReference();
        me.initLoadingMenu();
    },

    initLoadingMenu: function() {
        var me = this;
        var fromMenu = me.FROMMENU;
        $('.delayTab').removeClass('active');

        if(fromMenu == 'feeder') {
            $('.feederTab').addClass('active');
            /**
             * SWGR / Assigned Feeder Editor �׸���
             */
                //me.renderSwgrSelectBox();
            me.renderGrid(me.model.FeederList.name);
            me.renderGrid(me.model.UnAssignedLoadList.name);

            Pace.on("done", function(){
                setTimeout(me.settingOtherMenuLoad, 500, me, fromMenu);
            });
        } else if(fromMenu == 'hierarchy') {
            $('.hierarchyTab').addClass('active');
            me.settingOtherMenuLoad(me, fromMenu);
        } else if(fromMenu == 'route') {
            $('.routeTab').addClass('active');
            me.settingOtherMenuLoad(me, fromMenu);
        }
    },

    settingOtherMenuLoad: function(viewController, fromMenu) {
        if(fromMenu == 'feeder') {
            viewController.renderGrid(viewController.model.SwgrList.name);
            viewController.renderTree(viewController.model.AssignedFeederList.name);
            $('#editor-backdoor').hide();
        } else if(fromMenu == 'hierarchy') {
            $('.hierarchyTab').click();
        } else if(fromMenu == 'route') {
            $('.routeTab').click();
        }
        viewController.bindLocationDragDrop();
        viewController.bindMenuEvent();
    },

    /**
     * Feeder Editor Grid And Tree Setting
     */
    settingFeederEditorMenu: function(viewController) {
        viewController.renderGrid(viewController.model.FeederList.name);
        viewController.renderGrid(viewController.model.UnAssignedLoadList.name);
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

    saveWrapper: function(me) {
        me.dataController.saveGui(me);
    },

    /**
     * ���� ��带 �ҷ��´�.
     */
    getCurrentMode: function(){
        return this.currentMode;
    },

    /**
     * �Ǵ� ���̺� ��带 �ҷ��´�
     */
    getFeederSaveMode: function() {
        return this.Constants.FEEDER_SAVE_MODE.ISNEW;
    },

    /**
     * �Ǵ� ���̺� ��带 �����Ѵ�.
     */
    setFeederSaveMode: function(saveMode) {
        this.Constants.FEEDER_SAVE_MODE.ISNEW = saveMode;
    },

    /**
     * ���̾��Ű ���̺� ��带 �ҷ��´�
     */
    getHierarchySaveMode: function() {
        return this.Constants.HIERARCHY_SAVE_MODE.ISNEW;
    },

    /**
     * ���̾��Ű ��带 �����Ѵ�.
     */
    setHierarchySaveMode: function(saveMode) {
        this.Constants.HIERARCHY_SAVE_MODE.ISNEW = saveMode;
    },

    /**
     * ���Ʈ ���̺� ��带 �ҷ��´�
     */
    getRouteSaveMode: function() {
        return this.Constants.ROUTE_SAVE_MODE.ISNEW;
    },

    /**
     * ���Ʈ ��带 �����Ѵ�.
     */
    setRouteSaveMode: function(saveMode) {
        this.Constants.ROUTE_SAVE_MODE.ISNEW = saveMode;
    },

    /**
     * ��忡 �ش��ϴ� ĵ���� �������� �����Ѵ�.
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
     * ���̺�/Ʈ�� �𵨸����� ǥ���Ǿ��� ĵ���� �������� �����Ѵ�.
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
     * ���̺�/Ʈ�� �𵨸����� ǥ���Ǿ��� ĵ������ ��带 �����Ѵ�.
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
     * �������� ���̿� ���߾ �������� ����ϴ� Dom �� ���̸� �����Ѵ�.
     */
    resizeContent: function () {
        var top = $('#feeder-content-wrapper').offset().top;
        var windowHeight = $(window).height();
        $('#feeder-content-wrapper').css('height', windowHeight - top - 30 + 'px');
        $('#hierarchy-content-wrapper').css('height', windowHeight - top - 30 + 'px');
        $('#route-content-wrapper').css('height', windowHeight - top - 30 + 'px');
    },
    /**
     * ������ ���̺��� �ΰ� ��� ȭ�� css �� �������Ѵ�.
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
     * ĵ���� ������ �κ��� �޽����� ���޵� ���
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
         * ĵ������ ������ ��� ������Ʈ�� ���� ���
         */
        if (message == me.message.NO_EDITOR_OBJECT) {
            if (mode == me.Constants.MODE.FEEDER) {
                infoMessage = 'ĵ������ �������� ����ġ�� �������� �ʾҽ��ϴ�.';
            }
            if (mode == me.Constants.MODE.HIERARCHY) {
                infoMessage = 'ĵ������ �������� ������ �������� �ʾҽ��ϴ�.';
            }
            if (mode == me.Constants.MODE.ROUTE) {
                infoMessage = 'ĵ������ �������� ������Ʈ�� �������� �ʾҽ��ϴ�.';
            }
            if (infoMessage) {
                msgBox(infoMessage);
            }
        }

        /**
         * ĵ������ ���ο� ������ ��� ������Ʈ�� �����Ұ��
         */
        if (message == me.message.NEW) {
            //ĵ������ ����Ǿ����� ������� �ʾ��� ���
            if (renderer.getIsUpdated()) {
                if (mode == me.Constants.MODE.FEEDER) {
                    infoMessage = '�۾����� �Ǵ��� �������� �ʾҽ��ϴ�. ���ο� �Ǵ��� ���ðڽ��ϱ�?';
                }
                if (mode == me.Constants.MODE.HIERARCHY) {
                    infoMessage = '�۾����� ���̾��Ű�� �������� �ʾҽ��ϴ�. ���ο� ���̾��Ű�� ���ðڽ��ϱ�?';
                }
                if (mode == me.Constants.MODE.ROUTE) {
                    infoMessage = '�۾����� BLDG/����� ������Ʈ�� �������� �ʾҽ��ϴ�. ���ο� ������Ʈ�� ���ðڽ��ϱ�?';
                }
                confirmBox(infoMessage, function (result) {
                    if (result) {
                        me.setEditingObject(renderer, data, panel);
                        me.renderGrid(me.model.SwgrList.name);
                        me.redrawUnssignedLoadTables(me.model.UnAssignedLoadList.panel);
                        //me.renderGrid(me.model.UnAssignedLoadList.name);
                        me.initTabClass();
                    }
                });
            }
            //ĵ������ ������� �ʾ��� ���(������ ��ġ�ų�, ���� �������� ������Ʈ�� �ݿ����� �ʾ��� ����̴�.)
            else {
                me.setEditingObject(renderer, data, panel);
                me.renderGrid(me.model.SwgrList.name);
                me.redrawUnssignedLoadTables(me.model.UnAssignedLoadList.panel);
                //me.renderGrid(me.model.UnAssignedLoadList.name);
                me.initTabClass();
            }
        } else if (message == me.message.MOD) {
            //ĵ������ ����Ǿ����� ������� �ʾ��� ���
            if (renderer.getIsUpdated()) {
                if (mode == me.Constants.MODE.FEEDER) {
                    infoMessage = '�۾����� �Ǵ��� �������� �ʾҽ��ϴ�. ���ο� �Ǵ��� ���ðڽ��ϱ�?';
                }
                if (mode == me.Constants.MODE.HIERARCHY) {
                    infoMessage = '�۾����� ���̾��Ű�� �������� �ʾҽ��ϴ�. ���ο� ���̾��Ű�� ���ðڽ��ϱ�?';
                }
                if (mode == me.Constants.MODE.ROUTE) {
                    infoMessage = '�۾����� BLDG/����� ������Ʈ�� �������� �ʾҽ��ϴ�. ���ο� ������Ʈ�� ���ðڽ��ϱ�?';
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
            //ĵ������ ������� �ʾ��� ���(������ ��ġ�ų�, ���� �������� ������Ʈ�� �ݿ����� �ʾ��� ����̴�.)
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
        me.redrawUnssignedLoadTables(me.model.UnAssignedLoadList.panel);
        //me.renderGrid(me.model.UnAssignedLoadList.name);
        me.initTabClass();
    },

    /**
     * json �Ǵ� xml�� ĵ������ �ε��Ҷ� setEditingObject�� �����Ѵ�.
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

        //������ ȥ���� ���� ���� ��ġ
        var data = JSON.parse(JSON.stringify(shapeData));

        //Ÿ��Ʋ �ڽ��� �����Ѵ�.
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

        //�������� ������ ������Ʈ�� �����Ѵ�.
        renderer.editingObject = data;
        if(panel != null) {
            var panelId = panel[0].id;
            if(panelId == 'feederGrid') {
                renderer.editingObject['onDrop'] = panelId;
            }
        }
        renderer.setIsUpdated(false);

        /**
         * canvas�� �׷��� �������� list�� �����ؼ� �����Ѵ�.
         * ���� �׷��� canvas�� ������ GUI�� �ƴ� ���󿡼� �ش� �Ǵ��� �޷� �ִ� �ε带 ������ ��쿡��
         * �� �ε带 ã�Ƽ� ĵ�ٽ����� ������ �Ѵ�.
         * me.feederMgtShapeList���� �ش� �ε带 ã�Ƽ� �����.
         */
        try {
            me.feederMgtShapeList = parent.getFeederInfo(renderer.editingObject.swgr_list_seq);
        }catch(e) {
            /** �ʱ�ȭ */
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
         * canvas�� ���̽� ������ GUI�� �ƴ� ���󿡼� �ش� �Ǵ��� �޷� �ִ� �ε带 ������ ��쿡��
         * �� �ε带 ã�Ƽ� ĵ�ٽ����� ������ �Ѵ�.
         * me.feederMgtShapeList���� �ش� �ε带 ã�Ƽ� �����.
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

        /** �ʱ�ȭ */
        me.updateFeederList = [];
        me.usedLoadList = [];
        me.deleteFeederList = [];


    },

    /**
     * ���̾��Ű ����/�÷ξ� üũ ����
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
                if(shapeElement.shape.data){
                    if(shapeElement.shape.data.shapeType == renderer.Constants.TYPE.HIERARCHY_BLDG &&
                        shapeElement.shape.data.hier_seq == shapeData.hier_seq
                    ){
                        isDraw = false;
                    }
                }
            });
            checkedData['isDraw'] = isDraw;
            if(!isDraw) {
                msg = "�ش� ������ �̹� ĵ������ �����մϴ�.";
            }

        } else if(shapeData.shapeType == renderer.Constants.TYPE.HIERARCHY_FLOOR) {

            shapeList.some(function(shapeElement){
                if(shapeElement.shape.data){
                    if(shapeElement.shape.data.shapeType == renderer.Constants.TYPE.HIERARCHY_FLOOR &&
                        shapeElement.shape.data.hier_seq == shapeData.hier_seq
                    ){
                        isDraw = false;
                    }
                }
            });
            checkedData['isDraw'] = isDraw;
            if(!isDraw) {
                msg = "�ش� �÷ξ �̹� ĵ������ �����մϴ�.";
            }
        }

        checkedData['isDraw'] = isDraw;
        checkedData['msg'] = msg;

        return checkedData;
    },

    /**
     * save�� ���Ŀ��� ���ο� setEditingObject�� �����ؾ� �Ѵ�.
     * @param renderer
     */
    setEditingObjectFromSave: function (renderer) {

        var me = this;

        //Ÿ��Ʋ �ڽ��� �����Ѵ�.
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

        //feeder������ �����´�.
        var feederInfo = [renderer.editingObject];
        feederInfo[0]['shapeType'] = me.Constants.TYPE.MODIFY_FEEDER;
        //�������� ������ ������Ʈ�� �����Ѵ�.
        renderer.editingObject = feederInfo[0];
        renderer.setIsUpdated(false);

        /**
         * canvas�� �׷��� �������� list�� �����ؼ� �����Ѵ�.
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

        /** �ʱ�ȭ */
        me.updateFeederList = [];
        me.usedLoadList = [];
        me.deleteFeederList = [];

    },

    /**
     * �������� ���ο� ������ ������Ʈ�� �����ϰ�, Ÿ��Ʋ�� �����Ѵ�.
     * @param renderer
     * @param shapeData
     */
    setEditingObject: function (renderer, shapeData) {
        if (!renderer || !shapeData) {
            return;
        }
        var me = this;
        //������ ȥ���� ���� ���� ��ġ
        var data = JSON.parse(JSON.stringify(shapeData));

        //Ÿ��Ʋ �ڽ��� �����Ѵ�.
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

        //�������� �ʱ�ȭ�Ѵ�.
        renderer.getCanvas().clear();
        renderer.getCanvas().setScale(1);
        renderer.fitCanvasSize();

        //�������� ������ ������Ʈ�� �����Ѵ�.
        renderer.editingObject = data;
        me.parentSwitchElement = data;
        //�̶�, ������ ��� �׸� �� ĵ������ ������Ʈ ���� ���� ���·� �����Ѵ�.
        if (data['shapeType'] == me.Constants.TYPE.MODIFY_FEEDER) {
            //TODO ������ ������Ʈ�� ��� xml �� �������� ĵ������ ���� �������Ѵ�.
            data['shapeType'] = me.Constants.TYPE.SWITCH_GEAR;
            renderer.drawImmediately(null, data);
            renderer.setIsUpdated(false);
        }

        //�ƴѰ��, �������� ���� ������ ������ �׸���. ĵ������ ������Ʈ �� ó���� �ϵ��� �Ѵ�.
        if (data['shapeType'] == me.Constants.TYPE.NEW_FEEDER) {
            data['shapeType'] = me.Constants.TYPE.SWITCH_GEAR;
            renderer.drawImmediately(null, data);
            renderer.setIsUpdated(true);
        }
    },

    /**
     * ������Ʈ ������ �ҷ��ͼ� ������ ����Ѵ�.
     */
    renderProjectReference: function () {
        var me = this;
        me.dataController.getProjectInfo(function (err, data) {
            if (err) {
                console.log(err);
                msgBox('������Ʈ ������ �ҷ��� �� �����ϴ�.');
            }
            me.projectData = data;
            me.setEditingObject(me.routeRenderer, data);
            me.setEditingObject(me.hierarchyRenderer, data);
        });
    },
    /**
     * ����ġ ����Ʈ �ڽ��� ������ ����Ѵ�.
     */
    renderSwgrSelectBox: function () {
        var me = this;
        var selectBox = $('#swgrSelectBox');
        me.dataController.getSwitchgearTypeList(function (err, data) {
            if (err) {
                console.log(err);
                msgBox('����ġ Ÿ�� ����Ʈ�ڽ� ����Ʈ�� �ҷ��� �� �����ϴ�.');
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
     * �����̼� �巡�� ��� �̺�Ʈ�� ����Ѵ�.
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
                    //TODO ���⼭, �����̼� �� ��Ȧ �����͸� ����� �� �������� REF_NAME_TO ���� �޾ƿ;� �ϴ� ������ �����Ѵ�.
                    //�׸���, ĵ�����ʿ����� �� �����̼��� �������� ����� �� �� �����Ͽ�, �� �����̼��� LOC_REF_NAME �� �����ؾ� �Ѵ�.
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
                    //TODO ���⼭, �����̼� �� ��Ȧ �����͸� ����� �� �������� REF_NAME_TO ���� �޾ƿ;� �ϴ� ������ �����Ѵ�.
                    //�׸���, ĵ�����ʿ����� �� �����̼��� �������� ����� �� �� �����Ͽ�, �� �����̼��� LOC_REF_NAME �� �����ؾ� �Ѵ�.
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
     * Ʈ���� �巡�� ��� �̺�Ʈ�� ����Ѵ�.
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
     * ���� �޴��� Ʈ�������� �����Ѵ�.
     * @param model �𵨸�
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
                        msgBox('����ε� �ε� ����Ʈ�� �ҷ��� �� �����ϴ�.');
                    }
                    return;
                }
                /**
                 * Ʈ�� ������ ����Ʈ�� model ������Ƽ�� ����Ѵ�.(���̺�/Ʈ�� �𵨸�)
                 * Ʈ�� ������ ����ġ�� ���� �巡�� �� MODIFY_FEEDER �� �Ѿ��.(�Ǵ� ����.)
                 * Ʈ�� ������ �ε��� ���� �巡�� �� �ƹ��ϵ� ���� �ʴ´�.
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
                                        var infoMessage = "������ ��带 �����Ͻðڽ��ϱ�?";
                                        confirmBox(infoMessage, function (result) {
                                            if (result) {
                                                var targetSeq = $node.data.feeder_list_mgt_seq;
                                                var resultData = me.dataController.deleteFeeder(targetSeq);
                                                if(resultData == '0') {
                                                    //���ο� �����͸� �޾Ƽ� Ʈ���� �ٽ� �׸���.
                                                    var renderer = me.getRendererByMode(me.currentMode);
                                                    me.dataController.getUpdateTree(tree, renderer, me.Constants.MODE.FEEDER);
                                                    me.renderGrid(me.model.SwgrList.name);
                                                    me.redrawUnssignedLoadTables(me.model.UnAssignedLoadList.panel);
                                                    me.renderGrid(me.model.FeederList.name);
                                                    me.renderGrid(me.model.HierarchyFeederList.name);
                                                    msgBox('�����Ǿ����ϴ�.');
                                                    setTimeout(msgBoxClose, 1000);
                                                } else {
                                                    //������ status : 1, �����޼����� ������.
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
                        msgBox('���̾��Ű ����Ʈ�� �ҷ��� �� �����ϴ�.');
                    }
                    return;
                }
                /**
                 * Ʈ�� ������ ����Ʈ�� model ������Ƽ�� ����Ѵ�.(���̺�/Ʈ�� �𵨸�)
                 * Ʈ�� ������ ������ ���� HIERARCHY_BLDG �� �ѱ��.
                 * Ʈ�� ������ �÷�� �� ���� HIERARCHY_FLOOR �� �ѱ��.
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
     * ���� �޴��� �׸��� ���̺��� �����Ѵ�.
     * @param model ���̺�/Ʈ�� �𵨸�
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
                        cursorAt:{left: 10},
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

            if(panel[0].id == 'unAssignedLoadGrid' ) {
                new $.fn.dataTable.FixedColumns(dataTable);
            }

        };
        if (model == me.model.SwgrList.name) {
            me.dataController.getSwitchgearUnused(function (err, gridData) {
                if (err) {
                    console.log(err);
                    msgBox('����ġ ����Ʈ�� �ҷ��� �� �����ϴ�.');
                } else {
                    /**
                     * ����� ���� ���� ����ġ ����Ʈ�� SWGR_TYPE �� TR(Ʈ��������) �� ���� ���������ӷ� �Ѿ��.
                     * Ʈ�������Ӱ� �ƴѰ��� NEW_FEEDER �� �Ѿ��.
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
                            gridData[i]['label'] = '<a href="javascript:parent.editSWGRInfo(\''+ gridData[i]['swgr_list_seq']+'\', \'' + gridData[i]['swgr_maker_seq'] + '\', ' + me.editSWGRInfoCallBack + ');void(0)" name="item" data-index="' + i + '" style="margin-left: 5px;margin-right: 5px;">' + gridData[i]['swgr_name'] + '</a>';
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
                    msgBox('�Ǵ� ����Ʈ�� �ҷ��� �� �����ϴ�.');
                } else {
                    /**
                     * FeederList(����� �Ǵ�) �� MODIFY_FEEDER(���� �Ǵ� ����) �� �����Ѵ�.
                     */
                    if(gridData !== undefined) {
                        for (var i = 0; i < gridData.length; i++) {
                            gridData[i]['shapeType'] = me.Constants.TYPE.MODIFY_FEEDER;
                            gridData[i]['shapeLabel'] = gridData[i]['swgr_name'];
                            gridData[i]['model'] = model;
                            gridData[i]['label'] = '<a href="javascript:parent.showSWGRInfo(\''+ gridData[i]['swgr_list_seq']+'\');void(0)" name="item" data-index="' + i + '" style="margin-left: 5px;margin-right: 5px;">' + gridData[i]['swgr_name'] + '</a>';
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
                    msgBox('���̾��Ű �������� �Ǵ� ����Ʈ�� �ҷ��� �� �����ϴ�.');
                } else {
                    /**
                     * HierarchyFeederList(���̾��Ű �������� �Ǵ�) �� HIERARCHY_FEEDER �� �����Ѵ�.
                     */
                    if(gridData !== undefined) {
                        for (var i = 0; i < gridData.length; i++) {
                            gridData[i]['shapeType'] = me.Constants.TYPE.HIERARCHY_FEEDER;
                            gridData[i]['shapeLabel'] = gridData[i]['swgr_name'];
                            gridData[i]['model'] = model;
                            gridData[i]['label'] = '<a href="javascript:parent.showSWGRInfo(\''+ gridData[i]['swgr_seq']+'\');void(0)" name="item" data-index="' + i + '" style="margin-left: 5px;margin-right: 5px;">' + gridData[i]['swgr_name'] + '</a>';
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
                    msgBox('�ε� ����Ʈ�� �ҷ��� �� �����ϴ�.');
                } else {
                    /**
                     * UnAssignedLoadList �� �ε� Ÿ�Ժ��� shapeType �� ������ �ѱ��.
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
                            gridData[i]['lo_equip_desc_style'] = '<span style="margin-left: 5px;margin-right: 5px;">' + (gridData[i]['lo_equip_desc']==null?'':gridData[i]['lo_equip_desc']) + '</span>';
                            gridData[i]['lo_unit_style'] = '<span style="margin-left: 5px;margin-right: 5px;">' + (gridData[i]['lo_unit']==null?'':gridData[i]['lo_unit']) + '</span>';
                            gridData[i]['lo_proc_sys_style'] = '<span style="margin-left: 5px;margin-right: 5px;">' + (gridData[i]['lo_proc_sys']==null?'':gridData[i]['lo_proc_sys']) + '</span>';
                            gridData[i]['lo_equip_loc_style'] = '<span style="margin-left: 5px;margin-right: 5px;">' + (gridData[i]['lo_equip_loc']==null?'':gridData[i]['lo_equip_loc']) + '</span>';
                            gridData[i]['lo_pow_sou'] = gridData[i]['lo_pow_sou']==null?'':gridData[i]['lo_pow_sou'];
                            gridData[i]['lo_equip_vol'] = gridData[i]['lo_equip_vol']==null?'':gridData[i]['lo_equip_vol'];
                            gridData[i]['lo_rated_pow'] = gridData[i]['lo_rated_pow']==null?'':gridData[i]['lo_rated_pow'];
                            gridData[i]['lo_type'] = gridData[i]['lo_type']==null?'':gridData[i]['lo_type'];
                            gridData[i]['lo_duty'] = gridData[i]['lo_duty']==null?'':gridData[i]['lo_duty'];
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
                        initComplete: function () {
                            this.api().columns([1,2,3,4,5,6,7,8,9]).every( function () {
                                var column = this;
                                var select = $('<select><option value=""></option></select>')
                                    .appendTo( $(column.header()).empty() )
                                    .on( 'change', function (event) {
                                        event.stopPropagation();
                                        var val = $.fn.dataTable.util.escapeRegex(
                                            $(this).val()
                                        );

                                        column
                                            .search( val ? '^'+val+'$' : '', true, false )
                                            .draw();
                                    } );

                                column.data().unique().sort().each( function ( d, j ) {
                                    if(d.indexOf('<') > -1) {
                                        d = d.substring(d.indexOf('>')+1, d.lastIndexOf('<'));
                                    }
                                    select.append( '<option value="'+d+'">'+d+'</option>' )
                                } );
                            } );
                        }
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
                    msgBox('�����̼� ���۷��� �����͸� �ҷ��� �� �����ϴ�.');
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
                    msgBox('���̽����� ���۷��� �����͸� �ҷ��� �� �����ϴ�.');
                } else {
                    if(gridData !== undefined) {
                        for (var i = 0; i < gridData.length; i++) {
                            gridData[i]['model'] = model;
                            gridData[i]['label'] = '<a href="javascript:void(0);" data-index="' + i + '" style="margin-left: 5px;margin-right: 5px;">' + gridData[i]['race_ref_trayedm_no'] + '</a>';
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
                    msgBox('���Ʈ ���۷��� �����͸� �ҷ��� �� �����ϴ�.');
                } else {
                    if(gridData !== undefined) {
                        for (var i = 0; i < gridData.length; i++) {
                            gridData[i]['model'] = model;
                            gridData[i]['fromLabel'] = '<a href="javascript:void(0);" data-index="' + i + '" style="margin-left: 5px;margin-right: 5px;">' + gridData[i]['rou_ref_from'] + '</a>';
                            gridData[i]['toLabel'] = '<a href="javascript:void(0);" data-index="' + i + '" style="margin-left: 5px;margin-right: 5px;">' + gridData[i]['rou_ref_to'] + '</a>';
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
                    msgBox('���� ���۷��� �����͸� �ҷ��� �� �����ϴ�.');
                } else {
                    /**
                     * BldgReferenceList(���Ʈ ������) �� BLDG �� �ѱ��.
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
                    msgBox('���̺� ���۷��� �����͸� �ҷ��� �� �����ϴ�.');
                } else {
                    /**
                     * CableReferenceList(���Ʈ ������) �� BLDG �� �ѱ��.
                     */
                    if(gridData !== undefined) {
                        for (var i = 0; i < gridData.length; i++) {
                            gridData[i]['shapeType'] = me.Constants.TYPE.BLDG;
                            gridData[i]['shapeLabel'] = gridData[i]['rou_ref_tot_path'];
                            gridData[i]['model'] = model;
                            gridData[i]['rou_ref_from_style'] = '<span style="margin-left: 5px;margin-right: 5px;">'+ gridData[i]['rou_ref_from'] +'</span>';
                            gridData[i]['rou_ref_to_style'] = '<span style="margin-left: 5px;margin-right: 5px;">'+ (gridData[i]['rou_ref_to']==null?'':gridData[i]['rou_ref_to']) +'</span>';
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
     * ���� ���� �׸��� �� Ʈ���� ���� �׸���.
     * �Ǵ����� �̺�Ʈ �߻��ÿ��� �Ǵ� �������� �׸��� �� Ʈ���� ���������Ѵ�.
     * �߰������� �Ǵ��϶��� ���̾��Ű�� �Ǵ�����Ʈ�� �����ؾ��Ѵ�.
     *
     */
    refreshGridAndTree: function (mode, renderer) {
        var me = this;
        /**
         * �Ǵ����� �Ѿ�Դٸ�
         */
        if(mode == me.Constants.MODE.FEEDER) {
            me.renderSwgrSelectBox();
            me.renderGrid(me.model.SwgrList.name);
            //me.renderGrid(me.model.UnAssignedLoadList.name);
            me.redrawUnssignedLoadTables(me.model.UnAssignedLoadList.panel);
            //update
            var tree = me.model.AssignedFeederList.panel.jstree(true).destroy();
            me.renderTree(me.model.AssignedFeederList.name);

            me.renderGrid(me.model.FeederList.name);
            me.renderGrid(me.model.HierarchyFeederList.name);
            /**
             * ������ �������� ������ �ʱ�ȭ �ϰ� setEditingObjectFromLoadData�� �¿���
             * �ٲ� ������� ä���־�� �Ѵ�.
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
            var panel = me.model.BldgReferenceList.panel;
            me.redrawDataTables(panel, me.initBldgReferenceList, me);
            me.renderGrid(me.model.RacewayReferenceList.name);
            me.renderGrid(me.model.RouteReferenceList.name);
            me.renderGrid(me.model.CableReferenceList.name);
            me.saveSettingRouteMode(renderer);
        }
    },

    /**
     * ���̾��Ű �����Ϳ��� �������� ��尪�� ��ó��
     */
    saveSettingRouteMode: function(renderer) {
        var me = this;
        var currentCanvas = renderer.getCanvas();
        me.projectData.gui_route_json = currentCanvas.toJSON();
        me.setRouteSaveMode(true);

    },

    /**
     * ���̾��Ű �����Ϳ��� �������� ��尪�� ��ó��
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
                     * prevEdges�� �ִٴ� ���� ���� �Ǵ��� �ִٴ� ��.
                     * ���ٸ� �ڽ��� �����̱� ������
                     */
                    var prevEdges = currentCanvas.getPrevEdges(child);
                    var nextEdges = currentCanvas.getNextEdges(child);
                    if(prevEdges.length > 0) {
                        prevEdges.forEach(function(edge){
                            var edge = currentCanvas.getRelatedElementsFromEdge(edge);
                            var fromShapeData = edge.from.shape.data;
                            // �ڱ� �ڽ��̸� �ڽ��� �����̱� ������ pass
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