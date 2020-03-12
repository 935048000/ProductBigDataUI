<template>
	<div class="app-contion">
		<!--startprint-->
		<el-table :data="tableData" border :height="tableHeight" style="width: 100%" id='printTable'>

			  <el-table-column prop="bar_code" label="商品条码">
			</el-table-column>
			<el-table-column prop="name" label="商品名称">
			</el-table-column>
			<el-table-column prop="cost" label="成本价">
			</el-table-column>

			<el-table-column prop="price" label="零售价">
			</el-table-column>
			<el-table-column prop="provider_name" label="供应商">
			</el-table-column>
			<el-table-column prop="state" label="审核状态">
			</el-table-column>

			<el-table-column prop="create_at" label="申请时间">
			</el-table-column>
		<el-table-column label="操作" width="100" fixed="right">
				<template slot-scope="scope">
					<div style="display: flex;">
  <el-button size="mini" @click="detail(scope.$index, scope.row)">详情</el-button>
	</div>
				</template>
			</el-table-column>
		</el-table>
		<!--endprint-->
		<div style="position: fixed;bottom: 0.625rem;right: 0;">
			<el-pagination background layout="prev, pager, next" :total="total" :page-size='pagesize' @current-change="current_change">
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
				tableHeight: window.innerHeight - 120,
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
				tabindex: 0,
			};
		},
		methods: {


			current_change: function(currentPage) {
				let _self = this;
				_self.currentPage = currentPage;
			let formData = new FormData();
		formData.append('pageNum', _self.currentPage);
			formData.append('pageSize', _self.pagesize);
		_self.axios.post(_self.ApiurlStorehouse + '/productManagement/goodsAuditPassedList', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {
		  if (response.data.errcode == '0') {
		      _self.tableData = response.data.data.data.list
					_self.total = response.data.data.data.total
						for (var i = 0; i < _self.tableData.length; i++) {
					  if (response.data.data.data.list[i].state == 0) {
						  _self.tableData[i].state = '创建中'

						} else if (response.data.data.data.list[i].state == 1) {
						  _self.tableData[i].state = '审核中'

						} else if (response.data.data.data.list[i].state == 2) {
						  _self.tableData[i].state = '审核通过'

						}
					}
				} else {
					_self.$message.error('列表载入失败，请刷新重试');
				}
			}).catch(function(error) {
				_self.$message.error('列表载入响应时间过长，请重试2');

			});

			},



			//修改
			revise(index) {
				let _self = this;

				_self.$router.push({
					path: '/CommodityModificationAudit',
					query: {
						tabledataDetail: _self.tableData[index],

					}
				})
			},
			//详情
			detail(index) {
				let _self = this;
				_self.$router.push({
					path: '/CommodityDetails',
					query: {
						tabledataDetail: _self.tableData[index],

					},
				})
			},
			add() {
				let _self = this;
				_self.$router.push({
					path: '/addstock',

				})
			},
			//撤回
			recalls(index) {
				let _self = this;
				let formData = new FormData();
				formData.append('billId', _self.tableData[index].id);
				formData.append('userId', _self.id);
				formData.append('state', '0');
				_self.axios.post(_self.ApiurlStorehouse + '/inventory/withdrawAudit', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {

					if (response.data.errcode == '0') {
						_self.$message({
							message: '撤回成功',
							type: 'success'
						});
						_self.getdata();
					} else {
						_self.$message.error(response.data.errmsg);
					}
				}).catch(function(error) {
					_self.$message.error('响应时间过长，请重试');

				});
			},
			//列表载入
			getdata() {
				let _self = this;

				let formData1 = new FormData();
				formData1.append('pageNum', _self.currentPage);
				formData1.append('pageSize', _self.pagesize);
      _self.axios.post(_self.ApiurlStorehouse + '/productManagement/goodsAuditPassedList', formData1, {
          // 单独配置
          withCredentials: false
        }).then(response => {
        if (response.data.errcode == '0') {
            _self.tableData = response.data.data.data.list
						_self.total = response.data.data.data.total
						for (var i = 0; i < _self.tableData.length; i++) {
						  if (response.data.data.data.list[i].state == 0) {
							  _self.tableData[i].state = '创建中'

							} else if (response.data.data.data.list[i].state == 1) {
							  _self.tableData[i].state = '审核中'

							} else if (response.data.data.data.list[i].state == 2) {
							  _self.tableData[i].state = '审核通过'

							}
						}
					} else {
						_self.$message.error('列表载入失败，请刷新重试1');
					}
				}).catch(function(error) {
					_self.$message.error('列表载入响应时间过长，请重试3');

				});
			},


		},
		created: function() {
			let _self = this;

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

	.el-table__body-wrapper {
		overflow-x: auto;
		overflow-y: auto;
	}
</style>
