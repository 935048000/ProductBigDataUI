<template>
  <div class="app-contion">
    <div class="table-box" style="display: flex; flex-wrap:wrap ">
      <div class="ChooseStyles">
        <label class="titles">仓库：</label>
        <el-select v-model="wareblur" filterable placeholder="请选择" @change="wareblurfouncs($event)">
          <el-option
            v-for="item in optionsstorehouse"
            :key="item.warehouse_code"
            :label="item.warehouse_name"
            :value="item"
          ></el-option>
        </el-select>
      </div>
      <el-date-picker v-model="value2" type="month" placeholder="选择年月"         :picker-options="{'disabledDate': (time)=>{
				 return time.getTime() < new Date('2019-09-01  00:00:00');
			 }}"></el-date-picker>
      <el-select v-model="value_way" placeholder="选择城市" value-key="index" style="width: 10%;">
        <el-option
          v-for="(item,index) in options_1"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>

      <el-select
        v-model="shopSelected"
        placeholder="请选择商铺"
        value-key="index"
        style="width: 20%;"
        filterable
      >
        <el-option
          v-for="(item,index) in shops"
          :key="index"
          :label="item.shopName"
          :value="item.shopCode"
        ></el-option>
      </el-select>
      <div class="ChooseStyles" style="margin-left: 0.625rem;">
        <el-button type="primary" @click="screen">查找</el-button>
        <el-button type="warning" @click="exportExcel">导出</el-button>
      </div>
    </div>
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
    <el-table
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      :height="tableHeight"
      border
    >
      <el-table-column prop="productionName" label="商品名称"></el-table-column>
      <el-table-column prop="bar_code" label="条形码"></el-table-column>
      <el-table-column prop="provider_name" label="供应商"></el-table-column>
      <el-table-column prop="cost" label="成本单价"></el-table-column>
      <el-table-column prop="amount" label="期初数"></el-table-column>
      <el-table-column prop="amount_pay" label="期初金额"></el-table-column>
      <el-table-column prop="amount_in" label="本期入库数量"></el-table-column>
      <el-table-column prop="amount_in_pay" label="本期入库金额"></el-table-column>
      <el-table-column prop="amount_out" label="本期出库数量"></el-table-column>
      <el-table-column prop="amount_out_pay" label="本期出库金额"></el-table-column>
      <el-table-column prop="transfer_in" label="本期调拨入库数量"></el-table-column>
      <el-table-column prop="transfer_in_pay" label="本期调拨入库金额"></el-table-column>
      <el-table-column prop="transfer_out" label="本期调拨出库数量"></el-table-column>
      <el-table-column prop="transfer_out_pay" label="本期调拨出库金额"></el-table-column>
      <el-table-column prop="retn_amount" label="本期调拨出库金额"></el-table-column>
      <el-table-column prop="retn_pay" label="本期退货金额"></el-table-column>
      <el-table-column prop="sales_amount" label="本期销售数量"></el-table-column>
      <el-table-column prop="sales_pay" label="本期销售金额"></el-table-column>
      <el-table-column prop="store_amount" label="期末结存数量"></el-table-column>
      <el-table-column prop="store_amount_pay" label="期末结存金额"></el-table-column>
    </el-table>

    <!--<div style="position: fixed;bottom: 0.625rem;right: 0;">-->
    <!--<el-pagination background layout="prev, pager, next" :total="total" @current-change="current_change">-->
    <!--</el-pagination>-->
    <!--</div>-->

    <!--编辑弹框-->
  </div>
</template>

<script>
import { mapState } from "vuex";

import { getLodop, needCLodop } from "../../vuex/LodopFuncs.js";
export default {
  data() {
    return {
      options_1: [
        {
          value: "三亚市",
          label: "三亚市"
        },
        {
          value: "海口市",
          label: "海口市"
        }
      ],
      value_way: "",
      shopSelected: "",
      shops: [],
      barcodes: "", //商品条码
      shoplei: "",
      barCode: "", //商品条形码
      shopteam: "",
      tableData: [],
      total: 10,
      wareblur: "",
      wareblurcode: "",
      currentPage: 1,
      pagesize: 10,
      code: "",
      optionsstorehouse: [],
      options: [],
      options2: [],
      options3: [],
      options4: [],
      disableds: true,
      shopteam2: "",
      categoryCodes: "",
      categoryNames: "",
      indextab: "0",
      tableHeight: window.innerHeight - 200,
      shopteam1: "",
      shopteam22: "",
      shoplei3: "",
      value_way: "",
      value1: "",
      value2: ""
    };
  },
  computed: {
    ...mapState({
      username: state => state.userinfo.account,
      token: state => state.userinfo.token,
      id: state => state.userinfo.id,
      shopcode: state => state.userinfo.shopcode
    })
  },
  watch: {
    // 监听选择的城市
    value_way: function(cityName) {
      var defaultCityName = "三亚市";
      if (cityName) {
        defaultCityName = cityName;
      }

      let _self = this;
      let formData2 = new FormData();
      formData2.append("city ", defaultCityName);
      _self.axios
        .post(_self.ApiUrl + "/commodity/getShopList", formData2)
        .then(response => {
          if (response.data.errcode == "0") {
            _self.shops = response.data.data.list;
            // var shopArr = getShopListData.data.list;
            // _self.setShopCityOption(shopArr);
            // _self.tableData = shopArr;
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    }
    // 选择完城市之后，查询数据库
  },
  methods: {
    wareblurfouncs(Vid) {
      let _self = this;
      // console.log(Vid)
      _self.wareblur = Vid.warehouse_name;
      _self.wareblurcode = Vid.warehouse_code;
    },
    //仓库选择
    WarehouseSelection() {
      let _self = this;
      let formData = new FormData();
      formData.append("userId", _self.id);
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
            _self.optionsstorehouse = response.data.data.list;
          } else {
            _self.$message.error("获取仓库失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("仓库响应时间过长，请重试");
        });
    },
    exportExcel() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../vendor/Export2Excel");
        const tHeader = [
          "商品名称",
          "条形码",
          "供应商",
          "成本单价",
          "期初数",
          "期初金额",
          "本期入库数量",
          "本期入库金额",
          "本期出库数量",
          "本期出库金额",
          "本期调拨入库数量",
          "本期调拨入库金额",
          "本期调拨出库数量",
          "本期调拨出库金额",
          "本期退货数量",
          "本期退货金额",
          "本期销售数量",
          "本期销售金额",
          "期末结存数量",
          "期末结存金额"
        ];
        // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "productionName",
          "bar_code",
          "provider_name",
          "cost",
          "amount",
          "amount_pay",
          "amount_in",
          "amount_in_pay",
          "amount_out",
          "amount_out_pay",
          "transfer_in", //本期调拨入库数量
          "transfer_in_pay", //本期调拨入库金额
          "transfer_out", //本期调拨出库数量
          "transfer_out_pay", //本期调拨出库金额
          "retn_amount", //本期退货数量
          "retn_pay", //本期退货金额
          "sales_amount", //本期销售数量
          "sales_pay", //本期销售金额
          "store_amount",
          "store_amount_pay"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        const list = this.tableData; //把data里的tableData存到list
        const data = this.formatJson(filterVal, list);
        var dayTemp = new Date();
        dayTemp.setTime(dayTemp.getTime());
        var excelFlieName =
          dayTemp.getFullYear() +
          "-" +
          (dayTemp.getMonth() + 1) +
          "-" +
          dayTemp.getDate() +
          "进销存报表";
        export_json_to_excel(tHeader, data, excelFlieName);
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },

    //筛选
    screen() {
      let _self = this;
      let formData = new FormData();

      var date;
      date = new Date(_self.value2);
      var startTime =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + "01 00:00:00";
      var endTime =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + "31 23:59:59";

      formData.append("warehouseCode", _self.wareblurcode);
      formData.append("shopCode", _self.shopSelected);
      formData.append("startTime", startTime);
      formData.append("endTime", endTime);

      //发送请求
      _self.axios
        .post(_self.ApiUrl + "/home/StockSellStorage", formData)
        .then(response => {
          console.log(response);
          if (response.data.errcode == "0") {
            let list = [];
            let data = response.data.data.data;
            for (let i = 0; i < data.length; i++) {
              let item = {};
              item.productionName = data[i].productionName;
              item.bar_code = data[i].bar_code;
              item.provider_name = data[i].provider_name;
              item.cost = data[i].cost;
              item.amount = data[i].amount;
              item.amount_pay = data[i].amount_pay;
              item.amount_in = data[i].amount_in;
              item.amount_in_pay = data[i].amount_in_pay;
              item.amount_out = data[i].amount_out;
              item.amount_out_pay = data[i].amount_out_pay;
              item.transfer_in = data[i].transfer_in;
              item.transfer_in_pay = data[i].transfer_in_pay;
              item.transfer_out = data[i].transfer_out;
              item.transfer_out_pay = data[i].transfer_out_pay;
              item.retn_amount = data[i].retn_amount;
              item.retn_pay = data[i].retn_pay;
              item.sales_amount = data[i].sales_amount;
              item.sales_pay = data[i].sales_pay;
              item.store_amount = data[i].store_amount;
              item.store_amount_pay = data[i].store_amount_pay;
              list.push(item);
            }
            _self.tableData = list;
          } else {
            _self.$message.error("找不到列表信息了");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    }
  },
  created: function() {
    let _self = this;
    // _self.OneCategoryCode();
    _self.WarehouseSelection();
  }
};
</script>
<style>
.searchBox {
  padding: 0.625rem 0;
  /* border-bottom: 0.0625rem solid rgb(235, 238, 245); */
}

.app-contion {
  margin: 10px;
}

.btn-box {
  text-align: center;
  margin: 10px;
}

.footers {
  position: fixed;
  bottom: 0.625rem;
  left: 210px;
  background: #fff;
  width: 85%;
}

.titles {
  font-size: 14px;
  margin-left: 10px;
}

.addlistsd12 {
  position: fixed;
  right: 15px;
  top: 65px;
}

.w-30 {
  width: 20%;
  display: inline-block;
  text-align: center;
}

.title-box {
  margin: 10px 0;
}

.images {
  width: 60px;
  height: 60px;
}

.images img {
  width: 100%;
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
.ChooseStyles {
  margin: 3px 0;
}
</style>
