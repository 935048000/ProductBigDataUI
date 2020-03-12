<template>
  <div class="app-contion">
    <div class="table-box" style="margin-bottom: 60px;">
      <!--  <el-input v-model="search" placeholder="请输入内容" style="width: 25%;"></el-input>
      <el-button type="primary" @click='searchup'>查询</el-button> -->
      <el-button type="success" class="daochu" @click="add">新增</el-button>
    </div>
    <div id="tableid">
      <el-table :data="tableData" border style="width: 100%" :height="tableHeight">
        <el-table-column prop="supplier_name" label="供应商名称">
        </el-table-column>
        <el-table-column prop="supplier_code" label="供应商编码">
        </el-table-column>
        <!-- <el-table-column prop="state" label="状态">
        </el-table-column> -->
        <el-table-column prop="tel" label="公司电话">
        </el-table-column>

        <el-table-column prop="create_at" label="创建时间">
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 编辑弹框 -->
    <el-dialog title="编辑" :visible.sync="dialogVisible" width="45%" :before-close="handleClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="供应商名称" prop="supplier_name">
          <el-input v-model="ruleForm.supplier_name"></el-input>
        </el-form-item>
        <el-form-item label="供应商编码" prop="supplier_code">
          <el-input v-model="ruleForm.supplier_code"></el-input>
        </el-form-item>
        <el-form-item label="公司电话" prop="telphone">
          <el-input v-model="ruleForm.telphone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增弹框 -->
    <el-dialog title="新增" :visible.sync="dialogVisible2" width="50%">
      <el-form :model="ruleForm2" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

        <el-form-item label="供应商名称" prop="supplier_name">
          <el-input v-model="ruleForm2.supplier_name"></el-input>
        </el-form-item>
        <el-form-item label="供应商编码" prop="supplier_code">
          <el-input v-model="ruleForm2.supplier_code"></el-input>
        </el-form-item>
        <el-form-item label="公司电话" prop="telphone">
          <el-input v-model="ruleForm2.telphone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="addup('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <div class="footerdeom">
      <el-pagination background layout="prev, pager, next" :total="total"  :page-size="pagesize" @current-change="current_change">
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
        tabindex: 0,
        tableData: [],
        dialogVisible: false, //编辑弹框,
        ruleForm: {
          supplier_name: '',
          supplier_code: '',
          telphone: ''
        },
        tableHeight: window.innerHeight - 190,
        dialogVisible2: false,
        ruleForm2: {
          supplier_name: '',
          supplier_code: '',
          telphone: ''
        },
        rules: {
          supplier_name: [{
            required: true,
            message: '请输入供应商名称',
            trigger: 'blur'
          }],
          supplier_code: [{
            required: true,
            message: '请输入供应商编码',
            trigger: 'blur'
          }],

        },
        search: '', //查询字段
        supplierId: '' //供应商id
      }
    },
    methods: {
      current_change: function(currentPage) {
        let _self = this;
        _self.currentPage = currentPage;

        let formData = new FormData();
        formData.append('pageNum', _self.currentPage);
        formData.append('pageSize', _self.pagesize);
        _self.axios.post(_self.ApiurlStorehouse + '/productManagement/getSupplierList', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {
          if (response.data.errcode == '0') {

            _self.tableData = response.data.data.data.list
            _self.total = response.data.data.data.total
            _self.tabindex = '0';
          }
        }).catch(function(error) {
          _self.$message.error('供应商列表加载错误');
        });


      },

      //获取table数据
      getdata() {
        let _self = this
        let formData = new FormData();
        formData.append('pageNum', _self.currentPage);
        formData.append('pageSize', _self.pagesize);
        _self.axios.post(_self.ApiurlStorehouse + '/productManagement/getSupplierList', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {
          if (response.data.errcode == '0') {

            _self.tableData = response.data.data.data.list
            _self.total = response.data.data.data.total
            _self.tabindex = '0';
          }
        }).catch(function(error) {
          _self.$message.error('供应商列表加载错误');
        });
      },
      //编辑
      handleEdit(index) {
        let _self = this;
        _self.dialogVisible = true;

        _self.ruleForm.supplier_name = _self.tableData[index].supplier_name;
        _self.ruleForm.supplier_code = _self.tableData[index].supplier_code;
        _self.ruleForm.telphone = _self.tableData[index].tel
        _self.supplierId = _self.tableData[index].id
      },

      //编辑提交
      submitForm(formName) {
        let _self = this;
         var regu = "^[0-9]*$";
        var re = new RegExp(regu);
        if (!re.test(_self.ruleForm.telphone)) {
          _self.$message({
            type: 'warning',
            message: '电话只能输入数字哦！',
            duration: 10000,
            showClose: true,
          })
          return false
        }
        _self.$refs[formName].validate((valid) => {
          if (valid) {
            let formData = new FormData();
            formData.append('id', _self.supplierId);
            formData.append('supplierName', _self.ruleForm.supplier_name);
            formData.append('supplierCode', _self.ruleForm.supplier_code);
            formData.append('telphone', _self.ruleForm.telphone);
            _self.axios.post(_self.ApiurlStorehouse + '/productManagement/updateSupplier', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {
              if (response.data.errcode == '0') {
                _self.dialogVisible = false;
                _self.$message({
                  message: '编辑成功',
                  type: 'success'
                });
                _self.supplierId = '';
                _self.getdata();
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
        })
      },
      //新增
      add() {
        let _self = this;
        _self.dialogVisible2 = true
      },
      //新增提交
      addup(formName) {
        let _self = this;

        var regu = "^[0-9]*$";
       var re = new RegExp(regu);
       if (!re.test(_self.ruleForm2.telphone)) {
         _self.$message({
           type: 'warning',
           message: '电话只能输入数字哦！',
           duration: 10000,
           showClose: true,
         })
         return false
       }
        _self.$refs[formName].validate((valid) => {
          if (valid) {
            let formData = new FormData();

            formData.append('supplierName', _self.ruleForm2.supplier_name);
            formData.append('supplierCode', _self.ruleForm2.supplier_code);
            formData.append('telphone', _self.ruleForm2.telphone);
            _self.axios.post(_self.ApiurlStorehouse + '/productManagement/addSupplier', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {
              if (response.data.errcode == '0') {
                _self.dialogVisible2 = false;
                _self.$message({
                  message: '新增成功',
                  type: 'success'
                });
                _self.ruleForm2.telphone = ''
                _self.ruleForm2.supplier_name = ''
                _self.ruleForm2.supplier_code = ''
                _self.getdata();
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
        })
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
        let formData = new FormData();
        formData.append('pageNum', _self.currentPage);
        formData.append('pageSize', _self.pagesize);
        formData.append('category', _self.search);
        _self.axios.post(_self.ApiurlStorehouse + '/commodity/queryCategory', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {
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

  .el-table__body-wrapper {
    overflow-x: auto;
  }
</style>
