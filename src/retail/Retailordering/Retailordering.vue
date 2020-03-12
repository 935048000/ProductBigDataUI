<template>
  <div class="app-contion">
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content bg-purple fonts">当前门店：{{ShopName}}</div>
      </el-col>
      <!-- <el-col :span="6">
				<div class="grid-content bg-purple fonts">请选择收银员： <el-button size="mini" @click='changenamebtn'>{{shouyinname}}</el-button></div>
      </el-col>-->
      <el-col :span="6">
        <div class="grid-content bg-purple fonts">
          今日销售额：
          <span style="color: red;font-size: 1rem;">{{todaymoney}}</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple fonts">
          今日订单数：
          <span style="color: red;font-size: 1rem;">{{dan1}}</span>
        </div>
      </el-col>
    </el-row>
    <el-row class="margintops">
      <el-col :span="24">
        <div class="grid-content bg-purple-dark" style="display: flex;">
          <!-- 	<el-button size="mini" @click="temporary">挂起</el-button>
          <el-button size="mini" @click="guamen">挂起菜单</el-button>-->
          <span class="codestyle">商品扫码区：</span>
          <form @submit.prevent action="#">
            <input
              v-model="code"
              placeholder="请输入条形码"
              ref="inputVal"
              type="serch"
              @keypress="searchGoods"
              class="keyinput"
            />
          </form>
          <el-button
            type="success"
            size="mini"
            @click="clearCartList"
            style="margin-left: 1.6rem;"
          >一键清空</el-button>
        </div>
      </el-col>
      <div style="float: right;font-size: 0.875rem;">
        总件数：
        <span style="color: red;">{{totalCount}}</span>
      </div>
    </el-row>
    <el-table :data="tableData" border :height="tableHeight" stripe style="width: 100%">
      <el-table-column prop="bar_code" label="商品条码"></el-table-column>
      <el-table-column prop="productionName" label="商品名称"></el-table-column>
      <el-table-column label="数量" width="158">
        <template slot-scope="scope">
          <el-button @click="cuts((scope.$index, scope.row))" class="adds" :loading="loadings2">-</el-button>
          <!-- <span style="width: 0px;display: inline-block;text-align: center;">{{scope.row.order_amount}}</span> -->
          <div class="intbox">
            <el-input
              v-model="scope.row.order_amount"
              placeholder="请输入内容"
              style="width: 50%;font-size:14px"
              @blur="editmodify((scope.$index, scope.row))"
            ></el-input>
          </div>
          <el-button @click="add((scope.$index, scope.row))" class="adds" :loading="loadings">+</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="specification" label="规格"></el-table-column>
      <el-table-column prop="price" label="零售价"></el-table-column>
      <el-table-column prop="promotional_price" label="实销价"></el-table-column>
      <el-table-column prop="actual_amount" label="小计"></el-table-column>
      <el-table-column label="操作" width="150" v-if="discountApp">
        <template slot-scope="scope">
          <el-button size="mini" @click="Pricerevision(scope.$index, scope.row)">改价</el-button>
          <el-button size="mini" @click="discountOrder(scope.$index, scope.row)">打折</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="retailfooter">
      <el-col :span="24">
        <div class="retailfooterbox">
          <label class="SellerStyle">请输入售卖员工号：</label>
          <el-input size="small" placeholder="0-9纯数字即可" v-model="salesnum" style="width: 30%;"></el-input>
          <el-button
            @click="discount"
            type="info"
            style="margin-left: 2.875rem;padding:11px 15px 8px 15px"
          >优惠券</el-button>
          <!-- <el-button @click="discount" type="info" style='margin-left: 2.875rem;padding:11px 15px 8px 15px'>一键折扣</el-button> -->
          <!-- <el-button @click="EraseMoney" type="danger" style='margin-left: 0.875rem;padding:11px 15px 8px 15px'>改价</el-button> -->
        </div>
        <div class="grid-content bg-purple-dark disflex">
          <div class="font-n">
            应收金额：
            <div style="margin-left:70px;">
              <span class="colortest">{{allmenudate.allPayment}}</span>元
            </div>
          </div>
          <div style="margin-left:30px;">
            <el-button class="retail-btn" type="primary" @click="moling">抹零</el-button>
            <el-button class="retail-btn" type="success" @click="cash">现金支付</el-button>
            <el-button class="retail-btn" type="warning" @click="otherpayment">移动支付</el-button>
            <el-button class="retail-btn" @click="idcard">银联支付</el-button>
            <el-button class="retail-btn" type="danger" @click="Membershipbtn">会员支付</el-button>
          </div>
        </div>
        <div style="clear: both;"></div>
      </el-col>
    </el-row>
    <!-- 现金弹框 -->
    <el-dialog title="现金收款" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <div style="display: flex;">
        <div>
          <label>应收：</label>
          <el-input v-model="yingshou" placeholder="应收金额" style="width: 70%;" :disabled="true"></el-input>
        </div>
        <div>
          <label>应找：</label>
          <el-input v-model="yingzhao" placeholder="应找金额" style="width: 70%;" :disabled="true"></el-input>
        </div>
      </div>
      <!--显示框-->
      <div id="calculator">
        <!--显示框-->
        <span>实收：</span>
        <input-box v-bind:input-show="inputShow"></input-box>
        <btn-list>
          <div @click="inputValue('1')" class="btn-30 btn-radius">1</div>
          <div @click="inputValue('2')" class="btn-30 btn-radius">2</div>
          <div @click="inputValue('3')" class="btn-30 btn-radius">3</div>
          <div @click="inputValue('4')" class="btn-30 btn-radius">4</div>
          <div @click="inputValue('5')" class="btn-30 btn-radius">5</div>
          <div @click="inputValue('6')" class="btn-30 btn-radius">6</div>
          <div @click="inputValue('7')" class="btn-30 btn-radius">7</div>
          <div @click="inputValue('8')" class="btn-30 btn-radius">8</div>
          <div @click="inputValue('9')" class="btn-30 btn-radius">9</div>
          <div @click="inputValue('0')" class="btn-30 btn-radius">0</div>
          <div @click="inputValue('10')" class="btn-30 btn-radius">10</div>
          <div @click="inputValue('20')" class="btn-30 btn-radius">20</div>
          <div @click="inputValue('50')" class="btn-30 btn-radius">50</div>
          <div @click="inputValue('100')" class="btn-30 btn-radius">100</div>
          <div @click="inputValue('.')" class="btn-30 btn-radius">.</div>
          <div @click="clearValue()" class="btn-30 btn-radius color-red">C</div>

          <div @click="backValue()" class="btn-70 btn-radius color-red font-14">←</div>
        </btn-list>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
        style="position: absolute;right:0.625rem;bottom: 10px;"
      >
        <div class="margin-butoms">
          <el-button type="primary" @click="cashmoneyup" :loading="cashloading">确 定</el-button>
        </div>
        <div class="margin-butoms">
          <el-button type="success" @click="cashmoneyup" :loading="cashloading">正 好</el-button>
        </div>
        <div>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </div>
      </span>
    </el-dialog>
    <!-- 折扣 -->
    <!-- <el-dialog title="折扣金额提示" :visible.sync="rebate" width="40%" :before-close="handleClose">
      <div>
        <div>
          <span :class="{'border-colorsn':clicked3==index}" class="spans" v-for="(item,index) in discountplay" :key="item.value"
            @click="changedisxount(index)">{{item.code}}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rebate = false">取 消</el-button>
        <el-button type="primary" @click="rebateup">确 定</el-button>
      </span>
    </el-dialog>-->
    <!-- 优惠券 -->
    <el-dialog title="折扣金额提示" :visible.sync="rebate" width="50%" :before-close="handleClose">
      <p class="pfalg">注意：如需兑换优惠卷，请先选择优惠券再选择折扣(已选择折扣，不可再次选择优惠券)。</p>
      <el-tabs v-model="activeName2" type="card">
        <el-tab-pane label="优惠券" name="first">
          <div style="position: relative;">
            <p style="margin:10px 0">请选择优惠卷来源：</p>
            <div>
              <span
                :class="{'border-colorsn':couponclicked==index}"
                class="spans"
                v-for="(item,index) in coupon"
                :key="item.value"
                @click="couponchange(index)"
              >{{item.value}}</span>
            </div>
            <div>
              <label>请输入核销码：</label>
              <el-input v-model="cancellation" placeholder="请输入核销码" style="width:50%"></el-input>
              <el-button type="warning" @click="QueryCoupons">查询</el-button>
            </div>

            <p style="margin:10px 0">请选择单张优惠金额：</p>
            <div>
              <span
                :class="{'border-colorsn':discountclicked==index}"
                class="spans"
                v-for="(item,index) in Discountamount"
                :key="item.value"
                @click="discountchange(index)"
              >{{item.value}}</span>
            </div>

            <el-button style="width:40%;margin:10px 0" @click="addcoupon">添加</el-button>
            <p style="margin:10px 0">已选优惠券：</p>
            <el-table :data="CoupontableDatas2" border style="width: 100%">
              <el-table-column prop="coupon_code" label="核销码"></el-table-column>
              <el-table-column prop="coupon_face_value" label="优惠金额"></el-table-column>
              <el-table-column prop="coupon_source" label="优惠来源"></el-table-column>
            </el-table>
            <p style="margin:10px 0">当前优惠券：</p>
            <el-table :data="coupontableData2" style="margin-bottom:20px">
              <el-table-column prop="coupon_code" label="核销码"></el-table-column>
              <el-table-column prop="coupon_face_value" label="优惠金额"></el-table-column>
              <el-table-column prop="coupon_source" label="优惠来源"></el-table-column>
              <el-table-column prop="address" label="操作">
                <template slot-scope="scope">
                  <el-button @click="handlecouponClick(scope.$index, scope.row)" size="mini">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <span slot="footer" class="dialog-footer">
              <el-button @click="rebate = false">取 消</el-button>
              <el-button type="primary" @click="couponup" :loading="isloading">提 交</el-button>
            </span>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!--银联支付-->
    <el-dialog title="银联支付" :visible.sync="Unionpay" width="50%" :before-close="handleClose">
      <p style="margin: 12px 0;">请选择银行卡</p>
      <div class="idcards">
        <span
          :class="{'border-colorsn':clicked==index}"
          v-for="(item,index) in UnionPayBox"
          :key="item.value"
          @click="UnionPayclick(index)"
        >{{item.value}}</span>
      </div>
      <p style="margin: 12px 0;">应收金额</p>

      <p style="font-size: 40px;color: red;">{{allmenudate.allPayment}}</p>

      <div></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="Unionpayfalse">取 消</el-button>
        <el-button type="primary" @click="UnionPayclickup" :loading="cashloading">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 支付弹框 -->
    <el-dialog title="付款码" :visible.sync="tankuang" width="30%" :before-close="handleClose">
      <p style="margin-bottom: 10px;text-align: center;">
        总金额：
        <span style="color: #A52A2A;font-size: 16px;">{{allmenudate.allPayment}}元</span>
      </p>
      <form @submit.prevent action="#">
        <input
          v-model="codemoney"
          placeholder="请输入付款码"
          ref="codeVal"
          type="serch"
          @keypress="searchmoney"
          class="keyinput"
        />
      </form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="tankuang = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 会员支付 -->
    <el-dialog title="会员支付码" :visible.sync="Paymentvisible" width="30%" :before-close="handleClose">
      <p style="margin-bottom: 10px;text-align: center;">
        总金额：
        <span style="color: #A52A2A;font-size: 16px;">{{allmenudate.allPayment}}元</span>
      </p>
      <form @submit.prevent action="#">
        <input
          v-model="PaymentCode"
          placeholder="请输入会员支付码"
          ref="codeVal2"
          type="serch"
          class="keyinput"
        />
      </form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="Paymentvisible = false">取 消</el-button>
        <el-button type="primary" @click="Membershipup" :loading="cashloading">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 挂起菜单 -->
    <transition name="slide-fade">
      <div class="footernew" style="z-index: 1000;background: #fff;" v-show="isShow">
        <div class="close" @click="closemenus">
          <i class="el-icon-close"></i>
        </div>
        <!-- 菜单 -->
        <div class="max-heights" v-bind:style="{ height: height+ 'px'}">
          <div class="caidan" v-for=" (item,index) in hangOrderDetail" :key="item.serialNumber">
            <div style="position: relative;font-size: 16px;">
              <div>创建时间：{{item.create_at}}</div>
              <div class="gua1">
                挂起{{item.serialNumber}}
                <i
                  class="el-icon-close"
                  style="display: inline-block;padding: 0 2px;"
                  @click="deletlist(index)"
                ></i>
              </div>
            </div>
            <div class="navemeun">
              <div class="navemeun-chirld">
                <!-- 循环菜单 -->
                <div
                  style="width: 100%;text-align: left;"
                  v-for="(tab,index) in item.hangOrderDetailList"
                  :key="index"
                >
                  <span
                    class="navemeun-span"
                    style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;display: inline-block;"
                  >{{tab.productionName}}</span>
                  <span class="navemeun-span">{{tab.price}}</span>
                  <span class="navemeun-span">{{tab.orderAmount}}份</span>
                </div>
              </div>
              <div class="continue" @click="continues(index)">继续点单</div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- 收银员弹框 -->
    <el-dialog
      title="请选择收银员"
      :visible.sync="Cashiercartridge"
      width="60%"
      :before-close="handleClose"
    >
      <div>
        <div>
          <span
            :class="{'border-colorsn':clickedcash==index}"
            class="spans"
            v-for="(item,index) in cashiertable"
            :key="item.value"
            @click="cashierdisxount(index)"
          >{{item.code}}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="Cashiercartridge = false">取 消</el-button>
        <el-button type="primary" @click="Cashierup">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 抹零弹框 -->
    <el-dialog title="改价" :visible.sync="EraseMoneyVisible" width="30%">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="请输入工号" prop="Jobnumber">
          <el-input v-model="ruleForm.Jobnumber" placeholder="请您输入工号" style="width: 70%;"></el-input>
        </el-form-item>
        <el-form-item label="改价原因" prop="region">
          <el-select v-model="ruleForm.region" placeholder="请选择改价原因" style="width: 70%;">
            <el-option label="促销" value="促销"></el-option>
            <el-option label="抹零" value="抹零"></el-option>
            <el-option label="其它" value="其它"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应收金额" prop="money">
          <el-input v-model="ruleForm.money" style="width: 70%;" placeholder="请您输入应收金额"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EraseMoneyVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 改价 -->
    <el-dialog
      title="改价"
      :visible.sync="PricerevisionVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div style="margin-bottom: 0.625rem;">
        <label>商品名称：</label>
        <span>{{revisionname}}</span>
      </div>
      <div>
        <label>改后价格：</label>
        <el-input v-model="revisioninput" placeholder="请输入改后价格" style="width: 50%;"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="PricerevisionVisible = false">取 消</el-button>
        <el-button type="primary" @click="gethaveBeenAddedCoupon">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 打折 -->
    <el-dialog title="打折" :visible.sync="discountVisible" width="30%" :before-close="handleClose">
      <div style="margin-bottom: 0.625rem;">
        <label>商品名称：</label>
        <span>{{revisionname}}</span>
      </div>
      <div>
        <label>输入折扣</label>
        <el-input v-model="discountValue" placeholder="请输入折扣" style="width: 50%;"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="()=>{this.discountVisible = false}">取 消</el-button>
        <el-button type="primary" @click="submitDiscount">确 定</el-button>
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
import { getLodop, needCLodop } from "../../vuex/LodopFuncs.js";
import { newMaLing ,enumerationSorting} from "@/service";
import md5 from "js-md5";
export default {
  computed: {
    ...mapState({
      username: state => state.userinfo.account,
      token: state => state.userinfo.token,
      id: state => state.userinfo.id,
      shopcode: state => state.userinfo.shopcode,
      ShopName: state => state.ShopName.shopName,
      typename: state => state.ShopName.shopName,
      allinfo: state => state.ShopName
    })
  },
  watch: {
    tableData: function(newV, oldV) {
      console.log(newV);
      this.$store.commit("SAVE_BillData", newV);
    },
    allmenudate: function(newV, oldV) {
      console.log("allPayment", newV);
      this.$store.commit("SAVE_AllPayment", newV.allPayment);
    }
  },
  data() {
    return {
      Paymentvisible: false,
      discountApp: true,
      PaymentCode: "",
      inputShow: {
        value: "0"
      },
      CoupontableDatas2: [],
      activeName2: "first",
      Errorprompt: false,
      Errorprompttable: [],
      cashloading: false,
      salesnum: "", //售卖员工号
      ruleForm: {
        Jobnumber: "",
        region: "",
        money: ""
      },
      discountclicked: -1,
      coupontableData: [], //获取优惠信息table
      coupontableData2: [], //获取优惠信息table
      totalCount: 0, //总件数
      PricerevisionVisible: false,
      discountVisible: false,
      discountValue: "",
      revisioninput: "", //改后价格
      revisionname: "", //改价名称
      revisioncode: "", //改价编码
      isloading: false,
      revisiondiscounttype: "", //改价类型
      rules: {
        Jobnumber: [
          {
            required: true,
            message: "请输入工号",
            trigger: "blur"
          }
        ],
        region: [
          {
            required: true,
            message: "请选择改价原因",
            trigger: "change"
          }
        ],
        money: [
          {
            required: true,
            message: "请输入改价后应收金额",
            trigger: "blur"
          }
        ]
      },
      dialogVisible: false,
      Cashiercartridge: false,
      EraseMoneyVisible: false,
      tableData: [],
      tableHeight: window.innerHeight - 280,
      input: "",
      n1: 0,
      height: "600",
      isShow: false,
      n2: 0,
      result: 0,
      opt: "+",
      serialnum: "",
      allmenudate: "",
      loadings: false,
      hangOrderDetail: [],
      cashiertable: [],
      code: "",
      loadings2: false,
      yingshou: "",
      yingzhao: "",
      todaymoney: "",
      dan1: "",
      keyword: "",
      zhehoumoneyt: "",
      goodslist: "",
      rebate: false,
      Unionpay: false,
      tankuang: false,
      clicked3: -1,
      moneyWriteoff: "",
      clicked: -1,
      clickedcash: -1,
      couponclicked: -1,
      discountplay: "",
      moneyzhe: "",
      indexdiscount: "",
      UnionPayBox: [],
      codemoney: "",
      shouyinname: "",
      cartOrderCodeNum: "",
      actualprices: "",
      actualamounts: "",
      moneyprice1: "",
      moneyprice2: "",
      shopcodedata: "",
      cancellation: "", //核销码
      coupon: [], //优惠来源
      access_token: "", //通信秘钥
      expires: "", //有效时间
      order_sn: "", //核销编码
      Writeoffstate: "", //核销状态
      allPaymentmoney: 0,
      Discountamount: [],
      addCartCouponBox: [],
      bn: 1
    };
  },
  components: {
    "input-box": {
      props: ["inputShow"],
      computed: {
        value: function() {
          return this.inputShow.value;
        }
      },
      template:
        '<input id="input-box" type="text" size="21" maxlength="21" v-model="value" readonly="readonly">'
    },
    "btn-list": {
      template: '<div id="btn-list"><slot></slot></div>'
    }
  },
  mounted() {},
  methods: {
    //抹零
    moling() {
      console.log('========',this.allmenudate.allPayment);
      
      newMaLing({
        shopCode: this.shopcode, //店铺编码
        payment: this.allmenudate.allPayment, //购物车金额
        orderCode: this.cartOrderCodeNum //购物车单号
      }).then(res => {
        this.shopdetail()
      });
    },
    //优惠选择更新
    couponup() {
      let _self = this;
      if (_self.cartOrderCodeNum == "") {
        _self.$message({
          message: "您的购物车单号为空不能添加优惠券，请重新添加菜品",
          type: "warning"
        });
        return false;
      }
      var newdata = {
        orderCode: _self.cartOrderCodeNum,
        list: _self.coupontableData
      };
      console.log(_self.allPaymentmoney + "优惠金额");
      console.log(_self.allmenudate.allPayment + "订单金额");
      if (_self.allPaymentmoney > _self.allmenudate.allPayment) {
        _self.$message({
          message: "优惠金额只能小于或者等于订单金额",
          type: "warning"
        });

        return false;
      }
      console.log(newdata);

      if (_self.coupontableData == "") {
        _self.$message({
          message: "您并没有 ‘ 添加 ’ 任何优惠方式",
          type: "warning"
        });

        return false;
      }
      _self.isloading = true;

      _self.axios
        .post(
          _self.ApiUrls + "/buyer/addCartCoupon",
          {
            jsonData: newdata
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
              message: "提交成功",
              type: "success"
            });
            _self.addCartCouponBox = response.data.data.list;
            _self.shopdetail();
            _self.rebate = false;
            _self.allPaymentmoney = 0;

            _self.discountclicked = -1;
            _self.couponclicked = -1;
            _self.coupontableData = [];
            _self.coupontableData2 = [];
          } else {
            _self.$message.error(
              response.data.data.couponCode + response.data.errmsg
            );
            _self.isloading = false;
            return false;
          }
        })
        .catch(function(error) {
          _self.rebate = false;
          _self.$message.error("响应时间过长，请重试");
        });
    },
    CouponTraceState(cancellation) {
      let _self = this;
      let formData = new FormData();
      formData.append("couponSerialNumber", cancellation);

      _self.axios
        .post(
          _self.ApiUrlMember2 + "/mem/coupons/updateCouponTraceState",
          formData,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if (response.data.errcode == "0") {
            console.log("记录成功");
            _self.cancellation = "";
          } else {
            console.log("记录失败");
          }
        })
        .catch(function(error) {});
    },
    //删除优惠
    handlecouponClick(index) {
      let _self = this;
      _self.allPaymentmoney =
        _self.allPaymentmoney -
        _self.coupontableData2[index].coupon_actual_value;
      _self.coupontableData2.splice(index, 1);
      _self.coupontableData.splice(index, 1);
    },
    getcoupontable() {
      let _self = this;
      let formData = new FormData();
      formData.append("cartOrderCode", _self.cartOrderCodeNum);
      _self.axios
        .post(_self.ApiUrls + "/buyer/getFindByCouponList", formData, {
          // 单独配置
          withCredentials: false
        })
        .then(response => {
          if (response.data.errcode == "0") {
            _self.CoupontableDatas2 = response.data.data.list;
            for (var i = 0; i < _self.CoupontableDatas2.length; i++) {
              _self.CoupontableDatas2[i].coupon_face_value =
                Number(_self.CoupontableDatas2[i].coupon_face_value) / 100;
              _self.CoupontableDatas2[
                i
              ].coupon_face_value = _self.CoupontableDatas2[
                i
              ].coupon_face_value.toFixed(2);
            }
          } else {
            _self.$message.error("获取优惠券失败");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    //金额优惠
    moneydiscount() {
      let _self = this;
      let formData = new FormData();
      formData.append("code", "coupon_code_vouchers_value");
      formData.append("shopCode", _self.shopcode);
      _self.axios
        .post(_self.ApiUrl + "/catering/enumerationSorting", formData)
        .then(response => {
          if (response.data.errcode == "0") {
            _self.Discountamount = response.data.data.commentsGroup;
            for (var i = 0; i < _self.Discountamount.length; i++) {
              _self.Discountamount[i].value = parseFloat(
                _self.Discountamount[i].value
              ).toFixed(2);
            }
          } else {
            _self.$message.error("加载优惠金额失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    //添加优惠
    addcoupon() {
      let _self = this;
      if (_self.cancellation == "" || _self.cancellation == undefined) {
        _self.$message({
          message: "您还没有输入核销码哦",
          type: "warning"
        });

        return false;
      }
      let formData = new FormData();
      formData.append("couponSerialNumber", _self.cancellation);

      _self.axios
        .post(_self.ApiUrlMember2 + "/mem/coupons/whetherToUsed", formData, {
          // 单独配置
          withCredentials: false
        })
        .then(response => {
          if (response.data.errcode == "0") {
            let formData = new FormData();
            formData.append("cartOrderCode", _self.cartOrderCodeNum);
            _self.axios
              .post(_self.ApiUrls + "/buyer/whetherDiscount", formData, {
                // 单独配置
                withCredentials: false
              })
              .then(response => {
                if (response.data.errcode == "0") {
                  if (response.data.data.list == "") {
                    if (_self.cancellation == "") {
                      _self.$message({
                        message: "请输入核销码",
                        type: "warning"
                      });
                      return false;
                    }
                    if (_self.discountclicked == -1) {
                      _self.$message({
                        message: "请选择优惠金额",
                        type: "warning"
                      });
                      return false;
                    }
                    if (_self.couponclicked == -1) {
                      _self.$message({
                        message: "请选择优惠来源",
                        type: "warning"
                      });
                      return false;
                    }

                    var moneycoupon = Number(
                      _self.Discountamount[_self.discountclicked].value * 100
                    );

                    var newdata = {
                      coupon_state: 0,
                      coupon_type: "vouchers",
                      coupon_code: _self.cancellation,
                      coupon_face_value: moneycoupon,
                      coupon_actual_value: moneycoupon,
                      coupon_source: _self.coupon[_self.couponclicked].value
                    };
                    var newdata2 = {
                      coupon_state: 0,
                      coupon_type: "vouchers",
                      coupon_code: _self.cancellation,
                      coupon_actual_value:
                        _self.Discountamount[_self.discountclicked].value,
                      coupon_face_value:
                        _self.Discountamount[_self.discountclicked].value,
                      coupon_source: _self.coupon[_self.couponclicked].value
                    };
                    _self.allPaymentmoney += Number(
                      _self.Discountamount[_self.discountclicked].value
                    );
                    _self.coupontableData2.push(newdata2);
                    _self.coupontableData.push(newdata);
                    _self.discount();
                    _self.cancellation = "";

                    // _self.discountclicked = -1;
                    _self.couponclicked = -1;
                  } else if (
                    response.data.data.list[0].coupon_code == "1.0" ||
                    response.data.data.list[0].coupon_code == "1"
                  ) {
                    if (_self.cancellation == "") {
                      _self.$message({
                        message: "请输入核销码",
                        type: "warning"
                      });
                      return false;
                    }
                    if (_self.discountclicked == -1) {
                      _self.$message({
                        message: "请选择优惠金额",
                        type: "warning"
                      });
                      return false;
                    }
                    if (_self.couponclicked == -1) {
                      _self.$message({
                        message: "请选择优惠来源",
                        type: "warning"
                      });
                      return false;
                    }

                    var moneycoupon = parseInt(
                      _self.Discountamount[_self.discountclicked].value * 100
                    );

                    var newdata = {
                      coupon_state: 0,
                      coupon_type: "vouchers",
                      coupon_code: _self.cancellation,
                      coupon_face_value: moneycoupon,
                      coupon_actual_value: moneycoupon,
                      coupon_source: _self.coupon[_self.couponclicked].value
                    };
                    var newdata2 = {
                      coupon_state: 0,
                      coupon_type: "vouchers",
                      coupon_code: _self.cancellation,
                      coupon_actual_value:
                        _self.Discountamount[_self.discountclicked].value,
                      coupon_face_value:
                        _self.Discountamount[_self.discountclicked].value,
                      coupon_source: _self.coupon[_self.couponclicked].value
                    };
                    _self.allPaymentmoney += Number(
                      _self.Discountamount[_self.discountclicked].value
                    );

                    _self.coupontableData2.push(newdata2);
                    _self.coupontableData.push(newdata);
                    _self.discount();
                    _self.cancellation = "";

                    _self.discountclicked = -1;
                    _self.couponclicked = -1;
                  } else {
                    _self.$message({
                      message:
                        "您已先选择折扣，不能再次添加优惠券,请先选择优惠券再选择折扣，谢谢",
                      type: "warning"
                    });
                    return false;
                  }
                  _self.Discountamount = [];
                }
              })
              .catch(function(error) {
                _self.$message.error("响应时间过长，请重试");
              });
          } else {
            _self.$message.error(response.data.errmsg);
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    //优惠金额选择
    discountchange(index) {
      let _self = this;
      _self.discountclicked = index;
      console.log(_self.discountclicked + "优惠金额选择index");
    },
    //优惠来源
    couponchange(index) {
      let _self = this;
      _self.couponclicked = index;
    },
    //优惠券查询
    QueryCoupons() {
      let _self = this;
      console.log(_self.cancellation);
      if (_self.cancellation == "" || _self.cancellation == undefined) {
        _self.$message({
          message: "您还没有输入核销码哦",
          type: "warning"
        });
        return false;
      }

      if (_self.couponclicked == -1) {
        _self.$message({
          message: "您还没有选择优惠来源哦",
          type: "warning"
        });
        return false;
      }
      var nonce = ("00000" + Math.floor(Math.random() * 99999)).slice(-5);
      var token = _self.integraltoken;
      var secret = token + nonce;
      secret = sha1(secret);
      console.log(secret);

      if (_self.coupon[_self.couponclicked].code == "vouchers_integral") {
        // let formData = new FormData();
        // formData.append('appid', 'rckTBu3FIb9Y47aQmT');
        // formData.append('secret', secret);
        // formData.append('nonce', nonce);
        // _self.axios.post(_self.TotalIntegral,formData, {
        //   // 单独配置
        //   withCredentials: false
        // }).then(response => {

        var list = {};
        list.list = {};
        list.url = _self.TotalIntegral;
        list.list.header = {
          method: "oauth/token",
          format: "json"
        };
        list.list.body = {
          appid: "rckTBu3FIb9Y47aQmT",
          nonce: nonce,
          secret: secret
        };

        _self.axios
          .post(
            _self.ApiUrlMember2 + "/mem/coupons/fullIntegration",
            list,
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
            if (response.data.data.message.errcode == "0") {
              _self.access_token = response.data.data.data.access_token;
              _self.expires = response.data.data.data.expires;
              _self.getorderquery();
            }
          })
          .catch(function(error) {});
      } else {
        _self.getcouponSerialNumberDetail();
      }
    },
    getorderquery() {
      let _self = this;
      var timestamp = new Date().getTime();
      console.log(_self.integralappid);
      var sign =
        "appid" +
        _self.integralappid +
        "order_sn" +
        _self.cancellation +
        "timestamp" +
        timestamp +
        _self.access_token;
      sign = md5(sign);
      sign = sign.toUpperCase();
      var list = {};
      list.list = {};
      list.url = _self.TotalIntegral;
      list.list.header = {
        method: "reversepay/order_query",
        format: "json"
      };
      list.list.body = {
        appid: _self.integralappid,
        timestamp: timestamp,
        order_sn: _self.cancellation,
        sign: sign
      };

      _self.axios
        .post(
          _self.ApiUrlMember2 + "/mem/coupons/fullIntegration",
          list,
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
          if (response.data.data.message.errcode == "0") {
            _self.order_sn = response.data.data.data.order_sn;
            _self.Writeoffstate = response.data.data.data.state;
            _self.moneyWriteoff = response.data.data.data.money;
            if (_self.Writeoffstate == 1) {
              _self.$message.error("该优惠券已核销");
            }
            var n = Number(response.data.data.data.money);
            n = parseFloat(n).toFixed(2);
            var box = [
              {
                code: "vouchers_" + n,
                value: n
              }
            ];
            _self.Discountamount = box;
            _self.$forceUpdate();
          } else if (response.data.data.message.errcode == "2") {
            _self.$message.error("该优惠券已核销");
          } else if (response.data.data.message.errcode == "9100") {
            _self.$message.error("这是一张无效的优惠券哦");
          } else if (response.data.data.message.errcode == "9200") {
            _self.$message.error("用户余额不足 ");
          } else {
          }
        })
        .catch(function(error) {});
    },
    //核销全积分
    getwriteoff(confirmid, couponcode, callback) {
      let _self = this;

      console.log(confirmid);

      var timestamps = parseInt(Date.parse(new Date()) / 1000);
      var signs =
        "appid" +
        _self.integralappid +
        "confirm_id" +
        confirmid +
        "order_sn" +
        couponcode +
        "post_type" +
        "ACCESS" +
        "store_code" +
        _self.shopcode +
        "," +
        _self.ShopName +
        "," +
        _self.allinfo.province +
        _self.allinfo.city +
        "," +
        _self.allinfo.shopLation +
        "," +
        "timestamp" +
        timestamps +
        "total_fee" +
        _self.moneyWriteoff +
        _self.access_token;
      signs = md5(signs);
      signs = signs.toLocaleUpperCase();
      var store_code =
        _self.shopcode +
        "," +
        _self.ShopName +
        "," +
        _self.allinfo.province +
        _self.allinfo.city +
        "," +
        _self.allinfo.shopLation +
        ",";

      store_code = encodeURIComponent(store_code);

      var lists = {};
      lists.list = {};
      lists.url = _self.TotalIntegral;

      lists.list.header = {
        method: "reversepay/write_off",
        format: "json"
      };
      lists.list.body = {
        appid: "rckTBu3FIb9Y47aQmT",
        timestamp: timestamps,
        order_sn: couponcode,
        sign: signs,
        post_type: "ACCESS",
        total_fee: _self.moneyWriteoff,
        confirm_id: confirmid,
        store_code: store_code
      };

      _self.axios
        .post(
          _self.ApiUrlMember2 + "/mem/coupons/fullIntegration",
          lists,
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
          if (response.data.data.message.errcode == "0") {
            callback && callback(1);
          } else if (response.data.data.message.errcode == "2") {
            callback && callback(2);
            _self.cashloading = false;
            _self.Paymentvisible = false;
            _self.Unionpay = false;
            _self.allmenudate = "";
            _self.tableData = [];
            _self.Writeoffstate = "";
            _self.totalCount = 0;
            _self.tankuang = false;
            _self.paymentpay = false;
            _self.$alert("该优惠券已核销,请重新下单支付", "异常提示");
          } else if (response.data.data.message.errcode == "9100") {
            callback && callback(2);
            _self.cashloading = false;
            _self.Paymentvisible = false;
            _self.Unionpay = false;
            _self.tableData = [];
            _self.Writeoffstate = "";
            _self.allmenudate = "";
            _self.totalCount = 0;
            _self.tankuang = false;
            _self.paymentpay = false;
            _self.$alert("该优惠券已核销,请重新下单支付", "异常提示");
          } else if (response.data.data.message.errcode == "9200") {
            callback && callback(2);
            _self.cashloading = false;
            _self.Paymentvisible = false;
            _self.Unionpay = false;
            _self.allmenudate = "";
            _self.totalCount = 0;
            _self.tableData = [];
            _self.Writeoffstate = "";
            _self.tankuang = false;
            _self.paymentpay = false;
            _self.$alert("该优惠券异常,请重新下单支付", "异常提示");
          } else {
            callback && callback(2);
            _self.cashloading = false;
            _self.Paymentvisible = false;
            _self.Unionpay = false;
            _self.totalCount = 0;
            _self.allmenudate = "";
            _self.tableData = [];
            _self.Writeoffstate = "";
            _self.tankuang = false;
            _self.paymentpay = false;
            _self.$alert("全积分优惠券核销失败,请重新下单支付", "异常提示");
          }
        })
        .catch(function(error) {});
    },
    getcouponSerialNumberDetail() {
      let _self = this;
      let formData = new FormData();
      formData.append("couponSerialNumber", _self.cancellation);
      _self.axios
        .post(
          _self.ApiUrlMember2 + "/mem/coupons/couponSerialNumberDetail",
          formData,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if (response.data.errcode == "0") {
            if (response.data.data.data != undefined) {
              var n = Number(response.data.data.data.balance) / 100;
              n = parseFloat(n).toFixed(2);
              var box = [
                {
                  code: "vouchers_" + n,
                  value: n
                }
              ];
              _self.Discountamount = box;
              _self.$forceUpdate();
              console.log(box);
            } else {
              return;
            }
          } else {
            _self.$message.error(response.data.errmsg);
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    //优惠券后不能单品改价
    gethaveBeenAddedCoupon() {
      let _self = this;
      let formDataCoupon = new FormData();
      formDataCoupon.append("cartOrderCode", _self.cartOrderCodeNum);
      _self.axios
        .post(_self.ApiUrls + "/buyer/haveBeenAddedCoupon", formDataCoupon, {
          // 单独配置
          withCredentials: false
        })
        .then(response => {
          if (response.data.errcode == "0") {
            _self.Pricerevisionup();
          } else {
            _self.$message.error(response.data.errmsg);
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    //改价
    Pricerevision(index) {
      let _self = this;
      _self.PricerevisionVisible = true;
      _self.revisionname = _self.tableData[index].productionName;
      _self.revisioncode = _self.tableData[index].production_code;
      _self.revisiondiscounttype = _self.tableData[index].discount_type;
      _self.actualamounts = _self.tableData[index].actual_amount;
      _self.revisioninput = _self.tableData[index].actual_amount;
      _self.moneyprice1 = _self.tableData[index].order_amount;
      _self.moneyprice2 = _self.tableData[index].promotional_price;
    },
    discountOrder(index) {
      console.log(this.tableData[index], "this.tableData[index]");

      this.discountVisible = true;
      this.revisionname = this.tableData[index].productionName;
      this.revisioncode = this.tableData[index].production_code;
      this.revisiondiscounttype = this.tableData[index].discount_type;
      this.revisioninput = this.tableData[index].actual_amount;
      this.moneyprice2 = this.tableData[index].promotional_price;
      this.moneyprice1 = this.tableData[index].order_amount;
    },
    submitDiscount() {
      let _self = this;
      let formDataCoupon = new FormData();
      // console.log(this.discountValue);
      if (!this.discountValue) {
        return;
      }
      if (this.discountValue > 10 || this.discountValue < 0) {
        this.$message.warning("请输入0-10范围内的折扣");
      }
      formDataCoupon.append("cartOrderCode", _self.cartOrderCodeNum);
      _self.axios
        .post(_self.ApiUrls + "/buyer/haveBeenAddedCoupon", formDataCoupon, {
          // 单独配置
          withCredentials: false
        })
        .then(response => {
          if (response.data.errcode == "0") {
            let formData = new FormData();
            let afterDisCount = (
              (Number(this.moneyprice2 * this.moneyprice1) *
                Number(this.discountValue)) /
              10
            ).toFixed(2);
            formData.append("cartOrderCode", _self.cartOrderCodeNum);
            formData.append("productionCode", _self.revisioncode);
            formData.append("newActualPayment", afterDisCount);
            formData.append("discountType", _self.revisiondiscounttype);
            formData.append("shopCode", _self.shopcode);
            _self.axios
              .post(
                _self.ApiUrls + "/buyer/updateShopingCarActualamount",
                formData,
                {
                  // 单独配置
                  withCredentials: false
                }
              )
              .then(response => {
                if (response.data.errcode == "0") {
                  _self.$message({
                    type: "success",
                    message: "打折成功"
                  });
                  _self.discountVisible = false;
                  _self.shopdetail();
                } else {
                  _self.shopdetail();
                  _self.$message.error("改价失败");
                }
              })
              .catch(function(error) {
                _self.$message.error("数据响应过长，请重试");
              });
          } else {
            _self.$message.error(response.data.errmsg);
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    Pricerevisionup() {
      let _self = this;
      if (_self.revisioninput == "") {
        _self.$message({
          type: "warning",
          message: "您还没有输入改后价格哦！",
          duration: 10000,
          showClose: true
        });
        return false;
      }
      var Total = Number(_self.moneyprice1) * Number(_self.moneyprice2);
      if (_self.revisioninput > Total) {
        _self.$message({
          type: "warning",
          message: "改后价格不能大于该商品订单小计哦！",
          duration: 10000,
          showClose: true
        });
        return false;
      }
      let formData = new FormData();
      formData.append("cartOrderCode", _self.cartOrderCodeNum);
      formData.append("productionCode", _self.revisioncode);
      formData.append("newActualPayment", _self.revisioninput);
      formData.append("discountType", _self.revisiondiscounttype);
      formData.append("shopCode", _self.shopcode);
      _self.axios
        .post(_self.ApiUrls + "/buyer/updateShopingCarActualamount", formData, {
          // 单独配置
          withCredentials: false
        })
        .then(response => {
          if (response.data.errcode == "0") {
            _self.$message({
              type: "success",
              message: "改价成功"
            });
            _self.PricerevisionVisible = false;
            _self.shopdetail();
          } else {
            _self.shopdetail();
            _self.$message.error("改价失败");
          }
        })
        .catch(function(error) {
          _self.$message.error("数据响应过长，请重试");
        });
    },
    submitForm(formName) {
      let _self = this;
      _self.$refs[formName].validate(valid => {
        if (valid) {
          var reg = /^\d{1,10}$/;

          if (!reg.test(_self.ruleForm.Jobnumber)) {
            _self.$message({
              type: "warning",
              message: "售卖员工号您只能输入0到9的数字！",
              duration: 10000,
              showClose: true
            });
            return false;
          }

          if (Number(_self.ruleForm.money) > _self.actualprices) {
            _self.$message({
              type: "warning",
              message: "您输入的金额不能大于订单金额哦！",
              duration: 10000,
              showClose: true
            });
            return false;
          }

          var cumulative = _self.actualprices - Number(_self.ruleForm.money);
          cumulative = parseInt(cumulative.toFixed(2) * 100);
          var discounttable = [
            {
              coupon_code: _self.ruleForm.region,
              coupon_source: _self.shopcode,
              coupon_state: 0,
              coupon_type: "maling",
              coupon_face_value: cumulative,
              coupon_actual_value: cumulative,
              sales: _self.ruleForm.Jobnumber //传工号
            }
          ];
          var newdata = {
            orderCode: _self.cartOrderCodeNum,
            list: discounttable
          };
          _self.axios
            .post(
              _self.ApiUrls + "/buyer/resaleMaling",
              {
                jsonData: newdata
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
                _self.EraseMoneyVisible = false;
                _self.$refs[formName].resetFields();
                _self.shopdetail();
              } else {
                _self.$message.error("抹零失败，请重试");
              }
            })
            .catch(function(error) {
              _self.$message.error("抹零响应时间过长，请重试");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //抹零
    EraseMoney() {
      let _self = this;
      if (_self.tableData == "") {
        _self.$message({
          type: "warning",
          message: "您还没有添加任何商品哦！"
        });
        return false;
      }
      _self.EraseMoneyVisible = true;
    },
    //选择收银员
    changenamebtn() {
      let _self = this;
      _self.Cashiercartridge = true;
      let formData = new FormData();
      formData.append("code", _self.shopcode);
      formData.append("shopCode", _self.shopcode);
      _self.axios
        .post(_self.ApiUrl + "/catering/memberDiscount", formData)
        .then(response => {
          if (response.data.errcode == "0") {
            _self.cashiertable = response.data.data.commentsGroup;
          } else {
            _self.$message.error("获取收银员失败");
          }
        })
        .catch(function(error) {
          _self.$message.error("数据响应过长，请重试");
        });
    },
    //更新收银员
    Cashierup() {
      let _self = this;
      if (_self.clickedcash == -1) {
        _self.$message({
          message: "请选择营业员",
          type: "warning"
        });
        return false;
      }
      _self.shouyinname = _self.cashiertable[_self.clickedcash].code;

      _self.Cashiercartridge = false;
    },
    //收银员选择
    cashierdisxount(index) {
      let _self = this;
      _self.clickedcash = index;
    },
    //编辑数量
    editmodify(index) {
      let _self = this;

      let formData = new FormData();
      formData.append("cartOrderCode", _self.cartOrderCodeNum);
      formData.append("amount", index.order_amount);
      formData.append("productionCode", index.production_code);
      formData.append("token", _self.token);
      formData.append("discountType", index.discount_type);
      _self.axios
        .post(_self.ApiUrls + "/buyer/updateShopingCarAmount", formData, {
          // 单独配置
          withCredentials: false
        })
        .then(response => {
          if (response.data.errcode == "0") {
            _self.$message({
              type: "success",
              message: "修改成功"
            });
            _self.shopdetail();
          } else {
            _self.shopdetail();
            _self.$message.error(response.data.errmsg);
          }
        })
        .catch(function(error) {
          _self.$message.error("数据响应过长，请重试");
        });
    },
    paymentSussecc(openId) {
      let _self = this;
      let formData = new FormData();
      formData.append("openId", openId);
      //发送请求
      _self.axios
        .post(
          _self.ApiUrls + "/buyer/paymentSusseccUpdateOpenIdToUser",
          formData,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {})
        .catch(function(error) {
          console.log("openId响应失败");
        });
    },
    //移动支付
    searchmoney(event) {
      let _self = this;

      if (event.keyCode == 13) {
        event.preventDefault(); //禁止默认事件（默认是换行）
        _self.keyword = event.target.value;

        _self.dialogVisible = false;
        var money2 = _self.allmenudate.allPayment;
        var moneys = parseFloat((money2 * 100).toPrecision(12));
        if (
          _self.salesnum == null ||
          _self.salesnum == "" ||
          (_self.salesnum.length > 0 && _self.salesnum.trim().length == 0)
        ) {
          _self.$message({
            type: "warning",
            message: "您还没有输入售卖员工号！",
            duration: 10000,
            showClose: true
          });
          return false;
        }
        if (_self.money2 < 0) {
          _self.$message({
            message: "您的金额不能为负数哦！",
            type: "warning"
          });
          return false;
        }
        var reg = /^\d{1,10}$/;

        if (!reg.test(_self.salesnum)) {
          _self.$message({
            type: "warning",
            message: "售卖员工号您只能输入0到9的数字！",
            duration: 10000,
            showClose: true
          });
          return false;
        }
        if (
          _self.cartOrderCodeNum == "" ||
          _self.cartOrderCodeNum == undefined ||
          _self.cartOrderCodeNum == null
        ) {
          _self.$message({
            message: "您的购物车单号为空请重新添加商品",
            type: "warning"
          });
          return false;
        }
        if (_self.money2 < 0) {
          _self.$message({
            message: "您的金额不能为负数哦！",
            type: "warning"
          });
          return false;
        }
        var tableList = [];
        var newdatas = {};
        for (var i = 0; i < _self.tableData.length; i++) {
          newdatas = {
            amount: _self.tableData[i].order_amount,
            production_code: _self.tableData[i].production_code,
            production_name: _self.tableData[i].productionName,
            size: _self.tableData[i].unit,
            bar_code: _self.tableData[i].bar_code
          };
          tableList.push(newdatas);
        }
        var listbox = {
          list: tableList,
          warehouse_code: _self.shopcodedata
        };
        // 失去焦点防止多次输入
        event.target.blur();
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
              let formDatamenu = new FormData();
              formDatamenu.append("token", _self.token);
              formDatamenu.append("shopCode", _self.shopcode);
              formDatamenu.append("payment", money2);
              formDatamenu.append("cartOrderCode", _self.cartOrderCodeNum);
              formDatamenu.append("sales", _self.salesnum);
              _self.axios
                .post(_self.ApiUrls + "/buyer/createUserOrder", formDatamenu, {
                  // 单独配置
                  withCredentials: false
                })
                .then(response => {
                  if (response.data.errcode == "0") {
                    _self.clickedcash = -1;
                    _self.salesnum = "";
                    _self.actualprices = "";
                    _self.yingzhao = "0";
                    _self.inputShow.value = "0";
                    _self.shouyinname = _self.username;
                    let orderdetailcode = response.data.data.orderCode;
                    let serial = response.data.data.serialNumber;
                    _self.serialnum = "";
                    _self.cartOrderCodeNum = "";
                    console.log(_self.Writeoffstate);
                    console.log(_self.Writeoffstate.length);
                    if (_self.Writeoffstate.length == undefined) {
                      if (
                        _self.addCartCouponBox != "" ||
                        _self.addCartCouponBox != undefined
                      ) {
                        for (
                          var i = 0;
                          i < _self.addCartCouponBox.length;
                          i++
                        ) {
                          _self.getwriteoff(
                            orderdetailcode,
                            _self.addCartCouponBox[i].coupon_code,
                            param => {
                              if (param == 2) {
                                return;
                              } else {
                                _self.getmovemoney(
                                  orderdetailcode,
                                  moneys,
                                  money2
                                );
                              }
                            }
                          );
                        }
                      }
                    } else {
                      _self.getmovemoney(orderdetailcode, moneys, money2);
                    }
                  } else {
                    _self.$message.error("创建订单失败");
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
      }
    },
    getmovemoney(orderid, total_fee, payAmount) {
      let _self = this;
      if (Number(_self.keyword.slice(0, 2)) <= 15) {
        let formData = new FormData();
        formData.append("auth_code", _self.keyword);
        formData.append("total_fee", total_fee);
        formData.append("orderid", orderid);
        formData.append("shop_name", _self.shopcode);
        //发送请求
        _self.axios
          .post(_self.realmphp + "paymv2.php", formData, {
            // 单独配置
            withCredentials: false
          })
          .then(response => {
            if (response.data.coupon_fee == undefined) {
              var couponfee = 0;
            } else {
              var couponfee = Number(response.data.coupon_fee);
            }
            var cashfeeall = Number(response.data.cash_fee) + couponfee;

            if (
              response.data.result_code == "SUCCESS" &&
              response.data.return_code == "SUCCESS" &&
              response.data.return_msg == "OK" &&
              response.data.total_fee == total_fee &&
              response.data.trade_state == "SUCCESS" &&
              cashfeeall == total_fee &&
              response.data.fee_type == "CNY"
            ) {
              var openId = response.data.openid;
              _self.paymentSussecc(openId);
              _self.tankuang = false;
              _self.paymentpay = false;
              _self.serialnum = "";
              _self.Writeoffstate = "";
              if (
                _self.addCartCouponBox != "" ||
                _self.addCartCouponBox != undefined
              ) {
                for (var i = 0; i < _self.addCartCouponBox.length; i++) {
                  _self.CouponTraceState(_self.addCartCouponBox[i].coupon_code);
                }
              }

              _self.$message({
                type: "success",
                message: "付款成功，请前往今日订单查看"
              });
              if (
                response.data.out_trade_no == undefined ||
                response.data.out_trade_no == "" ||
                response.data.out_trade_no == null
              ) {
                console.log("payCode为：" + response.data.out_trade_no);
              } else {
                let formData2 = new FormData();
                formData2.append("state", 1);
                formData2.append("payCode", response.data.out_trade_no);
                formData2.append("orderCode", orderid);
                formData2.append("payFeed", "成功");
                formData2.append("source", "微信");
                formData2.append("payAmount", payAmount);
                formData2.append("userKey", openId);
                formData2.append("shopCode", _self.shopcode);
                //发送请求
                _self.axios
                  .post(
                    _self.ApiUrls + "/buyer/writeOrderPayTrace",
                    formData2,
                    {
                      // 单独配置
                      withCredentials: false
                    }
                  )
                  .then(response => {
                    if (response.data.errcode == "0") {
                      var serialNumber = response.data.data.serialNumber;
                      let formData3 = new FormData();
                      formData3.append("shopCode", _self.shopcode);
                      formData3.append("orderCode", orderid);
                      formData3.append("serialNumber", serialNumber);
                      //发送请求
                      _self.axios
                        .post(
                          _self.ApiUrl + "/catering/cashSettlement",
                          formData3
                        )
                        .then(response => {
                          if (response.data.errcode == "0") {
                            _self.goodslist = response.data.data;
                            var json = _self.goodslist;
                            _self.print(_self.goodslist);
                            //打印结束
                            _self.moneyzhe = "";
                          } else {
                            _self.$message.error("打印失败");
                          }
                        })
                        .catch(function(error) {
                          _self.$message.error("打印失败");
                        });

                      _self.shopdetail();
                    } else {
                      _self.$message.error("写入今日订单失败");
                    }
                  })
                  .catch(function(error) {
                    _self.$message.error("响应时间过长，请重试");
                  });
              }
            } else {
              var errcodedes = response.data.err_code_des;
              // 打印开始验证
              let formDatas = new FormData();
              formDatas.append("shopCode", _self.shopcode);
              formDatas.append("orderCode", orderid);
              _self.axios
                .post(_self.ApiUrls + "/pay/VerifyPay", formDatas, {
                  // 单独配置
                  withCredentials: false
                })
                .then(response => {
                  if (response.data.data.result.coupon_fee == undefined) {
                    var couponfee1 = 0;
                  } else {
                    var couponfee1 = Number(
                      response.data.data.result.coupon_fee
                    );
                  }
                  var cashfeeall1 =
                    Number(response.data.data.result.cash_fee) + couponfee1;
                  if (
                    response.data.data.result.trade_state == "SUCCESS" &&
                    response.data.data.result.result_code == "SUCCESS" &&
                    response.data.data.result.return_code == "SUCCESS" &&
                    cashfeeall1 == total_fee &&
                    response.data.data.result.total_fee == total_fee &&
                    response.data.data.result.fee_type == "CNY"
                  ) {
                    var openis2 = response.data.data.result.openid;
                    _self.Writeoffstate = "";
                    _self.$message({
                      message: "该订单已付款,请核对",
                      type: "success"
                    });
                    if (
                      _self.addCartCouponBox != "" ||
                      _self.addCartCouponBox != undefined
                    ) {
                      for (var i = 0; i < _self.addCartCouponBox.length; i++) {
                        _self.CouponTraceState(
                          _self.addCartCouponBox[i].coupon_code
                        );
                      }
                    }

                    _self.paymentSussecc(openis2);
                    _self.serialnum = "";
                    let formData3 = new FormData();
                    formData3.append("shopCode", _self.shopcode);
                    formData3.append("orderCode", orderid);
                    formData3.append(
                      "serialNumber",
                      response.data.data.serialNumber
                    );
                    //发送请求
                    _self.axios
                      .post(
                        _self.ApiUrl + "/catering/cashSettlement",
                        formData3
                      )
                      .then(response => {
                        if (response.data.errcode == "0") {
                          _self.goodslist = response.data.data;
                          var json = _self.goodslist;
                          _self.tankuang = false;
                          _self.Writeoffstate = "";
                          _self.print(_self.goodslist);
                          _self.shopdetail();
                          //打印结束
                        } else {
                          _self.$message.error("打印菜单丢失了！");
                        }
                      })
                      .catch(function(error) {
                        _self.$message.error("响应时间过长，请重试");
                      });
                  } else {
                    if (
                      errcodedes == "" ||
                      errcodedes == undefined ||
                      errcodedes == null
                    ) {
                      _self.$alert(
                        "订单未付款,请选择现金或者移动支付",
                        "异常提示",
                        {
                          confirmButtonText: "确定"
                        }
                      );
                      _self.shopdetail();
                      _self.tankuang = false;
                    } else {
                      _self.$alert(
                        errcodedes + " , " + "该订单未支付成功",
                        "异常提示",
                        {
                          confirmButtonText: "确定"
                        }
                      );
                      _self.shopdetail();
                      _self.tankuang = false;
                    }
                  }
                })
                .catch(function(error) {
                  _self.$message.error("响应时间过长，请重试");
                });
              //打印结束
              let formData = new FormData();
              formData.append("orderCode ", orderid);
              formData.append("payCode ", response.data.out_trade_no);
              formData.append("payBarCode", _self.keyword);
              formData.append("api", "weixinbydc/paymv2.php");
              formData.append("result", response.data.err_code_des);
              _self.axios
                .post(_self.ApiUrls + "/pay/payApitrace", formData, {
                  // 单独配置
                  withCredentials: false
                })
                .then(response => {})
                .catch(function(error) {
                  _self.$message.error("记录支付异常没有响应");
                });
              if (
                response.data.out_trade_no == undefined ||
                response.data.out_trade_no == "" ||
                response.data.out_trade_no == null
              ) {
                console.log("payCode为：" + response.data.out_trade_no);
              } else {
                let formDatafail = new FormData();
                formDatafail.append("state", 0);
                formDatafail.append("payCode", response.data.out_trade_no);
                formDatafail.append("orderCode", orderid);
                formDatafail.append("payFeed", "失败");
                formDatafail.append("source", "微信");
                formDatafail.append("payAmount", payAmount);
                formDatafail.append("userKey", "");
                formDatafail.append("shopCode", _self.shopcode);
                //发送请求
                _self.axios
                  .post(
                    _self.ApiUrls + "/buyer/writeOrderPayTrace",
                    formDatafail,
                    {
                      // 单独配置
                      withCredentials: false
                    }
                  )
                  .then(response => {
                    _self.moneyzhe = "";
                    _self.Writeoffstate = "";
                  })
                  .catch(function(error) {
                    _self.$message.error("响应时间过长，请重试");
                  });
              }
            }
          })
          .catch(function(error) {
            console.log(error);
            let formDatafail = new FormData();
            formDatafail.append("state", 0);
            formDatafail.append("payCode", response.data.out_trade_no);
            formDatafail.append("orderCode", orderid);
            formDatafail.append("payFeed", "失败");
            formDatafail.append("source", "微信");
            formData2.append("payAmount", payAmount);
            formData2.append("userKey", "");
            formData2.append("shopCode", _self.shopcode);
            //发送请求
            _self.axios
              .post(_self.ApiUrls + "/buyer/writeOrderPayTrace", formDatafail, {
                // 单独配置
                withCredentials: false
              })
              .then(response => {
                console.log(response);
                _self.$message.error("支付失败7");
                _self.Writeoffstate = "";
              })
              .catch(function(error) {
                _self.$message.error("响应时间过长，请重试");
              });
          });
      } else {
        let formDatas = new FormData();
        formDatas.append("auth_code", _self.keyword);
        formDatas.append("total_fee", total_fee);
        formDatas.append("orderid", orderid);
        formDatas.append("shop_name", _self.shopcode);
        //发送请求
        _self.axios
          .post(
            "http://pay.daisha.com.cn/alipay/f2fpay/barpay.php",
            formDatas,
            {
              // 单独配置
              withCredentials: false
            }
          )
          .then(response => {
            if (response.data.code == "10000") {
              _self.Writeoffstate = "";
              if (
                response.data.out_trade_no == undefined ||
                response.data.out_trade_no == "" ||
                response.data.out_trade_no == null
              ) {
                console.log("payCode为：" + response.data.out_trade_no);
              } else {
                let formData2 = new FormData();
                formData2.append("state", 1);
                formData2.append("payCode", response.data.out_trade_no);
                formData2.append("orderCode", orderid);
                formData2.append("payFeed", "成功");
                formData2.append("source", "支付宝");
                formData2.append("payAmount", payAmount);
                formData2.append("userKey", "");
                formData2.append("shopCode", _self.shopcode);
                //发送请求
                _self.axios
                  .post(
                    _self.ApiUrls + "/buyer/writeOrderPayTrace",
                    formData2,
                    {
                      // 单独配置
                      withCredentials: false
                    }
                  )
                  .then(response => {
                    if (response.data.errcode == "0") {
                      var serialNumber = response.data.data.serialNumber;
                      _self.moneyzhe = "";
                      _self.serialnum = "";
                      _self.Writeoffstate = "";
                      let formData3 = new FormData();
                      formData3.append("shopCode", _self.shopcode);
                      formData3.append("orderCode", orderid);
                      formData3.append("serialNumber", serialNumber);
                      //发送请求
                      _self.axios
                        .post(
                          _self.ApiUrl + "/catering/cashSettlement",
                          formData3
                        )
                        .then(response => {
                          if (response.data.errcode == "0") {
                            //console.log(response)
                            _self.goodslist = response.data.data;
                            var json = _self.goodslist;
                            //打印
                            _self.print(_self.goodslist);
                            //打印结束
                          } else {
                            _self.$message.error("小票菜单详情获取失败");
                          }
                        })
                        .catch(function(error) {
                          _self.$message.error(
                            "小票菜单详情响应时间过长，请重试"
                          );
                        });
                      _self.$message({
                        type: "success",
                        message: "付款成功，请前往今日订单查看"
                      });
                    } else {
                      _self.tankuang = false;
                      _self.paymentpay = false;
                      _self.$message.error("记录订单失败，请重试");
                    }
                  })
                  .catch(function(error) {
                    _self.$message.error("写入订单响应时间过长，请重试");
                  });
              }

              _self.shopdetail();
              _self.tankuang = false;
              _self.paymentpay = false;
            } else {
              var errcodedes = response.data.sub_msg;

              // 打印开始
              let formDatas = new FormData();
              formDatas.append("shopCode", _self.shopcode);
              formDatas.append("orderCode", orderid);
              _self.axios
                .post(_self.ApiUrls + "/pay/VerifyPay", formDatas, {
                  // 单独配置
                  withCredentials: false
                })
                .then(response => {
                  if (response.data.data.result.coupon_fee == undefined) {
                    var couponfee1 = 0;
                  } else {
                    var couponfee1 = Number(
                      response.data.data.result.coupon_fee
                    );
                  }
                  var cashfeeall1 =
                    Number(response.data.data.result.cash_fee) + couponfee1;
                  if (
                    response.data.data.result.trade_state == "SUCCESS" &&
                    response.data.data.result.result_code == "SUCCESS" &&
                    response.data.data.result.return_code == "SUCCESS" &&
                    cashfeeall1 == total_fee &&
                    response.data.data.result.total_fee == total_fee &&
                    response.data.data.result.fee_type == "CNY"
                  ) {
                    _self.$message({
                      message: "该订单已付款,请核对",
                      type: "success"
                    });
                    _self.serialnum = "";
                    _self.Writeoffstate = "";
                    let formData3 = new FormData();
                    formData3.append("shopCode", _self.shopcode);
                    formData3.append("orderCode", orderid);
                    formData3.append(
                      "serialNumber",
                      response.data.data.serialNumber
                    );
                    //发送请求
                    _self.axios
                      .post(
                        _self.ApiUrl + "/catering/cashSettlement",
                        formData3
                      )
                      .then(response => {
                        if (response.data.errcode == "0") {
                          _self.goodslist = response.data.data;
                          var json = _self.goodslist;

                          _self.print(_self.goodslist);
                          _self.shopdetail();
                          //打印结束
                        } else {
                          _self.$message.error("打印菜单丢失了！");
                        }
                      })
                      .catch(function(error) {
                        _self.$message.error("打印菜单响应时间过长，请重试");
                      });
                  } else {
                    if (
                      errcodedes == "" ||
                      errcodedes == undefined ||
                      errcodedes == null
                    ) {
                      _self.$alert("该订单未支付成功", "异常提示", {
                        confirmButtonText: "确定"
                      });
                      _self.shopdetail();
                    } else {
                      _self.$alert(
                        errcodedes + " , " + "该订单未支付成功",
                        "异常提示",
                        {
                          confirmButtonText: "确定"
                        }
                      );
                      _self.shopdetail();
                    }
                  }
                })
                .catch(function(error) {
                  _self.$message.error("响应时间过长，请重试");
                });
              //打印结束
              let formData = new FormData();
              formData.append("orderCode ", orderid);
              formData.append("payCode ", response.data.out_trade_no);
              formData.append("payBarCode", _self.keyword);
              formData.append("api", "alipay/f2fpay/barpay.php");
              formData.append("result", response.data.sub_msg);
              _self.axios
                .post(_self.ApiUrls + "/pay/payApitrace", formData, {
                  // 单独配置
                  withCredentials: false
                })
                .then(response => {})
                .catch(function(error) {
                  _self.$message.error("记录支付异常没有响应");
                });
              _self.tankuang = false;
              _self.paymentpay = false;
              if (
                response.data.out_trade_no == undefined ||
                response.data.out_trade_no == "" ||
                response.data.out_trade_no == null
              ) {
                console.log("payCode为：" + response.data.out_trade_no);
              } else {
                let formDatafail = new FormData();
                formDatafail.append("state", 0);
                formDatafail.append("payCode", response.data.out_trade_no);
                formDatafail.append("orderCode", orderid);
                formDatafail.append("payFeed", "失败");
                formDatafail.append("source", "支付宝");
                formDatafail.append("payAmount", payAmount);
                formDatafail.append("userKey", "");
                formDatafail.append("shopCode", _self.shopcode);
                //发送请求
                _self.axios
                  .post(
                    _self.ApiUrls + "/buyer/writeOrderPayTrace",
                    formDatafail,
                    {
                      // 单独配置
                      withCredentials: false
                    }
                  )
                  .then(response => {
                    _self.moneyzhe = "";
                    _self.Writeoffstate = "";
                  })
                  .catch(function(error) {
                    _self.$message.error("响应时间过长，请重试1388");
                  });
              }
            }
          })
          .catch(function(error) {
            _self.$message.error("响应时间过长，请重试1138");
          });
      }
    },
    //临时挂起
    temporary() {
      let _self = this;
      let formData = new FormData();
      formData.append("userId", _self.id);
      formData.append("shopCode", _self.shopcode);
      _self.axios
        .post(_self.ApiUrls + "/hang/hangOrder", formData, {
          // 单独配置
          withCredentials: false
        })
        .then(response => {
          if (response.data.errcode == "0") {
            _self.moneyzhe = "";
            _self.serialnum = "";
            _self.shopdetail();
          } else {
            _self.$message.error("挂起失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    // 挂起菜单

    guamen() {
      let _self = this;
      //console.log(_self.checkboxGroup)
      _self.isShow = !_self.isShow;
      _self.guamenlisy();
    },
    //关闭挂起菜单
    closemenus() {
      this.isShow = false;
    },
    //继续点餐
    continues(index, tab) {
      let _self = this;
      let formData = new FormData();
      formData.append("userId", _self.id);
      formData.append(
        "serialNumber",
        _self.hangOrderDetail[index].serialNumber
      );
      _self.axios
        .post(_self.ApiUrls + "/hang/continueToOrder", formData, {
          // 单独配置
          withCredentials: false
        })
        .then(response => {
          if (response.data.errcode == "0") {
            _self.serialnum = response.data.data.serialNumber;
            _self.guamen();
            _self.shopdetail();
          } else {
            _self.$message.error("已不能继续点餐，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试1531");
        });
    },
    //删除单个挂起菜单
    deletlist(index) {
      console.log(index);
      let _self = this;
      let formData = new FormData();
      formData.append("userId", _self.id);
      formData.append(
        "serialNumber",
        _self.hangOrderDetail[index].serialNumber
      );
      _self.axios
        .post(_self.ApiUrls + "/hang/deleteHangOrder", formData, {
          // 单独配置
          withCredentials: false
        })
        .then(response => {
          if (response.data.errcode == "0") {
            _self.guamenlisy();
          } else {
            _self.$message.error("删除失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    guamenlisy() {
      let _self = this;

      let formData = new FormData();
      formData.append("userId", _self.id);
      _self.axios
        .post(_self.ApiUrls + "/hang/hangOrderDetail", formData, {
          // 单独配置
          withCredentials: false
        })
        .then(response => {
          if (response.data.errcode == "0") {
            _self.hangOrderDetail = response.data.data.data;
            console.log(_self.hangOrderDetail);
          } else {
            _self.$message.error("加载失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    //继续点餐
    // 			continues(index, tab) {
    // 				let _self = this;
    // 				let formData = new FormData();
    // 				formData.append('userId', _self.id);
    // 				formData.append('serialNumber', _self.hangOrderDetail[index].serialNumber);
    // 				_self.axios.post(_self.ApiUrls + '/hang/continueToOrder', formData, {
    // 					// 单独配置
    // 					withCredentials: false
    // 				}).then(response => {
    // 					if (response.data.errcode == '0') {
    //
    // 						_self.guamen()
    // 						_self.shopdetail()
    // 					} else {
    // 						_self.$message.error('已不能继续点餐，请刷新重试');
    // 					}
    // 				}).catch(function(error) {
    // 					_self.$message.error('响应时间过长，请重试1531');
    // 				});
    // 			},
    //移动支付弹框
    otherpayment() {
      let _self = this;
      _self.codemoney = "";
      if (
        _self.tableData == "" ||
        _self.tableData == null ||
        _self.tableData == undefined
      ) {
        _self.$message({
          type: "warning",
          message: "您还没有添加任何商品哦！",
          duration: 10000,
          showClose: true
        });
        return false;
      }
      _self.tankuang = true;
      _self.$nextTick(function() {
        //DOM 更新了
        _self.$refs.codeVal.focus();
      });
    },
    //计算器
    inputValue(param) {
      console.log(param);
      if (
        Object.prototype.toString.call(this.inputShow.value) ==
        "[object Number]"
      ) {
        //判断输入框内容是否为数字类型
        this.inputShow.value = "0"; //数字类型说明是上个计算结果,清空内容
      }
      var str = "" + this.inputShow.value; //输入内容时,将输入框内容转为字符串类型
      var len = str.length;
      var arr = ["+", "-", "×", "÷"];
      var num = (
        "" +
        parseFloat(
          str
            .split("")
            .reverse()
            .join("")
        )
      )
        .split("")
        .reverse()
        .join(""); //parseInt(str.split('').reverse().join('')))是获取输入框内最后一串数字,再反转回来 ,num为输入框内最后一串数字
      var nlen = num.length;
      if (
        (num != "0" && param != ".") ||
        (param == "." && num.indexOf(".") == -1)
      ) {
        //输入框内最后一串数字不为0时拼接字符串
        if (
          arr.indexOf(str.charAt(len - 1)) != -1 &&
          arr.indexOf(param) != -1
        ) {
          //若一开始输入内容为运算符,输入无效
          return;
        }
        this.inputShow.value += param; //拼接输入内容
        console.log(this.inputShow.value);
      } else {
        arr.push("%");
        if (param == ".") {
          //若num中已有小数点,输入内容为小数点,视为无效
          return;
        } else if (!(arr.indexOf(param) != -1)) {
          //判断输入框内最后一个字符不为运算符
          this.inputShow.value = str.substring(0, str.length - nlen) + param; //输入框内最后一串数字为0时,删除0拼接
        }
      }
      this.yingzhao = parseFloat(this.inputShow.value - this.yingshou).toFixed(
        2
      );
    },
    clearValue() {
      //清空输入框内容
      this.inputShow.value = "0";
      this.yingzhao = "0";
    },
    backValue() {
      //删除键,删除单个字符
      var str = this.inputShow.value;
      if (str.length == 1) {
        this.inputShow.value = "0";
        this.yingzhao = "0";
      } else {
        this.inputShow.value = str.slice(0, str.length - 1);
        this.yingzhao = parseFloat(
          this.inputShow.value - this.yingshou
        ).toFixed(2);
      }
    },
    //折扣
    discount() {
      let _self = this;

      if (_self.cartOrderCodeNum == "" || _self.tableData == "") {
        _self.$message({
          message: "您的购物车没有发现任何商品，不能选择折扣哦！",
          type: "warning"
        });
        return false;
      }
      _self.moneylaiyuan();
      _self.getcoupontable();
      _self.rebate = true;
      _self.isloading = false;
      _self.clicked = -1;
      _self.indexdiscount = -1;
      _self.clicked3 = -1;
      _self.discountclicked = -1;
      _self.cancellation = "";
      _self.couponclicked = -1;

      let formData2 = new FormData();
      formData2.append("code", "coupon_code_vouchers_mem");
      formData2.append("shopCode", _self.shopcode);
      _self.axios
        .post(_self.ApiUrl + "/catering/memberDiscount", formData2)
        .then(response => {
          if (response.data.errcode == "0") {
            _self.discountplay = response.data.data.commentsGroup;
            var zhekous = "";

            let formDatas = new FormData();
            formDatas.append("cartOrderCode", _self.cartOrderCodeNum);
            _self.axios
              .post(_self.ApiUrls + "/buyer/whetherDiscount", formDatas, {
                // 单独配置
                withCredentials: false
              })
              .then(response => {})
              .catch(function(error) {
                _self.$message.error("响应时间过长，请重试");
              });
            // _self.moneydiscount();
            _self.moneylaiyuan();
          } else {
            _self.$message.error("数据找不到啦，请刷新重试！");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    //优惠来源
    moneylaiyuan() {
      let _self = this;
      let formData = new FormData();
      formData.append("code", "coupon_code_vouchers_mem");
      formData.append("shopCode", _self.shopcode);
      _self.axios
        .post(_self.ApiUrl + "/catering/memberDiscount", formData)
        .then(response => {
          if (response.data.errcode == "0") {
            _self.coupon = response.data.data.commentsGroup;
          } else {
            _self.$message.error("加载优惠金额失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    //折扣
    changedisxount(index) {
      let _self = this;
      _self.indexdiscount = index;
      _self.clicked3 = index;
    },
    rebateup() {
      let _self = this;

      if (_self.indexdiscount == -1) {
        _self.$message({
          message: "请选择折扣",
          type: "warning"
        });
        return false;
      }
      if (_self.discountplay[_self.indexdiscount].code == "九折") {
        _self.codename = "0.9";
      } else if (_self.discountplay[_self.indexdiscount].code == "八折") {
        _self.codename = "0.8";
      } else if (_self.discountplay[_self.indexdiscount].code == "七折") {
        _self.codename = "0.7";
      } else if (_self.discountplay[_self.indexdiscount].code == "八点五折") {
        _self.codename = "0.85";
      } else if (_self.discountplay[_self.indexdiscount].code == "六折") {
        _self.codename = "0.6";
      } else if (_self.discountplay[_self.indexdiscount].code == "五折") {
        _self.codename = "0.5";
      } else if (_self.discountplay[_self.indexdiscount].code == "免单") {
        _self.codename = "0";
      } else if (_self.discountplay[_self.indexdiscount].code == "二折") {
        _self.codename = "0.2";
      } else if (_self.discountplay[_self.indexdiscount].code == "三折") {
        _self.codename = "0.3";
      } else if (_self.discountplay[_self.indexdiscount].code == "四折") {
        _self.codename = "0.4";
      } else if (_self.discountplay[_self.indexdiscount].code == "一折") {
        _self.codename = "0.1";
      } else if (_self.discountplay[_self.indexdiscount].code == "无折扣") {
        _self.codename = "1";
      }
      _self.rebate = false;
      //         let formData2 = new FormData();
      //         formData2.append('discount', _self.codename);
      //
      //         formData2.append('cartOrderCode', _self.cartOrderCodeNum);
      //         formData2.append('shopCode', _self.shopcode);
      //         _self.axios.post(_self.ApiUrls + '/buyer/cateringMemberDiscount', formData2, {
      //           // 单独配置
      //           withCredentials: false
      //         }).then(response => {
      //           if (response.data.errcode == '0') {
      //             _self.shopdetail();
      //             _self.codename = ''
      //           } else {
      //             _self.$message.error('添加折扣失败，请刷新重试');
      //           }
      //         }).catch(function(error) {
      //           _self.$message.error('响应时间过长，请重试');
      //         });
    },
    //银联
    UnionPayclick(index) {
      let _self = this;
      _self.clicked = index;
      console.log(_self.UnionPayBox[index]);
      _self.UnionPayBoxindex = _self.UnionPayBox[index].value;
    },
    //银联支付
    idcard() {
      let _self = this;
      if (
        _self.tableData == "" ||
        _self.tableData == null ||
        _self.tableData == undefined
      ) {
        _self.$message({
          type: "warning",
          message: "您还没有添加任何商品哦！",
          duration: 10000,
          showClose: true
        });
        return false;
      }
      _self.Unionpay = true;
      _self.money2 = _self.allmenudate.allPayment;
      _self.sum = parseFloat(_self.moneyinput - _self.money2).toFixed(2);
      let formData2 = new FormData();
      formData2.append("code", "unionpay_type");
      //发送请求
      _self.axios
        .post(_self.ApiUrl + "/catering/memberDiscount", formData2)
        .then(response => {
          if (response.data.errcode == "0") {
            _self.UnionPayBox = response.data.data.commentsGroup;
          } else {
            _self.$message.error("获取银行卡失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    Unionpayfalse() {
      let _self = this;
      _self.Unionpay = false;
      _self.clicked = -1;
      _self.UnionPayBoxindex = "";
    },
    //银联支付
    UnionPayclickup() {
      let _self = this;
      _self.cashloading = true;
      var money2 = _self.allmenudate.allPayment;
      var moneys = _self.allmenudate.allPayment * 100;
      if (_self.UnionPayBoxindex == undefined || _self.UnionPayBoxindex == "") {
        _self.$message({
          showClose: true,
          message: "请选择银行账户！",
          type: "warning"
        });
        _self.cashloading = false;
        return false;
      }
      if (
        _self.salesnum == null ||
        _self.salesnum == "" ||
        (_self.salesnum.length > 0 && _self.salesnum.trim().length == 0)
      ) {
        _self.$message({
          type: "warning",
          message: "您还没有输入售卖员工号！",
          duration: 10000,
          showClose: true
        });
        _self.cashloading = false;
        return false;
      }
      var reg = /^\d{1,10}$/;

      if (!reg.test(_self.salesnum)) {
        _self.$message({
          type: "warning",
          message: "售卖员工号您只能输入0到9的数字！",
          duration: 10000,
          showClose: true
        });
        _self.cashloading = false;
        return false;
      }
      if (
        _self.cartOrderCodeNum == "" ||
        _self.cartOrderCodeNum == undefined ||
        _self.cartOrderCodeNum == null
      ) {
        _self.$message({
          message: "您的购物车单号为空请重新添加商品",
          type: "warning"
        });
        _self.cashloading = false;
        return false;
      }
      if (_self.money2 < 0) {
        _self.$message({
          message: "您的金额不能为负数哦！",
          type: "warning"
        });
        _self.cashloading = false;
        return false;
      }
      var tableList = [];
      var newdatas = {};
      for (var i = 0; i < _self.tableData.length; i++) {
        newdatas = {
          amount: _self.tableData[i].order_amount,
          production_code: _self.tableData[i].production_code,
          production_name: _self.tableData[i].productionName,
          size: _self.tableData[i].unit,
          bar_code: _self.tableData[i].bar_code
        };
        tableList.push(newdatas);
      }
      var listbox = {
        list: tableList,
        warehouse_code: _self.shopcodedata
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
            let formDatamenu = new FormData();
            formDatamenu.append("token", _self.token);
            formDatamenu.append("shopCode", _self.shopcode);
            formDatamenu.append("payment", money2);
            formDatamenu.append("cartOrderCode", _self.cartOrderCodeNum);
            formDatamenu.append("sales", _self.salesnum);
            _self.axios
              .post(_self.ApiUrls + "/buyer/createUserOrder", formDatamenu, {
                // 单独配置
                withCredentials: false
              })
              .then(response => {
                let orderdetailcode = response.data.data.orderCode;
                if (response.data.errcode == "0") {
                  _self.serialnum = "";
                  _self.salesnum = "";
                  _self.actualprices = "";
                  _self.cartOrderCodeNum = "";
                  _self.clickedcash = -1;
                  _self.yingzhao = "0";
                  _self.inputShow.value = "0";
                  _self.shopdetail();
                  _self.shouyinname = _self.username;
                  if (_self.Writeoffstate.length == undefined) {
                    if (
                      _self.addCartCouponBox != "" ||
                      _self.addCartCouponBox != undefined
                    ) {
                      for (var i = 0; i < _self.addCartCouponBox.length; i++) {
                        _self.getwriteoff(
                          orderdetailcode,
                          _self.addCartCouponBox[i].coupon_code,
                          param => {
                            if (param == 2) {
                              return;
                            } else {
                              _self.getUnionPay(orderdetailcode, money2);
                            }
                          }
                        );
                      }
                    }
                  } else {
                    _self.getUnionPay(orderdetailcode, money2);
                  }
                } else {
                  _self.Errorprompttable = response.data.data.msgList;
                  _self.Errorprompt = true;
                  _self.Unionpay = false;
                  _self.cashloading = false;
                  return false;
                }
              })
              .catch(function(error) {
                _self.$message.error("保存响应时间过长，请重试");
              });
          } else {
            _self.cashloading = false;
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    getUnionPay(orderCode, payAmount) {
      let _self = this;
      let formData2 = new FormData();
      formData2.append("state", 1);
      formData2.append("payCode", _self.UnionPayBoxindex);
      formData2.append("orderCode", orderCode);
      formData2.append("payFeed", "成功");
      formData2.append("source", "银联");
      formData2.append("payAmount", payAmount);
      formData2.append("userKey", "");
      formData2.append("shopCode", _self.shopcode);
      //发送请求
      _self.axios
        .post(_self.ApiUrls + "/buyer/writeOrderPayTrace", formData2, {
          // 单独配置
          withCredentials: false
        })
        .then(response => {
          if (response.data.errcode == "0") {
            var serialNumber = response.data.data.serialNumber;
            _self.clicked = "-1";
            _self.UnionPayBoxindex = "";
            _self.moneyzhe = "";
            _self.cashloading = false;
            _self.jujiao();
            if (
              _self.addCartCouponBox != "" ||
              _self.addCartCouponBox != undefined
            ) {
              for (var i = 0; i < _self.addCartCouponBox.length; i++) {
                _self.CouponTraceState(_self.addCartCouponBox[i].coupon_code);
              }
            }

            _self.summary();
            let formData3 = new FormData();
            formData3.append("shopCode", _self.shopcode);
            formData3.append("orderCode", orderCode);
            formData3.append("serialNumber", serialNumber);
            //发送请求
            _self.axios
              .post(_self.ApiUrl + "/catering/cashSettlement", formData3)
              .then(response => {
                if (response.data.errcode == "0") {
                  _self.goodslist = response.data.data;
                  var json = _self.goodslist;

                  _self.print(_self.goodslist);
                  //打印结束
                } else {
                  _self.$message.error("打印菜单详情失败");
                }
              })
              .catch(function(error) {
                _self.$message.error("响应时间过长，请重试");
              });
            _self.shopdetail();
            _self.$message({
              type: "success",
              message: "付款成功，请前往今日订单查看"
            });
            _self.Unionpay = false;
          } else {
            _self.$message.error("支付失败");
            let formData2 = new FormData();
            formData2.append("state", 0);
            formData2.append("payCode", _self.UnionPayBoxindex);
            formData2.append("orderCode", orderCode);
            formData2.append("payFeed", "失败");
            formData2.append("source", "银联");
            formData2.append("payAmount", payAmount);
            formData2.append("shopCode", _self.shopcode);
            //发送请求
            _self.axios
              .post(_self.ApiUrls + "/buyer/writeOrderPayTrace", formData2, {
                // 单独配置
                withCredentials: false
              })
              .then(response => {
                _self.cashloading = false;
              })
              .catch(function(error) {
                _self.$message.error("响应时间过长，请重试");
              });
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    // 一键清空
    clearCartList() {
      let _self = this;
      let formData = new FormData();
      formData.append("cartOrderCode", _self.cartOrderCodeNum);
      _self.axios
        .post(
          _self.ApiUrls + "/buyer/deleteShoppingCarAllProduction",
          formData,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if (response.data.errcode == "0") {
            _self.moneyzhe = "";
            _self.serialnum = "";
            _self.cartOrderCodeNum = "";
            _self.totalCount = 0;
            _self.shopdetail();
            _self.jujiao();
          } else {
            _self.$message.error("数据错误，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    //现金付款
    cash() {
      let _self = this;
      console.log(_self.allmenudate.allPayment);
      if (
        _self.tableData == "" ||
        _self.tableData == null ||
        _self.tableData == undefined
      ) {
        _self.$message({
          type: "warning",
          message: "您还没有添加任何商品哦！",
          duration: 10000,
          showClose: true
        });
        return false;
      }
      _self.dialogVisible = true;
      _self.yingshou = _self.allmenudate.allPayment;
      _self.yingzhao = parseFloat(
        _self.inputShow.value - _self.yingshou
      ).toFixed(2);
    },
    //现金提交
    //现金支付
    cashmoneyup() {
      //alert('1')
      let _self = this;
      _self.cashloading = true;
      _self.dialogVisible = false;
      var money2 = _self.allmenudate.allPayment;
      var moneys = _self.allmenudate.allPayment * 100;
      moneys = parseInt(moneys);
      if (
        _self.salesnum == null ||
        _self.salesnum == "" ||
        (_self.salesnum.length > 0 && _self.salesnum.trim().length == 0)
      ) {
        _self.$message({
          type: "warning",
          message: "您还没有输入售卖员工号！",
          duration: 10000,
          showClose: true
        });
        _self.cashloading = false;
        return false;
      }
      var reg = /^\d{1,10}$/;

      if (!reg.test(_self.salesnum)) {
        _self.$message({
          type: "warning",
          message: "售卖员工号您只能输入0到9的数字！",
          duration: 10000,
          showClose: true
        });
        _self.cashloading = false;
        return false;
      }
      if (
        _self.cartOrderCodeNum == "" ||
        _self.cartOrderCodeNum == undefined ||
        _self.cartOrderCodeNum == null
      ) {
        _self.$message({
          message: "您的购物车单号为空请重新添加商品",
          type: "warning"
        });
        _self.cashloading = false;
        return false;
      }
      if (_self.money2 < 0) {
        _self.$message({
          message: "您的金额不能为负数哦！",
          type: "warning"
        });
        _self.cashloading = false;
        return false;
      }
      var tableList = [];
      var newdatas = {};
      for (var i = 0; i < _self.tableData.length; i++) {
        newdatas = {
          amount: _self.tableData[i].order_amount,
          production_code: _self.tableData[i].production_code,
          production_name: _self.tableData[i].productionName,
          size: _self.tableData[i].unit,
          bar_code: _self.tableData[i].bar_code
        };
        tableList.push(newdatas);
      }
      var listbox = {
        list: tableList,
        warehouse_code: _self.shopcodedata
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
            let formDatamenu = new FormData();
            formDatamenu.append("token", _self.token);
            formDatamenu.append("shopCode", _self.shopcode);
            formDatamenu.append("payment", money2);
            formDatamenu.append("cartOrderCode", _self.cartOrderCodeNum);
            formDatamenu.append("sales", _self.salesnum);
            _self.axios
              .post(_self.ApiUrls + "/buyer/createUserOrder", formDatamenu, {
                // 单独配置
                withCredentials: false
              })
              .then(response => {
                let orderdetailcode = response.data.data.orderCode;
                if (response.data.errcode == "0") {
                  _self.zhehoumoneyt = "";
                  _self.serialnum = "";
                  _self.salesnum = "";
                  _self.actualprices = "";
                  _self.cartOrderCodeNum = "";
                  _self.yingzhao = "0";
                  _self.inputShow.value = "0";
                  _self.clickedcash = -1;
                  _self.shopdetail();
                  _self.shouyinname = _self.username;
                  if (_self.Writeoffstate.length == undefined) {
                    if (
                      _self.addCartCouponBox != "" ||
                      _self.addCartCouponBox != undefined
                    ) {
                      for (var i = 0; i < _self.addCartCouponBox.length; i++) {
                        _self.getwriteoff(
                          orderdetailcode,
                          _self.addCartCouponBox[i].coupon_code,
                          param => {
                            if (param == 2) {
                              return;
                            } else {
                              _self.getmoney(
                                "xianjin01",
                                orderdetailcode,
                                "成功",
                                "现金",
                                money2
                              );
                            }
                          }
                        );
                      }
                    }
                  } else {
                    _self.getmoney(
                      "xianjin01",
                      orderdetailcode,
                      "成功",
                      "现金",
                      money2
                    );
                  }
                } else {
                  _self.$message.error("创建订单失败，请重试");
                  _self.cashloading = false;
                }
              })
              .catch(function(error) {
                _self.$message.error("响应时间过长，请重试");
              });
          } else {
            _self.Errorprompttable = response.data.data.msgList;
            _self.Errorprompt = true;
            _self.cashloading = false;
            return false;
          }
        })
        .catch(function(error) {
          _self.$message.error("保存响应时间过长，请重试");
        });
    },
    getmoney(payCode, orderCode, payFeed, source, payAmount) {
      let _self = this;
      let formData2 = new FormData();
      formData2.append("state", 1);
      formData2.append("payCode", payCode);
      formData2.append("orderCode", orderCode);
      formData2.append("payFeed", payFeed);
      formData2.append("source", source);
      formData2.append("payAmount", payAmount);
      formData2.append("userKey", "");
      formData2.append("shopCode", _self.shopcode);
      //发送请求
      _self.axios
        .post(_self.ApiUrls + "/buyer/writeOrderPayTrace", formData2, {
          // 单独配置
          withCredentials: false
        })
        .then(response => {
          if (response.data.errcode == "0") {
            var serialNumber = response.data.data.serialNumber;
            _self.$message({
              type: "success",
              message: "付款成功，请前往今日订单查看"
            });
            _self.Writeoffstate = "";
            if (
              _self.addCartCouponBox != "" ||
              _self.addCartCouponBox != undefined
            ) {
              for (var i = 0; i < _self.addCartCouponBox.length; i++) {
                _self.CouponTraceState(_self.addCartCouponBox[i].coupon_code);
              }
            }

            _self.cashloading = false;
            _self.summary();
            let formData3 = new FormData();
            formData3.append("shopCode", _self.shopcode);
            formData3.append("orderCode", orderCode);
            formData3.append("serialNumber", serialNumber);
            //发送请求
            _self.axios
              .post(_self.ApiUrl + "/catering/cashSettlement", formData3)
              .then(response => {
                if (response.data.errcode == "0") {
                  _self.moneyzhe = "";
                  _self.shopdetail();
                  _self.goodslist = response.data.data;
                  var json = _self.goodslist;
                  //打印
                  _self.print(_self.goodslist);
                  //打印结束
                  _self.moneyzhe = "";
                } else {
                  _self.$message.error("打印菜单加载失败");
                  _self.moneyzhe = "";

                  _self.shopdetail();
                }
              })
              .catch(function(error) {
                _self.$message.error("响应时间过长，请重试");
              });
          } else {
            let formData2 = new FormData();
            formData2.append("state", 0);
            formData2.append("payCode", "xianjin01");
            formData2.append("orderCode", orderCode);
            formData2.append("payFeed", "失败");
            formData2.append("source", "现金");
            formData2.append("payAmount", payAmount);
            formData2.append("userKey", "");
            formData2.append("shopCode", _self.shopcode);
            //发送请求
            _self.axios
              .post(_self.ApiUrls + "/buyer/writeOrderPayTrace", formData2, {
                // 单独配置
                withCredentials: false
              })
              .then(response => {
                if (response.data.errcode == "0") {
                  _self.shopdetail();
                  _self.Writeoffstate = "";
                  _self.$message({
                    type: "error",
                    message: "现金支付失败，请重新操作"
                  });
                  _self.cashloading = false;
                } else {
                  _self.$message.error("现金支付失败未写入");
                }
              })
              .catch(function(error) {
                _self.$message.error("响应时间过长，请重试");
              });
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    Membershipbtn() {
      let _self = this;

      if (
        _self.tableData == "" ||
        _self.tableData == null ||
        _self.tableData == undefined
      ) {
        _self.$message({
          type: "warning",
          message: "您还没有添加任何商品哦！",
          duration: 10000,
          showClose: true
        });
        return false;
      }
      _self.Paymentvisible = true;
      _self.$nextTick(function() {
        //DOM 更新了
        _self.$refs.codeVal2.focus();
      });
    },
    //会员支付
    Membershipup() {
      let _self = this;
      _self.cashloading = true;
      _self.dialogVisible = false;
      var money2 = _self.allmenudate.allPayment;
      var moneys = _self.allmenudate.allPayment * 100;
      moneys = parseInt(moneys);
      if (
        _self.salesnum == null ||
        _self.salesnum == "" ||
        (_self.salesnum.length > 0 && _self.salesnum.trim().length == 0)
      ) {
        _self.$message({
          type: "warning",
          message: "您还没有输入售卖员工号！",
          duration: 10000,
          showClose: true
        });
        _self.cashloading = false;
        return false;
      }
      var reg = /^\d{1,10}$/;

      if (!reg.test(_self.salesnum)) {
        _self.$message({
          type: "warning",
          message: "售卖员工号您只能输入0到9的数字！",
          duration: 10000,
          showClose: true
        });
        _self.cashloading = false;
        return false;
      }
      if (
        _self.cartOrderCodeNum == "" ||
        _self.cartOrderCodeNum == undefined ||
        _self.cartOrderCodeNum == null
      ) {
        _self.$message({
          message: "您的购物车单号为空请重新添加商品",
          type: "warning"
        });
        _self.cashloading = false;
        return false;
      }
      if (_self.money2 < 0) {
        _self.$message({
          message: "您的金额不能为负数哦！",
          type: "warning"
        });
        _self.cashloading = false;
        return false;
      }
      var tableList = [];
      var newdatas = {};
      for (var i = 0; i < _self.tableData.length; i++) {
        newdatas = {
          amount: _self.tableData[i].order_amount,
          production_code: _self.tableData[i].production_code,
          production_name: _self.tableData[i].productionName,
          size: _self.tableData[i].unit,
          bar_code: _self.tableData[i].bar_code
        };
        tableList.push(newdatas);
      }
      var listbox = {
        list: tableList,
        warehouse_code: _self.shopcodedata
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
            let formDatamenu = new FormData();
            formDatamenu.append("token", _self.token);
            formDatamenu.append("shopCode", _self.shopcode);
            formDatamenu.append("payment", money2);
            formDatamenu.append("cartOrderCode", _self.cartOrderCodeNum);
            formDatamenu.append("sales", _self.salesnum);
            _self.axios
              .post(_self.ApiUrls + "/buyer/createUserOrder", formDatamenu, {
                // 单独配置
                withCredentials: false
              })
              .then(response => {
                let orderdetailcode = response.data.data.orderCode;
                if (response.data.errcode == "0") {
                  if (_self.Writeoffstate.length == undefined) {
                    if (
                      _self.addCartCouponBox != "" ||
                      _self.addCartCouponBox != undefined
                    ) {
                      for (var i = 0; i < _self.addCartCouponBox.length; i++) {
                        _self.getwriteoff(
                          orderdetailcode,
                          _self.addCartCouponBox[i].coupon_code,
                          param => {
                            if (param == 2) {
                              return;
                            } else {
                              _self.getuseverifys(
                                moneys,
                                orderdetailcode,
                                money2
                              );
                            }
                          }
                        );
                      }
                    }
                  } else {
                    _self.getuseverifys(moneys, orderdetailcode, money2);
                  }
                } else {
                  _self.$message.error("创建订单失败，请重试");
                  _self.cashloading = false;
                }
              })
              .catch(function(error) {
                _self.$message.error("响应时间过长，请重试");
              });
          } else {
            _self.Errorprompttable = response.data.data.msgList;
            _self.Errorprompt = true;
            _self.Paymentvisible = false;
            _self.cashloading = false;
            return false;
          }
        })
        .catch(function(error) {
          _self.$message.error("保存响应时间过长，请重试");
        });
    },
    getuseverifys(fee, orderid, money2n) {
      let _self = this;
      let formDa = new FormData();
      formDa.append("verifycode", _self.PaymentCode);
      formDa.append("fee", fee);
      formDa.append("phone", _self.username);
      formDa.append("orderid", orderid);
      formDa.append("shopname", _self.typename);
      formDa.append("shopcode", _self.shopcode);
      _self.axios
        .post(_self.ApiUrlMember2 + "/mem/stored/useverifycode", formDa, {
          // 单独配置
          withCredentials: false
        })
        .then(response => {
          if (
            response.data.errcode == "0" &&
            response.data.data.result_code == "SUCCESS" &&
            response.data.data.fee == fee &&
            response.data.data.orderid == orderid &&
            response.data.data.out_trade_no != undefined &&
            response.data.data.out_trade_no != ""
          ) {
            var out_trade_no = response.data.data.out_trade_no;
            _self.zhehoumoneyt = "";
            _self.serialnum = "";
            _self.salesnum = "";
            _self.actualprices = "";
            _self.cashloading = false;
            _self.cartOrderCodeNum = "";
            if (
              _self.addCartCouponBox != "" ||
              _self.addCartCouponBox != undefined
            ) {
              for (var i = 0; i < _self.addCartCouponBox.length; i++) {
                _self.CouponTraceState(_self.addCartCouponBox[i].coupon_code);
              }
            }
            _self.yingzhao = "0";
            _self.inputShow.value = "0";
            _self.clickedcash = -1;
            _self.shopdetail();
            _self.shouyinname = _self.username;
            let formData2 = new FormData();
            formData2.append("state", 1);
            formData2.append("payCode", out_trade_no);
            formData2.append("orderCode", orderid);
            formData2.append("payFeed", "成功");
            formData2.append("source", "会员");
            formData2.append("payAmount", money2n);
            formData2.append("userKey", "");
            formData2.append("shopCode", _self.shopcode);
            //发送请求
            _self.axios
              .post(_self.ApiUrls + "/buyer/writeOrderPayTrace", formData2, {
                // 单独配置
                withCredentials: false
              })
              .then(response => {
                if (response.data.errcode == "0") {
                  var serialNumber = response.data.data.serialNumber;
                  _self.$message({
                    type: "success",
                    message: "付款成功，请前往今日订单查看"
                  });
                  _self.PaymentCode = "";
                  _self.Paymentvisible = false;
                  _self.summary();
                  let formData3 = new FormData();
                  formData3.append("shopCode", _self.shopcode);
                  formData3.append("orderCode", orderid);
                  formData3.append("serialNumber", serialNumber);
                  //发送请求
                  _self.axios
                    .post(_self.ApiUrl + "/catering/cashSettlement", formData3)
                    .then(response => {
                      if (response.data.errcode == "0") {
                        _self.moneyzhe = "";
                        _self.shopdetail();
                        _self.goodslist = response.data.data;
                        var json = _self.goodslist;
                        //打印
                        _self.print(_self.goodslist);
                        //打印结束
                        _self.moneyzhe = "";
                      } else {
                        _self.$message.error("打印菜单加载失败");
                        _self.moneyzhe = "";

                        _self.shopdetail();
                      }
                    })
                    .catch(function(error) {
                      _self.$message.error("响应时间过长，请重试");
                    });
                } else {
                }
              })
              .catch(function(error) {
                _self.$message.error("响应时间过长，请重试");
              });
          } else {
            var msg = response.data.errmsg;
            let formDatas = new FormData();
            if (
              response.data.data.out_trade_no == undefined ||
              response.data.data.out_trade_no == null
            ) {
              var outtradeno = "";
            } else {
              var outtradeno = response.data.data.out_trade_no;
            }
            formDatas.append("outtradeno", outtradeno);
            formDatas.append("verifycode", _self.PaymentCode);
            _self.axios
              .post(_self.ApiUrlMember2 + "/mem/stored/checkdeal", formDatas, {
                // 单独配置
                withCredentials: false
              })
              .then(response => {
                if (
                  response.data.errcode == "0" &&
                  response.data.data.info.debit == fee &&
                  response.data.data.info.verifyCode == _self.PaymentCode &&
                  response.data.data.info.outTradeNo != "" &&
                  response.data.data.info.outTradeNo != undefined
                ) {
                  var out_trade_no = response.data.data.info.outTradeNo;
                  _self.zhehoumoneyt = "";
                  _self.serialnum = "";
                  _self.salesnum = "";
                  _self.actualprices = "";
                  _self.cashloading = false;
                  _self.cartOrderCodeNum = "";
                  _self.yingzhao = "0";
                  if (
                    _self.addCartCouponBox != "" ||
                    _self.addCartCouponBox != undefined
                  ) {
                    for (var i = 0; i < _self.addCartCouponBox.length; i++) {
                      _self.CouponTraceState(
                        _self.addCartCouponBox[i].coupon_code
                      );
                    }
                  }

                  _self.inputShow.value = "0";
                  _self.clickedcash = -1;
                  _self.shopdetail();
                  _self.shouyinname = _self.username;
                  let formData2 = new FormData();
                  formData2.append("state", 1);
                  formData2.append("payCode", out_trade_no);
                  formData2.append("orderCode", orderid);
                  formData2.append("payFeed", "成功");
                  formData2.append("source", "会员");
                  formData2.append("payAmount", money2n);
                  formData2.append("userKey", "");
                  formData2.append("shopCode", _self.shopcode);
                  //发送请求
                  _self.axios
                    .post(
                      _self.ApiUrls + "/buyer/writeOrderPayTrace",
                      formData2,
                      {
                        // 单独配置
                        withCredentials: false
                      }
                    )
                    .then(response => {
                      if (response.data.errcode == "0") {
                        var serialNumber = response.data.data.serialNumber;
                        _self.$message({
                          type: "success",
                          message: "付款成功，请前往今日订单查看"
                        });
                        _self.PaymentCode = "";
                        _self.Paymentvisible = false;
                        _self.summary();
                        let formData3 = new FormData();
                        formData3.append("shopCode", _self.shopcode);
                        formData3.append("orderCode", orderid);
                        formData3.append("serialNumber", serialNumber);
                        //发送请求
                        _self.axios
                          .post(
                            _self.ApiUrl + "/catering/cashSettlement",
                            formData3
                          )
                          .then(response => {
                            if (response.data.errcode == "0") {
                              _self.moneyzhe = "";
                              _self.shopdetail();
                              _self.goodslist = response.data.data;
                              var json = _self.goodslist;
                              //打印
                              _self.print(_self.goodslist);
                              //打印结束
                              _self.moneyzhe = "";
                            } else {
                              _self.$message.error("打印菜单加载失败");
                              _self.moneyzhe = "";

                              _self.shopdetail();
                            }
                          })
                          .catch(function(error) {
                            _self.$message.error("响应时间过长，请重试");
                          });
                      } else {
                        let formData2 = new FormData();
                        formData2.append("state", 0);
                        formData2.append("payCode", out_trade_no);
                        formData2.append("orderCode", orderid);
                        formData2.append("payFeed", "失败");
                        formData2.append("source", "会员");
                        formData2.append("payAmount", money2n);
                        formData2.append("userKey", "");
                        formData2.append("shopCode", _self.shopcode);
                        //发送请求
                        _self.axios
                          .post(
                            _self.ApiUrls + "/buyer/writeOrderPayTrace",
                            formData2,
                            {
                              // 单独配置
                              withCredentials: false
                            }
                          )
                          .then(response => {
                            if (response.data.errcode == "0") {
                              _self.shopdetail();
                              _self.$message({
                                type: "error",
                                message: "会员支付失败，请重新操作"
                              });

                              _self.Paymentvisible = false;
                            } else {
                              _self.$message.error("会员支付失败未写入");
                            }
                          })
                          .catch(function(error) {
                            _self.$message.error("响应时间过长，请重试");
                          });
                      }
                    })
                    .catch(function(error) {
                      _self.$message.error("响应时间过长，请重试");
                    });
                } else {
                  _self.$alert(response.data.errmsg + msg, "异常提示", {
                    confirmButtonText: "确定"
                  });
                  let formData = new FormData();
                  formData.append("orderCode ", orderid);
                  if (out_trade_no == undefined) {
                    formData.append("payCode ", "");
                  } else {
                    formData.append("payCode ", out_trade_no);
                  }
                  formData.append("payBarCode", _self.PaymentCode);
                  formData.append("api", "会员");
                  formData.append("result", response.data.errmsg + msg);
                  _self.axios
                    .post(_self.ApiUrls + "/pay/payApitrace", formData, {
                      // 单独配置
                      withCredentials: false
                    })
                    .then(response => {
                      if (response.data.errcode == "0") {
                        _self.PaymentCode = "";
                      }
                    })
                    .catch(function(error) {
                      _self.$message.error("记录支付异常没有响应");
                    });
                  _self.shopdetail();
                  _self.Paymentvisible = false;

                  _self.cashloading = false;
                }
              })
              .catch(function(error) {
                _self.$message.error("支付验证响应时间过长，请重试");
              });
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    //加载购物车单号
    LoadShoppinCartNumber() {
      let _self = this;
      let formDatas = new FormData();
      formDatas.append("token", _self.token);
      _self.axios
        .post(
          _self.ApiUrls + "/buyer/getUserShoppingCartNewestCartOrderCode",
          formDatas,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if (response.data.errcode == "0") {
            _self.cartOrderCodeNum = response.data.data.cartOrderCode;
            _self.shopdetail();
          } else {
            _self.$message.error("加载购物车单号失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    //购物车详情
    shopdetail() {
      let _self = this;
      if (_self.cartOrderCodeNum != "") {
        let formData2 = new FormData();
        formData2.append("cartOrderCode", _self.cartOrderCodeNum);
        formData2.append("shopCode", _self.shopcode);

        _self.axios
          .post(
            _self.ApiUrls + "/buyer/getResaleShopingCartDetail",
            formData2,
            {
              // 单独配置
              withCredentials: false
            }
          )
          .then(response => {
            if (response.data.errcode == "0") {
              _self.allmenudate = response.data.data;
              _self.actualprices = response.data.data.discountAllPayment;
              _self.totalCount = response.data.data.totalCount;
              _self.tableData = response.data.data.data;
            } else {
              _self.$message.error(response.data.errmsg);
            }
          })
          .catch(function(error) {
            _self.$message.error("响应时间过长，请重试");
          });
      } else {
        _self.tableData = [];

        _self.allmenudate = "";
      }
    },
    //添加购物车
    searchGoods(event) {
      let _self = this;
      console.log(event);
      if (event.keyCode == 13) {
        event.preventDefault(); //禁止默认事件（默认是换行）

        if (_self.tableData == "") {
          let formData2 = new FormData();
          _self.axios
            .post(_self.ApiUrls + "/buyer/createCartOrderCode", formData2, {
              // 单独配置
              withCredentials: false
            })
            .then(response => {
              if (response.data.errcode == "0") {
                console.log(response);
                _self.cartOrderCodeNum = response.data.data.cartOrderCode;
                // var codes = _self.code.replace(/\s*/g,'');
                let formData = new FormData();
                formData.append("shopCode", _self.shopcode);
                formData.append("token", _self.token);
                formData.append("productionNum", _self.code);
                formData.append("cartOrderCode", _self.cartOrderCodeNum);
                _self.axios
                  .post(
                    _self.ApiUrls + "/buyer/scanningAddProductionToShoppingCar",
                    formData,
                    {
                      // 单独配置
                      withCredentials: false
                    }
                  )
                  .then(response => {
                    if (response.data.errcode == "0") {
                      _self.shopdetail();
                      _self.jujiao();
                      _self.code = "";
                    } else {
                      _self.$message.error(response.data.errmsg);
                    }
                  })
                  .catch(function(error) {
                    _self.$message.error("响应时间过长，请重试");
                  });
              } else {
                _self.$message.error("获取购物车单号失败，请重新获取");
              }
            })
            .catch(function(error) {
              _self.$message.error("响应时间过长，请重试");
            });
        } else {
          let formData = new FormData();
          formData.append("shopCode", _self.shopcode);
          formData.append("token", _self.token);
          formData.append("productionNum", _self.code);
          formData.append("cartOrderCode", _self.cartOrderCodeNum);
          _self.axios
            .post(
              _self.ApiUrls + "/buyer/scanningAddProductionToShoppingCar",
              formData,
              {
                // 单独配置
                withCredentials: false
              }
            )
            .then(response => {
              if (response.data.errcode == "0") {
                _self.shopdetail();
                _self.jujiao();
                _self.code = "";
              } else {
                _self.$message.error(response.data.errmsg);
              }
            })
            .catch(function(error) {
              _self.$message.error("响应时间过长，请重试");
            });
        }
      }
    },
    //聚焦
    jujiao() {
      let _self = this;
      _self.$nextTick(function() {
        //DOM 更新了
        _self.$refs.inputVal.focus();
      });
      // 				_self.timeOut = setTimeout(() => {
      // 					_self.jujiao();
      // 				},10000);
    },
    // 数量加
    add(index) {
      let _self = this;
      _self.loadings = true;

      let formData = new FormData();
      //formData.append('token', _self.token);
      formData.append("userId", _self.id);
      formData.append("shopCode", _self.shopcode);
      formData.append("cartOrderCode", _self.cartOrderCodeNum);
      formData.append("productionCode", index.production_code);
      formData.append("amount", "1");
      formData.append("discountRate", "1");
      formData.append("discountType", index.discount_type);
      formData.append("price", index.promotional_price);

      _self.axios
        .post(_self.ApiUrls + "/buyer/addResalesShoppingCar", formData, {
          // 单独配置
          withCredentials: false
        })
        .then(response => {
          if (response.data.errcode == "0") {
            _self.loadings = false;
            _self.moneyzhe = "";
            _self.shopdetail();
            _self.jujiao();
          } else {
            _self.loadings = false;
            _self.$message.error(response.data.errmsg);
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    //数量减
    cuts(index) {
      let _self = this;
      _self.dialogVisible = false;
      _self.loadings2 = true;
      let formData = new FormData();
      formData.append("cartOrderCode", _self.cartOrderCodeNum);
      formData.append("productionCode", index.production_code);
      formData.append("discountType ", index.discount_type);
      _self.axios
        .post(
          _self.ApiUrls + "/buyer/deleteShoppingCarSingleProduction",
          formData,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if (response.data.errcode == "0") {
            _self.loadings2 = false;
            _self.moneyzhe = "";
            _self.shopdetail();
            _self.jujiao();
          } else {
            _self.$message.error("商品删减失败，请重新添加商品");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    summary() {
      let _self = this;
      var day2 = new Date();
      day2.setTime(day2.getTime());
      var s2 =
        day2.getFullYear() +
        "-" +
        (day2.getMonth() + 1) +
        "-" +
        day2.getDate() +
        " " +
        "00:00:00";

      var day1 = new Date();
      day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
      var s1 =
        day1.getFullYear() +
        "-" +
        (day1.getMonth() + 1) +
        "-" +
        day1.getDate() +
        " " +
        "00:00:00";

      var day3 = new Date();
      day3.setTime(day3.getTime() + 24 * 60 * 60 * 1000);
      var s3 =
        day3.getFullYear() +
        "-" +
        (day3.getMonth() + 1) +
        "-" +
        day3.getDate() +
        " " +
        "00:00:00";

      let formData = new FormData();
      formData.append("shopCode", _self.shopcode);
      formData.append("startTime", s2);
      formData.append("endTime", s3);
      formData.append("classes", "全天");
      formData.append("userName", "中台");
      _self.axios
        .post(_self.ApiUrl + "/catering/getPeriodOfTimePayment", formData)
        .then(response => {
          if (response.data.errcode == "0") {
            _self.todaymoney = response.data.data.totalMoney;
            _self.dan1 = response.data.data.totalAmount;
          } else {
            _self.$message.error("数据找不到啦，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    //打印
    print(goodslist) {
      let _self = this;
      var qs = require("qs");
      //结束
      console.log(goodslist);
      var hPos = 10, //小票上边距
        pageWidth = 580, //小票宽度
        rowHeight = 15, //小票行距
        //获取控件对象
        LODOP = getLodop(
          document.getElementById("LODOP_OB"),
          document.getElementById("LODOP_EM")
        );
      //初始化
      LODOP.PRINT_INIT("");
      //消费小票********************************************************************************************************
      LODOP.SET_PRINT_STYLE("FontSize", 9); //字体大小
      LODOP.ADD_PRINT_TEXT(hPos, 60, pageWidth, rowHeight, goodslist.shop);

      hPos += rowHeight;
      LODOP.ADD_PRINT_TEXT(hPos, 60, pageWidth, rowHeight, "零售收款单");
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
      LODOP.ADD_PRINT_TEXT(
        hPos,
        60,
        pageWidth,
        rowHeight,
        goodslist.customer_service_number
      );
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
          LODOP.ADD_PRINT_TEXT(
            hPos,
            1,
            pageWidth,
            rowHeight,
            goodslist.goodsList[i].bar_code +
              goodslist.goodsList[i].productionName
          );
          hPos += rowHeight;
        } else if (
          goodslist.goodsList[i].productionName.length > 12 ||
          goodslist.goodsList[i].bar_code.length > 12
        ) {
          LODOP.ADD_PRINT_TEXT(
            hPos,
            1,
            pageWidth,
            rowHeight,
            goodslist.goodsList[i].bar_code
          );
          hPos += rowHeight;
          LODOP.ADD_PRINT_TEXT(
            hPos,
            1,
            pageWidth,
            rowHeight,
            goodslist.goodsList[i].productionName
          );
          hPos += rowHeight;
        } else {
          LODOP.ADD_PRINT_TEXT(
            hPos,
            1,
            pageWidth,
            rowHeight,
            goodslist.goodsList[i].bar_code +
              goodslist.goodsList[i].productionName
          );
          hPos += rowHeight;
        }
        LODOP.ADD_PRINT_TEXT(
          hPos,
          1,
          pageWidth,
          rowHeight,
          goodslist.goodsList[i].orderAmount
        );
        LODOP.ADD_PRINT_TEXT(
          hPos,
          50,
          pageWidth,
          rowHeight,
          goodslist.goodsList[i].payAmount
        );
        LODOP.ADD_PRINT_TEXT(
          hPos,
          95,
          pageWidth,
          rowHeight,
          goodslist.goodsList[i].actual_amount
        );
        LODOP.ADD_PRINT_TEXT(
          hPos,
          150,
          pageWidth,
          rowHeight,
          parseInt(goodslist.goodsList[i].discountRate * 100) + "%"
        );
        hPos += rowHeight;
      }
      //商品遍历打印完毕,空一行
      hPos += rowHeight;
      LODOP.ADD_PRINT_LINE(hPos, 2, hPos, pageWidth, 2, 1);
      hPos += 5;
      //合计
      LODOP.ADD_PRINT_TEXT(
        hPos,
        70,
        pageWidth,
        rowHeight,
        "合计数量：" + goodslist.totalCount
      );
      // hPos += rowHeight;
      // LODOP.ADD_PRINT_TEXT(
      //   hPos,
      //   70,
      //   pageWidth,
      //   rowHeight,
      //   "合计金额：" + goodslist.orderPayment
      // );
      hPos += rowHeight;
      LODOP.ADD_PRINT_TEXT(
        hPos,
        70,
        pageWidth,
        rowHeight,
        "实销金额：" + goodslist.total
      );
      hPos += rowHeight;
      LODOP.ADD_PRINT_TEXT(
        hPos,
        70,
        pageWidth,
        rowHeight,
        "抹零金额：" + goodslist.maLing
      );
      hPos += rowHeight;
      LODOP.ADD_PRINT_LINE(hPos, 2, hPos, pageWidth, 2, 1);
      hPos += 5;
      LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, "本次收款金额：");
      hPos += rowHeight;
      LODOP.ADD_PRINT_TEXT(
        hPos,
        80,
        pageWidth,
        rowHeight,
        goodslist.paymentMethod
      );

      LODOP.ADD_PRINT_TEXT(
        hPos,
        120,
        pageWidth,
        rowHeight,
        "￥" + goodslist.total
      );
      hPos += rowHeight;
      LODOP.ADD_PRINT_LINE(hPos, 2, hPos, pageWidth, 2, 1);
      hPos += 5;
      LODOP.ADD_PRINT_TEXT(
        hPos,
        2,
        pageWidth,
        rowHeight,
        new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()
      );
      hPos += rowHeight;
      LODOP.ADD_PRINT_TEXT(
        hPos,
        25,
        pageWidth,
        rowHeight,
        "谢谢惠顾,欢迎下次光临!"
      );
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
            _self.shopcodedata = response.data.data.list[0].warehouse_code;
          } else {
            _self.$message.error("获取仓库失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    }
  },

  created: function() {
    let _self = this;
    _self.LoadShoppinCartNumber();
    _self.jujiao();
    _self.shopdetail();
    _self.summary();
    _self.WarehouseSelection();
    // _self.moneydiscount();
    _self.shouyinname = _self.username;
    console.log(this.$store.state.userinfo.shopcode,'=-=-=');
    
    enumerationSorting({
      code: 'discount_privileges'
    }).then(res=>{
       res.data.data.commentsGroup.forEach(element => {
         if(this.$store.state.userinfo.shopcode === element.code){
           this.discountApp = false
         }
       });
    })
  }
};
</script>

<style>
.app-contion {
  margin: 10px;
}

.fonts {
  font-size: 14px;
}

.margintops {
  margin-top: 20px;
  margin-bottom: 10px;
}

.retailfooter {
  padding: 10px;
  position: relative;
  /* 	bottom: 0;
		left: 201px;
		right: 0; */
  background: white;
}

.codestyle {
  display: inline-block;
  line-height: 2.5rem;
  font-size: 0.875rem;
}

.footernew {
  width: 30%;
  position: fixed;
  right: 0;
  top: 58px;
  padding: 15px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  height: 100%;
  z-index: 10;
}

.disflex {
  display: flex;
  float: left;
}

.font-n {
  font-size: 16px;
}

.colortest {
  color: red;
  font-size: 26px;
  margin: 0 10px;
}

.retail-btn {
  padding: 15px 22px;
  margin-top: 0.3125rem;
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
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  outline: 0;
  padding: 0 15px;
  -webkit-transition: border-colorsn 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-colorsn 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
  margin-left: 10px;
}

.retailfooterbox {
  float: right;
}

a {
  outline-style: none;
  color: #535353;
  text-decoration: none;
}

a:hover {
  color: #d40000;
  text-decoration: none;
}

.clear {
  height: 0;
  overflow: hidden;
  clear: both;
}

/* calculator */
#calculator {
  width: 50%;
  height: 245px;
  padding: 10px;
  border: 1px solid #e5e5e5;
  background: #f8f8f8;
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  border-radius: 3px;
  box-shadow: 0px 0px 10px #f2f2f2;
  -moz-box-shadow: 0px 0px 10px #f2f2f2;
  -webkit-box-shadow: 0px 0px 10px #f2f2f2;
  margin-left: 1.25rem;
  margin-top: 0.625rem;
}

#calculator #input-box {
  margin: 0;
  width: 100%;
  padding: 9px 5px;
  height: 14px;
  border: 1px solid #e5e5e5;
  border-radius: 3px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  background: #fff;
  text-align: right;
  line-height: 14px;
  font-size: 12px;
  font-family: Verdana, Geneva, sans-serif;
  color: #666;
  outline: none;
  text-transform: uppercase;
}

#calculator #btn-list {
  width: 100%;
  overflow: hidden;
}

#calculator #btn-list .btn-radius {
  border-radius: 2px;
  -webkit-border-radius: 2px;
  -moz-border-radius: 2px;
  border: 1px solid #e5e5e5;
  background: -webkit-gradient(linear, 0 0, 0 100%, from(#f7f7f7), to(#ebebeb));
  background: -moz-linear-gradient(top, #f7f7f7, #ebebeb);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=#f7f7f7, endColorstr=#ebebeb, grandientType=1);
  line-height: 29px;
  text-align: center;
  text-shadow: 0px 1px 1px #fff;
  font-weight: bold;
  font-family: Verdana, Geneva, sans-serif;
  color: #666;
  float: left;
  margin-left: 1%;
  margin-top: 11px;
  font-size: 12px;
  cursor: pointer;
}

#calculator #btn-list .btn-radius:active {
  background: #ffffff;
}

#calculator #btn-list .clear-marginleft {
  margin-left: 0;
}

#calculator #btn-list .font-14 {
  font-size: 14px;
}

#calculator #btn-list .color-red {
  color: #ff5050;
}

#calculator #btn-list .color-blue {
  color: #00b4ff;
}

#calculator #btn-list .btn-30 {
  width: 22%;
  height: 18%;
}

#calculator #btn-list .btn-70 {
  width: 70px;
  height: 1.8125rem;
}

.adds {
  height: 30px;
  width: 30px;
  padding: 0;
  margin: 3px 0;
}

.margin-butoms {
  margin-bottom: 10px;
}

.spans {
  padding: 10px;
  display: inline-block;
  border: 1px solid #eaeaea;
  margin: 5px;
}

.SellerStyle {
  font-size: 0.875rem;
}

.border-colorsn {
  border: 1px solid #409eff !important;
}

.idcards span {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
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
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
  margin: 10px;
}

.close {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  font-weight: 500;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
  position: absolute;
  right: 10px;
  top: 10px;
}

.max-heights {
  margin-top: 15%;
  overflow: hidden;
  overflow-y: scroll;
}

.navemeun-span {
  margin: 0 10px;
  width: 33.3%;
  font-size: 16px;
}

.gua1 {
  position: absolute;
  right: 10px;
  top: 0px;
}

.navemeun {
  width: 100%;
  display: flex;
  border-top: 1px solid #dcdfe6;
  margin-top: 10px;
}

.navemeun-chirld {
  width: 50%;
  border-right: 1px solid #dcdfe6;
  padding: 10px;
  margin-top: 10px;
}

.continue {
  width: 50%;
  padding: 20px 10px 10px 10px;
  text-align: center;
  font-size: 18px;
  color: #67c23a;
  cursor: pointer;
}

.caidan {
  width: 96%;
  height: auto;
  border: 1px solid #ebebeb;
  border-radius: 3px;
  transition: 0.2s;
  margin-bottom: 20px;
  padding: 10px;
}

@media screen and (max-width: 986px) {
  .retail-btn {
    padding: 15px 22px;
  }
}

@media screen and (max-width: 923px) {
  .retail-btn {
    padding: 12px 20px;
  }
}

.intbox {
  display: inline;
}

.intbox .el-input__inner {
  height: 1.875rem;
  line-height: 1.875rem;
}

.el-form {
  margin: auto;
}
</style>
