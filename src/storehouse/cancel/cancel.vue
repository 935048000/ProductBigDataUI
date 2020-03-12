<template>
  <div class="app-contion">
    <div class="stock-header">
      <label class="stock-label">时间：</label>
      <el-date-picker
        :picker-options="{'disabledDate': (time)=>{
				 return time.getTime() < new Date('2019-09-01  00:00:00');
			 }}"
        v-model="datetime"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetimerange"
        range-separator="至"
        start-placeholder="起始时间"
        end-placeholder="结束时间"
        style="width: 25%;"
        size="small"
      ></el-date-picker>
      <label class="stock-label">申请人：</label>
      <el-input
        v-model="Applicant"
        placeholder="请输入申请人"
        style="width: 15%;"
        size="small"
        class="stock-margin"
      ></el-input>

      <el-button type="primary" @click="seachall" size="small">查找</el-button>
    </div>
    <!--startprint-->
    <el-table :data="tableData" border :height="tableHeight" style="width: 100%" id="printTable">
      <el-table-column prop="id" label="订单号"></el-table-column>
      <el-table-column prop="warehouse_name" label="仓库名"></el-table-column>
      <el-table-column prop="warehouse_code" label="仓库编码"></el-table-column>
      <el-table-column prop="type" label="仓单类型"></el-table-column>
      <el-table-column prop="ref_order_code" label="关联单据号"></el-table-column>
      <el-table-column prop="ref_order_type" label="关联单据类型"></el-table-column>
      <el-table-column prop="operator" label="申请人"></el-table-column>
      <el-table-column prop="apply_time" label="申请时间"></el-table-column>
      <el-table-column prop="state" label="仓单状态"></el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="detail(scope.$index, scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--endprint-->
    <div style="position: fixed;bottom: 0.625rem;right: 0;">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="current_change"
      ></el-pagination>
    </div>
    <!-- 详情 -->
    <el-dialog title="详情" :visible.sync="detailVisible" width="70%" :before-close="handleClose">
      <el-table :data="tableDataDetail" border style="width: 100%">
        <el-table-column prop="production_code" label="商品编码"></el-table-column>
        <el-table-column prop="production_name" label="商品名称"></el-table-column>
        <el-table-column prop="amount" label="商品数量"></el-table-column>
        <el-table-column prop="size" label="商品单位"></el-table-column>
        <el-table-column prop="create_at" label="创建时间"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailVisible = false">取 消</el-button>
        <el-button type="primary" @click="detailVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
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
      Applicant: "", //申请人
      tableData: [],
      tableDataDetail: [],
      tableHeight: window.innerHeight - 210,
      datetime: "", //时间选择
      documents: "", //单据编号输入
      transfer: "", //仓单类型
      recall: "", //仓库
      Documenttype: "", //单据类型
      recalloptions: [],
      transferoptions: [],
      Documenttypeoptions: [],
      total: "",
      pagesize: 10,
      currentPage: 1,
      tabindex: 0,
      detailVisible: false
    };
  },
  methods: {
    //详情
    detail(index) {
      let _self = this;
      _self.detailVisible = true;
      let formData = new FormData();
      formData.append("orderId", _self.tableData[index].id);
      _self.axios
        .post(
          _self.ApiurlStorehouse +
            "/inventory/getInvBillDetailProductionDetailLists",
          formData,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if (response.data.errcode == "0") {
            _self.tableDataDetail = response.data.data.list;
          } else {
            _self.$message.error("获取列表失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("获取列表时间过长，请重试");
        });
    },
    //搜索
    seachall() {
      let _self = this;
      if (_self.datetime == "" && _self.Applicant == "") {
        _self.$message({
          type: "warning",
          message: "您还没有输入搜索内容哦！",
          showClose: true
        });
        return false;
      }
      let formData = new FormData();
      formData.append("pageNum", _self.currentPage);
      formData.append("pageSize", _self.pagesize);
      formData.append("operator", _self.Applicant);
      if (_self.datetime[0] == undefined) {
        formData.append("startDate", "");
      } else {
        formData.append("startDate", _self.datetime[0]);
      }
      if (_self.datetime[1] == undefined) {
        formData.append("endDate", "");
      } else {
        formData.append("endDate", _self.datetime[1]);
      }
      formData.append("userId", _self.id);
      _self.axios
        .post(
          _self.ApiurlStorehouse + "/inventory/queryInvalidInvBillsList",
          formData,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if (response.data.errcode == "0") {
            _self.tabindex = "1";
            _self.tableData = response.data.data.list.list;
            _self.total = response.data.data.list.total;
            for (var i = 0; i < _self.tableData.length; i++) {
              if (_self.tableData[i].type == "1") {
                _self.tableData[i].type = "入库";
              } else if (_self.tableData[i].type == "2") {
                _self.tableData[i].type = "出库";
              } else if (_self.tableData[i].type == "3") {
                _self.tableData[i].type = "其他入库";
              } else if (_self.tableData[i].type == "4") {
                _self.tableData[i].type = "其他出库";
              } else if (_self.tableData[i].type == "5") {
                _self.tableData[i].type = "调库";
              }

              if (_self.tableData[i].ref_order_type == "1") {
                _self.tableData[i].ref_order_type = "采购单号";
              } else if (_self.tableData[i].ref_order_type == "2") {
                _self.tableData[i].ref_order_type = "销售单号";
              } else if (_self.tableData[i].ref_order_type == "3") {
                _self.tableData[i].ref_order_type = "合同号";
              } else if (_self.tableData[i].ref_order_type == "4") {
                _self.tableData[i].ref_order_type = "调拨单";
              }

              if (response.data.data.list.list[i].state == "0") {
                _self.tableData[i].state = "待审核";
              } else if (response.data.data.list.list[i].state == "1") {
                _self.tableData[i].state = "审核中";
              } else if (response.data.data.list.list[i].state == "2") {
                _self.tableData[i].state = "审核通过";
              } else if (response.data.data.list.list[i].state == "3") {
                _self.tableData[i].state = "审核未通过";
              }
              if (response.data.data.list.list[i].state == "0") {
                _self.tableData[i].state = "待审核";
              } else if (response.data.data.list.list[i].state == "1") {
                _self.tableData[i].state = "审核中";
              } else if (response.data.data.list.list[i].state == "2") {
                _self.tableData[i].state = "审核通过";
              } else if (response.data.data.list.list[i].state == "3") {
                _self.tableData[i].state = "审核未通过";
              } else if (response.data.data.list.list[i].state == "4") {
                _self.tableData[i].state = "作废单";
              }
            }
          } else {
            _self.$message.error("搜索失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    current_change: function(currentPage) {
      let _self = this;
      _self.currentPage = currentPage;
      if (_self.tabindex == "1") {
        _self.seachall();
      } else {
        let formData = new FormData();
        formData.append("pageNum", _self.currentPage);
        formData.append("pageSize", _self.pagesize);
        formData.append("userId", _self.id);

        _self.axios
          .post(
            _self.ApiurlStorehouse + "/inventory/getInvalidInvBillsList",
            formData,
            {
              // 单独配置
              withCredentials: false
            }
          )
          .then(response => {
            if (response.data.errcode == "0") {
              _self.tableData = response.data.data.list.list;
              _self.total = response.data.data.list.total;
              for (var i = 0; i < _self.tableData.length; i++) {
                if (_self.tableData[i].type == "1") {
                  _self.tableData[i].type = "入库";
                } else if (_self.tableData[i].type == "2") {
                  _self.tableData[i].type = "出库";
                } else if (_self.tableData[i].type == "3") {
                  _self.tableData[i].type = "其他入库";
                } else if (_self.tableData[i].type == "4") {
                  _self.tableData[i].type = "其他出库";
                } else if (_self.tableData[i].type == "5") {
                  _self.tableData[i].type = "调库";
                }

                if (_self.tableData[i].ref_order_type == "1") {
                  _self.tableData[i].ref_order_type = "采购单号";
                } else if (_self.tableData[i].ref_order_type == "2") {
                  _self.tableData[i].ref_order_type = "销售单号";
                } else if (_self.tableData[i].ref_order_type == "3") {
                  _self.tableData[i].ref_order_type = "合同号";
                } else if (_self.tableData[i].ref_order_type == "4") {
                  _self.tableData[i].ref_order_type = "调拨单";
                }

                if (response.data.data.list.list[i].state == "0") {
                  _self.tableData[i].state = "待审核";
                } else if (response.data.data.list.list[i].state == "1") {
                  _self.tableData[i].state = "审核中";
                } else if (response.data.data.list.list[i].state == "2") {
                  _self.tableData[i].state = "审核通过";
                } else if (response.data.data.list.list[i].state == "3") {
                  _self.tableData[i].state = "审核未通过";
                } else if (response.data.data.list.list[i].state == "4") {
                  _self.tableData[i].state = "作废单";
                }
              }
            } else {
              _self.$message.error("列表载入失败，请刷新重试");
            }
          })
          .catch(function(error) {
            _self.$message.error("列表载入响应时间过长，请重试");
          });
      }
    },
    //重置
    resetting() {
      let _self = this;
      _self.datetime = "";
      _self.documents = "";
      _self.Documenttype = "";
      _self.recall = "";
      _self.transfer = "";
    },

    //列表载入
    getdata() {
      let _self = this;
      let formData = new FormData();
      formData.append("pageNum", _self.currentPage);
      formData.append("pageSize", _self.pagesize);
      formData.append("userId", _self.id);

      _self.axios
        .post(
          _self.ApiurlStorehouse + "/inventory/getInvalidInvBillsList",
          formData,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if (response.data.errcode == "0") {
            _self.tableData = response.data.data.list.list;
            _self.total = response.data.data.list.total;
            _self.tabindex = "0";
            for (var i = 0; i < _self.tableData.length; i++) {
              if (_self.tableData[i].type == "1") {
                _self.tableData[i].type = "入库";
              } else if (_self.tableData[i].type == "2") {
                _self.tableData[i].type = "出库";
              } else if (_self.tableData[i].type == "3") {
                _self.tableData[i].type = "其他入库";
              } else if (_self.tableData[i].type == "4") {
                _self.tableData[i].type = "其他出库";
              } else if (_self.tableData[i].type == "5") {
                _self.tableData[i].type = "调库";
              }

              if (_self.tableData[i].ref_order_type == "1") {
                _self.tableData[i].ref_order_type = "采购单号";
              } else if (_self.tableData[i].ref_order_type == "2") {
                _self.tableData[i].ref_order_type = "销售单号";
              } else if (_self.tableData[i].ref_order_type == "3") {
                _self.tableData[i].ref_order_type = "合同号";
              } else if (_self.tableData[i].ref_order_type == "4") {
                _self.tableData[i].ref_order_type = "调拨单";
              }

              if (response.data.data.list.list[i].state == "0") {
                _self.tableData[i].state = "待审核";
              } else if (response.data.data.list.list[i].state == "1") {
                _self.tableData[i].state = "审核中";
              } else if (response.data.data.list.list[i].state == "2") {
                _self.tableData[i].state = "审核通过";
              } else if (response.data.data.list.list[i].state == "3") {
                _self.tableData[i].state = "审核未通过";
              } else if (response.data.data.list.list[i].state == "4") {
                _self.tableData[i].state = "作废单";
              }
            }
          } else {
            _self.$message.error("列表载入失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("列表载入响应时间过长，请重试");
        });
    },
    //仓库选择
    WarehouseSelection() {
      let _self = this;
      let formData = new FormData();
      formData.append("state", "1");
      _self.axios
        .post(
          _self.ApiurlStorehouse + "/inventory/chooseWarehouseList",
          formData,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if (response.data.errcode == "0") {
            _self.recalloptions = response.data.data.list;
          } else {
            _self.$message.error("获取仓库失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("仓库响应时间过长，请重试");
        });
    },
    //仓单类型选择
    warehouserec() {
      let _self = this;
      let formData = new FormData();
      formData.append("state", "1");
      _self.axios
        .post(
          _self.ApiurlStorehouse + "/inventory/chooseWarehouseTypeList",
          formData,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if (response.data.errcode == "0") {
            _self.transferoptions = response.data.data.list;
          } else {
            _self.$message.error("获取仓单类型失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("仓单类型时间过长，请重试");
        });
    },
    //单据类型选择
    DocumentTypeSelection() {
      let _self = this;
      let formData = new FormData();
      formData.append("state", "2");
      _self.axios
        .post(
          _self.ApiurlStorehouse + "/inventory/chooseWarehouseTypeList",
          formData,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if (response.data.errcode == "0") {
            _self.Documenttypeoptions = response.data.data.list;
          } else {
            _self.$message.error("获取单据类型失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("单据类型响应时间过长，请重试");
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
};
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
</style>
