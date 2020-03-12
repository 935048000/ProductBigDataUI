<template>
	<div class="app-contion">
		<div class="table-box" style="margin-bottom: 60px;">
		
			<el-button type="success" class="daochu" @click="add">新增</el-button>
		</div>
		<div id="tableid">
			<el-table :data="tableData" border style="width: 100%" :height="tableHeight">
				<el-table-column label="店铺背景">
					<template slot-scope="scope">
						<div class="images">
							<img :src="scope.row.shopPic" />
						</div>
				</template>
				</el-table-column>
				<el-table-column label="店铺头像">
					<template slot-scope="scope">
						<div class="images">
							<img :src="scope.row.shopHeadPic" />
						</div>
				</template>
				</el-table-column>
				<el-table-column prop="city" label="城市">
				</el-table-column>
				<el-table-column prop="province" label="省份">
				</el-table-column>
				<el-table-column prop="shopName" label="店铺">
				</el-table-column>
				<el-table-column prop="shopCode" label="店铺编码">
				</el-table-column>
				<el-table-column prop="type" label="店铺类型">
				</el-table-column>
				<el-table-column prop="shopLation" label="地址">
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 编辑弹框 -->
		<el-dialog title="编辑" :visible.sync="dialogVisible" width="45%" :before-close="handleClose">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="店铺编码" prop="shopCode">
					<el-input v-model="ruleForm.shopCode" disabled="disabled"></el-input>
				</el-form-item>
				<el-form-item label="店铺名称" prop="shop_name">
					<el-input v-model="ruleForm.shop_name"></el-input>
				</el-form-item>
				<el-form-item label="店铺类型" prop="type">
					<el-input v-model="ruleForm.type"></el-input>
				</el-form-item>
				<el-form-item label="省份" prop="province">
					<el-input v-model="ruleForm.province"></el-input>
				</el-form-item>
				<el-form-item label="市" prop="city">
					<el-input v-model="ruleForm.city"></el-input>
				</el-form-item>
				<el-form-item label="地址" prop="shop_location">
					<el-input v-model="ruleForm.shop_location"></el-input>
				</el-form-item>
				<el-form-item label="店铺开放" prop="state">
					<el-input v-model="ruleForm.state"></el-input>
				</el-form-item>
				<el-form-item label="店铺流水" prop="sequence_init_number">
					<el-input v-model="ruleForm.sequence_init_number"></el-input>
				</el-form-item>
				<el-form-item label="shop_pic" prop="店铺背景">
					<el-input v-model="ruleForm.shop_pic"></el-input>
				</el-form-item>
				<el-form-item label="head_pic" prop="店铺头像">
					<el-input v-model="ruleForm.head_pic"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 新增弹框 -->
		<el-dialog title="新增" :visible.sync="dialogVisible2" width="45%" >
			<el-form :model="ruleForm2" :rules="rules" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
				<el-form-item label="店铺编码" prop="shopCode">
					<el-input v-model="ruleForm2.shopCode"></el-input>
				</el-form-item>
				<el-form-item label="店铺名称" prop="shop_name">
					<el-input v-model="ruleForm2.shop_name"></el-input>
				</el-form-item>
				<el-form-item label="店铺类型" prop="type">
					<el-input v-model="ruleForm2.type"></el-input>
				</el-form-item>
				<el-form-item label="省份" prop="province">
					<el-input v-model="ruleForm2.province"></el-input>
				</el-form-item>
				<el-form-item label="市" prop="city">
					<el-input v-model="ruleForm2.city"></el-input>
				</el-form-item>
				<el-form-item label="地址" prop="shop_location">
					<el-input v-model="ruleForm2.shop_location"></el-input>
				</el-form-item>
				<el-form-item label="店铺开放" prop="state">
					<el-input v-model="ruleForm2.state"></el-input>
				</el-form-item>
				<el-form-item label="店铺流水" prop="sequence_init_number">
					<el-input v-model="ruleForm2.sequence_init_number"></el-input>
				</el-form-item>
				<el-form-item label="店铺背景" prop="shop_pic">
					<el-input v-model="ruleForm2.shop_pic"></el-input>
				</el-form-item>
				<el-form-item label="店铺头像" prop="head_pic">
					<el-input v-model="ruleForm2.head_pic"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible2 = false">取 消</el-button>
				<el-button type="primary" @click="addup('ruleForm2')">确 定</el-button>
			</span>
		</el-dialog>
		
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
				dialogVisible: false, //编辑弹框,
				ruleForm: {
					shopCode: '',
					shop_name: '',
					type: '',
					province: '',
					city: '',
					shop_location: '',
					state: '',
					sequence_init_number: '',
					shop_pic: '',
					head_pic: '',
				},
				tableHeight:window.innerHeight - 150,
				dialogVisible2:false,
				ruleForm2: {
					shopCode: '',
					shop_name: '',
					type: '',
					province: '',
					city: '',
					shop_location: '',
					state: '',
					sequence_init_number: '',
					shop_pic: '',
					head_pic: '',
				},
				rules: {
					shopCode: [{
						required: true,
						message: '请输入店铺编码',
						trigger: 'blur'
					}],
					shop_name: [{
						required: true,
						message: '请输入店铺名称',
						trigger: 'blur'
					}],
					type: [{
						required: true,
						message: '请输入店铺类型',
						trigger: 'blur'
					}],
					province: [{
						required: true,
						message: '请输入省份',
						trigger: 'blur'
					}],
					city: [{
						required: true,
						message: '请输入市',
						trigger: 'blur'
					}],
					shop_location: [{
						required: true,
						message: '请输入地址',
						trigger: 'blur'
					}]
				},
			
			}
		},
		methods: {
			

			//获取table数据
			getdata() {
				let _self = this
				_self.axios.post(_self.ApiUrl + '/commodity/getShopList').then(response => {
					if (response.data.errcode == '0') {
						_self.tableData = response.data.data.list
					}
				}).catch(function(error) {
					_self.$message.error('商铺列表加载时间过长，请刷新重试');
				});
			},
			//编辑
			handleEdit(index) {
			let _self = this;
				_self.dialogVisible = true;
				_self.ruleForm.shopCode = _self.tableData[index].shopCode;
				_self.ruleForm.shop_name = _self.tableData[index].shopName
				_self.ruleForm.type = _self.tableData[index].type
				_self.ruleForm.province = _self.tableData[index].province
				_self.ruleForm.city = _self.tableData[index].city
				_self.ruleForm.shop_location = _self.tableData[index].shopLation
				_self.ruleForm.state = _self.tableData[index].state
				_self.ruleForm.sequence_init_number = _self.tableData[index].sequence_init_number
				_self.ruleForm.shop_pic = _self.tableData[index].shopPic
				_self.ruleForm.head_pic = _self.tableData[index].shopHeadPic
			},
			
			//编辑提交
			submitForm(formName) {
				let _self=this;
				_self.$refs[formName].validate((valid) => {
					if (valid) {
						let formData = new FormData();
						formData.append('shopCode', _self.ruleForm.shopCode);
						formData.append('shop_name',_self.ruleForm.shop_name);
						formData.append('type', _self.ruleForm.type);
						formData.append('province',_self.ruleForm.province);
						formData.append('city',_self.ruleForm.city);
						formData.append('shop_location',_self.ruleForm.shop_location);
						formData.append('state',_self.ruleForm.state);
						formData.append('sequence_init_number',_self.ruleForm.sequence_init_number);
						formData.append('shop_pic',_self.ruleForm.shop_pic);
						formData.append('head_pic',_self.ruleForm.head_pic);
						_self.axios.post(_self.ApiUrl + '/commodity/editorShop', formData).then(response => {
							if (response.data.errcode == '0') {
								_self.dialogVisible = false;
									_self.$message({
									message: '编辑成功',
									type: 'success'
								});
								
								_self.getdata();
							}else{
								_self.$message.error('编辑失败');
							}
						}).catch(function(error) {
							_self.$message.error('响应时间过长，请重试');
						});
						
					} else {
						
						return false;
					}
				})
			},
			//新增
			add(){
				let _self=this;
				_self.dialogVisible2 = true
			},
			//新增提交
			addup(formName){
					let _self=this;
			_self.$refs[formName].validate((valid) => {
					if (valid) {
						let formData = new FormData();
						formData.append('shopCode', _self.ruleForm2.shopCode);
						formData.append('shop_name',_self.ruleForm2.shop_name);
						formData.append('type', _self.ruleForm2.type);
						formData.append('province',_self.ruleForm2.province);
						formData.append('city',_self.ruleForm2.city);
						formData.append('shop_location',_self.ruleForm2.shop_location);
						formData.append('state',_self.ruleForm2.state);
						formData.append('sequence_init_number',_self.ruleForm2.sequence_init_number);
						formData.append('shop_pic',_self.ruleForm2.shop_pic);
						formData.append('head_pic',_self.ruleForm2.head_pic);
						_self.axios.post(_self.ApiUrl + '/commodity/addShop', formData).then(response => {
							if (response.data.errcode == '0') {
								_self.dialogVisible2 = false;
									_self.$message({
									message: '新增成功',
									type: 'success'
								});
								_self.getdata();
							}else{
								_self.$message.error('新增失败');
							}
						}).catch(function(error) {
							_self.$message.error('响应时间过长，请重试');
						});
						
					} else {
					
						return false;
					}
				})
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
	.images {
		width: 60px;
		height: 60px;
	}
	
	.images img {
		width: 100%;
	}
</style>
