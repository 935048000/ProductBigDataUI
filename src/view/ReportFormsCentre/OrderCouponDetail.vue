<template>
  <div class="app-contion">
    <div class="table-box" style="height: 40px;">
      <el-date-picker
        v-model="value1"
        type="datetimerange"
        range-separator="至"
        value-format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
          :picker-options="{'disabledDate': (time)=>{
				 return time.getTime() < new Date('2019-09-01  00:00:00');
			 }}"
      ></el-date-picker>

      <el-select
        v-model="value_way"
        placeholder="优惠方式"
        @change="founcs2"
        value-key="index"
        style="width: 20%;"
      >
        <el-option
          v-for="(item) in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>

      <el-button type="primary" @click="searchs">查询</el-button>
      <el-button type="success" class="daochu" @click="exportExcel">导出</el-button>
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
    <div id="tableid">
      <el-table :data="tableData" border style="width: 100%" :height="tableHeight">
        <el-table-column prop="order_code" label="订单号"></el-table-column>
        <!-- <el-table-column prop="value" label="折扣数/改价类型/优惠码"></el-table-column> -->
        <el-table-column prop="value" :label="valueWayLabel"></el-table-column>

        <el-table-column prop="sales" label="操作员"></el-table-column>
        <!-- isShowTotalPayment 关闭不显示 -->
        <div>
          <el-table-column prop="totalPayment" label="优惠额"></el-table-column>
        </div>
        <!-- isShowTotalPayment 关闭不显示 -->
        <div v-if="isShowTotalPayment">
          <el-table-column prop="source" label="优惠券来源"></el-table-column>
        </div>
        <el-table-column prop="order_date" label="订单时间"></el-table-column>
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
      value_way: "discount",
      valueWayLabel: "折扣",
      isShowTotalPayment: false, //默认关闭 isShowTotalPayment
      test: "",
      tableHeight: window.innerHeight - 200,
      options: [
        {
          value: "discount",
          label: "折扣"
        },
        {
          value: "maling",
          label: "抹零"
        },
        {
          value: "vouchers",
          label: "优惠券"
        }
      ]
    };
  },
  // 判断优惠页面是否存在
  watch: {
    value_way: function(newValue) {
      if (newValue === "discount") {
        this.valueWayLabel = "折扣";
        this.isShowTotalPayment = false;
      } else if (newValue === "maling") {
        this.valueWayLabel = "抹零";
        this.isShowTotalPayment = false;
      } else if (newValue === "vouchers") {
        this.valueWayLabel = "优惠券";
        this.isShowTotalPayment = true;
      }
    }
  },
  methods: {
    exportExcel() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../vendor/Export2Excel");
        const tHeader = [
          "订单号",
          "折扣数/改价类型/优惠码",
          "操作员",
          "优惠额",
          "优惠券来源",
          "订单时间"
        ];
        // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "order_code",
          "value",
          "sales",
          "totalPayment",
          "source",
          "order_date"
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
          "订单优惠信息查询";
        export_json_to_excel(tHeader, data, excelFlieName);
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    //列表
    todaypinlei() {
      let _self = this;
      var day2 = new Date();
      day2.setTime(day2.getTime());
      var s2 =
        day2.getFullYear() +
        "-" +
        (day2.getMonth() + 1) +
        "-" +
        day2.getDate() +
        " " +
        "00:00:00";

      var day1 = new Date();
      day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
      var s1 =
        day1.getFullYear() +
        "-" +
        (day1.getMonth() + 1) +
        "-" +
        day1.getDate() +
        " " +
        "00:00:00";

      var day3 = new Date();
      day3.setTime(day3.getTime() + 24 * 60 * 60 * 1000);
      var s3 =
        day3.getFullYear() +
        "-" +
        (day3.getMonth() + 1) +
        "-" +
        day3.getDate() +
        " " +
        "00:00:00";
      let formData1 = new FormData();
      formData1.append("shopCode", _self.shopcode);
      formData1.append("startTime", s2);
      formData1.append("endTime", s3);

      _self.axios
        .post(_self.ApiUrl + "/home/queryCouponDetails", formData1)
        .then(response => {
          if (response.data.errcode == "0") {
            _self.tableData = response.data.data.data;
          } else {
            _self.$message.error("数据找不到啦，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    searchs() {
      let _self = this;
      console.log(this.value_way);
      let formData1 = new FormData();
      formData1.append("shopCode", _self.shopcode);
      formData1.append("startTime", _self.value1[0]);
      formData1.append("endTime", _self.value1[1]);
      formData1.append("discountType", this.value_way);
      _self.axios
        .post(_self.ApiUrl + "/home/queryCouponDetails", formData1)
        .then(response => {
          if (response.data.errcode == "0") {
            _self.tableData = response.data.data.data;
          } else {
            _self.$message.error("数据找不到啦，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    }
  },
  created: function() {
    let _self = this;
    _self.todaypinlei();
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
</style>
