<template>
  <div class="app-contion">
    <!--startprint-->
    <div class="btns_fun">
      <el-button
        type="primary"
        size="mini"
        @click="batchSubmit"
        :disabled="selectArray.length<=0"
      >批量通过</el-button>
      <el-button type="success" class="daochu" @click="exportExcel">导出</el-button>
    </div>
    <el-table
      :data="tableData"
      border
      :height="tableHeight"
      style="width: 100%"
      id="printTable"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" :selectable="checkboxInit"></el-table-column>
      <el-table-column prop="bar_code" label="商品条码"></el-table-column>
      <el-table-column prop="name" label="商品名称"></el-table-column>
      <el-table-column prop="cost" label="成本价"></el-table-column>
      <!-- <el-table-column prop="type" label="仓单类型">
      </el-table-column>-->
      <el-table-column prop="price" label="零售价"></el-table-column>
      <el-table-column prop="provider_name" label="供应商"></el-table-column>
      <el-table-column prop="state" label="审核状态"></el-table-column>
      <!-- 	<el-table-column prop="operator" label="申请人">
      </el-table-column>-->
      <el-table-column prop="create_at" label="申请时间"></el-table-column>

      <el-table-column label="操作" width="210" fixed="right">
        <template slot-scope="scope">
          <div style="display: flex;">
            <el-button
              size="mini"
              type="success"
              @click="passthrough(scope.$index, scope.row)"
              v-if="scope.row.state=='审核中'"
            >通过</el-button>
            <el-button
              size="mini"
              @click="revise(scope.$index, scope.row)"
              v-if="scope.row.state=='审核中'"
            >修改</el-button>
            <el-button size="mini" @click="detail(scope.$index, scope.row)">详情</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!--endprint-->
    <div style="position: fixed;bottom: 0.625rem;right: 0;z-index:1000">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pagesize"
        @current-change="current_change"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { updatGoodsPendingStateFinance, getGoodsCheckList } from "@/service";
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
      selectArray: [],
      tableData: [],
      tableHeight: window.innerHeight - 120,
      datetime: "", //时间选择
      documents: "", //单据编号输入
      transfer: "", //仓单类型
      recall: "", //仓库
      Documenttype: "", //单据类型
      recalloptions: [],
      transferoptions: [],
      Documenttypeoptions: [],
      total: "",
      pagesize: 10,
      currentPage: 1,
      tabindex: 0,
      loading: false
    };
  },
  methods: {
    async exportExcel() {
      let totalList = []
      if(this.loading){
        return this.$message.warning('数据响应中，请稍等')
      }
      this.loading = true
      for (let index = 0; index < this.total/100; index++) {
        await getGoodsCheckList({
          pageNum: index+1,
          pageSize: 100
        }).then(res=>{
          totalList = totalList.concat(res.data.data.data.list)
        })           
      }
      this.loading = false
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../vendor/Export2Excel");
        const tHeader = [
          "商品条码",
          "商品名称",
          "成本价",
          "零售价",
          "供应商",
          "审核状态",
          "申请时间"
        ];
        // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "bar_code",
          "name",
          "cost",
          "price",
          "provider_name",
          "state",
          "create_at"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        const list = totalList; //把data里的tableData存到list
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "商品审核");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    //
    checkboxInit(row, index) {
      if (row.state === "审核中") return 1;
      else return 0;
    },
    // 选择框
    handleSelectionChange(selectArray) {
      this.selectArray = selectArray;
    },
    // 循环批量提交
    async batchSubmit() {
      let _this = this;
      for (let index = 0; index < this.selectArray.length; index++) {
        const element = this.selectArray[index];
        let params = {
          id: element.id,
          userId: this.id,
          state: 2
        };
        await updatGoodsPendingStateFinance(params).catch(error => {
          _this.$message.error("响应时间过长，请重试");
          _this.getdata();
          return;
        });
      }
      _this.$message({
        message: "已通过审核",
        type: "success"
      });
      this.getdata();
    },
    //作废
    cancel(index) {
      let _self = this;
      let formData = new FormData();
      formData.append("billId", _self.tableData[index].id);
      formData.append("userId", _self.id);
      formData.append("state", "4");
      _self.axios
        .post(_self.ApiurlStorehouse + "/inventory/withdrawAudit", formData, {
          // 单独配置
          withCredentials: false
        })
        .then(response => {
          if (response.data.errcode == "0") {
            _self.$message({
              message: "作废成功",
              type: "success"
            });
            _self.getdata();
          } else {
            _self.$message.error("作废失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    //搜索
    seachall() {
      let _self = this;
      let formData = new FormData();
      formData.append("pageNum", _self.currentPage);
      formData.append("pageSize", _self.pagesize);
      formData.append("str", _self.recall);
      formData.append("startDate", _self.datetime[0]);
      formData.append("endDate", _self.datetime[1]);
      formData.append("userId", _self.id);
      _self.axios
        .post(_self.ApiurlStorehouse + "/inventory/queryInbBills", formData, {
          // 单独配置
          withCredentials: false
        })
        .then(response => {
          if (response.data.errcode == "0") {
            _self.tabindex = "1";
            _self.tableData = response.data.data.list.list;
            _self.total = response.data.data.list.total;
            for (var i = 0; i < _self.tableData.length; i++) {
              if (response.data.data.list.list[i].state == "0") {
                _self.tableData[i].state = "创建中";
              } else if (response.data.data.list.list[i].state == "1") {
                _self.tableData[i].state = "审核中";
              } else if (response.data.data.list.list[i].state == "2") {
                _self.tableData[i].state = "作废";
              } else if (response.data.data.list.list[i].state == "3") {
                _self.tableData[i].state = "完成";
              } else if (response.data.data.list.list[i].state == "4") {
                _self.tableData[i].state = "未完成";
              }
            }
          } else {
            _self.$message.error("搜索失败，请刷新重试");
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
      formData.append("pageNum", _self.currentPage);
      formData.append("pageSize", _self.pagesize);
      _self.axios
        .post(
          _self.ApiurlStorehouse + "/productManagement/getGoodsCheckList",
          formData,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if (response.data.errcode == "0") {
            _self.tableData = response.data.data.data.list;
            _self.total = response.data.data.data.total;
            for (var i = 0; i < _self.tableData.length; i++) {
              if (response.data.data.data.list[i].state == 0) {
                _self.tableData[i].state = "创建中";
              } else if (response.data.data.data.list[i].state == 1) {
                _self.tableData[i].state = "审核中";
              } else if (response.data.data.data.list[i].state == 2) {
                _self.tableData[i].state = "审核通过";
              }
            }
          } else {
            _self.$message.error("列表载入失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("列表载入响应时间过长，请重试2");
        });
    },
    //重置
    resetting() {
      let _self = this;
      _self.datetime = "";
      _self.documents = "";
      _self.Documenttype = "";
      _self.recall = "";
      _self.transfer = "";
    },
    //通过
    passthrough(index) {
      let _self = this;

      let formData = new FormData();
      formData.append("id", _self.tableData[index].id);
      formData.append("state", "2");
      formData.append("userId", _self.id);
      _self.axios
        .post(
          _self.ApiurlStorehouse + "/productManagement/updatGoodsPendingState",
          formData,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if (response.data.errcode == "0") {
            _self.$message({
              message: "已通过审核",
              type: "success"
            });
            _self.getdata();
          } else if (response.data.errcode == "1006") {
            this.$message({
              showClose: true,
              message: response.data.errmsg,
              type: "warning",
              duration: 7000
            });
          } else {
            _self.$message.error(response.data.errmsg);
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },

    //审核完成
    complete(index) {
      let _self = this;
      let formData = new FormData();
      formData.append("billId", _self.tableData[index].id);
      formData.append("userId", _self.id);
      formData.append("state", "1");
      _self.axios
        .post(_self.ApiurlStorehouse + "/inventory/withdrawAudit", formData, {
          // 单独配置
          withCredentials: false
        })
        .then(response => {
          if (response.data.errcode == "0") {
            _self.$message({
              message: "已提交审核",
              type: "success"
            });
            _self.getdata();
          } else {
            _self.$message.error(response.data.errmsg);
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    //修改
    revise(index) {
      let _self = this;

      _self.$router.push({
        path: "/CommodityModificationAudit",
        query: {
          tabledataDetail: _self.tableData[index]
        }
      });
    },
    //详情
    detail(index) {
      let _self = this;
      _self.$router.push({
        path: "/CommodityDetails",
        query: {
          tabledataDetail: _self.tableData[index]
        }
      });
    },
    add() {
      let _self = this;
      _self.$router.push({
        path: "/addstock"
      });
    },
    //撤回
    recalls(index) {
      let _self = this;
      let formData = new FormData();
      formData.append("billId", _self.tableData[index].id);
      formData.append("userId", _self.id);
      formData.append("state", "0");
      _self.axios
        .post(_self.ApiurlStorehouse + "/inventory/withdrawAudit", formData, {
          // 单独配置
          withCredentials: false
        })
        .then(response => {
          if (response.data.errcode == "0") {
            _self.$message({
              message: "撤回成功",
              type: "success"
            });
            _self.getdata();
          } else {
            _self.$message.error(response.data.errmsg);
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    //列表载入
    getdata() {
      let _self = this;

      let formData1 = new FormData();
      formData1.append("pageNum", _self.currentPage);
      formData1.append("pageSize", _self.pagesize);
      _self.axios
        .post(
          _self.ApiurlStorehouse + "/productManagement/getGoodsCheckList",
          formData1,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if (response.data.errcode == "0") {
            _self.tableData = response.data.data.data.list;
            _self.total = response.data.data.data.total;
            for (var i = 0; i < _self.tableData.length; i++) {
              if (response.data.data.data.list[i].state == 0) {
                _self.tableData[i].state = "创建中";
              } else if (response.data.data.data.list[i].state == 1) {
                _self.tableData[i].state = "审核中";
              } else if (response.data.data.data.list[i].state == 2) {
                _self.tableData[i].state = "审核通过";
              }
            }
          } else {
            _self.$message.error("列表载入失败，请刷新重试1");
          }
        })
        .catch(function(error) {
          _self.$message.error("列表载入响应时间过长，请重试3");
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
  margin: 0.625rem;
}

.stock-header {
  margin: 5px 0;
}

.stock-label {
  font-size: 0.875rem;
  margin: 0 0.1875rem;
  display: inline-block;
}

.stock-margin {
  margin: 0.625rem 0;
}

.display {
  display: none;
}

.el-table__body-wrapper {
  overflow-x: auto;
  overflow-y: auto;
}
.btns_fun {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}
</style>
