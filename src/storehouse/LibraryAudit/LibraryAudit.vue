<template>
  <div class="app-contion">
    <!--startprint-->
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm formbox">
      <el-form-item label="仓库" prop="warehousename">
        <el-select v-model="ruleForm.warehousename" placeholder="请选择仓库" @change='rucode' style='width: 70%;'>
          <el-option v-for="item in recalloptions" :key="item.warehouse_code" :label="item.warehouse_name" :value="item">
          </el-option>
        </el-select>
        <el-button type="primary" @click="submitForm('ruleForm')">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border :height="tableHeight" style="width: 100%" id='printTable'>
      <el-table-column prop="id" label="仓单号">
      </el-table-column>
      <el-table-column prop="warehouse_name" label="仓库名">
      </el-table-column>
      <el-table-column prop="warehouse_code" label="仓库编码">
      </el-table-column>
      <el-table-column prop="type" label="仓单类型">
      </el-table-column>
      <el-table-column prop="ref_order_code" label="关联单据号">
      </el-table-column>
      <el-table-column prop="ref_order_type" label="关联单据类型">
      </el-table-column>
      <el-table-column prop="operator" label="申请人">
      </el-table-column>
      <el-table-column prop="apply_time" label="申请时间">
      </el-table-column>
      <el-table-column prop="state" label="仓单状态">
      </el-table-column>
      <el-table-column label="操作" width="220" fixed="right">
        <template slot-scope="scope">
          <div style="display: flex;">
            <el-button size="mini" @click="detail(scope.$index, scope.row)">详情</el-button>
            <el-button size="mini" type="success" @click="passthrough(scope.$index, scope.row)">正确</el-button>
            <el-button size="mini" @click="errordetail(scope.$index, scope.row)" type="warning">错误</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!--endprint-->
    <div style="position: fixed;bottom: 0.625rem;right: 0;">
      <el-pagination background layout="prev, pager, next" :total="total" :page-size='pagesize' @current-change="current_change">
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
        tableData: [],
        tableHeight: window.innerHeight - 190,
        total: '',
        pagesize: 10,
        currentPage: 1,
        recalloptions: [],
        ruleForm: {
          warehousename: '',
          warehousecode: ''
        },
        rules: {
          warehousename: [{
            required: true,
            message: '请选择仓库',
            trigger: 'change'
          }],

        }
      };
    },
    methods: {

      rucode(Vid) {
        let _self = this;
        _self.ruleForm.warehousename = Vid.warehouse_name
        _self.ruleForm.warehousecode = Vid.warehouse_code
      },
      current_change: function(currentPage) {
        let _self = this;
        _self.currentPage = currentPage;
        let formData1 = new FormData();
        formData1.append('pageNum', _self.currentPage);
        formData1.append('pageSize', _self.pagesize);
        formData1.append('warehouseCode', _self.ruleForm.warehousecode);
        _self.axios.post(_self.ApiurlStorehouse + '/inventory/actInvBillCheckList', formData1, {
          // 单独配置
          withCredentials: false
        }).then(response => {
          if (response.data.errcode == '0') {
            _self.tableData = response.data.data.data.list
            _self.total = response.data.data.data.total
            for (var i = 0; i < _self.tableData.length; i++) {
              if (_self.tableData[i].type == '1') {
                _self.tableData[i].type = '入库'
              } else if (_self.tableData[i].type == '2') {
                _self.tableData[i].type = '出库'
              } else if (_self.tableData[i].type == '3') {
                _self.tableData[i].type = '其他入库'
              } else if (_self.tableData[i].type == '4') {
                _self.tableData[i].type = '其他出库'
              } else if (_self.tableData[i].type == '5') {
                _self.tableData[i].type = '调库'
              } else if (_self.tableData[i].type == '6') {
                _self.tableData[i].type = '调拨退货单'
              }else if (_self.tableData[i].type == '7') {
                _self.tableData[i].type = '退货单'
              }

              if (_self.tableData[i].ref_order_type == '1') {
                _self.tableData[i].ref_order_type = '采购单号'
              } else if (_self.tableData[i].ref_order_type == '2') {
                _self.tableData[i].ref_order_type = '销售单号'
              } else if (_self.tableData[i].ref_order_type == '3') {
                _self.tableData[i].ref_order_type = '合同号'
              } else if (_self.tableData[i].ref_order_type == '4') {
                _self.tableData[i].ref_order_type = '调拨单'
              }

              if (_self.tableData[i].state == '0') {
                _self.tableData[i].state = '创建中'

              } else if (_self.tableData[i].state == '1') {
                _self.tableData[i].state = '审核中'

              } else if (_self.tableData[i].state == '2') {
                _self.tableData[i].state = '审核通过'

              } else if (_self.tableData[i].state == '3') {
                _self.tableData[i].state = '审核未通过'

              } else if (_self.tableData[i].state == '4') {
                _self.tableData[i].state = '作废'

              } else if (_self.tableData[i].state == '5') {
                _self.tableData[i].state = '等待调拨入库中'

              } else if (_self.tableData[i].state == '6') {
                _self.tableData[i].state = '调拨通过' //完成

              } else if (_self.tableData[i].state == '7') {
                _self.tableData[i].state = '调拨出库未通过'

              } else if (_self.tableData[i].state == '8') {
                _self.tableData[i].state = '调拨入库未通过'

              }
            }
          } else {
            _self.$message.error('列表载入失败，请刷新重试1');
          }
        }).catch(function(error) {
          _self.$message.error('列表载入响应时间过长，请重试3');

        });

      },

      //通过
      passthrough(index) {
        let _self = this;

        let formData = new FormData();
        formData.append('billId',  _self.tableData[index].id);
        formData.append('userId', _self.id);
        _self.axios.post(_self.ApiurlStorehouse + '/inventory/checkBtn', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode == '0') {
            _self.$message({
              message: '已通过审核',
              type: 'success'
            });
            _self.getdata();
          } else if (response.data.errcode == '1006') {
            this.$message({
              showClose: true,
              message: response.data.errmsg,
              type: 'warning',
              duration: 7000
            });
          } else {
            _self.$message.error(response.data.errmsg);
          }
        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试');

        });


      },
      //仓库选择
      WarehouseSelection() {
        let _self = this;
        let formData = new FormData();

        _self.axios.post(_self.ApiurlStorehouse + '/inventory/chooseWarehouseList', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode == '0') {

            _self.recalloptions = response.data.data.list
          } else {
            _self.$message.error('获取仓库失败，请刷新重试');
          }
        }).catch(function(error) {
          _self.$message.error('仓库响应时间过长，请重试');

        });
      },
      //详情
      detail(index) {
        let _self = this;
        _self.$router.push({
          path: '/Auditexhibition',
          query: {
            tabledataDetail: _self.tableData[index],

          },
        })
      },
      errordetail(index){
         let _self = this;
          _self.$router.push({
           path: '/Errorlibrarylistdetail',
           query: {
             tabledataDetail: _self.tableData[index],

           },
         })
      },
      submitForm(formName) {
        let _self = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            _self.getdata();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //列表载入
      getdata() {
        let _self = this;

        let formData1 = new FormData();
        formData1.append('pageNum', _self.currentPage);
        formData1.append('pageSize', _self.pagesize);
        formData1.append('warehouseCode', _self.ruleForm.warehousecode);
        _self.axios.post(_self.ApiurlStorehouse + '/inventory/actInvBillCheckList', formData1, {
          // 单独配置
          withCredentials: false
        }).then(response => {
          if (response.data.errcode == '0') {
            _self.tableData = response.data.data.data.list
            _self.total = response.data.data.data.total
            for (var i = 0; i < _self.tableData.length; i++) {
              if (_self.tableData[i].type == '1') {
                _self.tableData[i].type = '入库'
              } else if (_self.tableData[i].type == '2') {
                _self.tableData[i].type = '出库'
              } else if (_self.tableData[i].type == '3') {
                _self.tableData[i].type = '其他入库'
              } else if (_self.tableData[i].type == '4') {
                _self.tableData[i].type = '其他出库'
              } else if (_self.tableData[i].type == '5') {
                _self.tableData[i].type = '调库'
              } else if (_self.tableData[i].type == '6') {
                _self.tableData[i].type = '调拨退货单'
              }else if (_self.tableData[i].type == '7') {
                _self.tableData[i].type = '退货单'
              }

              if (_self.tableData[i].ref_order_type == '1') {
                _self.tableData[i].ref_order_type = '采购单号'
              } else if (_self.tableData[i].ref_order_type == '2') {
                _self.tableData[i].ref_order_type = '销售单号'
              } else if (_self.tableData[i].ref_order_type == '3') {
                _self.tableData[i].ref_order_type = '合同号'
              } else if (_self.tableData[i].ref_order_type == '4') {
                _self.tableData[i].ref_order_type = '调拨单'
              }

              if (_self.tableData[i].state == '0') {
                _self.tableData[i].state = '创建中'

              } else if (_self.tableData[i].state == '1') {
                _self.tableData[i].state = '审核中'

              } else if (_self.tableData[i].state == '2') {
                _self.tableData[i].state = '审核通过'

              } else if (_self.tableData[i].state == '3') {
                _self.tableData[i].state = '审核未通过'

              } else if (_self.tableData[i].state == '4') {
                _self.tableData[i].state = '作废'

              } else if (_self.tableData[i].state == '5') {
                _self.tableData[i].state = '等待调拨入库中'

              } else if (_self.tableData[i].state == '6') {
                _self.tableData[i].state = '调拨通过' //完成

              } else if (_self.tableData[i].state == '7') {
                _self.tableData[i].state = '调拨出库未通过'

              } else if (_self.tableData[i].state == '8') {
                _self.tableData[i].state = '调拨入库未通过'

              }
            }
          } else {
            _self.$message.error('列表载入失败，请刷新重试1');
          }
        }).catch(function(error) {
          _self.$message.error('列表载入响应时间过长，请重试3');

        });
      },


    },
    created: function() {
      let _self = this;
      _self.WarehouseSelection();

    }

  }
</script>

<style>
  .app-contion {
    margin: 0.625rem;
  }

  .stock-header {
    margin: 5px 0;
  }

  .stock-label {
    font-size: 0.875rem;
    margin: 0 0.1875rem;
    display: inline-block;
  }

  .stock-margin {
    margin: 0.625rem 0;
  }

  .display {
    display: none;
  }

  .el-table__body-wrapper {
    overflow-x: auto;
    overflow-y: auto;
  }

  .formbox {
    padding: 0;
    width: 100%;
    box-shadow: none;
    -webkit-box-shadow: none;
    margin: 0;
    border: 0;
  }
</style>
