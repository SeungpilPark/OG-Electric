/**
 * Created by Seungpil, Park on 2016. 9. 6..
 */
var DataController = function () {
    this.dev = true;
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
                callback(null, data[0]);
            } catch (e) {
                callback(e, null);
            }
        }
    },
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
        if (this.dev) {
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
        if (this.dev) {
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
        if (this.dev) {
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
     * 피더 에디터의 Assigned(All)의 트리의 컨텍스트 메뉴의 unAssign 클릭 이벤트시 feeder_list_mgt_seq를 받아 지운다.
     */
    deleteFeeder: function (seq) {
        // resultData는 성공이면 status : 0, 에러시에는 status : 1, errorMessage : "string"
        //var resultData = parent.deleteFeeder(seq);
        //return resultData;

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
        if (this.dev) {
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
    getLocationReferenceList: function (callback) {
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
    },
    getRacewayReferenceList: function (callback) {
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
    },
    getRouteReferenceList: function (callback) {
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
    },
    getBldgReferenceList: function (callback) {
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
    },

    /**
     * AssignedTreeData를 만드는 함수
     * @param data
     */
    getAssignedTreeData: function(data) {

        var prevItem;
        var lastLvMap = {};
        var treeData = [];
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
     * 노드로부터 삭제시 해당 정보를 서버로부터 가져와서 다시 리로드한다.
     * 넘겨받는 object는 tree객체
     * @param object
     */
    getUpdateAssignedFeederList: function (object) {

        var me = this;
        if (me.dev) {
            $.ajax({
                url: 'doosan/data/feeder-update-list.json',
                dataType: 'json',
                success: function (data) {
                    var treeData = me.getAssignedTreeData(data);
                    object.settings.core.data = treeData;
                    object.refresh();
                },
                error: function (err) {
                }
            });
        } else {
            var data;
            try {
                data = parent.getFeederList();
                object.settings.core.data = me.getAssignedTreeData(data);
                object.refresh();
            } catch (e) {
                console.log('when refresh Tree Node, occur error');
            }
        }

    },
    /**
     * 어사인된 피더 리스트 를 불러온다.
     * @param callback
     */
    getAssignedFeederList: function (callback) {
        var me = this;
        if (me.dev) {
            $.ajax({
                url: 'doosan/data/feeder-list.json',
                dataType: 'json',
                success: function (data) {
                    var treeData = me.getAssignedTreeData(data);
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
                callback(null, me.getAssignedTreeData(data));
            } catch (e) {
                callback(e, null);
            }
        }

    },

    getHierarchyTreeList: function (callback) {
        $.ajax({
            url: 'doosan/data/hierarchy-list.json',
            dataType: 'json',
            success: function (data) {
                var prevItem;
                var lastLvMap = {};
                var treeData = [];
                for (var i = 0, leni = data.length; i < leni; i++) {
                    var parent;
                    var enableDisplay = true;

                    //LV 가 1이면 루트이다.
                    if (data[i]['LV'] == 1) {
                        parent = '#';
                        lastLvMap[1] = data[i];
                    }
                    //prevItem 이 없다면 일단 루트로 등록하고, LV 맵에 자신을 등록
                    else if (!prevItem) {
                        parent = '#';
                        lastLvMap[data[i]['LV']] = data[i];
                    }
                    else {
                        //자신의 레벨이 마지막 아이템의 레벨보다 크다면
                        if (prevItem['LV'] < data[i]['LV']) {
                            parent = prevItem['HIER_SEQ'];
                            lastLvMap[data[i]['LV']] = data[i];
                        }
                        //자신의 레벨이 마지막 아이템의 레벨보다 같거나 작다면
                        else if (prevItem['LV'] >= data[i]['LV']) {
                            var parentLv = data[i]['LV'] - 1;
                            if (lastLvMap[parentLv]) {
                                parent = lastLvMap[parentLv]['HIER_SEQ'];
                                lastLvMap[data[i]['LV']] = data[i];
                            }
                            //자신의 전단계 레벨이 lastLvMap 에 없다면, 잘못된 데이터 형식임을 알린다.
                            else {
                                callback('하이어라키 ' + data[i]['HIER_SEQ'] + ' 의 상위 레벨 데이터가 누락되었습니다.')
                            }
                        }
                    }
                    if (enableDisplay) {
                        var item = {
                            id: data[i]['HIER_SEQ'],
                            text: data[i]['NM'],
                            parent: parent,
                            data: data[i],
                            a_attr: {},
                            type: data[i]['LV'] == 1 ? 'bldg' : 'floor'
                        };
                        treeData.push(item);
                        prevItem = data[i];
                    }
                }
                callback(null, treeData);
            },
            error: function (err) {
                callback(err, null);
            }
        });
    },

    saveFeederGui: function(controller){

        var mode = controller.getCurrentMode();
        var renderer = controller.getRendererByMode(mode);
        //console.log(renderer.getModeSet());
        var currentCanvas = renderer.getCanvas();
        var json = currentCanvas.toJSON();
        var object = renderer.editingObject;
        if(object === undefined) {
            return;
        }

        if(mode == renderer.Constants.MODE.FEEDER) {
            var sendData = [];
            var objectSeq = object['swgr_list_seq'];
            /**
             * GUI json data making and sendData setting
             */
            var GUI_DATA = {};
            GUI_DATA['status'] = 'GUI';
            GUI_DATA['seq'] = object['swgr_list_seq'];
            GUI_DATA['content'] = json;
            sendData.push(GUI_DATA);

            /**
             * each object data Json making and sendDataSetting
             */

            var shapeList = currentCanvas.getAllShapes();
            // find allShpaes, and check Objejct 'GEOM' on shpae
            for (var i = 0; i < shapeList.length; i++) {
                var selectShapeType = $(shapeList[i]).attr('_shape');
                if (selectShapeType == 'GEOM') {
                    var selectShapeId = $(shapeList[i]).attr('_shape_id');
                    var selectElement = currentCanvas.getElementsByShapeId(selectShapeId);
                    var selectItemData = currentCanvas.getCustomData(shapeList[i]);
                    console.log(selectItemData);
                    var jsonData = {};
                    jsonData['status'] = 'N';

                    var selectType = selectItemData.fe_swgr_load_div;
                    jsonData['type'] = selectType;
                    // In Case Of selectItemData.fe_swgr_load_div is 'S', check Mother Switch or Child
                    if (selectType == 'S') {
                        jsonData['seq'] = selectItemData.swgr_list_seq;

                        var prevShapes = currentCanvas.getPrevShapes(selectElement);
                        var nextShapes = currentCanvas.getNextShapes(selectElement);

                        // 이전 shapes의 정보를 통해 해당 S가 parent인지 child인지 체크
                        if ((prevShapes.length == 0 && nextShapes.length == 0) || prevShapes.length == 0) {
                            jsonData['root'] = 'Y';
                        } else {
                            jsonData['root'] = 'N';
                        }

                    } else {
                        jsonData['seq'] = selectItemData.load_list_seq;
                    }
                    sendData.push(jsonData);
                }

            }

            //renderer.setModeSet('WORKED');
            console.log(sendData);
        }
    }
}
;
DataController.prototype.constructor = DataController;