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
        v-model="shopSelected"
        placeholder="请选择供应商"
        @change="founcs2"
        value-key="index"
        style="width: 20%;"
      >
        <el-option v-for="(item,index) in options" :key="index" :label="item.provider_name" :value="item.provider_code"></el-option>
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
            <el-table-column prop="provider_name" label="供应商名称">
            </el-table-column>
            <el-table-column prop="shop_name" label="门店">
            </el-table-column>
            <el-table-column prop="order_date" label="销售日期">
            </el-table-column>
            <el-table-column prop="productionName" label="存货名称">
            </el-table-column>
              <el-table-column prop="bar_code" label="存货编码">
              </el-table-column>
              <el-table-column prop="price" label="销售单价">
              </el-table-column>
            <el-table-column prop="tc" label="销售数量">
            </el-table-column>
            <el-table-column prop="cost" label="单价成本">
            </el-table-column>
            <el-table-column prop="totalcost" label="应结算成本">
            </el-table-column>
            </el-table>
		</div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {ProviderInfoList ,providerShopSalesList} from '@/service'
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
    // 选择完城市之后，查询数据库
    shopSelected: function(val) {}
  },
  methods: {
    exportExcel() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../vendor/Export2Excel");
        const tHeader = [
          "供应商名称",
          "门店",
          "销售日期",
          "存货名称",
          "存货编码",
          "销售单价",
          "销售数量",
          "单价成本",
          "应结算成本"
        ];
        // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "provider_name",
          "shop_name",
          "order_date",
          "productionName",
          "bar_code",
          "price",
          "tc",
          "cost",
          "totalcost"
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
      var price = 0;
      var tc = 0;
      var cost = 0;
      var result = {};
      for (var i = 0; i < length; i++) {
        var currentObj = tableData[i];
        ta = ta + currentObj.ta;
        sales = sales + currentObj.sales;
        price = price + currentObj.price;
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
      providerShopSalesList({
        supplier_code: this.shopSelected,
        startTime: this.dateRangeValue[0],
        endTime: this.dateRangeValue[1],
      }).then(response=>{
          if (response.data.errcode == "0") {
            this.tableData = response.data.data.data;
          } else {
            _self.$message.error("数据找不到啦，请刷新重试");
          }
      })
    },
  },
  created: function() {
       ProviderInfoList().then(response=>{
        this.options = response.data.data.data;
      })
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
