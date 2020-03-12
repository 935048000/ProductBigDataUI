<!--DataReportMonth-->
<template>
  <div class="app-contion">
    <div class="table-box" style="height: 40px;">
      <el-date-picker
        :picker-options="pickerOptions"
        v-model="dateRangeValue"
        unlink-panels
        type="datetimerange"
        range-separator="至"
        value-format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="width: 40%;"
      ></el-date-picker>

      <el-button type="primary" @click="searchs">查询</el-button>
      <el-button type="success" class="daochu" @click="exportExcel">导出</el-button>
    </div>

    <!--下拉文档栏 2019-7-15-->
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item name="1">
        <span class="collapse-title" slot="title">
          <b>报表说明书</b>（点击查看报表使用说明）
        </span>
        <!--<b>注意事项：</b>可选的时间是为了满足查询早餐或者某个点的销售情况，结束子时间是包括该小时的数据。<br>-->
        <b>报表功能：</b>查询某个时间区间的供应商销售报表
        <br />
        <b>使用方法：</b>选择必选时间区间即可。
        <br />
        <b>使用案例：</b>查询2019年1月1日到2019年1月2日的供应商销售情况。选择时间：2019-01-01 00:00:00到 2019-01-02 23:59:59（或2019-01-03 00:00:00）
      </el-collapse-item>
    </el-collapse>

    <div id="tableid">
      <el-table :data="tableData" border style="width: 100%" :height="tableHeight">
        <el-table-column prop="order_date" label="订单日期"></el-table-column>
        <el-table-column prop="provider_name" label="供应商名称"></el-table-column>
        <el-table-column prop="productionName" label="商品名称"></el-table-column>
        <el-table-column prop="productionCode" label="条形码"></el-table-column>
        <el-table-column prop="tc" label="销量"></el-table-column>
        <el-table-column prop="sales" label="理论销售额"></el-table-column>
        <!-- <el-table-column prop="cost" label="成本">
        </el-table-column>-->
      </el-table>
    </div>
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
      options: [],
      tableData: [],
      dateRangeValue: "",
      value2: "",
      value3: "",
      shopSelected: "",
      IdCode: "",
      tableHeight: window.innerHeight - 200,
      pickerOptions: {}
    };
  },

  // watch: {
  //   // 监听选择的城市
  //   value_way: function(val) {
  //     this.getdata(val);
  //   },
  // 选择完城市之后，查询数据库
  //   shopSelected: function(val) {}
  // },
  methods: {
    exportExcel() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../vendor/Export2Excel");
        const tHeader = [
          "订单日期",
          "供应商名称",
          "商品名称",
          "条形码",
          "销量",
          "理论销售额"
        ];
        // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "order_date",
          "productionName",
          "provider_name",
          "productionCode",
          "tc",
          "sales"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        const list = this.tableData; //把data里的tableData存到list
        // var countObj = this.getStatisticsNum(list);
        // list.push(countObj);
        const data = this.formatJson(filterVal, list);
        var dayTemp = new Date();
        dayTemp.setTime(dayTemp.getTime());
        var excelFlieName =
          dayTemp.getFullYear() +
          "-" +
          (dayTemp.getMonth() + 1) +
          "-" +
          dayTemp.getDate() +
          "供应商销售报表";
        export_json_to_excel(tHeader, data, excelFlieName);
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    // 统计表格数据
    getStatisticsNum: function(tableData) {
      var length = tableData.length;
      var ta = 0;
      var sales = 0;
      var tc = 0;
      var cost = 0;
      var result = {};
      for (var i = 0; i < length; i++) {
        var currentObj = tableData[i];
        ta = ta + currentObj.ta;
        sales = sales + currentObj.sales;
        tc = tc + currentObj.tc;
        var tempCost = 0;
        if (currentObj.cost) {
          tempCost = parseFloat(currentObj.cost);
        }
        cost = cost + tempCost;
      }

      result["order_date"] = "合计";
      result["ta"] = (ta / length).toFixed(2);
      result["tc"] = tc.toFixed(2);
      result["sales"] = sales.toFixed(2);
      return result;
    },

    //获取商品信息
    searchs() {
      let _self = this;
      console.log(this.value_way);
      let formData1 = new FormData();
      formData1.append("shopCode", _self.shopcode);
      formData1.append("startTime", _self.dateRangeValue[0]);
      formData1.append("endTime", _self.dateRangeValue[1]);

      // 时间填充,判断子时间是否为空，子时间为空就不传只时间值。
      if (_self.value2.length !== 0 && _self.value3.length !== 0) {
        var dayTemp = new Date();
        dayTemp.setTime(dayTemp.getTime());
        var startInTime_val =
          dayTemp.getFullYear() +
          "-" +
          (dayTemp.getMonth() + 1) +
          "-" +
          dayTemp.getDate() +
          " " +
          _self.value2 +
          ":00";
        var endInTime_val =
          dayTemp.getFullYear() +
          "-" +
          (dayTemp.getMonth() + 1) +
          "-" +
          dayTemp.getDate() +
          " " +
          _self.value3 +
          ":00";
        // formData1.append('startTime', _self);
        // formData1.append('endTime', _self);
        formData1.append("startInTime", startInTime_val);
        formData1.append("endInTime", endInTime_val);
      }

      _self.axios
        .post(_self.ApiUrl + "/home/providerSales", formData1)
        .then(response => {
          if (response.data.errcode == "0") {
            var serverDataArr = response.data.data.data;
            var countObj = this.getStatisticsNum(serverDataArr);
            serverDataArr.push(countObj);
            _self.tableData = response.data.data.data;
          } else {
            _self.$message.error("数据找不到啦，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    // 将拿到的店铺信息，转为option
    setShopCityOption: function(shopList) {
      var result = [];
      for (var i = 0; i < shopList.length; i++) {
        var currentObj = shopList[i];
        result.push({
          shopName: currentObj["shopName"],
          shopCode: currentObj["shopCode"]
        });
      }
      this.options = result;
      return result;
    },

    //商铺列表
    getdata(cityName) {
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
            _self.options = response.data.data.list;
            // var shopArr = getShopListData.data.list;
            // _self.setShopCityOption(shopArr);
            // _self.tableData = shopArr;
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    }
  },

  created: function() {
    // let _self = this;
    // _self.getdata();
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
  right: 5px;
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
/*!*滚动条的宽度*!*/
/*::-webkit-scrollbar {*/
/*width: 15px;*/
/*height: 10px;*/
/*}*/
/*!*滚动条的滑块*!*/
/*::-webkit-scrollbar-thumb {*/
/*background-color: #a1a3a9;*/
/*border-radius: 3px;*/
/*}*/

/*滚动条的宽度*/
/*.el-table__body-wrapper::-webkit-scrollbar {*/
/*width: 6px; // 横向滚动条*/
/*height: 6px; // 纵向滚动条 必写*/
/*}*/
/*滚动条的滑块*/
/*.el-table__body-wrapper::-webkit-scrollbar-thumb {*/
/*background-color: #ddd;*/
/*border-radius: 3px;*/
/*}*/
</style>
