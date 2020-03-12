<template>
  <div class="app-contion">
    <div class="table-box">
      <div style="width: 90%;display: flex;flex-wrap: wrap;">
        <div style="margin-bottom: 0.3125rem;">
          <label style="display: inline-block;font-size: 0.875rem;">仓库:</label>
          <el-select
            v-model="warehouse_name"
            :multiple="false"
            filterable
            allow-create
            default-first-option
            placeholder="请选择仓库"
            @change="wareblur"
          >
            <el-option
              v-for="item in warehouseoptions"
              :key="item.warehouse_name"
              :label="item.warehouse_name"
              :value="item"
            ></el-option>
          </el-select>
        </div>
        <div style="margin-bottom: 0.3125rem;">
          <label style="display: inline-block;font-size: 0.875rem;">单据号类型：</label>
          <el-select
            @change="codeblur"
            v-model="refBillType"
            :multiple="false"
            filterable
            allow-create
            default-first-option
            placeholder="请选择关联单据类型"
          >
            <el-option
              v-for="item in typeoptions"
              :key="item.code"
              :label="item.value"
              :value="item"
            ></el-option>
          </el-select>
        </div>
        <div style="margin-bottom: 0.3125rem;">
          <label style="display: inline-block;font-size: 0.875rem;">关联单据号:</label>
          <el-input v-model="refOrderCode" placeholder="请输入关联单据号" style="width: 70%;"></el-input>
        </div>
        <div style="margin-bottom: 0.3125rem;">
          <label style="display: inline-block;font-size: 0.875rem;">仓单类型：</label>
          <el-select
            v-model="type"
            :multiple="false"
            filterable
            allow-create
            default-first-option
            placeholder="请选择仓单类型"
            @change="typeblur"
          >
            <el-option
              v-for="item in ref_orderoptions"
              :key="item.code"
              :label="item.value"
              :value="item"
            ></el-option>
          </el-select>
        </div>
        <div style="margin-bottom: 0.3125rem;">
          <label style="display: inline-block;font-size: 0.875rem;">时间:</label>
          <el-date-picker
            :picker-options="{'disabledDate': (time)=>{
				 return time.getTime() < new Date('2019-09-01  00:00:00');
			 }}"
            v-model="value1"
            unlink-panels
            type="datetimerange"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </div>

        <div style="margin-left: 0.3125rem;">
          <el-button type="primary" @click="serch" style="width: 73px;">查询</el-button>
        </div>
      </div>
      <el-button type="success" class="daochu" @click="exportExcel">导出</el-button>
    </div>
    <!-- <div style="margin-bottom: 5px;">
			<p style="color: #E6A23C">温馨提示：当店铺编码和商铺名称同时存在时以店铺编码为准</p>
    </div>-->
    <el-collapse>
      <el-collapse-item name="1">
        <span class="collapse-title" slot="title">
          <b>报表说明书</b>（点击查看报表使用说明）
        </span>
        <!--<b>注意事项：</b>可选的时间是为了满足查询早餐或者某个点的销售情况，结束子时间是包括该小时的数据。 <br>-->
        <!-- <b>报表功能：</b>查询某个时间区间的品类和商品的销售情况汇总。
        <br />
        <b>使用方法：</b>选择必选时间区间即可满足大部分查询，特殊情况需要查某小时区间，选择可选时间即可。
        <br />
        <b>使用案例：</b>查询2019年1月整月的品类和商品的销售情况。选择时间：2019-01-01 00:00:00 到 2019-02-01 00:00:00
        <font face="arial" color="red">( 2019-02-01 00:00:00 便于选择，约等于 2019-01-31 23:59:59 )</font>-->
      </el-collapse-item>
    </el-collapse>
    <div id="tableid">
      <el-table :data="tableData" border style="width: 100%" :height="tableHeight">
        <el-table-column prop="id" label="仓单号"></el-table-column>
        <el-table-column prop="warehouse_name" label="仓库名称"></el-table-column>
        <el-table-column prop="type" label="类型"></el-table-column>
        <el-table-column prop="ref_order_code" label="关联单据号"></el-table-column>
        <el-table-column prop="ref_order_type" label="关联单据类型"></el-table-column>
        <el-table-column prop="state" label="状态"></el-table-column>
        <el-table-column prop="operator" label="创建人"></el-table-column>
        <el-table-column prop="create_at" label="创建时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="Warehousedetails(scope.$index, scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="footerdeom">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="current_change"
      ></el-pagination>
    </div>

    <!-- 详情 -->
    <el-dialog title="详情" :visible.sync="warehouseVisible" width="60%" :before-close="handleClose">
      <el-table :data="tableDatadetails" border style="width: 100%">
        <el-table-column prop="production_name" label="商品名称"></el-table-column>
        <el-table-column prop="bar_code" label="商品条码"></el-table-column>
        <el-table-column prop="production_code" label="商品编码"></el-table-column>
        <el-table-column prop="amount" label="数量"></el-table-column>
        <el-table-column prop="actual_amount" label="实际数量"></el-table-column>
        <el-table-column prop="size" label="单位"></el-table-column>
        <el-table-column prop="specification" label="规格"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="warehouseVisible = false">确 定</el-button>
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
      shopcode: state => state.userinfo.shopcode,
      cityusername: state => state.userinfo.userName
    })
  },
  data() {
    return {
      pagesize: 10,
      currentPage: 1,
      total: 1,
      value1: "",
      tableData: [],
      tableDatadetails: [], //详情
      warehouseVisible: false,
      tableHeight: window.innerHeight - 250,
      warehouse_name: "", //仓库名称
      warehouse_code: "", //仓库编码
      refOrderCode: "", //关联单据号
      warehouseoptions: [], //仓库
      typeoptions: [], //关联单据号类型
      refBillType: "", //关联单据号类型
      refBillTypeCode: "", //关联单据号code
      ref_orderoptions: "", //仓单类型
      typecode: "", //仓单code
      type: "" //仓单类型
    };
  },
  methods: {
    current_change: function(currentPage) {
      let _self = this;
      _self.currentPage = currentPage;
      var startTime = _self.value1[0];
      var endTime = _self.value1[1];
      if (
        _self.value1 == "" ||
        _self.value1 == undefined ||
        _self.value1 == null ||
        _self.warehouse_code == "" ||
        _self.warehouse_code == undefined
      ) {
        _self.$message({
          message: "时间和仓库为必选项哦！",
          type: "warning"
        });
        return false;
      }
      let formData = new FormData();
      formData.append("pageNum ", _self.currentPage);
      formData.append("pageSize ", _self.pagesize);
      formData.append("warehouseCode ", _self.warehouse_code);
      formData.append("refOrderCode ", _self.refOrderCode);
      formData.append("type", _self.typecode);
      formData.append("refBillType ", _self.refBillTypeCode);
      formData.append("startDate", startTime);
      formData.append("endDate", endTime);
      _self.axios
        .post(
          _self.ApiurlStorehouse + "/inventory/financialQueryWarehouseBill",
          formData,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if (response.data.errcode == "0") {
            _self.tableData = response.data.data.data.list;
            _self.total = response.data.data.data.total;
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
              } else if (_self.tableData[i].type == "6") {
                _self.tableData[i].type = "退货单";
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
              if (_self.tableData[i].state == "0") {
                _self.tableData[i].state = "待审核";
              } else if (_self.tableData[i].state == "1") {
                _self.tableData[i].state = "审核中";
              } else if (_self.tableData[i].state == "2") {
                _self.tableData[i].state = "审核通过";
              } else if (_self.tableData[i].state == "3") {
                _self.tableData[i].state = "审核未通过";
              } else if (_self.tableData[i].state == "4") {
                _self.tableData[i].state = "作废单";
              } else if (
                _self.tableData[i].state == "5" &&
                _self.tableData[i].ref_bill_type == "tranfer.out"
              ) {
                _self.tableData[i].state = "调拨出库通过";
              } else if (
                _self.tableData[i].state == "5" &&
                _self.tableData[i].ref_bill_type == "tranfer.in"
              ) {
                _self.tableData[i].state = "等待调拨入库";
              } else if (_self.tableData[i].state == "6") {
                _self.tableData[i].state = "调拨通过"; //完成
              } else if (_self.tableData[i].state == "7") {
                _self.tableData[i].state = "调拨出库未通过";
              } else if (_self.tableData[i].state == "8") {
                _self.tableData[i].state = "调拨入库未通过";
              }
            }
          } else {
            _self.$message.error("菜单加载失败");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    Warehousedetails(index) {
      let _self = this;
      _self.warehouseVisible = true;
      let formData = new FormData();
      formData.append("orderId ", _self.tableData[index].id);
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
            _self.tableDatadetails = response.data.data.list;
          } else {
            _self.$message.error("获取详情失败哦");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    exportExcel() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../vendor/Export2Excel");
        const tHeader = [
          "仓单号",
          "仓库名称",
          "类型",
          "关联单据号",
          "关联单据类型",
          "状态",
          "创建人",
          "创建时间"
        ];
        // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "id",
          "warehouse_name",
          "type",
          "ref_order_code",
          "ref_order_type",
          "state",
          "operator",
          "create_at"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        const list = this.tableData; //把data里的tableData存到list
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "仓库查询表");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    //仓库
    wareblur(Vid) {
      let _self = this;
      _self.warehouse_name = Vid.warehouse_name;
      _self.warehouse_code = Vid.warehouse_code;
    },
    codeblur(Vid) {
      let _self = this;
      console.log(Vid);
      _self.refBillType = Vid.value;
      _self.refBillTypeCode = Vid.code;
    },
    typeblur(Vid) {
      let _self = this;
      console.log(Vid);
      _self.type = Vid.value;
      _self.typecode = Vid.code;
    },
    //搜索数据
    serch() {
      let _self = this;
      var startTime = _self.value1[0];
      var endTime = _self.value1[1];
      if (
        _self.value1 == "" ||
        _self.value1 == undefined ||
        _self.value1 == null ||
        _self.warehouse_code == "" ||
        _self.warehouse_code == undefined
      ) {
        _self.$message({
          message: "时间和仓库为必选项哦！",
          type: "warning"
        });
        return false;
      }
      let formData = new FormData();
      formData.append("pageNum ", _self.currentPage);
      formData.append("pageSize ", _self.pagesize);
      formData.append("warehouseCode ", _self.warehouse_code);
      formData.append("refOrderCode ", _self.refOrderCode);
      formData.append("type", _self.typecode);
      formData.append("refBillType ", _self.refBillTypeCode);
      formData.append("startDate", startTime);
      formData.append("endDate", endTime);
      _self.axios
        .post(
          _self.ApiurlStorehouse + "/inventory/financialQueryWarehouseBill",
          formData,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if (response.data.errcode == "0") {
            _self.tableData = response.data.data.data.list;
            _self.total = response.data.data.data.total;
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
              } else if (_self.tableData[i].type == "6") {
                _self.tableData[i].type = "退货单";
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
              if (_self.tableData[i].state == "0") {
                _self.tableData[i].state = "待审核";
              } else if (_self.tableData[i].state == "1") {
                _self.tableData[i].state = "审核中";
              } else if (_self.tableData[i].state == "2") {
                _self.tableData[i].state = "审核通过";
              } else if (_self.tableData[i].state == "3") {
                _self.tableData[i].state = "审核未通过";
              } else if (_self.tableData[i].state == "4") {
                _self.tableData[i].state = "作废单";
              } else if (
                _self.tableData[i].state == "5" &&
                _self.tableData[i].ref_bill_type == "tranfer.out"
              ) {
                _self.tableData[i].state = "调拨出库通过";
              } else if (
                _self.tableData[i].state == "5" &&
                _self.tableData[i].ref_bill_type == "tranfer.in"
              ) {
                _self.tableData[i].state = "等待调拨入库";
              } else if (_self.tableData[i].state == "6") {
                _self.tableData[i].state = "调拨通过"; //完成
              } else if (_self.tableData[i].state == "7") {
                _self.tableData[i].state = "调拨出库未通过";
              } else if (_self.tableData[i].state == "8") {
                _self.tableData[i].state = "调拨入库未通过";
              }
            }
          } else {
            _self.$message.error("菜单加载失败");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },

    WarehouseSelection() {
      let _self = this;
      let formData = new FormData();

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
            _self.warehouseoptions = response.data.data.list;
          } else {
            _self.$message.error("获取仓库失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("仓库响应时间过长，请重试");
        });
    },
    //关联单据类型
    getreforderoptions() {
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
            _self.typeoptions = response.data.data.list;
          } else {
            _self.$message.error("获取关联单据类型失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("仓单类型时间过长，请重试");
        });
    },
    //仓单类型加载
    gettypeoptions() {
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
            _self.ref_orderoptions = response.data.data.list;
          } else {
            _self.$message.error("获取仓单类型失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("仓单类型时间过长，请重试");
        });
    }
  },
  created: function() {
    let _self = this;

    _self.WarehouseSelection();
    _self.gettypeoptions();
    _self.getreforderoptions();
  }
};
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
.el-upload--picture-card {
  width: 100px;
  height: 100px;
  line-height: 100px;
}

.el-table__body-wrapper {
  overflow-x: auto;
  overflow-y: auto;
}

.collapse-title {
  flex: 1 0 90%;
  order: 1;
}

.el-collapse-item__header {
  flex: 1 0 auto;
  order: -1;
}
@media screen and (max-width: 1162px) {
  .medatwidth {
    width: 95%;
  }

  .adds {
    height: 22px;
    width: 22px;
  }
}
</style>
