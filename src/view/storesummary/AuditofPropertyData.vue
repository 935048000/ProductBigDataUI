<template>
  <div class="app-contion">
    <div class="table-box" style="display: flex; flex-wrap:wrap ">
      <!--<div class="ChooseStyles">-->
      <!--<label class="titles">时间：</label>-->
      <!--<el-date-picker v-model="weekvalue" type="week" :editable="false" format="yyyy 第 WW 周" @change='gettime'-->
      <!--placeholder="选择周">-->
      <!--</el-date-picker>-->
      <!--</div>-->
      <div class="block">
        <!--<span class="demonstration">默认</span>-->
        <el-date-picker
          v-model="datevalue"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          :picker-options="{'disabledDate': (time)=>{
				 return time.getTime() < new Date('2019-09-01  00:00:00');
			 }}"
        ></el-date-picker>
      </div>
      <div class="ChooseStyles" style="margin-left: 0.625rem;">
        <el-button type="primary" @click="screen">查找</el-button>
      </div>
    </div>

    <el-table
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      :height="tableHeight"
      border
    >
      <el-table-column prop="shop_name" label="门店"></el-table-column>
      <el-table-column prop="date" label="日期"></el-table-column>
      <el-table-column prop="actual_order_amount" label="真实订单量"></el-table-column>
      <el-table-column prop="show_order_amount" label="暴露订单量"></el-table-column>
      <el-table-column prop="actual_amount" label="实际金额"></el-table-column>
      <el-table-column prop="show_amount" label="暴露金额"></el-table-column>
      <el-table-column prop="show_rule" label="暴露百分比"></el-table-column>
      <el-table-column prop="rule" label="指定过滤规则"></el-table-column>
      <el-table-column prop="state" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.state=== '已审核'" style="color: #67C23A;">{{scope.row.state}}</span>
          <span v-else-if="scope.row.state=== '待审核'" style="color: #a300ff;">{{scope.row.state}}</span>
          <span v-else-if="scope.row.state=== '未审核'" style="color: #F56C6C;">{{scope.row.state}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="170" fixed="right">
        <template slot-scope="scope">
          <div style="display: flex;">
            <el-button
              size="mini"
              @click="surebtn(scope.$index, scope.row)"
              :disabled="scope.row.state=='已审核'||scope.row.state=='未审核'"
            >审核通过</el-button>
            <el-button
              size="mini"
              type="warning"
              @click="resetbtn(scope.$index, scope.row)"
              :disabled="scope.row.state=='已审核'"
            >随机</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div style="position: fixed;bottom: 0.625rem;right: 0;">
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

import { getLodop, needCLodop } from "../../vuex/LodopFuncs.js";
export default {
  data() {
    return {
      tableData: [],
      tableHeight: window.innerHeight - 175,
      weekvalue: "",
      datevalue: "",
      getyear: "",
      getweek: "",
      total: 1,
      currentPage: 1,
      pagesize: 10
    };
  },
  computed: {
    ...mapState({
      username: state => state.userinfo.account,
      token: state => state.userinfo.token,
      id: state => state.userinfo.id,
      shopcode: state => state.userinfo.shopcode
    })
  },
  methods: {
    screen() {
      let _self = this;
      let formData = new FormData();
      console.log(_self.datevalue);
      formData.append("pageNum ", _self.currentPage);
      formData.append("pageSize ", _self.pagesize);
      // formData.append("years ", _self.getyear);
      // formData.append("weeks ", _self.getweek);
      formData.append("date ", _self.datevalue);
      _self.axios
        .post(_self.ApiUrlData + "/bi/showAllShopData", formData, {
          // 单独配置
          withCredentials: false
        })
        .then(response => {
          if (response.data.errcode == "0") {
            _self.tableData = response.data.data.list.list;
            _self.total = response.data.data.list.total;
            for (var i = 0; i < response.data.data.list.list.length; i++) {
              if (response.data.data.list.list[i].state == "1") {
                _self.tableData[i].state = "已审核";
              } else if (response.data.data.list.list[i].state == "2") {
                _self.tableData[i].state = "待审核";
              } else {
                _self.tableData[i].state = "未审核";
              }
            }
          } else {
            _self.$message.error("数据加载失败，请重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    current_change: function(currentPage) {
      let _self = this;

      _self.currentPage = currentPage;
      let formData = new FormData();
      formData.append("pageNum ", _self.currentPage);
      formData.append("pageSize ", _self.pagesize);
      // formData.append("years ", _self.getyear);
      // formData.append("weeks ", _self.getweek);
      formData.append("date ", _self.datevalue);
      _self.axios
        .post(_self.ApiUrlData + "/bi/showAllShopData", formData, {
          // 单独配置
          withCredentials: false
        })
        .then(response => {
          if (response.data.errcode == "0") {
            console.log(response);
            _self.tableData = response.data.data.list.list;
            _self.total = response.data.data.list.total;
            for (var i = 0; i < response.data.data.list.list.length; i++) {
              if (response.data.data.list.list[i].state == "1") {
                _self.tableData[i].state = "已审核";
              } else if (response.data.data.list.list[i].state == "2") {
                _self.tableData[i].state = "待审核";
              } else {
                _self.tableData[i].state = "未审核";
              }
            }
          } else {
            _self.$message.error("数据加载失败，请重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    //确定
    surebtn(index) {
      let _self = this;
      console.log(index);
      _self
        .$confirm("确定通过审核么?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let formData = new FormData();
          //    formData.append("years ", _self.getyear);
          // formData.append("weeks ", _self.getweek);
          formData.append("date ", _self.datevalue);
          formData.append("shopname ", _self.tableData[index].shop_name);
          _self.axios
            .post(_self.ApiUrlData + "/bi/StartAirportDataShow", formData, {
              // 单独配置
              withCredentials: false
            })
            .then(response => {
              if (response.data.errcode == "0") {
                _self.$message({
                  type: "success",
                  message: "审核通过!"
                });
                _self.screen();
              } else {
                _self.$message.error("数据加载失败，请重试");
              }
            })
            .catch(function(error) {
              _self.$message.error("响应时间过长，请重试");
            });
        })
        .catch(() => {
          _self.$message({
            type: "info",
            message: "已取消审核"
          });
        });
    },
    resetbtn(index) {
      //重置
      let _self = this;
      console.log(index);
      let formData = new FormData();
      //   formData.append("years ", _self.getyear);
      // formData.append("weeks ", _self.getweek);
      formData.append("date ", _self.datevalue);
      formData.append("shopname ", _self.tableData[index].shop_name);
      _self.axios
        .post(_self.ApiUrlData + "/bi/makeTempData ", formData, {
          // 单独配置
          withCredentials: false
        })
        .then(response => {
          if (response.data.errcode == "0") {
            _self.$message({
              message: "随机重置成功",
              type: "success"
            });
            _self.screen();
          } else {
            _self.$message.error("数据加载失败，请重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    gettime(dateTime) {
      let _self = this;
      let temptTime = dateTime;
      //周几
      let weekday = temptTime.getDay() || 7;

      //周1+5天=周六
      temptTime.setDate(temptTime.getDate() - weekday + 1 + 5);

      let firstDay = new Date(temptTime.getFullYear(), 0, 1);
      let dayOfWeek = firstDay.getDay();
      let spendDay = 1;
      if (dayOfWeek != 0) {
        spendDay = 7 - dayOfWeek + 1;
      }
      firstDay = new Date(temptTime.getFullYear(), 0, 1 + spendDay);
      let d = Math.ceil((temptTime.valueOf() - firstDay.valueOf()) / 86400000);
      let result = Math.ceil(d / 7);
      _self.getyear = temptTime.getFullYear();
      _self.getweek = result + 1;
      console.log(temptTime.getDate() - 6);
      console.log(temptTime.getFullYear());
      console.log(result + 1);
    }
  },
  created: function() {
    let _self = this;
  }
};
</script>
<style>
.searchBox {
  padding: 0.625rem 0;
  /* border-bottom: 0.0625rem solid rgb(235, 238, 245); */
}

.app-contion {
  margin: 10px;
}

.btn-box {
  text-align: center;
  margin: 10px;
}

.footers {
  position: fixed;
  bottom: 0.625rem;
  left: 210px;
  background: #fff;
  width: 85%;
}

.titles {
  font-size: 14px;
  margin-left: 10px;
}

.addlistsd12 {
  position: fixed;
  right: 15px;
  top: 65px;
}

.w-30 {
  width: 20%;
  display: inline-block;
  text-align: center;
}

.title-box {
  margin: 10px 0;
}

.images {
  width: 60px;
  height: 60px;
}

.images img {
  width: 100%;
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

.ChooseStyles {
  margin: 3px 0;
}
</style>
