<template>
	<div class="app-contion">
		<el-row class="mar-increased">
			<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" style='margin: 0;width: auto;padding: 0;border: 0;'>
				<el-col :span="12">
					<div class="grid-content bg-purple f-s">
						<el-form-item label="调出仓库" prop="warehouse_name">
							<el-select v-model="ruleForm.warehouse_name" disabled :multiple='false' filterable allow-create default-first-option
							 placeholder="请选择仓库编码" style='width: 100%;' @change="wareblur">
								<el-option v-for="item in recalloptionschu" :key="item.warehouse_code" :label="item.warehouse_name" :value="item">
								</el-option>
							</el-select>
						</el-form-item>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="grid-content bg-purple f-s">
						<el-form-item label="调入仓库 " prop="entryWarehouseName">
							<el-select v-model="ruleForm.entryWarehouseName" disabled :multiple='false' filterable allow-create default-first-option
							 placeholder="请选择仓库编码" style='width: 100%;' @change="wareblur2">
								<el-option v-for="item in warehouseoptions" :key="item.warehouse_code" :label="item.warehouse_name" :value="item">
								</el-option>
							</el-select>
						</el-form-item>
					</div>
				</el-col>
	<el-col :span="12">
					<div class="grid-content bg-purple f-s">
						<el-form-item label="关联单据号" >
							<el-input v-model="ruleForm.ref_order_code" placeholder="请输入关联单据号" disabled></el-input>
						</el-form-item>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="grid-content bg-purple f-s">
						<el-form-item label="单据类型" >
							<el-select v-model="ruleForm.ref_order_type" :multiple='false' filterable allow-create default-first-option
							 placeholder="请选择关联单据类型" style='width: 100%;' @change="refwareblur"disabled >
								<el-option v-for="item in typeoptions" :key="item.code" :label="item.value" :value="item">
								</el-option>
							</el-select>
						</el-form-item>
					</div>
				</el-col>
	<el-col :span="12">
					<div class="grid-content bg-purple f-s">
						<el-form-item label="备注" prop="comments">
							<el-input v-model="ruleForm.comments" placeholder="请输入备注" disabled></el-input>
						</el-form-item>
					</div>
				</el-col>

			</el-form>
		</el-row>
		<el-row>
<el-button type="warning" size="small" @click="exportExcel">导出</el-button>
 <div style="float: right;font-size: 0.875rem;">总件数：<span style="color: red;">{{allnum}}</span></div>
			<el-table :data="tableData" style="width: 100%;margin-top: 0.625rem;" :height="tableHeight" border>
				<el-table-column prop="production_code" label="商品编码">
				</el-table-column>
					<el-table-column prop="bar_code" label="商品条形码">
				</el-table-column>
				<el-table-column prop="production_name" label="商品名称">
				</el-table-column>
				<el-table-column  prop="amount" label="商品数量">

				</el-table-column>
				<el-table-column prop="size" label="商品单位">
				</el-table-column>
         	<el-table-column prop="specification" label="商品规格">
        </el-table-column>
				<el-table-column prop="create_at" label="创建时间">
				</el-table-column>

			</el-table>
		</el-row>
	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		computed: {
			...mapState({
				username: state => state.userinfo.account,
				token: state => state.userinfo.token,
				id: state => state.userinfo.id,
				shopcode: state => state.userinfo.shopcode
			})
		},
		data() {
			return {
				tableHeight: window.innerHeight - 350,
				tableData: [],
				tabledateBox: [],
				ruleForm: {
					warehouse_code: '',
					warehouse_name: '',
					entryWarehouseName:'',
					entryWarehouseCode:'',
					ref_order_code:'',
					ref_order_type:'',
          comments:''
				},
        allnum:'',
				barCode: '',

				options: [],
				CategoryName: [],
				warehouseoptions: [],
				ref_orderoptions: [],
				typeoptions: [],
				refordertype: '',
				kuname:'',
				rules: {
					warehouse_name: [{
							required: true,
							message: '请选择调出仓库',
							trigger: 'change'
						},

					],
					entryWarehouseName: [

						{
							required: true,
							message: '请选择调入仓库',
							trigger: 'change'
						}
					]
					},
					recalloptionschu:[]
			};
		},
		methods: {
      exportExcel() {
      	require.ensure([], () => {
      		const {
      			export_json_to_excel
      		} = require('../../vendor/Export2Excel');
      		const tHeader = ['商品编码', '商品条形码', '商品名称','商品数量','商品单位','创建时间'];
      		// 上面设置Excel的表格第一行的标题
      		const filterVal = ['production_code', 'bar_code','production_name','amount','size','create_at'];
      		// 上面的index、nickName、name是tableData里对象的属性
      		const list = this.tableData; //把data里的tableData存到list
      		const data = this.formatJson(filterVal, list);
      		export_json_to_excel(tHeader, data, '调拨明细');
      	})
      },
      formatJson(filterVal, jsonData) {
      	return jsonData.map(v => filterVal.map(j => v[j]))
      },
			//关联单据类型
			getreforderoptions() {
				let _self = this;
				let formData = new FormData();
				formData.append('state', '2');
				_self.axios.post(_self.ApiurlStorehouse + '/inventory/chooseWarehouseTypeList', formData, {
					// 单独配置
					withCredentials: false
				}).then(response => {

					if (response.data.errcode == '0') {
						_self.typeoptions = response.data.data.list
					} else {
						_self.$message.error('获取仓单类型失败，请刷新重试');
					}
				}).catch(function(error) {
					_self.$message.error('仓单类型时间过长，请重试');

				});
			},
			WarehouseSelectionchu() {
				let _self = this;
				let formData = new FormData();
				formData.append('userId', _self.id);
				_self.axios.post(_self.ApiurlStorehouse + '/inventory/choouseTransferOut', formData, {
					// 单独配置
					withCredentials: false
				}).then(response => {

					if (response.data.errcode == '0') {

						_self.recalloptionschu = response.data.data.list
					} else {
						_self.$message.error('获取仓库失败，请刷新重试');
					}
				}).catch(function(error) {
					_self.$message.error('仓库响应时间过长，请重试');

				});
			},
			cangdan(Vid){
				let _self = this;
				_self.kuname = Vid.code
			},
			searchGoods(event) {

				let _self = this;
				let newdate = {};

				if (event.keyCode == 13) {
					event.preventDefault(); //禁止默认事件（默认是换行）
					let formData = new FormData();
					// formData.append('orderId', _self.$route.query.tabledataDetail.id);
					formData.append('barCode', _self.barCode);

					_self.axios.post(_self.ApiurlStorehouse + '/inventory/entryProductionDetail', formData, {
						// 单独配置
						withCredentials: false
					}).then(response => {
						if (response.data.errcode == '0') {

							newdate = {
								amount: 1,
								bar_code:response.data.data.list.bar_code,
								bill_id: _self.$route.query.tabledataDetail.id,
								create_at: response.data.data.list.create_at,
								production_code: response.data.data.list.code,
								production_name: response.data.data.list.name,
								size: response.data.data.list.unit,
								cost:response.data.data.list.cost
							}

							let existence = false;
							for (var i = 0; i < _self.tableData.length; i++) {
								if (_self.tableData[i].production_code == newdate.production_code) {
									_self.tableData[i].amount += 1;
									existence = true;
									break;
								}
							}
							if (existence != true) {
								_self.tableData.push(newdate)
							}

							_self.$nextTick(function() {
								//DOM 更新了
								_self.$refs.inputVal.focus()
							})
							_self.$message({
								message: '录入成功',
								type: 'success'
							});
							_self.barCode = '';

						} else {
							_self.$message.error(response.data.errmsg);
						}
					}).catch(function(error) {
						_self.$message.error('录入响应时间过长，请重试');

					});
				}
			},
			submitForm(formName) {
				let _self = this;



				if (_self.ruleForm.type == '出库') {
					_self.kuname = '2'
				} else if(_self.ruleForm.type == '入库') {
					_self.kuname = '1'
				}else if(_self.ruleForm.type == '其他入库') {
					_self.kuname = '3'
				}else if(_self.ruleForm.type == '其他出库') {
					_self.kuname = '4'
				}

				if (_self.ruleForm.ref_order_type == '采购单号') {
					_self.refordertype = '1'
				} else if (_self.ruleForm.ref_order_type == '销售单号') {
					_self.refordertype = '2'
				} else if (_self.ruleForm.ref_order_type == '合同号') {
					_self.refordertype = '3'
				}else if (_self.ruleForm.ref_order_type == '调拨单') {
					_self.refordertype = '4'
				}

				_self.$refs[formName].validate((valid) => {
					if (valid) {


						var listbox = {
							list: _self.tableData,
							warehouse_code: _self.ruleForm.warehouse_code,
							warehouse_name: _self.ruleForm.warehouse_name,
							entryWarehouseCode:_self.ruleForm.entryWarehouseCode,
							entryWarehouseName:_self.ruleForm.entryWarehouseName,
							type: '5',
							id: _self.ruleForm.id,
							ref_order_code: _self.ruleForm.ref_order_code,
							ref_order_type: _self.refordertype,
							supplierCode:''
						}
						_self.axios.post(_self.ApiurlStorehouse + '/inventory/updateInvBills', {
							jsonData: listbox
						}, {
							// 单独配置
							withCredentials: false
						}, {
							headers: {
								'Content-Type': 'application/json;charsetset=UTF-8'
							}
						}).then(response => {

							if (response.data.errcode == '0') {
								_self.$message({
									message: '编辑成功',
									type: 'success'
								});
								_self.$router.push({
									path: '/inventoryallocation',

								})
								_self.refordertype = ''
							} else if (response.data.errcode == '1007') {
								_self.$message.error(response.data.data.msg);
							} else {
								_self.$message.error('编辑失败，请重试');
							}
						}).catch(function(error) {
							_self.$message.error('响应时间过长，请重试');

						});
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			wareblur(vId) {
				let _self = this;

				_self.ruleForm.warehouse_name = vId.warehouse_name
				_self.ruleForm.warehouse_code = vId.warehouse_code
			},
			wareblur2(vId){
				let _self = this;
				_self.ruleForm.entryWarehouseName = vId.warehouse_name
				_self.ruleForm.entryWarehouseCode = vId.warehouse_code
			},
			refwareblur(vId) {
				let _self = this;
				_self.refordertype = vId.code
			},
			getcategory() {
				let _self = this;
				//console.log(JSON.stringify(_self.$route.query.tabledataDetail))
				_self.ruleForm.warehouse_code = _self.$route.query.tabledataDetail.warehouse_code
				_self.ruleForm.warehouse_name = _self.$route.query.tabledataDetail.warehouse_name
				_self.ruleForm.entryWarehouseName = _self.$route.query.tabledataDetail.entryWarehouseName
				_self.ruleForm.entryWarehouseCode = _self.$route.query.tabledataDetail.entryWarehouseCode
				_self.ruleForm.type = _self.$route.query.tabledataDetail.type
				_self.ruleForm.ref_order_code = _self.$route.query.tabledataDetail.ref_order_code
				_self.ruleForm.ref_order_type = _self.$route.query.tabledataDetail.ref_order_type
				_self.ruleForm.checked_by = _self.$route.query.tabledataDetail.checked_by
				_self.ruleForm.id = _self.$route.query.tabledataDetail.id
        _self.ruleForm.comments = _self.$route.query.tabledataDetail.comments
			},
			//获取条码信息
			gettabledate() {

				let _self = this;
				let formData = new FormData();
				formData.append('orderId', _self.$route.query.tabledataDetail.id);
				_self.axios.post(_self.ApiurlStorehouse + '/inventory/getInvBillDetailProductionDetailLists', formData, {
					// 单独配置
					withCredentials: false
				}).then(response => {

					if (response.data.errcode == '0') {
						_self.tabledateBox = response.data.data.list
						_self.tableData = _self.tabledateBox
               _self.allnum = response.data.data.totalCount;
					} else {
						_self.$message.error('获取列表失败，请刷新重试');
					}
				}).catch(function(error) {
					_self.$message.error('获取列表时间过长，请重试');

				});

			},
			//删除
			handleDelete(index, row) {
				let _self = this;
				_self.tableData.splice(index, 1);
			},
			//仓单类型加载
			gettypeoptions() {
				let _self = this;
				let formData = new FormData();
				formData.append('state', '1');
				_self.axios.post(_self.ApiurlStorehouse + '/inventory/chooseWarehouseTypeList', formData, {
					// 单独配置
					withCredentials: false
				}).then(response => {

					if (response.data.errcode == '0') {
						_self.ref_orderoptions = response.data.data.list
					} else {
						_self.$message.error('获取仓单类型失败，请刷新重试');
					}
				}).catch(function(error) {
					_self.$message.error('仓单类型时间过长，请重试');

				});
			},

			//仓库编码
			getwarehouseoptions() {
				let _self = this;
				let formData = new FormData();
				formData.append('state', '1');
				_self.axios.post(_self.ApiurlStorehouse + '/inventory/chooseWarehouseList', formData, {
					// 单独配置
					withCredentials: false
				}).then(response => {

					if (response.data.errcode == '0') {

						_self.warehouseoptions = response.data.data.list
					} else {
						_self.$message.error('获取仓库失败，请刷新重试');
					}
				}).catch(function(error) {
					_self.$message.error('仓库响应时间过长，请重试');

				});
			}
		},
		created: function() {
			let _self = this;
			_self.getcategory();
			_self.gettypeoptions();
			_self.WarehouseSelectionchu();
			_self.getwarehouseoptions();
			_self.gettabledate();
			_self.getreforderoptions();
		}
	}
</script>

<style>
	.app-contion {
		margin: 0.625rem;
	}

	.f-s {
		font-size: 1rem;
	}

	.mar-increased {
		margin: 1.25rem 1.25rem 0 0;
	}

	.footer-increased {
		position: fixed;
		width: 100%;
		bottom: 0;
		left: 12.5rem;
		right: 0;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
	}

	.btnbox-increased {
		margin: 0.9375rem;
	}

	.wids {
		width: 25%;
		margin-left: 10%;
	}

	.keyinput {
		-webkit-appearance: none;
		background-color: #fff;
		background-image: none;
		border-radius: 4px;
		border: 1px solid #dcdfe6;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		color: #606266;
		display: inline-block;
		font-size: inherit;
		height: 40px;
		line-height: 40px;
		outline: 0;
		padding: 0 15px;
		-webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
		transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
		width: 100%;
	}
</style>
