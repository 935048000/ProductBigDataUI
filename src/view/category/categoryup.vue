<template>
	<div class="app-contion">
		<div class="table-box" style="margin-bottom: 20px;">
			<el-input v-model="search" placeholder="请输入内容" style="width: 25%;"></el-input>
			<el-button type="primary" @click='searchup'>查询</el-button>

		</div>
		<div id="tableid">
			<el-table :data="tableData" border style="width: 100%" :height="tableHeight">
				<el-table-column prop="categoryName" label="品类名称">
				</el-table-column>
				<el-table-column prop="state" label="状态">
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button size="mini" type="success" @click="grounding(scope.$index, scope.row)" v-if="scope.row.state === '下架'">上架</el-button>
						<el-button size="mini" type="danger" @click="undercarriage(scope.$index, scope.row)" v-if="scope.row.state === '上架'">下架</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="footerdeom">
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
				pagesize: 10,
				currentPage: 1,
				total: 0,
				tabindex: '0',
				tableHeight: window.innerHeight - 190,
				tableData: [],
				search: '' //查询字段
			}
		},
		methods: {
			current_change: function(currentPage) {
				let _self = this;
				_self.currentPage = currentPage;
				if (_self.tabindex == '0') {
					let formData = new FormData();
					formData.append('pageNum', _self.currentPage);
					formData.append('pageSize', _self.pagesize);
					formData.append('shopCode', _self.shopcode);
					_self.axios.post(_self.ApiUrl + '/category/categoryList', formData).then(response => {
						if (response.data.errcode == '0') {
							_self.tableData = response.data.data.list.list
							_self.total = response.data.data.list.total
							_self.tabindex = '0';
							for (var i = 0; i < response.data.data.list.list.length; i++) {
								if (response.data.data.list.list[i].state == 'N') {
									_self.tableData[i].state = '下架'
								} else if (response.data.data.list.list[i].state == 'Y') {
									_self.tableData[i].state = '上架'
								}
							}
						}
					}).catch(function(error) {
						_self.$message.error('商品品类列表加载错误');
					});
				} else {
					let formData = new FormData();
					formData.append('pageNum', '1');
					formData.append('pageSize', '20');
					formData.append('categoryStr', _self.search);
					formData.append('shopCode', _self.shopcode);
					_self.axios.post(_self.ApiUrl + '/category/queryCategoryList', formData).then(response => {
						if (response.data.errcode == '0') {
							_self.tableData = response.data.data.list.list
							_self.total = response.data.data.list.total
							_self.tabindex = "1";
							for (var i = 0; i < response.data.data.list.list.length; i++) {
								if (response.data.data.list.list[i].state == 'N') {
									_self.tableData[i].state = '下架'
								} else if (response.data.data.list.list[i].state == 'Y') {
									_self.tableData[i].state = '上架'
								}
							}
						} else {
							_self.$message.error('获取列表失败');
						}
					}).catch(function(error) {
						_self.$message.error('响应时间过长，请重试');
					});
				}

			},

			//获取table数据
			getdata() {
				let _self = this
				let formData = new FormData();
				formData.append('pageNum', _self.currentPage);
				formData.append('pageSize', _self.pagesize);
				formData.append('shopCode', _self.shopcode);
				_self.axios.post(_self.ApiUrl + '/category/categoryList', formData).then(response => {
					if (response.data.errcode == '0') {
						_self.tableData = response.data.data.list.list
						_self.total = response.data.data.list.total
						_self.tabindex = '0';
						for (var i = 0; i < response.data.data.list.list.length; i++) {
							if (response.data.data.list.list[i].state == 'N') {
								_self.tableData[i].state = '下架'
							} else if (response.data.data.list.list[i].state == 'Y') {
								_self.tableData[i].state = '上架'
							}
						}
					}
				}).catch(function(error) {
					_self.$message.error('商品品类列表加载错误');
				});
			},
			//上架
			grounding(index) {
				let _self = this;
				_self.$confirm('您确定执行"上架"操作么?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {

					let formData = new FormData();
					formData.append('state', 'Y');
					formData.append('categoryCode', _self.tableData[index].categoryCode);
					formData.append('shopCode', _self.shopcode);
					_self.axios.post(_self.ApiUrl + '/category/categoryStandUpAndDown', formData).then(response => {
						if (response.data.errcode == '0') {
							_self.$message({
								type: 'success',
								message: '上架成功!'
							});
							if (_self.tabindex == '0') {
								_self.getdata();
							} else {
								_self.searchup();
							}
						} else {
							_self.$message.error('上架失败');
						}
					}).catch(function(error) {
						_self.$message.error('上架操作响应时间过长，请重试');
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消上架'
					});

				});
			},
			//下架
			undercarriage(index) {
				let _self = this;
				_self.$confirm('您确定执行"下架"操作么?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let formData = new FormData();
					formData.append('state', 'N');
					formData.append('categoryCode', _self.tableData[index].categoryCode);
					formData.append('shopCode', _self.shopcode);
					_self.axios.post(_self.ApiUrl + '/category/categoryStandUpAndDown', formData).then(response => {
						if (response.data.errcode == '0') {
							_self.$message({
								type: 'success',
								message: '下架成功!'
							});
							if (_self.tabindex == '0') {
								_self.getdata();
							} else {
								_self.searchup();
							}
						} else {
							_self.$message.error('下架失败');
						}
					}).catch(function(error) {
						_self.$message.error('下架操作响应时间过长，请重试');
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消下架'
					});

				});
			},
			//查询
			searchup() {
				let _self = this
				if (_self.search == '') {

					_self.$message({
						type: 'warning',
						message: '您还没有输入搜索内容哦！',
						showClose: true,
					})
					return false

				}
				_self.tabindex = "1";
				let formData = new FormData();
				formData.append('pageNum', '1');
				formData.append('pageSize', '20');
				formData.append('categoryStr', _self.search);
				formData.append('shopCode', _self.shopcode);
				_self.axios.post(_self.ApiUrl + '/category/queryCategoryList', formData).then(response => {
					if (response.data.errcode == '0') {
						_self.tableData = response.data.data.list.list
						_self.total = response.data.data.list.total

						for (var i = 0; i < response.data.data.list.list.length; i++) {
							if (response.data.data.list.list[i].state == 'N') {
								_self.tableData[i].state = '下架'
							} else if (response.data.data.list.list[i].state == 'Y') {
								_self.tableData[i].state = '上架'
							}
						}
					} else {
						_self.$message.error('获取列表失败');
					}
				}).catch(function(error) {
					_self.$message.error('响应时间过长，请重试');
				});
			}
		},
		created: function() {
			let _self = this
			_self.getdata();

		}
	}
</script>

<style>
	.app-contion {
		margin: 10px;
	}

	.el-card__body {
		font-size: 16px;
	}

	.el-card {
		width: 100%;
	}

	.people {
		display: inline-block;
		margin: 10px 0;
	}

	.table-box {
		margin: 10px 0;
		position: relative;
	}

	.footerdeom {
		position: fixed;
		right: 10px;
		bottom: 10px;
	}

	.daochu {
		position: absolute;
		right: 10px;
		top: 0;
	}

	.el-table__body-wrapper {
		overflow-x: auto;
	}

	.el-table__body-wrapper {
		overflow-x: auto;
		overflow-y: auto;
	}
</style>
