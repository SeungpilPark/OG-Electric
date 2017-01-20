/**
 * Created by Seungpil, Park on 2016. 9. 6..
 */
var DataController = function () {
    this.dev = true;
};
DataController.prototype = {
	/**
	 * ?λ‘μ ?Έ ?°?΄?°λ₯? λΆλ¬?¨?€.
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
     * ?€?μΉ? ??? ?Έ λ°μ€? ?΄?©? λΆλ¬?¨?€.
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
     * ?¬?©?μ§? ??? ?€?μΉ? λ¦¬μ€?Έλ₯? λΆλ¬?¨?€.
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
     * ?¬?©? ?€?μΉ? λ¦¬μ€?Έλ₯? λΆλ¬?¨?€.
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
     * ?¬?©?μ§? ??? λ‘λ λ¦¬μ€?Έλ₯? λΆλ¬?¨?€.
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
     * ?¬?©? λ‘λ λ¦¬μ€?Έλ₯? λΆλ¬?¨?€.
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
     * ?Ό? λ¦¬μ€?Έλ₯? λΆλ¬?¨?€.(?€?μΉμ ?΄?Ή?? κ²λ§ λ¦¬μ€?Έλ‘?)
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
     * AssignedFeederList? treedataλ₯? λ§λ? ?¨?
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
	
	        //LV κ°? 1?΄λ©? λ£¨νΈ?΄?€.
	        if (data[i]['lv'] == 1) {
	            parent = '#';
	            lastLvMap[1] = data[i];
	        }
	        //prevItem ?΄ ??€λ©? ?Ό?¨ λ£¨νΈλ‘? ?±λ‘νκ³?, LV λ§΅μ ?? ? ?±λ‘?
	        else if (!prevItem) {
	            parent = '#';
	            lastLvMap[data[i]['lv']] = data[i];
	        }
	        else {
	            //?? ? ? λ²¨μ΄ λ§μ?λ§? ??΄?? ? λ²¨λ³΄?€ ?¬?€λ©?
	            if (prevItem['lv'] < data[i]['lv']) {
	                parent = prevItem['feeder_list_mgt_seq'];
	                lastLvMap[data[i]['lv']] = data[i];
	            }
	            //?? ? ? λ²¨μ΄ λ§μ?λ§? ??΄?? ? λ²¨λ³΄?€ κ°κ±°? ??€λ©?
	            else if (prevItem['lv'] >= data[i]['lv']) {
	                var parentLv = data[i]['lv'] - 1;
	                if (lastLvMap[parentLv]) {
	                    parent = lastLvMap[parentLv]['feeder_list_mgt_seq'];
	                    lastLvMap[data[i]['lv']] = data[i];
	                }
	                //?? ? ? ?¨κ³? ? λ²¨μ΄ lastLvMap ? ??€λ©?, ?λͺ»λ ?°?΄?° ???? ?λ¦°λ€.
	                else {
	                    callback('?΄?¬?Έ? λ‘λ ' + data[i]['kks_num'] + ' ? ?? ? λ²? ?°?΄?°κ°? ??½???΅??€.')
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
     * ?΄?¬?Έ? ?Ό? λ¦¬μ€?Έ λ₯? λΆλ¬?¨?€.
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
     * ?Έλ¦¬μ? ? ?? ?Έ? ?­? ?΄? ?΄?Ή λ¦¬μ€?Έλ₯? ?€? λ°μ??? λ¦¬ν? ???€.
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
     * ?Ό? ???°? Assigned(All)? ?Έλ¦¬μ μ»¨ν?€?Έ λ©λ΄? unAssign ?΄λ¦? ?΄λ²€νΈ? feeder_list_mgt_seqλ₯? λ°μ μ§??΄?€.
     */
    deleteFeeder: function (seq) {
    	// resultData? ?±κ³΅μ΄λ©? status : 0, ??¬??? status : 1, errorMessage : "string"
    	var resultData = parent.deleteFeeder(seq);
    	return resultData;
    	
    },
    
    /* Hierarchy Editor DataController */
    
    /**
     * ??΄?΄?Ό?€ ???°? ?Ό? λ¦¬μ€?Έλ₯? λΆλ¬?¨?€.
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

           //LV κ°? 1?΄λ©? λ£¨νΈ?΄?€.
            if (data[i]['lv'] == 1) {
            	parent = '#';
                lastLvMap[1] = data[i];
            }
            //prevItem ?΄ ??€λ©? ?Ό?¨ λ£¨νΈλ‘? ?±λ‘νκ³?, LV λ§΅μ ?? ? ?±λ‘?
            else if (!prevItem) {
            	parent = '#';
            	lastLvMap[data[i]['lv']] = data[i];
            }
            else {
               //?? ? ? λ²¨μ΄ λ§μ?λ§? ??΄?? ? λ²¨λ³΄?€ ?¬?€λ©?
            	if (prevItem['lv'] < data[i]['lv']) {
            		parent = prevItem['hier_seq'];
            		lastLvMap[data[i]['lv']] = data[i];
            	}
            	//?? ? ? λ²¨μ΄ λ§μ?λ§? ??΄?? ? λ²¨λ³΄?€ κ°κ±°? ??€λ©?
            	else if (prevItem['lv'] >= data[i]['lv']) {
            		var parentLv = data[i]['lv'] - 1;
            		if (lastLvMap[parentLv]) {
            			parent = lastLvMap[parentLv]['hier_seq'];
                        lastLvMap[data[i]['lv']] = data[i];
                    }
            		//?? ? ? ?¨κ³? ? λ²¨μ΄ lastLvMap ? ??€λ©?, ?λͺ»λ ?°?΄?° ???? ?λ¦°λ€.
            		else {
            			callback('??΄?΄?Ό?€ ' + data[i]['hier_seq'] + ' ? ?? ? λ²? ?°?΄?°κ°? ??½???΅??€.')
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
     * ??΄?΄?Ό?€ ???° ?Έ?΄λΈ?
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
         * μΊλ²?€? ? λ³΄λ?? ?΄? json 
         */
        var GUI_DATA = {};
        GUI_DATA['status'] = 'GUI';
        GUI_DATA['content'] = json;
        sendData.push(GUI_DATA);
        
        /**
         * canvas? κ·Έλ €μ§? ?λ‘μ° ? λ³΄λ?? ?λ©΄μ childλ‘? ?€?μΉ? ?Ό?λ₯? μ°Ύλ?€.
         */
        var shapeList = currentCanvas.getAllShapes();
        var hierarchyFeedersOutBoundaryFloor = [];
        if(!controller.getHierarchySaveMode()) {
	        shapeList.forEach(function(element){
	        	
	        	/**
	             * λ¨Όμ? λΉλ©?? κ·Έλ €μ§?μ§? ?? ??΄?΄?Ό?€ ?Ό?κ°? μ‘΄μ¬??μ§? μ²΄ν¬λ₯? ??€.
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
	        			 * prevEdgesκ°? ??€? κ²μ? ?? ?Ό?κ°? ??€? κ²?.
	        			 * ??€λ©? ?? ?΄ ???΄κΈ? ?λ¬Έμ 
	        			 */
	        			var prevEdges = currentCanvas.getPrevEdges(child);
	        			var nextEdges = currentCanvas.getNextEdges(child);
	        			if(prevEdges.length > 0) {
	        				prevEdges.forEach(function(edge){
	        					var edge = currentCanvas.getRelatedElementsFromEdge(edge);
	        					var fromShapeData = edge.from.shape.data;
	        					// ?κΈ? ?? ?΄λ©? ?? ?΄ ???΄κΈ? ?λ¬Έμ pass
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
        	 * κΈ°μ‘΄ ? λ³΄λ κ·Έλ?λ‘? ?¬λ¦°λ€.
        	 */
        	feederHierarchyMgtShapeList.forEach(function(fhList){
        		sendData.push(fhList);
        	});
        	
        	
        	shapeList.forEach(function(element){
	        	/**
	             * λ¨Όμ? λΉλ©?? κ·Έλ €μ§?μ§? ?? ??΄?΄?Ό?€ ?Ό?κ°? μ‘΄μ¬??μ§? μ²΄ν¬λ₯? ??€.
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
	        		 * ? μ²? κ·Έλ €μ§? ? λ³΄μ? updateλ¦¬μ€?Έ?? μ‘°νλ₯? ?΄?Ό??€.
	        		 * κ·Έμ€? κΈ°μ‘΄? κ·Έλ €μ§? ? λ³΄κ? ?? ?λ‘μ΄ ????Ό κ²½μ°?λ§? sendData? ?£?΄?Ό ??€.
	        		 */
	        		childShape.forEach(function(child){
	        			var jsonData = {};
	
	        			jsonData['feeder_list_mgt_seq'] = child.shape.data.feeder_list_mgt_seq;
	        			jsonData['hier_seq'] = element.shape.data.hier_seq; 
	        			jsonData['up_hier_seq'] = element.shape.data.up_hier_seq;
	        			
	        			/**
	        			 * prevEdgesκ°? ??€? κ²μ? ?? ?Ό?κ°? ??€? κ²?.
	        			 * ??€λ©? ?? ?΄ ???΄κΈ? ?λ¬Έμ 
	        			 */
	        			var prevEdges = currentCanvas.getPrevEdges(child);
	        			var nextEdges = currentCanvas.getNextEdges(child);
	        			if(prevEdges.length > 0) {
	        				prevEdges.forEach(function(edge){
	        					var edge = currentCanvas.getRelatedElementsFromEdge(edge);
	        					var fromShapeData = edge.from.shape.data;
	        					// ?κΈ? ?? ?΄λ©? ?? ?΄ ???΄κΈ? ?λ¬Έμ pass
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
         * ???₯ λ°? ??°?΄?Έκ°? ?±κ³΅ν?€λ©?
         * κ΄?? ¨ κ·Έλ¦¬?, ?Έλ¦¬λ?? ?λ‘? κ·Έλ¦°?€.
         */
        if(returnData == '0') {
        	controller.refreshGridAndTree(mode, renderer);
        }
        
        $.unblockUI();
        msgBox(renderer.MSGMessages.SAVEMSG);
        setTimeout(msgBoxClose, 1000);
    },
    
    /**
     * validation ? λ³΄λ?? λ§λ ?€.
     */
    makeCheckLSValidatorData: function(renderer) {
    	var currentCanvas = renderer.getCanvas();
    	var json = currentCanvas.toJSON();
    	var sendData = [];
    	
    	var objectSeq;
        var objectFeederSeq = '';
        var object = renderer.editingObject;
        if(object['shapeType'] == renderer.Constants.TYPE.MODIFY_FEEDER) {
            //κΈ°μ‘΄? ?? ?Ό?
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

                    // ?΄?  shapes? ? λ³΄λ?? ?΅?΄ ?΄?Ή Sκ°? parent?Έμ§? child?Έμ§? μ²΄ν¬
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
     * ?Ό? ???° ?Έ?΄λΈ?
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
            //κΈ°μ‘΄? ?? ?Ό?
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
         * ? κ·? ???₯?΄?Όλ©?
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
	
	                    // ?΄?  shapes? ? λ³΄λ?? ?΅?΄ ?΄?Ή Sκ°? parent?Έμ§? child?Έμ§? μ²΄ν¬
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
        	
        	// κΈ°μ‘΄ ?°?΄?°λ₯? κ°?? Έ?¨ κ²½μ°
        	/**
        	 * 1. canvas? ??? κ·Έλ¦° ? κ°? ???€? jsonDataλ₯? λ°°μ΄λ‘? κ°?μ§λ€. (?€λ¦¬μ?? ?°?΄?°λ‘? μ°¨ν ?­? /??°?΄?Έ? λΉκ΅?κΈ? ?? ?°?΄?°)
        	 * 
        	 * 2. ?λ‘μ΄ ?€?μΉ? λ°? λ‘λλ₯? ???Όλ‘? κ·Έλ¦° ???€?? update?΄?Ό?? ? λ³΄λ€λ‘?
        	 *  update list? ?£??€.
        	 * 
        	 * 3. μ§?? ? κ²½μ° ?λ‘? κ·Έλ¦° ???? μ§??μ§? κ²μΈμ§? ?? κΈ°μ‘΄? κ²μ μ§??΄ κ²μΈμ§? ???΄?Ό ??€.
        	 *  - ?λ‘? κ·Έλ¦° ??? κ²½μ° μ§??°λ©? update list?? ? ?Έ?΄?Ό??€.
        	 *  - κΈ°μ‘΄? κ²½μ°?? delete listλ‘? ?£?΄?Ό ??€.
        	 * 
        	 * 4. ?΄ ? λ³΄λ‘ μ΅μ’? ?Όλ‘? update? λ¦¬μ€?Έ?? ?­? ? λ¦¬μ€?Έλ‘? λ³΄λΈ?€.
        	 * 
        	 * 5. ?Έλ¦¬μ? ??΄?¨ κ²½μ°?? κ·Έλ¦¬??? ??΄?¨ κ²½μ°? ?? ?Ό ??€.
        	 *  - objectκ°μ²΄?? onDrop ?€κ°? ??μ§? ??Έ?κ³? ??€λ©? ?΄?Ή onDrop? κ°μ΄ feederGrid?Έμ§? ??Έ??€.
        	 *  - ?΄ κ²½μ°?? statusλ₯? Uλ‘? ?£?΄μ€μΌ ??€.
        	 */
        	
        	/** κΈ°μ‘΄ ? λ³΄λ ?κ²¨μ??€. ?΄ ? status:U **/
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
         * ???₯ λ°? ??°?΄?Έκ°? ?±κ³΅ν?€λ©?
         * κ΄?? ¨ κ·Έλ¦¬?, ?Έλ¦¬λ?? ?λ‘? κ·Έλ¦°?€.
         */
        if(returnData == '0') {
        	controller.refreshGridAndTree(mode, renderer);
        }
        
        $.unblockUI();
        msgBox(renderer.MSGMessages.SAVEMSG);
        setTimeout(msgBoxClose, 1000);
    },
    
    /**
     * Route ???₯ ?¨?
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
         * μΊλ²?€? ? λ³΄λ?? ?΄? json 
         */
        var GUI_DATA = {};
        GUI_DATA['status'] = 'GUI';
        GUI_DATA['content'] = json;
        sendData.push(GUI_DATA);
        
        /**
         * canvas? κ·Έλ €μ§? ?λ‘μ° ? λ³΄λ?? ?λ©΄μ childλ‘? locationλ₯? μ°Ύλ?€.
         */
        var shapeList = currentCanvas.getAllShapes();
        var locationOutBoundaryBldg = [];
        shapeList.forEach(function(element){
	        /**
	         * λ¨Όμ? λΉλ©?? κ·Έλ €μ§?μ§? ?? ??΄?΄?Ό?€ ?Ό?κ°? μ‘΄μ¬??μ§? μ²΄ν¬λ₯? ??€.
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
        	 * point ? λ³?
        	 */
        	if(element.shape instanceof OG.Location) {
        		jsonData['type'] = 'Point';
        		var parentElement = currentCanvas.getParent(element);
        		jsonData['loc_ref_name_to'] = element.shape.data.loc_ref_name_to;
        		
        		/**
        		 * pointκ°? ?¬?¨? location? ? λ³΄λ?? κ°μ΄ μ€??€.
        		 */
        		jsonData['loc_ref_seq'] = parentElement.shape.data.loc_ref_seq;
        		jsonData['loc_ref_temp'] = parentElement.shape.data.loc_ref_temp;
        		jsonData['loc_ref_rem'] = parentElement.shape.data.loc_ref_rem;
        		jsonData['loc_ref_length'] = parentElement.shape.data.loc_ref_length;
        		
        		sendData.push(jsonData);
        	}
        	/** 
        	 * raceway ? λ³?
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
        	 * location ? λ³?
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
         * ???₯ λ°? ??°?΄?Έκ°? ?±κ³΅ν?€λ©?
         * κ΄?? ¨ κ·Έλ¦¬?, ?Έλ¦¬λ?? ?λ‘? κ·Έλ¦°?€.
         */
        if(returnData == '0') {
        	controller.refreshGridAndTree(mode, renderer);
        }
        
        $.unblockUI();
        msgBox(renderer.MSGMessages.SAVEMSG);
        setTimeout(msgBoxClose, 1000);
    },
    
    /**
     * ???₯ λ²νΌ
     */
    saveGui: function(controller) {
    	
    	var me = this;
        var mode = controller.getCurrentMode();
        var renderer = controller.getRendererByMode(mode);
        // Feeder?Ό?
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