/**
 * Created by Seungpil, Park on 2016. 9. 6..
 */
var DataController = function () {
	this.dev = false;
};
DataController.prototype = {
	/**
	 * ������Ʈ �����͸� �ҷ��´�.
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
	 * ����ġ ����Ʈ �ڽ��� ������ �ҷ��´�.
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
	 * ������ ���� ����ġ ����Ʈ�� �ҷ��´�.
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
	 * ���� ����ġ ����Ʈ�� �ҷ��´�.
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
	 * ������ ���� �ε� ����Ʈ�� �ҷ��´�.
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
	 * ���� �ε� ����Ʈ�� �ҷ��´�.
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
	 * �Ǵ� ����Ʈ�� �ҷ��´�.(����ġ�� �ش��ϴ� �͸� ����Ʈ��)
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
	 * AssignedFeederList�� treedata�� ����� �Լ�
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

			//LV �� 1�̸� ��Ʈ�̴�.
			if (data[i]['lv'] == 1) {
				parent = '#';
				lastLvMap[1] = data[i];
			}
			//prevItem �� ���ٸ� �ϴ� ��Ʈ�� ����ϰ�, LV �ʿ� �ڽ��� ���
			else if (!prevItem) {
				parent = '#';
				lastLvMap[data[i]['lv']] = data[i];
			}
			else {
				//�ڽ��� ������ ������ �������� �������� ũ�ٸ�
				if (prevItem['lv'] < data[i]['lv']) {
					parent = prevItem['feeder_list_mgt_seq'];
					lastLvMap[data[i]['lv']] = data[i];
				}
				//�ڽ��� ������ ������ �������� �������� ���ų� �۴ٸ�
				else if (prevItem['lv'] >= data[i]['lv']) {
					var parentLv = data[i]['lv'] - 1;
					if (lastLvMap[parentLv]) {
						parent = lastLvMap[parentLv]['feeder_list_mgt_seq'];
						lastLvMap[data[i]['lv']] = data[i];
					}
					//�ڽ��� ���ܰ� ������ lastLvMap �� ���ٸ�, �߸��� ������ �������� �˸���.
					else {
						callback('����ε� �ε� ' + data[i]['kks_num'] + ' �� ���� ���� �����Ͱ� �����Ǿ����ϴ�.')
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
	 * ����ε� �Ǵ� ����Ʈ �� �ҷ��´�.
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
	 * Ʈ������ ������ ��� �������� �ش� ����Ʈ�� �ٽ� �޾ƿͼ� ���������Ѵ�.
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
	 * �Ǵ� �������� Assigned(All)�� Ʈ���� ���ؽ�Ʈ �޴��� unAssign Ŭ�� �̺�Ʈ�� feeder_list_mgt_seq�� �޾� �����.
	 */
	deleteFeeder: function (seq) {
		// resultData�� �����̸� status : 0, �����ÿ��� status : 1, errorMessage : "string"
		var resultData = parent.deleteFeeder(seq);
		return resultData;

	},

	/* Hierarchy Editor DataController */

	/**
	 * ���̾��Ű �������� �Ǵ� ����Ʈ�� �ҷ��´�.
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

			//LV �� 1�̸� ��Ʈ�̴�.
			if (data[i]['lv'] == 1) {
				parent = '#';
				lastLvMap[1] = data[i];
			}
			//prevItem �� ���ٸ� �ϴ� ��Ʈ�� ����ϰ�, LV �ʿ� �ڽ��� ���
			else if (!prevItem) {
				parent = '#';
				lastLvMap[data[i]['lv']] = data[i];
			}
			else {
				//�ڽ��� ������ ������ �������� �������� ũ�ٸ�
				if (prevItem['lv'] < data[i]['lv']) {
					parent = prevItem['hier_seq'];
					lastLvMap[data[i]['lv']] = data[i];
				}
				//�ڽ��� ������ ������ �������� �������� ���ų� �۴ٸ�
				else if (prevItem['lv'] >= data[i]['lv']) {
					var parentLv = data[i]['lv'] - 1;
					if (lastLvMap[parentLv]) {
						parent = lastLvMap[parentLv]['hier_seq'];
						lastLvMap[data[i]['lv']] = data[i];
					}
					//�ڽ��� ���ܰ� ������ lastLvMap �� ���ٸ�, �߸��� ������ �������� �˸���.
					else {
						callback('���̾��Ű ' + data[i]['hier_seq'] + ' �� ���� ���� �����Ͱ� �����Ǿ����ϴ�.')
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
	 * ���̾��Ű ������ ���̺�
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
		 * ĵ������ ������ ��� json
		 */
		var GUI_DATA = {};
		GUI_DATA['status'] = 'GUI';
		GUI_DATA['content'] = json;
		sendData.push(GUI_DATA);

		/**
		 * canvas�� �׷��� �÷ο� ������ ���鼭 child�� ����ġ �Ǵ��� ã�´�.
		 */
		var shapeList = currentCanvas.getAllShapes();
		var hierarchyFeedersOutBoundaryFloor = [];
		if(!controller.getHierarchySaveMode()) {
			shapeList.forEach(function(element){

				/**
				 * ���� �����ȿ� �׷����� �ʴ� ���̾��Ű �Ǵ��� �����ϴ��� üũ�� �Ѵ�.
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
			 * ���� ������ �״�� �ø���.
			 */
			feederHierarchyMgtShapeList.forEach(function(fhList){
				sendData.push(fhList);
			});


			shapeList.forEach(function(element){
				/**
				 * ���� �����ȿ� �׷����� �ʴ� ���̾��Ű �Ǵ��� �����ϴ��� üũ�� �Ѵ�.
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
					 * ��ü �׷��� �������� update����Ʈ���� ��ȸ�� �ؾ��Ѵ�.
					 * ���߿� ������ �׷��� ������ �ƴ� ���ο� �༮�� ��쿡�� sendData�� �־�� �Ѵ�.
					 */
					childShape.forEach(function(child){
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

		//console.log(sendData);
		try {
			var returnData = parent.updateHierarchy(sendData);
			/**
			 * ���� �� ������Ʈ�� �����Ѵٸ�
			 * ���� �׸���, Ʈ���� ���� �׸���.
			 */
			if(returnData == '0') {
				controller.refreshGridAndTree(mode, renderer);
				msgBox(renderer.MSGMessages.SAVEMSG);
			} else {
				msgBox(renderer.MSGMessages.SAVEERRORMSG);
			}
		} catch (e) {
			msgBox(renderer.MSGMessages.SAVEERRORMSG);
		}

		$.unblockUI();
		setTimeout(msgBoxClose, 1000);
	},

	/**
	 * validation ������ �����.
	 */
	makeCheckLSValidatorData: function(renderer) {
		var currentCanvas = renderer.getCanvas();
		var json = currentCanvas.toJSON();
		var sendData = [];

		var objectSeq;
		var objectFeederSeq = '';
		var object = renderer.editingObject;
		if(object['shapeType'] == renderer.Constants.TYPE.MODIFY_FEEDER) {
			//������ �ִ� �Ǵ�
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

					// ���� shapes�� ������ ���� �ش� S�� parent���� child���� üũ
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
	 * �Ǵ� ������ ���̺�
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
			//������ �ִ� �Ǵ�
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
		 * �ű� �����̶��
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

						// ���� shapes�� ������ ���� �ش� S�� parent���� child���� üũ
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

			// ���� �����͸� ������ ���
			/**
			 * 1. canvas�� ������ �׸� �� �� �������� jsonData�� �迭�� ������. (�������� �����ͷ� ���� ����/������Ʈ�� ���ϱ� ���� ������)
			 *
			 * 2. ���ο� ����ġ �� �ε带 ������� �׸� �������� update�ؾ��ϴ� �������
			 *  update list�� �ִ´�.
			 *
			 * 3. ������ ��� ���� �׸� �������� ������ ������ �Ǵ� ������ ���� ���� ������ �ľ��ؾ� �Ѵ�.
			 *  - ���� �׸� ������ ��� ����� update list���� �����ؾ��Ѵ�.
			 *  - ������ ��쿡�� delete list�� �־�� �Ѵ�.
			 *
			 * 4. �� ������ ���������� update�� ����Ʈ�� ������ ����Ʈ�� ������.
			 *
			 * 5. Ʈ������ �Ѿ�� ���� �׸��忡�� �Ѿ�� ���� ������ �Ѵ�.
			 *  - object��ü���� onDrop Ű�� �ִ��� Ȯ���ϰ� �ִٸ� �ش� onDrop�� ���� feederGrid���� Ȯ���Ѵ�.
			 *  - �� ��쿡�� status�� U�� �־���� �Ѵ�.
			 */

			/** ���� ������ �Ѱ��ش�. �� �� status:U **/
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

		//console.log(sendData);
		try {
			var returnData = parent.updateFeeder(sendData);
			/**
			 * ���� �� ������Ʈ�� �����Ѵٸ�
			 * ���� �׸���, Ʈ���� ���� �׸���.
			 */
			if(returnData == '0') {
				controller.refreshGridAndTree(mode, renderer);
				msgBox(renderer.MSGMessages.SAVEMSG);
			} else {
				msgBox(renderer.MSGMessages.SAVEERRORMSG);
			}
		} catch (e) {
			msgBox(renderer.MSGMessages.SAVEERRORMSG);
		}

		$.unblockUI();
		setTimeout(msgBoxClose, 1000);
	},

	/**
	 * Route ���� �Լ�
	 */
	saveRoute: function(controller) {
		//console.log(parent.getLocationList());
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
		 * ĵ������ ������ ��� json
		 */
		var GUI_DATA = {};
		GUI_DATA['status'] = 'GUI';
		GUI_DATA['content'] = json;
		sendData.push(GUI_DATA);

		/**
		 * canvas�� �׷��� �÷ο� ������ ���鼭 child�� location�� ã�´�.
		 */
		var shapeList = currentCanvas.getAllShapes();
		var locationOutBoundaryBldg = [];
		shapeList.forEach(function(element){
			/**
			 * ���� �����ȿ� �׷����� �ʴ� ���̾��Ű �Ǵ��� �����ϴ��� üũ�� �Ѵ�.
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
			 * point ����
			 */
			if(element.shape instanceof OG.Location) {
				jsonData['type'] = 'Point';
				var parentElement = currentCanvas.getParent(element);
				jsonData['loc_ref_name_to'] = element.shape.data.loc_ref_name_to;

				/**
				 * point�� ���Ե� location�� ������ ���� �ش�.
				 */
				jsonData['loc_ref_seq'] = parentElement.shape.data.loc_ref_seq;
				jsonData['loc_ref_temp'] = parentElement.shape.data.loc_ref_temp;
				jsonData['loc_ref_rem'] = parentElement.shape.data.loc_ref_rem;
				jsonData['loc_ref_length'] = parentElement.shape.data.loc_ref_length;

				sendData.push(jsonData);
			}
			/**
			 * raceway ����
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
			 * location ����
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

		//console.log(sendData);
		try {
			var returnData = parent.updateRoute(sendData);
			/**
			 * ���� �� ������Ʈ�� �����Ѵٸ�
			 * ���� �׸���, Ʈ���� ���� �׸���.
			 */
			if(returnData == '0') {
				controller.refreshGridAndTree(mode, renderer);
				msgBox(renderer.MSGMessages.SAVEMSG);
			} else {
				msgBox(renderer.MSGMessages.SAVEERRORMSG);
			}
		} catch (e) {
			msgBox(renderer.MSGMessages.SAVEERRORMSG);
		}

		$.unblockUI();
		setTimeout(msgBoxClose, 1000);
	},

	/**
	 * ���� ��ư
	 */
	saveGui: function(controller) {

		var me = this;
		var mode = controller.getCurrentMode();
		var renderer = controller.getRendererByMode(mode);
		// Feeder�϶�
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