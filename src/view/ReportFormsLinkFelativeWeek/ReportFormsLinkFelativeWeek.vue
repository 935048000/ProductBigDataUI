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
      <el-time-select
        v-model="value2"
        :picker-options="{
                          start: '00:00',
                          step: '01:00',
                          end: '23:00'
                          }"
        placeholder="可选开始子时间(小时)"
      ></el-time-select>
      <el-time-select
        v-model="value3"
        :picker-options="{
                          start: '00:59',
                          step: '01:00',
                          end: '23:59'
                          }"
        placeholder="可选结束子时间(小时)"
      ></el-time-select>
      <el-button type="primary" @click="searchs">查询</el-button>
      <el-button type="success" class="daochu" @click="exportExcel">导出</el-button>
    </div>
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item name="1">
        <span class="collapse-title" slot="title">
          <b>报表说明书</b>（点击查看报表使用说明）
        </span>
        <!--<b>注意事项：</b>可选的时间是为了满足查询早餐或者某个点的销售情况，结束子时间是包括该小时的数据。 <br>-->
        <b>报表功能：</b>查询某个周 环比 上个周的环比分析。
        <br />
        <b>使用方法：</b>选择必选时间区间即可满足大部分查询，特殊情况需要查某小时区间，选择可选时间即可。
        <br />
        <b>使用案例：</b>查询2019年1月1日到1月7日(7天)，该周的4点到7点环比上周的环比分析。选择时间：(2019-01-01 到 2019-01-07 ) 和 (4:00 到 6:59)
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
      value2: "",
      value3: "",
      tableHeight: window.innerHeight - 200
    };
  },

  methods: {
    exportExcel() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../vendor/Export2Excel");
        // const tHeader = ['品类名称','菜品名称', '销量','单价','总价'];
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
        // const filterVal = ['categoryName','productionName', 'pcounts','price','totalPayment'];
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
        export_json_to_excel(tHeader, data, "周环比数据");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },

    searchs() {
      let _self = this;
      console.log(_self.value1);
      let formData1 = new FormData();

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
        formData1.append("shopCode", _self.shopcode);
        formData1.append("startTime", _self.value1[0]);
        formData1.append("endTime", _self.value1[1]);
        formData1.append("startInTime", startInTime_val);
        formData1.append("endInTime", endInTime_val);
      } else {
        formData1.append("shopCode", _self.shopcode);
        formData1.append("startTime", _self.value1[0]);
        formData1.append("endTime", _self.value1[1]);
      }

      _self.axios
        .post(_self.ApiUrl + "/home/intervalDataComparisonReportW", formData1)
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
  // ,
  // created: function() {
  // 	let _self = this
  // 	// _self.todaypinlei()
  //
  // }
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
