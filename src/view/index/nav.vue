<template>
  <!-- background-color="#545c64"
        text-color="#fff"
  active-text-color="#ffd04b"-->
  <div>
    <div v-if="food" style="margin-bottom: 1.9%;">
      <p class="head">餐饮类报表</p>
      <el-menu router class="el-menu-demo" mode="horizontal">
        <el-menu-item index="Categorysummary">品类汇总</el-menu-item>
        <el-menu-item index="comprehensive">综合汇总</el-menu-item>
        <el-menu-item index="Salesvolumesummary">餐饮单品销量汇总</el-menu-item>
        <el-menu-item index="BillDetailTabulation">餐饮账单明细表</el-menu-item>
        <el-menu-item index="shopstonehourlyreport">易石历史数据时报表</el-menu-item>
        <el-menu-item index="shopstonedailyreport">易石历史数据日报表</el-menu-item>
        <el-menu-item index="shopstonemonthreport">易石历史数据月报表</el-menu-item>
      </el-menu>
    </div>
    <div v-if="sale" style="margin-bottom: 1.9%;">
      <p class="head">零售类报表</p>
      <el-menu router class="el-menu-demo" mode="horizontal">
        <el-menu-item index="SalesvolumesummaryRetail">零售单品销量汇总</el-menu-item>
        <el-menu-item index="Categorysummary">品类汇总</el-menu-item>
        <el-menu-item index="comprehensive">综合汇总</el-menu-item>
        <el-menu-item index="BillDetailTabulationRetail">零售账单明细表</el-menu-item>
        <el-menu-item index="salesPerformance">销售业绩报表</el-menu-item>
      </el-menu>
    </div>
    <div v-if="store" style="margin-bottom: 1.9%;">
      <p class="head">仓库类报表</p>
      <el-menu router class="el-menu-demo" mode="horizontal">
        <el-menu-item index="theoreticalinventory_v2">库存明细报表</el-menu-item>
        <el-menu-item index="SupplierSalesStatement_2">供应商销售报表</el-menu-item>
        <el-menu-item index="InventoryStatement">库单报表</el-menu-item>
      </el-menu>
    </div>
    <div v-if="finance" style="margin-bottom: 1.9%;">
      <p class="head">财务类报表</p>
      <el-menu router class="el-menu-demo" mode="horizontal">
        <el-menu-item index="storesummary">店铺汇总</el-menu-item>
        <el-menu-item index="financialSummaryDay">财务日汇总报表</el-menu-item>
        <el-menu-item index="shopdailyreport">门店销售日报表</el-menu-item>
        <el-menu-item index="StoreBillDetailTabulation">餐饮账单明细表</el-menu-item>
        <el-menu-item index="BillDetailTabulationRetail_v2">零售账单明细表</el-menu-item>
        <el-menu-item index="profitStatement">零售毛利查询</el-menu-item>
        <el-menu-item index="SupplierSalesStatement">供应商销售日汇总报表</el-menu-item>
        <el-menu-item index="SupplierSalesStatement_3">供应商销售汇总报表</el-menu-item>
        <el-menu-item index="InventoryStatement_v2">供应商结算报表</el-menu-item>
        <el-menu-item index="ProviderShopSalesList">供应商门店销售明细</el-menu-item>
        <el-menu-item index="shopAreaReportD">门店销售日报表(区域汇总)</el-menu-item>
        <el-menu-item index="ShopAreaReportM">门店销售月报表(区域汇总)</el-menu-item>
        <el-menu-item index="RetailSaleSummary">零售销售汇总报表</el-menu-item>
        <el-menu-item index="warehousequery">仓库查询报表</el-menu-item>
        <el-menu-item index="StockSellStorage">进销存汇总报表</el-menu-item>
        <el-menu-item index="providerreport">供应商报表</el-menu-item>
        <el-menu-item index="salesendkeep">零售收发存汇总报表</el-menu-item>
        <el-menu-item index="commodityinfo">商品导出报表</el-menu-item>
        <el-menu-item index="warehousedetail">库存明细报表</el-menu-item>
        <el-menu-item index="refunddetail">退货详情报表</el-menu-item>
        <el-menu-item index="checkexport">盘点导出</el-menu-item>
         <el-menu-item index="reconciliation">微信支付宝自动对账</el-menu-item>
         <el-menu-item index="yestodayRefund">隔日退款</el-menu-item>
      </el-menu>
    </div>
    <div v-if="food||sale" style="margin-bottom: 1.9%;">
      <p class="head">通用类报表</p>
      <el-menu router class="el-menu-demo" mode="horizontal">
        <el-menu-item index="ReportFormsLinkFelativeMonth">月环比报表</el-menu-item>
        <el-menu-item index="ReportFormsLinkFelativeWeek">周环比报表</el-menu-item>
        <el-menu-item index="intervalDataComparisonReportD">日环比报表</el-menu-item>
        <el-menu-item index="DataReportDay">日汇总报表</el-menu-item>
        <el-menu-item index="DataReportM">月汇总报表</el-menu-item>
        <el-menu-item index="OrderCouponDetail">订单优惠信息查询</el-menu-item>
        <el-menu-item index="shoprefunddetail">退货详情报表</el-menu-item>

      </el-menu>
    </div>
    <div v-if="finance" style="margin-bottom: 1.9%;">
      <p class="head">历史数据类报表</p>
      <el-menu router class="el-menu-demo" mode="horizontal" active-text-color="bule">
        <el-menu-item index="stonehourlyreport">易石历史数据时报表</el-menu-item>
        <el-menu-item index="stonedailyreport">易石历史数据日报表</el-menu-item>
        <el-menu-item index="stonemonthreport">易石历史数据月报表</el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      food: false,
      sale: false,
      finance: false,
      store: false,
      user: this.$store.state.ShopName.type
    };
  },
  computed: {},
  watch: {},
  methods: {
    show(user) {
      console.log(user);
      if (user == "财务") {
        this.finance = true;
      }
      if (user == "餐饮店") {
        this.food = true;
      }
      if (user == "仓库") {
        this.store = true;
      }
      if (user == "品牌店" || user == "特卖店") {
        this.sale = true;
        this.store = true;
      }
    }
  },
  created() {},
  mounted() {
    this.show(this.user);
  }
};
</script>

<style scoped>
p {
  font-size: 16px;
}
.head {
  width: 100%;
  background-color: rgba(55, 69, 100, 0.589);
  color: aliceblue;
}
</style>
