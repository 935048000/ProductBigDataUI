<template>
  <div class="app-contion">
    <!--startprint-->
    <el-button size="small" type="warning" style='margin-bottom: 0.625rem;' @click='PurchaseBtn'>生成采购单</el-button>
    <el-table :data="tableData" border :height="tableHeight" style="width: 100%" id='printTable'>

      <el-table-column prop="request_order_code" label="申购单号">
      </el-table-column>
      <el-table-column prop="warehouse_name" label="仓库">
      </el-table-column>
      <el-table-column prop="target_warehouse_name" label="申购目标仓库">
      </el-table-column>
      <el-table-column prop="type" label="仓单类型">
      </el-table-column>
      <el-table-column prop="ref_order_code" label="关联单据号">
      </el-table-column>
      <el-table-column prop="ref_order_type" label="关联单据类型">
      </el-table-column>
      <el-table-column prop="state" label="仓单状态">
      </el-table-column>
      <el-table-column prop="operator" label="申请人">
      </el-table-column>
      <el-table-column prop="apply_time" label="申请时间">
      </el-table-column>

      <el-table-column label="操作" width="170" fixed="right">
        <template slot-scope="scope">
          <div style="display: flex;">

            <el-button size="mini" type="success" @click="passthrough(scope.$index, scope.row)" v-if="scope.row.state=='审核中'">生成调拨</el-button>
            <!-- 	<el-button size="mini" type="danger" @click="nopassthrough(scope.$index, scope.row)" v-if="scope.row.state=='审核中'">不通过</el-button> -->
            <!-- <el-button size="mini" @click="revise(scope.$index, scope.row)" v-if="scope.row.state=='待审核'||scope.row.state=='审核未通过'">修改</el-button> -->
            <!-- <el-button size="mini" type="warning" @click="recalls(scope.$index, scope.row)" v-if="scope.row.state=='审核中'">撤回</el-button> -->
            <el-button size="mini" @click="detail(scope.$index, scope.row)">详情</el-button>

          </div>
        </template>
      </el-table-column>
    </el-table>
    <!--endprint-->
    <div style="position: fixed;bottom: 0.625rem;right: 0;">
      <el-pagination background layout="prev, pager, next" :total="total" @current-change="current_change">
      </el-pagination>
    </div>


    <el-dialog title="提示" :visible.sync="PurchaseVisible" width="70%" :before-close="handleClose">

      <el-table :data="Purchasetable" border style="width: 100%">
        <el-table-column prop="bill_id" label="仓单号">
        </el-table-column>
        <el-table-column prop="provider_name" label="商品名称">
        </el-table-column>

        <el-table-column prop="bar_code" label="商品条形码">
        </el-table-column>
        <el-table-column prop="provider_name" label="供应商名称">
        </el-table-column>
        <el-table-column prop="table01Amount" label="商品数量">
        </el-table-column>
        <el-table-column prop="cost" label="成本价">
        </el-table-column>
        <el-table-column prop="amount" label="库存与数量差额">
        </el-table-column>

      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="PurchaseVisible = false">取 消</el-button>
        <el-button type="primary" @click="PurchaseDefine">确 定</el-button>
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
        tableHeight: window.innerHeight - 120,
        Purchasetable: [],
        PurchaseVisible: false,
        datetime: '', //时间选择
        documents: '', //单据编号输入
        transfer: '', //仓单类型
        recall: '', //仓库
        Documenttype: '', //单据类型
        recalloptions: [],
        transferoptions: [],
        Documenttypeoptions: [],
        total: '',
        pagesize: 10,
        currentPage: 1,
        tabindex: 0,
      };
    },
    methods: {
      //作废
      cancel(index) {
        let _self = this;
        let formData = new FormData();
        formData.append('billId', _self.tableData[index].id);
        formData.append('userId', _self.id);
        formData.append('state', '4');
        _self.axios.post(_self.ApiurlStorehouse + '/inventory/withdrawAudit', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode == '0') {
            _self.$message({
              message: '作废成功',
              type: 'success'
            });
            _self.getdata();
          } else {
            _self.$message.error('作废失败，请刷新重试');
          }
        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试');

        });
      },
      PurchaseBtn() {
        let _self = this;
        _self.PurchaseVisible = true;
        let formData = new FormData();
        formData.append('userId', _self.id);
        _self.axios.post(_self.ApiurlStorehouse + '/request/warehousePurchaseOrder', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode == '0') {
            _self.Purchasetable = response.data.data.list
          } else {
            _self.$message.error(response.data.errmsg);
          }
        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试');

        });
      },
      PurchaseDefine() {
        let _self = this;
        _self.PurchaseVisible = true;
        let formData = new FormData();
        formData.append('userId', _self.id);
        _self.axios.post(_self.ApiurlStorehouse + '/request/generateWarehousing', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode == '0') {
            var str = "";
            var box = response.data.data.billIdArr;
            for (var i = 0; i < box.length; i++) {
              str += box[i] + ',';
            }
            _self.$notify({
              title: '成功',
              message: '入库单号为：' + str,
              type: 'success'
            });
            _self.PurchaseVisible = false;
          } else {
            _self.$message.error(response.data.errmsg);
          }
        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试');

        });

      },
      //搜索
      seachall() {
        let _self = this;
        let formData = new FormData();
        formData.append('pageNum', _self.currentPage);
        formData.append('pageSize', _self.pagesize);
        formData.append('str', _self.recall);
        formData.append('startDate', _self.datetime[0]);
        formData.append('endDate', _self.datetime[1]);
        formData.append('userId', _self.id);
        _self.axios.post(_self.ApiurlStorehouse + '/inventory/queryInbBills', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode == '0') {
            _self.tabindex = '1';
            _self.tableData = response.data.data.list.list
            _self.total = response.data.data.list.total
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
                _self.tableData[i].type = '退货单'
              } else if (_self.tableData[i].type == 'purchase') {
                _self.tableData[i].type = '申购单'
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

              if (response.data.data.list.list[i].state == '0') {
                _self.tableData[i].state = '创建中'

              } else if (response.data.data.list.list[i].state == '1') {
                _self.tableData[i].state = '审核中'

              } else if (response.data.data.list.list[i].state == '2') {
                _self.tableData[i].state = '作废'

              } else if (response.data.data.list.list[i].state == '3') {
                _self.tableData[i].state = '完成'

              } else if (response.data.data.list.list[i].state == '4') {
                _self.tableData[i].state = '未完成'

              }
            }
          } else {
            _self.$message.error('搜索失败，请刷新重试');
          }
        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试');

        });
      },
      current_change: function(currentPage) {
        let _self = this;
        _self.currentPage = currentPage;
        let formData = new FormData();
        formData.append('pageNum', _self.currentPage);
        formData.append('pageSize', _self.pagesize);
        formData.append('userId', _self.id);
        _self.axios.post(_self.ApiurlStorehouse + '/request/getInvRequestBillCheckList', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode == '0') {

            _self.tableData = response.data.data.list.list
            _self.total = response.data.data.list.total
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
                _self.tableData[i].type = '退货单'
              } else if (_self.tableData[i].type == 'purchase') {
                _self.tableData[i].type = '申购单'
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

              if (response.data.data.list.list[i].state == '0') {
                _self.tableData[i].state = '创建中'

              } else if (response.data.data.list.list[i].state == '1') {
                _self.tableData[i].state = '审核中'

              } else if (response.data.data.list.list[i].state == '2') {
                _self.tableData[i].state = '作废'

              } else if (response.data.data.list.list[i].state == '3') {
                _self.tableData[i].state = '完成'

              } else if (response.data.data.list.list[i].state == '4') {
                _self.tableData[i].state = '未完成'

              }
            }
          } else {
            _self.$message.error('列表载入失败，请刷新重试');
          }
        }).catch(function(error) {
          _self.$message.error('列表载入响应时间过长，请重试');

        });

      },
      //重置
      resetting() {
        let _self = this;
        _self.datetime = '';
        _self.documents = '';
        _self.Documenttype = '';
        _self.recall = '';
        _self.transfer = '';
      },
      //通过
      passthrough(index) {
        let _self = this;

        let formData = new FormData();
        formData.append('orderCode', _self.tableData[index].request_order_code);
        formData.append('userId', _self.id);

        _self.axios.post(_self.ApiurlStorehouse + '/request/requestBillsConversionTranferBill', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode == '0') {
            _self.$message({
              message: '已生成调拨单',
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
      //审核不通过
      nopassthrough(index) {
        let _self = this;
        if (_self.tableData[index].type == "调库") {
          if (_self.tableData[index].ref_bill_type == 'tranfer.out') {
            //出库
            let formData = new FormData();
            formData.append('billId', _self.tableData[index].id);
            formData.append('state', '7');
            formData.append('userId', _self.id);
            _self.axios.post(_self.ApiurlStorehouse + '/inventory/withdrawAudit', formData, {
              // 单独配置
              withCredentials: false
            }).then(response => {

              if (response.data.errcode == '0') {
                _self.$message({
                  message: '操作成功',
                  type: 'success'
                });
                _self.getdata();
              } else {
                _self.$message.error(response.data.errmsg);
              }
            }).catch(function(error) {
              _self.$message.error('响应时间过长，请重试');

            });
          } else if (_self.tableData[index].ref_bill_type == 'tranfer.in') {
            //入库
            let formData = new FormData();
            formData.append('billId', _self.tableData[index].id);
            formData.append('state', '8');
            formData.append('userId', _self.id);
            _self.axios.post(_self.ApiurlStorehouse + '/inventory/withdrawAudit', formData, {
              // 单独配置
              withCredentials: false
            }).then(response => {

              if (response.data.errcode == '0') {
                _self.$message({
                  message: '操作成功',
                  type: 'success'
                });
                _self.getdata();
              } else {
                _self.$message.error(response.data.errmsg);
              }
            }).catch(function(error) {
              _self.$message.error('响应时间过长，请重试');

            });
          }
        } else {
          let formData = new FormData();
          formData.append('billId', _self.tableData[index].id);
          formData.append('userId', _self.id);
          formData.append('state', '3');
          _self.axios.post(_self.ApiurlStorehouse + '/inventory/withdrawAudit', formData, {
            // 单独配置
            withCredentials: false
          }).then(response => {

            if (response.data.errcode == '0') {
              _self.$message({
                message: '操作成功',
                type: 'success'
              });
              _self.getdata();
            } else {
              _self.$message.error(response.data.errmsg);
            }
          }).catch(function(error) {
            _self.$message.error('响应时间过长，请重试');

          });
        }


      },
      //审核完成
      complete(index) {
        let _self = this;
        let formData = new FormData();
        formData.append('billId', _self.tableData[index].id);
        formData.append('userId', _self.id);
        formData.append('state', '1');
        _self.axios.post(_self.ApiurlStorehouse + '/inventory/withdrawAudit', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode == '0') {
            _self.$message({
              message: '已提交审核',
              type: 'success'
            });
            _self.getdata();
          } else {
            _self.$message.error(response.data.errmsg);
          }
        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试');

        });
      },
      //修改
      revise(index) {
        let _self = this;

        _self.$router.push({
          path: '/stockdetail',
          query: {
            tabledataDetail: _self.tableData[index],

          }
        })
      },
      //详情
      detail(index) {
        let _self = this;
        _self.$router.push({
          path: '/purchaseexhibition',
          query: {
            tabledataDetail: _self.tableData[index],

          },
        })
      },
      add() {
        let _self = this;
        _self.$router.push({
          path: '/addstock',

        })
      },
      //撤回
      recalls(index) {
        let _self = this;
        let formData = new FormData();
        formData.append('billId', _self.tableData[index].id);
        formData.append('userId', _self.id);
        formData.append('state', '0');
        _self.axios.post(_self.ApiurlStorehouse + '/inventory/withdrawAudit', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode == '0') {
            _self.$message({
              message: '撤回成功',
              type: 'success'
            });
            _self.getdata();
          } else {
            _self.$message.error(response.data.errmsg);
          }
        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试');

        });
      },
      //列表载入
      getdata() {
        let _self = this;
        let formData = new FormData();
        formData.append('pageNum', _self.currentPage);
        formData.append('pageSize', _self.pagesize);
        formData.append('userId', _self.id);
        _self.axios.post(_self.ApiurlStorehouse + '/request/getInvRequestBillCheckList', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode == '0') {

            _self.tableData = response.data.data.list.list
            _self.total = response.data.data.list.total
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
                _self.tableData[i].type = '退货单'
              } else if (_self.tableData[i].type == 'purchase') {
                _self.tableData[i].type = '申购单'
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

              if (response.data.data.list.list[i].state == '0') {
                _self.tableData[i].state = '创建中'

              } else if (response.data.data.list.list[i].state == '1') {
                _self.tableData[i].state = '审核中'

              } else if (response.data.data.list.list[i].state == '2') {
                _self.tableData[i].state = '作废'

              } else if (response.data.data.list.list[i].state == '3') {
                _self.tableData[i].state = '完成'

              } else if (response.data.data.list.list[i].state == '4') {
                _self.tableData[i].state = '未完成'

              }
            }
          } else {
            _self.$message.error('列表载入失败，请刷新重试');
          }
        }).catch(function(error) {
          _self.$message.error('列表载入响应时间过长，请重试');

        });
      },
      //仓库选择
      WarehouseSelection() {
        let _self = this;
        let formData = new FormData();
        formData.append('state', '1');
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
      //仓单类型选择
      warehouserec() {
        let _self = this;
        let formData = new FormData();
        formData.append('state', '1');
        _self.axios.post(_self.ApiurlStorehouse + '/inventory/chooseWarehouseTypeList', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode == '0') {

            _self.transferoptions = response.data.data.list
          } else {
            _self.$message.error('获取仓单类型失败，请刷新重试');
          }
        }).catch(function(error) {
          _self.$message.error('仓单类型时间过长，请重试');

        });
      },
      //单据类型选择
      DocumentTypeSelection() {
        let _self = this;
        let formData = new FormData();
        formData.append('state', '2');
        _self.axios.post(_self.ApiurlStorehouse + '/inventory/chooseWarehouseTypeList', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode == '0') {

            _self.Documenttypeoptions = response.data.data.list
          } else {
            _self.$message.error('获取单据类型失败，请刷新重试');
          }
        }).catch(function(error) {
          _self.$message.error('单据类型响应时间过长，请重试');

        });
      }
    },
    created: function() {
      let _self = this;
      _self.WarehouseSelection();
      _self.DocumentTypeSelection();
      _self.warehouserec();
      _self.getdata();
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
</style>
