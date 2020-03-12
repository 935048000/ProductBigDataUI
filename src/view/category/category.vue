<template>
	<div class="app-contion">
		<div class="table-box" style="margin-bottom: 20px;">
			<el-input v-model="search" placeholder="请输入内容" style="width: 25%;"></el-input>
			<el-button type="primary" @click='searchup'>查询</el-button>
			<el-button type="success" class="daochu" @click="add">新增</el-button>
		</div>
		<div id="tableid">
			<el-table :data="tableData" border style="width: 100%" :height="tableHeight">
				<el-table-column prop="sub_category" label="品类编码">
				</el-table-column>
				<el-table-column prop="sub_category_name" label="品类名称">
				</el-table-column>
				<el-table-column prop="level02_category_code" label="品类分组编码">
				</el-table-column>
				<el-table-column prop="level02_category_name" label="品类分组名称">
				</el-table-column>
				<el-table-column prop="create_at" label="品类分创建时间">
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button size="mini" type="danger" @click="deletes(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 编辑弹框 -->
		<el-dialog title="编辑" :visible.sync="dialogVisible" width="45%" :before-close="handleClose">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="品类id" prop="id">
					<el-input v-model="ruleForm.id"></el-input>
				</el-form-item>
				<el-form-item label="品类编码" prop="sub_category">
					<el-input v-model="ruleForm.sub_category"></el-input>
				</el-form-item>
				<el-form-item label="品类名称" prop="sub_category_name">
					<el-input v-model="ruleForm.sub_category_name"></el-input>
				</el-form-item>
				<el-form-item label="分组名称" prop="level02_category_name">
					<el-input v-model="ruleForm.level02_category_name"></el-input>
				</el-form-item>
				<el-form-item label="分组编码" prop="level02_category_code">
					<el-input v-model="ruleForm.level02_category_code"></el-input>
				</el-form-item>
				<el-form-item label="备注编码" prop="comments_group_code">
					<el-input v-model="ruleForm.comments_group_code"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addup('ruleForm2')">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 新增弹框 -->
		<el-dialog title="新增" :visible.sync="dialogVisible2" width="45%" >
			<el-form :model="ruleForm2" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				
				<el-form-item label="品类编码" prop="sub_category">
					<el-input v-model="ruleForm2.sub_category"></el-input>
				</el-form-item>
				<el-form-item label="品类名称" prop="sub_category_name">
					<el-input v-model="ruleForm2.sub_category_name"></el-input>
				</el-form-item>
				<el-form-item label="分组名称" prop="level02_category_name">
					<el-input v-model="ruleForm2.level02_category_name"></el-input>
				</el-form-item>
				<el-form-item label="分组编码" prop="level02_category_code">
					<el-input v-model="ruleForm2.level02_category_code"></el-input>
				</el-form-item>
				<el-form-item label="备注编码" prop="comments_group_code">
					<el-input v-model="ruleForm2.comments_group_code"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible2 = false">取 消</el-button>
				<el-button type="primary" @click="addup('ruleForm')">确 定</el-button>
			</span>
		</el-dialog>
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
				tabindex:0,
				tableData: [],
				dialogVisible: false, //编辑弹框,
				ruleForm: {
					id: '',
					sub_category: '',
					sub_category_name: '',
					level02_category_name: '',
					level02_category_code: '',
					comments_group_code: ''
				},
				tableHeight:window.innerHeight - 190,
				dialogVisible2:false,
				ruleForm2: {
					id: '',
					sub_category: '',
					sub_category_name: '',
					level02_category_name: '',
					level02_category_code: '',
					comments_group_code: ''
				},
				rules: {
					id: [{
						required: true,
						message: '请输入品类id',
						trigger: 'blur'
					}],
					sub_category: [{
						required: true,
						message: '请输入品类编码',
						trigger: 'blur'
					}],
					sub_category_name: [{
						required: true,
						message: '请输入品类名称',
						trigger: 'blur'
					}],
					level02_category_name: [{
						required: true,
						message: '请输入品类分组名称',
						trigger: 'blur'
					}],
					level02_category_code: [{
						required: true,
						message: '请输入品类分组编码',
						trigger: 'blur'
					}]
				},
				search:''//查询字段
			}
		},
		methods: {
			current_change: function(currentPage) {
				let _self = this;
				_self.currentPage = currentPage;
				if(_self.tabindex == '0'){
					let formData = new FormData();
					formData.append('pageNum', _self.currentPage);
					formData.append('pageSize', _self.pagesize);
					_self.axios.post(_self.ApiUrl + '/commodity/categoryList', formData).then(response => {
						if (response.data.errcode == '0') {
					
							_self.tableData = response.data.data.data.list
							_self.total = response.data.data.data.total
						}
					}).catch(function(error) {
						_self.$message.error('商品品类列表加载错误');
					});
				}else{
					let formData = new FormData();
					formData.append('pageNum', _self.currentPage);
					formData.append('pageSize', _self.pagesize);
					formData.append('category', _self.search);
					_self.axios.post(_self.ApiUrl + '/commodity/queryCategory', formData).then(response => {
						if (response.data.errcode == '0') {
							_self.tableData = response.data.data.data.list
							_self.total = response.data.data.data.total
							_self.tabindex = 1;
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
				_self.axios.post(_self.ApiUrl + '/commodity/categoryList', formData).then(response => {
					if (response.data.errcode == '0') {

						_self.tableData = response.data.data.data.list
						_self.total = response.data.data.data.total
						_self.tabindex = '0';
					}
				}).catch(function(error) {
					_self.$message.error('商品品类列表加载错误');
				});
			},
			//编辑
			handleEdit(index) {
			let _self = this;
				_self.dialogVisible = true;
				_self.ruleForm.id = _self.tableData[index].id;
				_self.ruleForm.sub_category = _self.tableData[index].sub_category
				_self.ruleForm.sub_category_name = _self.tableData[index].sub_category_name
				_self.ruleForm.level02_category_name = _self.tableData[index].level02_category_name
				_self.ruleForm.level02_category_code = _self.tableData[index].level02_category_code
				_self.ruleForm.comments_group_code = _self.tableData[index].comments_group_code
			},
			//删除
			deletes(index) {
				let _self = this
				let formData = new FormData();
				formData.append('id', _self.tableData[index].id);
				_self.axios.post(_self.ApiUrl + '/commodity/deleteCategory', formData).then(response => {
					if (response.data.errcode == '0') {

						_self.$message({
							message: '您已成功删除',
							type: 'success'
						});
						_self.getdata();
					} else {
						_self.$message.error('删除失败');
					}
				}).catch(function(error) {
					_self.$message.error('响应时间过长，请重试');
				});
			},
			//编辑提交
			submitForm(formName) {
				let _self=this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let formData = new FormData();
						formData.append('id', _self.ruleForm.id);
						formData.append('sub_category',_self.ruleForm.sub_category);
						formData.append('sub_category_name', _self.ruleForm.sub_category_name);
						formData.append('level02_category_name',_self.ruleForm.level02_category_name);
						formData.append('level02_category_code',_self.ruleForm.level02_category_code);
						formData.append('comments_group_code',_self.ruleForm.comments_group_code);
						_self.axios.post(_self.ApiUrl + '/commodity/updateCategory', formData).then(response => {
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
						console.log('error submit!!');
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
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let formData = new FormData();
					
						formData.append('sub_category',_self.ruleForm2.sub_category);
						formData.append('sub_category_name', _self.ruleForm2.sub_category_name);
						formData.append('level02_category_name',_self.ruleForm2.level02_category_name);
						formData.append('level02_category_code',_self.ruleForm2.level02_category_code);
						formData.append('comments_group_code',_self.ruleForm2.comments_group_code);
						_self.axios.post(_self.ApiUrl + '/commodity/addCategory', formData).then(response => {
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
						console.log('error submit!!');
						return false;
					}
				})
			},
			//查询
			searchup(){
				let _self = this
				if (_self.search == '') {
				
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
				formData.append('category', _self.search);
				_self.axios.post(_self.ApiUrl + '/commodity/queryCategory', formData).then(response => {
					if (response.data.errcode == '0') {
				
						_self.tableData = response.data.data.data.list
						_self.total = response.data.data.data.total
						_self.tabindex = '1';
					} else {
						_self.$message.error('查询失败');
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
	.el-table__body-wrapper{
			overflow-x: auto;
		}
</style>
