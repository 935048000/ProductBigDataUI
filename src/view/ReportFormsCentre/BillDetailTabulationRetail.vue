<template>
  <div class="app-contion">
    <div class="table-box" style="height: 40px;">
      <div style="width: 90%;">
        <el-date-picker
          :picker-options="{'disabledDate': (time)=>{
				 return time.getTime() < new Date('2019-09-01  00:00:00');
			 }}"
          v-model="value1"
          type="datetimerange"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 40%;"
        ></el-date-picker>
        <!--<el-time-select v-model="value2" :picker-options="{-->
        <!--start: '00:00',-->
        <!--step: '01:00',-->
        <!--end: '23:00'-->
        <!--}"-->
        <!--placeholder="可选开始子时间(小时)" style='width: 20%;'>-->
        <!--</el-time-select>-->
        <!--<el-time-select v-model="value3" :picker-options="{-->
        <!--start: '00:59',-->
        <!--step: '01:00',-->
        <!--end: '23:59'-->
        <!--}"-->
        <!--placeholder="可选结束子时间(小时)" style='width: 20%;'>-->
        <!--</el-time-select>-->
        <el-button type="primary" @click="searchs">查询</el-button>
      </div>
      <el-button type="success" class="daochu" @click="exportExcel">导出</el-button>
    </div>
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item name="1">
        <span class="collapse-title" slot="title">
          <b>报表说明书</b>（点击查看报表使用说明）
        </span>
        <!--<b>注意事项：</b>可选的时间是为了满足查询早餐或者某个点的销售情况，结束子时间是包括该小时的数据。 <br>-->
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
        <el-table-column prop="bar_code" label="产品条形码"></el-table-column>
        <el-table-column prop="provider_name" label="供应商"></el-table-column>
        <!--<el-table-column prop="categoryName" label="品类名称">-->
        <!--</el-table-column>-->
        <el-table-column prop="totalBillAmount" label="产品销售数量"></el-table-column>
        <el-table-column prop="price" label="产品单价"></el-table-column>
        <el-table-column prop="discount" label="订单折扣额"></el-table-column>
        <el-table-column prop="totalBillPayment" label="订单金额"></el-table-column>
        <el-table-column prop="totalBillActualAmount" label="理论销售金额"></el-table-column>
        <el-table-column prop="totalBillActualAmount2" label="理论单品销售金额"></el-table-column>
        <el-table-column prop="orderCode" label="订单编号"></el-table-column>
        <el-table-column prop="order_date" label="销售时间"></el-table-column>
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
      shopcode: state => state.userinfo.shopcode
    })
  },
  data() {
    return {
      tableData: [],
      value1: "",
      value2: "",
      value3: "",
      tableHeight: window.innerHeight - 195
    };
  },

  methods: {
    // 导出表格
    exportExcel() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../vendor/Export2Excel");
        const tHeader = [
          "产品名称",
          "产品条形码",
          "供应商",
          "产品销售数量",
          "产品单价",
          "订单折扣额",
          "订单金额",
          "理论销售金额",
          "理论单品销售金额",
          "订单编号",
          "销售时间"
        ];
        // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "productionName",
          "bar_code",
          "provider_name",
          "totalBillAmount",
          "price",
          "discount",
          "totalBillPayment",
          "totalBillActualAmount",
          "totalBillActualAmount2",
          "orderCode",
          "order_date"
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
          "零售销售账单明细表";
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
      result["productionName"] = "合计";
      // result['productionName']='';
      result["totalBillActualAmount"] = totalBillActualAmount;
      result["discount"] = discount;
      result["totalBillPayment"] = totalBillPayment;
      result["price"] = price;
      result["totalBillAmount"] = totalBillAmount;
      result["totalBillActualAmount2"] = totalBillActualAmount2;
      return result;
    },

    searchs() {
      let _self = this;
      console.log(_self.value1);
      let formData1 = new FormData();

      // 时间填充,判断子时间是否为空，子时间为空就不传只时间值。
      // if (_self.value2.length !== 0 && _self.value3.length !== 0) {
      // 	var dayTemp = new Date();
      // 	dayTemp.setTime(dayTemp.getTime());
      // 	var startInTime_val = dayTemp.getFullYear() + "-" + (dayTemp.getMonth() + 1) + "-" + dayTemp.getDate() + ' ' +
      // 		_self.value2 + ':00';
      // 	var endInTime_val = dayTemp.getFullYear() + "-" + (dayTemp.getMonth() + 1) + "-" + dayTemp.getDate() + ' ' + _self
      // 		.value3 + ':00';
      formData1.append("shopCode", _self.shopcode);
      formData1.append("startTime", _self.value1[0]);
      formData1.append("endTime", _self.value1[1]);
      // 	formData1.append('startInTime', startInTime_val);
      // 	formData1.append('endInTime', endInTime_val);
      // } else {
      // 	formData1.append('shopCode', _self.shopcode);
      // 	formData1.append('startTime', _self.value1[0]);
      // 	formData1.append('endTime', _self.value1[1]);
      // }

      _self.axios
        .post(_self.ApiUrl + "/home/billingDetailsTable", formData1)
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
</style>
