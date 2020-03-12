<template>
  <div class="app-contion">
    <div class="stockstyle" v-if="$route.query.tabledataDetail.type=='调库'">
      <span>调入仓库：{{tuningin}}</span><span>调出仓库：{{recall}}</span>
    </div>
    <el-row class="mar-increased">
      <el-form :model="ruleForm" status-icon ref="ruleForm" label-width="100px" class="demo-ruleForm" style='margin: 0;width: auto;padding: 0;border: 0;'>
        <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="仓库编码" prop="warehouse_code">
              <el-select v-model="ruleForm.warehouse_code" :multiple='false' filterable allow-create
                default-first-option placeholder="请选择仓库编码" style='width: 100%;' @change="wareblur" disabled>
                <el-option v-for="item in warehouseoptions" :key="item.warehouse_name" :label="item.warehouse_code"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="仓库名称 " prop="warehouse_name">
              <el-input v-model="ruleForm.warehouse_name" placeholder="请输入仓库名称 " disabled></el-input>
            </el-form-item>
          </div>
        </el-col>

        <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="仓单类型" prop="type">
              <el-select v-model="ruleForm.type" :multiple='false' disabled filterable allow-create
                default-first-option placeholder="请选择仓单类型" style='width: 100%;'>
                <el-option v-for="item in typeoptions" :key="item.code" :label="item.value" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="关联单据号" prop="ref_order_code">
              <el-input v-model="ruleForm.ref_order_code" placeholder="请输入关联单据号" disabled></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="关联单据类型" prop="ref_order_type">
              <el-select v-model="ruleForm.ref_order_type" :multiple='false' filterable allow-create
                default-first-option placeholder="请选择关联单据类型" style='width: 100%;' disabled>
                <el-option v-for="item in ref_orderoptions" :key="item.code" :label="item.value" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="审核人" prop="checked_by">
              <el-input v-model="ruleForm.checked_by" placeholder="请输入审核人" disabled></el-input>
            </el-form-item>
          </div>
        </el-col>

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
              <el-button type="primary" @click="submitForm" class='wids'>保存到库单不通过详情</el-button>

            </el-form-item>
          </div>
        </el-col>
      </el-form>
    </el-row>
    <el-row>

      <el-table :data="tableData" style="width: 100%;margin-top: 0.625rem;" :height="tableHeight" border
        @selection-change="handleSelectionChange">

        <el-table-column prop="production_code" label="商品编码">
        </el-table-column>
        <el-table-column prop="bar_code" label="商品条码">
        </el-table-column>
        <el-table-column prop="production_name" label="商品名称">
        </el-table-column>
        <el-table-column prop="cost" label="成本价">
        </el-table-column>
        <el-table-column prop="amount" label="商品数量">
        </el-table-column>
        <el-table-column label="矫正成本价">
          <template slot-scope="scope">
            <el-input v-model="scope.row.auditCost" placeholder="0"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="矫正数量">
          <template slot-scope="scope">
            <el-input v-model="scope.row.auditAmount" placeholder="0"></el-input>
          </template>
        </el-table-column>
         <el-table-column label="说明原因">
          <template slot-scope="scope">
            <el-input v-model="scope.row.comments" placeholder=""></el-input>
          </template>
        </el-table-column>
        <el-table-column label="实际入库数" prop="actual_amount">

        </el-table-column>
        <el-table-column label="差额原因" prop="margin_cause">

        </el-table-column>
        <el-table-column prop="size" label="商品单位">
        </el-table-column>
        <el-table-column prop="create_at" label="创建时间">
        </el-table-column>
      </el-table>

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
        tabledataDetailtab: '',
        tableHeight: window.innerHeight - 420,
        tableData: [],
        ruleForm: {
          warehouse_code: '',
          warehouse_name: '',
          type: '',
          ref_order_code: '',
          ref_order_type: '',
          checked_by: '',
          id: '',

        },
        Returngoods: [],
        barCode: '',

        options: [],
        CategoryName: [],
        warehouseoptions: [],
        ref_orderoptions: [],
        typeoptions: [],
        tuningin: '', //调入
        recall: '', //调出
        refbilltype: ''
      };
    },
    methods: {

      handleSelectionChange(val) {
        let _self = this;
        console.log(val)
        for (var i = 0; i < val.length; i++) {
          var amountnum = Number(val[i].amount) - Number(val[i].actual_amount)

          var newdata = {
            production_code: val[i].production_code,
            production_name: val[i].production_name,
            amount: amountnum,
            size: val[i].size,
            marginCause: val[i].margin_cause
          }
          if (_self.Returngoods == '') {
            _self.Returngoods.push(newdata)
          } else {
            for (var j = 0; j < _self.Returngoods.length; j++) {
              if (val[i].production_code != _self.Returngoods[j].production_code) {
                _self.Returngoods.push(newdata)
              }
            }
          }
        }

      },


      submitForm(formName) {
        let _self = this;

        let tableData2 = [];
        for (var i = 0; i < _self.tableData.length; i++) {

          if(_self.tableData[i].auditCost==''||_self.tableData[i].auditCost==undefined){
            var auditCost = 0
          }else{
            var auditCost = _self.tableData[i].auditCost
          }
           if(_self.tableData[i].auditAmount==''||_self.tableData[i].auditAmount==undefined){
            var auditAmount = 0
          }else{
             var auditAmount = _self.tableData[i].auditAmount
          }
          var newdata = {
            production_code: _self.tableData[i].production_code,
            production_name: _self.tableData[i].production_name,
            amount: _self.tableData[i].amount,
            cost: _self.tableData[i].cost,
            auditCost: auditCost,
            auditAmount: auditAmount,
            comments:_self.tableData[i].comments
          }
          tableData2.push(newdata)
        }

        var listbox = {
          list: tableData2,
          id: _self.ruleForm.id,
          userId: _self.id,
        }
        _self.axios.post(_self.ApiurlStorehouse + '/inventory/modifyAndSave', {
          jsonData: listbox
        }, {
          // 单独配置
          withCredentials: false
        }, {
          headers: {
            'Content-Type': 'application/json;charsetset=UTF-8'
          }
        }).then(response => {

          if (response.data.errcode == '0') {
            _self.$message({
              message: '保存成功',
              type: 'success'
            });
            _self.$router.push({
              path: '/LibraryAudit',

            })

          } else {

            _self.$notify({
              title: '警告',
              message: response.data.errmsg,
              type: 'warning',
              duration: 0
            });
          }
        }).catch(function(error) {
          _self.$message.error('保存响应时间过长，请重试');

        });

      },

      wareblur(vId) {
        let _self = this;

        _self.ruleForm.warehouse_name = vId.warehouse_name
        _self.ruleForm.warehouse_code = vId.warehouse_code
      },
      getcategory() {
        let _self = this;
        _self.tabledataDetailtab = _self.$route.query.tabledataDetail
        _self.ruleForm.warehouse_code = _self.$route.query.tabledataDetail.warehouse_code
        _self.ruleForm.warehouse_name = _self.$route.query.tabledataDetail.warehouse_name
        _self.ruleForm.type = _self.$route.query.tabledataDetail.type
        _self.ruleForm.ref_order_code = _self.$route.query.tabledataDetail.ref_order_code
        _self.ruleForm.ref_order_type = _self.$route.query.tabledataDetail.ref_order_type
        _self.ruleForm.checked_by = _self.$route.query.tabledataDetail.checked_by
        _self.ruleForm.id = _self.$route.query.tabledataDetail.id
      },
      //获取条码信息
      gettabledate() {

        let _self = this;
        let formData = new FormData();
        formData.append('orderId', _self.$route.query.tabledataDetail.id);
        _self.axios.post(_self.ApiurlStorehouse + '/inventory/getInvBillDetailProductionDetailLists', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode == '0') {

            _self.tableData = response.data.data.list
          } else {
            _self.$message.error('获取列表失败，请刷新重试');
          }
        }).catch(function(error) {
          _self.$message.error('获取列表时间过长，请重试');

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
            _self.$message.error('获取仓单类型失败，请刷新重试');
          }
        }).catch(function(error) {
          _self.$message.error('仓单类型时间过长，请重试');

        });
      },
      //仓库编码
      getwarehouseoptions() {
        let _self = this;
        let formData = new FormData();
        formData.append('state', '1');
        _self.axios.post(_self.ApiurlStorehouse + '/inventory/chooseWarehouseList', formData, {
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
      Allocationdetails() {
        let _self = this;
        if (_self.$route.query.tabledataDetail.ref_bill_type == 'tranfer.out') {
          var types = 1
        } else if (_self.$route.query.tabledataDetail.ref_bill_type == 'tranfer.in') {
          var types = 2
        }
        let formData = new FormData();
        formData.append('userId', _self.id);
        formData.append('billId', _self.$route.query.tabledataDetail.id);
        formData.append('type', types);
        _self.axios.post(_self.ApiurlStorehouse + '/inventory/tranferOutDetail', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode == '0') {
            console.log(response)

            if (response.data.data.list != null) {
              _self.tuningin = response.data.data.list.entryWarehouseName
              _self.recall = response.data.data.list.warehouse_name
              _self.refbilltype = response.data.data.list.ref_bill_type
            }
          } else {
            console.log('获取调库详情失败')
          }
        }).catch(function(error) {
          _self.$message.error('仓库响应时间过长，请重试');

        });
      }
    },
    created: function() {
      let _self = this;
      _self.getcategory();
      _self.gettypeoptions();
      _self.getreforderoptions();
      _self.getwarehouseoptions();
      _self.gettabledate();
      if (_self.$route.query.tabledataDetail.type == '调库') {
        _self.Allocationdetails();
      }

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
    width: 30%;
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

  .stockstyle span {
    display: inline-block;
    margin: 0 0.9375rem;
    color: #008800;
  }
</style>
