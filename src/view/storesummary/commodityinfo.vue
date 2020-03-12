<!--DataReportMonth-->
<template>
  <div class="app-contion">
    <div class="table-box" style="height: 40px;">
      <div class="ChooseStyles">
        <label class="titles">一级品类：</label>
        <el-select v-model="shopteam1" placeholder="请选择" filterable @change="founcs($event)">
          <el-option
            v-for="item in options"
            :key="item.level03_category_code"
            :label="item.level03_category_name"
            :value="item"
          ></el-option>
        </el-select>
      </div>
      <div class="ChooseStyles">
        <label class="titles">二级品类：</label>
        <el-select v-model="shopteam22" placeholder="请选择" filterable @change="founcs2($event)">
          <el-option
            v-for="item in options4"
            :key="item.level02_category_code"
            :label="item.level02_category_name"
            :value="item"
          ></el-option>
        </el-select>
      </div>
      <div class="ChooseStyles">
        <label class="titles">三级品类：</label>
        <el-select v-model="shoplei3" placeholder="请选择" filterable>
          <el-option
            v-for="item in options3"
            :key="item.level01_category_code"
            :label="item.level01_category_name"
            :value="item.level01_category_name"
          ></el-option>
        </el-select>
      </div>

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
        <el-table-column prop="bar_code" label="商品条码"></el-table-column>
        <el-table-column prop="productionName" label="商品名称"></el-table-column>
        <el-table-column prop="price" label="商品售价"></el-table-column>
        <el-table-column prop="cost" label="商品成本"></el-table-column>
        <el-table-column prop="specification" label="商品规格"></el-table-column>
        <el-table-column prop="provider_name" label="商品供应商"></el-table-column>
        <el-table-column prop="unit" label="商品单位"></el-table-column>
        <el-table-column prop="create_at" label="商品创建时间"></el-table-column>
        <el-table-column prop="update_at" label="商品修改时间"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getLodop, needCLodop } from "../../vuex/LodopFuncs.js";
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
      tableHeight: window.innerHeight - 200,
      tableData: [],
      shopteam1: "",
      shopteam22: "",
      shoplei3: "",
      options: [],
      options2: [],
      options3: [],
      options4: []
    };
  },
  watch: {},
  methods: {
    exportExcel() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../vendor/Export2Excel");
        // const tHeader = ['品类名称','菜品名称', '销量','单价','总价'];
        const tHeader = [
          "商品条码",
          "商品名称",
          "商品售价",
          "商品成本",
          "商品规格",
          "商品供应商",
          "商品单位",
          "商品创建时间",
          "商品修改时间"
        ];
        // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "bar_code",
          "productionName",
          "price",
          "cost",
          "specification",
          "provider_name",
          "unit",
          "create_at",
          "update_at"
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
          "商品导出报表";
        export_json_to_excel(tHeader, data, excelFlieName);
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    getfirst() {
      let _self = this;
      let formData3 = new FormData();
      _self.axios
        .post(
          _self.ApiurlStorehouse + "/inventory/queryLevel01CategoryCode",
          formData3,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if ((response.data.errcode = "0")) {
            _self.options = response.data.data.list;
          } else {
            _self.$message.error("数据找不到啦");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    founcs(vId, $event) {
      let _self = this;
      _self.shopteam = vId.level03_category_name;
      _self.shopteam1 = vId.level03_category_name;
      _self.shopteam2 = "";
      _self.shoplei = "";
      let formDatamb = new FormData();
      formDatamb.append("level03CategoryCode", vId.level03_category_code);
      //发送请求
      _self.axios
        .post(
          _self.ApiurlStorehouse + "/inventory/queryLevel02CategoryCode",
          formDatamb,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if ((response.data.errcode = "0")) {
            _self.options4 = response.data.data.list;
          } else {
            _self.$message.error("数据找不到啦");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    founcs2(val, $event) {
      let _self = this;
      _self.shopteam22 = val.level02_category_name;
      let formData = new FormData();
      formData.append("level02CategoryCode", val.level02_category_code);
      //发送请求
      _self.axios
        .post(
          _self.ApiurlStorehouse + "/inventory/queryLevel03CategoryCode",
          formData,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if ((response.data.errcode = "0")) {
            _self.options3 = response.data.data.list;
          } else {
            _self.$message.error("数据找不到啦");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    searchs() {
      let _self = this;
      let formData1 = new FormData();
      formData1.append("level03Name", _self.shopteam1);
      formData1.append("level02Name", _self.shopteam22);
      formData1.append("level01Name", _self.shoplei3);
      _self.axios
        .post(_self.ApiUrl + "/home/getProductionList", formData1)
        .then(response => {
          if (response.data.errcode == "0") {
            let list = [];
            let data = response.data.data.data;
            for (let i = 0; i < data.length; i++) {
              let item = {};
              item.bar_code = data[i].bar_code;
              item.productionName = data[i].productionName;
              item.price = data[i].price;
              item.cost = data[i].cost;
              item.provider_name = data[i].provider_name;
              item.unit = data[i].unit;
              item.create_at = data[i].create_at;
              item.update_at = data[i].update_at;
              item.specification = data[i].specification;
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
  created() {
    this.getfirst();
  },
  mounted() {}
};
</script>

<style>
.app-contion {
  margin: 10px;
}
.ChooseStyles {
  margin: 1px 49px;
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
  display: flex;
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

