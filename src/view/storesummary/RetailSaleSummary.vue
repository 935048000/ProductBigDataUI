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
      <el-select
        v-model="value_way"
        placeholder="选择城市"
        @change="founcs2"
        value-key="index"
        style="width: 10%;"
      >
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
        @change="founcs2"
        value-key="index"
        style="width: 20%;"
      >
        <el-option
          v-for="(item,index) in options"
          :key="index"
          :label="item.shopName"
          :value="item.shopCode"
        ></el-option>
      </el-select>
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
        <b>报表功能：</b>查询某个时间区间的供应商销售报表，每行代表每日。
        <br />
        <b>使用方法：</b>选择必选时间区间即可满足大部分查询，特殊情况需要查某小时区间，选择可选时间即可。
        <br />
        <b>使用案例：</b>查询2019年1月的4点到7点的销售情况。选择时间：(2019-01-01 到 2019-01-30 ) 和 (4:00 到 6:59)
      </el-collapse-item>
    </el-collapse>

    <div id="tableid">
      <el-table :data="tableData" border style="width: 100%" :height="tableHeight">
        <el-table-column prop="shop_name" label="门店名称"></el-table-column>
        <el-table-column prop="saler" label="销售员"></el-table-column>
        <el-table-column prop="level01CatName" label="一级品类"></el-table-column>
        <el-table-column prop="level02CatName" label="一级品类"></el-table-column>
        <el-table-column prop="level03CatName" label="一级品类"></el-table-column>
        <el-table-column prop="bar_code" label="条码"></el-table-column>
        <el-table-column prop="productionName" label="商品名称"></el-table-column>
        <el-table-column prop="amount_pay" label="销量"></el-table-column>
        <el-table-column prop="amount" label="销量额"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getShopList, RetailSaleSummary } from "@/service";
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
      tableHeight: window.innerHeight - 195,
      pickerOptions: {}
    };
  },

  watch: {
    // 监听选择的城市
    value_way: function(val) {
      this.getdata(val);
    },
    // 选择完城市之后，查询数据库
    shopSelected: function(val) {}
  },
  methods: {
    exportExcel() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../vendor/Export2Excel");
        const tHeader = [
          "门店名称",
          "销售员",
          "一级品类",
          "二级品类",
          "三级品类",
          "条码",
          "商品名称",
          "销量",
          "销量额"
        ];
        // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "shop_name",
          "saler",
          "level01CatName",
          "level02CatName",
          "level03CatName",
          "bar_code",
          "productionName",
          "amount",
          "amount_pay",
        ];
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
        cost = cost + currentObj.cost;
      }

      result["order_date"] = "合计";
      result["ta"] = (ta / length).toFixed(2);
      result["tc"] = tc.toFixed(2);
      result["sales"] = sales.toFixed(2);
      result["cost"] = cost.toFixed(2);
      return result;
    },

    //获取商品信息
    searchs() {
      let _self = this;
      if(!this.shopSelected){
        return this.$message.error('请选择店铺')
      }
      RetailSaleSummary({
        shopCode: this.shopSelected,
        startTime: this.dateRangeValue[0],
        endTime: this.dateRangeValue[1]
      }).then(response => {
        if (response.data.errcode == "0") {
          var serverDataArr = response.data.data.data;
          // var countObj = this.getStatisticsNum(serverDataArr);
          // serverDataArr.push(countObj);
          _self.tableData = response.data.data.data;
        } else {
          _self.$message.error("数据找不到啦，请刷新重试");
        }
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
      getShopList({
        city: defaultCityName
      }).then(response => {
        if (response.data.errcode == "0") {
          _self.options = response.data.data.list;
        }
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
</style>
