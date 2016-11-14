/**
 * Created by Seungpil Park on 2016. 9. 6..
 */
var ViewContorller = function () {
    /**
     * 컨트롤러의 메시지 일람
     */
    this.message = {
        NO_EDITOR_OBJECT: 'NO_EDITOR_OBJECT',
        NEW: 'NEW'
    };

    /**
     * 캔버스 렌더러의 Constants 및 _CONFIG 사용용도(네임스페이스 이용)
     */
    this.Constants = new Renderer().Constants;
    this.Config = new Renderer()._CONFIG;

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
     * 테이블/트리 구조모델. 캔버스의 각 shape 모델과는 다른 의미이다.
     */
    this.model = {
        /**
         * 어사인된 로드리스트 (feederRenderer)
         */
        AssignedLoadList: {
            name: 'AssignedLoadList',
            panel: $('#AssignedLoadTree')
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
        }
    };
};
ViewContorller.prototype = {
    /**
     * 테이블/트리 모델명으로 표현되야할 캔버스 렌더러를 리턴한다.
     * @param modelName
     * @returns {*}
     */
    getRendererByModel: function (modelName) {
        var me = this;
        var feederRenderer = [
            me.model.AssignedLoadList.name,
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
            me.model.BldgReferenceList.name
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

    init: function () {
        var me = this;
        $(window).resize(function () {
            me.resizeContent();
        });

        /**
         * delayTab 클래스가 붙은 Dom 은 에디터 선택 탭중, active 가 아닌것들이다.
         * active 가 아닌 탭의 콘텐츠는 css width,height 가 최초 탭 선택시 설정되므로, 최초 클릭에 한해 캔버스 사이즈도 맞추어서 그려주도록 한다.
         */
        $('.delayTab').click(function () {
            if (!$(this).data('isTabClicked')) {
                $(this).data('isTabClicked', true);
                var type = $(this).data('canvas');
                setTimeout(function () {
                    if (type == 'hierarchy') {
                        me.hierarchyRenderer.setCanvasSize(
                            [$('#' + me.hierarchyRendererId).width(), $('#' + me.hierarchyRendererId).height()]);
                    }
                    if (type == 'bldg') {
                        me.routeRenderer.setCanvasSize(
                            [$('#' + me.routeRendererId).width(), $('#' + me.routeRendererId).height()]);
                    }
                }, 200);
            }
        });

        /**
         * 화면 리사이징 후 캔버스를 렌더링한다.
         */
        me.resizeContent();
        me.feederRenderer = new Renderer(me.Constants.MODE.FEEDER, me.feederRendererId, this);
        me.routeRenderer = new Renderer(me.Constants.MODE.ROUTE, me.routeRendererId, this);
        me.hierarchyRenderer = new Renderer(me.Constants.MODE.HIERARCHY, me.hierarchyRendererId, this);

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
        me.renderGrid(me.model.SwgrList.name);
        me.renderGrid(me.model.UnAssignedLoadList.name);
        me.renderTree(me.model.AssignedLoadList.name);
        me.renderGrid(me.model.FeederList.name);

        /**
         * Hierarchy Editor 그리드
         */
        me.renderTree(me.model.HierarchyTreeList.name);
        me.renderGrid(me.model.HierarchyFeederList.name);

        /**
         * BLDG / Route Editor 그리드
         */
        me.renderGrid(me.model.BldgReferenceList.name);
        me.renderGrid(me.model.LocationReferenceList.name);
        me.renderGrid(me.model.RacewayReferenceList.name);
        me.renderGrid(me.model.RouteReferenceList.name);
        me.bindLocationDragDrop();

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
     */
    onMessage: function (renderer, data, message) {
        var me = this;
        var model = data['model'];
        var mode = me.getModeByModel(model);
        var infoMessage;

        /**
         * 캔버스에 에디팅 대상 오브젝트가 없을 경우
         */
        if (message == me.message.NO_EDITOR_OBJECT) {
            if (mode == me.Constants.MODE.FEEDER) {
                infoMessage = '캔버스에 에디팅할 피더가 지정되지 않았습니다.';
            }
            if (mode == me.Constants.MODE.HIERARCHY) {
                infoMessage = '캔버스에 에디팅할 빌딩이 지정되지 않았습니다.';
            }
            if (mode == me.Constants.MODE.ROUTE) {
                infoMessage = '캔버스에 에디팅할 프로젝트가 지정되지 않았습니다.';
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
                    infoMessage = '작업중인 피더를 저장하지 않았습니다. 새로운 피더를 여시겠습니까?';
                }
                if (mode == me.Constants.MODE.HIERARCHY) {
                    infoMessage = '작업중인 하이어라키를 저장하지 않았습니다. 새로운 하이어라키를 여시겠습니까?';
                }
                if (mode == me.Constants.MODE.ROUTE) {
                    infoMessage = '작업중인 BLDG/라우터 프로젝트를 저장하지 않았습니다. 새로운 프로젝트를 여시겠습니까?';
                }
                confirmBox(infoMessage, function (result) {
                    if (result) {
                        me.setEditingObject(renderer, data);
                    }
                });
            }
            //캔버스가 변경되지 않았을 경우(저장을 마치거나, 아직 에디팅할 오브젝트가 반영되지 않았을 경우이다.)
            else {
                me.setEditingObject(renderer, data);
            }
        }
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
            title = 'FEEDER - ' + data['SWGR_NAME'];
        }
        if (mode == me.Constants.MODE.HIERARCHY) {
            title = 'HIERARCHY - ' + data['NM'];
        }
        if (mode == me.Constants.MODE.ROUTE) {
            title = 'BLDG/ROUTE PROJECT - ' + data['NM'];
        }
        var titleBox = $('#' + containerId + '-title');
        titleBox.show();
        titleBox.html(title);

        //렌더러를 초기화한다.
        renderer.getCanvas().clear();
        renderer.getCanvas().setScale(1);
        renderer.fitCanvasSize();

        //렌더러에 에디팅 오브젝트를 설정한다.
        renderer.editingObject = data;

        //TODO 기존의 오브젝트인 경우 xml 을 바탕으로 캔버스에 새로 렌더링한다.
        //이때, 도형을 모두 그린 후 캔버스가 업데이트 되지 않은 상태로 변경한다.
        if (data['shapeType'] == me.Constants.TYPE.MODIFY_FEEDER) {

            renderer.setIsUpdated(false);
        }
        if (data['shapeType'] == me.Constants.TYPE.MODIFY_HIERARCHY_BLDG) {

            renderer.setIsUpdated(false);
        }

        //아닌경우, 렌더러에 새로 생성할 도형을 그린다.
        //이떄, 캔버스가 업데이트 된 처리를 하도록 한다.
        if (data['shapeType'] == me.Constants.TYPE.NEW_FEEDER) {
            data['shapeType'] = me.Constants.TYPE.SWITCH_GEAR;
            renderer.drawImmediately(null, data);
            renderer.setIsUpdated(true);
        }
        if (data['shapeType'] == me.Constants.TYPE.NEW_HIERARCHY_BLDG) {
            data['shapeType'] = me.Constants.TYPE.HIERARCHY_BLDG;
            renderer.drawImmediately(null, data);
            renderer.setIsUpdated(true);
        }

    },

    /**
     * 프로젝트 정보를 불러와서 내용을 등록한다.
     */
    renderProjectReference: function () {
        var me = this;
        me.dataController.getProjectReference(function (err, data) {
            if (err) {
                console.log(err);
                msgBox('프로젝트 정보를 불러올 수 없습니다.');
            }
            me.projectData = data;
            me.setEditingObject(me.routeRenderer, data);
        });
    },
    /**
     * 스위치 셀렉트 박스의 내용을 등록한다.
     */
    renderSwgrSelectBox: function () {
        var me = this;
        var selectBox = $('#swgrSelectBox');
        me.dataController.getSwgrSelectBoxList(function (err, data) {
            if (err) {
                console.log(err);
                msgBox('스위치 타입 셀리트박스 리스트를 불러올 수 없습니다.');
            }
            selectBox.append('<option value="" selected>--select new swgr type--</option>')
            for (var i = 0, leni = data.length; i < leni; i++) {
                selectBox.append('<option value="' + data[i]['CD'] + '">' + data[i]['CD_NM'] + '</option>')
            }
        });
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
            $('#newLocation').draggable({
                start: function () {

                },
                helper: 'clone',
                appendTo: "#" + canvas.getContainer().attr('id'),
                stop: function (event) {
                    //TODO 여기서, 로케이션 및 맨홀 데이터를 드랍한 후 서버에서 REF_NAME_TO 값을 받아와야 하는 것으로 추정한다.
                    //그리고, 캔버스쪽에서는 이 로케이션이 빌딩위로 드랍된 것 을 감지하여, 이 로케이션의 LOC_REF_NAME 를 변경해야 한다.
                    var value = $('#locationSelectBox').val();
                    var itemData;
                    var refName = randomRefName();
                    if (value == 'location') {
                        itemData = {
                            shapeLabel: refName,
                            shapeType: me.Constants.TYPE.LOCATION,
                            "PJT_SQ": "",
                            "LOC_REF_SEQ": 151,
                            "LOC_REF_NAME": "",
                            "HIER_SEQ": "H000003",
                            "LOC_REF_NAME_TO": refName,
                            "LOC_REF_TEMP": 0,
                            "LOC_REF_LENGTH": 0,
                            "LOC_REF_REM": ""
                        };
                    }
                    if (value == 'manhole') {
                        itemData = {
                            shapeLabel: refName,
                            shapeType: me.Constants.TYPE.MANHOLE,
                            "PJT_SQ": "",
                            "LOC_REF_SEQ": 151,
                            "LOC_REF_NAME": "",
                            "HIER_SEQ": "H000003",
                            "LOC_REF_NAME_TO": refName,
                            "LOC_REF_TEMP": 0,
                            "LOC_REF_LENGTH": 0,
                            "LOC_REF_REM": ""
                        };
                    }
                    canvas.getContainer().trigger('drop.viewController', [event, itemData]);
                }
            });
        }
        ;
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
        if (model == me.model.AssignedLoadList.name) {
            me.dataController.getAssignedLoadList(function (err, treeData) {
                if (err) {
                    console.log(err);
                    if (typeof err == 'string') {
                        msgBox(err);
                    } else {
                        msgBox('어사인된 로드 리스트를 불러올 수 없습니다.');
                    }
                    return;
                }
                /**
                 * 트리 구조는 디폴트로 model 프로퍼티를 등록한다.(테이블/트리 모델명)
                 * 트리 구조중 스위치인 것은 드래그 시 NEW_FEEDER 로 넘어간다.(새로 생성하는 경우이다.)
                 * 트리 구조중 로드인 것은 드래그 시 아무일도 하지 않는다.
                 */
                for (var i = 0; i < treeData.length; i++) {
                    treeData[i]['data']['model'] = model;
                    if (treeData[i]['data']['FE_SWGR_LOAD_DIV'] == 'S') {
                        treeData[i]['data']['shapeType'] = me.Constants.TYPE.NEW_FEEDER;
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
                                        $node = tree.create_node($node);
                                        tree.edit($node);
                                    }
                                },
                                "Rename": {
                                    "separator_before": false,
                                    "separator_after": false,
                                    "label": "Rename",
                                    "action": function (obj) {
                                        tree.edit($node);
                                    }
                                },
                                "Remove": {
                                    "separator_before": false,
                                    "separator_after": false,
                                    "label": "Remove",
                                    "action": function (obj) {
                                        tree.delete_node($node);
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
                        msgBox('하이어라키 리스트를 불러올 수 없습니다.');
                    }
                    return;
                }
                /**
                 * 트리 구조는 디폴트로 model 프로퍼티를 등록한다.(테이블/트리 모델명)
                 * 트리 구조중 빌딩인 것은 MODIFY_HIERARCHY_BLDG(기존 빌딩 하이어라키 수정) 으로 넘어간다.
                 * 오픈그래프 데이터가 없다면 NEW_HIERARCHY_BLDG(신규 빌딩 하이러라키) 으로 넘어간다.
                 * 트리 구조중 플루어 인 것은 HIERARCHY_FLOOR 로 넘긴다.
                 */
                for (var i = 0; i < treeData.length; i++) {
                    treeData[i]['data']['model'] = model;
                    if (treeData[i]['data']['LV'] == 1) {
                        if (treeData[i]['data']['GUI_XML'] && treeData[i]['data']['GUI_XML'].length > 0) {
                            treeData[i]['data']['shapeType'] = me.Constants.TYPE.MODIFY_HIERARCHY_BLDG;
                            treeData[i]['data']['shapeLabel'] = treeData[i]['data']['NM'];
                        } else {
                            treeData[i]['data']['shapeType'] = me.Constants.TYPE.NEW_HIERARCHY_BLDG;
                            treeData[i]['data']['shapeLabel'] = treeData[i]['data']['NM'];
                        }
                    }
                    if (treeData[i]['data']['LV'] == 2) {
                        treeData[i]['data']['shapeType'] = me.Constants.TYPE.HIERARCHY_FLOOR;
                        treeData[i]['data']['shapeLabel'] = treeData[i]['data']['NM'];
                    }
                }
                treeOptions = {
                    plugins: ["themes", "json_data", "ui", "cookies", "types", "dnd", "contextmenu"],
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
     * 우측 메뉴의 그리드 테이블을 생성한다.
     * @param model 테이블/트리 모델명
     */
    renderGrid: function (model) {
        var me = this;
        var panel = me.model[model].panel;
        var panelId = panel.attr('id');
        var greedOptions = {};
        var canvas = me.getRendererByModel(model);

        var renderGridAction = function (gridOptions, gridData) {
            if (!panel.data('table')) {
                panel.data('table', true);
                panel.DataTable(gridOptions);
                me.modifyDataTablesStyle(panelId);
            }

            var gridPanelDiv = $('#' + panelId + '_wrapper');
            var nameClickEvent = function (element, itemData) {
                element.unbind('click');
                element.click(function (event) {
                    event.stopPropagation();
                    console.log(itemData);
                });
            };

            var canvasDropEvent = function (element, itemData) {
                if (canvas) {
                    element.draggable({
                        start: function () {

                        },
                        helper: 'clone',
                        appendTo: "#" + canvas.getContainer().attr('id'),
                        stop: function (event) {
                            canvas.getContainer().trigger('drop.viewController', [event, itemData]);
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
                blockStop();
            });

            var dataTable = panel.dataTable().api();
            dataTable.clear();
            dataTable.rows.add(gridData);
            dataTable.draw();
        };
        if (model == me.model.SwgrList.name) {
            me.dataController.getSwgrList(function (err, gridData) {
                if (err) {
                    console.log(err);
                    msgBox('스위치 리스트를 불러올 수 없습니다.');
                } else {
                    /**
                     * 어사인 되지 않은 스위치 리스트는 NEW_FEEDER 로 넘어간다.
                     */
                    for (var i = 0; i < gridData.length; i++) {
                        gridData[i]['shapeType'] = me.Constants.TYPE.NEW_FEEDER;
                        gridData[i]['shapeLabel'] = gridData[i]['SWGR_NAME'];
                        gridData[i]['shapeFollowText'] = gridData[i]['SWGR_TAG_NO'] + ',' + gridData[i]['SWGR_SHORT_CIR_RATING'];
                        gridData[i]['model'] = model;
                        gridData[i]['label'] = '<a href="#" name="item" data-index="' + i + '">' + gridData[i]['SWGR_NAME'] + '</a>';
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
                                data: 'SWGR_OWNER_NM',
                                title: 'OWNER',
                                defaultContent: ''
                            }
                        ],
                        pageLength: 20,
                        lengthChange: false,
                        info: false
                    };
                }
                renderGridAction(greedOptions, gridData);
            });
        }
        if (model == me.model.FeederList.name || model == me.model.HierarchyFeederList.name) {
            me.dataController.getFeederList(function (err, gridData) {
                if (err) {
                    console.log(err);
                    msgBox('피더 리스트를 불러올 수 없습니다.');
                } else {
                    /**
                     * HierarchyFeederList(하이어라키 에디터의 피더) 는 HIERARCHY_FEEDER 로 전달한다.
                     * FeederList(어사인 피더) 는 MODIFY_FEEDER(기존 피더 수정) 로 전달한다.
                     */
                    for (var i = 0; i < gridData.length; i++) {
                        if (model == me.model.HierarchyFeederList.name) {
                            gridData[i]['shapeType'] = me.Constants.TYPE.HIERARCHY_FEEDER;
                            gridData[i]['shapeLabel'] = gridData[i]['SWGR_NAME'];
                        }
                        if (model == me.model.FeederList.name) {
                            gridData[i]['shapeType'] = me.Constants.TYPE.MODIFY_FEEDER;
                        }
                        gridData[i]['model'] = model;
                        gridData[i]['label'] = '<a href="#" name="item" data-index="' + i + '">' + gridData[i]['SWGR_NAME'] + '</a>';
                    }
                    greedOptions = {
                        data: gridData,
                        columns: [
                            {
                                data: 'label',
                                title: 'EQUIPMENT DESCRIPTION',
                                defaultContent: ''
                            },
                            {
                                data: 'SWGR_TYPE_CD',
                                title: 'Type',
                                defaultContent: ''
                            },
                            {
                                data: 'SWGR_TOTAL_KVA',
                                title: 'TOTAL LOAD(Kva)',
                                defaultContent: ''
                            }
                        ],
                        pageLength: 20,
                        lengthChange: false,
                        info: false
                    };
                }
                renderGridAction(greedOptions, gridData);
            });
        }
        if (model == me.model.UnAssignedLoadList.name) {
            me.dataController.getUnAssignedLoadList(function (err, gridData) {
                if (err) {
                    console.log(err);
                    msgBox('로드 리스트를 불러올 수 없습니다.');
                } else {
                    /**
                     * UnAssignedLoadList 는 로드 타입별로 shapeType 을 지정해 넘긴다.
                     */
                    for (var i = 0; i < gridData.length; i++) {
                        if (gridData[i]['LO_TYPE'] == 'NM') {
                            gridData[i]['shapeType'] = me.Constants.TYPE.NMLOAD;
                            gridData[i]['shapeLabel'] = gridData[i]['LO_EQUIP_TAG_NO'];
                        }
                        if (gridData[i]['LO_TYPE'] == 'SH') {
                            gridData[i]['shapeType'] = me.Constants.TYPE.SHLOAD;
                            gridData[i]['shapeLabel'] = gridData[i]['LO_EQUIP_TAG_NO'];
                        }
                        gridData[i]['model'] = model;
                        gridData[i]['label'] = '<a href="#" name="item" data-index="' + i + '">' + gridData[i]['LO_EQUIP_TAG_NO'] + '</a>';
                    }
                    greedOptions = {
                        data: gridData,
                        columns: [
                            {
                                data: 'label',
                                title: 'EQUIPMENT TAG NO',
                                defaultContent: ''
                            },
                            {
                                data: 'LO_PROC_SYS',
                                title: 'PROCESS/SYSTEM',
                                defaultContent: ''
                            }
                        ],
                        pageLength: 20,
                        lengthChange: false,
                        info: false
                    };
                }
                renderGridAction(greedOptions, gridData);
            });
        }
        if (model == me.model.LocationReferenceList.name) {
            me.dataController.getLocationReferenceList(function (err, gridData) {
                if (err) {
                    console.log(err);
                    msgBox('로케이션 레퍼런스 데이터를 불러올 수 없습니다.');
                } else {
                    for (var i = 0; i < gridData.length; i++) {
                        gridData[i]['model'] = model;
                        gridData[i]['label'] = '<a href="#" name="item" data-index="' + i + '">' + gridData[i]['LOC_REF_NAME'] + '</a>';
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
                                data: 'LOC_REF_NAME_TO',
                                title: 'Point',
                                defaultContent: ''
                            },
                            {
                                data: 'LOC_REF_TEMP',
                                title: 'Temp',
                                defaultContent: ''
                            },
                            {
                                data: 'LOC_REF_LENGTH',
                                title: 'Length',
                                defaultContent: ''
                            }
                        ],
                        pageLength: 20,
                        lengthChange: false,
                        info: false
                    };
                }
                renderGridAction(greedOptions, gridData);
            });
        }
        if (model == me.model.RacewayReferenceList.name) {
            me.dataController.getRacewayReferenceList(function (err, gridData) {
                if (err) {
                    console.log(err);
                    msgBox('레이스웨이 레퍼런스 데이터를 불러올 수 없습니다.');
                } else {
                    for (var i = 0; i < gridData.length; i++) {
                        gridData[i]['model'] = model;
                        gridData[i]['label'] = '<a href="#" name="item" data-index="' + i + '">' + gridData[i]['RACE_REF_TRAYEDM_NO'] + '</a>';
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
                                data: 'RACE_REF_FROM',
                                title: 'From',
                                defaultContent: ''
                            },
                            {
                                data: 'RACE_REF_TO',
                                title: 'To',
                                defaultContent: ''
                            },
                            {
                                data: 'RACE_REF_LEN',
                                title: 'Length',
                                defaultContent: ''
                            }
                        ],
                        pageLength: 20,
                        lengthChange: false,
                        info: false
                    };
                }
                renderGridAction(greedOptions, gridData);
            });
        }
        if (model == me.model.RouteReferenceList.name) {
            me.dataController.getRouteReferenceList(function (err, gridData) {
                if (err) {
                    console.log(err);
                    msgBox('라우트 레퍼런스 데이터를 불러올 수 없습니다.');
                } else {
                    for (var i = 0; i < gridData.length; i++) {
                        gridData[i]['model'] = model;
                        gridData[i]['label'] = '<a href="#" name="item" data-index="' + i + '">' + gridData[i]['ROU_REF_TOT_PATH'] + '</a>';
                    }
                    greedOptions = {
                        data: gridData,
                        columns: [
                            {
                                data: 'label',
                                title: 'Path',
                                defaultContent: ''
                            },
                            {
                                data: 'ROU_REF_TOT_LEN',
                                title: 'Length',
                                defaultContent: ''
                            }
                        ],
                        pageLength: 10,
                        lengthChange: false,
                        info: false
                    };
                }
                renderGridAction(greedOptions, gridData);
            });
        }
        if (model == me.model.BldgReferenceList.name) {
            me.dataController.getBldgReferenceList(function (err, gridData) {
                if (err) {
                    console.log(err);
                    msgBox('빌딩 레퍼런스 데이터를 불러올 수 없습니다.');
                } else {
                    /**
                     * BldgReferenceList(라우트 에디터) 는 BLDG 로 넘긴다.
                     */
                    for (var i = 0; i < gridData.length; i++) {
                        gridData[i]['shapeType'] = me.Constants.TYPE.BLDG;
                        gridData[i]['shapeLabel'] = gridData[i]['NM'];
                        gridData[i]['model'] = model;
                        gridData[i]['label'] = '<a href="#" name="item" data-index="' + i + '">' + gridData[i]['NM'] + '</a>';
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
                                data: 'DSCR',
                                title: 'Description',
                                defaultContent: ''
                            }
                        ],
                        pageLength: 10,
                        lengthChange: false,
                        info: false
                    };
                }
                renderGridAction(greedOptions, gridData);
            });
        }
    }
}
;
ViewContorller.prototype.constructor = ViewContorller;

$(function () {
    var viewContorller = new ViewContorller();
    viewContorller.init();
});