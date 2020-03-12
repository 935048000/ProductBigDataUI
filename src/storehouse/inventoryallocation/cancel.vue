<template>
	<div class="app-contion">
		<!--startprint-->
		<el-table :data="tableData" border :height="tableHeight" style="width: 100%" id='printTable'>
			<el-table-column prop="id" label="调拨单号">
			</el-table-column>
			<el-table-column prop="warehouse_name" label="调出仓库">
			</el-table-column>
			<el-table-column prop="warehouse_code" label="调入仓库">
			</el-table-column>
			<el-table-column prop="type" label="仓单类型">
			</el-table-column>
		<el-table-column prop="state" label="仓单状态">
		</el-table-column>
			<el-table-column prop="operator" label="申请人">
			</el-table-column>
			<el-table-column prop="apply_time" label="申请时间">
			</el-table-column>
			
			
		</el-table>
		<!--endprint-->
		<div style="position: fixed;bottom: 0.625rem;right: 0;">
			<el-pagination background layout="prev, pager, next" :total="total" @current-change="current_change">
			</el-pagination>
		</div>
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
				tableData: [],
				tableHeight: window.innerHeight - 140,
				datetime: '', //时间选择
				documents: '', //单据编号输入
				transfer: '', //仓单类型
				recall: '', //仓库
				Documenttype: '', //单据类型
				recalloptions: [],
				transferoptions: [],
				Documenttypeoptions: [],
				total: '',
				pagesize: 10,
				currentPage: 1,
				  tabindex:0,
			};
		},
		methods: {

			//搜索
			seachall(){
				let _self = this;
				let formData = new FormData();
				formData.append('pageNum', _self.currentPage);
				formData.append('pageSize', _self.pagesize);
				formData.append('str', _self.recall);
				formData.append('startDate', _self.datetime[0]);
				formData.append('endDate', _self.datetime[1]);
				formData.append('userId', _self.id);
				_self.axios.post(_self.ApiurlStorehouse + '/inventory/queryInbBills', formData, {
					// 单独配置
					withCredentials: false
				}).then(response => {
				
					if (response.data.errcode == '0') {
						_self.tabindex='1';
						_self.tableData = response.data.data.list.list
						_self.total = response.data.data.list.total
						for (var i = 0; i < _self.tableData.length; i++) {
							if (_self.tableData[i].type == '1') {
								_self.tableData[i].type = '入库'
							} else if (_self.tableData[i].type == '2') {
								_self.tableData[i].type = '出库'
							} else if (_self.tableData[i].type == '3') {
								_self.tableData[i].type = '其他入库'
							} else if (_self.tableData[i].type == '4') {
								_self.tableData[i].type = '其他出库'
							} else if (_self.tableData[i].type == '5') {
								_self.tableData[i].type = '调库'
							}
						
							if (_self.tableData[i].ref_order_type == '1') {
								_self.tableData[i].ref_order_type = '采购单号'
							} else if (_self.tableData[i].ref_order_type == '2') {
								_self.tableData[i].ref_order_type = '销售单号'
							} else if (_self.tableData[i].ref_order_type == '3') {
								_self.tableData[i].ref_order_type = '合同号'
							}
						
							if (response.data.data.list.list[i].state == '0') {
								_self.tableData[i].state = '待审核'
						
							} else if (response.data.data.list.list[i].state == '1') {
								_self.tableData[i].state = '审核中'
						
							} else if (response.data.data.list.list[i].state == '2') {
								_self.tableData[i].state = '审核通过'
						
							} else if (response.data.data.list.list[i].state == '3') {
								_self.tableData[i].state = '审核未通过'
						
							}
						}
					} else {
						_self.$message.error('搜索失败，请刷新重试');
					}
				}).catch(function(error) {
					_self.$message.error('响应时间过长，请重试');
				
				});
			},
			current_change: function(currentPage) {
				let _self = this;
				_self.currentPage = currentPage;
				
					let formData = new FormData();
					formData.append('pageNum', _self.currentPage);
					formData.append('pageSize', _self.pagesize);
					formData.append('userId', _self.id);
					formData.append('state', '4');
					_self.axios.post(_self.ApiurlStorehouse + '/inventory/getCheckInvBillsList', formData, {
						// 单独配置
						withCredentials: false
					}).then(response => {
					
						if (response.data.errcode == '0') {
					_self.tableData = response.data.data.list.list
					_self.total = response.data.data.list.total
					for (var i = 0; i < _self.tableData.length; i++) {
						if (_self.tableData[i].type == '1') {
							_self.tableData[i].type = '入库'
						} else if (_self.tableData[i].type == '2') {
							_self.tableData[i].type = '出库'
						} else if (_self.tableData[i].type == '3') {
							_self.tableData[i].type = '其他入库'
						} else if (_self.tableData[i].type == '4') {
							_self.tableData[i].type = '其他出库'
						} else if (_self.tableData[i].type == '5') {
							_self.tableData[i].type = '调库'
						}
					
						if (_self.tableData[i].ref_order_type == '1') {
							_self.tableData[i].ref_order_type = '采购单号'
						} else if (_self.tableData[i].ref_order_type == '2') {
							_self.tableData[i].ref_order_type = '销售单号'
						} else if (_self.tableData[i].ref_order_type == '3') {
							_self.tableData[i].ref_order_type = '合同号'
						}
					
						if (response.data.data.list.list[i].state == '0') {
							_self.tableData[i].state = '待审核'
					
						} else if (response.data.data.list.list[i].state == '1') {
							_self.tableData[i].state = '审核中'
					
						} else if (response.data.data.list.list[i].state == '2') {
							_self.tableData[i].state = '审核通过'
					
						} else if (response.data.data.list.list[i].state == '3') {
							_self.tableData[i].state = '审核未通过'
					
						}else if (response.data.data.list.list[i].state == '4') {
									_self.tableData[i].state = '作废单'
							
								}
					}
						} else {
							_self.$message.error('列表载入失败，请刷新重试');
						}
					}).catch(function(error) {
						_self.$message.error('列表载入响应时间过长，请重试');
					
					});
			
				
			},
			//重置
			resetting(){
				let _self = this;
				_self.datetime='';
				_self.documents='';
				_self.Documenttype='';
				_self.recall='';
				_self.transfer='';
			},

			//列表载入
			getdata() {
				let _self = this;
				let formData = new FormData();
				formData.append('pageNum', _self.currentPage);
				formData.append('pageSize', _self.pagesize);
				formData.append('userId', _self.id);
				formData.append('state', '4');
				_self.axios.post(_self.ApiurlStorehouse + '/inventory/getCheckInvBillsList', formData, {
					// 单独配置
					withCredentials: false
				}).then(response => {

					if (response.data.errcode == '0') {

						_self.tableData = response.data.data.list.list
						_self.total = response.data.data.list.total
						for (var i = 0; i < _self.tableData.length; i++) {
							if (_self.tableData[i].type == '1') {
								_self.tableData[i].type = '入库'
							} else if (_self.tableData[i].type == '2') {
								_self.tableData[i].type = '出库'
							} else if (_self.tableData[i].type == '3') {
								_self.tableData[i].type = '其他入库'
							} else if (_self.tableData[i].type == '4') {
								_self.tableData[i].type = '其他出库'
							} else if (_self.tableData[i].type == '5') {
								_self.tableData[i].type = '调库'
							}

							if (_self.tableData[i].ref_order_type == '1') {
								_self.tableData[i].ref_order_type = '采购单号'
							} else if (_self.tableData[i].ref_order_type == '2') {
								_self.tableData[i].ref_order_type = '销售单号'
							} else if (_self.tableData[i].ref_order_type == '3') {
								_self.tableData[i].ref_order_type = '合同号'
							}

							if (response.data.data.list.list[i].state == '0') {
								_self.tableData[i].state = '待审核'

							} else if (response.data.data.list.list[i].state == '1') {
								_self.tableData[i].state = '审核中'

							} else if (response.data.data.list.list[i].state == '2') {
								_self.tableData[i].state = '审核通过'

							} else if (response.data.data.list.list[i].state == '3') {
								_self.tableData[i].state = '审核未通过'

							}else if (response.data.data.list.list[i].state == '4') {
									_self.tableData[i].state = '作废单'
							
								}
						}
					} else {
						_self.$message.error('列表载入失败，请刷新重试');
					}
				}).catch(function(error) {
					_self.$message.error('列表载入响应时间过长，请重试');

				});
			},
			//仓库选择
			WarehouseSelection() {
				let _self = this;
				let formData = new FormData();
				formData.append('state', '1');
				_self.axios.post(_self.ApiurlStorehouse + '/inventory/chooseWarehouseList', formData, {
					// 单独配置
					withCredentials: false
				}).then(response => {

					if (response.data.errcode == '0') {

						_self.recalloptions = response.data.data.list
					} else {
						_self.$message.error('获取仓库失败，请刷新重试');
					}
				}).catch(function(error) {
					_self.$message.error('仓库响应时间过长，请重试');

				});
			},
			//仓单类型选择
			warehouserec() {
				let _self = this;
				let formData = new FormData();
				formData.append('state', '1');
				_self.axios.post(_self.ApiurlStorehouse + '/inventory/chooseWarehouseTypeList', formData, {
					// 单独配置
					withCredentials: false
				}).then(response => {

					if (response.data.errcode == '0') {

						_self.transferoptions = response.data.data.list
					} else {
						_self.$message.error('获取仓单类型失败，请刷新重试');
					}
				}).catch(function(error) {
					_self.$message.error('仓单类型时间过长，请重试');

				});
			},
			//单据类型选择
			DocumentTypeSelection() {
				let _self = this;
				let formData = new FormData();
				formData.append('state', '2');
				_self.axios.post(_self.ApiurlStorehouse + '/inventory/chooseWarehouseTypeList', formData, {
					// 单独配置
					withCredentials: false
				}).then(response => {

					if (response.data.errcode == '0') {

						_self.Documenttypeoptions = response.data.data.list
					} else {
						_self.$message.error('获取单据类型失败，请刷新重试');
					}
				}).catch(function(error) {
					_self.$message.error('单据类型响应时间过长，请重试');

				});
			}
		},
		created: function() {
			let _self = this;
			_self.WarehouseSelection();
			_self.DocumentTypeSelection();
			_self.warehouserec();
			_self.getdata();
		}
	}
</script>

<style>
	.app-contion {
		margin: 0.625rem;
	}

	.stock-header {
		margin: 5px 0;
	}

	.stock-label {
		font-size: 0.875rem;
		margin: 0 0.1875rem;
		display: inline-block;
	}

	.stock-margin {
		margin: 0.625rem 0;
	}

	.display {
		display: none;
	}
</style>
