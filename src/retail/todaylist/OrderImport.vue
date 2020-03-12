<template>
  <div class="app-contion">


    <div class="file-box" style="float: right;margin: 10px 0;">
      <input type="file" ref="referenceUploads" class='file-btn' @change="importf(this)" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
      批量导入
    </div>
    <!--startprint-->
    <el-table :data="tableData" border :height="tableHeight" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="order_code" label="订单号">
      </el-table-column>
      <el-table-column prop="order_date" label="订单时间">
      </el-table-column>
      <el-table-column prop="order_source" label="订单来源">
      </el-table-column>
      <el-table-column prop="production_code" label="产品编码">
      </el-table-column>
      <el-table-column prop="production_bar_code" label="产品条形码">
      </el-table-column>
      <el-table-column prop="production_name" label="产品名称">
      </el-table-column>
      <el-table-column prop="quantity" label="数量">
      </el-table-column>
      <el-table-column prop="price" label="价格">
      </el-table-column>
      <el-table-column prop="total_amount" label="订单金额">
      </el-table-column>
      <el-table-column prop="actual_amount" label="实际金额">
      </el-table-column>
      <el-table-column prop="way_bill_amount" label="运费">
      </el-table-column>
      <el-table-column prop="packing_fee_amount" label="包装费">
      </el-table-column>
      <el-table-column prop="discount_type" label="折扣类型">
      </el-table-column>
      <el-table-column prop="discount_amount" label="折扣金额">
      </el-table-column>
      <el-table-column prop="pay_code" label="支付流水号">
      </el-table-column>
    </el-table>

    <el-dialog title="错误提示" :visible.sync="ErrTableVisible" width="60%">
      <el-table :data="addNewGoodserr" :height="350" border>
      <!--  <el-table-column prop="orderCode" label="订单号">
        </el-table-column> -->
        <el-table-column prop="productionName" label="商品名称">
        </el-table-column>
        <el-table-column prop="barCode" label="商品条码">
        </el-table-column>
        <el-table-column prop="storageAmount" label="库存量">
        </el-table-column>
        <el-table-column prop="msg" label="错误提示">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="ErrTableVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <div style="width: 100%;text-align: center;">
      <el-button type="success" @click='consolidation' class='Inventorystyle' :loading='isloading'>提交并生成</el-button>
    </div>

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
        shopcode: state => state.userinfo.shopcode,
        shopname: state => state.ShopName.shopName,
      })
    },
    data() {
      return {
        activeName: 'first',
        tableDataimport: [],
        tableData: [],
        addNewGoodserr: [],
        multipleSelection: [],
        tableHeight: window.innerHeight - 195,
        currentPage: '',
        ErrTableVisible: false,
        total: '',
        isloading: false
      };
    },
    methods: {


      consolidation() {
        let _self = this;

        if (_self.multipleSelection == '') {
          _self.$message({
            message: '您还没有选择要生成的订单',
            type: 'warning'
          });
          return false;
        }
        _self.isloading = true;
        _self.$confirm('正在提交生成中, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          var listbox = {
            list: _self.multipleSelection,
            shop_code: _self.shopcode,
            userId: _self.id,
            shop_name: _self.shopname
          }
          _self.axios.post(_self.ApiUrls + '/orders/orderImport', {
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
              this.$message({

                message: '生成成功',
                type: 'success'
              });
              _self.isloading = false;
              _self.tableData = [];
            } else {
              _self.isloading = false;
              _self.addNewGoodserr = response.data.data.storageModels
              _self.ErrTableVisible = true;

            }
          }).catch(function(error) {
            _self.isloading = false;
            _self.$message.error('保存响应时间过长，请重试');
          });
        }).catch(() => {
          _self.isloading = false;
          _self.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(val)
      },
      //批量导入
      formatDates(numb, format) {
        const time = new Date((numb - 1) * 24 * 3600000 + 1)
        time.setYear(time.getFullYear() - 70)
        const year = time.getFullYear() + ''
        const month = time.getMonth() + 1 + ''
        const date = time.getDate() - 1 + ''
        if (format && format.length === 1) {
          return year + format + month + format + date
        }
        return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
      },
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

            // excel 数据再处理

            let arr = []

            outdata.map(v => {

              let obj = {}
              obj.order_code = v.订单号
              obj.order_date = v.订单时间
              obj.order_source = v.订单来源
              obj.production_code = v.产品编码
              obj.production_bar_code = v.产品条形码
              obj.production_name = v.产品名称
              obj.quantity = v.数量
              obj.price = v.价格
              obj.total_amount = v.订单金额
              obj.actual_amount = v.实际金额
              obj.way_bill_amount = v.运费
              obj.packing_fee_amount = v.包装费
              obj.discount_type = v.折扣类型
              obj.discount_amount = v.折扣金额
              obj.pay_code = v.支付流水号

               if (obj.discount_type != undefined) {
                obj.discount_type = 'promotion';
              }
              arr.push(obj)

              obj.order_date = _this.formatDates(obj.order_date, '/')
              if (obj.order_code == undefined || obj.order_date == undefined || obj.order_source == undefined || obj.production_bar_code == undefined || obj.production_name ==
                undefined ||
                obj.quantity == undefined || obj.price == undefined || obj.total_amount == undefined || obj.actual_amount ==
                undefined || obj.pay_code == undefined||obj.order_date == 'NaN/NaN/NaN') {

                var newdata = {
                  orderCode: obj.order_code,
                  productionName: obj.production_name,
                  barCode: obj.production_bar_code,
                  msg: '该订单信息填写不完整，请您完善信息'
                }
                _this.addNewGoodserr.push(newdata);
                _this.ErrTableVisible = true;
                _this.$refs.referenceUploads.value = null
                return false
              }
            })
            _this.accountList = [...arr];
            for (var i = 0; i < _this.accountList.length; i++) {
              if (_this.accountList[i].way_bill_amount == undefined) {
                _this.accountList[i].way_bill_amount = '0';
              }
              if (_this.accountList[i].packing_fee_amount == undefined) {
                _this.accountList[i].packing_fee_amount = '0';
              }
              if (_this.accountList[i].discount_type == undefined) {
                _this.accountList[i].discount_type = '';
              }

              if (_this.accountList[i].discount_amount == undefined) {
                _this.accountList[i].discount_amount = '0';
              }
              if (_this.accountList[i].production_code == undefined) {
                _this.accountList[i].production_code = '';
              }
              if (_this.accountList[i].order_date == 'NaN/NaN/NaN') {
                _this.accountList[i].order_date = '';
              }
              if (_this.accountList[i].order_code != undefined && _this.accountList[i].order_date != undefined &&
                _this.accountList[i].order_source != undefined &&
                _this.accountList[i].production_code != undefined && _this.accountList[i].production_bar_code !=
                undefined && _this.accountList[i].production_name !=
                undefined &&
                _this.accountList[i].quantity != undefined && _this.accountList[i].price != undefined && _this.accountList[
                  i].total_amount != undefined && _this.accountList[i].actual_amount !=
                undefined && _this.accountList[i].pay_code != undefined&&_this.accountList[i].order_date != 'NaN/NaN/NaN'&&_this.accountList[i].order_date != '') {
                _this.tableData = _this.accountList;
              } else {
                _this.tableData = [];
                _this.$refs.referenceUploads.value = null
                return false
              }
            }
            _this.$refs.referenceUploads.value = null
            console.log(_this.accountList)
            console.log(_this.tableData)
          }

          reader.readAsArrayBuffer(f);

        }

        if (rABS) {

          reader.readAsArrayBuffer(f);
        } else {

          reader.readAsBinaryString(f);
        }

      },

    },
    created: function() {
      let _self = this;


    }
  }
</script>

<style>
  .churustle {
    position: relative;
    padding: 2.925rem 0.625rem 0.625rem 0.625rem;
  }

  .churustlebtn {
    position: absolute;
    right: 0.625rem;
    top: 0.3125rem;
  }

  .app-contion {
    margin: 0.625rem;
  }

  .stock-header {
    margin: 5px 0;

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

  .stock-labels {
    font-size: 0.875rem;
    margin-left: 0.625rem;
    display: inline-block;
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

  .stock-tiao {
    margin-top: 0.6375rem;
    width: 7%;

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

  .tabsnew .el-tabs__item {
    height: 2.5rem !important;
    line-height: 2.5rem !important;
  }

  .Inventorystyle {

    width: 20%;
    margin-top: 0.9375rem;
  }
</style>
