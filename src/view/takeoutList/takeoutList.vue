<template>
  <div class="app-contion">
    <div class="block">
      <div style="width: 90%;">
        <el-date-picker
          v-model="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="至"
          start-placeholder="起始时间"
          end-placeholder="结束时间"
          style="width: 40%;"
          :picker-options="{'disabledDate': (time)=>{
				 return time.getTime() < new Date('2019-09-01  00:00:00');
			 }}"
        ></el-date-picker>
        <el-input v-model="strValue" style="width: 250px" placeholder="订单号、手机、姓名"></el-input>
        <el-button type="primary" plain @click="search">搜索</el-button>
        <el-button plain @click="prinAll">打印当前页</el-button>
        <el-button
          type="success"
          class="daochu"
          @click="exportExcel"
          style="top: 70px;display: inline-block"
        >导出</el-button>
      </div>
    </div>
    <el-table
      :data="tableData"
      v-loading="loading"
      border
      style="width: 100%;"
      tooltip-effect="dark"
      :height="tableHeight"
    >
      <el-table-column label="桌号" prop="seatNum" v-if="profilequeuetype == 'TABLE-NUM'"></el-table-column>
      <el-table-column :label="editRow" prop="serialNumber"></el-table-column>

      <el-table-column label="订单详情">
        <template slot-scope="scope">
          <el-button size="mini" @click="detailmenu(scope.$index, scope.row)">详情</el-button>
        </template>
      </el-table-column>
      <el-table-column  label="物流信息">
        <template slot-scope="scope">
          <span >{{scope.row.ship_state}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="comments" label="备注"></el-table-column>
      <el-table-column label="订单状态">
        <template slot-scope="scope">
          <span v-if="scope.row.orderState=== '0'">未支付</span>
          <span
            v-if="scope.row.orderState=== '1' || scope.row.orderState=== '4' || scope.row.orderState=== '5' || scope.row.orderState=== '6'"
          >已支付</span>
          <span v-if="scope.row.orderState=== '7'">已退款</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="重新打印" width="105" v-if="shopcode!='R_SAMCT'">
        <template slot-scope="scope">
          <div>
            <el-button
              size="mini"
              @click="MySendData(scope.$index, scope.row)"
              style="margin-bottom: 0.3125rem;"
            >小票打印</el-button>
          </div>
          <div>
            <el-button size="mini" @click="MySendData2(scope.$index, scope.row)">{{printText}}</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="退款">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="tuikuan(scope.$index, scope.row)"
            :disabled="scope.row.new_order_state=== '未支付'||ArrayListmanger!='open'||scope.row.source=='会员'"
          >退款</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="退款验证" width="105">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="Verification(scope.$index, scope.row)"
            :disabled="scope.row.new_order_state=== '未支付'||scope.row.source=='会员'"
          >退款验证</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="payAmount" label="订单金额"></el-table-column>
      <el-table-column prop="actualAmount" label="实际金额"></el-table-column>
      <el-table-column prop="source" label="支付方式"></el-table-column>
      <el-table-column prop="ship_address" label="地址"></el-table-column>
      <el-table-column prop="realname" label="联系人"></el-table-column>
      <el-table-column prop="tel" label="手机号"></el-table-column>
      <el-table-column prop="orderCode" label="订单号"></el-table-column>
      <el-table-column prop="create_at" label="下单时间"></el-table-column>
      <el-table-column fixed="right" label="操作" width="78">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="position: fixed;bottom: 0.625rem;right: 0;">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="current_change"
      ></el-pagination>
    </div>
    <!-- 弹出框 -->
    <el-dialog title="退换菜品" :visible.sync="dialogVisible" width="20%" :before-close="handleClose">
      <div style="margin-bottom: 15px;">
        <span>需退菜品：</span>
        <el-select v-model="tuicai" placeholder="请选择">
          <el-option
            v-for="(item,index1) in options2"
            :key="item.value"
            :label="item.label"
            :value="index1+1+'_'+item.value"
          ></el-option>
        </el-select>
      </div>
      <div style="margin-bottom: 25px;">
        <span>添加菜品：</span>
        <el-select v-model="tiancai" placeholder="请选择">
          <el-option
            v-for="(item,index2) in options"
            :key="item.value"
            :label="item.label"
            :value="index2+1+'_'+item.value"
          ></el-option>
        </el-select>
      </div>
      <div style="margin-bottom: 25px;">
        <span>实际金额：</span>
        <el-input v-model="Actualamount" placeholder="请输入内容" style="width: 64%;"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="exchangeup">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 弹出框桌号、备注 -->
    <el-dialog
      title="编辑"
      :visible.sync="dialogVisible2"
      width="500px"
      :before-close="handleClose"
      class="editorBill"
    >
      <div style="margin-bottom: 15px;" class="cell">
        <span>电话：</span>
        <el-input style="width:" v-model="ETel" placeholder="请修改" class="width-input"></el-input>
      </div>
      <div style="margin-bottom: 25px;" class="cell">
        <span>联系人：</span>
        <el-input
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入内容"
          v-model="ELinkman"
          class="width-input"
        ></el-input>
      </div>
      <div style="margin-bottom: 25px;" class="cell">
        <span>地址信息：</span>
        <el-input
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入内容"
          v-model="EAddress"
          class="width-input"
        ></el-input>
      </div>
      <div style="margin-bottom: 25px;" class="cell">
        <span>备注：</span>
        <el-input
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入内容"
          v-model="EComments"
          class="width-input"
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="handleEditup">确 定</el-button>
      </span>
    </el-dialog>
    <!--退款弹框-->
    <el-dialog title="退款" :visible.sync="tuikuanVisible" width="40%" :before-close="handleClose">
      <div style="margin-bottom: 15px;">
        <span style="width: 15%;display: inline-block;">退款菜品：</span>
        <span v-for="(item,index) in tableDatamenu" :key="index">{{index!==0?(',   '+item.name): item.name  }}</span>
        <!-- <el-select
          v-model="RefundDishes"
          placeholder="请选择退款菜品"
          style="width: 60%;"
          @change="RefundDishesChange($event)"
        >
          <el-option
            v-for="item in tableDatamenu"
            :key="item.name"
            :label="item.name"
            :value="item"
          ></el-option>
        </el-select> -->
      </div>
      <!-- <div style="margin-bottom: 15px;">
        <span style="width: 15%;display: inline-block;">退款数量：</span>
        <el-input
          v-model="NumberofRefunds"
          type="serch"
          placeholder="请输入退款数量"
          style="width: 60%;"
          @blur="AmountCalculation"
        ></el-input>
      </div> -->
      <div style="margin-bottom: 15px;">
        <span style="width: 15%;display: inline-block;">退款原因：</span>
        <el-select v-model="ReasonsforRefund" placeholder="请选择退款原因" style="width: 60%;">
          <el-option
            v-for="item in ReasonsforRefundBox"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
      </div>
      <!-- <div style="margin-bottom: 15px;">
        <span style="width: 15%;display: inline-block;">商户单号：</span>
        <el-input
          v-model="trade"
          ref="inputVal"
          id="inputVal"
          type="serch"
          placeholder="请输入商户单号"
          style="width: 60%;"
          @change="onChangeOrderNum"
        ></el-input>
      </div> -->
      <div style="margin-bottom: 15px;">
        <span style="width: 15%;display: inline-block;">退款合计：</span>
        <span style="color: red;font-size: 16px;">{{TotalRefund}}</span>
      </div>
      <!-- <div>
        <span style="width: 15%;display: inline-block;">退款金额：</span>
        <el-input v-model="refund" placeholder="请输入退款金额" style="width: 60%;"></el-input>
      </div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="tuikuanVisible = false">取 消</el-button>
        <el-button type="primary" @click="tuikuanup" :loading="loadwait">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 微信支付宝退款弹框 -->
    <el-dialog title="提示" :visible.sync="paymentpay" width="30%">
      <div style="width: 100%;display: flex;">
        <div style="margin-left: 10px;width: 50%;" @click="WeChat">
          <img src="../../assets/1.jpg" style="width: 100%;" />
        </div>
        <div style="margin-left: 10px;width: 50%;" @click="Alipay">
          <img src="../../assets/2.jpg" style="width: 100%;" />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="paymentpay = false">取 消</el-button>
        <el-button type="primary" @click="paymentpay = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 详情 -->
    <el-dialog title="详情" :visible.sync="menudetails" width="50%" :before-close="handleClose">
      <el-table
        :data="tableDatamenu"
        stripe
        border
        class="table-center"
        :height="280"
        style="width: 100%"
      >
        <el-table-column prop="name" :label="Tradename+'名'"></el-table-column>
        <el-table-column prop="price" :label="Tradename+'原价'"></el-table-column>
        <el-table-column prop="promotional_price" :label="Tradename+'实价'"></el-table-column>

        <el-table-column prop="order_amount" :label="Tradename+'数量'"></el-table-column>
        <el-table-column prop="actual_amount" label="小计"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="menudetails = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import { mapState } from "vuex";
import JsBarcode from "JsBarcode";
import { getLodop, needCLodop } from "../../vuex/LodopFuncs.js";
import {
  getShopAllDeliveryOrders,
  editOrderInformation,
  wxRefundQuery,
  getPayCode,
  shouShopPayBodyCode
} from "@/service";
import { tableToExcel } from "@/public";
import tuikuanJs from "./tuikuan";
export default {
  data() {
    return {
      ETel: "",
      ELinkman: "",
      EAddress: "",
      EComments: "",
      strValue: "",
      printText: "厨房打印",
      refund: "",
      trade: "",
      remark: "",
      ArrayListmanger: "",
      pagesize: 10,
      currentPage: 1,
      tableDatamenu: [],
      total: 0,
      input: "",
      orderCode: "",
      NumberofRefunds: 1, //退款数量
      ReasonsforRefund: "", //退款原因
      TotalRefund: 0, //退款合计
      ReasonsforRefundBox: [
        {
          name: "误点"
        },
        {
          name: "菜品问题"
        },
        {
          name: "卫生问题"
        }
      ],
      loading: true,
      RefundDishes: "",
      Actualamount: "",
      tableData: [],
      datetime: [],
      dialogVisible: false,
      dialogVisible2: false,
      tuikuanVisible: false,
      options: [],
      options2: [],
      tuicai: "",
      tiancai: "",
      zhuohao: "",
      can: "",
      shu: "",
      menudetails: false,
      jin: "",
      str: "",
      comments: "",
      productionCodetui: "",
      productionCodetian: "",
      jsondate: "",
      product: "",
      yanse: "#606266",
      xuhao: "0",
      actuals: "",
      orderCodedetail: "",
      source: "",
      actuals2: "",
      setTime: "",
      qrcode: "",
      tableHeight: window.innerHeight - 150,
      loadwait: false,
      totalfell: "",
      yinliancode: "",
      ChooseAmount: "", //选择菜品金额,
      Quantity: "", //商品数量,
      productionCode: "", //退菜商品编码
      discountTypeReasons: "", //退菜促销类型
      detailids: "",
      editRow: "餐牌号",
      Tradename: "菜品",
      pay_code: "",
      pay_body_code: ""
    };
  },
  computed: {
    ...mapState({
      username: state => state.userinfo.account,
      token: state => state.userinfo.token,
      id: state => state.userinfo.id,
      ArrayList: state => state.ArrayList,
      shopcode: state => state.userinfo.shopcode,
      shopname: state => state.ShopName.shopName,
      profilesettlement: state => state.ShopName.profile_settlement,
      profilequeuetype: state => state.ShopName.profile_queue_type,
      shopgroup: state => state.ShopName.shop_group
    })
  },
  methods: {
    async exportExcel() {
      let page = Math.ceil(this.total / 100);
      console.log(page, "page", this.total / 100);

      let allList = [];
      for (let i = 0; i < page; i++) {
        await getShopAllDeliveryOrders({
          shopCode: this.shopcode,
          pageNum: i,
          pageSize: 100,
          startTime: this.datetime[0] || null,
          endTime: this.datetime[1] || null,
          valueStr: this.strValue
        }).then(res => {
          res.data.data.data.list.forEach((item,index)=>{
          if(!item.ship_state){
            item.ship_state = '待发货'
          }
          })
          allList = allList.concat(res.data.data.data.list);
        });
      }
      console.log("allList", allList);
      let tHeader = [
        this.editRow,
        '物流信息',
        "备注",
        "订单状态",
        "订单金额",
        "实际金额",
        "支付方式",
        "地址",
        "联系人",
        "手机号",
        "订单号",
        "下单时间"
      ];
      let filterVal = [
        'ship_state',
        "serialNumber",
        "comments",
        "new_order_state",
        "payAmount",
        "actualAmount",
        "source",
        "ship_address",
        "realname",
        "tel",
        "orderCode",
        "create_at"
      ];
      tableToExcel(allList, tHeader, filterVal, "外卖全部订单");
    },
    onChangeOrderNum(value, event) {
      document.getElementById("inputVal").blur();
    },
    RefundDishesChange(Vid) {
      let _self = this;
      console.log(Vid);
      _self.RefundDishes = Vid.name;
      _self.ChooseAmount = Vid.promotional_price;
      _self.Quantity = Vid.order_amount;
      _self.productionCode = Vid.production_code;
      _self.discountTypeReasons = Vid.discount_type;
      _self.detailids = Vid.id;
      if (_self.NumberofRefunds > _self.Quantity) {
        _self.$message({
          message: "您输入的数量不能大于商品本身的数量哦",
          type: "warning"
        });
      }
      _self.NumberofRefunds = Number(_self.NumberofRefunds);
      _self.TotalRefund = parseFloat(
        (_self.NumberofRefunds * _self.ChooseAmount).toPrecision(12)
      );
    },
    AmountCalculation() {
      let _self = this;
      if (_self.NumberofRefunds > _self.Quantity) {
        _self.$message({
          message: "您输入的数量不能大于商品本身的数量哦",
          type: "warning"
        });
      }
      if (_self.NumberofRefunds == 0) {
        _self.$message({
          message: "您的数量为0哦",
          type: "warning"
        });
        return false;
      }
      _self.NumberofRefunds = Number(_self.NumberofRefunds);
      _self.TotalRefund = parseFloat(
        (_self.NumberofRefunds * _self.ChooseAmount).toPrecision(12)
      );
    },
    detailmenu(index) {
      let _self = this;
      _self.menudetails = true;
      _self.tableDatamenu = _self.tableData[index].odrOrderDetailList;
    },
    current_change: function(currentPage) {
      let _self = this;
      _self.currentPage = currentPage;
      this.search();
    },
    timechange() {
      var _self = this;
      let formDatatime = new FormData();
      formDatatime.append("code", "update_time");
      _self.axios
        .post(_self.ApiUrl + "/catering/enumerationSorting", formDatatime)
        .then(response => {
          if (response.data.errcode == "0") {
            _self.setTime =
              Number(response.data.data.commentsGroup[0].code) * 1000;
          } else {
            console.log("订单更新时间出错了");
          }
        })
        .catch(function(error) {
          console.log("订单更新时间响应时间过长");
        });
    },
    handleEdit(index, row) {
      this.dialogVisible2 = true;
      this.orderCode = this.tableData[index].orderCode;
      console.log(this.tableData[index], "this.tableData[index]");

      this.ETel = this.tableData[index].tel;
      this.EComments = this.tableData[index].comments;
      this.ELinkman = this.tableData[index].realname;
      this.EAddress = this.tableData[index].ship_address;
    },
    qucan(index) {
      let _self = this;
      if (_self.tableData[index].orderWay == "业务中台点餐") {
        console.log(_self.tableData[index]);
        var moneys = _self.tableData[index].actualAmount.toFixed(2);
        let formData = new FormData();
        formData.append("orderid", _self.tableData[index].orderCode);
        formData.append("shoping_name", _self.shopname);
        formData.append("foodnum", _self.tableData[index].serialNumber);
        formData.append("money", moneys);
        formData.append("order_status", _self.tableData[index].orderType);
        formData.append("paytime", _self.tableData[index].create_at);
        _self.axios
          .post(_self.realmphp + "fwhmsgxp.php", formData, {
            // 单独配置
            withCredentials: false
          })
          .then(response => {
            if (response.data.errcode == "0") {
              _self.$message({
                message: "已提醒顾客取餐",
                type: "success"
              });
            } else {
              _self.$message.error("用户没有扫描二维码，不能提醒顾客取餐");
            }
          })
          .catch(function(error) {
            _self.$message.error("数据响应过长，请重试");
          });
      } else {
        let formData = new FormData();
        formData.append("orderid", _self.tableData[index].orderCode);
        formData.append("foodnum", _self.tableData[index].serialNumber);
        _self.axios
          .post(_self.realmphp + "dzfmsgqctx2.php", formData, {
            // 单独配置
            withCredentials: false
          })
          .then(response => {
            if (response.data.errcode == "0") {
              _self.$message({
                message: "已提醒顾客取餐",
                type: "success"
              });
            } else {
              _self.$message.error("提醒取餐失败");
            }
          })
          .catch(function(error) {
            _self.$message.error("数据响应过长，请重试");
          });
      }
    },

    handleEditup() {
      editOrderInformation({
        orderCode: this.orderCode,
        tel: this.ETel,
        linkman: this.ELinkman,
        address: this.EAddress,
        comments: this.EComments
      })
        .then(res => {
          console.log(res.data);
          this.$message.success("修改成功");
          this.search();
          this.dialogVisible2 = false;
        })
        .catch(error => {});
    },
    //核销
    cancel(index, row) {
      let _self = this;
      let formData = new FormData();
      formData.append("orderCode", _self.tableData[index].orderCode);
      formData.append("userId", _self.id);
      // formData.append('productionCode', _self.product);
      _self.axios
        .post(_self.ApiUrl + "/catering/cancelAfterVerificationBtn", formData)
        .then(response => {
          if (response.data.errcode == "0") {
            this.$message({
              message: "核销成功",
              type: "success"
            });
            // _self.product=''
            _self.getstart();
          } else {
            _self.$message.error("核销失败");
          }
        })
        .catch(function(error) {
          _self.$message.error("数据响应时间过长，请重试");
        });
    },
    async Verification(index) {
      let _self = this;
      _self.orderCodedetail = _self.tableData[index].orderCode;
      await getPayCode({
        order_code: _self.orderCodedetail
      })
        .then(res => {
          _self.pay_code = res.data.data.data.pay_code;
        })
        .catch(error => {
          _self.$message.error("获取支付码失败");
        });
      await shouShopPayBodyCode({
        shop_code: _self.shopcode
      })
        .then(res => {
          _self.pay_body_code = res.data.data.data[0].pay_body_code;
        })
        .catch(error => {
          _self.$message.error("获取支付主体失败");
        });
      wxRefundQuery({
        pay_body_code: this.pay_body_code,
        pay_code: this.pay_code
      }).then(res => {
        if(res.data.errcode === 0){
          if(res.data.data.return_code == 'SUCCESS'){
            _self.$message.success('已退款'+res.data.data.refund_fee/100+'元')
          }else{
            _self.$message.error("未退款");
          }
        }else{
           _self.$message.error(res.data.errmsg);
        }
      })
      // .catch(error => {
      //     _self.$message.error("获取支付主体失败");
      //   });
    },
    //更换菜品
    exchange(index, row) {
      let _self = this;
      //_self.product='';
      _self.actualAmount = "";
      let formData = new FormData();
      let formData2 = new FormData();
      formData.append("shopCode", _self.shopcode);
      formData2.append("orderCode", _self.tableData[index].orderCode);
      _self.axios
        .post(
          _self.ApiUrl + "/catering/getOrderDetailAllProductionName",
          formData2
        )
        .then(response => {
          if (response.data.errcode == "0") {
            _self.dialogVisible = true;
            _self.options2 = response.data.data.data;
          } else {
            _self.$message.error("获取菜单失败");
          }
        })
        .catch(function(error) {
          _self.$message.error("error");
        });
      _self.axios
        .post(_self.ApiUrl + "/catering/getShopProduction", formData)
        .then(response => {
          if (response.data.errcode == "0") {
            _self.options = response.data.data.data;
          } else {
            _self.$message.error("获取菜单失败");
          }
        })
        .catch(function(error) {
          _self.$message.error("数据响应时间过长，请重试");
        });
    },
    //提交更换菜品
    exchangeup() {
      let _self = this;
      _self.product = "";
      var sex1 = _self.tuicai.indexOf("_");
      var sex1s = _self.tuicai.substring(sex1, -1);
      sex1s = sex1s - 1;
      var sex2 = _self.tiancai.indexOf("_");
      var sex2s = _self.tiancai.substring(sex2, -1);
      sex2s = sex2s - 1;

      let formData = new FormData();
      formData.append("orderCode", _self.options2[sex1s].orderCode);
      formData.append("newProductionCode", _self.options[sex2s].productionCode);
      formData.append(
        "oldProductionCode",
        _self.options2[sex1s].productionCode
      );
      formData.append("price", _self.options[sex2s].price);
      formData.append("actualAmount", _self.Actualamount);
      formData.append("userId", _self.id);
      formData.append("productionCate", _self.options[sex2s].categoryName);
      _self.axios
        .post(_self.ApiUrl + "/catering/replaceDishBtn", formData)
        .then(response => {
          console.log(response);
          if (response.data.errcode == "0") {
            //_self.product=response.data.data.data
            _self.dialogVisible = false;
            _self.tuicai = "";
            _self.tiancai = "";
            _self.actualAmount = "";
            console.log(_self.actualAmount);
            _self.getstart();
          } else {
            _self.$message.error("更换菜品失败");
          }
        })
        .catch(function(error) {
          _self.$message.error("数据响应时间过长，请重试");
        });
    },
    async prinAll() {
      let i = 0;
      for (let i = 0; i < 10; i++) {
        await this.MySendData(i);
      }
    },
    MySendData(index, row) {
      let _self = this;
      let namecode = "";

      let QrCodeTip = new FormData();
      QrCodeTip.append("str", "QrCode");
      _self.axios
        .post(_self.ApiUrl + "/catering/getQrCodeTip", QrCodeTip)
        .then(response => {
          if (response.data.errcode == "0") {
            namecode = response.data.data.data.value;
            let getorder = new FormData();
            getorder.append("orderid", _self.tableData[index].orderCode);
            _self.axios
              .post(_self.realmphp + "getorderqr.php", getorder, {
                // 单独配置
                withCredentials: false
              })
              .then(response => {
                if (response.data.expire_seconds == "86400") {
                  _self.qrcode = response.data.url;
                  let formData = new FormData();
                  formData.append(
                    "orderCode",
                    _self.tableData[index].orderCode
                  );
                  formData.append("shopCode", _self.shopcode);
                  formData.append("seatNum", _self.tableData[index].seatNum);
                  formData.append("comments", _self.comments);
                  formData.append("state", "0");
                  _self.axios
                    .post(_self.ApiUrl + "/catering/spreadFoodBtn", formData)
                    .then(response => {
                      if (response.data.errcode == "0") {
                        //创建小票打印页

                        _self.jsondate = response.data.data;
                        var json = _self.jsondate;
                        if (!json.waybill) {
                          json.waybill = {
                            realname: "",
                            tel: "",
                            ship_address: ""
                          };
                        }

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
                        //添加小票标题文本
                        LODOP.SET_PRINT_STYLE("FontSize", 20); //字体大小
                        if (json.diningLocation == "2") {
                          LODOP.ADD_PRINT_TEXT(
                            hPos,
                            40,
                            pageWidth,
                            rowHeight,
                            "德航配送"
                          );
                        } else {
                          LODOP.ADD_PRINT_TEXT(
                            hPos,
                            1,
                            pageWidth,
                            rowHeight,
                            json.customed_title
                          );
                          hPos += rowHeight;
                          hPos += rowHeight;
                          if (_self.profilequeuetype == "SERIAL") {
                            LODOP.ADD_PRINT_TEXT(
                              hPos,
                              60,
                              pageWidth,
                              rowHeight,
                              json.serialNumber
                            );
                          } else if (_self.profilequeuetype == "TABLE-NUM") {
                            LODOP.ADD_PRINT_TEXT(
                              hPos,
                              60,
                              pageWidth,
                              rowHeight,
                              json.seatNum
                            );
                          }
                        }
                        hPos += rowHeight;
                        hPos += rowHeight;
                        LODOP.SET_PRINT_STYLE("FontSize", 20); //字体大小
                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          60,
                          pageWidth,
                          rowHeight,
                          json.serialNumber
                        );
                        hPos += rowHeight;
                        hPos += rowHeight;
                        LODOP.SET_PRINT_STYLE("FontSize", 8); //字体大小
                        //开始
                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          1,
                          pageWidth,
                          rowHeight,
                          "店铺名称:"
                        );
                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          60,
                          pageWidth,
                          rowHeight,
                          json.shop
                        );
                        hPos += rowHeight;
                        LODOP.ADD_PRINT_BARCODE(
                          hPos,
                          20,
                          "140",
                          "140",
                          "QRCode",
                          json.orderCode
                        );
                        //上边距往下移
                        hPos += rowHeight;
                        hPos += rowHeight;
                        hPos += rowHeight;
                        hPos += rowHeight;
                        hPos += rowHeight;
                        hPos += rowHeight;
                        hPos += rowHeight;
                        hPos += rowHeight;
                        hPos += rowHeight;
                        if (_self.profilequeuetype == "SERIAL") {
                          LODOP.ADD_PRINT_TEXT(
                            hPos,
                            1,
                            pageWidth,
                            rowHeight,
                            "餐牌号:"
                          );
                          LODOP.ADD_PRINT_TEXT(
                            hPos,
                            60,
                            pageWidth,
                            rowHeight,
                            json.serialNumber
                          );
                        } else if (_self.profilequeuetype == "TABLE-NUM") {
                          LODOP.ADD_PRINT_TEXT(
                            hPos,
                            1,
                            pageWidth,
                            rowHeight,
                            "桌号:"
                          );
                          LODOP.ADD_PRINT_TEXT(
                            hPos,
                            60,
                            pageWidth,
                            rowHeight,
                            json.seatNum
                          );
                        }

                        hPos += rowHeight;
                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          1,
                          pageWidth,
                          rowHeight,
                          "收银员:"
                        );
                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          60,
                          pageWidth,
                          rowHeight,
                          _self.username
                        );
                        hPos += rowHeight;
                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          1,
                          pageWidth,
                          rowHeight,
                          "订单号:"
                        );
                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          60,
                          pageWidth,
                          rowHeight,
                          json.orderCode
                        );
                        hPos += rowHeight;
                        if (json.diningLocation == "2") {
                          LODOP.ADD_PRINT_TEXT(
                            hPos,
                            1,
                            pageWidth,
                            rowHeight,
                            "送达时间:"
                          );
                          LODOP.ADD_PRINT_TEXT(
                            hPos,
                            60,
                            pageWidth,
                            rowHeight,
                            "立即送达"
                          );
                          hPos += rowHeight;
                        }

                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          1,
                          pageWidth,
                          rowHeight,
                          "下单时间:"
                        );
                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          60,
                          pageWidth,
                          rowHeight,
                          json.create_at
                        );
                        hPos += rowHeight;
                        LODOP.ADD_PRINT_LINE(hPos, 2, hPos, pageWidth, 2, 1);
                        hPos += 5;
                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          1,
                          pageWidth,
                          rowHeight,
                          "单价"
                        );
                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          50,
                          pageWidth,
                          rowHeight,
                          "数量"
                        );
                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          90,
                          pageWidth,
                          rowHeight,
                          "小计"
                        );
                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          140,
                          pageWidth,
                          rowHeight,
                          "折扣率"
                        );
                        hPos += rowHeight;
                        //遍历json的商品数组
                        for (var i = 0; i < json.goodsList.length; i++) {
                          // if (json.goodsList[i].productionName.length < 4) {
                          // 	LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, json.goodsList[i].productionName);
                          // } else {
                          //商品名字过长,其他字段需要换行
                          LODOP.ADD_PRINT_TEXT(
                            hPos,
                            1,
                            180,
                            Math.ceil(
                              (
                                json.goodsList[i].productionName +
                                " " +
                                json.goodsList[i].productionSize +
                                " " +
                                json.goodsList[i].comments
                              ).length / 15
                            ) * rowHeight,
                            json.goodsList[i].productionName +
                              " " +
                              json.goodsList[i].productionSize +
                              " " +
                              json.goodsList[i].comments
                          );
                          hPos +=
                            Math.ceil(
                              (
                                json.goodsList[i].productionName +
                                " " +
                                json.goodsList[i].productionSize +
                                " " +
                                json.goodsList[i].comments
                              ).length / 15
                            ) * rowHeight;
                          // }
                          LODOP.ADD_PRINT_TEXT(
                            hPos,
                            1,
                            pageWidth,
                            rowHeight,
                            json.goodsList[i].promotional_price
                          );
                          LODOP.ADD_PRINT_TEXT(
                            hPos,
                            50,
                            pageWidth,
                            rowHeight,
                            json.goodsList[i].orderAmount
                          );
                          LODOP.ADD_PRINT_TEXT(
                            hPos,
                            90,
                            pageWidth,
                            rowHeight,
                            json.goodsList[i].actual_amount
                          );
                          LODOP.ADD_PRINT_TEXT(
                            hPos,
                            150,
                            pageWidth,
                            rowHeight,
                            Number(json.goodsList[i].discountRate) * 100 + "%"
                          );
                          hPos += rowHeight;
                        }
                        //商品遍历打印完毕,空一行
                        hPos += rowHeight;
                        //合计
                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          80,
                          pageWidth,
                          rowHeight,
                          "合计:" + json.totalCount
                        );
                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          130,
                          pageWidth,
                          rowHeight,
                          "￥" + json.total
                        );
                        LODOP.ADD_PRINT_LINE(hPos, 2, hPos, pageWidth, 2, 1);
                        hPos += rowHeight;
                        hPos += rowHeight;
                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          2,
                          pageWidth,
                          rowHeight,
                          new Date().toLocaleDateString() +
                            " " +
                            new Date().toLocaleTimeString()
                        );
                        hPos += rowHeight;
                        if (json.diningLocation == "2") {
                          LODOP.ADD_PRINT_TEXT(
                            hPos,
                            2,
                            pageWidth,
                            rowHeight,
                            "地址："
                          );
                          hPos += rowHeight;
                          LODOP.ADD_PRINT_TEXT(
                            hPos,
                            2,
                            180,
                            Math.ceil(json.waybill.ship_address.length / 15) *
                              rowHeight,
                            json.waybill.ship_address
                          );
                          hPos +=
                            Math.ceil(json.waybill.ship_address.length / 15) *
                            rowHeight;
                          LODOP.ADD_PRINT_TEXT(
                            hPos,
                            2,
                            pageWidth,
                            rowHeight,
                            "备注：" + json.orderComments
                          );
                          hPos += rowHeight;
                          LODOP.ADD_PRINT_TEXT(
                            hPos,
                            2,
                            pageWidth,
                            rowHeight,
                            "收货人：" + json.waybill.realname
                          );
                          hPos += rowHeight;
                          LODOP.ADD_PRINT_TEXT(
                            hPos,
                            2,
                            pageWidth,
                            rowHeight,
                            "手机号：" + json.waybill.tel
                          );
                          hPos += rowHeight;
                        }

                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          25,
                          pageWidth,
                          rowHeight,
                          "谢谢惠顾,欢迎下次光临!"
                        );
                        hPos += rowHeight;

                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          25,
                          pageWidth,
                          rowHeight,
                          "监督电话：" + json.customer_service_number
                        );
                        hPos += rowHeight;
                        if (json.diningLocation != "2") {
                          LODOP.SET_PRINT_STYLE("FontSize", 12); //字体大小
                          LODOP.ADD_PRINT_TEXT(
                            hPos,
                            25,
                            pageWidth,
                            rowHeight,
                            namecode
                          );
                          hPos += rowHeight;
                          hPos += rowHeight;
                          //初始化打印页的规格

                          hPos += rowHeight;
                          var toplist;
                          toplist = json.goodsList.length * 24;
                          var zonghetop;
                          zonghetop = toplist + 300;
                          console.log(_self.qrcode);
                          LODOP.ADD_PRINT_BARCODE(
                            zonghetop,
                            40,
                            150,
                            150,
                            "QRCode",
                            _self.qrcode
                          );

                          hPos += rowHeight;
                        }

                        // 厨房小票**************************************************************************************************************
                        hPos += rowHeight;
                        hPos += rowHeight;
                        hPos += rowHeight;
                        hPos += rowHeight;
                        if (json.diningLocation == "2") {
                          LODOP.ADD_PRINT_LINE(hPos, 2, hPos, pageWidth, 2, 1);
                          hPos += 5;
                          hPos += rowHeight;
                          LODOP.ADD_PRINT_TEXT(
                            hPos,
                            25,
                            pageWidth,
                            rowHeight,
                            "德航科技---外卖系统"
                          );
                        }
                        LODOP.SET_PRINT_PAGESIZE(3, pageWidth, 45, 2);
                        //添加小票标题文本
                        hPos += rowHeight;
                        hPos += rowHeight;

                        //打印预览
                        // LODOP.PREVIEW();

                        //开始打印
                        LODOP.PRINT();
                        _self.search();
                      } else {
                        _self.$message.error("传菜失败");
                      }
                    })
                    .catch(function(error) {
                      _self.$message.error("数据响应时间过长，请重试");
                      console.log(error);
                    });
                } else {
                  _self.$message.error("获取二维码失败，请刷新重试");
                }
              })
              .catch(function(error) {
                _self.$message.error("二维码响应时间过长，请重试");
                console.log("二维码", error);
              });
          } else {
            _self.$message.error("获取二维码失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("二维码响应时间过长，请重试");
          console.log("二维码", error);
        });
    },
    MySendData2(index, row) {
      let _self = this;
      var qs = require("qs");
      let formData = new FormData();
      formData.append("orderCode", _self.tableData[index].orderCode);
      formData.append("shopCode", _self.shopcode);
      formData.append("seatNum", _self.tableData[index].seatNum);
      formData.append("comments", _self.comments);
      formData.append("state", "0");
      _self.axios
        .post(_self.ApiUrl + "/catering/spreadFoodBtn", formData)
        .then(response => {
          if (response.data.errcode == "0") {
            //创建小票打印页
            var goodslist = response.data.data;
            let formDataprinter = new FormData();
            formDataprinter.append("shopCode", _self.shopcode);
            //发送请求
            _self.axios
              .post(_self.ApiUrls + "/printer/choosePrinter", formDataprinter, {
                // 单独配置
                withCredentials: false
              })
              .then(response => {
                if (response.data.errcode == "0") {
                  let category_codes = response.data.data.data;
                  for (var i = 0; i < category_codes.length; i++) {
                    let codes = [];
                    var orderInfo2;
                    if (category_codes[i].categoryCodeList == "") {
                      var orderInfos1;
                      orderInfos1 =
                        "<CB>" + goodslist.serialNumber + "</CB>" + "<BR>";
                      orderInfos1 += "名称　　　 单价          数量<BR>";
                      orderInfos1 += "--------------------------------<BR>";
                      for (var i = 0; i < goodslist.goodsList.length; i++) {
                        orderInfos1 +=
                          "<B>" +
                          goodslist.goodsList[i].productionName +
                          "（" +
                          goodslist.goodsList[i].productionSize +
                          goodslist.goodsList[i].comments +
                          ")" +
                          "<BR>" +
                          "                      " +
                          goodslist.goodsList[i].promotional_price +
                          "     " +
                          goodslist.goodsList[i].orderAmount +
                          "</B>" +
                          "<BR>";
                      }
                      orderInfos1 += "--------------------------------<BR>";
                      orderInfos1 +=
                        "下单时间：" + goodslist.create_at + "<BR>";
                      orderInfos1 +=
                        "投诉电话" + goodslist.customer_service_number + "<BR>";
                      orderInfos1 += "<BR>";
                      orderInfos1 += "<BR>";
                      orderInfos1 += "<BR>";
                      orderInfos1 += "<BR>";

                      var orderInfos2;
                      orderInfos2 =
                        "@@2<FB><FS2><center>" +
                        goodslist.serialNumber +
                        "</center></FS2></FB>↵" +
                        "\r";
                      orderInfos2 +=
                        "<LR>名称                单价                   数量</LR>";
                      orderInfos2 += "\r" + "↵————————————————————————↵" + "\r";
                      for (var i = 0; i < goodslist.goodsList.length; i++) {
                        orderInfos2 +=
                          "<FB><FS2>" +
                          goodslist.goodsList[i].productionName +
                          "（" +
                          goodslist.goodsList[i].productionSize +
                          goodslist.goodsList[i].comments +
                          ")" +
                          "\r" +
                          "          " +
                          goodslist.goodsList[i].promotional_price +
                          "          " +
                          goodslist.goodsList[i].orderAmount +
                          "</FS2></FB>" +
                          "\r";
                      }
                      orderInfos2 += "\r" + "↵————————————————————————↵" + "\r";
                      orderInfos2 += "下单时间：" + goodslist.create_at;

                      var order = {
                        name1: orderInfos1,
                        name2: orderInfos2
                      };
                      let formDataOpen = new FormData();
                      formDataOpen.append("shopCode", _self.shopcode);
                      formDataOpen.append("content", JSON.stringify(order));
                      formDataOpen.append(
                        "orderCode",
                        _self.tableData[index].orderCode
                      );
                      _self.axios
                        .post(
                          _self.ApiUrls + "/printer/connectionPrinter",
                          formDataOpen,
                          {
                            // 单独配置
                            withCredentials: false
                          }
                        )
                        .then(function(response) {
                          if (response.data.errcode == "0") {
                          } else {
                            _self.$message.error(
                              "无线打印机：" +
                                response.data.errmsg +
                                "，请到今日订单点击重新打印"
                            );
                          }
                        })
                        .catch(function(error) {
                          console.log(error);
                        });
                    } else {
                      for (var j = 0; j < goodslist.goodsList.length; j++) {
                        for (
                          var b = 0;
                          b < category_codes[i].categoryCodeList.length;
                          b++
                        ) {
                          if (
                            goodslist.goodsList[j].categoryCode ==
                            category_codes[i].categoryCodeList[b]
                          ) {
                            codes.push(goodslist.goodsList[j]);
                          }
                        }
                      }
                      if (category_codes[i].type == "F") {
                        orderInfo2 =
                          "<CB>" + goodslist.serialNumber + "</CB>" + "<BR>";
                        orderInfo2 += "名称　　　 单价          数量<BR>";
                        orderInfo2 += "--------------------------------<BR>";
                        for (var c = 0; c < codes.length; c++) {
                          orderInfo2 +=
                            "<B>" +
                            codes[c].productionName +
                            "（" +
                            codes[c].productionSize +
                            codes[c].comments +
                            ")" +
                            "<BR>" +
                            "                      " +
                            codes[c].promotional_price +
                            "     " +
                            codes[c].orderAmount +
                            "</B>" +
                            "<BR>";
                        }
                        orderInfo2 += "--------------------------------<BR>";
                        orderInfo2 +=
                          "下单时间：" + goodslist.create_at + "<BR>";
                        orderInfo2 +=
                          "投诉电话" +
                          goodslist.customer_service_number +
                          "<BR>";
                        orderInfo2 += "<BR>";
                        orderInfo2 += "<BR>";
                        orderInfo2 += "<BR>";
                        orderInfo2 += "<BR>";
                      } else {
                        orderInfo2 =
                          "@@2<FB><FS2><center>" +
                          goodslist.serialNumber +
                          "</center></FS2></FB>↵" +
                          "\r";
                        orderInfo2 +=
                          "<LR>名称                单价                   数量</LR>";
                        orderInfo2 +=
                          "\r" + "↵————————————————————————↵" + "\r";
                        for (var c = 0; c < codes.length; c++) {
                          orderInfo2 +=
                            "<FB><FS2>" +
                            codes[c].productionName +
                            "（" +
                            codes[c].productionSize +
                            codes[c].comments +
                            ")" +
                            "\r" +
                            "          " +
                            codes[c].promotional_price +
                            "          " +
                            codes[c].orderAmount +
                            "</FS2></FB>" +
                            "\r";
                        }
                        orderInfo2 +=
                          "\r" + "↵————————————————————————↵" + "\r";
                        orderInfo2 += "下单时间：" + goodslist.create_at;
                        //结束
                      }
                      if (codes != "") {
                        let formDataOpens = new FormData();
                        formDataOpens.append(
                          "machine_code",
                          category_codes[i].printer_code
                        );
                        formDataOpens.append("content", orderInfo2);
                        formDataOpens.append(
                          "account",
                          category_codes[i].uk_account
                        );
                        formDataOpens.append("ukey", category_codes[i].uk_key);
                        formDataOpens.append("type", category_codes[i].type);
                        formDataOpens.append(
                          "orderCode",
                          _self.tableData[index].orderCode
                        );
                        _self.axios
                          .post(
                            _self.ApiUrls + "/printer/categoryCodePrinter",
                            formDataOpens,
                            {
                              // 单独配置
                              withCredentials: false
                            }
                          )
                          .then(function(response) {
                            console.log(response);
                          })
                          .catch(function(error) {
                            console.log(error);
                          });
                        // 品类打印结束
                      }
                    }
                  }
                } else {
                }
              })
              .catch(function(error) {
                _self.$message.error("响应时间过长，请重试");
              });
          } else {
            _self.$message.error("传菜失败");
          }
        })
        .catch(function(error) {
          _self.$message.error("数据响应时间过长，请重试");
        });
    },
    CreatePrintPage(json) {
      //json 创建模拟服务器响应的订单信息对象
    },
    getstart() {
      let _self = this;
      for (var i = 0; i < _self.ArrayList.length; i++) {
        if (
          _self.ArrayList[i].role == "MANAGER" ||
          _self.ArrayList[i].role == "ADMIN"
        ) {
          _self.ArrayListmanger = "open";
        }
      }
      let formData = new FormData();
      formData.append("shopCode", _self.shopcode);
      formData.append("pageNum", _self.currentPage);
      formData.append("pageSize", _self.pagesize);
      _self.axios
        .post(_self.ApiUrl + "/catering/getTodayTakeOutOrder", formData)
        .then(response => {
          if (response.data.errcode == "0") {
            _self.loading = false;
            _self.tableData = response.data.data.data.list;
            _self.total = response.data.data.data.total;

            for (var i = 0; i < response.data.data.data.list.length; i++) {
       
              if (
                response.data.data.data.list[i].orderType == "WITHDRAW_ORDER"
              ) {
                _self.tableData[i].xuhao = i + 1;
                _self.tableData[i].orderType = "退款订单";
              } else if (
                response.data.data.data.list[i].orderType == "DISCOUNT_ORDER"
              ) {
                _self.tableData[i].orderType = "折扣订单";
              } else if (
                response.data.data.data.list[i].orderType == "NORMAL_ORDER"
              ) {
                _self.tableData[i].orderType = "核销订单";
              } else if (
                response.data.data.data.list[i].orderType == "creditType.daily"
              ) {
                _self.tableData[i].orderType = "赊付日结";
              } else if (
                response.data.data.data.list[i].orderType == "creditType.week"
              ) {
                _self.tableData[i].orderType = "赊付周结";
              } else if (
                response.data.data.data.list[i].orderType == "creditType.month"
              ) {
                _self.tableData[i].orderType = "赊付月结";
              }

              if (response.data.data.data.list[i].new_order_state == "1") {
                _self.tableData[i].new_order_state = "已支付";
              } else if (
                response.data.data.data.list[i].new_order_state == "4"
              ) {
                _self.tableData[i].new_order_state = "已支付";
              } else if (
                response.data.data.data.list[i].new_order_state == "5"
              ) {
                _self.tableData[i].new_order_state = "已支付";
              } else if (
                response.data.data.data.list[i].new_order_state == "6"
              ) {
                _self.tableData[i].new_order_state = "已支付";
              } else if (
                response.data.data.data.list[i].new_order_state == "7"
              ) {
                _self.tableData[i].new_order_state = "已支付";
              } else if (
                response.data.data.data.list[i].new_order_state == "0"
              ) {
                _self.tableData[i].new_order_state = "未支付";
              }
            }
            // _self.timeOut = setTimeout(() => {
            //   _self.getstart();
            // }, _self.setTime);
          } else {
            _self.$message.error("数据加载异常");
          }
        })
        .catch(function(error) {
          console.log(error.response);
          if (
            error.response.data.status == "403" ||
            error.response.data.status == "302"
          ) {
            _self.$message.error("用户登录过期，请重新登录");
            _self.$router.push("/login");
            _self.$store.commit("SAVE_USERINFO", "");
            _self.axios
              .post(_self.ApiUrl + "/logout")
              .then(response => {})
              .catch(function(error) {
                _self.$router.push("/login");
                _self.$store.commit("SAVE_USERINFO", "");
                _self.$store.commit("SAVE_ArrayList", "");
                _self.$store.commit("SAVE_ShopName", "");
              });
          } else if (error.response.data.status == "408") {
            _self.getstart();
          } else if (error.response.data.status == "504") {
            _self.getstart();
          } else {
            console.log(error);
          }
        });
    },
    search(type) {
      this.datetime ? "" : (this.datetime = []);
      console.log(this.datetime, " this.datetime");

      getShopAllDeliveryOrders({
        shopCode: this.shopcode,
        pageNum: this.currentPage,
        pageSize: 10,
        startTime: this.datetime[0] || null,
        endTime: this.datetime[1] || null,
        valueStr: this.strValue
      })
        .then(response => {
          if (response.data.errcode == "0") {
            this.loading = false;
            this.tableData = response.data.data.data.list;
            this.tableData.forEach((item,index)=>{
              if(!item.ship_state){
                 item.ship_state = '待发货'
              }
            })
            this.total = response.data.data.data.total;
          } else {
            this.$message.error("搜索错误");
          }
        })
        .catch(function(error) {
          this.$message.error("数据响应时间过长，请重试");
        });
    },
    tuikuan(index) {
      let _self = this;
      _self.trade = "";
      _self.refund = "";
      _self.tuikuanVisible = true;
      _self.loadwait = false;
      // _self.$nextTick(function() {
      //   //DOM 更新了
      //   _self.$refs.inputVal.focus();
      // });
      _self.actuals2 = _self.tableData[index].actualAmount;
      _self.actuals = _self.tableData[index].actualAmount;
      _self.actuals = parseInt(_self.actuals * 100);
      _self.tableDatamenu = _self.tableData[index].odrOrderDetailList;
      _self.orderCodedetail = _self.tableData[index].orderCode;
      _self.source = _self.tableData[index].source;
      _self.yinliancode = _self.tableData[index].pay_code;
      _self.TotalRefund = _self.tableData[index].payAmount
    },
    tuikuanup() {
      tuikuanJs(this);
    }
  },
  created: function() {
    this.search(1);
    let _self = this;
    if (this.$store.state.userinfo.shopcode == "GX200") {
      this.printText = "成本分拣打印";
    }
    _self.getstart();
    _self.timechange();
    if (_self.shopgroup == "R_SAMC") {
      _self.editRow = "标识号";
      _self.Tradename = "商品";
    } else {
      _self.editRow = "餐牌号";
      _self.Tradename = "菜品";
    }
  }
};
</script>
<style lang="less" scoped>
.editorBill {
  .cell {
    display: flex;
    span {
      width: 80px;
      display: inline-block;
    }
  }
}
</style>
<style lang='less' >
* {
  padding: 0;
  margin: 0;
}

h1 {
  font-size: 20px;
}

h3 {
  font-size: 16px;
}

.left {
  float: left;
}

.right {
  float: right;
}

.clearfix {
  clear: both;
}

ul {
  list-style: none;
}

.print_container {
  padding: 20px;
  width: 188px;
}

.section1 {
}

.section2 label {
  display: block;
}

.section3 label {
  display: block;
}

.section4 {
}

.section4 .total label {
  display: block;
}

.section5 label {
  display: block;
}

.app-contion {
  margin: 10px;
}

.block {
  margin-bottom: 15px;
}

.titles {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  font-size: 14px;
  margin: 0 15px;
}

.title-color {
  color: red;
}

.width-input {
  width: 300px;
}

/* .el-button--primary {
  width: 73px;
} */

.el-table__body-wrapper {
  overflow-x: auto;
  overflow-y: auto;
}
</style>
