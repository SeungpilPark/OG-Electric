/**
 * Created by Seungpil, Park on 2016. 9. 6..
 */
var DataController = function () {
    this.dev = false;
};
DataController.prototype = {
    /**
     * 프로젝트 데이터를 불러온다.
     * @param callback
     */
    getProjectInfo: function (callback) {
        if (this.dev) {
            $.ajax({
                url: 'doosan/data/project.json',
                dataType: 'json',
                success: function (data) {
                    callback(null, data[0]);
                },
                error: function (err) {
                    callback(err, null);
                }
            });
        } else {
            var data;
            try {
                data = parent.getProjectInfo();
                callback(null, data);
            } catch (e) {
                callback(e, null);
            }
        }
    },

    /* Feeder Editor DataController */

    /**
     * 스위치 셀렉트 박스의 내용을 불러온다.
     * @param callback
     */
    getSwitchgearTypeList: function (callback) {
        if (this.dev) {
            $.ajax({
                url: 'doosan/data/swgr-select-box.json',
                dataType: 'json',
                success: function (data) {
                    callback(null, data);
                },
                error: function (err) {
                    callback(err, null);
                }
            });
        } else {
            var data;
            try {
                data = parent.getSwitchgearTypeList();
                callback(null, data);
            } catch (e) {
                callback(e, null);
            }
        }
    },

    /**
     * 사용되지 않은 스위치 리스트를 불러온다.
     * @param callback
     */
    getSwitchgearUnused: function (callback) {
        if (this.dev) {
            $.ajax({
                url: 'doosan/data/swgr-list.json',
                dataType: 'json',
                success: function (data) {
                    callback(null, data);
                },
                error: function (err) {
                    callback(err, null);
                }
            });
        } else {
            var data;
            try {
                data = parent.getSwitchgearUnused();
                callback(null, data);
            } catch (e) {
                callback(e, null);
            }
        }
    },

    /**
     * 사용된 스위치 리스트를 불러온다.
     * @param callback
     */
    getSwitchgearUse: function (callback) {

        if(this.dev) {
            $.ajax({
                url: 'doosan/data/swgr-use-list.json',
                dataType: 'json',
                success: function (data) {
                    callback(null, data);
                },
                error: function (err) {
                    callback(err, null);
                }
            });
        } else {
            var data;
            try {
                data = parent.getSwitchgearUse();
                callback(null, data);
            } catch (e) {
                callback(e, null);
            }
        }
    },

    /**
     * 사용되지 않은 로드 리스트를 불러온다.
     * @param callback
     */
    getLoadUnused: function (callback) {
        if(this.dev) {
            $.ajax({
                url: 'doosan/data/load-list.json',
                dataType: 'json',
                success: function (data) {
                    callback(null, data);
                },
                error: function (err) {
                    callback(err, null);
                }
            });
        } else {
            var data;
            try {
                data = parent.getLoadUnused();
                callback(null, data);
            } catch (e) {
                callback(e, null);
            }
        }
    },

    /**
     * 사용된 로드 리스트를 불러온다.
     * @param callback
     */
    getLoadUse: function (callback) {
        if(this.dev) {
            $.ajax({
                url: 'doosan/data/load-use-list.json',
                dataType: 'json',
                success: function (data) {
                    callback(null, data);
                },
                error: function (err) {
                    callback(err, null);
                }
            });
        } else {
            var data;
            try {
                data = parent.getLoadUnused();
                callback(null, data);
            } catch (e) {
                callback(e, null);
            }
        }
    },

    /**
     * 피더 리스트를 불러온다.(스위치에 해당하는 것만 리스트로)
     * @param callback
     */
    getFeederList: function (callback) {

        var getSwitchList = function(data){
            var list = [];
            for(var i = 0, leni = data.length; i < leni; i++){
                if(data[i]['fe_swgr_load_div'] == 'S'){
                    list.push(data[i]);
                }
            }
            return list;
        };

        if(this.dev) {
            $.ajax({
                url: 'doosan/data/feeder-list.json',
                dataType: 'json',
                success: function (data) {
                    callback(null, getSwitchList(data));
                },
                error: function (err) {
                    callback(err, null);
                }
            });
        } else {
            var data;
            try {
                data = parent.getFeederList();
                callback(null, getSwitchList(data));
            } catch (e) {
                callback(e, null);
            }
        }
    },

    /**
     * AssignedFeederList의 treedata를 만드는 함수
     */

    getFeederTreeData: function(data) {

        var prevItem;
        var lastLvMap = {};
        var treeData = [];

        if(data == null) {
            return treeData;
        }

        for (var i = 0, leni = data.length; i < leni; i++) {
            var parent;
            var enableDisplay = true;

            //LV 가 1이면 루트이다.
            if (data[i]['lv'] == 1) {
                parent = '#';
                lastLvMap[1] = data[i];
            }
            //prevItem 이 없다면 일단 루트로 등록하고, LV 맵에 자신을 등록
            else if (!prevItem) {
                parent = '#';
                lastLvMap[data[i]['lv']] = data[i];
            }
            else {
                //자신의 레벨이 마지막 아이템의 레벨보다 크다면
                if (prevItem['lv'] < data[i]['lv']) {
                    parent = prevItem['feeder_list_mgt_seq'];
                    lastLvMap[data[i]['lv']] = data[i];
                }
                //자신의 레벨이 마지막 아이템의 레벨보다 같거나 작다면
                else if (prevItem['lv'] >= data[i]['lv']) {
                    var parentLv = data[i]['lv'] - 1;
                    if (lastLvMap[parentLv]) {
                        parent = lastLvMap[parentLv]['feeder_list_mgt_seq'];
                        lastLvMap[data[i]['lv']] = data[i];
                    }
                    //자신의 전단계 레벨이 lastLvMap 에 없다면, 잘못된 데이터 형식임을 알린다.
                    else {
                        callback('어사인드 로드 ' + data[i]['kks_num'] + ' 의 상위 레벨 데이터가 누락되었습니다.')
                    }
                }
            }
            if (enableDisplay) {
                var item = {
                    id: data[i]['feeder_list_mgt_seq'],
                    text: data[i]['kks_num'],
                    parent: parent,
                    data: data[i],
                    a_attr: {},
                    type: data[i]['fe_swgr_load_div'] == 'L' ? 'load' : 'swgr'
                };
                treeData.push(item);
                prevItem = data[i];
            }
        }

        return treeData;
    },

    /**
     * 어사인된 피더 리스트 를 불러온다.
     * @param callback
     */
    getAssignedFeederList: function (callback) {
        if(this.dev) {
            $.ajax({
                url: 'doosan/data/feeder-list.json',
                dataType: 'json',
                success: function (data) {
                    var treeData = getFeederTreeData(data);
                    callback(null, treeData);
                },
                error: function (err) {
                    callback(err, null);
                }
            });
        } else {
            var data;
            try {
                data = parent.getFeederList();
                callback(null, this.getFeederTreeData(data));
            } catch (e) {
                callback(e, null);
            }
        }

    },

    /**
     * 트리에서 선택한 노드 삭제이후 해당 리스트를 다시 받아와서 리프레시한다.
     * @param callback
     */
    getUpdateTree: function (object, renderer, mode) {

        if (this.dev) {
            $.ajax({
                url: 'doosan/data/feeder-update-list.json',
                dataType: 'json',
                success: function (data) {
                    var treeData = this.getFeederTreeData(data);
                    object.settings.core.data = treeData;
                    object.refresh();
                },
                error: function (err) {
                    console.log(err);
                }
            });
        } else {
            var data;
            try {

                if(mode == renderer.Constants.MODE.FEEDER) {
                    var feederList = parent.getFeederList();
                    data = this.getFeederTreeData(feederList)
                } else if(mode == renderer.Constants.MODE.HIERARCHY) {
                    var feederSwgrList = parent.getFeederSWGRTree();
                    data = this.getHierarchyTreeData(feederSwgrList)
                }

                object.on("dblclick.jstree", function (event, data) {
                    //var node = $(event.target).closest("li");
                    //console.log(data);
                })
                    .on("select_node.jstree", function (evt, data) {
                        //console.log(data);
                    })
                    .on('dnd_start.vakata', function (e, data) {
                        //console.log(data);
                    });
                object.settings.core.data = data;
                object.refresh();

            } catch (e) {
                console.log('when refresh Tree Node, occur error');
            }
        }

    },

    /**
     * 피더 에디터의 Assigned(All)의 트리의 컨텍스트 메뉴의 unAssign 클릭 이벤트시 feeder_list_mgt_seq를 받아 지운다.
     */
    deleteFeeder: function (seq) {
        // resultData는 성공이면 status : 0, 에러시에는 status : 1, errorMessage : "string"
        var resultData = parent.deleteFeeder(seq);
        return resultData;

    },

    /* Hierarchy Editor DataController */

    /**
     * 하이어라키 에디터의 피더 리스트를 불러온다.
     * @param callback
     */
    getHierarchyFeederList: function (callback) {

        var getSwitchList = function(data){
            var list = [];
            if(data == null) {
                return list;
            }
            for(var i = 0, leni = data.length; i < leni; i++){
                if(data[i]['fe_swgr_load_div'] == 'S'){
                    list.push(data[i]);
                }
            }
            return list;
        };

        if(this.dev) {
            $.ajax({
                url: 'doosan/data/feeder-list.json',
                dataType: 'json',
                success: function (data) {
                    callback(null, getSwitchList(data));
                },
                error: function (err) {
                    callback(err, null);
                }
            });
        } else {
            var data;
            try {
                data = parent.getFeederSWGRList();
                callback(null, getSwitchList(data));
            } catch (e) {
                callback(e, null);
            }
        }
    },

    getHierarchyTreeData: function(data){

        var prevItem;
        var lastLvMap = {};
        var treeData = [];

        if(data == null) {
            return treeData;
        }

        for (var i = 0, leni = data.length; i < leni; i++) {
            var parent;
            var enableDisplay = true;

            //LV 가 1이면 루트이다.
            if (data[i]['lv'] == 1) {
                parent = '#';
                lastLvMap[1] = data[i];
            }
            //prevItem 이 없다면 일단 루트로 등록하고, LV 맵에 자신을 등록
            else if (!prevItem) {
                parent = '#';
                lastLvMap[data[i]['lv']] = data[i];
            }
            else {
                //자신의 레벨이 마지막 아이템의 레벨보다 크다면
                if (prevItem['lv'] < data[i]['lv']) {
                    parent = prevItem['hier_seq'];
                    lastLvMap[data[i]['lv']] = data[i];
                }
                //자신의 레벨이 마지막 아이템의 레벨보다 같거나 작다면
                else if (prevItem['lv'] >= data[i]['lv']) {
                    var parentLv = data[i]['lv'] - 1;
                    if (lastLvMap[parentLv]) {
                        parent = lastLvMap[parentLv]['hier_seq'];
                        lastLvMap[data[i]['lv']] = data[i];
                    }
                    //자신의 전단계 레벨이 lastLvMap 에 없다면, 잘못된 데이터 형식임을 알린다.
                    else {
                        callback('하이어라키 ' + data[i]['hier_seq'] + ' 의 상위 레벨 데이터가 누락되었습니다.')
                    }
                }
            }
            if (enableDisplay) {
                var item = {
                    id: data[i]['hier_seq'],
                    text: data[i]['nm'],
                    parent: parent,
                    data: data[i],
                    a_attr: {},
                    type: data[i]['lv'] == 1 ? 'bldg' : 'floor'
                };
                treeData.push(item);
                prevItem = data[i];
            }
        }

        return treeData;
    },

    /** Hierarchy tree list   */
    getHierarchyTreeList: function (callback) {

        if (this.dev) {
            $.ajax({
                url: 'doosan/data/hierarchy-list.json',
                dataType: 'json',
                success: function (data) {
                    callback(null, this.getHierarchyTreeData(data));
                },
                error: function (err) {
                    callback(err, null);
                }
            });
        } else {
            var data;
            try {
                data = parent.getFeederSWGRTree();
                callback(null, this.getHierarchyTreeData(data));
            } catch (e) {
                callback(e, null);
            }
        }
    },

    /** Route Editor*/
    getLocationReferenceList: function (callback) {

        if (this.dev) {
            $.ajax({
                url: 'doosan/data/location-ref.json',
                dataType: 'json',
                success: function (data) {
                    callback(null, data);
                },
                error: function (err) {
                    callback(err, null);
                }
            });
        } else {
            var data;
            try {
                data = parent.getLocationList();
                callback(null, data);
            } catch (e) {
                callback(e, null);
            }
        }

    },

    getRacewayReferenceList: function (callback) {

        if (this.dev) {
            $.ajax({
                url: 'doosan/data/raceway-ref.json',
                dataType: 'json',
                success: function (data) {
                    callback(null, data);
                },
                error: function (err) {
                    callback(err, null);
                }
            });
        } else {
            var data;
            try {
                data = parent.getRacewayList();
                callback(null, data);
            } catch (e) {
                callback(e, null);
            }
        }

    },
    getRouteReferenceList: function (callback) {

        if (this.dev) {
            $.ajax({
                url: 'doosan/data/route-ref.json',
                dataType: 'json',
                success: function (data) {
                    callback(null, data);
                },
                error: function (err) {
                    callback(err, null);
                }
            });
        } else {
            var data;
            try {
                data = parent.getRouteList();
                callback(null, data);
            } catch (e) {
                callback(e, null);
            }
        }
    },

    getBldgReferenceList: function (callback) {
        if (this.dev) {
            $.ajax({
                url: 'doosan/data/bldg-ref.json',
                dataType: 'json',
                success: function (data) {
                    callback(null, data);
                },
                error: function (err) {
                    callback(err, null);
                }
            });
        } else {
            var data;
            try {
                data = parent.getBLDGList();
                callback(null, data);
            } catch (e) {
                callback(e, null);
            }
        }
    },

    getCableReferenceList: function (callback) {
        if (this.dev) {
            $.ajax({
                url: 'doosan/data/cable-ref.json',
                dataType: 'json',
                success: function (data) {
                    callback(null, data);
                },
                error: function (err) {
                    callback(err, null);
                }
            });
        } else {
            var data;
            try {
                data = parent.getCableList();
                //data = [];
                callback(null, data);
            } catch (e) {
                callback(e, null);
            }
        }
    },

    /**
     * 하이어라키 에디터 세이브
     */
    saveHierarchy: function(controller) {
        var mode = controller.getCurrentMode();
        var renderer = controller.getRendererByMode(mode);
        var currentCanvas = renderer.getCanvas();
        var json = currentCanvas.toJSON();

        var sendData = [];


        var projectInfo = controller.projectData;
        var hierJSON  = projectInfo.gui_hier_json;
        if(hierJSON == null) {
            controller.setHierarchySaveMode(false);
        } else {
            controller.setHierarchySaveMode(true);
        }

        /**
         * 캔버스의 정보를 담는 json
         */
        var GUI_DATA = {};
        GUI_DATA['status'] = 'GUI';
        GUI_DATA['content'] = json;
        sendData.push(GUI_DATA);

        /**
         * canvas에 그려진 플로우 정보를 돌면서 child로 스위치 피더를 찾는다.
         */
        var shapeList = currentCanvas.getAllShapes();
        var hierarchyFeedersOutBoundaryFloor = [];
        if(!controller.getHierarchySaveMode()) {
            shapeList.forEach(function(element){

                /**
                 * 먼저 빌딩안에 그려지지 않는 하이어라키 피더가 존재하는지 체크를 한다.
                 */
                if(element.shape instanceof OG.HierarchyFeeder) {
                    var parentElement = currentCanvas.getParent(element);
                    if(parentElement) {
                        if( !(parentElement.shape instanceof OG.HierarchyFloor) ) {
                            hierarchyFeedersOutBoundaryFloor.push(element);
                        }
                    } else {
                        hierarchyFeedersOutBoundaryFloor.push(element);
                    }

                }

                if(element.shape instanceof OG.HierarchyFloor) {

                    var childShape = currentCanvas.getChilds(element);
                    childShape.forEach(function(child){
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
                                // 자기 자신이면 자신이 상위이기 때문에 pass
                                if(fromShapeData.feeder_list_mgt_seq != child.shape.data.feeder_list_mgt_seq) {
                                    jsonData['up_feeder_list_mgt_seq'] = fromShapeData.feeder_list_mgt_seq;
                                }
                            });
                        }

                        jsonData['status'] = 'N';
                        sendData.push(jsonData);

                    });
                }
            });

        } else {
            var feederHierarchyMgtShapeList = controller.feederHierarchyMgtShapeList;
            var updateFeederHierarchyList = controller.updateFeederHierarchyList;
            var deleteFeederHierarchyList = controller.deleteFeederHierarchyList;
            /**
             * 기존 정보는 그대로 올린다.
             */
            feederHierarchyMgtShapeList.forEach(function(fhList){
                sendData.push(fhList);
            });


            shapeList.forEach(function(element){
                /**
                 * 먼저 빌딩안에 그려지지 않는 하이어라키 피더가 존재하는지 체크를 한다.
                 */
                if(element.shape instanceof OG.HierarchyFeeder) {
                    var parentElement = currentCanvas.getParent(element);
                    if(parentElement) {
                        if( !(parentElement.shape instanceof OG.HierarchyFloor) ) {
                            hierarchyFeedersOutBoundaryFloor.push(element);
                        }
                    } else {
                        hierarchyFeedersOutBoundaryFloor.push(element);
                    }

                }

                if(element.shape instanceof OG.HierarchyFloor) {

                    var childShape = currentCanvas.getChilds(element);
                    /**
                     * 전체 그려진 정보에서 update리스트에서 조회를 해야한다.
                     * 그중에 기존에 그려진 정보가 아닌 새로운 녀석일 경우에만 sendData에 넣어야 한다.
                     */
                    childShape.forEach(function(child){
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
                                // 자기 자신이면 자신이 상위이기 때문에 pass
                                if(fromShapeData.feeder_list_mgt_seq != child.shape.data.feeder_list_mgt_seq) {
                                    jsonData['up_feeder_list_mgt_seq'] = fromShapeData.feeder_list_mgt_seq;
                                }
                            });
                        }

                        var isNew = false;

                        updateFeederHierarchyList.some(function(uhList){
                            if(child.shape.data.feeder_list_mgt_seq == uhList.feeder_list_mgt_seq) {
                                isNew = true;
                            }
                        })

                        if(isNew) {
                            jsonData['status'] = 'U';
                            sendData.push(jsonData);
                        }

                    });
                }
            });

            deleteFeederHierarchyList.forEach(function(dhList){
                var deleteJsonData = {};
                deleteJsonData['status'] = 'D';
                deleteJsonData['feeder_list_mgt_seq'] = dhList.feeder_list_mgt_seq;
                sendData.push(deleteJsonData);
            });

        }

        if(hierarchyFeedersOutBoundaryFloor.length > 0) {
            msgBox("피더의 위치는 플로어안에 놓여져야 합니다.");
            hierarchyFeedersOutBoundaryFloor.forEach(function(element){
                renderer.highLightHierarchyFeeder(element);
            })

            $.unblockUI();
            return;
        }

        console.log(sendData);
        var returnData = parent.updateHierarchy(sendData);
        /**
         * 저장 및 업데이트가 성공한다면
         * 관련 그리드, 트리를 새로 그린다.
         */
        if(returnData == '0') {
            controller.refreshGridAndTree(mode, renderer);
        }

        $.unblockUI();
        msgBox(renderer.MSGMessages.SAVEMSG);
        setTimeout(msgBoxClose, 1000);
    },

    /**
     * validation 정보를 만든다.
     */
    makeCheckLSValidatorData: function(renderer) {
        var currentCanvas = renderer.getCanvas();
        var json = currentCanvas.toJSON();
        var sendData = [];

        var objectSeq;
        var objectFeederSeq = '';
        var object = renderer.editingObject;
        if(object['shapeType'] == renderer.Constants.TYPE.MODIFY_FEEDER) {
            //기존에 있던 피더
            objectSeq = object['swgr_list_seq'];
            objectFeederSeq = object['feeder_list_mgt_seq'];
        } else {
            objectSeq = object['swgr_list_seq'];
        }

        var shapeList = currentCanvas.getAllShapes();
        for(var i=0; i<shapeList.length; i++) {
            var selectShapeType = $(shapeList[i]).attr('_shape');
            if(selectShapeType == 'GEOM') {
                var selectShapeId = $(shapeList[i]).attr('_shape_id');
                var selectElement = currentCanvas.getElementsByShapeId(selectShapeId);
                var selectItemData = currentCanvas.getCustomData(shapeList[i]);
                var jsonData = {};
                var selectType;
                if(selectItemData.hasOwnProperty('fe_swgr_load_div')) {
                    selectType = selectItemData.fe_swgr_load_div;
                } else {
                    selectType = 'L';
                }

                jsonData['type'] = selectType;
                // In Case Of selectItemData.fe_swgr_load_div is 'S', check Mother Switch or Child
                if(selectType == 'S') {
                    jsonData['seq'] = selectItemData.swgr_list_seq;
                    var prevShapes = currentCanvas.getPrevShapes(selectElement);
                    var nextShapes = currentCanvas.getNextShapes(selectElement);

                    // 이전 shapes의 정보를 통해 해당 S가 parent인지 child인지 체크
                    if( (prevShapes.length == 0 && nextShapes.length == 0) || prevShapes.length == 0  ) {
                        jsonData['root'] = 'Y';
                        jsonData['up_seq'] = '';
                        jsonData['feeder_seq'] = objectFeederSeq;
                    } else {
                        jsonData['root'] = 'N';
                        jsonData['up_seq'] = objectSeq;
                        jsonData['feeder_seq'] = objectFeederSeq;
                    }

                } else {
                    jsonData['seq'] = selectItemData.load_list_seq;
                    jsonData['up_seq'] = objectSeq;
                    jsonData['feeder_seq'] = objectFeederSeq;
                }
                sendData.push(jsonData);
            }

        }

        return sendData;
    },

    /**
     * 피더 에디터 세이브
     */
    saveFeederGui: function(controller) {

        var mode = controller.getCurrentMode();
        var renderer = controller.getRendererByMode(mode);
        var currentCanvas = renderer.getCanvas();
        var json = currentCanvas.toJSON();
        var object = renderer.editingObject;
        if(object === undefined) {
            $.unblockUI();
            return;
        }
        var sendData = [];
        var objectSeq;
        var objectFeederSeq = '';
        if(object['shapeType'] == renderer.Constants.TYPE.MODIFY_FEEDER) {
            //기존에 있던 피더
            objectSeq = object['swgr_list_seq'];
            objectFeederSeq = object['feeder_list_mgt_seq'];
            controller.setFeederSaveMode(true);
        } else {
            controller.setFeederSaveMode(false);
            objectSeq = object['swgr_list_seq'];
        }

        /**
         * GUI json data making and sendData setting
         */
        var GUI_DATA = {};
        GUI_DATA['status'] = 'GUI';
        GUI_DATA['seq'] = objectSeq;
        GUI_DATA['feeder_seq'] = objectFeederSeq;
        GUI_DATA['content'] = json;
        sendData.push(GUI_DATA);
        /**
         * each object data Json making and sendDataSetting
         */
        /**
         * 신규 저장이라면
         */
        var shapeList = currentCanvas.getAllShapes();
        if(!controller.getFeederSaveMode()) {
            // find allShpaes, and check Objejct 'GEOM' on shpae
            for(var i=0; i<shapeList.length; i++) {
                var selectShapeType = $(shapeList[i]).attr('_shape');
                if(selectShapeType == 'GEOM') {
                    var selectShapeId = $(shapeList[i]).attr('_shape_id');
                    var selectElement = currentCanvas.getElementsByShapeId(selectShapeId);
                    var selectItemData = currentCanvas.getCustomData(shapeList[i]);
                    var jsonData = {};
                    jsonData['status'] = 'N';
                    var selectType;
                    if(selectItemData.hasOwnProperty('fe_swgr_load_div')) {
                        selectType = selectItemData.fe_swgr_load_div;
                    } else {
                        selectType = 'L';
                    }

                    jsonData['type'] = selectType;
                    // In Case Of selectItemData.fe_swgr_load_div is 'S', check Mother Switch or Child
                    if(selectType == 'S') {
                        jsonData['seq'] = selectItemData.swgr_list_seq;
                        var prevShapes = currentCanvas.getPrevShapes(selectElement);
                        var nextShapes = currentCanvas.getNextShapes(selectElement);

                        // 이전 shapes의 정보를 통해 해당 S가 parent인지 child인지 체크
                        if( (prevShapes.length == 0 && nextShapes.length == 0) || prevShapes.length == 0  ) {
                            jsonData['root'] = 'Y';
                            jsonData['up_seq'] = '';
                            jsonData['feeder_seq'] = objectFeederSeq;
                        } else {
                            jsonData['root'] = 'N';
                            jsonData['up_seq'] = objectSeq;
                            jsonData['feeder_seq'] = objectFeederSeq;
                        }

                    } else {
                        jsonData['seq'] = selectItemData.load_list_seq;
                        jsonData['up_seq'] = objectSeq;
                        jsonData['feeder_seq'] = objectFeederSeq;
                    }
                    sendData.push(jsonData);
                }

            }
        } else {

            // 기존 데이터를 가져온 경우
            /**
             * 1. canvas에 도형을 그린 후 각 도형들의 jsonData를 배열로 가진다. (오리지널 데이터로 차후 삭제/업데이트시 비교하기 위한 데이터)
             *
             * 2. 새로운 스위치 및 로드를 드랍으로 그린 도형들은 update해야하는 정보들로
             *  update list에 넣는다.
             *
             * 3. 지웠을 경우 새로 그린 도형에서 지워진 것인지 또는 기존의 것을 지운 것인지 파악해야 한다.
             *  - 새로 그린 도형의 경우 지우면 update list에서 제외해야한다.
             *  - 기존의 경우에는 delete list로 넣어야 한다.
             *
             * 4. 이 정보로 최종적으로 update된 리스트와 삭제된 리스트로 보낸다.
             *
             * 5. 트리에서 넘어온 경우와 그리드에서 넘어온 경우는 나눠야 한다.
             *  - object객체에서 onDrop 키가 있는지 확인하고 있다면 해당 onDrop의 값이 feederGrid인지 확인한다.
             *  - 이 경우에는 status를 U로 넣어줘야 한다.
             */

            /** 기존 정보도 넘겨준다. 이 때 status:U **/
            var feederMgtShapeList = controller.feederMgtShapeList;

            feederMgtShapeList.forEach(function(item, idx){
                var jsonData = {};
                jsonData['status'] = 'U';
                jsonData['up_seq'] = objectSeq;


                var itemType;
                if(item.hasOwnProperty('fe_swgr_load_div')) {
                    itemType = item.fe_swgr_load_div;
                } else {
                    itemType = 'L';
                }

                jsonData['type'] = itemType;

                if(itemType == 'S') {
                    if(idx == 0) {
                        jsonData['root'] = 'Y';
                    } else {
                        jsonData['root'] = 'N';
                    }
                    jsonData['seq'] = item.swgr_list_seq;

                } else {
                    jsonData['seq'] = item.load_list_seq;

                }

                if(item.hasOwnProperty('feeder_list_mgt_seq')) {
                    jsonData['feeder_seq'] = item.feeder_list_mgt_seq;
                }

                sendData.push(jsonData);
            });

            var updateFeederList = controller.updateFeederList;

            updateFeederList.forEach(function(item){
                var jsonData = {};
                jsonData['status'] = 'N';
                jsonData['up_seq'] = objectSeq;

                var itemType;
                if(item.hasOwnProperty('fe_swgr_load_div')) {
                    itemType = item.fe_swgr_load_div;
                } else {
                    itemType = 'L';
                }

                jsonData['type'] = itemType;

                if(itemType == 'S') {
                    jsonData['root'] = 'N';
                    jsonData['seq'] = item.swgr_list_seq;

                    feederMgtShapeList.some(function(itemData){
                        if(item.swgr_list_seq == itemData.swgr_list_seq) {
                            if(itemData.hasOwnProperty('feeder_list_mgt_seq')) {
                                jsonData['feeder_seq'] = itemData.feeder_list_mgt_seq;
                            }
                        }
                    });

                } else {
                    jsonData['seq'] = item.load_list_seq;

                    feederMgtShapeList.some(function(itemData){
                        if(item.load_list_seq == itemData.load_list_seq) {
                            if(itemData.hasOwnProperty('feeder_list_mgt_seq')) {
                                jsonData['feeder_seq'] = itemData.feeder_list_mgt_seq;
                            }
                        }
                    });

                }

                sendData.push(jsonData);

            });

            var deleteFeederList = controller.deleteFeederList;
            deleteFeederList.forEach(function(item, idx){
                var jsonData = {};
                jsonData['status'] = 'D';
                jsonData['up_seq'] = objectSeq;

                var itemType;
                if(item.hasOwnProperty('fe_swgr_load_div')) {
                    itemType = item.fe_swgr_load_div;
                } else {
                    itemType = 'L';
                }

                jsonData['type'] = itemType;

                if(itemType == 'S') {
                    if(idx == 0) {
                        jsonData['root'] = 'Y';
                    } else {
                        jsonData['root'] = 'N';
                    }
                    jsonData['seq'] = item.swgr_list_seq;

                    feederMgtShapeList.some(function(itemData){
                        if(item.swgr_list_seq == itemData.swgr_list_seq) {
                            if(itemData.hasOwnProperty('feeder_list_mgt_seq')) {
                                jsonData['feeder_seq'] = itemData.feeder_list_mgt_seq;
                            }
                        }
                    });

                } else {
                    jsonData['seq'] = item.load_list_seq;

                    feederMgtShapeList.some(function(itemData){
                        if(item.load_list_seq == itemData.load_list_seq) {
                            if(itemData.hasOwnProperty('feeder_list_mgt_seq')) {
                                jsonData['feeder_seq'] = itemData.feeder_list_mgt_seq;
                            }
                        }
                    });

                }

                sendData.push(jsonData);

            });

        }

        console.log(sendData);
        var returnData = parent.updateFeeder(sendData);
        /**
         * 저장 및 업데이트가 성공한다면
         * 관련 그리드, 트리를 새로 그린다.
         */
        if(returnData == '0') {
            controller.refreshGridAndTree(mode, renderer);
        }

        $.unblockUI();
        msgBox(renderer.MSGMessages.SAVEMSG);
        setTimeout(msgBoxClose, 1000);
    },

    /**
     * Route 저장 함수
     */

    saveRoute: function(controller) {
        console.log(parent.getLocationList());
        var mode = controller.getCurrentMode();
        var renderer = controller.getRendererByMode(mode);
        var currentCanvas = renderer.getCanvas();
        var json = currentCanvas.toJSON();

        var projectInfo = controller.projectData;
        var hierJSON  = projectInfo.gui_route_json;
        if(hierJSON == null) {
            controller.setRouteSaveMode(false);
        } else {
            controller.setRouteSaveMode(true);
        }
        var sendData = [];

        /**
         * 캔버스의 정보를 담는 json
         */
        var GUI_DATA = {};
        GUI_DATA['status'] = 'GUI';
        GUI_DATA['content'] = json;
        sendData.push(GUI_DATA);

        /**
         * canvas에 그려진 플로우 정보를 돌면서 child로 location를 찾는다.
         */
        var shapeList = currentCanvas.getAllShapes();
        var locationOutBoundaryBldg = [];
        shapeList.forEach(function(element){
            var jsonData = {};
            jsonData['status'] = 'N';
            /**
             * 먼저 빌딩안에 그려지지 않는 하이어라키 피더가 존재하는지 체크를 한다.
             */
            if(element.shape instanceof OG.Location) {
                var parentElement = currentCanvas.getParent(element);
                if(parentElement) {
                    if( !(parentElement.shape instanceof OG.BLDG) ) {
                        locationOutBoundaryBldg.push(element);
                    }
                } else {
                    locationOutBoundaryBldg.push(element);
                }

            }

            /**
             * point 정보
             */
            if(element.shape instanceof OG.Location) {
                jsonData['type'] = 'Point';
                var parentElement = currentCanvas.getParent(element);
                jsonData['loc_ref_name_to'] = element.shape.data.loc_ref_name_to;

                /**
                 * point가 포함된 location의 정보를 같이 준다.
                 */
                jsonData['loc_ref_seq'] = parentElement.shape.data.loc_ref_seq;
                jsonData['loc_ref_temp'] = parentElement.shape.data.loc_ref_temp;
                jsonData['loc_ref_rem'] = parentElement.shape.data.loc_ref_rem;
                jsonData['loc_ref_length'] = parentElement.shape.data.loc_ref_length;

                sendData.push(jsonData);
            }
            /**
             * raceway 정보
             */
            else if(element.shape instanceof OG.RacewayShape) {
                jsonData['type'] = 'Cable';
                jsonData['race_ref_from'] 	= element.shape.data.race_ref_from;
                jsonData['race_ref_to'] 	= element.shape.data.race_ref_to;
                jsonData['race_ref_len'] 	= element.shape.data.race_ref_len;
                jsonData['race_ref_temp'] 	= element.shape.data.race_ref_temp;
                jsonData['race_ref_method'] = element.shape.data.race_ref_method;
                jsonData['race_ref_rem'] 	= element.shape.data.race_ref_rem;
                sendData.push(jsonData);
            }
            /**
             * location 정보
             */
            else if(element.shape instanceof OG.BLDG) {
                jsonData['type'] = 'Location';
                jsonData['loc_ref_seq'] 	= element.shape.data.loc_ref_seq;
                jsonData['loc_ref_name'] 	= element.shape.data.loc_ref_name;
                jsonData['loc_ref_temp'] 	= element.shape.data.loc_ref_temp;
                jsonData['loc_ref_rem'] 	= element.shape.data.loc_ref_rem;
                jsonData['loc_ref_length'] 	= element.shape.data.loc_ref_length;
                sendData.push(jsonData);
            }
        });

        if(locationOutBoundaryBldg.length > 0) {
            msgBox("포인트의 위치는 로케이션안에 놓여져야 합니다.");
            //locationOutBoundaryBldg.forEach(function(element){
            //	renderer.highLightHierarchyFeeder(element);
            //})
            $.unblockUI();
            return;
        }

        console.log(sendData);

        var returnData = parent.updateRoute(sendData);
        /**
         * 저장 및 업데이트가 성공한다면
         * 관련 그리드, 트리를 새로 그린다.
         */
        if(returnData == '0') {
            controller.refreshGridAndTree(mode, renderer);
        }

        $.unblockUI();
        msgBox(renderer.MSGMessages.SAVEMSG);
        setTimeout(msgBoxClose, 1000);
    },

    /**
     * 저장 버튼
     */
    saveGui: function(controller) {

        var me = this;
        var mode = controller.getCurrentMode();
        var renderer = controller.getRendererByMode(mode);
        // Feeder일때
        if(mode == renderer.Constants.MODE.FEEDER) {
            me.saveFeederGui(controller);
        } else if(mode == renderer.Constants.MODE.HIERARCHY) {
            me.saveHierarchy(controller);
        } else if(mode == renderer.Constants.MODE.ROUTE) {
            me.saveRoute(controller);
        }

    }
}
;
DataController.prototype.constructor = DataController;