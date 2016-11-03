/**
 * Created by Seungpil Park on 2016. 9. 6..
 */
var ViewContorller = function () {
    this.feederRenderer = null;
    this.routeRenderer = null;
    this.hierarchyRenderer = null;
    this.dataController = new DataController();
    this.panel = {
        AssignedLoadList: $('#AssignedLoadTree'),
        HierarchyTreeList: $('#hierarchyTree'),
        SwgrList: $('#swgrGrid'),
        FeederList: $('#feederGrid'),
        HierarchyFeederList: $('#hierarchy-feederGrid'),
        UnAssignedLoadList: $('#unAssignedLoadGrid'),
        LocationReferenceList: $('#locationRefGrid'),
        RacewayReferenceList: $('#racewayRefGrid'),
        RouteReferenceList: $('#routeRefGrid'),
        BldgReferenceList: $('#bldgRefGrid')
    };

    /**
     * 캔버스 렌더러의 Constants 및 _CONFIG 사용용도(네임스페이스 이용)
     */
    this.Constants = new Renderer().Constants;
    this.Config = new Renderer()._CONFIG;
};
ViewContorller.prototype = {
    init: function () {
        var me = this;
        $(window).resize(function () {
            me.resizeContent();
        });

        $('.delayTab').click(function () {
            if (!$(this).data('isTabClicked')) {
                $(this).data('isTabClicked', true);
                var type = $(this).data('canvas');
                setTimeout(function () {
                    if(type == 'hierarchy'){
                        me.hierarchyRenderer.setCanvasSize([$('#hierarchyCanvas').width(), $('#hierarchyCanvas').height()]);
                    }
                    if(type == 'bldg'){
                        me.routeRenderer.setCanvasSize([$('#routeCanvas').width(), $('#routeCanvas').height()]);
                    }
                }, 200);
            }
        });

        //리사이즈 이후 렌더링
        me.resizeContent();
        me.feederRenderer = new Renderer(me.Constants.MODE.FEEDER, 'feederCanvas');
        me.routeRenderer = new Renderer(me.Constants.MODE.ROUTE, 'routeCanvas');
        me.hierarchyRenderer = new Renderer(me.Constants.MODE.HIERARCHY, 'hierarchyCanvas');

        me.renderSwgrSelectBox();

        /**
         * SWGR / Assigned Feeder Editor 그리드
         */
        me.renderGrid('SwgrList');
        me.renderGrid('UnAssignedLoadList');
        me.renderTree('AssignedLoadList');
        me.renderGrid('FeederList');

        /**
         * Hierarchy Editor 그리드
         */
        me.renderTree('HierarchyTreeList');
        me.renderGrid('HierarchyFeederList');

        /**
         * BLDG / Route Editor 그리드
         */
        me.renderGrid('BldgReferenceList');
        me.renderGrid('LocationReferenceList');
        me.renderGrid('RacewayReferenceList');
        me.renderGrid('RouteReferenceList');

    },
    resizeContent: function () {
        var top = $('#feeder-content-wrapper').offset().top;
        var windowHeight = $(window).height();
        $('#feeder-content-wrapper').css('height', windowHeight - top - 30 + 'px');
        $('#hierarchy-content-wrapper').css('height', windowHeight - top - 30 + 'px');
        $('#route-content-wrapper').css('height', windowHeight - top - 30 + 'px');
    },
    modifyDataTablesStyle: function (gridPanelId) {
        var dataTable = $('#' + gridPanelId + '_wrapper');
        $(dataTable.find('.dataTables_filter')).parent().removeClass('col-sm-6');
        $(dataTable.find('.dataTables_filter')).parent().addClass('col-sm-12');
        $(dataTable.find('.dataTables_paginate')).parent().removeClass('col-sm-7');
        $(dataTable.find('.dataTables_paginate')).parent().addClass('col-sm-12');
        $(dataTable.find('.dataTables_paginate')).css('text-align', 'center');
    },
    renderSwgrSelectBox: function () {
        var me = this;
        me.dataController.getSwgrSelectBoxList(function (err, data) {
            if (err) {
                console.log(err);
                msgBox('스위치 타입 셀리트박스 리스트를 불러올 수 없습니다.');
            }
            $('#swgrSelectBox').append('<option value="" selected>--select new swgr type--</option>')
            for (var i = 0, leni = data.length; i < leni; i++) {
                $('#swgrSelectBox').append('<option value="' + data[i]['CD'] + '">' + data[i]['CD_NM'] + '</option>')
            }
        });
    },
    renderTree: function (command) {
        var me = this;
        var panel = me.panel[command];
        var treeOptions = {};
        var renderTreeAction = function (treeOptions, treeData) {
            if (!panel) {
                return;
            }
            if (!panel.data('tree')) {
                panel.jstree(treeOptions);
                panel.bind("dblclick.jstree", function (event) {
                    var node = $(event.target).closest("li");
                    console.log(node);
                });
            } else {
                panel.jstree(true).settings.core.data = treeData;
                panel.jstree(true).refresh();
            }
        };
        if (command == 'AssignedLoadList') {
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
                treeOptions = {
                    plugins: ["themes", "json_data", "ui", "cookies", "types"],
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
                    }
                };
                renderTreeAction(treeOptions, treeData);
            });
        }
        if (command == 'HierarchyTreeList') {
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
                treeOptions = {
                    plugins: ["themes", "json_data", "ui", "cookies", "types"],
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
    renderGrid: function (command) {
        var me = this;
        var panel = me.panel[command];
        var panelId = panel.attr('id');
        var greedOptions = {};
        var canvas;

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
                            canvas.getContainer().data('DRAG_SHAPE', itemData);
                        },
                        helper: 'clone',
                        appendTo: "#" + canvas.getContainer().attr('id')
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
        if (command == 'SwgrList') {
            canvas = me.feederRenderer;
            me.dataController.getSwgrList(function (err, gridData) {
                if (err) {
                    console.log(err);
                    msgBox('스위치 리스트를 불러올 수 없습니다.');
                } else {
                    for (var i = 0; i < gridData.length; i++) {
                        gridData[i]['shapeType'] = me.Constants.TYPE.SWITCH_GEAR;
                        gridData[i]['shapeLabel'] = gridData[i]['SWGR_NAME'];
                        gridData[i]['shapeFollowText'] = gridData[i]['SWGR_TAG_NO'] + ',' + gridData[i]['SWGR_SHORT_CIR_RATING'];
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
        if (command == 'FeederList' || command == 'HierarchyFeederList') {
            if (command == 'FeederList') {
                canvas = me.feederRenderer;
            } else {
                canvas = me.hierarchyRenderer;
            }
            me.dataController.getFeederList(function (err, gridData) {
                if (err) {
                    console.log(err);
                    msgBox('피더 리스트를 불러올 수 없습니다.');
                } else {
                    for (var i = 0; i < gridData.length; i++) {
                        if (command == 'HierarchyFeederList') {
                            gridData[i]['shapeType'] = me.Constants.TYPE.HIERARCHY_FEEDER;
                            gridData[i]['shapeLabel'] = gridData[i]['SWGR_NAME'];
                        }
                        if (command == 'FeederList') {
                            gridData[i]['shapeType'] = me.Constants.TYPE.NEW_FEEDER;
                        }
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
        if (command == 'UnAssignedLoadList') {
            canvas = me.feederRenderer;
            me.dataController.getUnAssignedLoadList(function (err, gridData) {
                if (err) {
                    console.log(err);
                    msgBox('로드 리스트를 불러올 수 없습니다.');
                } else {
                    for (var i = 0; i < gridData.length; i++) {
                        if (gridData[i]['LO_TYPE'] == 'NM') {
                            gridData[i]['shapeType'] = me.Constants.TYPE.NMLOAD;
                            gridData[i]['shapeLabel'] = gridData[i]['LO_EQUIP_TAG_NO'];
                        }
                        if (gridData[i]['LO_TYPE'] == 'SH') {
                            gridData[i]['shapeType'] = me.Constants.TYPE.SHLOAD;
                            gridData[i]['shapeLabel'] = gridData[i]['LO_EQUIP_TAG_NO'];
                        }
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
        if (command == 'LocationReferenceList') {
            me.dataController.getLocationReferenceList(function (err, gridData) {
                if (err) {
                    console.log(err);
                    msgBox('로케이션 레퍼런스 데이터를 불러올 수 없습니다.');
                } else {
                    for (var i = 0; i < gridData.length; i++) {
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
        if (command == 'RacewayReferenceList') {
            me.dataController.getRacewayReferenceList(function (err, gridData) {
                if (err) {
                    console.log(err);
                    msgBox('레이스웨이 레퍼런스 데이터를 불러올 수 없습니다.');
                } else {
                    for (var i = 0; i < gridData.length; i++) {
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
        if (command == 'RouteReferenceList') {
            me.dataController.getRouteReferenceList(function (err, gridData) {
                if (err) {
                    console.log(err);
                    msgBox('라우트 레퍼런스 데이터를 불러올 수 없습니다.');
                } else {
                    for (var i = 0; i < gridData.length; i++) {
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
        if (command == 'BldgReferenceList') {
            canvas = me.routeRenderer;
            me.dataController.getBldgReferenceList(function (err, gridData) {
                if (err) {
                    console.log(err);
                    msgBox('빌딩 레퍼런스 데이터를 불러올 수 없습니다.');
                } else {
                    for (var i = 0; i < gridData.length; i++) {
                        gridData[i]['shapeType'] = me.Constants.TYPE.BLDG;
                        gridData[i]['shapeLabel'] = gridData[i]['NM'];
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