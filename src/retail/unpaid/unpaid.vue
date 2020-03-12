<template>
  <div class="app-contion">

    <el-table :data="tableData" v-loading="loading" border style="width: 100%;" tooltip-effect="dark" :height="tableHeight">

      <el-table-column prop="orderCode" label="订单号">
      </el-table-column>
      <el-table-column label="订单详情">
        <template slot-scope="scope">
          <el-button size="mini" @click="detailmenu(scope.$index, scope.row)">详情</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="reason" label="说明">
      </el-table-column>
      <el-table-column prop="orderState" label="订单状态">
      </el-table-column>
      <el-table-column prop="payAmount" label="订单金额">
      </el-table-column>
      <el-table-column prop="actualAmount" label="实际金额">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="320">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="paymentmodeil(scope.$index, scope.row)" style="margin: 0;">移动</el-button>
          <el-button size="mini" type="success" @click="cash(scope.$index, scope.row)" style="margin: 0;">现金</el-button>
          <el-button size="mini" type="warning" @click="yinlian(scope.$index, scope.row)" style="margin: 0;">银联</el-button>
          <el-button size="mini" type="danger" @click="Memberpayment(scope.$index, scope.row)" style="margin: 0;">会员</el-button>
          <el-button size="mini" @click="yanzheng(scope.$index, scope.row)" style="margin: 0;">验证</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="position: fixed;bottom: 0.625rem;right: 0;">
      <el-pagination background layout="prev, pager, next" :total="total" @current-change="current_change">
      </el-pagination>
    </div>
    <!-- 支付弹框 -->
    <el-dialog title="付款码" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <!-- <el-input v-model="code" placeholder="请输入内容" ref="inputVal" @keypress="searchGoods" type="serch"></el-input> -->
      <form @submit.prevent action="#">
        <input v-model="code" placeholder="请输入付款码" ref="inputVal" type="serch" @keypress="searchGoods" class="keyinput">
      </form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>

      </span>
    </el-dialog>
    <!-- 会员支付 -->
    <el-dialog title="会员付款码" :visible.sync="dialogMember" width="30%">
      <!-- <el-input v-model="code" placeholder="请输入内容" ref="inputVal" @keypress="searchGoods" type="serch"></el-input> -->
      <form @submit.prevent action="#">
        <input v-model="Membercode" placeholder="请输入付款码" ref="inputVal4" type="serch" @keypress="Membersearch" class="keyinput">
      </form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogMember = false">取 消</el-button>

      </span>
    </el-dialog>
    <!--现金-->
    <el-dialog title="请输入已给金额" :visible.sync="moneysum" width="30%" :before-close="handleClose">
      <el-input v-model="moneyinput" placeholder="请输入已给现金" ref="inputVal2" type="serch"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="moneysum = false">取 消</el-button>
        <el-button type="primary" @click="cashup">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="已找金额" :visible.sync="moneysum2" width="30%" :before-close="handleClose">
      <span style="font-size: 50px;">{{sum}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="moneysum2 = false">取 消</el-button>
        <el-button type="primary" @click="payment" :loading='cashloading'>确 定</el-button>
      </span>
    </el-dialog>

    <!-- 详情 -->
    <el-dialog title="详情" :visible.sync="menudetails" width="50%" :before-close="handleClose">
      <el-table :data="tableDatamenu" stripe border class='table-center' :height='280' style="width: 100%">
        <el-table-column prop="name" label="商品名">
        </el-table-column>
        <el-table-column prop="price" label="商品原价">
        </el-table-column>
        <el-table-column prop="promotional_price" label="商品实价">
        </el-table-column>
        <el-table-column prop="order_amount" label="商品数量">
        </el-table-column>
        <el-table-column prop="actual_amount" label="小计">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="menudetails = false">取 消</el-button>

      </span>
    </el-dialog>
    <!-- 银联 -->
    <el-dialog title="银联支付" :visible.sync="Unionpay" width="50%" :before-close="handleClose">
      <p style="margin: 12px 0;">请选择银行卡</p>
      <div class="idcards">
        <span :class="{'border-color':clicked==index}" v-for="(item,index) in UnionPayBox" :key="item.value" @click="UnionPayclick(index)">{{item.value}}</span>
      </div>
      <p style="margin: 12px 0;">应收金额</p>
      <!-- 	<p style="font-size: 40px;color: red;" v-if="moneyzhe!=''">{{moneyzhe}}</p> -->
      <p style="font-size: 40px;color: red;">{{moneyUnionPayBox}}</p>

      <div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="Unionpay = false">取 消</el-button>
        <el-button type="primary" @click="UnionPayclickup" :loading='cashloading'>确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="警告" :visible.sync="Errorprompt" width="60%">
      <el-table :data="Errorprompttable" border style="width: 100%" :height="400">
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
  </div>
</template>

<script>
  import {
    mapState
  } from 'vuex';
  import {
    getLodop,
    needCLodop
  } from '../../vuex/LodopFuncs.js'
  export default {
    data() {
      return {
        Membercode: '',
        dialogMember: false,
        cashloading: false,
        tableData: [],
        dataindex: '',
        pagesize: 10,
        Errorprompt: false,
        Errorprompttable: [],
        currentPage: 1,
        total: 0,
        loading: true,
        dialogVisible: false,
        tableHeight: window.innerHeight - 120,
        code: '',
        moneysum: false,
        Unionpay: false,
        moneysum2: false,
        pays: '',
        nowTime: '',
        moneyinput: '',
        index2: '',
        UnionPayBoxindex: '',
        clicked: -1,
        sum: '',
        goodslist: '',
        UnionPayBox: [],
        keyword: '',
        qrcodes: '',
        tableDatamenu: [],
        menudetails: false,
        shopcodedata: '',
        moneyUnionPayBox: '',
      }
    },
    computed: {
      ...mapState({
        username: state => state.userinfo.account,
        token: state => state.userinfo.token,
        id: state => state.userinfo.id,
        shopcode: state => state.userinfo.shopcode,
        profilesettlement: state => state.ShopName.profile_settlement,
        profilequeuetype: state => state.ShopName.profile_queue_type,
         typename: state => state.ShopName.shopName
      })
    },
    methods: {
      detailmenu(index) {
        let _self = this;
        _self.menudetails = true
        _self.tableDatamenu = _self.tableData[index].odrOrderDetailList
      },
      //银联
      UnionPayclick(index) {
        let _self = this;
        _self.clicked = index;

        _self.UnionPayBoxindex = _self.UnionPayBox[index].value
      },
      //银联
      yinlian(index) {
        let _self = this;
        _self.Unionpay = true;
        _self.index2 = index;
        _self.moneyUnionPayBox = _self.tableData[index].actualAmount

        let formData2 = new FormData();
        formData2.append('code', 'unionpay_type');
        //发送请求
        _self.axios.post(_self.ApiUrl + '/catering/memberDiscount', formData2).then(response => {

          if (response.data.errcode == '0') {
            _self.UnionPayBox = response.data.data.commentsGroup
          } else {
            _self.$message.error('获取银行卡失败，请刷新重试');
          }

        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试');
        });
      },
      UnionPayclickup() {
        let _self = this
        let formData = new FormData();
        var moneys2 = _self.dataindex.payAmount
        _self.cashloading = true;
        var tableList = [];
        var newdatas = {};
        for (var i = 0; i < _self.tableData[_self.index2].odrOrderDetailList.length; i++) {
          newdatas = {
            amount: _self.tableData[_self.index2].odrOrderDetailList[i].order_amount,
            production_code: _self.tableData[_self.index2].odrOrderDetailList[i].production_code,
            production_name: _self.tableData[_self.index2].odrOrderDetailList[i].name,
            size: ''
          }
          tableList.push(newdatas)
        }
        var listbox = {
          list: tableList,
          warehouse_code: _self.shopcodedata,
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
            let formData2 = new FormData();
            formData2.append('state', 1);
            formData2.append('payCode', _self.UnionPayBoxindex);
            formData2.append('orderCode', _self.tableData[_self.index2].orderCode);
            formData2.append('payFeed', '成功');
            formData2.append('source', '银联');
            formData2.append('payAmount', _self.tableData[_self.index2].actualAmount);
            formData2.append('userKey', '');
            formData2.append('shopCode', _self.shopcode);
            //发送请求
            _self.axios.post(_self.ApiUrls + '/buyer/writeOrderPayTrace', formData2, {
              // 单独配置
              withCredentials: false
            }).then(response => {

              if (response.data.errcode == '0') {
                var serialNumber = response.data.data.serialNumber
                _self.$message({
                  type: 'success',
                  message: '付款成功，请前往今日订单查看'
                });
                _self.moneysum2 = false;
                _self.moneysum = false;
                _self.cashloading = false;
                let formData3 = new FormData();
                formData3.append('shopCode', _self.shopcode);
                formData3.append('orderCode', _self.tableData[_self.index2].orderCode);
                formData3.append('serialNumber', serialNumber);
                //发送请求
                _self.axios.post(_self.ApiUrl + '/catering/cashSettlement', formData3).then(response => {

                  if (response.data.errcode == '0') {
                    _self.Unionpay = false;
                    _self.goodslist = response.data.data;
                    var json = _self.goodslist;
                    _self.print(_self.goodslist);
                    //打印结束
                  } else {
                    _self.$message.error('打印菜单加载失败');
                  }
                }).catch(function(error) {
                  _self.$message.error('响应时间过长，请重试');
                });
                _self.getdata();
              } else {
                _self.cashloading = false;
                _self.$message.error('支付失败');
              }

            }).catch(function(error) {
              _self.$message.error('响应时间过长，请重试');
            });
          } else {

            _self.Errorprompttable = response.data.data.msgList
            _self.Errorprompt = true;
            _self.cashloading = false;
            return false
          }
        }).catch(function(error) {
          _self.$message.error('保存响应时间过长，请重试');

        });


      },
      //打印

      print(goodslist) {
        let _self = this;
        var qs = require('qs');
        //结束
        var hPos = 10, //小票上边距
          pageWidth = 580, //小票宽度
          rowHeight = 15, //小票行距
          //获取控件对象
          LODOP = getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'));
        LODOP.PRINT_INIT("");
        //消费小票********************************************************************************************************
        LODOP.SET_PRINT_STYLE("FontSize", 9); //字体大小
        LODOP.ADD_PRINT_TEXT(hPos, 60, pageWidth, rowHeight, goodslist.shop);

        hPos += rowHeight;
        LODOP.ADD_PRINT_TEXT(hPos, 60, pageWidth, rowHeight, '零售收款单');
        hPos += rowHeight;
        LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, "单据日期:");
        LODOP.ADD_PRINT_TEXT(hPos, 60, pageWidth, rowHeight, goodslist.create_at);
        hPos += rowHeight;
        LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, "制单人:");
        LODOP.ADD_PRINT_TEXT(hPos, 60, pageWidth, rowHeight, goodslist.sales);
        hPos += rowHeight;
        LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, "销售单据号:");
        LODOP.ADD_PRINT_TEXT(hPos, 65, pageWidth, rowHeight, goodslist.orderCode);
        hPos += rowHeight;
        LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, "投诉电话:");
        LODOP.ADD_PRINT_TEXT(hPos, 60, pageWidth, rowHeight, goodslist.customer_service_number);
        hPos += rowHeight;
        LODOP.ADD_PRINT_LINE(hPos, 2, hPos, pageWidth, 2, 1);
        hPos += 5;
        LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, "数量");
        LODOP.ADD_PRINT_TEXT(hPos, 40, pageWidth, rowHeight, "订单价");
        LODOP.ADD_PRINT_TEXT(hPos, 90, pageWidth, rowHeight, "实销价");
        LODOP.ADD_PRINT_TEXT(hPos, 140, pageWidth, rowHeight, "折扣率");
        hPos += rowHeight;
        //遍历goodslist的商品数组
        for (var i = 0; i < goodslist.goodsList.length; i++) {

          if (goodslist.goodsList[i].productionName.length < 7) {
            LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, goodslist.goodsList[i].bar_code + goodslist.goodsList[i]
              .productionName);
            hPos += rowHeight;
          } else if (goodslist.goodsList[i].productionName.length > 12 || goodslist.goodsList[i].bar_code.length > 12) {
            LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, goodslist.goodsList[i].bar_code);
            hPos += rowHeight;
            LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, goodslist.goodsList[i].productionName);
            hPos += rowHeight;

          } else {

            LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, goodslist.goodsList[i].bar_code + goodslist.goodsList[i]
              .productionName);
            hPos += rowHeight;
          }
          LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, goodslist.goodsList[i].orderAmount);
          LODOP.ADD_PRINT_TEXT(hPos, 50, pageWidth, rowHeight, goodslist.goodsList[i].payAmount);
          LODOP.ADD_PRINT_TEXT(hPos, 95, pageWidth, rowHeight, goodslist.goodsList[i].actual_amount);
          LODOP.ADD_PRINT_TEXT(hPos, 150, pageWidth, rowHeight, parseInt(goodslist.goodsList[i].discountRate * 100) +
            '%');
          hPos += rowHeight;
        }
        //商品遍历打印完毕,空一行
        hPos += rowHeight;
        LODOP.ADD_PRINT_LINE(hPos, 2, hPos, pageWidth, 2, 1);
        hPos += 5;
        //合计
        LODOP.ADD_PRINT_TEXT(hPos, 70, pageWidth, rowHeight, "合计数量：" + goodslist.totalCount);
        // hPos += rowHeight;
        // LODOP.ADD_PRINT_TEXT(hPos, 70, pageWidth, rowHeight, "合计金额：" + goodslist.orderPayment);
        hPos += rowHeight;
        LODOP.ADD_PRINT_TEXT(hPos, 70, pageWidth, rowHeight, "实销金额：" + goodslist.total);
        hPos += rowHeight;
        LODOP.ADD_PRINT_TEXT(hPos, 70, pageWidth, rowHeight, "抹零金额：" + goodslist.maLing);
        hPos += rowHeight;
        LODOP.ADD_PRINT_LINE(hPos, 2, hPos, pageWidth, 2, 1);
        hPos += 5;
        LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, "本次收款金额：");
        hPos += rowHeight;
        LODOP.ADD_PRINT_TEXT(hPos, 80, pageWidth, rowHeight, goodslist.paymentMethod);

        LODOP.ADD_PRINT_TEXT(hPos, 120, pageWidth, rowHeight, "￥" + goodslist.total);
        hPos += rowHeight;
        LODOP.ADD_PRINT_LINE(hPos, 2, hPos, pageWidth, 2, 1);
        hPos += 5;
        LODOP.ADD_PRINT_TEXT(hPos, 2, pageWidth, rowHeight, (new Date()).toLocaleDateString() + " " + (new Date())
          .toLocaleTimeString())
        hPos += rowHeight;
        LODOP.ADD_PRINT_TEXT(hPos, 25, pageWidth, rowHeight, "谢谢惠顾,欢迎下次光临!");
        hPos += rowHeight;


        //初始化打印页的规格

        LODOP.SET_PRINT_PAGESIZE(3, pageWidth, 45, 2);
        hPos += rowHeight;
        // 厨房小票**************************************************************************************************************
        hPos += rowHeight;
        hPos += rowHeight;
        hPos += rowHeight;
        hPos += rowHeight;
        //添加小票标题文本

        //开始打印
        LODOP.PRINT();
      },
      //验证
      yanzheng(index) {
        let _self = this;

        var moneyse = _self.tableData[index].actualAmount * 100
        moneyse = parseInt(moneyse)
        let formData = new FormData();
        formData.append('shopCode', _self.shopcode);
        formData.append('orderCode', _self.tableData[index].orderCode);
        _self.axios.post(_self.ApiUrls + '/pay/VerifyPay', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {
          if (response.data.data.result.coupon_fee == undefined) {
            var couponfee1 = 0;
          } else {
            var couponfee1 = Number(response.data.data.result.coupon_fee);
          }
          var cashfeeall1 = Number(response.data.data.result.cash_fee) + couponfee1;
          if (response.data.data.result.trade_state == 'SUCCESS' && response.data.data.result.result_code ==
            'SUCCESS' && response.data.data.result.return_code == 'SUCCESS' && cashfeeall1 ==
            moneyse && response.data.data.result.total_fee == moneyse && response.data.data.result.fee_type ==
            'CNY') {
            _self.$message({
              message: '该订单已付款,请核对',
              type: 'success'
            });
            let formData3 = new FormData();
            formData3.append('shopCode', _self.shopcode);
            formData3.append('orderCode', _self.tableData[index].orderCode);
            formData3.append('serialNumber', response.data.data.serialNumber);
            //发送请求
            _self.axios.post(_self.ApiUrl + '/catering/cashSettlement', formData3).then(response => {
              if (response.data.errcode == '0') {
                _self.goodslist = response.data.data
                var json = _self.goodslist

                _self.print(_self.goodslist);
                _self.getdata();
                //打印结束
              } else {
                _self.$message.error('打印菜单丢失了！');
              }
            }).catch(function(error) {
              _self.$message.error('响应时间过长，请重试');
            });

          } else {
            _self.$message({
              message: '订单未付款,请选择现金或者移动支付',
              type: 'error'
            });
            _self.getdata();
          }
        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试');
        });
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
      Memberpayment(index) {
        let _self = this

        _self.dialogMember = true;
        _self.Membercode = '';
        _self.dataindex = _self.tableData[index]
        console.log(_self.dataindex)
        _self.$nextTick(function() {
          //DOM 更新了
          _self.$refs.inputVal4.focus()
        })

      },
      //会员
      Membersearch(event) {
        let _self = this;
        if (event.keyCode == 13) {
          event.preventDefault(); //禁止默认事件（默认是换行）
          _self.Membercode = event.target.value;
          var moneys2 = _self.dataindex.actualAmount
          var moneys = _self.dataindex.actualAmount * 100;
          moneys = parseInt(moneys)
          var tableList = [];
          var newdatas = {};
          for (var i = 0; i < _self.dataindex.odrOrderDetailList.length; i++) {
            newdatas = {
              amount: _self.dataindex.odrOrderDetailList[i].order_amount,
              production_code: _self.dataindex.odrOrderDetailList[i].production_code,
              production_name: _self.dataindex.odrOrderDetailList[i].name,
              size: ''
            }
            tableList.push(newdatas)
          }
          var listbox = {
            list: tableList,
            warehouse_code: _self.shopcodedata,
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
              let formDa = new FormData();
              formDa.append('verifycode', _self.Membercode);
              formDa.append('fee', moneys);
              formDa.append('phone', _self.username);
              formDa.append('orderid', _self.dataindex.orderCode);
              formDa.append('shopname', _self.typename);
              formDa.append('shopcode', _self.shopcode);
              _self.axios.post(_self.ApiUrlMember2 + '/mem/stored/useverifycode', formDa, {
                // 单独配置
                withCredentials: false
              }).then(response => {
                if (response.data.errcode == '0' && response.data.data.result_code == 'SUCCESS' && response.data
                  .data
                  .fee ==
                  moneys && response.data.data.orderid == _self.dataindex.orderCode && response.data.data.out_trade_no !=
                  undefined && response.data.data.out_trade_no != '') {
                  var out_trade_no = response.data.data.out_trade_no
                  let formData2 = new FormData();
                  formData2.append('state', 1);
                  formData2.append('payCode', out_trade_no);
                  formData2.append('orderCode', _self.dataindex.orderCode);
                  formData2.append('payFeed', '成功');
                  formData2.append('source', '会员');
                  formData2.append('payAmount', moneys2);
                  formData2.append('userKey', '');
                  formData2.append('shopCode', _self.shopcode);
                  //发送请求
                  _self.axios.post(_self.ApiUrls + '/buyer/writeOrderPayTrace', formData2, {
                    // 单独配置
                    withCredentials: false
                  }).then(response => {
                    if (response.data.errcode == '0') {

                      var serialNumber = response.data.data.serialNumber
                      _self.$message({
                        type: 'success',
                        message: '付款成功，请前往今日订单查看'
                      });
                      _self.dialogMember = false;
                      let formData3 = new FormData();
                      formData3.append('shopCode', _self.shopcode);
                      formData3.append('orderCode', _self.dataindex.orderCode);
                      formData3.append('serialNumber', serialNumber);
                      //发送请求
                      _self.axios.post(_self.ApiUrl + '/catering/cashSettlement', formData3).then(response => {
                        console.log(response)
                        if (response.data.errcode == '0') {

                          _self.goodslist = response.data.data
                          var json = _self.goodslist
                          //打印
                          _self.print(_self.goodslist);
                          //打印结束
                          _self.getdata();
                        } else {
                          _self.$message.error('打印菜单加载失败');
                          _self.getdata();

                        }

                      }).catch(function(error) {
                        _self.$message.error('响应时间过长，请重试');
                      });
                    } else {

                    }

                  }).catch(function(error) {
                    _self.$message.error('响应时间过长，请重试');
                  });
                } else {
                  var msg = response.data.errmsg;
                  let formDatas = new FormData();
                  if (response.data.data.out_trade_no == undefined || response.data.data.out_trade_no == null) {
                    var outtradeno = ''
                  } else {
                    var outtradeno = response.data.data.out_trade_no
                  }
                  formDatas.append('outtradeno', outtradeno);
                  formDatas.append('verifycode', _self.Membercode);
                  _self.axios.post(_self.ApiUrlMember2 + '/mem/stored/checkdeal', formDatas, {
                    // 单独配置
                    withCredentials: false
                  }).then(response => {
                    if (response.data.errcode == '0' && response.data.data.info.debit == moneys && response
                      .data
                      .data
                      .info.verifyCode == _self.Membercode && response.data.data.info.outTradeNo != '' &&
                      response.data
                      .data.info.outTradeNo != undefined) {
                      var out_trade_no = response.data.data.info.outTradeNo


                      let formData2 = new FormData();
                      formData2.append('state', 1);
                      formData2.append('payCode', out_trade_no);
                      formData2.append('orderCode', _self.dataindex.orderCode);
                      formData2.append('payFeed', '成功');
                      formData2.append('source', '会员');
                      formData2.append('payAmount', moneys2);
                      formData2.append('userKey', '');
                      formData2.append('shopCode', _self.shopcode);
                      //发送请求
                      _self.axios.post(_self.ApiUrls + '/buyer/writeOrderPayTrace', formData2, {
                        // 单独配置
                        withCredentials: false
                      }).then(response => {
                        if (response.data.errcode == '0') {

                          var serialNumber = response.data.data.serialNumber
                          _self.$message({
                            type: 'success',
                            message: '付款成功，请前往今日订单查看'
                          });
                          _self.dialogMember = false;
                          let formData3 = new FormData();
                          formData3.append('shopCode', _self.shopcode);
                          formData3.append('orderCode', _self.dataindex.orderCode);
                          formData3.append('serialNumber', serialNumber);
                          //发送请求
                          _self.axios.post(_self.ApiUrl + '/catering/cashSettlement', formData3).then(
                            response => {
                              console.log(response)
                              if (response.data.errcode == '0') {

                                _self.goodslist = response.data.data
                                var json = _self.goodslist
                                //打印
                                _self.print(_self.goodslist);
                                //打印结束
                                _self.getdata();
                              } else {
                                _self.$message.error('打印菜单加载失败');
                                _self.getdata();
                              }

                            }).catch(function(error) {
                            _self.$message.error('响应时间过长，请重试');
                          });
                        } else {

                        }

                      }).catch(function(error) {
                        _self.$message.error('响应时间过长，请重试');
                      });
                    } else {
                      _self.$alert(response.data.errmsg + msg, '异常提示', {
                        confirmButtonText: '确定',
                      });
                      let formData = new FormData();
                      formData.append('orderCode ', _self.dataindex.orderCode);
                      if (out_trade_no == undefined) {
                        formData.append('payCode ', '');
                      } else {
                        formData.append('payCode ', out_trade_no);
                      }
                      formData.append('payBarCode', _self.Membercode);
                      formData.append('api', '会员');
                      formData.append('result', response.data.errmsg + msg);
                      _self.axios.post(_self.ApiUrls + '/pay/payApitrace', formData, {
                        // 单独配置
                        withCredentials: false
                      }).then(response => {
                        _self.dialogMember = false;
                      }).catch(function(error) {
                        _self.$message.error('记录支付异常没有响应');
                      });

                      _self.getdata();

                      _self.loadingcash = false;
                    }
                  }).catch(function(error) {
                    _self.$message.error('支付验证响应时间过长，请重试');
                  });

                }
              }).catch(function(error) {
                _self.$message.error('响应时间过长，请重试');
              });
            } else {

              _self.Errorprompttable = response.data.data.msgList
              _self.Errorprompt = true;
              return false
            }
          }).catch(function(error) {
            _self.$message.error('保存响应时间过长，请重试');

          });

        }
      },
      searchGoods(event) {

        let _self = this;
        if (event.keyCode == 13) {
          event.preventDefault(); //禁止默认事件（默认是换行）
          _self.keyword = event.target.value;
          console.log(_self.keyword)
          _self.dialogVisible = false

          var moneys2 = _self.dataindex.actualAmount
          var moneys = _self.dataindex.actualAmount * 100;
          moneys = parseInt(moneys)
          var tableList = [];
          var newdatas = {};
          for (var i = 0; i < _self.dataindex.odrOrderDetailList.length; i++) {
            newdatas = {
              amount: _self.dataindex.odrOrderDetailList[i].order_amount,
              production_code: _self.dataindex.odrOrderDetailList[i].production_code,
              production_name: _self.dataindex.odrOrderDetailList[i].name,
              size: ''
            }
            tableList.push(newdatas)
          }
          var listbox = {
            list: tableList,
            warehouse_code: _self.shopcodedata,
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
              if (Number(_self.keyword.slice(0, 2)) <= 15) {
                let formData = new FormData();
                formData.append('auth_code', _self.keyword);
                formData.append('total_fee', moneys);
                formData.append('orderid', _self.dataindex.orderCode);
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
                  if (response.data.result_code == 'SUCCESS' && response.data.return_code == 'SUCCESS' &&
                    response.data
                    .return_msg ==
                    'OK' && response.data.total_fee == moneys && response.data.trade_state == 'SUCCESS' &&
                    cashfeeall ==
                    moneys && response.data.fee_type == 'CNY') {
                    _self.$message({
                      type: 'success',
                      message: '付款成功，请前往今日订单查看'
                    });
                    var openId = response.data.openid;
                    _self.paymentSussecc(openId);
                    if (response.data.out_trade_no == undefined || response.data.out_trade_no == '' || response
                      .data.out_trade_no ==
                      null) {
                      console.log('payCode为：' + response.data.out_trade_no)
                    } else {
                      let formData2 = new FormData();
                      formData2.append('state', 1);
                      formData2.append('payCode', response.data.out_trade_no);
                      formData2.append('orderCode', _self.dataindex.orderCode);
                      formData2.append('payFeed', '成功');
                      formData2.append('source', '微信');
                      formData2.append('payAmount', moneys2);
                      formData2.append('userKey', openId);
                      formData2.append('shopCode', _self.shopcode);
                      //发送请求
                      _self.axios.post(_self.ApiUrls + '/buyer/writeOrderPayTrace', formData2, {
                        // 单独配置
                        withCredentials: false
                      }).then(response => {

                        if (response.data.errcode == '0') {
                          var serialNumber = response.data.data.serialNumber
                          let formData3 = new FormData();
                          formData3.append('shopCode', _self.shopcode);
                          formData3.append('orderCode', _self.dataindex.orderCode);
                          formData3.append('serialNumber', serialNumber);
                          //发送请求
                          _self.axios.post(_self.ApiUrl + '/catering/cashSettlement', formData3).then(
                            response => {

                              if (response.data.errcode == '0') {

                                _self.goodslist = response.data.data
                                var json = _self.goodslist

                                _self.print(_self.goodslist);
                                _self.getdata();
                                //打印结束
                              } else {
                                _self.$message.error('打印菜单丢失了！');
                              }

                            }).catch(function(error) {
                            _self.$message.error('响应时间过长，请重试');
                          });
                        } else {
                          _self.$message.error('订单写入失败');
                        }

                      }).catch(function(error) {
                        _self.$message.error('响应时间过长，请重试');
                      });
                    }

                    _self.getdata();
                  } else {
                    _self.$message.error(response.data.err_code_des + ',' + '支付失败');
                    if (response.data.out_trade_no == undefined || response.data.out_trade_no == '' || response
                      .data.out_trade_no ==
                      null) {
                      console.log('payCode为：' + response.data.out_trade_no)
                    } else {
                      let formData2 = new FormData();
                      formData2.append('state', 0);
                      formData2.append('payCode', response.data.out_trade_no);
                      formData2.append('orderCode', _self.dataindex.orderCode);
                      formData2.append('payFeed', '失败');
                      formData2.append('source', '微信');
                      formData2.append('payAmount', moneys2);
                      //发送请求
                      _self.axios.post(_self.ApiUrls + '/buyer/writeOrderPayTrace', formData2, {
                        // 单独配置
                        withCredentials: false
                      }).then(response => {}).catch(function(error) {
                        _self.$message.error('响应时间过长，请重试');
                      });
                    }

                  }

                }).catch(function(error) {
                  _self.$message.error('响应时间过长，请刷新重试');

                });
              } else {
                let formData = new FormData();
                formData.append('auth_code', _self.keyword);
                formData.append('total_fee', moneys);
                formData.append('orderid', _self.dataindex.orderCode);
                formData.append('shop_name', _self.shopcode)
                //发送请求
                _self.axios.post('http://pay.daisha.com.cn/alipay/f2fpay/barpay.php', formData, {
                  // 单独配置
                  withCredentials: false
                }).then(response => {
                  console.log(response)
                  if (response.data.code == '10000') {
                    _self.$message({
                      type: 'success',
                      message: '付款成功，请前往今日订单查看'
                    });
                    if (response.data.out_trade_no == undefined || response.data.out_trade_no == '' || response
                      .data.out_trade_no ==
                      null) {
                      console.log('payCode为：' + response.data.out_trade_no)
                    } else {
                      let formData2 = new FormData();
                      formData2.append('state', 1);
                      formData2.append('payCode', response.data.out_trade_no);
                      formData2.append('orderCode', _self.dataindex.orderCode);
                      formData2.append('payFeed', '成功');
                      formData2.append('source', '支付宝');
                      formData2.append('payAmount', moneys2);
                      formData2.append('userKey', '');
                      formData2.append('shopCode', _self.shopcode);
                      //发送请求
                      _self.axios.post(_self.ApiUrls + '/buyer/writeOrderPayTrace', formData2, {
                        // 单独配置
                        withCredentials: false
                      }).then(response => {

                        if (response.data.errcode == '0') {
                          var serialNumber = response.data.data.serialNumber

                          let formData3 = new FormData();
                          formData3.append('shopCode', _self.shopcode);
                          formData3.append('orderCode', _self.dataindex.orderCode);
                          formData3.append('serialNumber', serialNumber);
                          //发送请求
                          _self.axios.post(_self.ApiUrl + '/catering/cashSettlement', formData3).then(
                            response => {

                              if (response.data.errcode == '0') {

                                _self.goodslist = response.data.data
                                var json = _self.goodslist
                                _self.print(_self.goodslist);
                                _self.getdata();
                                //打印结束
                              } else {
                                _self.$message.error('打印菜单不存在');
                              }

                            }).catch(function(error) {
                            _self.$message.error('响应时间过长，请重试');
                          });
                        } else {
                          _self.$message.error('写入订单失败哦！');
                        }

                      }).catch(function(error) {
                        _self.$message.error('响应时间过长，请重试');
                      });
                    }

                    _self.getdata();
                  } else {
                    _self.$message.error(response.data.sub_msg + ',' + '支付失败');
                  }

                }).catch(function(error) {
                  _self.$message.error('响应时间过长，请重试哦');
                });
              }

            } else {

              _self.Errorprompttable = response.data.data.msgList
              _self.Errorprompt = true;
              return false
            }
          }).catch(function(error) {
            _self.$message.error('保存响应时间过长，请重试');

          });

        }

      },
      getdata() {
        let _self = this
        let formData = new FormData();
        formData.append('shopCode', _self.shopcode);
        formData.append('pageNum', _self.currentPage);
        formData.append('pageSize', _self.pagesize);
        //发送请求
        _self.axios.post(_self.ApiUrl + '/catering/getShopAllNoPaymentOrder', formData).then(response => {
          if (response.data.errcode == '0') {
            _self.loading = false;
            _self.tableData = response.data.data.data.list;
            _self.total = _self.tableData.length
            for (var i = 0; i < response.data.data.data.list.length; i++) {
              if (response.data.data.data.list[i].orderState == '0') {
                _self.tableData[i].orderState = '未付款'
              } else if (response.data.data.data.list[i].orderState == '1') {
                _self.tableData[i].orderState = '以付款'
              } else if (response.data.data.data.list[i].orderState == '2') {
                _self.tableData[i].orderState = '已删除'
              } else if (response.data.data.data.list[i].orderState == '3') {
                _self.tableData[i].orderState = '已失效'
              } else if (response.data.data.data.list[i].orderState == '4') {
                _self.tableData[i].orderState = '已传菜'
              } else if (response.data.data.data.list[i].orderState == '5') {
                _self.tableData[i].orderState = '已核销'
              } else if (response.data.data.data.list[i].orderState == '6') {
                _self.tableData[i].orderState = '更换菜品'
              }
            }
          } else {
            _self.$message.error('数据找不到啦，请刷新重试');
          }
        }).catch(function(error) {
          _self.$message.error('用户登录过期，请重新登录');
          _self.$router.push('/login')
          _self.$store.commit('SAVE_USERINFO', '')
          _self.$store.commit('SAVE_ArrayList', '')
        });
      },
      paymentmodeil(index) {
        let _self = this
        _self.code = '';
        _self.dialogVisible = true;

        _self.dataindex = _self.tableData[index]
        console.log(_self.dataindex)
        _self.$nextTick(function() {
          //DOM 更新了
          _self.$refs.inputVal.focus()
        })

      },
      cash(index) {
        let _self = this;
        _self.moneyinput = ''
        _self.moneysum = true;

        _self.$nextTick(function() {
          //DOM 更新了
          _self.$refs.inputVal2.focus()
        })
        _self.index2 = index
        console.log(_self.index2)
      },
      cashup() {
        let _self = this;
        _self.moneysum2 = true
        _self.money2 = _self.tableData[_self.index2].actualAmount
        _self.sum = parseFloat(_self.moneyinput - _self.money2).toFixed(2)
      },
      payment() {
        let _self = this
        _self.cashloading = true;
        let formData = new FormData();
        var moneys2 = _self.dataindex.payAmount
        var tableList = [];
        var newdatas = {};
        for (var i = 0; i < _self.tableData[_self.index2].odrOrderDetailList.length; i++) {
          newdatas = {
            amount: _self.tableData[_self.index2].odrOrderDetailList[i].order_amount,
            production_code: _self.tableData[_self.index2].odrOrderDetailList[i].production_code,
            production_name: _self.tableData[_self.index2].odrOrderDetailList[i].name,
            size: '',
          }
          tableList.push(newdatas)
        }
        var listbox = {
          list: tableList,
          warehouse_code: _self.shopcodedata,
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
            let formData2 = new FormData();
            formData2.append('state', 1);
            formData2.append('payCode', 'xianjin01');
            formData2.append('orderCode', _self.tableData[_self.index2].orderCode);
            formData2.append('payFeed', '成功');
            formData2.append('source', '现金');
            formData2.append('payAmount', _self.tableData[_self.index2].actualAmount);
            formData2.append('userKey', '');
            formData2.append('shopCode', _self.shopcode);
            //发送请求
            _self.axios.post(_self.ApiUrls + '/buyer/writeOrderPayTrace', formData2, {
              // 单独配置
              withCredentials: false
            }).then(response => {

              if (response.data.errcode == '0') {
                var serialNumber = response.data.data.serialNumber
                _self.$message({
                  type: 'success',
                  message: '付款成功，请前往今日订单查看'
                });
                _self.moneysum2 = false
                _self.moneysum = false
                _self.cashloading = false;
                let formData3 = new FormData();
                formData3.append('shopCode', _self.shopcode);
                formData3.append('orderCode', _self.tableData[_self.index2].orderCode);
                formData3.append('serialNumber', serialNumber);
                //发送请求
                _self.axios.post(_self.ApiUrl + '/catering/cashSettlement', formData3).then(response => {

                  if (response.data.errcode == '0') {

                    _self.goodslist = response.data.data
                    var json = _self.goodslist
                    _self.print(_self.goodslist);
                    //打印结束
                  } else {
                    _self.cashloading = false;
                    _self.$message.error('打印菜单加载失败');
                  }

                }).catch(function(error) {
                  _self.$message.error('响应时间过长，请重试');
                });
                _self.getdata();
              } else {
                _self.cashloading = false;
                _self.$message.error('支付失败');
              }

            }).catch(function(error) {
              _self.$message.error('响应时间过长，请重试');
            });
          } else {

            _self.Errorprompttable = response.data.data.msgList
            _self.Errorprompt = true;
            _self.cashloading = false;
            return false
          }
        }).catch(function(error) {
          _self.$message.error('保存响应时间过长，请重试');

        });


      },
      //仓库选择
      WarehouseSelection() {
        let _self = this;
        let formData = new FormData();
        formData.append('userId', _self.id);
        _self.axios.post(_self.ApiurlStorehouse + '/inventory/choouseTransferOut', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode == '0') {
            _self.shopcodedata = response.data.data.list[0].warehouse_code
          } else {
            _self.$message.error('获取仓库失败，请刷新重试');
          }
        }).catch(function(error) {
          _self.$message.error('仓库响应时间过长，请重试');

        });
      },
    },
    created: function() {
      let _self = this;
      _self.WarehouseSelection();
      _self.getdata();
    }
  }
</script>
<style>
  .app-contion {
    margin: 10px;
  }

  .block {
    margin-bottom: 15px;
  }

  .idcards span {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 2px solid #dcdfe6;
    color: #606266;
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
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 4px;
    margin: 10px;
  }

  .border-color {
    border: 2px solid red !important;
  }

  .titles {
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    font-size: 14px;
    margin: 0 15px;
  }

  .title-color {
    color: red;
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
