<template>
  <div class="app-contion">
    <span style="font-size: 0.9375rem;">消费金额：</span>
    <input-box v-bind:input-show="inputShow">
    </input-box>
    <div id="calculatorbox">
      <!--显示框-->
      <btn-list>
        <div @click="inputValue('1')" class=" btn-30 btn-radius">1</div>
        <div @click="inputValue('2')" class=" btn-30 btn-radius">2</div>
        <div @click="inputValue('3')" class=" btn-30 btn-radius">3</div>
        <div @click="backValue()" class="btn-30 btn-radius color-red font-14">←</div>
        <div @click="inputValue('4')" class=" btn-30 btn-radius">4</div>
        <div @click="inputValue('5')" class=" btn-30 btn-radius">5</div>
        <div @click="inputValue('6')" class=" btn-30 btn-radius">6</div>
        <div @click="inputValue('7')" class=" btn-30 btn-radius">7</div>
        <div @click="inputValue('8')" class=" btn-30 btn-radius">8</div>
        <div @click="inputValue('9')" class=" btn-30 btn-radius">9</div>
        <div @click="inputValue('0')" class="btn-30 btn-radius">0</div>
        <div @click="inputValue('10')" class="btn-30 btn-radius">10</div>
        <div @click="inputValue('20')" class="btn-30 btn-radius">20</div>
        <div @click="inputValue('50')" class="btn-30 btn-radius">50</div>
        <div @click="inputValue('.')" class="btn-30 btn-radius">.</div>
        <div @click="clearValue()" class="btn-30 btn-radius color-red ">C</div>
      </btn-list>
    </div>
    <div>
      <p class="poststyle">请选择支付方式：</p>
      <el-button class="retail-btn" type="danger" @click="DiscountBtn">折扣</el-button>
      <el-button class="retail-btn" type="warning" @click="MemberPayment">会员支付</el-button>
      <el-button class="retail-btn" type="success" @click="MobilePayment">移动支付</el-button>
    </div>
    <!-- 会员支付弹框 -->
    <el-dialog title="会员支付" :visible.sync="dialogVisible" width="50%">
      <form @submit.prevent action="#">
        <input v-model="moneycode" placeholder="请输入付款码" ref="inputVal" type="serch" @keypress="searchGoods" class="keyinput">
      </form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="searchMembership" :loading='cashloading'>确 定</el-button>
      </span>
    </el-dialog>
    <!-- 移动支付弹框 -->
    <el-dialog title="移动支付" :visible.sync="dialogVisible2" width="50%">
      <form @submit.prevent action="#">
        <input v-model="mobilecode" placeholder="请输入付款码" ref="inputVal2" type="serch" @keypress="mobilesearch" class="keyinput">
      </form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>

      </span>
    </el-dialog>
    <!-- 折扣 -->
    <el-dialog title="折扣" :visible.sync="dialogDiscount" width="50%">
      <div style='margin-bottom:60px'>
        <span :class="{'border-color':clicked3==index}" class="spans" v-for="(item,index) in discountplay" :key="item.value"
          @click="changedisxount(index)">{{item.code}}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDiscount = false">取 消</el-button>
        <el-button type="primary" @click="discountUp">确 定</el-button>
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
        shopcode: state => state.userinfo.shopcode,
        typename: state => state.ShopName.shopName,
      })
    },
    data() {
      return {
        inputShow: {
          value: ''
        },
        dialogVisible: false,
        dialogDiscount: false,
        dialogVisible2: false,
        moneycode: '',
        mobilecode: '',
        orderId: '',
        phone: '',
        clicked3: -1,
        discountplay: [],
        codename: '',
        cashloading: false,
        unionids: ''
      }
    },
    components: {
      'input-box': {
        props: ['inputShow'],
        computed: {
          value: function() {
            return this.inputShow.value
          }
        },
        template: '<input id="input-box" type="text" size="21" maxlength="21" class="inputboxstly" v-model="value" readonly="readonly">'
      },
      'btn-list': {
        template: '<div id="btn-list"><slot></slot></div>'
      }
    },
    methods: {
      MobilePayment() {
        let _self = this;
        _self.dialogVisible2 = true;
        _self.$nextTick(function() {
          //DOM 更新了
          _self.$refs.inputVal2.focus()
        })
      },
      mobilesearch(event) {
        let _self = this;

        if (event.keyCode == 13) {
          event.preventDefault(); //禁止默认事件（默认是换行）
          _self.mobilecode = event.target.value
          if (_self.mobilecode == '' || _self.mobilecode == undefined) {
            _self.$message({
              message: '您还没有输入支付码',
              type: 'warning'
            });
            return false;
          }
          if (_self.inputShow.value == '' || _self.inputShow.value == undefined) {
            _self.$message({
              message: '您还没有输入金额',
              type: 'warning'
            });
            return false;
          }
          var moneys = Number(_self.inputShow.value) * 100;
          moneys = parseInt(moneys);
          let formData = new FormData();
          formData.append('userId', _self.id);
          formData.append('shopCode', _self.shopcode);
          formData.append('payment', _self.inputShow.value);
          _self.axios.post(_self.ApiUrls + '/buyer/diningHallGenerateOderCode', formData, {
            // 单独配置
            withCredentials: false
          }).then(response => {
            if (response.data.errcode == '0') {
              _self.orderId = response.data.data.orderCode
              _self.payments(_self.orderId)
            } else {
              _self.$message.error('创建订单失败，请刷新重试');
            }
          }).catch(function(error) {
            _self.$message.error('响应时间过长，请重试');
          });
        }
      },
      paymentSussecc(openId) {
        let _self = this;
        let formData = new FormData();
        formData.append('openId', openId);
        //发送请求
        _self.axios.post(_self.ApiUrls + '/buyer/paymentSusseccUpdateOpenIdToUser', formData, {
          // 单独配置
          withCredentials: false
        }).then(
          response => {

          }).catch(function(error) {
          console.log('openId响应失败')
        });
      },
      payments(orderid) {
        let _self = this;
        if (_self.inputShow.value == '' || _self.inputShow.value == undefined) {
          _self.$message({
            message: '您还没有输入金额',
            type: 'warning'
          });
          return false;
        }
        var moneys = Number(_self.inputShow.value) * 100;
        moneys = parseInt(moneys);
        if (Number(_self.mobilecode.slice(0, 2)) <= 15) {
          let formData = new FormData();
          formData.append('auth_code', _self.mobilecode);
          formData.append('total_fee', moneys);
          formData.append('orderid', orderid);
          formData.append('shop_name', _self.shopcode);
          //发送请求
          _self.axios.post(_self.realmphp + 'paymv2.php', formData, {
            // 单独配置
            withCredentials: false
          }).then(response => {
            if (response.data.coupon_fee == undefined) {
              var couponfee = 0;
            } else {
              var couponfee = Number(response.data.coupon_fee);
            }
            var cashfeeall = Number(response.data.cash_fee) + couponfee;

            if (response.data.result_code == 'SUCCESS' && response.data.return_code ==
              'SUCCESS' &&
              response.data.return_msg ==
              'OK' && response.data.total_fee == moneys && response.data.trade_state ==
              'SUCCESS' &&
              cashfeeall ==
              moneys && response.data.fee_type == 'CNY') {

              var openId = response.data.openid;
              _self.paymentSussecc(openId);

              _self.$message({
                type: 'success',
                message: '付款成功，请前往今日订单查看'
              });
              _self.dialogVisible2 = false;

              if (response.data.out_trade_no == undefined || response.data.out_trade_no == '' ||
                response.data.out_trade_no == null) {
                console.log('payCode为：' + response.data.out_trade_no)
              } else {
                let formData2 = new FormData();
                formData2.append('state', 1);
                formData2.append('payCode', response.data.out_trade_no);
                formData2.append('orderCode', orderid);
                formData2.append('payFeed', '成功');
                formData2.append('source', '微信');
                formData2.append('payAmount', _self.inputShow.value);
                formData2.append('userKey', openId);
                formData2.append('shopCode', _self.shopcode);
                //发送请求
                _self.axios.post(_self.ApiUrls + '/buyer/writeOrderPayTrace', formData2, {
                  // 单独配置
                  withCredentials: false
                }).then(response => {

                  if (response.data.errcode == '0') {
                    var serialNumber = response.data.data.serialNumber;
                    _self.inputShow.value = '';
                    _self.mobilecode = '';
                  } else {
                    _self.$message.error('写入今日订单失败');
                  }

                }).catch(function(error) {
                  _self.$message.error('响应时间过长，请重试');
                });
              }


            } else {
              var errcodedes = response.data.err_code_des;

              // 打印开始验证
              let formDatas = new FormData();
              formDatas.append('shopCode', _self.shopcode);
              formDatas.append('orderCode', orderid);
              _self.axios.post(_self.ApiUrls + '/pay/VerifyPay', formDatas, {
                // 单独配置
                withCredentials: false
              }).then(response => {

                if (response.data.data.result.coupon_fee == undefined) {
                  var couponfee1 = 0;
                } else {
                  var couponfee1 = Number(response.data.data.result.coupon_fee);
                }
                var cashfeeall1 = Number(response.data.data.result.cash_fee) + couponfee1;

                if (response.data.data.result.trade_state == 'SUCCESS' && response.data.data
                  .result.result_code ==
                  'SUCCESS' && response.data.data.result.return_code == 'SUCCESS' &&
                  cashfeeall1 ==
                  moneys && response.data.data.result.total_fee == moneys && response.data.data
                  .result
                  .fee_type ==
                  'CNY') {

                  _self.$message({
                    message: '该订单已付款,请核对',
                    type: 'success'
                  });
                  _self.inputShow.value = '';
                  _self.mobilecode = '';
                  _self.dialogVisible2 = false;
                } else {

                  if (errcodedes == '' || errcodedes == undefined || errcodedes == null) {
                    _self.$alert('订单未付款,请选择现金或者移动支付', '异常提示', {
                      confirmButtonText: '确定',

                    });
                    _self.dialogVisible2 = false;

                  } else {
                    _self.$alert(errcodedes + ' , ' + '该订单未支付成功', '异常提示', {
                      confirmButtonText: '确定',

                    });
                    _self.dialogVisible2 = false;
                  }
                }
              }).catch(function(error) {
                _self.$message.error('响应时间过长，请重试');
              });

              let formData = new FormData();
              formData.append('orderCode ', orderid);
              formData.append('payCode ', response.data.out_trade_no);
              formData.append('payBarCode', _self.mobilecode);
              formData.append('api', 'weixinbydc/paymv2.php');
              formData.append('result', response.data.err_code_des);
              _self.axios.post(_self.ApiUrls + '/pay/payApitrace', formData, {
                // 单独配置
                withCredentials: false
              }).then(response => {

              }).catch(function(error) {
                _self.$message.error('记录支付异常没有响应');
              });

              if (response.data.out_trade_no == undefined || response.data.out_trade_no == '' ||
                response.data.out_trade_no == null) {
                console.log('payCode为：' + response.data.out_trade_no)
              } else {
                let formDatafail = new FormData();
                formDatafail.append('state', 0);
                formDatafail.append('payCode', response.data.out_trade_no);
                formDatafail.append('orderCode', orderid);
                formDatafail.append('payFeed', '失败');
                formDatafail.append('source', '微信');
                formDatafail.append('payAmount', _self.inputShow.value);
                formDatafail.append('userKey', '');
                formDatafail.append('shopCode', _self.shopcode);
                //发送请求
                _self.axios.post(_self.ApiUrls + '/buyer/writeOrderPayTrace', formDatafail, {
                  // 单独配置
                  withCredentials: false
                }).then(response => {
                  _self.inputShow.value = '';
                  _self.mobilecode = '';
                }).catch(function(error) {
                  _self.$message.error('响应时间过长，请重试');
                });
              }

            }

          }).catch(function(error) {
            _self.$message.error('响应时间过长，请重试');
          });
        } else {
          let formDatas = new FormData();
          formDatas.append('auth_code', _self.mobilecode);
          formDatas.append('total_fee', moneys);
          formDatas.append('orderid', orderid);
          formDatas.append('shop_name', _self.shopcode);
          //发送请求
          _self.axios.post('http://pay.daisha.com.cn/alipay/f2fpay/barpay.php', formDatas, {
            // 单独配置
            withCredentials: false
          }).then(response => {

            if (response.data.code == "10000") {
              if (response.data.out_trade_no == undefined || response.data.out_trade_no == '' ||
                response.data.out_trade_no == null) {
                console.log('payCode为：' + response.data.out_trade_no)
              } else {
                let formData2 = new FormData();
                _self.serialnum = '';
                formData2.append('state', 1);
                formData2.append('payCode', response.data.out_trade_no);
                formData2.append('orderCode', orderid);
                formData2.append('payFeed', '成功');
                formData2.append('source', '支付宝');
                formData2.append('payAmount', _self.inputShow.value);
                formData2.append('userKey', '');
                formData2.append('shopCode', _self.shopcode);
                //发送请求
                _self.axios.post(_self.ApiUrls + '/buyer/writeOrderPayTrace', formData2, {
                  // 单独配置
                  withCredentials: false
                }).then(response => {

                  if (response.data.errcode == '0') {
                    var serialNumber = response.data.data.serialNumber;

                    _self.$message({
                      type: 'success',
                      message: '付款成功，请前往今日订单查看'
                    });
                    _self.inputShow.value = '';
                    _self.mobilecode = '';
                    _self.dialogVisible2 = false;
                  } else {

                    _self.$message.error('写入订单失败，请重试');
                  }

                }).catch(function(error) {
                  _self.$message.error('写入订单响应时间过长，请重试');

                });
              }


            } else {
              var errcodedes = response.data.sub_msg

              let formDatas = new FormData();
              formDatas.append('shopCode', _self.shopcode);
              formDatas.append('orderCode', orderid);
              _self.axios.post(_self.ApiUrls + '/pay/VerifyPay', formDatas, {
                // 单独配置
                withCredentials: false
              }).then(response => {

                if (response.data.data.result.coupon_fee == undefined) {
                  var couponfee1 = 0;
                } else {
                  var couponfee1 = Number(response.data.data.result.coupon_fee);
                }
                var cashfeeall1 = Number(response.data.data.result.cash_fee) + couponfee1;
                if (response.data.data.result.trade_state == 'SUCCESS' && response.data.data
                  .result.result_code ==
                  'SUCCESS' && response.data.data.result.return_code == 'SUCCESS' &&
                  cashfeeall1 ==
                  moneys && response.data.data.result.total_fee == moneys && response.data.data
                  .result
                  .fee_type ==
                  'CNY') {
                  _self.$message({
                    message: '该订单已付款,请核对',
                    type: 'success'
                  });
                  _self.inputShow.value = '';
                  _self.mobilecode = '';
                  _self.dialogVisible2 = false;
                } else {
                  if (errcodedes == '' || errcodedes == undefined || errcodedes == null) {
                    _self.$alert('该订单未支付成功', '异常提示', {
                      confirmButtonText: '确定',

                    });
                    _self.dialogVisible2 = false;
                  } else {
                    _self.$alert(errcodedes + ' , ' + '该订单未支付成功', '异常提示', {
                      confirmButtonText: '确定',

                    });
                    _self.dialogVisible2 = false;
                  }
                }
              }).catch(function(error) {
                _self.$message.error('响应时间过长，请重试');
              });

              let formData = new FormData();
              formData.append('orderCode ', orderid);
              formData.append('payCode ', response.data.out_trade_no);
              formData.append('payBarCode', _self.mobilecode);
              formData.append('api', 'alipay/f2fpay/barpay.php');
              formData.append('result', response.data.sub_msg);
              _self.axios.post(_self.ApiUrls + '/pay/payApitrace', formData, {
                // 单独配置
                withCredentials: false
              }).then(response => {

              }).catch(function(error) {
                _self.$message.error('记录支付异常没有响应');
              });

              if (response.data.out_trade_no == undefined || response.data.out_trade_no == '' ||
                response.data.out_trade_no == null) {
                console.log('payCode为：' + response.data.out_trade_no)
              } else {
                let formDatafail = new FormData();
                formDatafail.append('state', 0);
                formDatafail.append('payCode', response.data.out_trade_no);
                formDatafail.append('orderCode', orderid);
                formDatafail.append('payFeed', '失败');
                formDatafail.append('source', '支付宝');
                formDatafail.append('payAmount', _self.inputShow.value);
                formDatafail.append('userKey', '');
                formDatafail.append('shopCode', _self.shopcode);
                //发送请求
                _self.axios.post(_self.ApiUrls + '/buyer/writeOrderPayTrace', formDatafail, {
                  // 单独配置
                  withCredentials: false
                }).then(response => {
                  _self.inputShow.value = '';
                  _self.mobilecode = '';
                }).catch(function(error) {
                  _self.$message.error('响应时间过长，请重试');
                });
              }

            }

          }).catch(function(error) {
            _self.$message.error('响应时间过长，请重试');
          });
        }
      },
      changedisxount(index) {
        let _self = this;
        _self.clicked3 = index

      },
      discountUp() {
        let _self = this;
        if (_self.clicked3 == -1) {
          _self.$message({
            message: '您还没有选择折扣哦！',
            type: 'warning'
          });
          return false
        }
        if (_self.inputShow.value == '' || _self.inputShow.value == undefined) {
          _self.$message({
            message: '您还没有输入金额',
            type: 'warning'
          });
          return false;
        }
        if (_self.discountplay[_self.clicked3].code == '九折') {
          var codename = '0.9'
        } else if (_self.discountplay[_self.clicked3].code == '八折') {
          var codename = '0.8'
        } else if (_self.discountplay[_self.clicked3].code == '七折') {
          var codename = '0.7'
        } else if (_self.discountplay[_self.clicked3].code == '八点五折') {
          var codename = '0.85'
        } else if (_self.discountplay[_self.clicked3].code == '六折') {
          var codename = '0.6'
        } else if (_self.discountplay[_self.clicked3].code == '五折') {
          var codename = '0.5'
        } else if (_self.discountplay[_self.clicked3].code == '免单') {
          var codename = '0'
        } else if (_self.discountplay[_self.clicked3].code == '二折') {
          var codename = '0.2'
        } else if (_self.discountplay[_self.clicked3].code == '三折') {
          var codename = '0.3'
        } else if (_self.discountplay[_self.clicked3].code == '四折') {
          var codename = '0.4'
        } else if (_self.discountplay[_self.clicked3].code == '一折') {
          var codename = '0.1'
        } else if (_self.discountplay[_self.clicked3].code == '无折扣') {
          var codename = '1'
        }
        var money = _self.inputShow.value
        _self.inputShow.value = Number(money) * Number(codename)
        _self.inputShow.value = _self.inputShow.value.toFixed(2)
        _self.dialogDiscount = false;
        _self.clicked3 = -1;
        console.log(_self.inputShow.value)
      },
      //计算器
      inputValue(param) {

        if (Object.prototype.toString.call(this.inputShow.value) == "[object Number]") { //判断输入框内容是否为数字类型
          this.inputShow.value = ""; //数字类型说明是上个计算结果,清空内容
        }
        var str = '' + this.inputShow.value; //输入内容时,将输入框内容转为字符串类型
        var len = str.length;
        var arr = ["+", "-", "×", "÷"];
        var num = ('' + parseFloat(str.split('').reverse().join(''))).split('').reverse().join(''); //parseInt(str.split('').reverse().join('')))是获取输入框内最后一串数字,再反转回来 ,num为输入框内最后一串数字

        var nlen = num.length;
        if ((num != '0' && param != '.') || (param == '.' && num.indexOf(".") == -1)) { //输入框内最后一串数字不为0时拼接字符串
          if (arr.indexOf(str.charAt(len - 1)) != -1 && arr.indexOf(param) != -1) { //若一开始输入内容为运算符,输入无效
            return;
          }
          this.inputShow.value += param; //拼接输入内容

        } else {
          arr.push("%");
          if (param == '.') { //若num中已有小数点,输入内容为小数点,视为无效
            return;
          } else if (!(arr.indexOf(param) != -1)) { //判断输入框内最后一个字符不为运算符
            console.log(str)
            this.inputShow.value = str.substring(0, str.length) + param; //输入框内最后一串数字为0时,删除0拼接
            console.log(this.inputShow.value)
          }
        }
        // this.sum = parseFloat(this.inputShow.value - this.allmenudate.allPayment).toFixed(2)
      },
      clearValue() { //清空输入框内容
        this.inputShow.value = '';
        this.sum = '0'
      },
      backValue() {
        //删除键,删除单个字符
        var str = this.inputShow.value;
        if (str.length == 1) {
          this.inputShow.value = "";
          this.sum = "0";
        } else {
          this.inputShow.value = str.slice(0, str.length - 1);
          // this.sum = parseFloat(this.inputShow.value - this.allmenudate.allPayment).toFixed(2)
        }
      },
      MemberPayment() {
        let _self = this;
        _self.dialogVisible = true;
        _self.$nextTick(function() {
          //DOM 更新了
          _self.$refs.inputVal.focus()
        })
      },
      searchMembership() {
        let _self = this;
        if (_self.moneycode == '' || _self.moneycode == undefined) {
          _self.$message({
            message: '您还没有输入会员支付码',
            type: 'warning'
          });
          return false;
        }
        if (_self.inputShow.value == '' || _self.inputShow.value == undefined) {
          _self.$message({
            message: '您还没有输入金额',
            type: 'warning'
          });
          return false;
        }
        _self.cashloading = true;
        var moneys = Number(_self.inputShow.value) * 100;
        moneys = parseInt(moneys);
        let formDatas = new FormData();
        formDatas.append('userId', _self.id);
        formDatas.append('shopCode', _self.shopcode);
        formDatas.append('payment', _self.inputShow.value);
        _self.axios.post(_self.ApiUrls + '/buyer/diningHallGenerateOderCode', formDatas, {
          // 单独配置
          withCredentials: false
        }).then(response => {
          if (response.data.errcode == '0') {
            _self.orderId = response.data.data.orderCode

            _self.useverifyterm(response.data.data.orderCode)
          } else {
            _self.cashloading = false;
            _self.$message.error('创建订单失败，请刷新重试');
          }
        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试');
        });

      },
      searchGoods(event) {
        let _self = this;
        if (event.keyCode == 13) {
          event.preventDefault(); //禁止默认事件（默认是换行）
          if (_self.moneycode == '' || _self.moneycode == undefined) {
            _self.$message({
              message: '您还没有输入会员支付码',
              type: 'warning'
            });
            return false;
          }
          if (_self.inputShow.value == '' || _self.inputShow.value == undefined) {
            _self.$message({
              message: '您还没有输入金额',
              type: 'warning'
            });
            return false;
          }
          _self.moneycode = event.target.value

          var moneys2 = Number(_self.inputShow.value)
          var moneys = _self.accMul(moneys2, 100)
          console.log(moneys)
          let formDatas = new FormData();
          formDatas.append('userId', _self.id);
          formDatas.append('shopCode', _self.shopcode);
          formDatas.append('payment', _self.inputShow.value);
          _self.axios.post(_self.ApiUrls + '/buyer/diningHallGenerateOderCode', formDatas, {
            // 单独配置
            withCredentials: false
          }).then(response => {
            if (response.data.errcode == '0') {
              _self.orderId = response.data.data.orderCode

              _self.useverifyterm(response.data.data.orderCode)
            } else {
              _self.cashloading = false;
              _self.$message.error('创建订单失败，请刷新重试');
            }
          }).catch(function(error) {
            _self.$message.error('响应时间过长，请重试');
          });
        }
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
      useverifyterm(orderid) {
        let _self = this;
        var moneys2 = Number(_self.inputShow.value)
      var moneys = _self.accMul(moneys2, 100)
      console.log(moneys)
        let formData = new FormData();
        formData.append('verifycode', _self.moneycode);
        formData.append('fee', moneys);
        formData.append('phone', _self.username);
        formData.append('orderid', orderid);
        formData.append('shopname', _self.typename);
        formData.append('shopcode', _self.shopcode);
        _self.axios.post(_self.ApiUrlMember + '/mem/stored/useverifycode', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {
          if (response.data.errcode == '0' && response.data.data.result_code == 'SUCCESS' && response.data.data.fee ==
            moneys && response.data.data.orderid == orderid && response.data.data.out_trade_no != undefined &&
            response.data.data.out_trade_no != '') {
            _self.phone = response.data.data.phone
            _self.unionids = response.data.data.unionid
            var out_trade_no = response.data.data.out_trade_no
            _self.cashloading = false;
            _self.writeOrderPayTerm(out_trade_no)
          } else {
            var msg = response.data.errmsg;
            let formDatas = new FormData();
            if (response.data.data.out_trade_no == undefined || response.data.data.out_trade_no == null) {
              var outtradeno = ''
            } else {
              var outtradeno = response.data.data.out_trade_no
            }
            formDatas.append('outtradeno', outtradeno);
            formDatas.append('verifycode', _self.moneycode);
            _self.axios.post(_self.ApiUrlMember + '/mem/stored/checkdeal', formDatas, {
              // 单独配置
              withCredentials: false
            }).then(response => {
              if (response.data.errcode == '0' && response.data.data.info.debit == moneys && response.data.data
                .info.verifyCode == _self.moneycode && response.data.data.info.outTradeNo != '' && response.data
                .data.info.outTradeNo != undefined) {

                var out_trade_no = response.data.data.info.outTradeNo
                _self.cashloading = false;
                _self.writeOrderPayTerm(out_trade_no)
              } else {
                _self.$alert(response.data.errmsg + msg, '异常提示', {
                  confirmButtonText: '确定',
                });
                _self.cashloading = false;
                _self.dialogVisible = false;
                _self.moneycode = '';
              }
            }).catch(function(error) {
              _self.$message.error('支付验证响应时间过长，请重试');
            });

          }
        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试');
        });
      },
      writeOrderPayTerm(out_trade_no) {
        let _self = this;
        let formData2 = new FormData();
        formData2.append('state', 1);
        formData2.append('payCode', out_trade_no);
        formData2.append('orderCode', _self.orderId);
        formData2.append('payFeed', '成功');
        formData2.append('source', '会员');
        formData2.append('payAmount', _self.inputShow.value);
        formData2.append('userKey', _self.unionids);
        formData2.append('shopCode', _self.shopcode);
        //发送请求
        _self.axios.post(_self.ApiUrls + '/buyer/writeOrderPayTrace', formData2, {
          // 单独配置
          withCredentials: false
        }).then(response => {
          if (response.data.errcode == '0') {
            _self.$message({
              message: '恭喜您，支付成功',
              type: 'success'
            });
            _self.dialogVisible = false;
            _self.moneycode = '';
            _self.orderId = '';
            _self.unionids = '';
            _self.inputShow.value = '';
            _self.phone = '';
          } else {
            _self.$message.error('记录失败，请刷新重试');
          }
        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试');
        });
      },
      DiscountBtn() {
        let _self = this;
        _self.dialogDiscount = true

        let formData2 = new FormData();
        formData2.append('code', 'coupon_code_discount');
        formData2.append('shopCode', _self.shopcode);
        _self.axios.post(_self.ApiUrl + '/catering/memberDiscount', formData2).then(response => {
          if (response.data.errcode == '0') {
            _self.discountplay = response.data.data.commentsGroup
            var zhekous = ''
            for (var i = 0; i < response.data.data.commentsGroup.length; i++) {
              if (response.data.data.commentsGroup[i].code == 'discount_90') {
                _self.discountplay[i].code = '九折'
                zhekous = '0.9';
              } else if (response.data.data.commentsGroup[i].code == 'discount_80') {
                _self.discountplay[i].code = '八折'
                zhekous = '0.8';
              } else if (response.data.data.commentsGroup[i].code == 'discount_70') {
                _self.discountplay[i].code = '七折'
                zhekous = '0.7';
              } else if (response.data.data.commentsGroup[i].code == 'discount_85') {
                _self.discountplay[i].code = '八点五折'
                zhekous = '0.85';
              } else if (response.data.data.commentsGroup[i].code == 'discount_60') {
                _self.discountplay[i].code = '六折'
                zhekous = '0.6';
              } else if (response.data.data.commentsGroup[i].code == 'discount_50') {
                _self.discountplay[i].code = '五折'
                zhekous = '0.5';
              } else if (response.data.data.commentsGroup[i].code == 'discount_00') {
                _self.discountplay[i].code = '免单'
                zhekous = '0';
              } else if (response.data.data.commentsGroup[i].code == 'discount_20') {
                _self.discountplay[i].code = '二折'
                zhekous = '0.2';
              } else if (response.data.data.commentsGroup[i].code == 'discount_30') {
                _self.discountplay[i].code = '三折'
                zhekous = '0.3';
              } else if (response.data.data.commentsGroup[i].code == 'discount_40') {
                _self.discountplay[i].code = '四折'
                zhekous = '0.4';
              } else if (response.data.data.commentsGroup[i].code == 'discount_10') {
                _self.discountplay[i].code = '一折'
                zhekous = '1';
              } else if (response.data.data.commentsGroup[i].code == 'discount_100') {
                _self.discountplay[i].code = '无折扣'
                zhekous = '1';
              }
            }
          } else {
            _self.$message.error('加载优惠金额失败，请刷新重试');
          }
        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试');
        });
      }
    },


  }
</script>

<style>
  .poststyle {
    font-size: 0.9375rem;
    margin: 0.825rem 0;

  }

  .border-color {
    border: 2px solid red !important;
  }

  .retail-btn {
    padding: 25px 22px;
    margin: 1.3125rem 0.625rem;
    margin-left: 5.25rem;
  }

  .app-contion {
    margin: 10px;
  }

  /* calculatorbox */
  #calculatorbox {
    width: 70%;
    height: 245px;
    padding: 10px;
    margin-left: 1.25rem;
    margin-top: 1.5625rem;
  }

  .spans {
    padding: 10px;
    display: inline-block;
    border: 2px solid #EAEAEA;
    margin: 5px;
  }

  #calculatorbox #input-box {
    margin: 0;
    width: 100%;
    padding: 9px 5px;
    height: 14px;
    border: 1px solid #e5e5e5;
    border-radius: 3px;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    background: #FFF;
    text-align: right;
    line-height: 14px;
    font-size: 12px;
    font-family: Verdana, Geneva, sans-serif;
    color: #666;
    outline: none;
    text-transform: uppercase;
  }

  #calculatorbox #btn-list {
    width: 100%;
    overflow: hidden;
  }

  #calculatorbox #btn-list .btn-radius {
    border-radius: 2px;
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
    border: 1px solid #e5e5e5;
    background: -webkit-gradient(linear, 0 0, 0 100%, from(#f7f7f7), to(#ebebeb));
    background: -moz-linear-gradient(top, #f7f7f7, #ebebeb);
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=#f7f7f7, endColorstr=#ebebeb, grandientType=1);
    line-height: 29px;
    text-align: center;
    text-shadow: 0px 1px 1px #FFF;
    font-weight: bold;
    font-family: Verdana, Geneva, sans-serif;
    color: #666;
    float: left;
    margin-left: 1%;
    margin-top: 11px;
    font-size: 12px;
    cursor: pointer;
    padding: 10px 0;
  }

  #calculatorbox #btn-list .btn-radius:active {
    background: #ffffff;
  }

  #calculatorbox #btn-list .clear-marginleft {
    margin-left: 0;
  }

  #calculatorbox #btn-list .font-14 {
    font-size: 14px;
  }

  #calculatorbox #btn-list .color-red {
    color: #ff5050
  }

  #calculatorbox #btn-list .color-blue {
    color: #00b4ff
  }

  #calculatorbox #btn-list .btn-30 {
    width: 22%;

  }

  #calculatorbox #btn-list .btn-70 {
    width: 70px;
    height: 1.8125rem;
  }

  .kadianstyle {
    padding: 0.625rem;
    background: #FFFFFF;
  }

  .inputboxstly {
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: none;
    padding: 0 15px;
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    width: 60%;
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
    -webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    width: 100%;
  }
</style>
