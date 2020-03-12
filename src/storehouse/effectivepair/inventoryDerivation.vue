<template>
  <div class="app-contion">
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
      <el-button type="primary" @click="seachall" style="margin-left: 0.625rem;">查询</el-button>
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

      <el-table-column prop="storeAmount" label="产品库存数量"></el-table-column>
      <el-table-column prop="table01Count" label="主表差量"></el-table-column>
	  <el-table-column prop="storePay" label="库存金额"></el-table-column>
    </el-table>
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

      tableHeight: window.innerHeight - 165,
      currentPage: "",
      mastertable: "", // 主表
      mastertablecode: "", // 主表code

      options1: [],
      secondarytable: "", //次表
      secondarycode: "", //次表code

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
          "产品库存数量",
		  "主表差量",
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
          "storeAmount",
		  "table01Count",
		  'storePay'
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        const list = this.tableData2; //把data里的tableData存到list
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "盘点明细");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
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
      formData.append("table02Code", "");
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
            _self.tableData2 = _self.tableData;

            var str = {
              wareblur: _self.wareblur,
              wareblurcode: _self.wareblurcode
            };

            for (var i = 0; i < _self.tableData2.length; i++) {
              // json[i]
              for (var key in str) {
                _self.tableData2[i][key] = str[key];
              }
            }
            console.log(_self.tableData2);
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
