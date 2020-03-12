<template>
	<div class="app-contion">
		<!--startprint-->
		<div class="stock-header">
			<el-input v-model="str" placeholder="请输入商品名或者条形码" style='width: 40%;'></el-input>
			<el-button type="primary" @click='search'>搜索</el-button>
		</div>
		<el-table :data="tableData" border :height="tableHeight" style="width: 100%" id='printTable'>

			<el-table-column prop="name" label="产品名">
			</el-table-column>
			<el-table-column prop="warehouse_code" label="仓库编码">
			</el-table-column>
			<el-table-column prop="warehouse_name" label="仓库名">
			</el-table-column>
			<el-table-column prop="store_amount" label="数量">
			</el-table-column>
			<el-table-column prop="bar_code" label="商品条码">
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
				tableHeight: window.innerHeight - 180,
				str: '',
				total: '',
				pagesize: 10,
				currentPage: 1,
				tabindex: 0,
			};
		},
		methods: {

			//搜索
			search() {
				let _self = this;
				if ( _self.str=='') {

					_self.$message({
						type: 'warning',
						message: '您还没有输入搜索内容哦！',
						showClose: true,
					})
					return false

				}
				let formData = new FormData();
				formData.append('pageNum', _self.currentPage);
				formData.append('pageSize', _self.pagesize);
				formData.append('str', _self.str);
				formData.append('userId', _self.id);
				_self.axios.post(_self.ApiurlStorehouse + '/inventory/queryInventory', formData, {
					// 单独配置
					withCredentials: false
				}).then(response => {

					if (response.data.errcode == '0') {
						_self.tabindex = '1';
						_self.tableData = response.data.data.list.list
						_self.total = response.data.data.list.total

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


				if (_self.tabindex == '0') {
					let formData = new FormData();
					formData.append('pageNum', _self.currentPage);
					formData.append('pageSize', _self.pagesize);
					formData.append('userId', _self.id);
					_self.axios.post(_self.ApiurlStorehouse + '/inventory/inventoryList', formData, {
						// 单独配置
						withCredentials: false
					}).then(response => {

						if (response.data.errcode == '0') {
							_self.tableData = response.data.data.list.list
							_self.total = response.data.data.list.total
							_self.tabindex = '0';
						} else {
							_self.$message.error('列表载入失败，请刷新重试');
						}
					}).catch(function(error) {
						_self.$message.error('列表载入响应时间过长，请重试');

					});
				} else {
					let formData = new FormData();
					formData.append('pageNum', _self.currentPage);
					formData.append('pageSize', _self.pagesize);
					formData.append('str', _self.str);
					formData.append('userId', _self.id);
					_self.axios.post(_self.ApiurlStorehouse + '/inventory/queryInventory', formData, {
						// 单独配置
						withCredentials: false
					}).then(response => {

						if (response.data.errcode == '0') {
							_self.tabindex = '1';
							_self.tableData = response.data.data.list.list
							_self.total = response.data.data.list.total

						} else {
							_self.$message.error('搜索失败，请刷新重试');
						}
					}).catch(function(error) {
						_self.$message.error('响应时间过长，请重试');

					});
				}

			},


			//列表载入
			getdata() {
				let _self = this;
				let formData = new FormData();
				formData.append('pageNum', _self.currentPage);
				formData.append('pageSize', _self.pagesize);
				formData.append('userId', _self.id);
				_self.axios.post(_self.ApiurlStorehouse + '/inventory/inventoryList', formData, {
					// 单独配置
					withCredentials: false
				}).then(response => {

					if (response.data.errcode == '0') {
						_self.tabindex = '0';
						_self.tableData = response.data.data.list.list
						_self.total = response.data.data.list.total

					} else {
						_self.$message.error('列表载入失败，请刷新重试');
					}
				}).catch(function(error) {
					_self.$message.error('列表载入响应时间过长，请重试');

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
</style>
