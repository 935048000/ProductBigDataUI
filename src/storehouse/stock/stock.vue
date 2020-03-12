<template>
  <div class="app-contion">
    <div></div>
    <div class="stock-header" style="width: 100%;">
      <el-date-picker
        v-model="datetime"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetimerange"
        range-separator="至"
        start-placeholder="起始时间"
        end-placeholder="结束时间"
        style="width: 25%;"
        size="small"
        :picker-options="{'disabledDate': (time)=>{
				 return time.getTime() < new Date('2019-09-01  00:00:00');
			 }}"
      ></el-date-picker>

      <!-- <label class="stock-label">单据编号：</label>
      <el-input v-model="documents" placeholder="请输入内容" style='width: 15%;' class='stock-margin'></el-input>-->
      <!-- <label class="stock-label">单据类型：</label>
			<el-select v-model="Documenttype" placeholder="请选择">
				<el-option v-for="item in Documenttypeoptions" :key="item.code" :label="item.value" :value="item.code">
				</el-option>
      </el-select>-->
      <label class="stock-label">仓库名：</label>
      <el-select
        v-model="recall"
        placeholder="请选择"
        style="width: 20%;"
        size="small"
        @change="recallchange($event)"
      >
        <el-option
          v-for="item in recalloptions"
          :key="item.warehouse_code"
          :label="item.warehouse_name"
          :value="item"
        ></el-option>
      </el-select>
      <label class="stock-label">商品条形码：</label>
      <el-input
        v-model="CommodityBarCode"
        placeholder="请输入商品条形码"
        style="width: 10%;"
        size="small"
        class="stock-margin"
      ></el-input>
      <label class="stock-label">商品名称：</label>
      <el-input
        v-model="Nameofcommodity"
        placeholder="请输入商品名称"
        style="width: 10%;"
        size="small"
        class="stock-margin"
      ></el-input>
      <!-- <label class="stock-label">仓单类型：</label>
			<el-select v-model="transfer" placeholder="请选择">
				<el-option v-for="item in transferoptions" :key="item.code" :label="item.value" :value="item.code">
				</el-option>
      </el-select>-->
      <el-button type="primary" @click="seachall" size="small">查找</el-button>
      <el-button type="warning" @click="resetting" size="small">重置</el-button>
      <el-button
        type="primary"
        @click="expendExcel"
        size="small"
        v-loading.fullscreen.lock="fullscreenLoading"
      >导出</el-button>
    </div>
    <div style="text-align: right;margin-bottom: 0.1875rem;">
      <el-button type="success" size="mini" @click="add">新增</el-button>
      <!--  <el-button size="mini" v-print="'#printTable'">打印</el-button> -->
    </div>
    <!--startprint-->
    <el-table :data="tableData" border :height="tableHeight" style="width: 100%" id="printTable">
      <el-table-column prop="id" label="仓单号"></el-table-column>
      <el-table-column prop="warehouse_name" label="仓库名"></el-table-column>
      <el-table-column prop="bill_code" label="库单编码"></el-table-column>
      <el-table-column prop="type" label="仓单类型"></el-table-column>
      <el-table-column prop="ref_order_code" label="关联单据号"></el-table-column>
      <el-table-column prop="ref_order_type" label="关联单据类型"></el-table-column>
      <el-table-column prop="operator" label="申请人"></el-table-column>
      <el-table-column prop="apply_time" label="申请时间"></el-table-column>
      <el-table-column prop="state" label="仓单状态"></el-table-column>
      <el-table-column label="操作" width="365" fixed="right">
        <template slot-scope="scope">
          <div style="display: flex;">
            <el-button
              size="mini"
              type="success"
              @click="complete(scope.$index, scope.row)"
              v-if="scope.row.state=='待审核'||scope.row.state=='审核未通过'"
            >提交审核</el-button>
            <!-- 	<el-button size="mini" type="success" @click="passthrough(scope.$index, scope.row)" v-if="scope.row.state=='审核中'">通过</el-button>
            <el-button size="mini" type="danger" @click="nopassthrough(scope.$index, scope.row)" v-if="scope.row.state=='审核中'">不通过</el-button>-->
            <el-button
              size="mini"
              @click="revise(scope.$index, scope.row)"
              v-if="scope.row.state=='待审核'||scope.row.state=='审核未通过'"
              :disabled="scope.row.type==='调库'||scope.row.type==='调拨退货单'"
            >修改</el-button>
            <el-button
              size="mini"
              type="warning"
              @click="recalls(scope.$index, scope.row)"
              v-if="scope.row.state=='审核中'"
            >撤回</el-button>
            <el-button size="mini" @click="detail(scope.$index, scope.row)">详情</el-button>
            <el-button
              size="mini"
              type="danger"
              v-if="scope.row.state=='待审核'||scope.row.state=='审核未通过'||scope.row.state=='审核中'"
              @click="cancel(scope.$index, scope.row)"
            >作废</el-button>
            <el-button
              size="mini"
              type="info"
              @click="dayin(scope.$index, scope.row)"
            >{{scope.row.printState===1?'已打印':'打印'}}</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!--endprint-->
    <div style="position: fixed;bottom: 0.625rem;right: 0;">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="current_change"
      ></el-pagination>
    </div>
    <el-dialog title="提示" :visible.sync="dialogdayin" width="80%" :before-close="handleClose">
      <section ref="print">
        <div class="printstyle" style="text-align: center;margin-bottom: 1.25rem;">
          <span>{{printlist.type}}单</span>
        </div>

        <div style="width: 100%;">
          <div
            style="width:49.05rem;margin: 0 auto;padding-bottom: 0.325rem"
          >库单编码：{{printlist.bill_code}}</div>
          <div style="width:49.05rem;margin: 0 auto;">
            <div class="printstyle" v-if="printlist.type=='调库'">
              <span>调入仓库：{{tuningin}}</span>
              <span>调出仓库：{{recall}}</span>
            </div>
            <div class="printstyle">
              <span>仓库编码：{{printlist.warehouse_code}}</span>
              <span>仓库名称：{{printlist.warehouse_name}}</span>
              <span>仓单类型：{{printlist.type}}</span>
            </div>
            <div class="printstyle">
              <span>关联单据号：{{printlist.ref_order_code}}</span>
              <span>单据类型：{{printlist.ref_order_type}}</span>
              <span>制单人：{{printlist.operator}}</span>
            </div>

            <div class="printstyle">
              <span>供应商名称：{{printlist.supplier_name}}</span>
              <span>审核人：{{printlist.checked_by}}</span>
              <span>日期：{{printlist.create_at}}</span>
            </div>
            <div class="printstyle">
              <span>备注：{{printlist.comments}}</span>
              <span>总金额：{{printPriceTotal}}</span>
              <span>总数量：{{printAcountTotal}}</span>
            </div>
          </div>
          <div class="pageBreak"></div>
          <div style="width:49.05rem;margin: 0 auto;" class="table">
            <table border="1" class="tablebox">
              <thead>
                <tr>
                  <td style="width: 11.25rem;">条码</td>
                  <td style="width: 10rem;">名称</td>
                  <td style="width: 5.25rem;">规格</td>
                  <td style="width: 5.25rem;">单位</td>
                  <td style="width: 5.00rem;">数量</td>

                  <td style="width: 5.0rem;">成本</td>
                  <!-- <td style="width: 8.25rem;">规格</td> -->
                  <td style="width: 5.25rem;">金额</td>
                </tr>
              </thead>
              <tbody id="tby">
                <tr v-for="(item,index) in tableDataprint" :key="index" class="pageBreak">
                  <td>{{item.bar_code}}</td>
                  <td>{{item.production_name}}</td>
                  <td>{{item.specification}}</td>
                  <td>{{item.size}}</td>
                  <td>{{item.actual_amount}}</td>
                  <td>{{item.cost_price}}</td>
                  <!-- <td>{{item.cost_price}}</td> -->
                  <td>{{item.cost_total}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogdayin = false">取 消</el-button>
        <el-button type="primary" @click="dayinup">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="警告" :visible.sync="Errorprompt" width="60%">
      <el-table :data="Errorprompttable" border style="width: 100%" :height="400">
        <el-table-column prop="productionName" label="商品名称"></el-table-column>
        <el-table-column prop="barCode" label="商品条码"></el-table-column>
        <el-table-column prop="storageAmount" label="库存量"></el-table-column>
        <el-table-column prop="msg" label="原因"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="Errorprompt = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { tableToExcel } from "@/public";
import { getInvBillsList, printRecord } from "@/service";
export default {
  computed: {
    ...mapState({
      username: state => state.userinfo.account,
      token: state => state.userinfo.token,
      id: state => state.userinfo.id,
      shopcode: state => state.userinfo.shopcode
    })
  },
  watch: {
    tableDataprint: function(newV, oldV) {
      console.log(newV, "=-=-=");
      this.printPriceTotal = 0
      this.printAcountTotal = 0
      newV.forEach(element => {
        this.printPriceTotal += element.cost_total 
        this.printAcountTotal += element.actual_amount;
      });
    }
  },
  data() {
    return {
      printPriceTotal: 0,
      printAcountTotal: 0,
      tableData: [],
      tableDataprint: [],
      tableHeight: window.innerHeight - 250,
      Errorprompt: false,
      Errorprompttable: [],
      datetime: "", //时间选择
      documents: "", //单据编号输入
      transfer: "", //仓单类型
      recall: "", //仓库
      recallcode: "", //仓库code
      Documenttype: "", //单据类型
      CommodityBarCode: "", //商品条形码
      Nameofcommodity: "", //商品名称
      recalloptions: [],
      transferoptions: [],
      Documenttypeoptions: [],
      total: "",
      pagesize: 10,
      currentPage: 1,
      tabindex: 0,
      dialogdayin: false,
      printindex: 0,
      printlist: "",
      tuningin: "",
      recall: "",
      fullscreenLoading: false
    };
  },
  methods: {
    async expendExcel() {
      console.log(this.total);
      let tempArray = [];
      let tempPage = Math.ceil(this.total / 100);
      this.fullscreenLoading = true;
      for (let index = 1; index < tempPage + 1; index++) {
        await getInvBillsList({
          pageSize: 100,
          pageNum: index,
          userId: this.id
        }).then(res => {
          tempArray = tempArray.concat(res.data.data.list.list);
        });
      }
      await tableToExcel(
        tempArray,
        [
          "仓库单",
          "仓库名",
          "仓库编码",
          "仓库类型",
          "关联单据号",
          "关联单据类型",
          "申请人",
          "申请时间",
          "仓库状态"
        ],
        [
          "id",
          "warehouse_name",
          "warehouse_code",
          "type",
          "ref_order_code",
          "ref_order_type",
          "operator",
          "apply_time",
          "state"
        ],
        "库存管理"
      );
      this.fullscreenLoading = false;
    },
    dayin(index) {
      let _self = this;
      _self.dialogdayin = true;
      _self.printindex = index;
      _self.printlist = _self.tableData[_self.printindex];
      console.log(_self.printlist, "=====");
      if (_self.printlist.type == "调库") {
        _self.Allocationdetails();
      }
      _self.getprinttabledate(_self.printlist.id);
    },
    dayinup() {
      let _self = this;
      _self.$print(_self.$refs.print);
      console.log(this.printlist, "this.printlist");

      printRecord({
        billId: this.printlist.id
      }).then(res => {
        this.getdata();
      });
    },
    Allocationdetails() {
      let _self = this;
      if (_self.printlist.ref_bill_type == "tranfer.out") {
        var types = 1;
      } else if (_self.printlist.ref_bill_type == "tranfer.in") {
        var types = 2;
      }
      let formDatas = new FormData();
      formDatas.append("userId", _self.id);
      formDatas.append("billId", _self.printlist.id);
      formDatas.append("type", types);
      _self.axios
        .post(
          _self.ApiurlStorehouse + "/inventory/tranferOutDetail",
          formDatas,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if (response.data.errcode == "0") {
            console.log(response);

            if (response.data.data.list != null) {
              _self.tuningin = response.data.data.list.entryWarehouseName;
              _self.recall = response.data.data.list.warehouse_name;
            }
          } else {
            console.log("获取调库详情失败");
          }
        })
        .catch(function(error) {
          _self.$message.error("仓库响应时间过长，请重试");
        });
    },
    getprinttabledate(id) {
      let _self = this;
      let formData = new FormData();
      formData.append("orderId", id);
      _self.axios
        .post(
          _self.ApiurlStorehouse +
            "/inventory/getInvBillDetailProductionDetailLists",
          formData,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if (response.data.errcode == "0") {
            _self.tableDataprint = response.data.data.list;
            // for (let index = 0; index < 100; index++) {
            //   _self.tableDataprint.push(_self.tableDataprint[0]);
            // }
          } else {
            _self.$message.error(response.data.errmsg);
          }
        })
        .catch(function(error) {
          _self.$message.error("获取列表时间过长，请重试");
        });
    },
    //仓库
    recallchange(Vid) {
      let _self = this;

      _self.recall = Vid.warehouse_name;
      _self.recallcode = Vid.warehouse_code;
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
            _self.$message.error(response.data.errmsg);
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    //搜索
    seachall() {
      let _self = this;

      if (
        _self.datetime == "" &&
        _self.recall == "" &&
        _self.CommodityBarCode == "" &&
        _self.Nameofcommodity == ""
      ) {
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
      formData.append("warehouseCode", _self.recallcode);
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
      formData.append("barCode", _self.CommodityBarCode);
      formData.append("productionName", _self.Nameofcommodity);
      _self.axios
        .post(_self.ApiurlStorehouse + "/inventory/queryInbBills", formData, {
          // 单独配置
          withCredentials: false
        })
        .then(response => {
          if (response.data.errcode == "0") {
            _self.tabindex = "1";
            _self.tableData = response.data.data.list.list;
            console.log(_self.tableData, "_self.tableData_self.tableData");

            _self.total = response.data.data.list.total;
            for (var i = 0; i < _self.tableData.length; i++) {
              if (_self.tableData[i].type == "1") {
                _self.tableData[i].type = "入库";
              } else if (_self.tableData[i].type == "2") {
                _self.tableData[i].type = "出库";
              } else if (_self.tableData[i].type == "3") {
                _self.tableData[i].type = "其他入库";
              } else if (_self.tableData[i].type == "4") {
                _self.tableData[i].type = "其他出库";
              } else if (_self.tableData[i].type == "5") {
                _self.tableData[i].type = "调库";
              } else if (_self.tableData[i].type == "6") {
                _self.tableData[i].type = "调拨退货";
              } else if (_self.tableData[i].type == "7") {
                _self.tableData[i].type = "退货";
              }

              if (_self.tableData[i].ref_order_type == "1") {
                _self.tableData[i].ref_order_type = "采购单号";
              } else if (_self.tableData[i].ref_order_type == "2") {
                _self.tableData[i].ref_order_type = "销售单号";
              } else if (_self.tableData[i].ref_order_type == "3") {
                _self.tableData[i].ref_order_type = "合同号";
              } else if (_self.tableData[i].ref_order_type == "4") {
                _self.tableData[i].ref_order_type = "调拨单";
              }

              if (response.data.data.list.list[i].state == "0") {
                _self.tableData[i].state = "待审核";
              } else if (response.data.data.list.list[i].state == "1") {
                _self.tableData[i].state = "审核中";
              } else if (response.data.data.list.list[i].state == "2") {
                _self.tableData[i].state = "审核通过";
              } else if (response.data.data.list.list[i].state == "3") {
                _self.tableData[i].state = "审核未通过";
              } else if (response.data.data.list.list[i].state == "4") {
                _self.tableData[i].state = "作废单";
              } else if (
                response.data.data.list.list[i].state == "5" &&
                response.data.data.list.list[i].ref_bill_type == "tranfer.out"
              ) {
                _self.tableData[i].state = "调拨出库通过";
              } else if (
                response.data.data.list.list[i].state == "5" &&
                response.data.data.list.list[i].ref_bill_type == "tranfer.in"
              ) {
                _self.tableData[i].state = "等待调拨入库";
              } else if (response.data.data.list.list[i].state == "6") {
                _self.tableData[i].state = "调拨通过"; //完成
              } else if (response.data.data.list.list[i].state == "7") {
                _self.tableData[i].state = "调拨出库未通过";
              } else if (response.data.data.list.list[i].state == "8") {
                _self.tableData[i].state = "调拨入库未通过";
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
      if (_self.tabindex == "0") {
        let formData = new FormData();
        formData.append("pageNum", _self.currentPage);
        formData.append("pageSize", _self.pagesize);
        formData.append("userId", _self.id);
        _self.axios
          .post(
            _self.ApiurlStorehouse + "/inventory/getInvBillsList",
            formData,
            {
              // 单独配置
              withCredentials: false
            }
          )
          .then(response => {
            if (response.data.errcode == "0") {
              _self.tableData = response.data.data.list.list;
              _self.total = response.data.data.list.total;
              console.log(_self.tableData, "_self.tableData_self.tableData");

              for (var i = 0; i < _self.tableData.length; i++) {
                if (_self.tableData[i].type == "1") {
                  _self.tableData[i].type = "入库";
                } else if (_self.tableData[i].type == "2") {
                  _self.tableData[i].type = "出库";
                } else if (_self.tableData[i].type == "3") {
                  _self.tableData[i].type = "其他入库";
                } else if (_self.tableData[i].type == "4") {
                  _self.tableData[i].type = "其他出库";
                } else if (_self.tableData[i].type == "5") {
                  _self.tableData[i].type = "调库";
                } else if (_self.tableData[i].type == "6") {
                  _self.tableData[i].type = "调拨退货";
                } else if (_self.tableData[i].type == "7") {
                  _self.tableData[i].type = "退货";
                }

                if (_self.tableData[i].ref_order_type == "1") {
                  _self.tableData[i].ref_order_type = "采购单号";
                } else if (_self.tableData[i].ref_order_type == "2") {
                  _self.tableData[i].ref_order_type = "销售单号";
                } else if (_self.tableData[i].ref_order_type == "3") {
                  _self.tableData[i].ref_order_type = "合同号";
                } else if (_self.tableData[i].ref_order_type == "4") {
                  _self.tableData[i].ref_order_type = "调拨单";
                }

                if (response.data.data.list.list[i].state == "0") {
                  _self.tableData[i].state = "待审核";
                } else if (response.data.data.list.list[i].state == "1") {
                  _self.tableData[i].state = "审核中";
                } else if (response.data.data.list.list[i].state == "2") {
                  _self.tableData[i].state = "审核通过";
                } else if (response.data.data.list.list[i].state == "3") {
                  _self.tableData[i].state = "审核未通过";
                } else if (response.data.data.list.list[i].state == "4") {
                  _self.tableData[i].state = "作废单";
                } else if (
                  response.data.data.list.list[i].state == "5" &&
                  response.data.data.list.list[i].ref_bill_type == "tranfer.out"
                ) {
                  _self.tableData[i].state = "调拨出库通过";
                } else if (
                  response.data.data.list.list[i].state == "5" &&
                  response.data.data.list.list[i].ref_bill_type == "tranfer.in"
                ) {
                  _self.tableData[i].state = "等待调拨入库";
                } else if (response.data.data.list.list[i].state == "6") {
                  _self.tableData[i].state = "调拨通过"; //完成
                } else if (response.data.data.list.list[i].state == "7") {
                  _self.tableData[i].state = "调拨出库未通过";
                } else if (response.data.data.list.list[i].state == "8") {
                  _self.tableData[i].state = "调拨入库未通过";
                }
              }
            } else {
              _self.$message.error("列表载入失败，请刷新重试");
            }
          })
          .catch(function(error) {
            _self.$message.error("列表载入响应时间过长，请重试");
          });
      } else {
        let formData = new FormData();
        formData.append("pageNum", _self.currentPage);
        formData.append("pageSize", _self.pagesize);
        formData.append("warehouseCode", _self.recallcode);
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
        formData.append("barCode", _self.CommodityBarCode);
        formData.append("productionName", _self.Nameofcommodity);
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
                if (_self.tableData[i].type == "1") {
                  _self.tableData[i].type = "入库";
                } else if (_self.tableData[i].type == "2") {
                  _self.tableData[i].type = "出库";
                } else if (_self.tableData[i].type == "3") {
                  _self.tableData[i].type = "其他入库";
                } else if (_self.tableData[i].type == "4") {
                  _self.tableData[i].type = "其他出库";
                } else if (_self.tableData[i].type == "5") {
                  _self.tableData[i].type = "调库";
                } else if (_self.tableData[i].type == "6") {
                  _self.tableData[i].type = "调拨退货";
                } else if (_self.tableData[i].type == "7") {
                  _self.tableData[i].type = "退货";
                }

                if (_self.tableData[i].ref_order_type == "1") {
                  _self.tableData[i].ref_order_type = "采购单号";
                } else if (_self.tableData[i].ref_order_type == "2") {
                  _self.tableData[i].ref_order_type = "销售单号";
                } else if (_self.tableData[i].ref_order_type == "3") {
                  _self.tableData[i].ref_order_type = "合同号";
                } else if (_self.tableData[i].ref_order_type == "4") {
                  _self.tableData[i].ref_order_type = "调拨单";
                }

                if (response.data.data.list.list[i].state == "0") {
                  _self.tableData[i].state = "待审核";
                } else if (response.data.data.list.list[i].state == "1") {
                  _self.tableData[i].state = "审核中";
                } else if (response.data.data.list.list[i].state == "2") {
                  _self.tableData[i].state = "审核通过";
                } else if (response.data.data.list.list[i].state == "3") {
                  _self.tableData[i].state = "审核未通过";
                } else if (response.data.data.list.list[i].state == "4") {
                  _self.tableData[i].state = "作废单";
                } else if (
                  response.data.data.list.list[i].state == "5" &&
                  response.data.data.list.list[i].ref_bill_type == "tranfer.out"
                ) {
                  _self.tableData[i].state = "调拨出库通过";
                } else if (
                  response.data.data.list.list[i].state == "5" &&
                  response.data.data.list.list[i].ref_bill_type == "tranfer.in"
                ) {
                  _self.tableData[i].state = "等待调拨入库";
                } else if (response.data.data.list.list[i].state == "6") {
                  _self.tableData[i].state = "调拨通过"; //完成
                } else if (response.data.data.list.list[i].state == "7") {
                  _self.tableData[i].state = "调拨出库未通过";
                } else if (response.data.data.list.list[i].state == "8") {
                  _self.tableData[i].state = "调拨入库未通过";
                }
              }
            } else {
              _self.$message.error("搜索失败，请刷新重试");
            }
          })
          .catch(function(error) {
            _self.$message.error("响应时间过长，请重试");
          });
      }
    },
    //重置
    resetting() {
      let _self = this;
      _self.datetime = "";
      _self.documents = "";
      _self.Documenttype = "";
      _self.recall = "";
      _self.transfer = "";
      _self.Nameofcommodity = "";
      _self.CommodityBarCode = "";
    },
    //通过
    passthrough(index) {
      let _self = this;
      let formData = new FormData();
      formData.append("billId", _self.tableData[index].id);

      _self.axios
        .post(
          _self.ApiurlStorehouse + "/inventory/inventoryApproval",
          formData,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if (response.data.errcode == "0") {
            _self.$message({
              message: "审核通过",
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
    //审核不通过
    nopassthrough(index) {
      let _self = this;
      let formData = new FormData();
      formData.append("billId", _self.tableData[index].id);
      formData.append("userId", _self.id);
      formData.append("state", "3");
      _self.axios
        .post(_self.ApiurlStorehouse + "/inventory/withdrawAudit", formData, {
          // 单独配置
          withCredentials: false
        })
        .then(response => {
          if (response.data.errcode == "0") {
            _self.$message({
              message: "操作成功",
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
    //审核完成
    complete(index) {
      let _self = this;
      if (
        _self.tableData[index].ref_bill_type == "warehouse.out" ||
        _self.tableData[index].ref_bill_type == "tranfer.out" ||
        _self.tableData[index].ref_bill_type == "warehouse.back"
      ) {
        let formData = new FormData();
        formData.append("orderId", _self.tableData[index].id);
        _self.axios
          .post(
            _self.ApiurlStorehouse +
              "/inventory/getInvBillDetailProductionDetailLists",
            formData,
            {
              // 单独配置
              withCredentials: false
            }
          )
          .then(response => {
            if (response.data.errcode == "0") {
              var tableDatas = response.data.data.list;
              var listbox = {
                list: tableDatas,
                warehouse_code: _self.tableData[index].warehouse_code
              };
              _self.axios
                .post(
                  _self.ApiurlStorehouse + "/inventory/inventoryVerification",
                  {
                    jsonData: listbox
                  },
                  {
                    // 单独配置
                    withCredentials: false
                  },
                  {
                    headers: {
                      "Content-Type": "application/json;charsetset=UTF-8"
                    }
                  }
                )
                .then(response => {
                  if (response.data.errcode == "0") {
                    let formData = new FormData();
                    formData.append("billId", _self.tableData[index].id);
                    formData.append("userId", _self.id);
                    formData.append("state", "1");
                    _self.axios
                      .post(
                        _self.ApiurlStorehouse + "/inventory/withdrawAudit",
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
                  } else {
                    _self.Errorprompttable = response.data.data.msgList;
                    _self.Errorprompt = true;
                    return false;
                  }
                })
                .catch(function(error) {
                  _self.$message.error("保存响应时间过长，请重试");
                });
            } else {
              _self.$message.error("获取列表失败，请刷新重试");
            }
          })
          .catch(function(error) {
            _self.$message.error("获取列表时间过长，请重试");
          });
      } else {
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
      }
    },
    //修改
    revise(index) {
      let _self = this;

      _self.$router.push({
        path: "/stockdetail",
        query: {
          tabledataDetail: _self.tableData[index]
        }
      });
    },
    //详情
    detail(index) {
      let _self = this;
      _self.$router.push({
        path: "/exhibitionstok",
        query: {
          tabledataDetail: JSON.stringify(_self.tableData[index])
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
      formData.append("userId", _self.id);
      _self.axios
        .post(_self.ApiurlStorehouse + "/inventory/getInvBillsList", formData, {
          // 单独配置
          withCredentials: false
        })
        .then(response => {
          if (response.data.errcode == "0") {
            _self.tableData = response.data.data.list.list;
            console.log(_self.tableData, "_self.tableData_self.tableData");

            _self.total = response.data.data.list.total;
            for (var i = 0; i < _self.tableData.length; i++) {
              if (_self.tableData[i].type == "1") {
                _self.tableData[i].type = "入库";
              } else if (_self.tableData[i].type == "2") {
                _self.tableData[i].type = "出库";
              } else if (_self.tableData[i].type == "3") {
                _self.tableData[i].type = "其他入库";
              } else if (_self.tableData[i].type == "4") {
                _self.tableData[i].type = "其他出库";
              } else if (_self.tableData[i].type == "5") {
                _self.tableData[i].type = "调库";
              } else if (_self.tableData[i].type == "6") {
                _self.tableData[i].type = "调拨退货";
              } else if (_self.tableData[i].type == "7") {
                _self.tableData[i].type = "退货";
              }

              if (_self.tableData[i].ref_order_type == "1") {
                _self.tableData[i].ref_order_type = "采购单号";
              } else if (_self.tableData[i].ref_order_type == "2") {
                _self.tableData[i].ref_order_type = "销售单号";
              } else if (_self.tableData[i].ref_order_type == "3") {
                _self.tableData[i].ref_order_type = "合同号";
              } else if (_self.tableData[i].ref_order_type == "4") {
                _self.tableData[i].ref_order_type = "调拨单";
              }

              if (response.data.data.list.list[i].state == "0") {
                _self.tableData[i].state = "待审核";
              } else if (response.data.data.list.list[i].state == "1") {
                _self.tableData[i].state = "审核中";
              } else if (response.data.data.list.list[i].state == "2") {
                _self.tableData[i].state = "审核通过";
              } else if (response.data.data.list.list[i].state == "3") {
                _self.tableData[i].state = "审核未通过";
              } else if (response.data.data.list.list[i].state == "4") {
                _self.tableData[i].state = "作废单";
              } else if (
                response.data.data.list.list[i].state == "5" &&
                response.data.data.list.list[i].ref_bill_type == "tranfer.out"
              ) {
                _self.tableData[i].state = "调拨出库通过";
              } else if (
                response.data.data.list.list[i].state == "5" &&
                response.data.data.list.list[i].ref_bill_type == "tranfer.in"
              ) {
                _self.tableData[i].state = "等待调拨入库";
              } else if (response.data.data.list.list[i].state == "6") {
                _self.tableData[i].state = "调拨通过"; //完成
              } else if (response.data.data.list.list[i].state == "7") {
                _self.tableData[i].state = "调拨出库未通过";
              } else if (response.data.data.list.list[i].state == "8") {
                _self.tableData[i].state = "调拨入库未通过";
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
    //仓库选择
    WarehouseSelection() {
      let _self = this;
      let formData = new FormData();
      formData.append("userId", _self.id);
      _self.axios
        .post(
          _self.ApiurlStorehouse + "/inventory/choouseTransferOut",
          formData,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if (response.data.errcode == "0") {
            _self.recalloptions = response.data.data.list;
          } else {
            _self.$message.error("获取仓库失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("仓库响应时间过长，请重试");
        });
    },
    //仓单类型选择
    warehouserec() {
      let _self = this;
      let formData = new FormData();
      formData.append("state", "1");
      _self.axios
        .post(
          _self.ApiurlStorehouse + "/inventory/chooseWarehouseTypeList",
          formData,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if (response.data.errcode == "0") {
            _self.transferoptions = response.data.data.list;
          } else {
            _self.$message.error("获取仓单类型失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("仓单类型时间过长，请重试");
        });
    },
    //单据类型选择
    DocumentTypeSelection() {
      let _self = this;
      let formData = new FormData();
      formData.append("state", "2");
      _self.axios
        .post(
          _self.ApiurlStorehouse + "/inventory/chooseWarehouseTypeList",
          formData,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if (response.data.errcode == "0") {
            _self.Documenttypeoptions = response.data.data.list;
          } else {
            _self.$message.error("获取单据类型失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("单据类型响应时间过长，请重试");
        });
    }
  },
  created: function() {
    let _self = this;
    _self.WarehouseSelection();
    _self.DocumentTypeSelection();
    _self.warehouserec();
    _self.getdata();
  }
};
</script>

<style scoped lang='less'>
.pageBreak {
  //  page-break-after:always;
}
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
  margin: 0.325rem 0;
}

.display {
  display: none;
}

.el-table__body-wrapper {
  overflow-x: auto;
  overflow-y: auto;
}

.stock-header {
  width: 100%;
}

.stockstyle span {
  display: inline-block;
  margin: 0 0.9375rem;
  color: #008800;
}

.printstyle {
  width: 100%;
}

.printstyle span {
  display: inline-block;
  margin-bottom: 0.325rem;
  width: 25%;
}

.tablebox tbody tr td {
  text-align: left;
  padding: 0.3125rem;
  font-size: 0.675rem;
}

.tablebox thead tr td {
  text-align: center;
  padding: 0.3125rem;
  font-size: 0.675rem;
}
.table {
  td {
    overflow: hidden;
    text-overflow: ellipsis;
    // white-space: nowrap;
  }
}

//  @page{ size:210mm 2000mm; }
</style>
<style lang="less">
body {
  overflow: scroll !important;
  // position: relative;
  // display: inline;
}
</style>