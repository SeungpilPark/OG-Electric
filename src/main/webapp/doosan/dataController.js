/**
 * Created by Seungpil, Park on 2016. 9. 6..
 */
var DataController = function () {
    this.dev = true;
};
DataController.prototype = {
	/**
	 * ?��로젝?�� ?��?��?���? 불러?��?��.
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
     * ?��?���? ???��?�� 박스?�� ?��?��?�� 불러?��?��.
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
	        	data = [];
	            callback(null, data);
	        }
	    }
    },
    
    /**
     * ?��?��?���? ?��?? ?��?���? 리스?���? 불러?��?��.
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
	        	data = [];
	            callback(null, data);
	        }
        }
    },
    
    /**
     * ?��?��?�� ?��?���? 리스?���? 불러?��?��.
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
	        	data = [];
	            callback(null, data);
	        }
        }
    },
    
    /**
     * ?��?��?���? ?��?? 로드 리스?���? 불러?��?��.
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
	        	data = [];
	            callback(null, data);
	        }
        }
    },
    
    /**
     * ?��?��?�� 로드 리스?���? 불러?��?��.
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
	        	data = [];
	            callback(null, data);
	        }
        }
    },
    
    /**
     * ?��?�� 리스?���? 불러?��?��.(?��?��치에 ?��?��?��?�� 것만 리스?���?)
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
	        	data = [];
	            callback(null, data);
	        }
        }
    },
    
    /**
     * AssignedFeederList?�� treedata�? 만드?�� ?��?��
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
	
	        //LV �? 1?���? 루트?��?��.
	        if (data[i]['lv'] == 1) {
	            parent = '#';
	            lastLvMap[1] = data[i];
	        }
	        //prevItem ?�� ?��?���? ?��?�� 루트�? ?��록하�?, LV 맵에 ?��?��?�� ?���?
	        else if (!prevItem) {
	            parent = '#';
	            lastLvMap[data[i]['lv']] = data[i];
	        }
	        else {
	            //?��?��?�� ?��벨이 마�?�? ?��?��?��?�� ?��벨보?�� ?��?���?
	            if (prevItem['lv'] < data[i]['lv']) {
	                parent = prevItem['feeder_list_mgt_seq'];
	                lastLvMap[data[i]['lv']] = data[i];
	            }
	            //?��?��?�� ?��벨이 마�?�? ?��?��?��?�� ?��벨보?�� 같거?�� ?��?���?
	            else if (prevItem['lv'] >= data[i]['lv']) {
	                var parentLv = data[i]['lv'] - 1;
	                if (lastLvMap[parentLv]) {
	                    parent = lastLvMap[parentLv]['feeder_list_mgt_seq'];
	                    lastLvMap[data[i]['lv']] = data[i];
	                }
	                //?��?��?�� ?��?���? ?��벨이 lastLvMap ?�� ?��?���?, ?��못된 ?��?��?�� ?��?��?��?�� ?��린다.
	                else {
	                    callback('?��?��?��?�� 로드 ' + data[i]['kks_num'] + ' ?�� ?��?�� ?���? ?��?��?���? ?��?��?��?��?��?��?��.')
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
     * ?��?��?��?�� ?��?�� 리스?�� �? 불러?��?��.
     * @param callback
     */
    getAssignedFeederList: function (callback) {
    	var me =  this;
        if(this.dev) {
	    	$.ajax({
	            url: 'doosan/data/feeder-list.json',
	            dataType: 'json',
	            success: function (data) {
	            	var treeData = me.getFeederTreeData(data);
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
                callback(null, me.getFeederTreeData(data));
            } catch (e) {
            	data = [];
	            callback(null, data);
            }
        }
    	
    },
    
    /**
     * ?��리에?�� ?��?��?�� ?��?�� ?��?��?��?�� ?��?�� 리스?���? ?��?�� 받아???�� 리프?��?��?��?��.
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
            	
            	$(object).on("dblclick.jstree", function (event, data) {
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
     * ?��?�� ?��?��?��?�� Assigned(All)?�� ?��리의 컨텍?��?�� 메뉴?�� unAssign ?���? ?��벤트?�� feeder_list_mgt_seq�? 받아 �??��?��.
     */
    deleteFeeder: function (seq) {
    	// resultData?�� ?��공이�? status : 0, ?��?��?��?��?�� status : 1, errorMessage : "string"
    	var resultData = parent.deleteFeeder(seq);
    	return resultData;
    	
    },
    
    /* Hierarchy Editor DataController */
    
    /**
     * ?��?��?��?��?�� ?��?��?��?�� ?��?�� 리스?���? 불러?��?��.
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
	        	data = [];
	            callback(null, data);
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

           //LV �? 1?���? 루트?��?��.
            if (data[i]['lv'] == 1) {
            	parent = '#';
                lastLvMap[1] = data[i];
            }
            //prevItem ?�� ?��?���? ?��?�� 루트�? ?��록하�?, LV 맵에 ?��?��?�� ?���?
            else if (!prevItem) {
            	parent = '#';
            	lastLvMap[data[i]['lv']] = data[i];
            }
            else {
               //?��?��?�� ?��벨이 마�?�? ?��?��?��?�� ?��벨보?�� ?��?���?
            	if (prevItem['lv'] < data[i]['lv']) {
            		parent = prevItem['hier_seq'];
            		lastLvMap[data[i]['lv']] = data[i];
            	}
            	//?��?��?�� ?��벨이 마�?�? ?��?��?��?�� ?��벨보?�� 같거?�� ?��?���?
            	else if (prevItem['lv'] >= data[i]['lv']) {
            		var parentLv = data[i]['lv'] - 1;
            		if (lastLvMap[parentLv]) {
            			parent = lastLvMap[parentLv]['hier_seq'];
                        lastLvMap[data[i]['lv']] = data[i];
                    }
            		//?��?��?�� ?��?���? ?��벨이 lastLvMap ?�� ?��?���?, ?��못된 ?��?��?�� ?��?��?��?�� ?��린다.
            		else {
            			callback('?��?��?��?��?�� ' + data[i]['hier_seq'] + ' ?�� ?��?�� ?���? ?��?��?���? ?��?��?��?��?��?��?��.')
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
    	var me = this;
    	if (this.dev) {
    		$.ajax({
               url: 'doosan/data/hierarchy-list.json',
               dataType: 'json',
               success: function (data) {
                   callback(null, me.getHierarchyTreeData(data));
               },
               error: function (err) {
                   callback(err, null);
               }
    		});
    	} else {
    		var data;
    		try {
    			data = parent.getFeederSWGRTree();
    			callback(null, me.getHierarchyTreeData(data));
    		} catch (e) {
    			data = [];
	            callback(null, data);
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
            	data = [];
	            callback(null, data);
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
        	   data = [];
	           callback(null, data);
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
        	   data = [];
	           callback(null, data);
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
        	   data = [];
	           callback(null, data);
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
           	   	callback(null, data);
    		} catch (e) {
    			data = [];
 	            callback(null, data);
    		}
    	}
    },
    
    /**
     * ?��?��?��?��?�� ?��?��?�� ?��?���?
     */
    saveHierarchy: function(controller) {
    	var mode = controller.getCurrentMode();
        var renderer = controller.getRendererByMode(mode);
        var currentCanvas = renderer.getCanvas();
        var json = currentCanvas.toJSON();

        var sendData = [];

        
        var projectInfo = controller.projectData;
    	var hierJSON  = projectInfo.gui_hier_json;
    	if(hierJSON == null ||  hierJSON == '') {
    		controller.setHierarchySaveMode(false);
    	} else {
    		controller.setHierarchySaveMode(true);
    	}
        
        /**
         * 캔버?��?�� ?��보�?? ?��?�� json 
         */
        var GUI_DATA = {};
        GUI_DATA['status'] = 'GUI';
        GUI_DATA['content'] = json;
        sendData.push(GUI_DATA);
        
        /**
         * canvas?�� 그려�? ?��로우 ?��보�?? ?��면서 child�? ?��?���? ?��?���? 찾는?��.
         */
        var shapeList = currentCanvas.getAllShapes();
        var hierarchyFeedersOutBoundaryFloor = [];
        if(!controller.getHierarchySaveMode()) {
	        shapeList.forEach(function(element){
	        	
	        	/**
	             * 먼�? 빌딩?��?�� 그려�?�? ?��?�� ?��?��?��?��?�� ?��?���? 존재?��?���? 체크�? ?��?��.
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
	        			 * prevEdges�? ?��?��?�� 것�? ?��?�� ?��?���? ?��?��?�� �?.
	        			 * ?��?���? ?��?��?�� ?��?��?���? ?��문에 
	        			 */
	        			var prevEdges = currentCanvas.getPrevEdges(child);
	        			var nextEdges = currentCanvas.getNextEdges(child);
	        			if(prevEdges.length > 0) {
	        				prevEdges.forEach(function(edge){
	        					var edge = currentCanvas.getRelatedElementsFromEdge(edge);
	        					var fromShapeData = edge.from.shape.data;
	        					// ?���? ?��?��?���? ?��?��?�� ?��?��?���? ?��문에 pass
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
        	 * 기존 ?��보는 그�?�? ?��린다.
        	 */
        	feederHierarchyMgtShapeList.forEach(function(fhList){
        		sendData.push(fhList);
        	});
        	
        	
        	shapeList.forEach(function(element){
	        	/**
	             * 먼�? 빌딩?��?�� 그려�?�? ?��?�� ?��?��?��?��?�� ?��?���? 존재?��?���? 체크�? ?��?��.
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
	        		 * ?���? 그려�? ?��보에?�� update리스?��?��?�� 조회�? ?��?��?��?��.
	        		 * 그중?�� 기존?�� 그려�? ?��보�? ?��?�� ?��로운 ???��?�� 경우?���? sendData?�� ?��?��?�� ?��?��.
	        		 */
	        		childShape.forEach(function(child){
	        			var jsonData = {};
	
	        			jsonData['feeder_list_mgt_seq'] = child.shape.data.feeder_list_mgt_seq;
	        			jsonData['hier_seq'] = element.shape.data.hier_seq; 
	        			jsonData['up_hier_seq'] = element.shape.data.up_hier_seq;
	        			
	        			/**
	        			 * prevEdges�? ?��?��?�� 것�? ?��?�� ?��?���? ?��?��?�� �?.
	        			 * ?��?���? ?��?��?�� ?��?��?���? ?��문에 
	        			 */
	        			var prevEdges = currentCanvas.getPrevEdges(child);
	        			var nextEdges = currentCanvas.getNextEdges(child);
	        			if(prevEdges.length > 0) {
	        				prevEdges.forEach(function(edge){
	        					var edge = currentCanvas.getRelatedElementsFromEdge(edge);
	        					var fromShapeData = edge.from.shape.data;
	        					// ?���? ?��?��?���? ?��?��?�� ?��?��?���? ?��문에 pass
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
        	msgBox(renderer.MSGMessages.FEEDERINFLOOR);
        	hierarchyFeedersOutBoundaryFloor.forEach(function(element){
        		renderer.highLightHierarchyFeeder(element);
        	})
        	
        	$.unblockUI();
        	return;
        }
        
        console.log(sendData);
        var returnData = parent.updateHierarchy(sendData);
        /**
         * ???�� �? ?��?��?��?���? ?��공한?���?
         * �??�� 그리?��, ?��리�?? ?���? 그린?��.
         */
        if(returnData == '0') {
        	controller.refreshGridAndTree(mode, renderer);
        }
        
        $.unblockUI();
        msgBox(renderer.MSGMessages.SAVEMSG);
        setTimeout(msgBoxClose, 1000);
    },
    
    /**
     * validation ?��보�?? 만든?��.
     */
    makeCheckLSValidatorData: function(renderer) {
    	var currentCanvas = renderer.getCanvas();
    	var json = currentCanvas.toJSON();
    	var sendData = [];
    	
    	var objectSeq;
        var objectFeederSeq = '';
        var object = renderer.editingObject;
        if(object['shapeType'] == renderer.Constants.TYPE.MODIFY_FEEDER) {
            //기존?�� ?��?�� ?��?��
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

                    // ?��?�� shapes?�� ?��보�?? ?��?�� ?��?�� S�? parent?���? child?���? 체크
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
     * ?��?�� ?��?��?�� ?��?���?
     */
    saveFeederGui: function(controller) {
    	
    	var mode = controller.getCurrentMode();
        var renderer = controller.getRendererByMode(mode);
        var currentCanvas = renderer.getCanvas();
        var json = currentCanvas.toJSON();
        var object = renderer.editingObject;
        if(object === undefined) {
        	$.unblockUI();
        	msgBox(renderer.MSGMessages.NOOBJECTSAVE);
            return;
        }
        var sendData = [];
        var objectSeq;
        var objectFeederSeq = '';
        if(object['shapeType'] == renderer.Constants.TYPE.MODIFY_FEEDER) {
            //기존?�� ?��?�� ?��?��
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
         * ?���? ???��?��?���?
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
	
	                    // ?��?�� shapes?�� ?��보�?? ?��?�� ?��?�� S�? parent?���? child?���? 체크
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
        	
        	// 기존 ?��?��?���? �??��?�� 경우
        	/**
        	 * 1. canvas?�� ?��?��?�� 그린 ?�� �? ?��?��?��?�� jsonData�? 배열�? �?진다. (?��리�??�� ?��?��?���? 차후 ?��?��/?��?��?��?��?�� 비교?���? ?��?�� ?��?��?��)
        	 * 
        	 * 2. ?��로운 ?��?���? �? 로드�? ?��?��?���? 그린 ?��?��?��?? update?��?��?��?�� ?��보들�?
        	 *  update list?�� ?��?��?��.
        	 * 
        	 * 3. �??��?�� 경우 ?���? 그린 ?��?��?��?�� �??���? 것인�? ?��?�� 기존?�� 것을 �??�� 것인�? ?��?��?��?�� ?��?��.
        	 *  - ?���? 그린 ?��?��?�� 경우 �??���? update list?��?�� ?��?��?��?��?��?��.
        	 *  - 기존?�� 경우?��?�� delete list�? ?��?��?�� ?��?��.
        	 * 
        	 * 4. ?�� ?��보로 최종?��?���? update?�� 리스?��?? ?��?��?�� 리스?���? 보낸?��.
        	 * 
        	 * 5. ?��리에?�� ?��?��?�� 경우?? 그리?��?��?�� ?��?��?�� 경우?�� ?��?��?�� ?��?��.
        	 *  - object객체?��?�� onDrop ?���? ?��?���? ?��?��?���? ?��?���? ?��?�� onDrop?�� 값이 feederGrid?���? ?��?��?��?��.
        	 *  - ?�� 경우?��?�� status�? U�? ?��?��줘야 ?��?��.
        	 */
        	
        	/** 기존 ?��보도 ?��겨�??��. ?�� ?�� status:U **/
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
         * ???�� �? ?��?��?��?���? ?��공한?���?
         * �??�� 그리?��, ?��리�?? ?���? 그린?��.
         */
        if(returnData == '0') {
        	controller.refreshGridAndTree(mode, renderer);
        }
        
        $.unblockUI();
        msgBox(renderer.MSGMessages.SAVEMSG);
        setTimeout(msgBoxClose, 1000);
    },
    
    /**
     * Route ???�� ?��?��
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
         * 캔버?��?�� ?��보�?? ?��?�� json 
         */
        var GUI_DATA = {};
        GUI_DATA['status'] = 'GUI';
        GUI_DATA['content'] = json;
        sendData.push(GUI_DATA);
        
        /**
         * canvas?�� 그려�? ?��로우 ?��보�?? ?��면서 child�? location�? 찾는?��.
         */
        var shapeList = currentCanvas.getAllShapes();
        var locationOutBoundaryBldg = [];
        shapeList.forEach(function(element){
	        /**
	         * 먼�? 빌딩?��?�� 그려�?�? ?��?�� ?��?��?��?��?�� ?��?���? 존재?��?���? 체크�? ?��?��.
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
        });
        
    	if(locationOutBoundaryBldg.length > 0) {
        	msgBox(renderer.MSGMessages.POINTINLOCATION);
        	//locationOutBoundaryBldg.forEach(function(element){
        	//	renderer.highLightHierarchyFeeder(element);
        	//})
        	$.unblockUI();
        	return;
        }
        
        shapeList.forEach(function(element){
        	var jsonData = {};
        	jsonData['status'] = 'N';
        	/** 
        	 * point ?���?
        	 */
        	if(element.shape instanceof OG.Location) {
        		jsonData['type'] = 'Point';
        		var parentElement = currentCanvas.getParent(element);
        		jsonData['loc_ref_name_to'] = element.shape.data.loc_ref_name_to;
        		
        		/**
        		 * point�? ?��?��?�� location?�� ?��보�?? 같이 �??��.
        		 */
        		jsonData['loc_ref_seq'] = parentElement.shape.data.loc_ref_seq;
        		jsonData['loc_ref_temp'] = parentElement.shape.data.loc_ref_temp;
        		jsonData['loc_ref_rem'] = parentElement.shape.data.loc_ref_rem;
        		jsonData['loc_ref_length'] = parentElement.shape.data.loc_ref_length;
        		
        		sendData.push(jsonData);
        	}
        	/** 
        	 * raceway ?���?
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
        	 * location ?���?
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
        
        console.log(sendData);
        
        var returnData = parent.updateRoute(sendData);
        /**
         * ???�� �? ?��?��?��?���? ?��공한?���?
         * �??�� 그리?��, ?��리�?? ?���? 그린?��.
         */
        if(returnData == '0') {
        	controller.refreshGridAndTree(mode, renderer);
        }
        
        $.unblockUI();
        msgBox(renderer.MSGMessages.SAVEMSG);
        setTimeout(msgBoxClose, 1000);
    },
    
    /**
     * ???�� 버튼
     */
    saveGui: function(controller) {
    	
    	var me = this;
        var mode = controller.getCurrentMode();
        var renderer = controller.getRendererByMode(mode);
        // Feeder?��?��
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