<template>
  <div class="app-contion">
    <div class="stockstyle" v-if="tabledataDetail.type=='调库'">
      <span>调入仓库：{{tuningin}}</span>
      <span>调出仓库：{{recall}}</span>
    </div>
    <el-row class="mar-increased">
      <el-form
        size="mini"
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        style="margin: 0;width: auto;padding: 0;border: 0;"
      >
        <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="仓库编码" prop="warehouse_code">
              <el-select
                v-model="ruleForm.warehouse_code"
                :multiple="false"
                filterable
                allow-create
                default-first-option
                placeholder="请选择仓库编码"
                style="width: 100%;"
                @change="wareblur"
                disabled
              >
                <el-option
                  v-for="item in warehouseoptions"
                  :key="item.warehouse_name"
                  :label="item.warehouse_code"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="仓库名称 " prop="warehouse_name">
              <el-input v-model="ruleForm.warehouse_name" placeholder="请输入仓库名称 " disabled></el-input>
            </el-form-item>
          </div>
        </el-col>

        <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="仓单类型" prop="type">
              <el-select
                v-model="ruleForm.type"
                :multiple="false"
                disabled
                filterable
                allow-create
                default-first-option
                placeholder="请选择仓单类型"
                style="width: 100%;"
              >
                <el-option
                  v-for="item in typeoptions"
                  :key="item.code"
                  :label="item.value"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="关联单据号" prop="ref_order_code">
              <el-input v-model="ruleForm.ref_order_code" placeholder="请输入关联单据号" disabled></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="单据类型" prop="ref_order_type">
              <el-select
                v-model="ruleForm.ref_order_type"
                :multiple="false"
                filterable
                allow-create
                default-first-option
                placeholder="请选择关联单据类型"
                style="width: 100%;"
                disabled
              >
                <el-option
                  v-for="item in ref_orderoptions"
                  :key="item.code"
                  :label="item.value"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="审核人" prop="checked_by">
              <el-input v-model="ruleForm.checked_by" placeholder="请输入审核人" disabled></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="供应商名称">
              <el-select
                v-model="ruleForm.providerName"
                :multiple="false"
                filterable
                allow-create
                default-first-option
                placeholder="请选择供应商名称"
                style="width: 100%;"
                disabled
              >
                <el-option
                  v-for="item in options4"
                  :key="item.supplier_name"
                  :label="item.supplier_name"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="备注" prop="comments">
              <el-input v-model="ruleForm.comments" disabled></el-input>
            </el-form-item>
          </div>
        </el-col>
        <!-- <el-col :span="12">
					<div class="grid-content bg-purple f-s">
						<el-form-item label="扫描条形码" >
							<el-input v-model="ruleForm.barCode" placeholder="请扫描扫描条形码"></el-input>
						</el-form-item>
					</div>
        </el-col>-->
      </el-form>
    </el-row>
    <el-row>
      <el-button type="warning" size="small" @click="exportExcel">导出</el-button>
      <div style="float: right;font-size: 0.875rem;">
        总件数：
        <span style="color: red;">{{allnum}}</span>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%;margin-top: 0.625rem;"
        :height="tableHeight"
        border
      >
        <!-- <el-table-column prop="production_code" label="商品编码"></el-table-column> -->
        <el-table-column prop="bar_code" label="商品条形码"></el-table-column>
        <el-table-column prop="production_name" label="商品名称"></el-table-column>
        <el-table-column prop="specification" label="商品规格"></el-table-column>
        <el-table-column prop="size" label="商品单位"></el-table-column>
        <el-table-column prop="actual_amount" label="商品数量"></el-table-column>
        <el-table-column prop="cost_price" label="成本价"></el-table-column>
        <el-table-column prop='cost_total' label="金额" >
          <!-- <template slot-scope="scope">
            <span>{{scope.row.actual_amount*scope.row.cost_price}}</span>
        </template> -->
        </el-table-column>
        <!-- <el-table-column  prop="actual_amount"  label="实际入库数">
        </el-table-column>-->
        <el-table-column label="差额原因" prop="margin_cause"></el-table-column>
        <el-table-column prop="create_at" label="创建时间"></el-table-column>
      </el-table>
    </el-row>
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
      tabledataDetail: {},
      tuningin: "", //调入
      recall: "", //调出
      tabledataDetailtab: "",
      tableHeight: window.innerHeight - 420,
      tableData: [],
      allnum: 0, //总件数
      ruleForm: {
        warehouse_code: "",
        warehouse_name: "",
        type: "",
        ref_order_code: "",
        ref_order_type: "",
        checked_by: "",
        id: "",
        comments: "",
        providerName: ""
      },
      Returngoods: [],
      barCode: "",
      options4: [],
      rules: {
        warehouse_code: [
          {
            required: true,
            message: "请输入仓库编码",
            trigger: "change"
          }
        ],
        warehouse_name: [
          {
            required: true,
            message: "请选择或输入仓库名称",
            trigger: "change"
          }
        ],
        type: [
          {
            required: true,
            message: "请输入仓单类型",
            trigger: "change"
          }
        ],
        ref_order_code: [
          {
            required: true,
            message: "请输入关联单据号",
            trigger: "blur"
          }
        ],
        ref_order_type: [
          {
            required: true,
            message: "请输入关联单据类型",
            trigger: "change"
          }
        ],
        checked_by: [
          {
            required: true,
            message: "请输入审核人",
            trigger: "blur"
          }
        ],
        id: [
          {
            required: true,
            message: "请输入订单号",
            trigger: "blur"
          }
        ]
      },
      options: [],
      CategoryName: [],
      warehouseoptions: [],
      ref_orderoptions: [],
      typeoptions: [],
      refbilltype: ""
    };
  },
  methods: {
    exportExcel() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../vendor/Export2Excel");
        const tHeader = [
          "商品编码",
          "商品条形码",
          "商品名称",
          "商品数量",
          "商品单位",
          "创建时间"
        ];
        // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "production_code",
          "bar_code",
          "production_name",
          "amount",
          "size",
          "create_at"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        const list = this.tableData; //把data里的tableData存到list
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "商品明细");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    //退货
    goodsrejectedbtn() {
      let _self = this;

      let formData = new FormData();
      formData.append("billId", _self.tabledataDetail.id);

      _self.axios
        .post(
          _self.ApiurlStorehouse + "/inventory/getTranfersWarehouseCodeInfo",
          formData,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if (response.data.errcode == "0") {
            let formData = new FormData();
            formData.append(
              "warehouse_code",
              response.data.data.data.entryWarehouseCode
            ); // 仓库编码
            formData.append(
              "warehouse_name",
              response.data.data.data.entryWarehouseName
            ); //仓库名称
            formData.append("type ", "6");
            formData.append(
              "ref_order_code",
              response.data.data.data.ref_order_code
            );
            formData.append(
              "ref_order_type",
              response.data.data.data.ref_order_type
            );
            formData.append("entryWarehouseCode", "");
            formData.append("entryWarehouseName", "");
            formData.append("userId", _self.id);
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
                  var listbox = {
                    list: _self.Returngoods,
                    id: response.data.data.orderId
                  };

                  _self.axios
                    .post(
                      _self.ApiurlStorehouse + "/inventory/updateReturnBills",
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
                        _self.$message({
                          message: "退货单录入成功，请到库存管理页面审核",
                          type: "success"
                        });
                      } else if (response.data.errcode == "1002") {
                        _self.$message.error(response.data.msg);
                      } else {
                        _self.$message.error("退货单录入失败，请重试");
                      }
                    })
                    .catch(function(error) {
                      _self.$message.error("响应时间过长，请重试");
                    });
                } else {
                  _self.$message.error("生成入库失败，请刷新重试");
                }
              })
              .catch(function(error) {
                _self.$message.error("响应时间过长，请重试");
              });
          } else {
            _self.$message.error("获取出库仓库信息失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    handleSelectionChange(val) {
      let _self = this;
      for (var i = 0; i < val.length; i++) {
        var amountnum = val[i].amount - val[i].actual_amount;
        var newdata = {
          production_code: val[i].production_code,
          production_name: val[i].production_name,
          amount: amountnum,
          size: val[i].size
        };
        if (_self.Returngoods == "") {
          _self.Returngoods.push(newdata);
        } else {
          for (var j = 0; j < _self.Returngoods.length; j++) {
            if (
              val[i].production_code != _self.Returngoods[j].production_code
            ) {
              _self.Returngoods.push(newdata);
            }
          }
        }
      }
    },
    //实际入库数
    actualamountchange(index) {
      let _self = this;
      if (
        _self.tableData[index].actual_amount > _self.tableData[index].amount
      ) {
        _self.$message({
          message: "实际入库数不能大于商品数量哦！",
          type: "warning"
        });
        return false;
      }
      let formData = new FormData();
      formData.append("billId", _self.tableData[index].bill_id);
      formData.append("productionCode", _self.tableData[index].production_code);
      formData.append("amount", _self.tableData[index].actual_amount);
      if (_self.tableData[index].margin_cause == null) {
        formData.append("marginCause", "");
      } else {
        formData.append("marginCause", _self.tableData[index].margin_cause);
      }

      _self.axios
        .post(
          _self.ApiurlStorehouse + "/inventory/updateInvBillDetailActualamount",
          formData,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if (response.data.errcode == "0") {
            _self.$message({
              message: "编辑成功",
              type: "success"
            });
          } else {
            _self.$message.error("编辑失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },

    submitForm(formName) {
      let _self = this;
      _self.$refs[formName].validate(valid => {
        if (valid) {
          let formData = new FormData();
          formData.append("warehouse_code", _self.ruleForm.warehouse_code);
          formData.append("warehouse_name", _self.ruleForm.warehouse_name);
          formData.append("type ", _self.ruleForm.type);
          formData.append("ref_order_code", _self.ruleForm.ref_order_code);
          formData.append("ref_order_type", _self.ruleForm.ref_order_type);
          formData.append("checked_by", _self.ruleForm.checked_by);
          formData.append("id", _self.ruleForm.id);
          formData.append("supplierCode", "");
          _self.axios
            .post(
              _self.ApiurlStorehouse + "/inventory/updateInvBills",
              formData,
              {
                // 单独配置
                withCredentials: false
              }
            )
            .then(response => {
              if (response.data.errcode == "0") {
                _self.$message({
                  message: "编辑成功",
                  type: "success"
                });
              } else {
                _self.$message.error("编辑失败，请刷新重试");
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    wareblur(vId) {
      let _self = this;

      _self.ruleForm.warehouse_name = vId.warehouse_name;
      _self.ruleForm.warehouse_code = vId.warehouse_code;
    },
    getcategory() {
      let _self = this;
      _self.tabledataDetailtab = _self.tabledataDetail;
      _self.ruleForm.warehouse_code = _self.tabledataDetail.warehouse_code;
      _self.ruleForm.warehouse_name = _self.tabledataDetail.warehouse_name;
      _self.ruleForm.type = _self.tabledataDetail.type;
      _self.ruleForm.ref_order_code = _self.tabledataDetail.ref_order_code;
      _self.ruleForm.ref_order_type = _self.tabledataDetail.ref_order_type;
      _self.ruleForm.checked_by = _self.tabledataDetail.checked_by;
      _self.ruleForm.id = _self.tabledataDetail.id;
      _self.ruleForm.comments = _self.tabledataDetail.comments;
      _self.ruleForm.providerName = _self.tabledataDetail.supplier_name;
    },
    //获取条码信息
    gettabledate() {
      let _self = this;
      let formData = new FormData();
      formData.append("orderId", _self.tabledataDetail.id);
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
            _self.allnum = response.data.data.totalCount;
            _self.tableData = response.data.data.list;
          } else {
            _self.$message.error("获取列表失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("获取列表时间过长，请重试");
        });
    },
    //仓单类型加载
    gettypeoptions() {
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
            _self.ref_orderoptions = response.data.data.list;
          } else {
            _self.$message.error("获取仓单类型失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("仓单类型时间过长，请重试");
        });
    },
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
    //仓库编码
    getwarehouseoptions() {
      let _self = this;
      let formData = new FormData();
      formData.append("state", "1");
      _self.axios
        .post(
          _self.ApiurlStorehouse + "/inventory/chooseWarehouseList",
          formData,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if (response.data.errcode == "0") {
            _self.warehouseoptions = response.data.data.list;
          } else {
            _self.$message.error("获取仓库失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("仓库响应时间过长，请重试");
        });
    },
    Allocationdetails() {
      let _self = this;
      if (_self.tabledataDetail.ref_bill_type == "tranfer.out") {
        var types = 1;
      } else if (_self.tabledataDetail.ref_bill_type == "tranfer.in") {
        var types = 2;
      }
      let formData = new FormData();
      formData.append("userId", _self.id);
      formData.append("billId", _self.tabledataDetail.id);
      formData.append("type", types);
      _self.axios
        .post(
          _self.ApiurlStorehouse + "/inventory/tranferOutDetail",
          formData,
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
              _self.refbilltype = response.data.data.list.ref_bill_type;
            }
          } else {
            console.log("获取调库详情失败");
          }
        })
        .catch(function(error) {
          _self.$message.error("仓库响应时间过长，请重试");
        });
    }
  },
  created: function() {
    this.tabledataDetail = JSON.parse(this.$route.query.tabledataDetail);
    console.log("this.tabledataDetail", this.tabledataDetail);

    let _self = this;
    _self.getcategory();
    _self.gettypeoptions();
    _self.getreforderoptions();
    _self.getwarehouseoptions();
    _self.gettabledate();
    if (this.tabledataDetail.type == "调库") {
      _self.Allocationdetails();
    }
  }
};
</script>

<style>
.app-contion {
  margin: 0.625rem;
}

.f-s {
  font-size: 1rem;
}

.mar-increased {
  margin: 1.25rem 1.25rem 0 0;
}

.footer-increased {
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 12.5rem;
  right: 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.btnbox-increased {
  margin: 0.9375rem;
}

.wids {
  width: 25%;
  margin-left: 10%;
}

.keyinput {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: 0;
  padding: 0 15px;
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
}

.stockstyle span {
  display: inline-block;
  margin: 0 0.9375rem;
  color: #008800;
}
</style>
