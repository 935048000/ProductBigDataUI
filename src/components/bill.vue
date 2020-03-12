<template>
  <div class="bill">
    <div class="qrCode" ref="qrCodeUrl">
      <vue-qr text="xxx" :size="200"></vue-qr>
      <div class="tip">扫码关注公众号领取更多优惠！</div>
    </div>
    <!-- <div class="title">请听号，自取餐</div> -->
    <!-- <div class="title">{{storeMessage.sequence_init_number}}</div> -->
    <Cell title="店铺名称">{{storeMessage.shopName}}</Cell>
    <!-- <Cell title="餐牌号">{{userInfo.userName}}</Cell> -->
    <Cell title="收银员">{{userInfo.account}}</Cell>
    <!-- <Cell title="订单号">1234567890987</Cell> -->
    <!-- <Cell title="下单时间">2019/12/31 14:30:57</Cell> -->
    <div class="productList">
      <div class="header">
        <span>单价</span>
        <span>数量</span>
        <span>小计</span>
        <span>折扣率</span>
      </div>
      <div class="productItem" v-for="(item,index) in productList" :key="index">
        <div class="PIName">{{item.productionName}}</div>
        <div class="body">
          <span>{{item.promotional_price}}</span>
          <span>{{item.order_amount}}</span>
          <span>{{item.actual_amount}}</span>
          <span>100%</span>
        </div>
      </div>
    </div>
    <div class="totle">合计：{{allPayCount.toFixed(2)}}</div>
  </div>
</template>
<script>
import Cell from "@/components/cell";
import vueQr from "vue-qr";
export default {
  components: {
    Cell,
    vueQr
  },
  watch:{
    'localStorage.getItem("billData")':function(newV, oldV){
      console.log(newV);
      
    }
  },
  created() {
    this.intervalIndex = setInterval(() => {
      let _this = this;
      _this.allPayCount = 0;
      this.productList =  JSON.parse(localStorage.getItem('billData')) || [];
      this.storeMessage = JSON.parse(localStorage.getItem('ShopName')) || {},
      this.userInfo = JSON.parse(localStorage.getItem('userinfo')) || {}
      this.allPayCount = JSON.parse(localStorage.getItem('allPayment')) || 0
    }, 1000);
  },
  mounted() {},
  data() {
    return {
      productList: [],
      intervalIndex: "",
      allPayCount: 0,
      storeMessage: JSON.parse(localStorage.getItem('ShopName')),
      userInfo: JSON.parse(localStorage.getItem('userinfo'))
    };
  },
  destoryed() {
    clearInterval(this.intervalIndex);
  }
};
</script>
<style lang="less" scoped>
.productItem {
  border-bottom: 1px dashed #999;
  margin-bottom: 5px;
  padding: 5px 0;
  .body{
    padding: 10px 0px;
  }
}
.qrCode {
  text-align: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #333;
  .tip {
    font-size: 15px;
    margin-bottom: 20px;
  }
}
.title {
  font-size: 20px;
  text-align: center;
}
.productList {
  border: 1px solid #333;
  border-left: none;
  border-right: none;
  .header {
    span {
      display: inline-block;
      width: 24%;
      text-align: center;
    }
    border-bottom: 1px solid #333;
    padding: 5px 0;
  }
  .PIName {
    margin-left: 10px;
  }
  .body {
    span {
      display: inline-block;
      width: 24%;
      text-align: center;
    }
  }
}
.totle {
  text-align: right;
  margin-right: 20px;
}
</style>