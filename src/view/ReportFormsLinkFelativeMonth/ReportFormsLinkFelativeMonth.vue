<template>
  <div class="app-contion">
    <div class="table-box" style="height: 50px;">
      <div class="container">
        <div class="block">
          <el-date-picker
            v-model="value1"
            type="month"
            placeholder="选择年月"
            :picker-options="{'disabledDate': (time)=>{
				 return time.getTime() < new Date('2019-09-01  00:00:00');
			 }}"
          ></el-date-picker>
          <el-button type="primary" @click="searchs">查询</el-button>
        </div>
      </div>

      <!--</div>-->

      <el-button type="success" class="daochu" @click="exportExcel">导出</el-button>
    </div>
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item name="1">
        <span class="collapse-title" slot="title">
          <b>报表说明书</b>（点击查看报表使用说明）
        </span>
        <!--<b>注意事项：</b>可选的时间是为了满足查询早餐或者某个点的销售情况，结束子时间是包括该小时的数据。 <br>-->
        <b>报表功能：</b>查询某个月
        <font face="arial" color="red">
          <b>环比</b>
        </font> 上个月的环比销售情况。
        <br />
        <b>使用方法：</b>选择必选时间区间即可满足大部分查询，特殊情况需要查某小时区间，选择可选时间即可。
        <br />
        <b>使用案例：</b>查询2019年2月环比2019年1月销售情况。选择时间：2019-02
      </el-collapse-item>
    </el-collapse>
    <div id="tableid">
      <el-table :data="tableData" border style="width: 100%" :height="tableHeight">
        <el-table-column prop="sales" label="本月销售额"></el-table-column>
        <el-table-column prop="sales2" label="上月销售额"></el-table-column>
        <el-table-column prop="tc" label="本月销量"></el-table-column>
        <el-table-column prop="tc2" label="上月销量"></el-table-column>
        <el-table-column prop="ta" label="本月客单价"></el-table-column>
        <el-table-column prop="ta2" label="上月客单价"></el-table-column>
        <el-table-column prop="tc_com" label="月销量环比增长率(%)"></el-table-column>
        <el-table-column prop="ta_com" label="月客单价环比增长率(%)"></el-table-column>
        <el-table-column prop="sales_com" label="月销售额环比增长率(%)"></el-table-column>
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
      tableHeight: window.innerHeight - 200
    };
  },

  methods: {
    exportExcel() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../vendor/Export2Excel");
        const tHeader = [
          "本月销售额",
          "上月销售额",
          "本月销量",
          "上月销量",
          "本月客单价",
          "上月客单价",
          "月销量环比增长率(%)",
          "月客单价环比增长率(%)",
          "月销售额环比增长率(%)"
        ];
        // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "sales",
          "sales2",
          "tc",
          "tc2",
          "ta",
          "ta2",
          "tc_com",
          "ta_com",
          "sales_com"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        const list = this.tableData; //把data里的tableData存到list
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "月环比报表");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    searchs() {
      let _self = this;
      console.log(_self.value1);
      let formData1 = new FormData();
      // 格式化时间
      var date;
      date = new Date(_self.value1);
      var dateTime =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      // window.alert(dateTime);

      formData1.append("shopCode", _self.shopcode);
      formData1.append("startTime", dateTime);
      formData1.append("endTime", dateTime);

      _self.axios
        .post(_self.ApiUrl + "/home/intervalDataComparisonReportM", formData1)
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
.collapse-title {
  flex: 1 0 90%;
  order: 1;
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
