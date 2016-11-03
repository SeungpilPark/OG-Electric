/**
 * Created by Seungpil, Park on 2016. 9. 6..
 */
var DataController = function () {

};
DataController.prototype = {
    getSwgrSelectBoxList: function (callback) {
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
    },
    getSwgrList: function (callback) {
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
    },
    getUnAssignedLoadList: function (callback) {
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
    },
    getFeederList: function (callback) {
        $.ajax({
            url: 'doosan/data/feeder-list.json',
            dataType: 'json',
            success: function (data) {
                callback(null, data);
            },
            error: function (err) {
                callback(err, null);
            }
        });
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
    getRacewayReferenceList: function(callback){
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
    getRouteReferenceList: function(callback){
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
    getBldgReferenceList: function(callback){
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
    getAssignedLoadList: function (callback) {
        $.ajax({
            url: 'doosan/data/assinged-load-list.json',
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
                            parent = prevItem['FEEDER_LIST_MGT_SEQ'];
                            lastLvMap[data[i]['LV']] = data[i];
                        }
                        //자신의 레벨이 마지막 아이템의 레벨보다 같거나 작다면
                        else if (prevItem['LV'] >= data[i]['LV']) {
                            var parentLv = data[i]['LV'] - 1;
                            if (lastLvMap[parentLv]) {
                                parent = lastLvMap[parentLv]['FEEDER_LIST_MGT_SEQ'];
                                lastLvMap[data[i]['LV']] = data[i];
                            }
                            //자신의 전단계 레벨이 lastLvMap 에 없다면, 잘못된 데이터 형식임을 알린다.
                            else {
                                callback('어사인드 로드 ' + data[i]['KKS_NUM'] + ' 의 상위 레벨 데이터가 누락되었습니다.')
                            }
                        }
                    }
                    if (enableDisplay) {
                        var item = {
                            id: data[i]['FEEDER_LIST_MGT_SEQ'],
                            text: data[i]['KKS_NUM'],
                            parent: parent,
                            li_attr: data[i],
                            a_attr: {},
                            type: data[i]['FE_SWGR_LOAD_DIV'] == 'L' ? 'load' : 'swgr'
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
                            li_attr: data[i],
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
}
;
DataController.prototype.constructor = DataController;