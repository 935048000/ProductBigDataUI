<template>
  <div class="app-contion">
    <!-- 表单提交 -->
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm formstyle">
      <el-form-item label="电话号码" prop="phone">
        <el-input type="text" v-model="ruleForm.phone" style='width: 50%;'></el-input>
        <i class="el-icon-circle-close icon-size" @click="resetphone"></i>
      </el-form-item>
      <el-form-item label="姓名" prop="money">
        <el-input type="text" v-model="ruleForm.name" style='width: 50%;'></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">查询</el-button>
        <el-button type="warning" @click="allsubmitForm">全部</el-button>
      </el-form-item>
    </el-form>
    <div  class="allformstyle">
      <div>
        储蓄卡总充值：<span>10元</span>
      </div>
      <div>
        总消费：<span>10元</span>
      </div>
      <div>
        总余额：<span>10元</span>
      </div>
      <div>
        核对：<span>10元</span>
      </div>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" v-loading="loading" border  :height="tableHeight">
      <el-table-column prop="memStoredValue.tel" label="电话号码">
      </el-table-column>
      <el-table-column prop="memStoredValue.name" label="姓名">
      </el-table-column>
      <el-table-column prop="credit" label="累计充值">
      </el-table-column>
      <el-table-column prop="createAt" label="累计消费">
      </el-table-column>
      <el-table-column prop="doUserMark" label="当前余额">
      </el-table-column>
         <el-table-column prop="note" label="核对">
      </el-table-column>
       <el-table-column prop="note" label="加入会员日期">
      </el-table-column>
    </el-table>
    <!--  -->

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

          phone: '', //电话
          name: '', //名字

        },
        loading: false,
        tableHeight: window.innerHeight - 360,
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
        formNames: '' //获取table内容
      };
    },
    methods: {
      //获取用户姓名
      GetAName(name) {
        let _self = this;
        let formData = new FormData();
        formData.append('phone', name);
        _self.axios.post(_self.ApiUrlMember + '/mem/stored/getmeminfo', formData, {
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
          var moneys = Number(_self.ruleForm.money) * 100
          let formDatas = new FormData();
          formDatas.append('phone', _self.ruleForm.phone);
          formDatas.append('addfee', moneys);
          formDatas.append('douser', _self.username);
          formDatas.append('reason', _self.ruleForm.reason);
          _self.axios.post(_self.ApiUrlMember + '/mem/stored/addbalance', formDatas, {
            // 单独配置
            withCredentials: false
          }).then(response => {
            if (response.data.errcode = '0') {

              var newdate = {
                memStoredValue: {
                  tel: _self.ruleForm.phone,
                  name: _self.ruleForm.name
                },
                credit: _self.ruleForm.money,
                createAt: response.data.data.flowinfo.createAt,
                doUserMark: _self.username,
                note:_self.ruleForm.reason
              }
              //头部追加
              _self.tableData.unshift(newdate)
              _self.$message({
                type: 'success',
                message: '充值成功!'
              });
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

      //重置
      allsubmitForm() {

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
  .allformstyle{
    display: flex;
    margin: 0.9375rem;
    font-size: 0.875rem;
  }
  .allformstyle div{
    margin: 0 1.25rem;
  }
    .allformstyle div span{
      color: red;
    }
</style>
