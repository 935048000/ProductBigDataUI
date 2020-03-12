<template>
  <div class="app-contion">
    <div style="margin-bottom: 0.9375rem;">
      <label class="stock-label">仓库名：</label>
      <el-select v-model="recall" placeholder="请选择" style='width: 20%;' size="small" @change="recallchange($event)">
        <el-option v-for="item in recalloptions" :key="item.warehouse_code" :label="item.warehouse_name" :value="item">
        </el-option>
      </el-select>
      <el-button type="primary" @click='getdata' size="small">查找</el-button>
    </div>
    <!--startprint-->
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
      <el-table-column label="操作" width="90" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="detail(scope.$index, scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--endprint-->
    <div style="position: fixed;bottom: 0.625rem;right: 0;">
      <el-pagination background layout="prev, pager, next" :total="total" @current-change="current_change">
      </el-pagination>
    </div>
    <!-- 详情 -->
    <el-dialog title="详情" :visible.sync="detailVisible" width="70%" :before-close="handleClose">
      <el-table :data="tableDataDetail" border style="width: 100%">
        <el-table-column prop="production_code" label="商品编码">
        </el-table-column>
        <el-table-column prop="production_name" label="商品名称">
        </el-table-column>
        <el-table-column prop="amount" label="商品数量">
        </el-table-column>
        <el-table-column prop="size" label="商品单位">
        </el-table-column>
        <el-table-column prop="create_at" label="创建时间">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailVisible = false">取 消</el-button>
        <el-button type="primary" @click="detailVisible = false">确 定</el-button>
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
        recall: '',
        tableHeight: window.innerHeight - 160,
        recalloptions: [],
        total: '',
        pagesize: 10,
        currentPage: 1,
        warehousecode: '',
        detailVisible: false
      };
    },
    methods: {
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
      recallchange(Vid) {
        let _self = this;
        _self.warehousecode = Vid.warehouse_code
        _self.recall = Vid.warehouse_name
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

            _self.recalloptions = response.data.data.list
          } else {
            _self.$message.error('获取仓库失败，请刷新重试');
          }
        }).catch(function(error) {
          _self.$message.error('仓库响应时间过长，请重试');

        });
      },
      current_change: function(currentPage) {
        let _self = this;
        _self.currentPage = currentPage;
        let formData = new FormData();
        formData.append('pageNum', _self.currentPage);
        formData.append('pageSize', _self.pagesize);
        formData.append('state', '1');
         formData.append('warehouseCode', _self.warehousecode);
        _self.axios.post(_self.ApiurlStorehouse + '/inventory/actCheckedList', formData, {
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
              } else if (_self.tableData[i].type == '7') {
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
            _self.$message.error('列表载入失败，请刷新重试');
          }
        }).catch(function(error) {
          _self.$message.error('列表载入响应时间过长，请重试');

        });
      },






      //列表载入
      getdata() {
        let _self = this;
        if(_self.recall==''||_self.recall==undefined||_self.recall==null){
            _self.$notify({
          title: '警告',
          message: '仓库为必选项',
          type: 'warning'
        });
        return false;
        }
        let formData = new FormData();
        formData.append('pageNum', _self.currentPage);
        formData.append('pageSize', _self.pagesize);
        formData.append('state', '1');
        formData.append('warehouseCode', _self.warehousecode);
        _self.axios.post(_self.ApiurlStorehouse + '/inventory/actCheckedList', formData, {
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
              } else if (_self.tableData[i].type == '7') {
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
            _self.$message.error('列表载入失败，请刷新重试');
          }
        }).catch(function(error) {
          _self.$message.error('列表载入响应时间过长，请重试');

        });
      }


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
</style>
