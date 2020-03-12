<template>
	<div class="app-contion">
		<div class="btn-box">
			<el-button style="width: 20%;" @click="getdata">已上架</el-button>
			<el-button style="width: 20%;" @click="undercarriage">已下架</el-button>
		</div>
		<div class="comtablewidth">
			<label class="titles">商品名称或编码：</label>
			<el-input v-model="code" placeholder="请输入内容" style="width: 20%;"></el-input>
			<label class="titles">商品品类：</label>
			<el-select v-model="classify" placeholder="请选择" filterable style="width: 20%;">
				<el-option v-for="item in options2" :key="item.categoryCode" :label="item.categoryName" :value="item.categoryCode">
				</el-option>
			</el-select>
			<el-button type="primary" style="padding: 12px 20px;margin-left: 10px;width: 73px;" @click='screen'>查找</el-button>
		</div>
		<div class="addlist">
			<el-button type="success" style="padding: 12px 20px;" @click="add">新增商品</el-button>
		</div>
		<el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange"
		 :height="tableHeight">
			<el-table-column type="selection">
			</el-table-column>
			<el-table-column label="商品图">
				<template slot-scope="scope">
					<div class="images">
						<img :src="scope.row.pic_url" />
					</div>

				</template>
			</el-table-column>
			<el-table-column prop="name" label="商品">
			</el-table-column>
			<el-table-column prop="price" label="零售价格">
			</el-table-column>
			<el-table-column prop="promotional_price" label="促销价格">
			</el-table-column>

			<el-table-column prop="salesCount" label="总销量">
			</el-table-column>
			<el-table-column prop="create_at" label="创建时间">
			</el-table-column>
			<el-table-column prop="production_code" label="商品编码">
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="footers">

			<el-button style="padding: 6px 25px;" @click='upAndDownCommodity'>{{changeup}}</el-button>
		</div>
		<div style="position: fixed;bottom: 0.625rem;right: 0;">
			<el-pagination background layout="prev, pager, next" :total="total" @current-change="current_change">
			</el-pagination>
		</div>

		<!--编辑弹框-->
		<el-dialog title="提示" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
			<div class="title-box">
				<label class="titles w-30">商品名称：</label>
				<el-input v-model="shopname" placeholder="请输入内容" style="width:50%;"></el-input>
			</div>
			<div class="title-box" style="display: flex;flex-wrap: wrap;">
				<label class="titles w-30">商品图片：</label>
				<!-- <el-input v-model="shoppic" placeholder="请输入内容" style="width:50%;"></el-input> -->
				<div style="width: 15%;">
					<img :src="picnew" style="width:100%;" v-if="shoppic==''">
					<img :src="shoppic" style="width:100%;" v-if="picnew==''">
				</div>
				<el-input placeholder="请输入图片本地地址并点击提交" v-model="shoppic" style="width:50%;margin-left: 22%;" class="input-with-select">
					<el-button slot="append" icon="el-icon-search" @click='picClicks' :loading="loading">提交</el-button>
				</el-input>
				<p style="font-size: 12px; color: red;width: 100%;margin-left: 22%;margin-top: 10px;">请输入图片本地地址并点击提交</p>
				<!-- <div class="rz-picter" style="width: 40%;">
				<img :src="shoppic"  style="width: 100%;">
  <input type="file" name="shoppic" id="uppic" accept="image/gif,image/jpeg,image/jpg,image/png" @change="changeImage($event)" ref="avatarInput" class="uppic">

  </div> -->
			</div>

			<div class="title-box">
				<label class="titles w-30">商品分组：</label>
				<el-select v-model="shopteam" placeholder="请选择" filterable style="width:50%;" @change="founcs">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</div>
			<div class="title-box">
				<label class="titles w-30">商品品类：</label>
				<el-select v-model="shoplei" placeholder="请选择" filterable style="width:50%;" @change="founcs2($event)">
					<el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</div>
			<div class="title-box">
				<label class="titles w-30">商品编码：</label>
				<el-input v-model="shopcodes" placeholder="商品编码只能以‘3位数字’的形式填写" style="width:50%;" :disabled="disableds"></el-input>
			</div>
			<div>
				<label class="titles w-30">商品原价：</label>
				<el-input v-model="shopmoney" placeholder="请输入内容" style="width:50%;"></el-input>
			</div>

			<p style="font-size: 0.75rem; color: red;margin-top: 0.625rem;margin-bottom: 0.625rem;margin-left: 22%;">当开启促销价开关时，促销类型和促销价格必填！</p>
			<div style="margin-top: 0.625rem;margin-bottom: 0.625rem;">
				<label class="titles w-30">是否启用促销价：</label>
				<el-switch v-model="kaiguan" active-color="#13ce66" inactive-color="#ff4949">
				</el-switch>
			</div>

			<div style="margin-top: 0.625rem;margin-bottom: 0.625rem;">
				<label class="titles w-30">促销类型：</label>
				<el-select v-model="discountType" filterable placeholder="请选择">
					<el-option v-for="item in discountTypeoptions" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</div>
			<div>
				<label class="titles w-30">促销价格：</label>
				<el-input v-model="promotionalPrice" placeholder="请输入内容" style="width:50%;"></el-input>
			</div>
			<div class="btn-box">
				<!-- <el-checkbox-group v-model="checked" :min="0" :max="1">
					<el-checkbox label="上架" border></el-checkbox>
					<el-checkbox label="下架" border></el-checkbox>
				</el-checkbox-group> -->
				<el-radio-group v-model="checked" size="small">
					<el-radio label="1" border>上架</el-radio>
					<el-radio label="2" border>下架</el-radio>
				</el-radio-group>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleEditup" v-bind:style="{ display: display1 }">保 存</el-button>
				<el-button type="primary" @click="addup" v-bind:style="{ display: display2 }">提 交</el-button>
			</span>
		</el-dialog>
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
				checked: ['上架'],
				avatar: '',
				discountType: '',
				promotionalPrice: '',
				shopname: '',
				discountTypeoptions: [{
					value: 'inner_price',
					label: '员工价'
				}, {
					value: 'inner_disccount',
					label: '内部折扣'
				}, {
					value: 'promotion',
					label: '促销价'
				}],
				shoppic: '',
				shopcodes: '',
				shoplei: '',
				shopmoney: '',
				shopteam: '',
				tableData: [],
				multipleSelection: [],
				total: 10,
				currentPage: 1,
				pagesize: 10,
				code: '',
				classify: '',
				options: [],
				options2: [],
				options3: [],
				isShelves: '',
				dialogVisible: false,
				disableds: true,
				changeup: '下架',
				isShelvesup: '',
				display1: 'none',
				display2: 'none',
				categoryCodes: '',
				categoryNames: '',
				dialogVisible2: false,
				editindex: '',
				picnew: '',
				loading: false,
				indextab: '0',
				tableHeight: window.innerHeight - 220,
				kaiguan: false,
				flag5: '1'
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

			picClicks() {
				let _self = this;
				_self.loading = true
				_self.$notify({
					title: '提示',
					message: '请等待图片上传成功后再保存'
				});
				let formData = new FormData();
				formData.append('shopCode', _self.shopcode);
				formData.append('picUrl', _self.shoppic);
				_self.axios.post(_self.ApiUrl + '/aliyun/util/uploadPic', formData).then(response => {
					console.log(response.data.data.url)
					if (response.data.code == '200') {
						_self.picnew = response.data.data.url
						_self.loading = false
						_self.$message({
							message: '上传图片成功',
							type: 'success'
						});
					} else {
						_self.$message.error('上传图片失败');
					}
				}).catch(function(error) {
					_self.$message.error('数据错误');
				});
			},
			changeImage(e) {
				console.log(e)
				var file = e.target.files[0]
				var pic = e.target.value
				console.log(pic)
				var reader = new FileReader()
				var _self = this

				reader.readAsDataURL(file)
				reader.onload = function(e) {
					console.log(e)
					_self.shoppic = this.result
					var a = document.getElementById('uppic').value
					console.log(_self.shoppic)
					console.log(a)
					let formData = new FormData();
					formData.append('shopCode', _self.shopcode);
					formData.append('picUrl', a);
					_self.axios.post(_self.ApiUrl + '/aliyun/util/uploadPic', formData).then(response => {
						console.log(response)
					}).catch(function(error) {
						_self.$message.error('数据错误');
					});
				}
			},
			preview() {
				let _self = this;
				let formData = new FormData();
				formData.append('shopCode', _self.shopcode);
				formData.append('picUrl', '');
				_self.axios.post('http://localhost:8084/aliyun/util/uploadPic', formData).then(response => {
					console.log(response)
				}).catch(function(error) {
					_self.$message.error('数据错误');
				});
			},

			toggleSelection(rows) {
				if (rows) {
					rows.forEach(row => {
						this.$refs.multipleTable.toggleRowSelection(row);
					});
				} else {
					this.$refs.multipleTable.clearSelection();
				}
			},
			handleSelectionChange(val) {
				let _self = this;
				_self.multipleSelection = val;

			},
			//上下架
			upAndDownCommodity() {
				let _self = this;
				console.log(_self.multipleSelection)
				var productionRrr = [];
				for (var i = 0; i < _self.multipleSelection.length; i++) {
					productionRrr.push(_self.multipleSelection[i].production_code)
				}
				var states = '';
				if (_self.isShelvesup == 'Y') {

					states = 1
				} else {
					states = 0
				}
				console.log(productionRrr)
				let formData = new FormData();
				formData.append('shopCode', _self.shopcode);
				formData.append('productionCode', productionRrr);
				formData.append('state', states);

				//发送请求
				_self.axios.post(_self.ApiUrl + '/commodity/upAndDownCommodity', formData).then(response => {
					console.log(response)
					if (response.data.errcode = '0') {
						if (states == '0') {
							_self.$message({
								message: '已成功上架',
								type: 'success'
							});
							_self.undercarriage();

						} else {
							_self.$message({
								message: '已成功下架',
								type: 'success'
							});
							_self.getdata();
						}


					} else {
						_self.$message.error('数据错误');
					}


				}).catch(function(error) {
					_self.$message.error('响应时间过长，请重试');
				});
			},
			add() {
				let _self = this;
				_self.dialogVisible = true;
				_self.disableds = false;
				_self.display1 = 'none';
				_self.display2 = 'block';
				_self.checked = '';
				_self.shopname = '';
				_self.shoppic = '';
				_self.shopcodes = '';
				_self.shoplei = '';
				_self.shopteam = '';
				_self.shopmoney = '';
				_self.picnew = ''
				_self.kaiguan = false
				_self.promotionalPrice = '';
				_self.discountType = '';
				let formData3 = new FormData();

				_self.axios.post(_self.ApiUrl + '/commodity/chooseCommodityGroup').then(response => {

					if (response.data.errcode = '0') {
						_self.options = response.data.data.list

					} else {
						_self.$message.error('数据错误');
					}


				}).catch(function(error) {
					_self.$message.error('响应时间过长，请重试');
				});
			},
			founcs2(val, $event) {
				let _self = this
				_self.categoryNames = event.target.innerText
				_self.categoryCodes = val

			},
			//新增提交
			addup() {
				let _self = this;
				if (_self.checked == '1') {
					_self.isShelves = 'Y'
				} else {
					_self.isShelves = 'N'
				}
				var regu = "^[0-9]{3}$";
				var re = new RegExp(regu);
				if (_self.shopname == '' || _self.shopcodes == '' || _self.shoplei == '' || _self.shopteam == '' || _self.shopmoney ==
					'' || _self.checked == '') {
					_self.$message({
						type: 'warning',
						message: '请把信息填写完整',
						duration: 10000,
						showClose: true,
					})

					return false
				}
				if (!re.test(_self.shopcodes)) {
					_self.$message({
						type: 'warning',
						message: '商品编码为三位数字形式 ',
						duration: 10000,
						showClose: true,
					})
					return false
				}

				if (_self.kaiguan == true) {
					var promotional = 'Y'
					// var trim = _self.promotionalPrice.indexOf(" ") == -1
					if (_self.promotionalPrice == '' || _self.discountType == '' || _self.promotionalPrice == null || (_self.promotionalPrice.length>0 && _self.promotionalPrice.trim().length == 0)) {
						_self.$message({
							type: 'warning',
							message: '当开启促销价开关时，促销类型和促销价格必填！',
							duration: 10000,
							showClose: true,
						})
						return false
					}
				} else {
					var promotional = 'N'
					_self.promotionalPrice = ''
					_self.discountType = ''
				}
				let formData = new FormData();
				formData.append('shopCode', _self.shopcode);
				formData.append('productionName', _self.shopname);
				if (_self.picnew == '') {
					formData.append('productionPic', _self.shoppic);
				} else {
					formData.append('productionPic', _self.picnew);
				}
				formData.append('productionCode', _self.categoryCodes + _self.shopcodes);
				formData.append('categoryName', _self.categoryNames); //类里边的categoryName
				formData.append('categoryCode', _self.categoryCodes); //品类里边的categoryCode
				formData.append('price', _self.shopmoney);
				formData.append('isShelves', _self.isShelves);
				formData.append('promotionalPriceState', promotional);
				formData.append('promotionalPrice', _self.promotionalPrice);
				formData.append('discountType', _self.discountType);

				//发送请求
				console.log(_self.isShelves)
				_self.axios.post(_self.ApiUrl + '/commodity/addCommodity', formData).then(response => {

					if (response.data.errcode == '0') {
						_self.dialogVisible = false
						_self.kaiguan = false
						_self.$message({
							message: '新增成功',
							type: 'success'
						});
						if (_self.flag5 == '3') {
							_self.screen();
						} else if (_self.flag5 == '2') {
							_self.undercarriage();
						} else if (_self.flag5 == '1') {
							_self.getdata();
						}

					} else if (response.data.errcode == '2') {
						_self.$message.error('参数不全，请重新填写');
					} else if (response.data.errcode == '1003') {
						_self.$message.error(response.data.errmsg);
					}


				}).catch(function(error) {
					_self.$message.error('响应时间过长，请重试');
				});
			},
			handleEdit(index) {
				let _self = this;
				_self.dialogVisible = true;
				_self.display1 = 'block';
				_self.picnew = ''
				_self.display2 = 'none';
				_self.editindex = index
				_self.shopname = _self.tableData[index].name;
				_self.shoppic = _self.tableData[index].pic_url;
				_self.shopcodes = _self.tableData[index].production_code;
				_self.shoplei = _self.tableData[index].category_name;
				_self.shopteam = _self.tableData[index].level02_category_name;
				_self.shopmoney = _self.tableData[index].price;
				_self.disableds = true;

				if (_self.tableData[index].promotional_price_switch == 'Y') {
					_self.kaiguan = true
				} else {
					_self.kaiguan = false
				}
				if (_self.tableData[index].state == 'Y') {
					_self.checked = '1'
				} else {
					_self.checked = '2'
				}
				_self.promotionalPrice = _self.tableData[index].promotional_price;
				_self.discountType = _self.tableData[index].discount_type;
				let formData3 = new FormData();
				_self.axios.post(_self.ApiUrl + '/commodity/chooseCommodityGroup').then(response => {

					if (response.data.errcode = '0') {
						_self.options = response.data.data.list
						let formData = new FormData();

						formData.append('categoryCode', _self.tableData[index].level02_category_code);
						//发送请求
						_self.axios.post(_self.ApiUrl + '/commodity/chooseCategoryCode', formData).then(response => {

							if (response.data.errcode = '0') {
								_self.options3 = response.data.data.list
							} else {
								_self.$message.error('数据找不到啦');
							}


						}).catch(function(error) {
							_self.$message.error('响应时间过长，请重试');
						});
					} else {
						_self.$message.error('数据找不到啦');
					}


				}).catch(function(error) {
					_self.$message.error('响应时间过长，请重试');
				});

			},
			founcs(vId) {
				let _self = this;

				let formData = new FormData();

				formData.append('categoryCode', vId);
				//发送请求
				_self.axios.post(_self.ApiUrl + '/commodity/chooseCategoryCode', formData).then(response => {
					console.log(response)
					if (response.data.errcode = '0') {
						_self.options3 = response.data.data.list

					} else {
						_self.$message.error('数据找不到啦');
					}


				}).catch(function(error) {
					_self.$message.error('响应时间过长，请重试');
				});
			},
			handleEditup() {
				let _self = this;
				console.log(_self.checked)
				if (_self.checked == '1') {
					_self.isShelves = 'Y'
				} else {
					_self.isShelves = 'N'
				}

				// 				let formData1 = new FormData();
				// 						formData1.append('shopCode', _self.shopcode);
				// 						formData1.append('picUrl',_self.shoppic);
				// 				_self.axios.post(_self.ApiUrl + '/aliyun/util/uploadPic', formData1).then(response => {
				// 							console.log(response.data.data.url )
				// 							if(response.data.code=='200'){
				// 								_self.picnew=response.data.data.url
				// 							}
				// 						}).catch(function(error) {
				// 							_self.$message.error('图片加载错误');
				// 						});

				if (_self.shopname == '' || _self.shopcodes == '' || _self.shoplei == '' || _self.shopteam == '' || _self.shopmoney ==
					'') {
					_self.$message({
						type: 'warning',
						message: '请把信息填写完整',
						duration: 10000,
						showClose: true,
					})

					return false
				}
				if (_self.kaiguan == true) {
					var promotional = 'Y'
					// var trim = _self.promotionalPrice.indexOf(" ") == -1

					if (_self.promotionalPrice == '' || _self.discountType == '' || _self.promotionalPrice == null || (_self.promotionalPrice.length>0 && _self.promotionalPrice.trim().length == 0)) {
						_self.$message({
							type: 'warning',
							message: '当开启促销价开关时，促销类型和促销价格必填！',
							duration: 10000,
							showClose: true,
						})
						return false
					}
				} else {
					var promotional = 'N'
					// 					_self.$message({
					// 						type: 'warning',
					// 						message: '当开启促销价关闭时，促销类型和促销价格不可填！',
					// 						duration: 10000,
					// 						showClose: true,
					// 					})
					_self.promotionalPrice = ''
					_self.discountType = ''
				}
				let formData = new FormData();
				formData.append('shopCode', _self.shopcode);
				formData.append('productionName', _self.shopname);
				if (_self.picnew == '') {
					formData.append('productionPic', _self.shoppic);
				} else {
					formData.append('productionPic', _self.picnew);
				}
				formData.append('productionCode', _self.shopcodes);
				if (_self.categoryNames == '') {
					formData.append('categoryName', _self.shoplei);
				} else {
					formData.append('categoryName', _self.categoryNames);
				}
				if (_self.categoryCodes == '') {
					formData.append('categoryCode', _self.tableData[_self.editindex].category_code);
				} else {
					formData.append('categoryCode', _self.categoryCodes);
				}
				formData.append('price', _self.shopmoney);
				formData.append('isShelves', _self.isShelves);
				formData.append('promotionalPriceState', promotional);
				formData.append('promotionalPrice', _self.promotionalPrice);
				formData.append('discountType', _self.discountType);

				console.log(_self.isShelves)
				//发送请求
				_self.axios.post(_self.ApiUrl + '/commodity/editorCommodity', formData).then(response => {

					if (response.data.errcode = '0') {
						_self.kaiguan = false
						_self.dialogVisible = false
						_self.$message({
							message: '编辑成功',
							type: 'success'
						});
						// 						if (_self.isShelvesup == 'Y') {
						// 							_self.getdata();
						// 							_self.shopname = '';
						// 							_self.shoppic = '';
						// 							_self.shopcodes = '';
						// 							_self.shoplei = '';
						// 							_self.shopteam = '';
						// 							_self.shopmoney = '';
						// 						} else {
						//
						// 							_self.undercarriage();
						// 						}
						if (_self.flag5 == '3') {
							_self.screen();
						} else if (_self.flag5 == '2') {
							_self.undercarriage();
						} else if (_self.flag5 == '1') {
							_self.getdata();
						}
					} else {
						_self.$message.error('保存失败，请重新填写');
					}


				}).catch(function(error) {
					_self.$message.error('响应时间过长，请重试');
				});
			},
			//筛选
			screen() {
				let _self = this;
				if(_self.classify==''&&_self.code==''){
					_self.$message({
						type: 'warning',
						message: '您没有输入任何查找内容哦！',
						showClose: true,
					})
					return false
				}
				_self.flag5 = '3'
				_self.currentPage = '1'
				let formData = new FormData();
				formData.append('shopCode', _self.shopcode);
				formData.append('pageNum', _self.currentPage);
				formData.append('pageSize', _self.pagesize);
				formData.append('production', _self.code);
				formData.append('categoryCode', _self.classify);
				//发送请求
				_self.axios.post(_self.ApiUrl + '/commodity/queryCommodity', formData).then(response => {

					if (response.data.errcode = '0') {

						_self.tableData = response.data.data.data.list;
						_self.total = response.data.data.data.total;
						_self.indextab = '1'
					} else {
						_self.$message.error('找不到数据了');
					}

				}).catch(function(error) {
					_self.$message.error('响应时间过长，请重试');
				});
			},
			//上架商品
			getdata() {
				let _self = this;
				_self.isShelvesup = 'Y';
				_self.flag5 = '1'
				_self.isShelves = 'Y'
				let formData = new FormData();
				formData.append('shopCode', _self.shopcode);
				formData.append('pageNum', _self.currentPage);
				formData.append('pageSize', _self.pagesize);
				formData.append('state', _self.isShelvesup);
				//发送请求
				_self.axios.post(_self.ApiUrl + '/commodity/CommodityLists', formData).then(response => {

					if (response.data.errcode = '0') {
						_self.tableData = response.data.data.data.list
						_self.total = response.data.data.data.total
						_self.indextab = '0'
						//发送请求
						let formData1 = new FormData();
						formData1.append('shopCode', _self.shopcode);
						formData1.append('pageNum', '1');
						formData1.append('pageSize', '100');
						_self.axios.post(_self.ApiUrl + '/category/categoryList', formData1).then(response => {

							if (response.data.errcode = '0') {

								_self.options2 = response.data.data.list.list
							} else {
								_self.$message.error('找不到商品品类了');
							}

						}).catch(function(error) {
							_self.$message.error('响应时间过长，请重试');
						});
						//发送请求
						_self.changeup = "下架"
					} else {
						_self.$message.error('数据错误');
					}


				}).catch(function(error) {
					_self.$message.error('响应时间过长，请重试');
				});
			},
			undercarriage() {
				let _self = this;
				_self.isShelvesup = 'N'
				_self.isShelves = 'N'
				_self.flag5 = '2'
				_self.currentPage = '1'
				let formData = new FormData();
				formData.append('shopCode', _self.shopcode);
				formData.append('pageNum', _self.currentPage);
				formData.append('pageSize', _self.pagesize);
				formData.append('state', _self.isShelvesup);
				//发送请求
				_self.axios.post(_self.ApiUrl + '/commodity/CommodityLists', formData).then(response => {

					if (response.data.errcode = '0') {
						_self.tableData = response.data.data.data.list
						_self.total = response.data.data.data.total
						_self.changeup = "上架"
						//发送请求
						let formData1 = new FormData();
						formData1.append('shopCode', _self.shopcode);
						formData1.append('pageNum', '1');
						formData1.append('pageSize', '100');
						_self.axios.post(_self.ApiUrl + '/category/categoryList', formData1).then(response => {

							if (response.data.errcode = '0') {

								_self.options2 = response.data.data.list.list
							} else {
								_self.$message.error('找不到商品品类了');
							}

						}).catch(function(error) {
							_self.$message.error('响应时间过长，请重试');
						});

					} else {
						_self.$message.error('数据错误');
					}


				}).catch(function(error) {
					_self.$message.error('响应时间过长，请重试');
				});
			},
			current_change: function(currentPage) {
				let _self = this;
				console.log(_self.isShelvesup)
				console.log(_self.indextab)
				_self.currentPage = currentPage;
				if (_self.isShelvesup == 'Y') {
					if (_self.indextab == '0') {
						_self.isShelvesup = 'Y'
						let formData = new FormData();
						formData.append('shopCode', _self.shopcode);
						formData.append('pageNum', _self.currentPage);
						formData.append('pageSize', _self.pagesize);
						formData.append('state', _self.isShelvesup);
						//发送请求
						_self.axios.post(_self.ApiUrl + '/commodity/CommodityLists', formData).then(response => {

							if (response.data.errcode = '0') {
								_self.tableData = response.data.data.data.list
								_self.total = response.data.data.data.total
								_self.indextab = '0'
								let formData1 = new FormData();
								formData1.append('shopCode', _self.shopcode);
								formData1.append('pageNum', '1');
								formData1.append('pageSize', '100');
								_self.axios.post(_self.ApiUrl + '/category/categoryList', formData1).then(response => {

									if (response.data.errcode = '0') {

										_self.options2 = response.data.data.list.list
									} else {
										_self.$message.error('找不到商品品类了');
									}

								}).catch(function(error) {
									_self.$message.error('响应时间过长，请重试');
								});
								//发送请求
								_self.changeup = "下架"
							} else {
								_self.$message.error('数据找不到啦');
							}


						}).catch(function(error) {
							_self.$message.error('响应时间过长，请重试');
						});
					} else {

						let formData = new FormData();
						formData.append('shopCode', _self.shopcode);
						formData.append('pageNum', _self.currentPage);
						formData.append('pageSize', _self.pagesize);
						formData.append('production', _self.code);
						formData.append('categoryCode', _self.classify);
						//发送请求
						_self.axios.post(_self.ApiUrl + '/commodity/queryCommodity', formData).then(response => {

							if (response.data.errcode = '0') {

								_self.tableData = response.data.data.data.list;
								_self.total = response.data.data.data.total;
								_self.indextab = '1'
							} else {
								_self.$message.error('找不到商品品类了');
							}

						}).catch(function(error) {
							_self.$message.error('响应时间过长，请重试');
						});
					}

				} else {
					if (_self.indextab == '0') {
						_self.isShelvesup = 'N'
						//_self.currentPage = '1'
						let formData = new FormData();
						formData.append('shopCode', _self.shopcode);
						formData.append('pageNum', _self.currentPage);
						formData.append('pageSize', _self.pagesize);
						formData.append('state', _self.isShelvesup);
						//发送请求
						_self.axios.post(_self.ApiUrl + '/commodity/CommodityLists', formData).then(response => {

							if (response.data.errcode = '0') {
								_self.tableData = response.data.data.data.list
								_self.total = response.data.data.data.total
								_self.changeup = "上架"
								//发送请求
								let formData2 = new FormData();
								let formData1 = new FormData();
								formData1.append('shopCode', _self.shopcode);
								formData1.append('pageNum', '1');
								formData1.append('pageSize', '100');
								_self.axios.post(_self.ApiUrl + '/category/categoryList', formData1).then(response => {

									if (response.data.errcode = '0') {

										_self.options2 = response.data.data.list
									} else {
										_self.$message.error('找不到商品品类了');
									}

								}).catch(function(error) {
									_self.$message.error('响应时间过长，请重试');
								});

							} else {
								_self.$message.error('数据找不到啦');
							}


						}).catch(function(error) {
							_self.$message.error('响应时间过长，请重试');
						});
					} else {
						//_self.currentPage = '1'
						let formData = new FormData();
						formData.append('shopCode', _self.shopcode);
						formData.append('pageNum', _self.currentPage);
						formData.append('pageSize', _self.pagesize);
						formData.append('production', _self.code);
						formData.append('categoryCode', _self.classify);
						//发送请求
						_self.axios.post(_self.ApiUrl + '/commodity/queryCommodity', formData).then(response => {

							if (response.data.errcode = '0') {

								_self.tableData = response.data.data.data.list;
								_self.total = response.data.data.data.total;
								_self.indextab = '1'
							} else {
								_self.$message.error('找不到商品品类了');
							}

						}).catch(function(error) {
							_self.$message.error('响应时间过长，请重试');
						});
					}
				}
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


	.addlist {
		position: fixed;
		right: 15px;
		top: 125px;
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

	.comtablewidth {
		width: 70%;
	}

	@media screen and (max-width:957px) {
		.comtablewidth {
			width: 60%;
		}

	}
</style>
