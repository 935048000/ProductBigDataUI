<template>
	<div class="app-contion">

		<div class="searchBox" style="display: flex; flex-wrap:wrap ">
			<div class="ChooseStyles">
				<label class="titles">仓库：</label>
				<el-select v-model="wareblur" size="mini" filterable placeholder="请选择"@change="wareblurfouncs($event)">
					<el-option v-for="item in optionsstorehouse" :key="item.warehouse_code" :label="item.warehouse_name" :value="item">
					</el-option>
				</el-select>
			</div>
			<div class="ChooseStyles">
				<label class="titles">请输入条形码：</label>
				<el-input v-model="barcodes" placeholder="请输入内容" size="mini" style='width: 50%;'></el-input>
			</div>
			<div class="ChooseStyles">
				<label class="titles">请输入商品名：</label>
				<el-input v-model="code" placeholder="请输入内容" size="mini" style='width: 50%;'></el-input>
			</div>
			<div class="ChooseStyles">
				<label class="titles">一级品类：</label>
				<el-select v-model="shopteam1" size="mini" placeholder="请选择" filterable @change="founcs($event)">
					<el-option v-for="item in options" :key="item.level03_category_code" :label="item.level03_category_name" :value="item">
					</el-option>
				</el-select>
			</div>
			<div class="ChooseStyles">
				<label class="titles">二级品类：</label>
				<el-select v-model="shopteam22" size="mini" placeholder="请选择" filterable @change="founcs2($event)">
					<el-option v-for="item in options4" :key="item.level02_category_code" :label="item.level02_category_name" :value="item">
					</el-option>
				</el-select>
			</div>
			<div class="ChooseStyles">
				<label class="titles">三级品类：</label>
				<el-select v-model="shoplei3" size="mini" placeholder="请选择" filterable @change="founcs3($event)">
					<el-option v-for="item in options3" :key="item.level01_category_code" :label="item.level01_category_name" :value="item">
					</el-option>
				</el-select>
			</div>
			<div class="ChooseStyles" style="margin-left: 0.625rem;">
				<el-button type="primary" size="mini" @click='screen'>查找</el-button>
				<el-button type="warning" size="mini" @click="exportExcel">导出</el-button>
			</div>
		</div>

		<el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange"
		 :height="tableHeight" border>

			<el-table-column prop="bar_code" label="商品条码">
			</el-table-column>
			<el-table-column prop="name" label="商品名称">
			</el-table-column>
			<el-table-column prop="specification" label="商品规格">
			</el-table-column>
			<el-table-column prop="calculateAmount" label="计算库存数">
			</el-table-column>
			<el-table-column prop="store_amount" label="系统库存数">
			</el-table-column>

		</el-table>

		<div style="position: fixed;bottom: 0.625rem;right: 0;">
			<el-pagination background layout="prev, pager, next" :total="total" @current-change="current_change">
			</el-pagination>
		</div>

		<!--编辑弹框-->

	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex';


	import {
		getLodop,
		needCLodop
	} from '../../vuex/LodopFuncs.js'
	export default {
		data() {
			return {
				barcodes: '', //商品条码
				shoplei: '',
				barCode: '', //商品条形码
				shopteam: '',
				tableData: [],
				total: 10,
				wareblur:'',
				wareblurcode:'',
				currentPage: 1,
				pagesize: 10,
				code: '',
				optionsstorehouse: [],
				options: [],
				options2: [],
				options3: [],
				options4: [],
				disableds: true,
				shopteam2: '',
				categoryCodes: '',
				categoryNames: '',
				indextab: '0',
				tableHeight: window.innerHeight - 230,
				shopteam1: '',
				shopteam22: '',
				shoplei3: ''
			}
		},
		computed: {
			...mapState({
				username: state => state.userinfo.account,
				token: state => state.userinfo.token,
				id: state => state.userinfo.id,
				shopcode: state => state.userinfo.shopcode
			})
		},
		methods: {
			wareblurfouncs(Vid){
				let _self = this;
				console.log(Vid)
				_self.wareblur=Vid.warehouse_name;
				_self.wareblurcode=Vid.warehouse_code;
			},
			//仓库选择
			WarehouseSelection() {
				let _self = this;
				let formData = new FormData();
				formData.append('userId', _self.id);
				_self.axios.post(_self.ApiurlStorehouse + '/inventory/choouseTransferOut', formData, {
					// 单独配置
					withCredentials: false
				}).then(response => {

					if (response.data.errcode == '0') {
						_self.optionsstorehouse = response.data.data.list

					} else {
						_self.$message.error('获取仓库失败，请刷新重试');
					}
				}).catch(function(error) {
					_self.$message.error('仓库响应时间过长，请重试');

				});
			},
			exportExcel() {
				require.ensure([], () => {
					const {
						export_json_to_excel
					} = require('../../vendor/Export2Excel');
					const tHeader = ['商品条码', '商品名称', '商品规格', '计算库存数', '系统库存数'];
					// 上面设置Excel的表格第一行的标题
					const filterVal = ['bar_code', 'name', 'specification', 'calculateAmount', 'store_amount'];
					// 上面的index、nickName、name是tableData里对象的属性
					const list = this.tableData; //把data里的tableData存到list
					const data = this.formatJson(filterVal, list);
					export_json_to_excel(tHeader, data, '理论库存');
				})
			},
			formatJson(filterVal, jsonData) {
				return jsonData.map(v => filterVal.map(j => v[j]))
			},

			founcs2(val, $event) {
				let _self = this
				_self.shopteam2 = val.level02_category_name
				_self.shopteam22 = val.level02_category_name
				let formData = new FormData();
				formData.append('level02CategoryCode', val.level02_category_code);
				//发送请求
				_self.axios.post(_self.ApiurlStorehouse + '/inventory/queryLevel03CategoryCode', formData, {
					// 单独配置
					withCredentials: false
				}).then(response => {

					if (response.data.errcode = '0') {
						_self.options3 = response.data.data.list
					} else {
						_self.$message.error('数据找不到啦');
					}
				}).catch(function(error) {
					_self.$message.error('响应时间过长，请重试');
				});
			},
			founcs3(val, $event) {
				let _self = this
				_self.categoryCodes = val.level01_category_code
				_self.categoryNames = val.level01_category_name
				_self.shoplei3 = val.level01_category_name
			},

			//一级品类
			OneCategoryCode() {
				let _self = this;
				let formData3 = new FormData();
				_self.axios.post(_self.ApiurlStorehouse + '/inventory/queryLevel01CategoryCode', formData3, {
					// 单独配置
					withCredentials: false
				}).then(response => {

					if (response.data.errcode = '0') {

						_self.options = response.data.data.list
					} else {
						_self.$message.error('数据找不到啦');
					}


				}).catch(function(error) {
					_self.$message.error('响应时间过长，请重试');
				});
			},
			founcs(vId, $event) {
				let _self = this;
				_self.shopteam = vId.level03_category_name
				_self.shopteam1 = vId.level03_category_name
				let formData = new FormData();
				console.log(vId)
				let formDatamb = new FormData();
				formDatamb.append('level03CategoryCode', vId.level03_category_code);
				//发送请求
				_self.axios.post(_self.ApiurlStorehouse + '/inventory/queryLevel02CategoryCode', formDatamb, {
					// 单独配置
					withCredentials: false
				}).then(response => {

					if (response.data.errcode = '0') {
						_self.options4 = response.data.data.list

					} else {
						_self.$message.error('数据找不到啦');
					}
				}).catch(function(error) {
					_self.$message.error('响应时间过长，请重试');
				});
			},

			//筛选
			screen() {
				let _self = this;
				if(_self.wareblur==''||_self.wareblur==null||_self.wareblur==undefined){
					_self.$message({
						message: '仓库为必选项！',
						type: 'warning'
					});
					return false
				}
					
				if (_self.barcodes == '' && _self.code == '' && _self.shopteam == '' && _self.shopteam22 == '' && _self.shoplei3 ==
					''&&_self.wareblur== '') {
					_self.$message({
						message: '您还什么都没有输入哦！',
						type: 'warning'
					});
					return false
				}
				
				let formData = new FormData();
				formData.append('warehouseCode', _self.wareblurcode);
				formData.append('pageNum', _self.currentPage);
				formData.append('pageSize', _self.pagesize);
				formData.append('barCode', _self.barcodes);
				formData.append('productionName', _self.code);
				formData.append('level01Name', _self.shopteam);
				formData.append('level02Name', _self.shopteam22);
				formData.append('level03Name', _self.shoplei3);
				//发送请求
				_self.axios.post(_self.ApiurlStorehouse + '/inventory/theoryInventoryList', formData, {
							// 单独配置
							withCredentials: false
						}).then(response => {

					if (response.data.errcode = '0') {
						_self.tableData = response.data.data.data.list;
						_self.total = response.data.data.data.total;
					
					} else {
						_self.$message.error('找不到列表信息了');
					}

				}).catch(function(error) {
					_self.$message.error('响应时间过长，请重试');
				});
			},


			current_change: function(currentPage) {
				let _self = this;
				_self.currentPage = currentPage;

				let formData = new FormData();
				formData.append('warehouseCode', _self.wareblurcode);
				formData.append('pageNum', _self.currentPage);
				formData.append('pageSize', _self.pagesize);
				formData.append('barCode', _self.barcodes);
				formData.append('productionName', _self.code);
				formData.append('level01Name', _self.shopteam);
				formData.append('level02Name', _self.shopteam22);
				formData.append('level03Name', _self.shoplei3);
				//发送请求
				_self.axios.post(_self.ApiurlStorehouse + '/inventory/theoryInventoryList', formData, {
							// 单独配置
							withCredentials: false
						}).then(response => {
				
					if (response.data.errcode = '0') {
						_self.tableData = response.data.data.data.list;
						_self.total = response.data.data.data.total;
						
					} else {
						_self.$message.error('找不到列表信息了');
					}
				
				}).catch(function(error) {
					_self.$message.error('响应时间过长，请重试');
				});

			},

		},
		created: function() {
			let _self = this;
			
			_self.OneCategoryCode();
			_self.WarehouseSelection();
		}
	}
</script>
<style>
	.searchBox {
		padding: 0.625rem 0;
		/* border-bottom: 0.0625rem solid rgb(235, 238, 245); */
	}

	.app-contion {
		margin: 10px;
	}

	.btn-box {
		text-align: center;
		margin: 10px;
	}

	.footers {
		position: fixed;
		bottom: 0.625rem;
		left: 210px;
		background: #fff;
		width: 85%;

	}

	.titles {
		font-size: 14px;
		margin-left: 10px;
	}


	.addlistsd12 {
		position: fixed;
		right: 15px;
		top: 65px;
	}

	.w-30 {
		width: 20%;
		display: inline-block;
		text-align: center;
	}

	.title-box {
		margin: 10px 0;
	}

	.images {
		width: 60px;
		height: 60px;
	}

	.images img {
		width: 100%;
	}

	.el-upload--picture-card {
		width: 100px;
		height: 100px;
		line-height: 100px;
	}

	.el-table__body-wrapper {
		overflow-x: auto;
		overflow-y: auto;
	}
	.ChooseStyles{
		margin: 3px 0;
	}
</style>
