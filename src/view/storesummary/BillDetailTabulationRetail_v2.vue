<template>
  <div class="app-contion">
    <div class="table-box">
      <el-date-picker
        v-model="value1"
        type="datetimerange"
        range-separator="至"
        value-format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="width: 40%;"
        :picker-options="{'disabledDate': (time)=>{
				 return time.getTime() < new Date('2019-09-01  00:00:00');
			 }}"
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

    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item name="1">
        <span class="collapse-title" slot="title">
          <b>报表说明书</b>（点击查看报表使用说明）
        </span>
        <b>注意事项：</b>理论销售金额：订单折扣映射进商品销售额里的金额
        <br />理论单品销售金额：单品改价得到的单品销售金额
        <br />
        <b>报表功能：</b>查询某个时间内的销售明细数据，内容为订单明细，能查到什么时间卖了什么，卖了多少个。
        <br />
        <b>使用方法：</b>选择必选时间区间即可满足大部分查询，特殊情况需要查某小时区间，选择可选时间即可。
        <br />
        <b>使用案例：</b>查询2019年1月1日到1月7日，4点到7点的账单明细。选择时间：(2019-01-01 到 2019-01-07 ) 和 (4:00 到 6:59)
      </el-collapse-item>
    </el-collapse>

    <div id="tableid">
      <el-table :data="tableData" border style="width: 100%" :height="tableHeight">
        <el-table-column prop="productionName" label="产品名称"></el-table-column>
        <el-table-column prop="bar_code" label="条形码"></el-table-column>
        <el-table-column prop="provider_name" label="供应商"></el-table-column>
        <el-table-column prop="totalBillAmount" label="销售数量"></el-table-column>
        <el-table-column prop="price" label="销售单价"></el-table-column>
        <el-table-column prop="cost" label="成本单价"></el-table-column>
        <el-table-column prop="costtotal" label="成本总价"></el-table-column>
        <el-table-column prop="discount" label="订单折扣额"></el-table-column>
        <el-table-column prop="totalBillPayment" label="订单金额"></el-table-column>
        <el-table-column prop="totalBillActualAmount" label="销售金额"></el-table-column>
        <el-table-column prop="totalBillActualAmount2" label="理论销售金额"></el-table-column>
        <el-table-column prop="orderCode" label="订单编号"></el-table-column>
        <el-table-column prop="order_date" label="日期"></el-table-column>
      </el-table>
    </div>
    <div style="position: fixed;bottom: 10px;right: 0;">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pagesize"
        :total="total"
        @current-change="current_change"
      ></el-pagination>
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
      shopcode: state => state.userinfo.shopcode
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
      value1: "",
      value_way: "",
      value2: "",
      value3: "",
      options: [],
      shopSelected: "",
      tableHeight: window.innerHeight - 260,
      total: 1,
      pagesize: 10,
      currentPage: 1,
      getall: 0,
      pages: 0,
      alldata: [],
      loading: true
    };
  },
  watch: {
    // 监听选择的城市
    value_way: function(val) {
      this.getdata(val);
    },
    // 选择完城市之后，查询数据库
    shopSelected: function(val) {},
    getall: async function() {
      let _self = this;
      this.loading = true;
      _self.alldata = [];
      for (let i = 0; i < _self.total / 100; i++) {
        let formData1 = new FormData();
        formData1.append("pageNum", i + 1);
        formData1.append("pageSize", 100);
        formData1.append("shopCode", _self.shopSelected);
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

          formData1.append("startTime", _self.value1[0]);
          formData1.append("endTime", _self.value1[1]);
          formData1.append("startInTime", startInTime_val);
          formData1.append("endInTime", endInTime_val);
        } else {
          formData1.append("startTime", _self.value1[0]);
          formData1.append("endTime", _self.value1[1]);
        }

        await _self.axios
          .post(_self.ApiUrl + "/home/retailBillingDetailsTable", formData1)
          .then(response => {
            if (response.data.errcode == "0") {
              let tlist = [];
              tlist = response.data.data.data.list;
              let addlist = _self.alldata;
              _self.alldata = addlist.concat(tlist);
            } else {
              _self.$message.error("数据找不到啦，请刷新重试");
            }
          })
          .catch(function(error) {
            _self.$message.error("响应时间过长，请重试");
          });
      }
      this.loading = false;
    }
  },
  methods: {
    current_change: function(currentPage) {
      this.currentPage = currentPage;
      this.searchs();
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

    // 导出表格
    exportExcel() {
      if (this.loading) {
        return this.$message.warning("数据响应中，请稍等");
      }
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../vendor/Export2Excel");
        const tHeader = [
          "订单编号",
          "产品名称",
          "条形码",
          '供应商',
          "销售数量",
          '销售单价',
          "成本单价",
          "成本总价",
          "订单折扣额",
          "订单金额",
          "销售金额",
          "理论销售金额",
          "日期",
        ];
        // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "orderCode",
          "productionName",
          "bar_code",
          'provider_name',
          'totalBillAmount',
          "price",
          "cost",
          "costtotal",
          "discount",
          "totalBillPayment",
          "totalBillActualAmount",
          "totalBillActualAmount2",
          "order_date",
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        let countObj = this.getStatisticsNum(this.alldata);
        const list = this.alldata; //把data里的tableData存到list
        list.push(countObj);
        const data = this.formatJson(filterVal, list);
        var dayTemp = new Date();
        dayTemp.setTime(dayTemp.getTime());
        var excelFlieName =
          dayTemp.getFullYear() +
          "-" +
          (dayTemp.getMonth() + 1) +
          "-" +
          dayTemp.getDate() +
          "销售账单明细表";
        export_json_to_excel(tHeader, data, excelFlieName);
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    // 统计表格数据
    getStatisticsNum: function(tableData) {
      var length = tableData.length;
      var totalBillActualAmount = 0;
      var totalBillActualAmount2 = 0;
      var totalBillPayment = 0;
      var discount = 0;
      var price = 0;
      var totalBillAmount = 0;
      var result = {};
      for (var i = 0; i < length; i++) {
        var currentObj = tableData[i];
        totalBillActualAmount =
          totalBillActualAmount + currentObj.totalBillActualAmount;
        totalBillPayment = totalBillPayment + currentObj.totalBillPayment;
        discount = discount + currentObj.discount;
        price = price + currentObj.price;
        totalBillAmount = totalBillAmount + currentObj.totalBillAmount;
        totalBillActualAmount2 =
          totalBillActualAmount2 + currentObj.totalBillActualAmount2;
      }
      result["orderCode"] = "合计";
      result["productionName"] = "";
      result["totalBillActualAmount"] = totalBillActualAmount.toFixed(2);
      result["discount"] = discount.toFixed(2);
      result["totalBillPayment"] = totalBillPayment.toFixed(2);
      result["price"] = price.toFixed(2);
      result["totalBillAmount"] = totalBillAmount.toFixed(2);
      result["totalBillActualAmount2"] = totalBillActualAmount2.toFixed(2);
      return result;
    },

    searchs() {
      let _self = this;
      let formData1 = new FormData();
      formData1.append("pageNum", _self.currentPage);
      formData1.append("pageSize", _self.pagesize);
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
        formData1.append("shopCode", _self.shopSelected);
        formData1.append("startTime", _self.value1[0]);
        formData1.append("endTime", _self.value1[1]);
        formData1.append("startInTime", startInTime_val);
        formData1.append("endInTime", endInTime_val);
      } else {
        formData1.append("shopCode", _self.shopSelected);
        formData1.append("startTime", _self.value1[0]);
        formData1.append("endTime", _self.value1[1]);
      }
      let timeFlag = !_self._self.value1[0] || !_self.value1[1];

      if (timeFlag) {
        return _self.$message.warning("请选择正确的时间");
      }
      if (!_self.shopSelected) {
        return _self.$message.warning("请选择店铺");
      }
      _self.axios
        .post(_self.ApiUrl + "/home/retailBillingDetailsTable", formData1)
        .then(response => {
          if (response.data.errcode == "0") {
            // var serverDataArr = response.data.data.data;
            // var countObj = this.getStatisticsNum(serverDataArr);
            // serverDataArr.push(countObj);
            _self.tableData = response.data.data.data.list;
            _self.total = response.data.data.data.total;
            _self.pages = response.data.data.data.pages;
            _self.getall = _self.getall + 1;
          } else {
            _self.$message.error("数据找不到啦，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    }
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
.collapse-title {
  flex: 1 0 90%;
  order: 1;
}
.el-collapse-item__header {
  flex: 1 0 auto;
  order: -1;
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
