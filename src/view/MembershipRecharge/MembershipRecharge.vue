<template>
  <div class="app-contion">
    <!-- 表单提交 -->
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm formstyle">
      <el-form-item label="电话号码" prop="phone">
        <el-input type="text" v-model="ruleForm.phone" style='width: 50%;'></el-input>
        <i class="el-icon-circle-close icon-size" @click="resetphone"></i>
      </el-form-item>
      <el-form-item label="充值金额" prop="money">
        <el-input type="text" v-model="ruleForm.money" style='width: 50%;'></el-input>
      </el-form-item>
      <el-form-item label="充值原因" prop="reason">
        <el-input type="text" v-model="ruleForm.reason" style='width: 50%;'></el-input>
      </el-form-item>
      <!-- <el-form-item label="归属公司" prop="company">
        <el-input type="text" v-model="ruleForm.company" style='width: 50%;'></el-input>
      </el-form-item> -->
     <!-- <el-form-item label="归属公司" prop="company">
      <el-select v-model="ruleForm.company" placeholder="请选择" style='width: 50%;'>
        <el-option v-for="item in AttributionCompany" :key="item.value" :label="item.value"
          :value="item.value">
        </el-option>
      </el-select>
        </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">充值</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button type="success" size="mini" style="float: right;" @click='exportExcel'>导出明细</el-button>
        <div class="file-box" style="float: right;">
          <input type="file" ref="referenceUploads" class='file-btn' @change="importf(this)" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
          批量导入

        </div>


      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="tableData" v-loading="loading" border style="width: 100%" :height="tableHeight">
      <el-table-column prop="tel" label="电话">
      </el-table-column>
      <el-table-column prop="name" label="姓名">
      </el-table-column>
      <el-table-column prop="credit" label="充值金额">
      </el-table-column>
       <el-table-column prop="company" label="归属公司">
      </el-table-column>
      <el-table-column prop="create_at" label="充值时间">
      </el-table-column>
      <el-table-column prop="do_user_mark" label="充值人">
      </el-table-column>
      <el-table-column prop="note" label="充值原因">
      </el-table-column>
      <el-table-column prop="credit_type" label="充值方式">
      </el-table-column>
    </el-table>
    <!--  -->
    <el-row class='allrecordsstyle'>
      <el-col :span="12">
        <div class="grid-content bg-purple" @click="alldata">>>点击刷新充值记录...</div>
      </el-col>
    </el-row>

    <el-dialog title="错误提示" :visible.sync="ErrTableVisible" width="60%">
      <el-table :data="addNewGoodserr" :height="350" border>

        <el-table-column prop="phone" label="手机号">
        </el-table-column>

        <el-table-column prop="errmsg" label="错误提示">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="ErrTableVisible = false">确 定</el-button>
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
    data() {

      return {
        ruleForm: {
          money: '', //钱
          phone: '', //电话
          name: '', //名字
          reason: '', //原因
          company: '' //公司
        },
        AttributionCompany:[],
        loading: false,
        tableHeight: window.innerHeight - 430,
        rules: { //定义规则
          money: [{
            required: true,
            message: '请填写充值金额',
            trigger: 'blur'
          }],
          phone: [{
            required: true,
            message: '请填写电话号码',
            trigger: 'blur'
          }],
          reason: [{
            required: true,
            message: '请填写充值原因',
            trigger: 'blur'
          }],
        },
        tableData: [], //table
        formNames: '', //获取table内容
        addNewGoodserr: [],
        ErrTableVisible: false,
        accountList:[]
      };
    },
    methods: {
         exportExcel() {
        require.ensure([], () => {
          const { export_json_to_excel } = require("../../vendor/Export2Excel");
          const tHeader = [
            "电话",
            "姓名",
            "充值金额",
            "归属公司",
            "充值时间",
            "充值人",
            "充值原因",
            "充值方式"
          ];
          // 上面设置Excel的表格第一行的标题
          const filterVal = [
            "tel",
            "name",
            "credit",
            "company",
            "create_at",
            "do_user_mark",
            "note",
            "credit_type"
          ];
          // 上面的index、nickName、name是tableData里对象的属性
          const list = this.tableData; //把data里的tableData存到list
          const data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, "充值明细");
        });
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]));
      },
      //获取用户姓名
      GetAName(name) {
        let _self = this;
        let formData = new FormData();
        formData.append('phone', name);
        _self.axios.post(_self.ApiUrlMember2 + '/mem/stored/getmeminfo', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {
          if (response.data.errcode == '0') {
            _self.ruleForm.name = response.data.data.meminfo.name
            _self.ElasticFrame();
          } else {
            _self.$message.error(response.data.errmsg);

          }
        }).catch(function(error) {
          _self.$message.error('充值响应时间过长，请重试');
        });
      },
      //弹窗
      ElasticFrame() {
        let _self = this;
        _self.$alert('<p class="psize">电话号码：' + _self.ruleForm.phone + '</p>' + '<p class="psize">充值金额：' +
          _self.ruleForm
          .money + '</p>' + '<p class="psize">顾客姓名：' + _self.ruleForm.name + '</p>' +
          '<p style="color:red;margin-top:15px">确认充值吗？充值后将无法修改。</p>', '充值', {
            showCancelButton: true,
            dangerouslyUseHTMLString: true,
            beforeClose(action, instance, done) {
              if (action == 'confirm') {
                console.log('confirm')
                done()
              } else {
                console.log('cancel')
                done()
              }
            }
          }).then(() => {

          var moneys2 = Number(_self.ruleForm.money)
          var moneys = _self.accMul(moneys2, 100)
          console.log(moneys)
          let formDatas = new FormData();
          formDatas.append('phone', _self.ruleForm.phone);
          formDatas.append('addfee', moneys);
          formDatas.append('douser', _self.username);
          formDatas.append('reason', _self.ruleForm.reason);
          formDatas.append('credittype', '中台充值');
          // if(_self.ruleForm.company==undefined){
          //    formDatas.append('company', '');
          // }else{
          //    formDatas.append('company', _self.ruleForm.company);
          // }
          _self.axios.post(_self.ApiUrlMember2 + '/mem/stored/addbalance', formDatas, {
            // 单独配置
            withCredentials: false
          }).then(response => {
            if (response.data.errcode == '0') {
              // var newdate = {
              //   tel: _self.ruleForm.phone,
              //     name: _self.ruleForm.name,
              //     company:_self.ruleForm.company,
              //     credit: _self.ruleForm.money,
              //   create_at: response.data.data.flowinfo.createAt,
              //   do_user_mark: _self.username,
              //   note: _self.ruleForm.reason,
              //   credit_type: '中台充值'
              // }
              //头部追加
              // _self.tableData.unshift(newdate)
              _self.$message({
                type: 'success',
                message: '充值成功!'
              });
                  _self.alldata();
              //清空表单
              _self.$refs[_self.formNames].resetFields();
            } else {
              _self.$message.error(response.data.errmsg);
            }
          }).catch(function(error) {
            _self.$message.error('充值响应时间过长，请重试');
          });

        }).catch(() => {
          _self.$message({
            type: 'info',
            message: '已取消充值'
          });
        });
      },
         accMul(arg1, arg2) {
        var m = 0,
          s1 = arg1.toString(),
          s2 = arg2.toString();
        try {
          m += s1.split(".")[1].length
        } catch (e) {};
        try {
          m += s2.split(".")[1].length
        } catch (e) {};
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
      },
      getcompany() {
        let _self = this;
        let formData = new FormData();
      formData.append('code', 'company_name');
        formData.append('shopCode', _self.shopcode);
        _self.axios.post(_self.ApiUrl + '/catering/enumerationSorting', formData).then(response => {

          if (response.data.errcode == '0') {
            _self.AttributionCompany = response.data.data.commentsGroup

          } else {
            _self.$message.error('获取公司信息失败');
          }
        }).catch(function(error) {
          _self.$message.error('公司信息响应时间过长，请重试');
        });
      },
      //提交充值
      submitForm(formName) {
        let _self = this;
        _self.formNames = formName
        _self.$refs[formName].validate((valid) => {
          if (valid) {
            _self.GetAName(_self.ruleForm.phone);
          } else {
            return false;
          }
        });
      },
      //批量导入
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

              // obj.productionCode = v.商品编码
              obj.phone = v.手机号
              obj.addfee = v.充值金额
              obj.reason = v.充值原因

              arr.push(obj)

              if (obj.phone == undefined || obj.addfee == undefined || obj.reason == undefined) {
                var newdata = {
                  phone: obj.phone,

                  errmsg: '所填信息不完整，请您完善'
                }
                _this.addNewGoodserr.push(newdata)
                _this.ErrTableVisible = true;
                return false;
              }
              if (obj.company == undefined || obj.company == null) {
                obj.company = '';
              }
              var money = Number(obj.addfee)*100
              money = parseInt(money)
              let formData = new FormData();
              formData.append('phone', obj.phone);
              formData.append('addfee', money);
              formData.append('douser', _this.username);
              formData.append('reason', obj.reason);
              formData.append('credittype', '中台充值');
            //  formData.append('company', obj.company);
              _this.axios.post(_this.ApiUrlMember2 + '/mem/stored/addbalance', formData, {
                // 单独配置
                withCredentials: false
              }).then(response => {
                if (response.data.errcode == '0') {
                  _this.alldata();
                  _this.$refs.referenceUploads.value = null;
                } else {
                  var newdata = {
                    phone: obj.phone,
                    company: obj.company,
                    errmsg: response.data.errmsg
                  }
                  _this.addNewGoodserr.push(newdata)
                  _this.ErrTableVisible = true;
                  _this.$refs.referenceUploads.value = null
                }
              }).catch(function(error) {
                _this.$message.error('响应时间过长，请重试5');

              });




            })

            _this.accountList = [...arr];
              console.log(_this.accountList)
          }

          reader.readAsArrayBuffer(f);

        }

        if (rABS) {

          reader.readAsArrayBuffer(f);
        } else {

          reader.readAsBinaryString(f);
        }

      },
      //获取所有充值信息
      alldata() {
        let _self = this;
        _self.loading = true;
        let formData = new FormData();
        //发送请求
        _self.axios.post(_self.ApiUrlMember2 + '/mem/stored/allcredit', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode = '0') {
            _self.tableData = response.data.data.allcreditlist

            for (var i = 0; i < _self.tableData.length; i++) {
              _self.tableData[i].credit = Number(_self.tableData[i].credit) / 100
            }
            _self.loading = false;
          } else {
            _self.$message.error('获取数据失败');
          }
        }).catch(function(error) {
          _self.$message.error('充值响应时间过长，请重试');
        });
      },
      //重置
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      resetphone() {
        let _self = this;
        _self.ruleForm.phone = '';
        _self.ruleForm.name = '';
      }

    },
    created: function() {
      let _self = this;
      _self.alldata()
      _self.getcompany()
    }
  }
</script>

<style>
  .app-contion {
    margin: 10px;
  }

  .el-card__body {
    font-size: 16px;
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

  .icon-size {
    font-size: 25px;
    display: inline-block;
    vertical-align: middle;
    color: #AAAAAA;
  }

  .allrecordsstyle {
    margin: 0.625rem;
    color: #409EFF;
    cursor: pointer;
  }

  .psize {
    color: #000000;
    margin: 10px 0;
    font-weight: 500;

  }

  .el-table__body-wrapper {
    overflow-x: auto;
    overflow-y: auto;
  }

  .formstyle {
    padding: 0;
    border: none;
    box-shadow: none;
    width: 100%;
    margin: 0;
  }
</style>
