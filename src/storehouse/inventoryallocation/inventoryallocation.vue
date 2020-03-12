<template>
  <div class="app-contion">
    <div class="stock-header">
      <el-date-picker
        :picker-options="{'disabledDate': (time)=>{
				 return time.getTime() < new Date('2019-09-01  00:00:00');
			 }}"
        v-model="datetime"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetimerange"
        range-separator="至"
        start-placeholder="起始时间"
        end-placeholder="结束时间"
        style="width: 40%;"
      ></el-date-picker>

      <!-- <label class="stock-label">单据编号：</label>
      <el-input v-model="documents" placeholder="请输入内容" style='width: 15%;' class='stock-margin'></el-input>-->
      <!-- <label class="stock-label">单据类型：</label>
			<el-select v-model="Documenttype" placeholder="请选择">
				<el-option v-for="item in Documenttypeoptions" :key="item.code" :label="item.value" :value="item.code">
				</el-option>
      </el-select>-->
      <label class="stock-label">仓库名：</label>
      <el-select v-model="recall" placeholder="请选择" style="width: 20%;">
        <el-option
          v-for="item in recalloptionsnew"
          :key="item.warehouse_code"
          :label="item.warehouse_name"
          :value="item.warehouse_code"
        ></el-option>
      </el-select>
      <!-- <label class="stock-label">仓单类型：</label>
			<el-select v-model="transfer" placeholder="请选择">
				<el-option v-for="item in transferoptions" :key="item.code" :label="item.value" :value="item.code">
				</el-option>
      </el-select>-->
      <el-button type="primary" @click="seachall">搜索</el-button>
      <el-button type="warning" @click="resetting">重置</el-button>
    </div>
    <div style="text-align: right;margin-bottom: 0.1875rem;">
      <el-button type="success" size="mini" @click="add">创建调拨</el-button>
      <!-- 	<el-button size="mini" v-print="'#printTable'">打印</el-button> -->
    </div>
    <!--startprint-->
    <el-table :data="tableData" border :height="tableHeight" style="width: 100%" id="printTable">
      <el-table-column prop="id" label="调拨单号"></el-table-column>
      <el-table-column prop="warehouse_name" label="调出仓库"></el-table-column>
      <el-table-column prop="entryWarehouseName" label="调入仓库"></el-table-column>
      <!-- <el-table-column prop="type" label="仓单类型">
      </el-table-column>-->
      <el-table-column prop="ref_order_code" label="关联单据号"></el-table-column>
      <el-table-column prop="ref_order_type" label="关联单据类型"></el-table-column>
      <el-table-column prop="state" label="调拨单状态"></el-table-column>
      <el-table-column prop="operator" label="申请人"></el-table-column>
      <el-table-column prop="create_at" label="申请时间"></el-table-column>

      <el-table-column label="操作" width="295" fixed="right">
        <template slot-scope="scope">
          <div style="display: flex;">
            <el-button
              size="mini"
              type="success"
              @click="complete(scope.$index, scope.row)"
              v-if="scope.row.state=='创建中'||scope.row.state=='审核未通过'"
            >提交审核</el-button>
            <!-- 	<el-button size="mini" type="success" @click="passthrough(scope.$index, scope.row)" v-if="scope.row.state=='审核中'">通过</el-button>
            <el-button size="mini" type="danger" @click="nopassthrough(scope.$index, scope.row)" v-if="scope.row.state=='审核中'">不通过</el-button>-->
            <el-button
              size="mini"
              @click="revise(scope.$index, scope.row)"
              v-if="scope.row.state=='撤回'||scope.row.state=='创建中'"
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
              type="info"
              v-if="scope.row.state=='创建中'||scope.row.state=='审核未通过'||scope.row.state=='审核中'"
              @click="cancel(scope.$index, scope.row)"
            >作废</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="创建调拨"
      :visible.sync="createallocation"
      width="50%"
      :before-close="handleClose"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="出库仓库" prop="retrieval">
          <el-select
            v-model="ruleForm.retrieval"
            placeholder="请选择出库仓库"
            @change="chucangcode"
            style="width: 70%;"
          >
            <el-option
              v-for="item in recalloptionschu"
              :key="item.warehouse_code"
              :label="item.warehouse_name"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库仓库" prop="warehousing">
          <el-select
            v-model="ruleForm.warehousing"
            placeholder="请选择入库仓库"
            @change="rucode"
            style="width: 70%;"
          >
            <el-option
              v-for="item in recalloptions"
              :key="item.warehouse_code"
              :label="item.warehouse_name"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联单据号">
          <el-input v-model="ruleForm.ref_order_code" placeholder="请输入关联单据号" style="width: 70%;"></el-input>
        </el-form-item>
        <el-form-item label="关联单据类型">
          <el-select
            v-model="ruleForm.ref_order_type"
            :multiple="false"
            filterable
            allow-create
            default-first-option
            placeholder="请选择关联单据类型"
            style="width: 70%;"
            @change="refwareblur"
          >
            <el-option
              v-for="item in typeoptions"
              :key="item.code"
              :label="item.value"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="comments">
          <el-input v-model="ruleForm.comments" placeholder="请输入备注" style="width: 70%;"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createallocation = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">创 建</el-button>
      </span>
    </el-dialog>

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
  </div>
</template>

<script>
import { mapState } from "vuex";
import Qs from "qs";

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
      tableHeight: window.innerHeight - 240,
      datetime: "", //时间选择
      documents: "", //单据编号输入
      transfer: "", //仓单类型
      recall: "", //仓库
      Documenttype: "", //单据类型
      recalloptions: [],
      recalloptionschu: [],
      typeoptions: [], //关联单据类型
      transferoptions: [],
      Documenttypeoptions: [],
      recalloptionsnew: [],
      createallocation: false,
      total: "",
      refordertype: "",
      pagesize: 10,
      currentPage: 1,
      tabindex: 0,
      retrievalcode: "",
      warehousingcode: "",
      ruleForm: {
        retrieval: "",
        warehousing: "",
        ref_order_type: "",
        ref_order_code: "",
        comments: ""
      },
      rules: {
        retrieval: [
          {
            required: true,
            message: "请选择出库仓库",
            trigger: "change"
          }
        ],
        warehousing: [
          {
            required: true,
            message: "请选择入库仓库",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    //关联单据类型
    getreforderoptions() {
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
            _self.typeoptions = response.data.data.list;
          } else {
            _self.$message.error("获取仓单类型失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("仓单类型时间过长，请重试");
        });
    },
    refwareblur(vId) {
      let _self = this;
      _self.refordertype = vId.code;
    },
    chucangcode(Vid) {
      let _self = this;
      console.log(Vid);
      _self.ruleForm.retrieval = Vid.warehouse_name;
      _self.retrievalcode = Vid.warehouse_code;
    },
    rucode(Vid) {
      let _self = this;
      _self.ruleForm.warehousing = Vid.warehouse_name;
      _self.warehousingcode = Vid.warehouse_code;
    },
    submitForm(formName) {
      let _self = this;
      _self.$refs[formName].validate(valid => {
        if (valid) {
          let formData = new FormData();
          formData.append("warehouse_code", _self.retrievalcode);
          formData.append("warehouse_name", _self.ruleForm.retrieval);
          formData.append("type ", "5");
          formData.append("userId", _self.id);
          formData.append("ref_order_code", _self.ruleForm.ref_order_code);
          formData.append("ref_order_type", _self.refordertype);
          formData.append("entryWarehouseCode", _self.warehousingcode);
          formData.append("entryWarehouseName", _self.ruleForm.warehousing);
          if (
            _self.ruleForm.comments == null ||
            _self.ruleForm.comments == undefined
          ) {
            formData.append("comments", "");
          } else {
            formData.append("comments", _self.ruleForm.comments);
          }
          formData.append("supplierCode", "");
          _self.axios
            .post(
              _self.ApiurlStorehouse + "/inventory/createInvBills",
              formData,
              {
                // 单独配置
                withCredentials: false
              }
            )
            .then(response => {
              if (response.data.errcode == "0") {
                _self.$message({
                  message: "创建成功",
                  type: "success"
                });
                _self.ruleForm.retrieval = "";
                _self.ruleForm.warehousing = "";
                _self.ruleForm.ref_order_type = "";
                _self.ruleForm.ref_order_code = "";
                _self.ruleForm.comments = "";
                _self.refordertype = "";
                _self.createallocation = false;
                _self.getdata();
              } else {
                _self.$message.error("创建失败，请刷新重试");
              }
            })
            .catch(function(error) {
              _self.$message.error("响应时间过长，请重试");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
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
      formData.append("str", _self.recall);

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
          _self.ApiurlStorehouse + "/inventory/queryTransferInbBills",
          formData,
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
                _self.tableData[i].state = "创建中";
              } else if (response.data.data.list.list[i].state == "1") {
                _self.tableData[i].state = "审核中";
              } else if (response.data.data.list.list[i].state == "2") {
                _self.tableData[i].state = "审核通过";
              } else if (response.data.data.list.list[i].state == "3") {
                _self.tableData[i].state = "审核未通过";
              } else if (response.data.data.list.list[i].state == "4") {
                _self.tableData[i].state = "作废";
              } else if (response.data.data.list.list[i].state == "5") {
                _self.tableData[i].state = "等待调拨入库中";
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
            _self.ApiurlStorehouse + "/inventory/getTransferInvBillList",
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
                  _self.tableData[i].state = "创建中";
                } else if (response.data.data.list.list[i].state == "1") {
                  _self.tableData[i].state = "审核中";
                } else if (response.data.data.list.list[i].state == "2") {
                  _self.tableData[i].state = "审核通过";
                } else if (response.data.data.list.list[i].state == "3") {
                  _self.tableData[i].state = "审核未通过";
                } else if (response.data.data.list.list[i].state == "4") {
                  _self.tableData[i].state = "作废单";
                } else if (response.data.data.list.list[i].state == "5") {
                  _self.tableData[i].state = "等待调拨入库中";
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
        formData.append("str", _self.recall);
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
            _self.ApiurlStorehouse + "/inventory/queryTransferInbBills",
            formData,
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
                  _self.tableData[i].state = "创建中";
                } else if (response.data.data.list.list[i].state == "1") {
                  _self.tableData[i].state = "审核中";
                } else if (response.data.data.list.list[i].state == "2") {
                  _self.tableData[i].state = "审核通过";
                } else if (response.data.data.list.list[i].state == "3") {
                  _self.tableData[i].state = "审核未通过";
                } else if (response.data.data.list.list[i].state == "4") {
                  _self.tableData[i].state = "作废";
                } else if (response.data.data.list.list[i].state == "5") {
                  _self.tableData[i].state = "等待调拨入库中";
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

      let formDataw = new FormData();
      formDataw.append("orderId", _self.tableData[index].id);
      _self.axios
        .post(
          _self.ApiurlStorehouse +
            "/inventory/getInvBillDetailProductionDetailLists",
          formDataw,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if (response.data.errcode == "0") {
            var tabledateBoxs = response.data.data.list;
            var listbox = {
              list: tabledateBoxs,
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
                  _self.$notify({
                    title: "警告",
                    message: response.data.data.msg,
                    type: "warning",
                    duration: 0
                  });
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
    },
    //修改
    revise(index) {
      let _self = this;

      _self.$router.push({
        path: "/inventoryalstockdetail",
        query: {
          tabledataDetail: _self.tableData[index]
        }
      });
    },
    //详情
    detail(index) {
      let _self = this;
      _self.$router.push({
        path: "/inventoryalexhibition",
        query: {
          tabledataDetail: _self.tableData[index]
        }
      });
    },
    add() {
      let _self = this;
      _self.createallocation = true;
      // 				_self.$router.push({
      // 					path: '/addstock',
      //
      // 				})
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
        .post(
          _self.ApiurlStorehouse + "/inventory/getTransferInvBillList",
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
                _self.tableData[i].state = "创建中";
              } else if (response.data.data.list.list[i].state == "1") {
                _self.tableData[i].state = "审核中";
              } else if (response.data.data.list.list[i].state == "2") {
                _self.tableData[i].state = "审核通过";
              } else if (response.data.data.list.list[i].state == "3") {
                _self.tableData[i].state = "审核未通过";
              } else if (response.data.data.list.list[i].state == "4") {
                _self.tableData[i].state = "作废";
              } else if (response.data.data.list.list[i].state == "5") {
                _self.tableData[i].state = "等待调拨入库中";
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
      console.log(this.id, "=-=-=");

      _self.axios
        .post(
          _self.ApiurlStorehouse + "/inventory/tranferChooseWarehouseList",
          Qs.stringify({
            userId: this.id
          }),
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

    WarehouseSelectionchu() {
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
            _self.recalloptionsnew = response.data.data.list;
            _self.recalloptionschu = response.data.data.list;
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
    _self.WarehouseSelectionchu();
    _self.getreforderoptions();
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

.stock-header {
  width: 80%;
}
</style>
