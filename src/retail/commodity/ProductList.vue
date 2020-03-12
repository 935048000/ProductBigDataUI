<template>
  <div class="app-contion">
    <!--  <div class="stock-header">
      <el-date-picker v-model="datetime" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至"
        start-placeholder="起始时间" end-placeholder="结束时间" style='width: 40%;'>
      </el-date-picker>

      <label class="stock-label">仓库名：</label>
      <el-select v-model="recall" placeholder="请选择" style='width: 20%;'>
        <el-option v-for="item in recalloptionsnew" :key="item.warehouse_code" :label="item.warehouse_name" :value="item.warehouse_code">
        </el-option>
      </el-select>

      <el-button type="primary" @click='seachall'>搜索</el-button>
      <el-button type="warning" @click='resetting'>重置</el-button>
    </div>-->
    <div style="text-align: right;margin-bottom: 0.1875rem;">
      <el-button type="success" size="mini" @click="add">新增商品</el-button>
      <div class="file-box" style="float: right;">
        <input
          type="file"
          ref="referenceUploads"
          class="file-btn"
          @change="importf(this)"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        />
        批量导入
      </div>
      <el-button type="primary" size="mini" @click="batchSubmit" :disabled='selectArray.length<=0'>批量审核</el-button>
    </div>
    <!--startprint-->
    <el-table
      :data="tableData"
      border
      :height="tableHeight"
      style="width: 100%"
      id="printTable"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" :selectable='checkboxInit'></el-table-column>
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

      <el-table-column label="操作" width="295" fixed="right">
        <template slot-scope="scope">
          <div style="display: flex;">
            <el-button
              size="mini"
              type="success"
              @click="complete(scope.$index, scope.row)"
              v-if="scope.row.state=='创建中'"
            >提交审核</el-button>
            <!-- 	<el-button size="mini" type="success" @click="passthrough(scope.$index, scope.row)" v-if="scope.row.state=='审核中'">通过</el-button>
            <el-button size="mini" type="danger" @click="nopassthrough(scope.$index, scope.row)" v-if="scope.row.state=='审核中'">不通过</el-button>-->
            <el-button
              size="mini"
              @click="revise(scope.$index, scope.row)"
              v-if="scope.row.state=='创建中'"
            >修改</el-button>
            <el-button
              size="mini"
              type="warning"
              @click="recalls(scope.$index, scope.row)"
              v-if="scope.row.state=='审核中'"
            >撤回</el-button>
            <el-button size="mini" @click="detail(scope.$index, scope.row)">详情</el-button>
            <!--  <el-button size="mini" type="info" v-if="scope.row.state=='创建中'||scope.row.state=='审核未通过'||scope.row.state=='审核中'"
            @click='cancel(scope.$index, scope.row)'>作废</el-button>-->
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!--endprint-->
    <div style="position: fixed;bottom: 0.625rem;right: 0;">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pagesize"
        :total="total"
        @current-change="current_change"
      ></el-pagination>
    </div>

    <el-dialog title="错误提示" :visible.sync="ErrTableVisible" width="60%">
      <el-table :data="addNewGoodserr" :height="350" border>
        <el-table-column prop="barCode" label="商品条码"></el-table-column>
        <el-table-column prop="productionName" label="商品名称"></el-table-column>
        <el-table-column prop="errmsg" label="错误提示"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="ErrTableVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { updatGoodsPendingState } from "@/service";
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
      tableHeight: window.innerHeight - 160,
      total: "",
      pagesize: 10,
      currentPage: 1,
      ErrTableVisible: false,
      tabindex: 0,
      addNewGoodserr: [],
      selectArray: []
    };
  },
  methods: {
    //
    checkboxInit(row,index){
      if(row.state === '创建中')
        return 1
      else
        return 0
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
          state: 1
        };
        await updatGoodsPendingState(params).catch(error => {
          _this.$message.error("响应时间过长，请重试");
          _this.getdata();
          return;
        });
      }
      _this.$message({
        message: "已提交审核",
        type: "success"
      });
      this.getdata();
    },
    //作废
    cancel(index) {
      let _self = this;
      let formData = new FormData();
      formData.append(
        "orderCode",
        _self.tableData[index].productManagement_order_code
      );
      formData.append("userId", _self.id);
      formData.append("state", "2");
      _self.axios
        .post(
          _self.ApiurlStorehouse +
            "/productManagement/updateproductManagementBillState",
          formData,
          {
            // 单独配置
            withCredentials: false
          }
        )
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
    //批量导入

    importf(obj) {
      let _this = this;
      _this.addNewGoodserr = [];
      let inputDOM = this.$refs.inputer; // 通过DOM取文件数据

      this.file = event.currentTarget.files[0];

      var rABS = false; //是否将文件读取为二进制字符串

      var f = this.file;

      var reader = new FileReader();

      //if (!FileReader.prototype.readAsBinaryString) {

      FileReader.prototype.readAsBinaryString = function(f) {
        var binary = "";

        var rABS = false; //是否将文件读取为二进制字符串

        var pt = this;

        var wb; //读取完成的数据

        var outdata;

        var reader = new FileReader();

        reader.onload = function(e) {
          var bytes = new Uint8Array(reader.result);

          var length = bytes.byteLength;

          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }

          var XLSX = require("xlsx");

          if (rABS) {
            wb = XLSX.read(btoa(fixdata(binary)), {
              //手动转化

              type: "base64"
            });
          } else {
            wb = XLSX.read(binary, {
              type: "binary"
            });
          }

          // outdata就是你想要的东西 excel导入的数据

          outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

          // excel 数据再处理

          let arr = [];

          outdata.map(v => {
            let obj = {};

            // obj.productionCode = v.商品编码
            obj.productionName = v.商品名称;
            obj.cost = v.成本价;
            obj.price = v.零售价;
            obj.categoryName = v.三级品类名称;
            obj.categoryCode = v.品类编码;
            obj.barCode = v.商品条形码;
            obj.providerName = v.供应商名称;
            obj.providerCode = v.供应商编码;
            obj.specification = v.商品规格;
            obj.brand = v.商品品牌;
            obj.unit = v.商品单位;

            if (obj.barCode == undefined || obj.barCode == "") {
            } else {
              arr.push(obj);
              if (
                obj.categoryCode == undefined ||
                obj.productionName == undefined ||
                obj.price == undefined ||
                obj.categoryName == undefined ||
                obj.barCode == undefined ||
                obj.providerName == undefined ||
                obj.providerCode == undefined ||
                obj.unit == undefined
              ) {
                // _this.$notify({
                //   title: '警告',
                //   message: '请完善您的导入信息',
                //   type: 'warning'
                // });
                console.log("信息不完整");
                var newdata = {
                  productionName: obj.productionName,
                  barCode: obj.barCode,
                  errmsg: "该商品信息填写不完整，请您完善信息"
                };
                _this.addNewGoodserr.push(newdata);
                _this.ErrTableVisible = true;
                return false;
              }
              if (obj.cost == undefined) {
                obj.cost = 0;
              }
              let formData = new FormData();
              // if (obj.productionCode == undefined || obj.productionCode == '') {
              //   formData.append('productionCode', String(obj.categoryCode));
              // } else {
              //   formData.append('productionCode', String(obj.categoryCode) + String(obj.productionCode));
              // }

              formData.append("productionName", obj.productionName);
              formData.append("cost", obj.cost);
              formData.append("price", obj.price);
              formData.append("categoryName", obj.categoryName);
              if (obj.categoryCode == undefined || obj.categoryCode == "") {
                formData.append("categoryCode", "");
              } else {
                formData.append("categoryCode", obj.categoryCode);
              }
              formData.append("barCode", obj.barCode);
              formData.append("providerName", obj.providerName);
              formData.append("providerCode", obj.providerCode);
              if (obj.specification == "" || obj.specification == undefined) {
                formData.append("specification", "");
              } else {
                formData.append("specification", obj.specification);
              }
              formData.append("picUrl", "");

              formData.append("unit", obj.unit);
              if (obj.brand == "" || obj.brand == undefined) {
                formData.append("brand", "");
              } else {
                formData.append("brand", obj.brand);
              }
              formData.append("userId", _this.id);
              _this.axios
                .post(
                  _this.ApiurlStorehouse + "/productManagement/addNewGoods",
                  formData,
                  {
                    // 单独配置
                    withCredentials: false
                  }
                )
                .then(response => {
                  if (response.data.errcode == "0") {
                    _this.getdata();
                    _this.$refs.referenceUploads.value = null;
                  } else {
                    var newdata = {
                      productionName: obj.productionName,
                      barCode: obj.barCode,
                      errmsg: response.data.errmsg
                    };
                    _this.addNewGoodserr.push(newdata);
                    _this.ErrTableVisible = true;
                    _this.$refs.referenceUploads.value = null;
                  }
                })
                .catch(function(error) {
                  _this.$message.error("响应时间过长，请重试5");
                });
            }
          });

          _this.accountList = [...arr];
        };

        reader.readAsArrayBuffer(f);
      };

      if (rABS) {
        reader.readAsArrayBuffer(f);
      } else {
        reader.readAsBinaryString(f);
      }
    },
    //搜索
    seachall() {
      let _self = this;
      if (_self.datetime == "" && _self.recall == "") {
        _self.$message({
          type: "warning",
          message: "您还没有输入搜索内容哦！",
          showClose: true
        });
        return false;
      }
      let formData = new FormData();
      formData.append("pageNum", _self.currentPage);
      formData.append("pageSize", _self.pagesize);
      formData.append("warehouseCode", _self.recall);

      if (_self.datetime[0] == undefined) {
        formData.append("startDate", "");
      } else {
        formData.append("startDate", _self.datetime[0]);
      }
      if (_self.datetime[1] == undefined) {
        formData.append("endDate", "");
      } else {
        formData.append("endDate", _self.datetime[1]);
      }
      formData.append("userId", _self.id);
      _self.axios
        .post(
          _self.ApiurlStorehouse +
            "/productManagement/queryproductManagementBillsList",
          formDat,
          {
            // 单独配置
            withCredentials: false
          }
        )
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
          _self.ApiurlStorehouse + "/productManagement/getNewGoodsList",
          formData,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if (response.data.errcode == "0") {
            _self.tabindex = "0";
            _self.tableData = response.data.data.data.list;
            _self.total = response.data.data.data.total;
            for (var i = 0; i < _self.tableData.length; i++) {
              if (response.data.data.data.list[i].state == "0") {
                _self.tableData[i].state = "创建中";
              } else if (response.data.data.data.list[i].state == "1") {
                _self.tableData[i].state = "审核中";
              } else if (response.data.data.data.list[i].state == "2") {
                _self.tableData[i].state = "审核通过";
              }
            }
          } else {
            _self.$message.error("列表载入失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("列表载入响应时间过长，请重试");
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

    //提交审核
    complete(index) {
      let _self = this;
      let formData = new FormData();
      formData.append("id", _self.tableData[index].id);
      formData.append("userId", _self.id);
      formData.append("state", "1");
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
        path: "/CommodityModification",
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
        path: "/newlyIncreased"
      });
    },
    //撤回
    recalls(index) {
      let _self = this;
      let formData = new FormData();
      formData.append("id", _self.tableData[index].id);
      formData.append("userId", _self.id);
      formData.append("state", "0");
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
              message: "撤回成功",
              type: "success"
            });
            _self.getdata();
          } else {
            _self.$message.error("撤回失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    //列表载入
    getdata() {
      let _self = this;
      let formData = new FormData();
      formData.append("pageNum", _self.currentPage);
      formData.append("pageSize", _self.pagesize);

      _self.axios
        .post(
          _self.ApiurlStorehouse + "/productManagement/getNewGoodsList",
          formData,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if (response.data.errcode == "0") {
            _self.tabindex = "0";
            _self.tableData = response.data.data.data.list;
            _self.total = response.data.data.data.total;
            for (var i = 0; i < _self.tableData.length; i++) {
              if (response.data.data.data.list[i].state == "0") {
                _self.tableData[i].state = "创建中";
              } else if (response.data.data.data.list[i].state == "1") {
                _self.tableData[i].state = "审核中";
              } else if (response.data.data.data.list[i].state == "2") {
                _self.tableData[i].state = "审核通过";
              }
            }
          } else {
            _self.$message.error("列表载入失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("列表载入响应时间过长，请重试");
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

.file-box {
  display: inline-block;
  position: relative;
  overflow: hidden;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #e6a23c;
  border: 1px solid #e6a23c;
  color: #fff;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  transition: 0.1s;
  font-weight: 500;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  padding: 7px 15px;
  font-size: 12px;
  border-radius: 3px;
  margin: 0 0.625rem;
}

.file-btn {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  outline: none;
  background-color: transparent;
  filter: alpha(opacity=0);
  -moz-opacity: 0;
  -khtml-opacity: 0;
  opacity: 0;
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

.stock-header {
  width: 80%;
}
</style>
