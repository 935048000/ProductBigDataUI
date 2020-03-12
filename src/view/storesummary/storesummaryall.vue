<template>
  <div class="app-contion">
    <div class="table-box">
      <div style="width: 80%;">
        <!--<el-input v-model="IdCode" placeholder="请输入店铺编码" style="width: 15%;"></el-input>-->
        <el-date-picker
          :picker-options="pickerOptions"
          v-model="value1"
          unlink-panels
          type="datetimerange"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 40%;"
        ></el-date-picker>
        <!--<el-select v-model="value" placeholder="请选择商铺" @change="founcs2" value-key="index"style='width: 20%;'>-->
        <!--<el-option v-for="(item,index) in options" :key="index" :label="item.label" :value="index">-->
        <!--</el-option>-->
        <!--</el-select>-->
        <el-button type="primary" @click="serch" style="width: 73px;">查询</el-button>
      </div>
      <el-button type="success" class="daochu" @click="exportExcel">导出</el-button>
    </div>
    <div style="margin-bottom: 5px;">
      <p style="color: #E6A23C">温馨提示：当店铺编码和商铺名称同时存在时以店铺编码为准</p>
    </div>
    <div id="tableid">
      <el-table :data="tableData" border style="width: 100%" :height="tableHeight">
        <el-table-column label="日期">
          <template slot-scope="scope">
            <span @click="time(scope.$index, scope.row)">{{ scope.row.create_at }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="xjtotal" label="日期"></el-table-column>
        <el-table-column prop="xjcount" label="门店名称"></el-table-column>
        <el-table-column prop="yltotal" label="支付单数"></el-table-column>
        <el-table-column prop="ylcount" label="支付金额"></el-table-column>
        <el-table-column prop="zfbtotal" label="支付方式"></el-table-column>
      </el-table>
    </div>
    <div class="footerdeom">
      <el-pagination
        background
        layout="prev, pager, next"
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
      shopcode: state => state.userinfo.shopcode,
      cityusername: state => state.userinfo.userName
    })
  },
  data() {
    return {
      pagesize: 100,
      currentPage: 1,
      total: 1,
      value1: "",
      options: [],
      codes: "",
      value: "",
      tableData: [],
      IdCode: "",
      tableHeight: window.innerHeight - 195,
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.value1 = minDate.getTime();
          if (maxDate) {
            this.value1 = "";
          }
        },
        disabledDate: time => {
          //   if (this.value1 !== "") {
          //     const one = 30 * 24 * 3600 * 1000;
          //     const minTime = this.value1 - one;
          //     const maxTime = this.value1 + one;
          //     return time.getTime() < minTime || time.getTime() > maxTime;
          //   }
          return time.getTime() < new Date("2019-09-01  00:00:00");
        }
      }
    };
  },
  watch: {
    value: function(val) {
      console.log(val);
    }
  },
  methods: {
    current_change: function(currentPage) {
      let _self = this;
      console.log(currentPage);
      _self.currentPage = currentPage;
    },

    exportExcel() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../vendor/Export2Excel");
        const tHeader = [
          "日期",
          "门店名称",
          "支付单数",
          "支付金额",
          "支付方式"
        ];
        // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "create_at",
          "xjtotal",
          "yltotal",
          "zfbtotal",
          "wxtotal",
          "otherTotal",
          "totalActualPayment",
          "user_id"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        const list = this.tableData; //把data里的tableData存到list
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "店铺汇总");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },

    //搜索数据
    serch() {
      let _self = this;
      var startTime = _self.value1[0];
      var endTime = _self.value1[1];
      var regu = "^[0-9]*$";
      var re = new RegExp(regu);

      let formData = new FormData();
      formData.append("startTime ", startTime);
      formData.append("endTime", endTime);
      _self.axios
        .post(_self.ApiUrl + "/", formData)
        .then(response => {
          if (response.data.errcode == "0") {
            _self.tableData = response.data.data.list.list;
            _self.IdCode = "";
            _self.value1 = "";

            //_self.total = response.data.data.list.total;
          } else {
            _self.$message.error("菜单加载失败");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    //跳转至详情页
    time(index) {
      let _self = this;
      console.log(index);
      console.log(_self.value);
      if (_self.codes == "") {
        var codedetail = _self.options[_self.value].shopCode;
      } else {
        var codedetail = _self.codes;
      }

      _self.$router.push({
        path: "/storedetail",
        query: {
          create_at: _self.tableData[index].create_at,
          shopCode: codedetail
        }
      });
    }
  },
  created: function() {
    let _self = this;
    _self.getdata();
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
@media screen and (max-width: 1162px) {
  .medatwidth {
    width: 95%;
  }

  .adds {
    height: 22px;
    width: 22px;
  }
}
</style>
