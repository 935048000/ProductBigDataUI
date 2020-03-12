<template>
  <div class="app-contion">
    <el-row class="mar-increased">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"
        style='margin: 0;width: auto;padding: 0;border: 0;'>
        <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="仓库编码" prop="warehouse_code">
              <el-select v-model="ruleForm.warehouse_code" :multiple='false' filterable allow-create
                default-first-option placeholder="请选择仓库编码" style='width: 100%;' @change="wareblur">
                <el-option v-for="item in warehouseoptions" :key="item.warehouse_name" :label="item.warehouse_code"
                  :value="item" >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="仓库名称 " prop="warehouse_name">
              <el-input v-model="ruleForm.warehouse_name" placeholder="请输入仓库名称 " disabled=""></el-input>
            </el-form-item>
          </div>
        </el-col>

        <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="仓单类型" prop="type">
              <el-select v-model="ruleForm.type" :multiple='false' filterable allow-create default-first-option
                placeholder="请选择仓单类型" style='width: 100%;'>
                <el-option v-for="item in ref_orderoptions" :key="item.code" :label="item.value" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="关联单据号" prop="ref_order_code">
              <el-input v-model="ruleForm.ref_order_code" placeholder="请输入关联单据号"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="单据类型" prop="ref_order_type">
              <el-select v-model="ruleForm.ref_order_type" :multiple='false' filterable allow-create
                default-first-option placeholder="请选择关联单据类型" style='width: 100%;'>
                <el-option v-for="item in typeoptions" :key="item.code" :label="item.value" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="供应商名称" >
              <el-select v-model="ruleForm.providerName" :multiple='false' filterable allow-create default-first-option
                placeholder="请选择供应商名称" style='width: 100%;' @change="providerchange">
                <el-option v-for="item in options4" :key="item.supplier_name" :label="item.supplier_name"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="备注" prop="comments">
              <el-input v-model="ruleForm.comments" placeholder="请输入备注"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <!-- <el-col :span="12">
					<div class="grid-content bg-purple f-s">
						<el-form-item label="审核人" prop="checked_by">
							<el-input v-model="ruleForm.checked_by" placeholder="请输入审核人"></el-input>
						</el-form-item>
					</div>
				</el-col> -->

        <!-- <el-col :span="12">
					<div class="grid-content bg-purple f-s">
						<el-form-item label="扫描条形码" >
							<el-input v-model="ruleForm.barCode" placeholder="请扫描扫描条形码"></el-input>
						</el-form-item>
					</div>
				</el-col> -->
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
        ids: state => state.userinfo.id,
        shopcode: state => state.userinfo.shopcode
      })
    },
    data() {
      return {

        tableData: [],
        ruleForm: {
          warehouse_code: '',
          warehouse_name: '',
          type: '',
          ref_order_code: '',
          ref_order_type: '',
          comments: '',
          id: '',
          providerName:''
        },

        rules: {
          warehouse_code: [{
              required: true,
              message: '请输入仓库编码',
              trigger: 'change'
            },

          ],
          warehouse_name: [

            {
              required: true,
              message: '请选择或输入仓库名称',
              trigger: 'change'
            }
          ],
          type: [{
            required: true,
            message: '请输入仓单类型',
            trigger: 'change'
          }, ],
          ref_order_code: [{
            required: true,
            message: '请输入关联单据号',
            trigger: 'blur'
          }, ],
          ref_order_type: [{
            required: true,
            message: '请输入关联单据类型',
            trigger: 'change'
          }, ],

          id: [{
            required: true,
            message: '请输入订单号',
            trigger: 'blur'
          }, ],

        },
        options: [],
        CategoryName: [],
        warehouseoptions: [],
        ref_orderoptions: [],
        typeoptions: [],
        options4:[],
        providerCode:'',
        level:''
      };
    },
    methods: {
 providerchange(Vid){
         let _self = this;
         _self.ruleForm.providerName = Vid.supplier_name
         _self.providerCode = Vid.supplier_code
      },
      submitForm(formName) {
        let _self = this;
        _self.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(_self.level)
            if(_self.level=='1'){
              if(_self.ruleForm.providerName==''||_self.providerCode==''){
                _self.$message({
          message: '您还没有添加供应商哦！',
          type: 'warning'
        });
        return false;
              }
            }
            let formData = new FormData();
            formData.append('warehouse_code', _self.ruleForm.warehouse_code);
            formData.append('warehouse_name', _self.ruleForm.warehouse_name);
            formData.append('type ', _self.ruleForm.type);
            formData.append('ref_order_code', _self.ruleForm.ref_order_code);
            formData.append('ref_order_type', _self.ruleForm.ref_order_type);
            formData.append('entryWarehouseCode', '');
            formData.append('entryWarehouseName', '');
            formData.append('userId', _self.ids);
            formData.append('supplierCode', _self.providerCode);
            if(_self.ruleForm.comments==null||_self.ruleForm.comments==undefined){
              formData.append('comments', '');
            }else{
             formData.append('comments', _self.ruleForm.comments);
            }
            _self.axios.post(_self.ApiurlStorehouse + '/inventory/createInvBills', formData, {
              // 单独配置
              withCredentials: false
            }).then(response => {

              if (response.data.errcode == '0') {
                _self.$message({
                  message: '新增成功',
                  type: 'success'
                });
                _self.$router.push({
                  path: '/stock',

                })
              } else {
                _self.$message.error('新增失败，请刷新重试');
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
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      wareblur(vId) {
        let _self = this;
        console.log(vId)
        _self.ruleForm.warehouse_name = vId.warehouse_name
        _self.ruleForm.warehouse_code = vId.warehouse_code
          _self.level = vId.level
      },

 //选择供应商
      Supplierchange(){
        let _self = this;
        let formData3 = new FormData();
          formData3.append('pageNum', '1');
           formData3.append('pageSize', '1000');
        _self.axios.post(_self.ApiurlStorehouse + '/productManagement/getSupplierList', formData3, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode = '0') {
            _self.options4 = response.data.data.data.list

          } else {
            _self.$message.error('供应商找不到啦');
          }
        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试3');
        });
      },
      //仓单类型加载
      gettypeoptions() {
        let _self = this;
        let formData = new FormData();
        formData.append('state', '1');
        _self.axios.post(_self.ApiurlStorehouse + '/inventory/chooseWarehouseTypeList', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode == '0') {

            _self.ref_orderoptions = response.data.data.list
          } else {
            _self.$message.error('获取仓单类型失败，请刷新重试');
          }
        }).catch(function(error) {
          _self.$message.error('仓单类型时间过长，请重试');

        });
      },
      //关联单据类型
      getreforderoptions() {
        let _self = this;
        let formData = new FormData();
        formData.append('state', '2');
        _self.axios.post(_self.ApiurlStorehouse + '/inventory/chooseWarehouseTypeList', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode == '0') {

            _self.typeoptions = response.data.data.list
          } else {
            _self.$message.error('获取关联单据类型，请刷新重试');
          }
        }).catch(function(error) {
          _self.$message.error('仓单类型时间过长，请重试');

        });
      },
      //仓库编码
      getwarehouseoptions() {
        let _self = this;
        let formData = new FormData();
        formData.append('userId', _self.ids);
        _self.axios.post(_self.ApiurlStorehouse + '/inventory/choouseTransferOut', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode == '0') {

            _self.warehouseoptions = response.data.data.list
          } else {
            _self.$message.error('获取仓库失败，请刷新重试');
          }
        }).catch(function(error) {
          _self.$message.error('仓库响应时间过长，请重试');

        });

      },

    },
    created: function() {
      let _self = this;

      _self.gettypeoptions();
      _self.getreforderoptions();
      _self.getwarehouseoptions();
      _self.Supplierchange();
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

  .keyinput {
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: 0;
    padding: 0 15px;
    -webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    width: 100%;
  }
</style>
