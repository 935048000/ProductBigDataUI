<template>
	<div class="app-contion">
		<div class="table-box" style="margin-bottom: 20px;">
			<p>注意：现有门店权限如下，请谨慎修改</p>

		</div>
		<div id="tableid">
			<el-table :data="tableData" border style="width: 100%" :height="tableHeight">
				<el-table-column prop="name" label="功能">

				</el-table-column>
				<el-table-column label="状态">
					<template slot-scope="scope">
						{{state}}
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button size="mini" type="success" @click="grounding(scope.$index, scope.row)" v-if="state === '已关闭'">开启</el-button>
						<el-button size="mini" type="danger" @click="undercarriage(scope.$index, scope.row)" v-if="state === '已开启'">关闭</el-button>
					</template>
				</el-table-column>
			</el-table>
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
				tableData: [{
					name: "促销价与折扣同享"
				}],
				state: ''
			}
		},
		methods: {


			//获取table数据
			getdata() {
				let _self = this
				let formData = new FormData();
				formData.append('shopCode', _self.shopcode);
				_self.axios.post(_self.ApiUrls + '/buyer/getShopDetail', formData, {
					// 单独配置
					withCredentials: false
				}).then(response => {
					if (response.data.errcode == '0') {

						if (response.data.data.data.promotion_type == '1') {
							_self.state = '已关闭'
						} else if (response.data.data.data.promotion_type == '2') {
							_self.state = '已开启'
						}

					}
				}).catch(function(error) {
					_self.$message.error('商品品类列表加载错误');
				});
			},
			//开启
			grounding(index) {
				let _self = this;
				_self.$confirm('您确定执行"开启"操作么?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {

					let formData = new FormData();
					formData.append('promotionType', '2');
					formData.append('shopCode', _self.shopcode);
					_self.axios.post(_self.ApiUrls + '/buyer/updateShopPromotionType', formData, {
						// 单独配置
						withCredentials: false
					}).then(response => {
						if (response.data.errcode == '0') {
							_self.$message({
								type: 'success',
								message: '开启成功!'
							});

							_self.getdata();

						} else {
							_self.$message.error('开启失败');
						}
					}).catch(function(error) {
						_self.$message.error('开启操作响应时间过长，请重试');
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消开启'
					});

				});
			},
			//关闭
			undercarriage(index) {
				let _self = this;
				_self.$confirm('您确定执行"关闭"操作么?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let formData = new FormData();
					formData.append('promotionType', '1');
					formData.append('shopCode', _self.shopcode);
					_self.axios.post(_self.ApiUrls + '/buyer/updateShopPromotionType', formData, {
						// 单独配置
						withCredentials: false
					}).then(response => {
						if (response.data.errcode == '0') {
							_self.$message({
								type: 'success',
								message: '关闭成功!'
							});

							_self.getdata();

						} else {
							_self.$message.error('关闭失败');
						}
					}).catch(function(error) {
						_self.$message.error('关闭操作响应时间过长，请重试');
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消关闭'
					});

				});
			},

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
