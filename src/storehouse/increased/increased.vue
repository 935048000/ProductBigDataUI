<template>
	<div class="app-contion">
		<el-row class="mar-increased">
			<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" style='margin: 0;width: auto;padding: 0;border: 0;'>
				<el-col :span="12">
					<div class="grid-content bg-purple f-s">
						<el-form-item label="商品名称" prop="productionName">
							<el-input v-model="ruleForm.productionName" placeholder="请输入商品名称"></el-input>
						</el-form-item>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="grid-content bg-purple f-s">
						<el-form-item label="一级品类" prop="CategoryName">
							<el-select v-model="ruleForm.CategoryName" :multiple='false' filterable allow-create default-first-option
							 placeholder="请选择商品品类" style='width: 100%;'  @change="wareblur">
								<el-option v-for="item in options":key="item.level03_category_code" :label="item.level03_category_name" :value="item">
								</el-option>
							</el-select>
						</el-form-item>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="grid-content bg-purple f-s">
						<el-form-item label="二级品类" prop="shopteam2">
							<el-select v-model="ruleForm.shopteam2" :multiple='false' filterable allow-create default-first-option
							 placeholder="请选择商品品类" style='width: 100%;'  @change="wareblur2">
								<el-option v-for="item in options2" :key="item.level02_category_code" :label="item.level02_category_name" :value="item">
								</el-option>
							</el-select>
						</el-form-item>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="grid-content bg-purple f-s">
						<el-form-item label="三级品类" prop="shoplei">
							<el-select v-model="ruleForm.shoplei" :multiple='false' filterable allow-create default-first-option
							 placeholder="请选择商品品类" style='width: 100%;'  @change="wareblur3">
								<el-option v-for="item in options3" :key="item.level01_category_code" :label="item.level01_category_name" :value="item">
								</el-option>
							</el-select>
						</el-form-item>
					</div>
				</el-col>
				<!-- <el-col :span="12">
					<div class="grid-content bg-purple f-s">
						<el-form-item label="规格名称" prop="age">
							<el-input v-model.number="ruleForm.age"></el-input>
						</el-form-item>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="grid-content bg-purple f-s">
						<el-form-item label="规格编码" prop="age">
							<el-input v-model.number="ruleForm.age"></el-input>
						</el-form-item>
					</div>
				</el-col> -->
				<el-col :span="12">
					<div class="grid-content bg-purple f-s">
						<el-form-item label="商品编码" prop="productionCode">
							<el-input v-model="ruleForm.productionCode" placeholder="商品编码为四位数字形式"></el-input>
						</el-form-item>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="grid-content bg-purple f-s">
						<el-form-item label="商品条形码" prop="barCode">
							<el-input v-model="ruleForm.barCode" placeholder="请输入商品条形码"></el-input>
						</el-form-item>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="grid-content bg-purple f-s">
						<el-form-item label="供应商名称" prop="providerName">
							<el-input v-model="ruleForm.providerName" placeholder="请输入供应商名称"></el-input>
						</el-form-item>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="grid-content bg-purple f-s">
						<el-form-item label="供应商编码" prop="providerCode">
							<el-input v-model="ruleForm.providerCode" placeholder="请输入供应商编码"></el-input>
						</el-form-item>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="grid-content bg-purple f-s">
						<el-form-item label="进货价" prop="cost">
							<el-input v-model="ruleForm.cost" placeholder="请输入进货价"></el-input>
						</el-form-item>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="grid-content bg-purple f-s">
						<el-form-item label="零售价" prop="price">
							<el-input v-model="ruleForm.price" placeholder="请输入零售价"></el-input>
						</el-form-item>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="grid-content bg-purple f-s">
						<el-form-item label="商品单位" prop="unit">
							<el-input v-model="ruleForm.unit" placeholder="请输入商品单位"></el-input>
						</el-form-item>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="grid-content bg-purple f-s footer-increased">
						<el-form-item class='btnbox-increased'>
							<el-button type="primary" @click="submitForm('ruleForm')" class='wids'>确定</el-button>
							<el-button @click="resetForm('ruleForm')" class='wids'>重置</el-button>
						</el-form-item>
					</div>
				</el-col>
			</el-form>
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
				ruleForm: {
					productionName: '',
					CategoryName: '',
					productionCode: '',
					barCode: '',
					providerName: '',
					providerCode: '',
					cost: '',
					price: '',
					unit:'',
					shopteam2:'',
					shoplei:''
				},
				rules: {
					productionName: [{
							required: true,
							message: '请输入商品名称',
							trigger: 'blur'
						},

					],
					CategoryName: [

						{
							required: true,
							message: '请选择或输入商品品类名称',
							trigger: 'change'
						}
					],
					productionCode: [{
						required: true,
						message: '请输入商品品类编码',
						trigger: 'blur'
					}, ],unit: [{
						required: true,
						message: '请输入商品单位',
						trigger: 'blur'
					}, ],
					barCode: [{
						required: true,
						message: '请输入商品条码',
						trigger: 'blur'
					}, ],
					providerName: [{
						required: true,
						message: '请输入供应商名称',
						trigger: 'blur'
					}, ],
					providerCode: [{
						required: true,
						message: '请输入供应商编码',
						trigger: 'blur'
					}, ],
					cost: [{
						required: true,
						message: '请输入进货价',
						trigger: 'blur'
					}, ],
					price: [{
						required: true,
						message: '请输入零售价',
						trigger: 'blur'
					}, ],
					shopteam2: [{
							required: true,
							message: '请选择二级品类',
							trigger: 'change'
						},
					
					],
					shoplei: [{
							required: true,
							message: '请选择三级品类',
							trigger: 'change'
						},
					
					],
				},
				options: [],
				options2: [],
				options3: [],
				CategoryName: [],
				CategoryCode:''
			};
		},
		methods: {
			submitForm(formName) {
				let _self = this;
				_self.$refs[formName].validate((valid) => {
					if (valid) {
						var regu = "^[0-9]{4}$";
						var re = new RegExp(regu);
							if (!re.test(_self.ruleForm.productionCode)) {
							_self.$message({
								type: 'warning',
								message: '商品编码为四位数字形式 ',
								duration: 10000,
								showClose: true,
							})
							return false
						}
						let formData = new FormData();
						formData.append('productionCode',_self.CategoryCode+_self.ruleForm.productionCode);
						formData.append('productionName', _self.ruleForm.productionName);
						formData.append('cost', _self.ruleForm.cost);
						formData.append('price',_self.ruleForm.price);
						formData.append('categoryName', _self.ruleForm.shoplei);
						formData.append('categoryCode', _self.CategoryCode);
						formData.append('barCode', _self.ruleForm.barCode);
						formData.append('providerName',_self.ruleForm.providerName);
						formData.append('providerCode',_self.ruleForm.providerCode);
						formData.append('unit',_self.ruleForm.unit);
						_self.axios.post(_self.ApiurlStorehouse+'/inventory/createProductions',formData, {
							// 单独配置
							withCredentials: false
						}).then(response => {
							console.log(response)
							if (response.data.errcode == '0') {
								_self.$message({
									message: '新增成功',
									type: 'success'
								});
								 _self.$refs[formName].resetFields();
							} else {
								_self.$message.error(response.data.errmsg);
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
			wareblur(vId) {
				let _self = this;
				console.log(vId)
 				// _self.ruleForm.CategoryName = vId.level01_category_name
 				// _self.ruleForm.CategoryCode =vId.level01_category_code
						_self.ruleForm.CategoryName = vId.level03_category_name
				
				let formDatamb = new FormData();
				formDatamb.append('level03CategoryCode', vId.level03_category_code);
				//发送请求
				_self.axios.post(_self.ApiurlStorehouse + '/inventory/queryLevel02CategoryCode', formDatamb, {
							// 单独配置
							withCredentials: false
						}).then(response => {
				
					if (response.data.errcode = '0') {
						
						_self.options2 = response.data.data.list
				
					} else {
						_self.$message.error('品类找不到啦');
					}
					}).catch(function(error) {
				_self.$message.error('响应时间过长，请重试');
				});
			},
			wareblur2(val) {
				let _self = this
				console.log(val)
			_self.ruleForm.shopteam2 = val.level02_category_name
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
					_self.$message.error('品类找不到啦');
				}
				}).catch(function(error) {
			_self.$message.error('响应时间过长，请重试');
			});
			},
			wareblur3(val) {
				let _self = this
			
				_self.ruleForm.shoplei =  val.level01_category_name
				_self.CategoryCode =  val.level01_category_code
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			}, 
			getcategory() {
		let _self = this;
		let formData3 = new FormData();
		_self.axios.post(_self.ApiurlStorehouse + '/inventory/queryLevel01CategoryCode',formData3, {
			// 单独配置
			withCredentials: false
		}).then(response => {
		
			if (response.data.errcode = '0') {
				_self.options = response.data.data.list
		
			} else {
				_self.$message.error('品类找不到啦');
			}
				}).catch(function(error) {
		_self.$message.error('响应时间过长，请重试');
		});
			}
		},
		created: function() {
			let _self = this;
			_self.getcategory();
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
</style>
