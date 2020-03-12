<template>
  <div class="app-contion">
    <div class="table-box">
      <!--<div style="width: 90%;">-->
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
        style="width:30%;"
      ></el-date-picker>

      <el-select v-model="value_way" placeholder="选择支付来源" value-key="index" style="width: 10%;">
        <el-option
          v-for="item in options_1"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select v-model="value_way2" placeholder="选择城市" value-key="index" style="width: 10%;">
        <el-option
          v-for="item in options_2"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select
        v-model="shopSelected"
        placeholder="请选择商铺"
        @change="shopchange"
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

    <div id="tableid">
      <el-table :data="tableData" border style="width: 100%" :height="tableHeight">
        <el-table-column prop="orderCode" label="系统订单号"></el-table-column>
        <el-table-column prop="pay_code" label="支付流水号"></el-table-column>
        <el-table-column prop="totalBillPayment" label="系统订单金额"></el-table-column>
        <el-table-column prop="totalBillActualAmount" :label='value_way+"收款金额"'></el-table-column>
        <el-table-column prop="return_code" label="是否匹配"></el-table-column>
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
      options_1: [
        {
          value: "微信",
          label: "微信"
        },
        {
          value: "支付宝",
          label: "支付宝"
        }
      ],
      value1: "",
      value_way: "",
      value_way2: "",
      value2: "",
      value3: "",
      options: [],
      shopSelected: "",
      shopSelectedcode: "",
      tableHeight: window.innerHeight - 160,
      total: 1,
      pagesize: 10,
      currentPage: 1,
      getall: 0,
      pages: 0,
      alldata: [],
      options_2: [
        {
          value: "三亚市",
          label: "三亚市"
        },
        {
          value: "海口市",
          label: "海口市"
        }
      ]
    };
  },
  watch: {
    // 监听选择的城市
    value_way2: function(val) {
      this.getdata(val);
    }
  },
  methods: {
    shopchange(vid) {
      let _self = this;
      _self.shopSelectedcode = vid;
    },
    searchs() {
      let _self = this;
      if (
        _self.value1 == "" ||
        _self.value_way == "" ||
        _self.value_way2 == "" ||
        _self.shopSelected == ""
      ) {
        _self.$notify({
          title: "警告",
          message: "您选择的信息不完整",
          type: "warning"
        });
        return false;
      }
      let formData2 = new FormData();
      formData2.append("source ", _self.value_way);
      formData2.append("shopCode", _self.shopSelectedcode);
      if (_self.value1[0] == undefined) {
        formData2.append("startTime", "");
      } else {
        formData2.append("startTime", _self.value1[0]);
      }
      if (_self.value1[1] == undefined) {
        formData2.append("endTime", "");
      } else {
        formData2.append("endTime", _self.value1[1]);
      }
      _self.axios
        .post(_self.ApiUrl + "/home/ShowPayBill", formData2)
        .then(response => {
          if (response.data.errcode == "0") {
            _self.tableData = response.data.data.list;
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
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
    founcsvalueway(vid) {
      let _self = this;
      console.log(vid);
      _self.value_way = vid;
    },
    // 导出表格
    exportExcel() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../vendor/Export2Excel");
        const tHeader = [
          "系统订单号",
          "支付流水号",
          "系统订单金额",
          this.value_way + "收款金额",
          "是否匹配"
        ];
        // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "orderCode",
          "pay_code",
          "totalBillPayment",
          "totalBillActualAmount",
          "return_code"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        const list = this.tableData; //把data里的tableData存到list
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "微信支付宝对账明细");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
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
