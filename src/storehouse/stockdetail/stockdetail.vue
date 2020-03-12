<template>
  <div class="app-contion_stock">
    <el-row class="mar-increased">
      <el-form size="mini" :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"
        style='margin: 0;width: auto;padding: 0;border: 0;'>
        <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="仓库编码" prop="warehouse_code">
              <el-select v-model="ruleForm.warehouse_code" :multiple='false' filterable allow-create
                default-first-option placeholder="请选择仓库编码" style='width: 100%;' @change="wareblur">
                <el-option v-for="item in warehouseoptions" :key="item.warehouse_name" :label="item.warehouse_code"
                  :value="item">
                </el-option>
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
            <el-form-item height='30' label="仓单类型" prop="type">
              <el-select v-model="ruleForm.type" :multiple='false' filterable allow-create default-first-option
                placeholder="请选择仓单类型" style='width: 100%;' @change="cangdan" disabled>
                <el-option v-for="item in ref_orderoptions" :key="item.code" :label="item.value" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="关联单据号" prop="ref_order_code">
              <el-input v-model="ruleForm.ref_order_code" placeholder="请输入关联单据号"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="单据类型" prop="ref_order_type">
              <el-select v-model="ruleForm.ref_order_type" :multiple='false' filterable allow-create
                default-first-option placeholder="请选择关联单据类型" style='width: 100%;' @change="refwareblur">
                <el-option v-for="item in typeoptions" :key="item.code" :label="item.value" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="供应商名称">
              <el-select v-model="ruleForm.providerName" :multiple='false' filterable allow-create default-first-option
                placeholder="请选择供应商名称" style='width: 100%;' @change="providerchange">
                <el-option v-for="item in options4" :key="item.supplier_name" :label="item.supplier_name" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="备注" prop="comments">
              <el-input v-model="ruleForm.comments" placeholder="请输入备注"></el-input>
            </el-form-item>
          </div>
        </el-col>
      <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="金额" >
               <span>{{totalPay}}</span>
            </el-form-item>
          </div>
        </el-col>

        <!-- <el-col :span="12">
					<div class="grid-content bg-purple f-s">
						<el-form-item label="扫描条形码" >
							<el-input v-model="ruleForm.barCode" placeholder="请扫描扫描条形码"></el-input>
						</el-form-item>
					</div>
				</el-col> -->
        <el-col :span="13">
          <div class="grid-content bg-purple f-s footer-increased">
            <el-form-item class='btnbox-increased'>
              <el-button type="primary" @click="submitForm('ruleForm')" class='wids'>保存</el-button>
              <el-button @click="resetForm('ruleForm')" class='wids'>重置</el-button>
            </el-form-item>
          </div>
        </el-col>
      </el-form>
    </el-row>
    <el-row>
      <div>
        <div class="file-box" style="float: right;">
          <input type="file" ref="referenceUploads" id="input-file" class='file-btn' @change="importf(this)" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
          导入
        </div>
        <div class="grid-content bg-purple" style="display: flex;margin-left: 0.625rem;">
          <span style="font-size: 0.875rem;margin-right: 8px">扫描条形码:</span>
          <form  @submit.prevent action="#" style="width: 40%;margin-left: 0.625rem;">
            <input v-model="barCode" placeholder="请扫描扫描条形码" style="font-size: 0.875rem;" type="serch" @keypress="searchGoods"
              class='keyinput' ref="inputVal">
          </form>
        </div>

      </div>
      <div style="float: right;font-size: 0.875rem;">总件数：<span style="color: red;">{{allnum}}</span></div>


      <el-table :data="tableData" style="width: 100%;margin-top: 0.625rem;" :height="tableHeight" border>
        <!-- <el-table-column prop="production_code" label="商品编码">
        </el-table-column> -->
        <el-table-column prop="bar_code" label="商品条码">
        </el-table-column>
        <el-table-column prop="production_name" label="商品名称">
        </el-table-column>
        <el-table-column prop="cost_price" label="成本价">
          <template slot-scope="scope">
            <el-input v-model="scope.row.cost_price" placeholder="请输入成本价"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="商品数量">
          <template slot-scope="scope">
            <el-input v-model="scope.row.amount" placeholder="请输入数量" @blur="amountchange(scope.$index, scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="size" label="商品单位">
        </el-table-column>
        <el-table-column prop="specification" label="商品规格">
        </el-table-column>
      <el-table-column  label="金额">
           <template slot-scope="scope">
             {{scope.row.amount*scope.row.cost_price}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <el-dialog title="警告" :visible.sync="Errorprompt" width="60%">
      <el-table :data="Errorprompttable" border style="width: 100%" :height="400" >
        <el-table-column prop="productionName" label="商品名称">
        </el-table-column>
        <el-table-column prop="barCode" label="商品条码">
        </el-table-column>
        <el-table-column prop="storageAmount" label="库存量">
        </el-table-column>
        <el-table-column prop="msg" label="原因">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="Errorprompt = false">确 定</el-button>
      </span>
    </el-dialog>
<el-dialog title="警告" :visible.sync="Errorprompt2" width="60%">
      <el-table :data="Errorprompttable2" border style="width: 100%" :height="400" >
       <!-- <el-table-column prop="productionName" label="商品名称">
        </el-table-column> -->
        <el-table-column prop="barCode" label="商品条码">
        </el-table-column>
        <el-table-column prop="storageAmount" label="库存量">
        </el-table-column>
        <el-table-column prop="msg" label="原因">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="Errorprompt2 = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    mapState
  } from 'vuex';
  export default {
    computed: {
      ...mapState({
        username: state => state.userinfo.account,
        token: state => state.userinfo.token,
        id: state => state.userinfo.id,
        shopcode: state => state.userinfo.shopcode
      })
    },
    watch:{
     tableData: function(newV,oldV){
       newV.forEach(element => { 
         console.log(parseInt(element.amount*element.cost_price), 'parseInt(element.amount*element.cost_price)');
         
         this.totalPay += parseInt(element.amount*element.cost_price)
         console.log(this.totalPay,element.amount*element.cost_price);
         
       });
     }
    },
    data() {
      return {
        totalPay: 0,
        tableHeight: window.innerHeight - 480,
        tableData: [],
        tabledateBox: [],
        Errorprompt: false,
        Errorprompttable2: [],
        Errorprompt2: false,
        Errorprompttable: [],
        ruleForm: {
          warehouse_code: '',
          warehouse_name: '',
          type: '',
          ref_order_code: '',
          ref_order_type: '',
          kunman: '',
          id: '',
          comments: '',
          providerName: ''
        },
        barCode: '',
        allnum: 0, //总件数
        rules: {
          warehouse_code: [{
              required: true,
              message: '请输入仓库编码',
              trigger: 'change'
            },

          ],
          warehouse_name: [

            {
              required: true,
              message: '请选择或输入仓库名称',
              trigger: 'change'
            }
          ],
          type: [{
            required: true,
            message: '请输入仓单类型',
            trigger: 'change'
          }],
          ref_order_code: [{
            required: true,
            message: '请输入关联单据号',
            trigger: 'blur'
          }, ],
          ref_order_type: [{
            required: true,
            message: '请输入关联单据类型',
            trigger: 'change'
          }, ],
          checked_by: [{
            required: true,
            message: '请输入审核人',
            trigger: 'blur'
          }, ],
          id: [{
            required: true,
            message: '请输入订单号',
            trigger: 'blur'
          }, ],

        },
        options: [],
        CategoryName: [],
        warehouseoptions: [],
        ref_orderoptions: [],
        typeoptions: [],
        refordertype: '',
        kuname: '',
        tablesfeature: [],
        options4: [],
        providerCode: '',
        level: ''
      };
    },
    methods: {
      providerchange(Vid) {
        let _self = this;
        _self.ruleForm.providerName = Vid.supplier_name
        _self.providerCode = Vid.supplier_code
      },
      //选择供应商
      Supplierchange() {
        let _self = this;
        let formData3 = new FormData();
        formData3.append('pageNum', '1');
        formData3.append('pageSize', '1000');
        _self.axios.post(_self.ApiurlStorehouse + '/productManagement/getSupplierList', formData3, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode = '0') {
            _self.options4 = response.data.data.data.list

          } else {
            _self.$message.error('供应商找不到啦');
          }
        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试3');
        });
      },
      cangdan(Vid) {
        let _self = this;
        console.log(Vid)
        _self.kuname = Vid.code
        _self.ruleForm.type = Vid.value
      },
      importf(obj) {
        let _this = this;
        let inputDOM = this.$refs.inputer; // 通过DOM取文件数据

        this.file = event.currentTarget.files[0];
        console.log(this.file.name)
        var rABS = false; //是否将文件读取为二进制字符串
        console.log(_this.$refs.referenceUploads.value)
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
            var XLSX = require('xlsx');
            if (rABS) {
              wb = XLSX.read(btoa(fixdata(binary)), { //手动转化
                type: 'base64'
              });
            } else {
              wb = XLSX.read(binary, {

                type: 'binary'

              });
            }
            // outdata就是你想要的东西 excel导入的数据
            outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
            console.log(outdata)
            // excel 数据再处理

            let arr = []
            outdata.map(v => {
              let obj = {}
              obj.barCode = v.商品条码
              obj.amount = v.商品数量
              obj.cost = v.成本价
              arr.push(obj)

            })
            _this.accountList = [...arr];
            // _this.tablesfeature = _this.accountList
            console.log(_this.accountList)

            for (var i = 0; i < _this.accountList.length; i++) {
              if (_this.accountList[i].cost == undefined) {
                _this.accountList[i].cost = 0
              }
              if (_this.tablesfeature == '') {
                console.log(_this.tablesfeature)
                _this.tablesfeature.push(_this.accountList[i])
              } else {
                console.log(_this.tablesfeature)
                let existence = false;
                for (var j = 0; j < _this.tablesfeature.length; j++) {
                  if (_this.tablesfeature[j].barCode == _this.accountList[i].barCode) {
                    _this.tablesfeature[j].amount += _this.accountList[i].amount;
                    console.log(_this.accountList[i].amount)
                    console.log(_this.tablesfeature[j].amount)
                    existence = true;
                    break;
                  }

                }
                console.log(_this.tablesfeature)
                if (existence != true) {
                  _this.tablesfeature.push(_this.accountList[i])
                }

              }

            }
            console.log(_this.tablesfeature)
            var list = {
              list: _this.tablesfeature
            }

            _this.axios.post(_this.ApiurlStorehouse + '/inventory/getTheInformationAccordingToTheBarCode', {
              jsonData: list
            }, {
              // 单独配置
              withCredentials: false
            }, {
              headers: {
                'Content-Type': 'application/json;charsetset=UTF-8'
              }
            }).then(response => {

              if (response.data.errcode == '0') {
                console.log(response)
                  _this.allnum = 0;
                // _this.tableData = response.data.data.list
                 _this.tablesfeature = [];
                for(var i = 0; i < _this.tableData.length; i++){
                  _this.allnum += Number(_this.tableData[i].amount)
                }
                                if (_this.tableData == '') {
                                  for (var i = 0; i < response.data.data.list.length; i++) {
                                    _this.tableData.push(response.data.data.list[i])
                                    _this.allnum += Number(response.data.data.list[i].amount)
                                  }
                                } else {

                                  for (var i = 0; i < response.data.data.list.length; i++) {
                                    let existences = false;
                                    for (var j = 0; j < _this.tableData.length; j++) {
                                      if (response.data.data.list[i].bar_code == _this.tableData[j].bar_code) {
                                        _this.tableData[j].amount += Number(response.data.data.list[i].amount)
                                        existences = true;
                                        break;
                                      }

                                    }
                                    if (existences == false) {
                                      _this.tableData.push(response.data.data.list[i])
                                      // _this.allnum += Number(response.data.data.list[i].amount)
                                    }
                                    _this.allnum += Number(response.data.data.list[i].amount)
                                  }

                                }
                _this.$refs.referenceUploads.value = null
              } else {
                 _this.Errorprompttable2=response.data.data.msgList
                _this.Errorprompt2 =true;
                 _this.$refs.referenceUploads.value = null
                  _this.tablesfeature = [];
                // _this.$message.error(response.data.errmsg);
              }
            }).catch(function(error) {
              _this.$message.error('保存响应时间过长，请重试');

            });
          }
          reader.readAsArrayBuffer(f);

        }
        if (rABS) {

          reader.readAsArrayBuffer(f);

        } else {

          reader.readAsBinaryString(f);

        }
      },
      //验证
      InventoryVerification() {
        let _self = this;
        for (var i = 0; i < _self.tableData.length; i++) {
          if (_self.tableData[i].cost == null || _self.tableData[i].cost == undefined || _self.tableData[i].cost == '') {
            _self.tableData[i].cost = 0;
          }
        }
        var listbox = {
          list: _self.tableData,
          warehouse_code: _self.ruleForm.warehouse_code,
        }
        _self.axios.post(_self.ApiurlStorehouse + '/inventory/inventoryVerification', {
          jsonData: listbox
        }, {
          // 单独配置
          withCredentials: false
        }, {
          headers: {
            'Content-Type': 'application/json;charsetset=UTF-8'
          }
        }).then(response => {

          if (response.data.errcode == '0') {

          } else {

            _self.Errorprompt = true;
            return false
          }
        }).catch(function(error) {
          _self.$message.error('保存响应时间过长，请重试');

        });
      },

      searchGoods(event) {

        let _self = this;
        let newdate = {};

        if (event.keyCode == 13) {
          event.preventDefault(); //禁止默认事件（默认是换行）
          let formData = new FormData();
          // formData.append('orderId', _self.$route.query.tabledataDetail.id);
          formData.append('barCode', _self.barCode);

          _self.axios.post(_self.ApiurlStorehouse + '/inventory/entryProductionDetail', formData, {
            // 单独配置
            withCredentials: false
          }).then(response => {
            if (response.data.errcode == '0') {
              _self.allnum = Number(_self.allnum) + 1
              var costs = response.data.data.list.cost
              if (costs == null || costs == '') {
                costs = 0
              }
              newdate = {
                amount: 1,
                bill_id: _self.$route.query.tabledataDetail.id,
                create_at: response.data.data.list.create_at,
                production_code: response.data.data.list.code,
                production_name: response.data.data.list.name,
                size: response.data.data.list.unit,
                specification: response.data.data.list.specification,
                bar_code: response.data.data.list.bar_code,
                cost_price: costs
              }

              let existence = false;
              for (var i = 0; i < _self.tableData.length; i++) {
                if (_self.tableData[i].production_code == newdate.production_code) {
                  _self.tableData[i].amount += 1;
                  existence = true;
                  break;
                }
              }
              if (existence != true) {
                _self.tableData.push(newdate)
              }

              _self.$nextTick(function() {
                //DOM 更新了
                _self.$refs.inputVal.focus()
              })
              _self.$message({
                message: '录入成功',
                type: 'success'
              });
              _self.barCode = '';

            } else {
              _self.$message.error(response.data.errmsg);
            }
          }).catch(function(error) {
            _self.$message.error('录入响应时间过长，请重试');

          });

        }
      },
      submitForm(formName) {
        let _self = this;
        let newdate = {};
        if (_self.ruleForm.type == '出库') {
          _self.kuname = '2'
        } else if (_self.ruleForm.type == '入库') {
          _self.kuname = '1'
        } else if (_self.ruleForm.type == '其他入库') {
          _self.kuname = '3'
        } else if (_self.ruleForm.type == '其他出库') {
          _self.kuname = '4'
        } else if (_self.ruleForm.type == '调库') {
          _self.kuname = '5'
        } else if (_self.ruleForm.type == '调拨退货') {
          _self.kuname = '6'
        } else if (_self.ruleForm.type == '退货') {
          _self.kuname = '7'
        }

        if (_self.ruleForm.ref_order_type == '采购单号') {
          _self.refordertype = '1'
        } else if (_self.ruleForm.ref_order_type == '销售单号') {
          _self.refordertype = '2'
        } else if (_self.ruleForm.ref_order_type == '合同号') {
          _self.refordertype = '3'
        } else if (_self.ruleForm.ref_order_type == '调拨单') {
          _self.refordertype = '4'
        }
        console.log(_self.ruleForm.type)
        if (_self.level == '1') {
          if (_self.ruleForm.providerName == '' || _self.providerCode == '') {
            _self.$message({
              message: '您还没有添加供应商哦！',
              type: 'warning'
            });
            return false;
          }
        }

        if (_self.ruleForm.type == '出库' || _self.ruleForm.type == '其他出库' || _self.ruleForm.type == '退货') {
          var listbox = {
            list: _self.tableData,
            warehouse_code: _self.ruleForm.warehouse_code,
          }

          _self.axios.post(_self.ApiurlStorehouse + '/inventory/inventoryVerification', {
            jsonData: listbox
          }, {
            // 单独配置
            withCredentials: false
          }, {
            headers: {
              'Content-Type': 'application/json;charsetset=UTF-8'
            }
          }).then(response => {

            if (response.data.errcode == '0') {
              _self.$refs[formName].validate((valid) => {
                if (valid) {

                  if (_self.ruleForm.comments == null || _self.ruleForm.comments == undefined) {
                    var comments1 = ''
                  } else {
                    var comments1 = _self.ruleForm.comments
                  }
                  var tableData2 = [];
                  for (var i = 0; i < _self.tableData.length; i++) {
                    newdate = {
                      amount: _self.tableData[i].amount,
                      bill_id: _self.tableData[i].id,
                      create_at: _self.tableData[i].create_at,
                      production_code: _self.tableData[i].production_code,
                      production_name: _self.tableData[i].production_name,
                      size: _self.tableData[i].size,
                      specification: _self.tableData[i].specification,
                      bar_code: _self.tableData[i].bar_code,
                      cost: _self.tableData[i].cost_price
                    }
                    tableData2.push(newdate)
                  }

                  var listbox = {
                    list: tableData2,
                    warehouse_code: _self.ruleForm.warehouse_code,
                    warehouse_name: _self.ruleForm.warehouse_name,
                    type: _self.kuname,
                    ref_order_code: _self.ruleForm.ref_order_code,
                    ref_order_type: _self.refordertype,
                    id: _self.ruleForm.id,
                    comments: comments1,
                    supplierCode: _self.providerCode
                  }
                  _self.axios.post(_self.ApiurlStorehouse + '/inventory/updateInvBills', {
                    jsonData: listbox
                  }, {
                    // 单独配置
                    withCredentials: false
                  }, {
                    headers: {
                      'Content-Type': 'application/json;charsetset=UTF-8'
                    }
                  }).then(response => {

                    if (response.data.errcode == '0') {
                      _self.$message({
                        message: '保存成功',
                        type: 'success'
                      });
                      _self.$router.push({
                        path: '/stock',

                      })
                      _self.refordertype = ''
                    } else {

                      _self.$notify({
                        title: '警告',
                        message: response.data.errmsg,
                        type: 'warning',
                        duration: 0
                      });
                    }
                  }).catch(function(error) {
                    _self.$message.error('保存响应时间过长，请重试');

                  });
                } else {
                  console.log('error submit!!');
                  return false;
                }
              });
            } else {
              _self.Errorprompttable = response.data.data.msgList
              _self.Errorprompt = true;
              return false
            }
          }).catch(function(error) {
            _self.$message.error('保存响应时间过长，请重试');

          });
        } else {
          _self.$refs[formName].validate((valid) => {
            if (valid) {

              if (_self.ruleForm.comments == null || _self.ruleForm.comments == undefined) {
                var comments1 = ''
              } else {
                var comments1 = _self.ruleForm.comments
              }
              var tableData2 = [];
              for (var i = 0; i < _self.tableData.length; i++) {
                newdate = {
                  amount: _self.tableData[i].amount,
                  bill_id: _self.tableData[i].id,
                  create_at: _self.tableData[i].create_at,
                  production_code: _self.tableData[i].production_code,
                  production_name: _self.tableData[i].production_name,
                  size: _self.tableData[i].size,
                  specification: _self.tableData[i].specification,
                  bar_code: _self.tableData[i].bar_code,
                  cost: _self.tableData[i].cost_price
                }
                tableData2.push(newdate)
              }
              var listbox = {
                list: tableData2,
                warehouse_code: _self.ruleForm.warehouse_code,
                warehouse_name: _self.ruleForm.warehouse_name,
                type: _self.kuname,
                ref_order_code: _self.ruleForm.ref_order_code,
                ref_order_type: _self.refordertype,
                id: _self.ruleForm.id,
                comments: comments1,
                supplierCode: _self.providerCode
              }
              _self.axios.post(_self.ApiurlStorehouse + '/inventory/updateInvBills', {
                jsonData: listbox
              }, {
                // 单独配置
                withCredentials: false
              }, {
                headers: {
                  'Content-Type': 'application/json;charsetset=UTF-8'
                }
              }).then(response => {

                if (response.data.errcode == '0') {
                  _self.$message({
                    message: '保存成功',
                    type: 'success'
                  });
                  _self.$router.push({
                    path: '/stock',

                  })
                  _self.refordertype = ''
                } else {

                  _self.$notify({
                    title: '警告',
                    message: response.data.errmsg,
                    type: 'warning',
                    duration: 0
                  });
                }
              }).catch(function(error) {
                _self.$message.error('保存响应时间过长，请重试');

              });
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        }

      },
      resetForm(formName) {
        this.tableData = [];
        this.allnum = 0;
        this.tablesfeature = [];
        this.accountList = [];
      },
      wareblur(vId) {
        let _self = this;
        console.log(vId)
        _self.ruleForm.warehouse_name = vId.warehouse_name
        _self.ruleForm.warehouse_code = vId.warehouse_code
        _self.level = vId.level
      },
      refwareblur(vId) {
        let _self = this;
        _self.refordertype = vId.code
      },
      getcategory() {
        let _self = this;
        //console.log(JSON.stringify(_self.$route.query.tabledataDetail))
        _self.ruleForm.warehouse_code = _self.$route.query.tabledataDetail.warehouse_code
        _self.ruleForm.warehouse_name = _self.$route.query.tabledataDetail.warehouse_name
        _self.ruleForm.type = _self.$route.query.tabledataDetail.type
        _self.ruleForm.ref_order_code = _self.$route.query.tabledataDetail.ref_order_code
        _self.ruleForm.ref_order_type = _self.$route.query.tabledataDetail.ref_order_type
        _self.ruleForm.checked_by = _self.$route.query.tabledataDetail.checked_by
        _self.ruleForm.id = _self.$route.query.tabledataDetail.id
        _self.ruleForm.comments = _self.$route.query.tabledataDetail.comments
        _self.ruleForm.providerName = _self.$route.query.tabledataDetail.supplier_name
        _self.providerCode = _self.$route.query.tabledataDetail.supplier_code
      },
      //获取条码信息
      gettabledate() {

        let _self = this;
        let formData = new FormData();
        formData.append('orderId', _self.$route.query.tabledataDetail.id);
        _self.axios.post(_self.ApiurlStorehouse + '/inventory/getInvBillDetailProductionDetailLists', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode == '0') {
            _self.tabledateBox = response.data.data.list
            _self.tableData = _self.tabledateBox
            console.log(_self.tableData)
            _self.allnum = response.data.data.totalCount
          } else {
            _self.$message.error('获取列表失败，请刷新重试');
          }
        }).catch(function(error) {
          _self.$message.error('获取列表时间过长，请重试');

        });

      },
      //删除
      handleDelete(index, row) {
        let _self = this;
        _self.allnum = _self.allnum - _self.tableData[index].amount
        _self.tableData.splice(index, 1);

      },
      amountchange(index) {
        let _self = this;
        _self.allnum = 0;
        for (var i = 0; i < _self.tableData.length; i++) {
          _self.allnum = _self.allnum + Number(_self.tableData[i].amount)

        }
      },
      //仓单类型加载
      gettypeoptions() {
        let _self = this;
        let formData = new FormData();
        formData.append('state', '1');
        _self.axios.post(_self.ApiurlStorehouse + '/inventory/chooseWarehouseTypeList', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode == '0') {
            _self.ref_orderoptions = response.data.data.list
          } else {
            _self.$message.error('获取仓单类型失败，请刷新重试');
          }
        }).catch(function(error) {
          _self.$message.error('仓单类型时间过长，请重试');

        });
      },
      //关联单据类型
      getreforderoptions() {
        let _self = this;
        let formData = new FormData();
        formData.append('state', '2');
        _self.axios.post(_self.ApiurlStorehouse + '/inventory/chooseWarehouseTypeList', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode == '0') {
            _self.typeoptions = response.data.data.list
          } else {
            _self.$message.error('获取仓单类型失败，请刷新重试');
          }
        }).catch(function(error) {
          _self.$message.error('仓单类型时间过长，请重试');

        });
      },
      //仓库编码
      getwarehouseoptions() {
        let _self = this;
        let formData = new FormData();
        formData.append('userId', _self.id);
        _self.axios.post(_self.ApiurlStorehouse + '/inventory/choouseTransferOut', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode == '0') {

            _self.warehouseoptions = response.data.data.list
          } else {
            _self.$message.error('获取仓库失败，请刷新重试');
          }
        }).catch(function(error) {
          _self.$message.error('仓库响应时间过长，请重试');

        });

      },
      //获取仓库等级
      getwarehouselevel() {
        let _self = this;
        let formData = new FormData();
        formData.append('warehouseCode', _self.$route.query.tabledataDetail.warehouse_code);
        _self.axios.post(_self.ApiurlStorehouse + '/inventory/findByWarehouse', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode == '0') {
            _self.level = response.data.data.data.level
          } else {
            _self.$message.error('获取仓库等级失败，请刷新重试');
          }
        }).catch(function(error) {
          _self.$message.error('仓库响应时间过长，请重试');

        });

      }
    },
    created: function() {
      let _self = this;
      _self.getcategory();
      _self.gettypeoptions();
      _self.getreforderoptions();
      _self.getwarehouseoptions();
      _self.gettabledate();
      _self.Supplierchange();
      _self.getwarehouselevel();
    }
  }
</script>

<style lang='less'>
  .app-contion_stock {
    margin: 0.625rem;
    .el-col-12{
      height: 40px;;
    }

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
    transition: .1s;
    font-weight: 500;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    padding: 7px 15px;
    font-size: 14px;
    border-radius: 4px;

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
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
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
    height: 28px!important;
    line-height: 28px!important;
    outline: 0;
    padding: 0 15px;
    -webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    width: 100%;
  }

</style>
