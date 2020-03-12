<!--DataReportMonth-->
<template>
  <div class="app-contion">
    <div class="table-box" style="height: 40px;">
      <el-date-picker
        :picker-options="{'disabledDate': (time)=>{
				 return time.getTime() < new Date('2019-09-01  00:00:00');
			 }}"
        v-model="dateRangeValue"
        unlink-panels
        type="datetimerange"
        range-separator="至"
        value-format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="width: 40%;"
      ></el-date-picker>
      <!-- <el-time-select
        v-model="value2"
        :picker-options="{
                          start: '00:00',
                          step: '01:00',
                          end: '23:00'
                          }"
        placeholder="可选开始子时间(小时)">
      </el-time-select>-->
      <!-- <el-time-select
        v-model="value3"
        :picker-options="{
                          start: '00:59',
                          step: '01:00',
                          end: '23:59'
                          }"
        placeholder="可选结束子时间(小时)">
      </el-time-select>-->
      <el-button type="primary" @click="searchs">查询</el-button>
      <el-button type="success" class="daochu" @click="exportExcel">导出</el-button>
    </div>

    <!--<div class="block">-->
    <!--<span class="titles">-->
    <!--<b>注意事项：</b>可选的时间是为了满足查询早餐或者某个点的销售情况，结束子时间是包括该小时的数据。<br>-->
    <!--<b>报表功能：</b>查询某个时间区间的日汇总，每行代表每日。 <br>-->
    <!--<b>使用方法：</b>选择必选时间区间即可满足大部分查询，特殊情况需要查某小时区间，选择可选时间即可。<br>-->
    <!--<b>使用案例：</b>查询2019年1月的4点到7点的销售情况。选择时间：(2019-01-01 到 2019-01-30 ) 和 (4:00 到 6:59)-->
    <!--</span>-->
    <!--</div>-->

    <!--下拉文档栏 2019-7-15-->
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item name="1">
        <span class="collapse-title" slot="title">
          <b>报表说明书</b>（点击查看报表使用说明）
        </span>
        <!--<b>注意事项：</b>可选的时间是为了满足查询早餐或者某个点的销售情况，结束子时间是包括该小时的数据。<br>-->
        <!-- <b>报表功能：</b>查询某个时间区间的日汇总，每行代表每日。
        <br />
        <b>使用方法：</b>选择必选时间区间即可满足大部分查询，特殊情况需要查某小时区间，选择可选时间即可。
        <br />
        <b>使用案例：</b>查询2019年1月的4点到7点的销售情况。选择时间：(2019-01-01 到 2019-01-30 ) 和 (4:00 到 6:59)-->
      </el-collapse-item>
    </el-collapse>

    <div id="tableid">
      <el-table :data="tableData" border style="width: 100%" :height="tableHeight">
        <el-table-column prop="shop_name" label="门店名称"></el-table-column>
        <el-table-column prop="date" label="时间"></el-table-column>
        <el-table-column prop="ta" label="客单价"></el-table-column>
        <el-table-column prop="total_amount" label="销量"></el-table-column>
        <el-table-column prop="total_pay" label="销售额"></el-table-column>
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
      tableData: [],
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
      dateRangeValue: "",
      value2: "",
      value3: "",
      shopSelected: "",
      IdCode: "",
      tableHeight: window.innerHeight - 200,
      pickerOptions: {}
    };
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
            _self.options = response.data.data.list;
            // var shopArr = getShopListData.data.list;
            // _self.setShopCityOption(shopArr);
            // _self.tableData = shopArr;
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    // 选择完城市之后，查询数据库
    shopSelected: function(val) {}
  },
  methods: {
    exportExcel() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../vendor/Export2Excel");
        // const tHeader = ['品类名称','菜品名称', '销量','单价','总价'];
        const tHeader = ["门店名称", "时间", "客单价", "销量", "销售额"];
        // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "shop_name",
          "date",
          "ta",
          "total_amount",
          "total_pay"
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
          "易石历史数据时汇总";
        export_json_to_excel(tHeader, data, excelFlieName);
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    // // 统计表格数据
    // getStatisticsNum: function(tableData) {
    //   var length = tableData.length;
    //   var ta = 0;
    //   var sales = 0;
    //   var tc = 0;
    //   var result = {};
    //   for (var i = 0; i < length; i++) {
    //     var currentObj = tableData[i];
    //     ta = ta + currentObj.ta;
    //     sales = sales + currentObj.sales;
    //     tc = tc + currentObj.tc;
    //   }
    //   result["shop_name"] = "合计";
    //   result["productionName"] = "";
    //   result["ta"] = (ta / length).toFixed(2);
    //   result["tc"] = tc.toFixed(2);
    //   result["sales"] = sales.toFixed(2);
    //   return result;
    // },

    searchs() {
      let _self = this;
      let formData1 = new FormData();
      formData1.append("shop_code", _self.shopcode);
      formData1.append("startTime", _self.dateRangeValue[0]);
      formData1.append("endTime", _self.dateRangeValue[1]);
      //   formData1.append("discountType", this.value_way);

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
        .post(_self.ApiUrlData + "/bi/HistCateringH", formData1, {
          // 单独配置
          withCredentials: false
        })
        .then(response => {
          console.log(response);
          if (response.data.errcode == "0") {
            let list = [];
            let data = response.data.data.list;
            for (let i = 0; i < data.length; i++) {
              let item = {};
              item.shop_name = data[i].shop_name;
              item.total_amount = data[i].total_amount;
              item.total_pay = data[i].total_pay;
              item.date = data[i].date;
              item.ta = data[i].ta;
              list.push(item);
            }
            _self.tableData = list;
          } else {
            _self.$message.error("数据找不到啦，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    }
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
  },
  throughShopIdGetShopsList() {
    let _self = this;
    let formData2 = new FormData();
    formData2.append("id ", _self.IdCode);
    formData2.append("city ", _self.cityusername);
    _self.axios
      .post(_self.ApiUrl + "/commodity/throughShopIdGetShopsList", formData2)
      .then(response => {
        if (response.data.errcode == "0") {
          _self.codes = response.data.data.data.shopCode;
        }
      })
      .catch(function(error) {
        _self.$message.error("响应时间过长，请重试");
      });
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
