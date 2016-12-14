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
     * 어사인된 피더 리스트 를 불러온다.
     * @param callback
     */
    getAssignedFeederList: function (callback) {
        $.ajax({
            url: 'doosan/data/feeder-list.json',
            dataType: 'json',
            success: function (data) {
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
                callback(null, treeData);
            },
            error: function (err) {
                callback(err, null);
            }
        });
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
    saveFeederGui: function(swgrId, ogJson){

    }
}
;
DataController.prototype.constructor = DataController;