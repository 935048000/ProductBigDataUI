<template>
  <div class="app-contion">
    <div style="margin-bottom: 5px;">
      <p style="color: #E6A23C">温馨提示：仓库为首选项 ( *生成调拨单以主表数量为准 )</p>
    </div>
    <div class="stock-header" style="display: flex;">
      <label class="stock-labels stock-tiao">仓库：</label>
      <el-select v-model="wareblur" filterable placeholder="请选择" @change="wareblurchange">
        <el-option
          v-for="item in options3"
          :key="item.warehouse_code"
          :label="item.warehouse_name"
          :value="item"
        ></el-option>
      </el-select>
      <label class="stock-labels stock-tiao">主表：</label>
      <el-select v-model="mastertable" placeholder="请选择" filterable @change="mastertablechange">
        <el-option
          v-for="item in options1"
          :key="item.code"
          :label="item.code+'--'+item.owner"
          :value="item"
        ></el-option>
      </el-select>
      <label class="stock-labels stock-tiao">次表：</label>

      <el-select
        v-model="secondarytable"
        filterable
        placeholder="请选择"
        @change="secondarytablechange"
      >
        <el-option
          v-for="item in options2"
          :key="item.code"
          :label="item.code+'--'+item.owner"
          :value="item"
        ></el-option>
      </el-select>

      <el-button type="primary" @click="seachall" style="margin-left: 0.625rem;">校对</el-button>
      <el-button type="warning" size="small" @click="allocation">生成调拨</el-button>
      <el-button type="warning" size="small" @click="exportExcel">导出</el-button>
    </div>

    <!--startprint-->
    <el-table :data="tableData" border :height="tableHeight" style="width: 100%" id="printTable">
      <el-table-column prop="wareblur" label="仓库">
        <template slot-scope="scope">
          <span>{{wareblur}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="wareblurcode" label="仓库编码">
        <template slot-scope="scope">
          <span>{{wareblurcode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="产品名称"></el-table-column>
      <el-table-column prop="production_code" label="产品编码"></el-table-column>
      <el-table-column prop="production_bar_code" label="产品条形码"></el-table-column>
      <el-table-column label="主表产品数量">
        <template slot-scope="scope">
          <span style="color: green;font-weight: bold;">{{scope.row.table01}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="table02" label="次表产品数量"></el-table-column>
      <el-table-column prop="storeAmount" label="产品库存数量"></el-table-column>
      <el-table-column prop="table01Count" label="主表差量"></el-table-column>

      <el-table-column prop="table02Count" label="次表差量"></el-table-column>
      <el-table-column prop="storePay" label="库存金额"></el-table-column>
      <el-table-column fixed="right" label="操作" width="80">
        <template slot-scope="scope">
          <el-button size="small" @click="edit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 调表单 -->
    <el-dialog title="调拨" :visible.sync="dialogVisible" width="75%" :before-close="handleClose">
      <el-tabs v-model="activeName" type="card" class="tabsnew">
        <el-tab-pane label="生成入库" name="first">
          <div class="churustle">
            <el-button size="mini" type="warning" class="churustlebtn" @click="warehousingbtn">生成入库</el-button>
            <el-table :data="tableData2" border style="width: 100%">
              <el-table-column prop="production_name" label="商品名"></el-table-column>
              <el-table-column prop="production_code" label="商品编码"></el-table-column>
              <el-table-column prop="storeAmount" label="仓库数量"></el-table-column>
              <el-table-column prop="table01" label="主表数量"></el-table-column>
              <el-table-column prop="amount" label="主表/仓库差额"></el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="生成出库" name="second">
          <div class="churustle">
            <el-button size="mini" type="success" class="churustlebtn" @click="retrievalbtn">生成出库</el-button>
            <el-table :data="tableData3" border style="width: 100%">
              <el-table-column prop="production_name" label="商品名"></el-table-column>
              <el-table-column prop="production_code" label="商品编码"></el-table-column>
              <el-table-column prop="storeAmount" label="仓库数量"></el-table-column>
              <el-table-column prop="table01" label="主表数量"></el-table-column>
              <el-table-column prop="amount" label="主表/仓库差额"></el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑弹框 -->
    <el-dialog title="编辑" :visible.sync="editdialog" width="30%" :before-close="handleClose">
      主产品数量：
      <el-input
        v-model="capitalnum"
        placeholder="请输入主产品数量"
        style="margin: 0.625rem 0.625rem 0.625rem 0;"
      ></el-input>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialog = false">取 消</el-button>
        <el-button type="primary" @click="editup">确 定</el-button>
      </span>
    </el-dialog>
    <!--endprint-->
    <!-- <div style="position: fixed;bottom: 0.625rem;right: 0;">
			<el-pagination background layout="prev, pager, next" :total="total" @current-change="current_change">
			</el-pagination>
    </div>-->
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
      activeName: "first",
      capitalnum: "", //主产品数量
      tableData: [],
      tableData2: [],
      tableData3: [],
      tableDatasd: [],
      tableHeight: window.innerHeight - 165,
      currentPage: "",
      mastertable: "", // 主表
      mastertablecode: "", // 主表code
      dialogVisible: false,
      editdialog: false, //编辑
      options1: [],
      secondarytable: "", //次表
      secondarycode: "", //次表code
      options2: [],
      wareblur: "", //仓库
      wareblurcode: "", //仓库code
      options3: [],
      total: "",
      production_bar_code: "",
      orderId: ""
    };
  },
  methods: {
    exportExcel() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../vendor/Export2Excel");
        const tHeader = [
          "仓库",
          "仓库编码",
          "产品名称",
          "产品编码",
          "产品条形码",
          "主表产品数量",
          "次表产品数量",
          "产品库存数量",
          "主表差量",
          "次表差量",
          '库存金额'
        ];
        // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "wareblur",
          "wareblurcode",
          "name",
          "production_code",
          "production_bar_code",
          "table01",
          "table02",
          "storeAmount",
          "table01Count",
          "table02Count",
          'storePay'
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        const list = this.tableDatasd; //把data里的tableData存到list
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "盘点明细");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    //入库
    warehousingbtn() {
      let _self = this;
      if (_self.tableData2 == "") {
        _self.$message({
          message: "并没有入库商品，请添加商品后再进行入库操作",
          type: "warning"
        });
        return false;
      }

      let formData = new FormData();
      formData.append("warehouse_code", _self.wareblurcode); // 仓库编码
      formData.append("warehouse_name", _self.wareblur); //仓库名称
      formData.append("type ", "3");
      formData.append("ref_order_code", _self.mastertablecode); //这表订单号code
      formData.append("ref_order_type", "3");
      formData.append("entryWarehouseCode", "");
      formData.append("entryWarehouseName", "");
      formData.append("userId", _self.id);
      formData.append("supplierCode", "");
      _self.axios
        .post(_self.ApiurlStorehouse + "/inventory/createInvBills", formData, {
          // 单独配置
          withCredentials: false
        })
        .then(response => {
          if (response.data.errcode == "0") {
            var listbox = {
              list: _self.tableData2,
              warehouse_code: _self.wareblurcode,
              warehouse_name: _self.wareblur,
              type: "3",
              ref_order_code: _self.mastertablecode,
              ref_order_type: "3",
              id: response.data.data.orderId,
              supplierCode: ""
            };
            _self.orderId = response.data.data.orderId;
            _self.axios
              .post(
                _self.ApiurlStorehouse + "/inventory/updateInvBills",
                {
                  jsonData: listbox
                },
                {
                  // 单独配置
                  withCredentials: false
                },
                {
                  headers: {
                    "Content-Type": "application/json;charsetset=UTF-8"
                  }
                }
              )
              .then(response => {
                if (response.data.errcode == "0") {
                  _self.$message({
                    message: "入库成功",
                    type: "success"
                  });
                  _self.$notify({
                    title: "提示",
                    message: "您的入库单号为：" + _self.orderId,
                    duration: 0
                  });
                  _self.dialogVisible = false;
                } else if (response.data.errcode == "1007") {
                  _self.$message.error(response.data.data.msg);
                } else {
                  _self.$message.error("入库失败，请重试");
                }
              })
              .catch(function(error) {
                _self.$message.error("响应时间过长，请重试");
              });
          } else {
            _self.$message.error("生成入库失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    //出库
    retrievalbtn() {
      let _self = this;
      if (_self.tableData3 == "") {
        _self.$message({
          message: "并没有出库商品，请添加商品后再进行出库操作",
          type: "warning"
        });
        return false;
      }
      let formData = new FormData();
      formData.append("warehouse_code", _self.wareblurcode); // 仓库编码
      formData.append("warehouse_name", _self.wareblur); //仓库名称
      formData.append("type ", "4");
      formData.append("ref_order_code", _self.mastertablecode); //这表订单号code
      formData.append("ref_order_type", "3");
      formData.append("userId", _self.id);
      formData.append("entryWarehouseCode", "");
      formData.append("entryWarehouseName", "");
      formData.append("supplierCode", "");
      _self.axios
        .post(_self.ApiurlStorehouse + "/inventory/createInvBills", formData, {
          // 单独配置
          withCredentials: false
        })
        .then(response => {
          if (response.data.errcode == "0") {
            var listbox = {
              list: _self.tableData3,
              warehouse_code: _self.wareblurcode,
              warehouse_name: _self.wareblur,
              type: "4",
              ref_order_code: _self.mastertablecode,
              ref_order_type: "3",
              id: response.data.data.orderId,
              supplierCode: ""
            };
            _self.orderId = response.data.data.orderId;
            _self.axios
              .post(
                _self.ApiurlStorehouse + "/inventory/updateInvBills",
                {
                  jsonData: listbox
                },
                {
                  // 单独配置
                  withCredentials: false
                },
                {
                  headers: {
                    "Content-Type": "application/json;charsetset=UTF-8"
                  }
                }
              )
              .then(response => {
                if (response.data.errcode == "0") {
                  _self.$message({
                    message: "出库成功",
                    type: "success"
                  });
                  _self.$notify({
                    title: "提示",
                    message: "您的出库单号为：" + _self.orderId,
                    duration: 0
                  });
                  _self.dialogVisible = false;
                } else if (response.data.errcode == "1007") {
                  _self.$message.error(response.data.data.msg);
                } else {
                  _self.$message.error("出库失败，请重试");
                }
              })
              .catch(function(error) {
                _self.$message.error("响应时间过长，请重试");
              });
          } else {
            _self.$message.error("生成出库失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },

    //编辑
    edit(index, row) {
      let _self = this;
      _self.editdialog = true;
      _self.capitalnum = _self.tableData[index].table01;
      _self.production_bar_code = _self.tableData[index].production_bar_code;
    },
    editup() {
      let _self = this;
      let formData = new FormData();
      formData.append("amount", _self.capitalnum);
      formData.append("barCode", _self.production_bar_code);
      formData.append("stockCode", _self.mastertablecode);
      _self.axios
        .post(
          _self.ApiurlStorehouse + "/stocktaking/updateStocktingAmount",
          formData,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if (response.data.errcode == "0") {
            _self.$message({
              message: "编辑成功",
              type: "success"
            });
            _self.editdialog = false;
            _self.production_bar_code = "";
            _self.seachall();
          } else {
            _self.editdialog = false;
            _self.$message.error("编辑失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("编辑保存响应时间过长，请重试");
        });
    },
    //校对
    seachall() {
      let _self = this;
      if (_self.mastertable == "" || _self.wareblur == "") {
        _self.$message({
          message: "主表和仓库为必选项",
          type: "warning"
        });
        return false;
      }

      let formData = new FormData();
      formData.append("warehouseCode", _self.wareblurcode);
      formData.append("table01Code", _self.mastertablecode);
      formData.append("table02Code", _self.secondarycode);
      _self.axios
        .post(
          _self.ApiurlStorehouse + "/stocktaking/inventoryCheck",
          formData,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if (response.data.errcode == "0") {
            _self.tableData = response.data.data.list;
            _self.tableDatasd = _self.tableData;

            var str = {
              wareblur: _self.wareblur,
              wareblurcode: _self.wareblurcode
            };

            for (var i = 0; i < _self.tableDatasd.length; i++) {
              // json[i]
              for (var key in str) {
                _self.tableDatasd[i][key] = str[key];
              }
            }
            console.log(_self.tableDatasd);
          } else {
            _self.$message.error("列表载入失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("列表载入响应时间过长，请重试");
        });
    },

    //仓库
    wareblurchange(Vid) {
      let _self = this;
      _self.wareblur = Vid.warehouse_name;
      _self.wareblurcode = Vid.warehouse_code;
      //主次表api
      let formData2 = new FormData();
      formData2.append("warehouseCode", Vid.warehouse_code);
      _self.axios
        .post(
          _self.ApiurlStorehouse + "/stocktaking/getStocktakingCodeList",
          formData2,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if (response.data.errcode == "0") {
            _self.options1 = response.data.data.list;
            _self.options2 = response.data.data.list;
          } else if (response.data.errcode == "1008") {
            _self.$message.error(response.data.data.msg);
          } else {
            _self.$message.error("获取主次表失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("主次表响应时间过长，请重试");
        });
    },
    //主表
    mastertablechange(Vid) {
      let _self = this;
      _self.mastertable = Vid.code + "--" + Vid.owner;
      _self.mastertablecode = Vid.code;
    },
    //次表
    secondarytablechange(Vid) {
      let _self = this;
      _self.secondarycode = Vid.code;
      _self.secondarytable = Vid.code + "--" + Vid.owner;
    },
    //仓库选择
    WarehouseSelection() {
      let _self = this;
      let formData = new FormData();
      formData.append("userId", _self.id);
      _self.axios
        .post(
          _self.ApiurlStorehouse + "/inventory/choouseTransferOut",
          formData,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if (response.data.errcode == "0") {
            _self.options3 = response.data.data.list;
          } else {
            _self.$message.error("获取仓库失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("仓库响应时间过长，请重试");
        });
    },

    //调拨
    allocation() {
      let _self = this;
      _self.dialogVisible = true;
      let formData = new FormData();
      formData.append("warehouseCode", _self.wareblurcode);
      formData.append("table01Code", _self.mastertablecode);
      formData.append("table02Code", _self.secondarycode);
      _self.axios
        .post(
          _self.ApiurlStorehouse + "/inventory/generationWarehouseReceipt",
          formData,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if (response.data.errcode == "0") {
            _self.tableData2 = response.data.data.entryList;
            _self.tableData3 = response.data.data.outList;
          } else {
            _self.$message.error("获取主次表失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("主次表响应时间过长，请重试");
        });
    }
  },
  created: function() {
    let _self = this;
    _self.WarehouseSelection();
  }
};
</script>

<style>
.churustle {
  position: relative;
  padding: 2.925rem 0.625rem 0.625rem 0.625rem;
}

.churustlebtn {
  position: absolute;
  right: 0.625rem;
  top: 0.3125rem;
}

.app-contion {
  margin: 0.625rem;
}

.stock-header {
  margin: 5px 0;
}

.stock-labels {
  font-size: 0.875rem;
  margin-left: 0.625rem;
  display: inline-block;
}

.stock-tiao {
  margin-top: 0.6375rem;
  width: 7%;
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

.tabsnew .el-tabs__item {
  height: 2.5rem !important;
  line-height: 2.5rem !important;
}
</style>
