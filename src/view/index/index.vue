<template>
  <!--{{$store.state.userinfo}}-->
  <div class="index">
    <el-container style=" border: 1px solid #eee">
      <!--左侧导航-->
      <el-aside width="200px" style="background-color:#333333;" v-show="isShows">
        <!--<div class="top-header">
  		<h1 class="title">首页</h1>
        </div>-->
        <el-menu
          default-active="2"
          router
          background-color="#333333"
          text-color="#fff"
          class="el-menu-vertical-demo"
          active-text-color="#ff5e59"
        >
          <el-menu-item index="/" class="top">
            <div style="width: 100%;text-align: center;">
              <div style="width: 3.125rem;height: 3.125rem;margin-left:55px;padding: 10px 0 0 0;">
                <img src="../../assets/hearder.png" style="width: 100%;" />
              </div>
              <p>{{"testshop"}}</p>
            </div>
            <i class="el-icon-setting"></i>
          </el-menu-item>
          <!-- 餐饮 -->
          <!--<div v-bind:style="{ display: canyin=='block'?canyin:examinAdmin }">-->
            <!--<div v-if="techan !== 'block'">-->
              <!--<el-submenu index="2" v-bind:style="{ display: display4 }">-->
                <!--<template slot="title">-->
                  <!--<i class="el-icon-tableware"></i>-->
                  <!--{{NamingMethod}}-->
                <!--</template>-->
                <!--<el-menu-item-group>-->
                  <!--<el-menu-item index="business">{{NamingMethodChild}}</el-menu-item>-->
                <!--</el-menu-item-group>-->
              <!--</el-submenu>-->
              <!--<el-submenu index="19" v-bind:style="{ display:CashRegister }">-->
                <!--<template slot="title">-->
                  <!--<i class="el-icon-tableware"></i>商家端收银系统-->
                <!--</template>-->
                <!--<el-menu-item-group>-->
                  <!--<el-menu-item index="cashiers">商家收银</el-menu-item>-->
                <!--</el-menu-item-group>-->
              <!--</el-submenu>-->
              <!--&lt;!&ndash;<el-submenu index="1" v-bind:style="{ display: display3 }">&ndash;&gt;-->
                <!--&lt;!&ndash;<template slot="title">&ndash;&gt;-->
                  <!--&lt;!&ndash;<i class="el-icon-tickets"></i>订单管理&ndash;&gt;-->
                <!--&lt;!&ndash;</template>&ndash;&gt;-->
                <!--&lt;!&ndash;<el-menu-item-group>&ndash;&gt;-->
                  <!--&lt;!&ndash;<el-menu-item index="todaylist" @click="todaylist">&ndash;&gt;-->
                    <!--&lt;!&ndash;今日订单&ndash;&gt;-->
                    <!--&lt;!&ndash;<div class="slow">&ndash;&gt;-->
                      <!--&lt;!&ndash;<span>{{count}}</span>&ndash;&gt;-->
                    <!--&lt;!&ndash;</div>&ndash;&gt;-->
                  <!--&lt;!&ndash;</el-menu-item>&ndash;&gt;-->
                  <!--&lt;!&ndash;<el-menu-item-group>&ndash;&gt;-->
                    <!--&lt;!&ndash;<el-menu-item index="Takeawaytoday">外卖订单</el-menu-item>&ndash;&gt;-->
                  <!--&lt;!&ndash;</el-menu-item-group>&ndash;&gt;-->
                  <!--&lt;!&ndash;<el-menu-item-group>&ndash;&gt;-->
                    <!--&lt;!&ndash;<el-menu-item index="takeOutList" >外卖全部订单</el-menu-item>&ndash;&gt;-->
                  <!--&lt;!&ndash;</el-menu-item-group>&ndash;&gt;-->
                  <!--&lt;!&ndash;<el-menu-item index="todaycredit" v-if="profilesettlement=='POST-PAY'">赊账订单</el-menu-item>&ndash;&gt;-->
                  <!--&lt;!&ndash;<el-menu-item index="unpaid" v-bind:style="{ display: unpaiddisplay }">未支付订单</el-menu-item>&ndash;&gt;-->
                  <!--&lt;!&ndash;<el-menu-item index="alllist" v-bind:style="{ display: REPORT }">全部订单</el-menu-item>&ndash;&gt;-->
                  <!--&lt;!&ndash;<el-menu-item&ndash;&gt;-->
                    <!--&lt;!&ndash;index="collect"&ndash;&gt;-->
                    <!--&lt;!&ndash;v-bind:style="{ display: REPORT=='block'?REPORT:examinOnly }"&ndash;&gt;-->
                  <!--&lt;!&ndash;&gt;订单汇总</el-menu-item>&ndash;&gt;-->
                <!--&lt;!&ndash;</el-menu-item-group>&ndash;&gt;-->
              <!--&lt;!&ndash;</el-submenu>&ndash;&gt;-->
              <!--&lt;!&ndash;<div v-bind:style="{ display: unpaiddisplay }">&ndash;&gt;-->
                <!--&lt;!&ndash;<el-submenu index="3" v-bind:style="{ display: display1 }">&ndash;&gt;-->
                  <!--&lt;!&ndash;<template slot="title">&ndash;&gt;-->
                    <!--&lt;!&ndash;<i class="el-icon-menu"></i>商品管理&ndash;&gt;-->
                  <!--&lt;!&ndash;</template>&ndash;&gt;-->
                  <!--&lt;!&ndash;<el-menu-item-group>&ndash;&gt;-->
                    <!--&lt;!&ndash;<el-menu-item index="commodity">商品信息</el-menu-item>&ndash;&gt;-->
                  <!--&lt;!&ndash;</el-menu-item-group>&ndash;&gt;-->
                  <!--&lt;!&ndash;<el-menu-item-group>&ndash;&gt;-->
                    <!--&lt;!&ndash;<el-menu-item index="categoryup">品类信息</el-menu-item>&ndash;&gt;-->
                  <!--&lt;!&ndash;</el-menu-item-group>&ndash;&gt;-->
                  <!--&lt;!&ndash;<el-menu-item-group>&ndash;&gt;-->
                    <!--&lt;!&ndash;&lt;!&ndash;<el-menu-item index="category" v-bind:style="{ display: display5 }">商品品类</el-menu-item>&ndash;&gt;&ndash;&gt;-->
                  <!--&lt;!&ndash;</el-menu-item-group>&ndash;&gt;-->
                <!--&lt;!&ndash;</el-submenu>&ndash;&gt;-->
              <!--&lt;!&ndash;</div>&ndash;&gt;-->
              <!--<div v-if="shopcode=='R_SAMCT'">-->
                <!--<el-submenu index="25">-->
                  <!--<template slot="title">-->
                    <!--<i class="el-icon-s-cooperation"></i>积分充值-->
                  <!--</template>-->
                  <!--<el-menu-item-group>-->
                    <!--<el-menu-item index="MembershipRecharge2">积分信息</el-menu-item>-->
                  <!--</el-menu-item-group>-->
                  <!--<el-menu-item-group>-->
                    <!--<el-menu-item index="MembershipInformation2">会员信息</el-menu-item>-->
                  <!--</el-menu-item-group>-->
                <!--</el-submenu>-->
              <!--</div>-->
            <!--</div>-->
            <!--<el-submenu index="4" v-show="examin == 'block' || examinAdmin == 'block' ">-->
              <!--<template slot="title">-->
                <!--<i class="el-icon-notebook-1"></i>财务报表汇总-->
              <!--</template>-->
              <!--<el-menu-item index="nav" v-if="examinAdmin !== 'block'">报表导航页</el-menu-item>-->
              <!--&lt;!&ndash;<el-menu-item-group v-if="examinAdmin !== 'block'">&ndash;&gt;-->
                <!--&lt;!&ndash;<el-menu-item index="storesummary">店铺汇总</el-menu-item>&ndash;&gt;-->
              <!--&lt;!&ndash;</el-menu-item-group>&ndash;&gt;-->
              <!--&lt;!&ndash;<el-menu-item-group v-if="examinAdmin !== 'block'">&ndash;&gt;-->
                <!--&lt;!&ndash;<el-menu-item index="StoreBillDetailTabulation">餐饮账单明细表</el-menu-item>&ndash;&gt;-->
              <!--&lt;!&ndash;</el-menu-item-group>&ndash;&gt;-->
              <!--&lt;!&ndash;<el-menu-item-group v-if="examinAdmin !== 'block'">&ndash;&gt;-->
                <!--&lt;!&ndash;<el-menu-item index="BillDetailTabulationRetail_v2">零售账单明细表</el-menu-item>&ndash;&gt;-->
              <!--&lt;!&ndash;</el-menu-item-group>&ndash;&gt;-->
              <!--&lt;!&ndash;<el-menu-item-group v-if="examinAdmin !== 'block'">&ndash;&gt;-->
                <!--&lt;!&ndash;<el-menu-item index="financialSummaryDay">财务日汇总报表</el-menu-item>&ndash;&gt;-->
              <!--&lt;!&ndash;</el-menu-item-group>&ndash;&gt;-->
              <!--&lt;!&ndash;<el-menu-item-group v-if="examinAdmin !== 'block'">&ndash;&gt;-->
                <!--&lt;!&ndash;<el-menu-item index="profitStatement ">零售毛利查询</el-menu-item>&ndash;&gt;-->
              <!--&lt;!&ndash;</el-menu-item-group>&ndash;&gt;-->
              <!--&lt;!&ndash;<el-menu-item-group v-if="examinAdmin !== 'block'">&ndash;&gt;-->
                <!--&lt;!&ndash;<el-menu-item index="SupplierSalesStatement">供应商销售日汇总报表</el-menu-item>&ndash;&gt;-->
              <!--&lt;!&ndash;</el-menu-item-group>&ndash;&gt;-->
              <!--&lt;!&ndash;<el-menu-item-group v-if="examinAdmin !== 'block'">&ndash;&gt;-->
                <!--&lt;!&ndash;<el-menu-item index="SupplierSalesStatement_3">供应商销售汇总报表</el-menu-item>&ndash;&gt;-->
              <!--&lt;!&ndash;</el-menu-item-group>&ndash;&gt;-->
              <!--&lt;!&ndash;<el-menu-item-group v-if="examinAdmin !== 'block'">&ndash;&gt;-->
                <!--&lt;!&ndash;<el-menu-item index="ProviderShopSalesList">供应商门店销售明细</el-menu-item>&ndash;&gt;-->
              <!--&lt;!&ndash;</el-menu-item-group>&ndash;&gt;-->
              <!--&lt;!&ndash;<el-menu-item-group v-if="examinAdmin !== 'block'">&ndash;&gt;-->
                <!--&lt;!&ndash;<el-menu-item index="shopAreaReportD">门店销售日报表(区域汇总)</el-menu-item>&ndash;&gt;-->
              <!--&lt;!&ndash;</el-menu-item-group>&ndash;&gt;-->
              <!--&lt;!&ndash;<el-menu-item-group v-if="examinAdmin !== 'block'">&ndash;&gt;-->
                <!--&lt;!&ndash;<el-menu-item index="ShopAreaReportM">门店销售月报表(区域汇总)</el-menu-item>&ndash;&gt;-->
              <!--&lt;!&ndash;</el-menu-item-group>&ndash;&gt;-->
              <!--&lt;!&ndash;<el-menu-item-group v-if="examinAdmin !== 'block'">&ndash;&gt;-->
                <!--&lt;!&ndash;<el-menu-item index="RetailSaleSummary">零售销售汇总报表</el-menu-item>&ndash;&gt;-->
              <!--&lt;!&ndash;</el-menu-item-group>&ndash;&gt;-->

              <!--&lt;!&ndash;<el-menu-item-group v-if="examinAdmin !== 'block'">&ndash;&gt;-->
                <!--&lt;!&ndash;<el-menu-item index="warehousequery">仓库查询报表</el-menu-item>&ndash;&gt;-->
              <!--&lt;!&ndash;</el-menu-item-group>&ndash;&gt;-->
              <!--&lt;!&ndash;<el-menu-item-group v-if="examinAdmin !== 'block'">&ndash;&gt;-->
                <!--&lt;!&ndash;<el-menu-item index="InventoryStatement_v2">供应商结算报表</el-menu-item>&ndash;&gt;-->
              <!--&lt;!&ndash;</el-menu-item-group>&ndash;&gt;-->
              <!--&lt;!&ndash;<el-menu-item-group v-if="examinAdmin !== 'block'">&ndash;&gt;-->
                <!--&lt;!&ndash;<el-menu-item index="StockSellStorage">进销存汇总报表</el-menu-item>&ndash;&gt;-->
              <!--&lt;!&ndash;</el-menu-item-group>&ndash;&gt;-->
              <!--<el-menu-item-group>-->
                <!--<el-menu-item index="shopdailyreport">门店销售日报表</el-menu-item>-->
              <!--</el-menu-item-group>-->
              <!--&lt;!&ndash;<el-menu-item-group v-if="examinAdmin !== 'block'">&ndash;&gt;-->
                <!--&lt;!&ndash;<el-menu-item index="stonehourlyreport">易石历史数据时汇总</el-menu-item>&ndash;&gt;-->
              <!--&lt;!&ndash;</el-menu-item-group>&ndash;&gt;-->
              <!--&lt;!&ndash;<el-menu-item-group v-if="examinAdmin !== 'block'">&ndash;&gt;-->
                <!--&lt;!&ndash;<el-menu-item index="stonedailyreport">易石历史数据日汇总</el-menu-item>&ndash;&gt;-->
              <!--&lt;!&ndash;</el-menu-item-group>&ndash;&gt;-->
              <!--&lt;!&ndash;<el-menu-item-group v-if="examinAdmin !== 'block'">&ndash;&gt;-->
                <!--&lt;!&ndash;<el-menu-item index="stonemonthreport">易石历史数据月汇总</el-menu-item>&ndash;&gt;-->
              <!--&lt;!&ndash;</el-menu-item-group>&ndash;&gt;-->
              <!--&lt;!&ndash;<el-menu-item-group v-if="examinAdmin !== 'block'">&ndash;&gt;-->
                <!--&lt;!&ndash;<el-menu-item index="yestodayRefund">隔日退款</el-menu-item>&ndash;&gt;-->
              <!--&lt;!&ndash;</el-menu-item-group>&ndash;&gt;-->
            <!--</el-submenu>-->
            <!--&lt;!&ndash;<div v-if="techan !== 'block'">&ndash;&gt;-->
              <!--&lt;!&ndash;<el-submenu index="5" v-bind:style="{ display: display6 }">&ndash;&gt;-->
                <!--<template slot="title">-->
                  <!--<i class="el-icon-s-shop"></i>店铺管理-->
                <!--</template>-->
                <!--<el-menu-item-group>-->
                  <!--<el-menu-item index="StoreManagement">店铺信息</el-menu-item>-->
                <!--</el-menu-item-group>-->
              <!--&lt;!&ndash;</el-submenu>&ndash;&gt;-->
              <!--<el-submenu index="6" v-bind:style="{ display: display7 }">-->
                <!--<template slot="title">-->
                  <!--<i class="el-icon-dessert"></i>椰语堂汇总-->
                <!--</template>-->
                <!--<el-menu-item-group>-->
                  <!--<el-menu-item index="yytgather">汇总信息</el-menu-item>-->
                <!--</el-menu-item-group>-->
              <!--</el-submenu>-->
            <!--&lt;!&ndash;</div>&ndash;&gt;-->
          <!--</div>-->
          <!-- 特产 -->
          <!--<div v-bind:style="{ display: techan }">-->
            <!--<el-submenu index="8" v-bind:style="{ display: display9 }">-->
              <!--<template slot="title">-->
                <!--<i class="el-icon-orange"></i>零售供应链系统-->
              <!--</template>-->
              <!--<el-menu-item-group>-->
                <!--<el-menu-item index="Retailordering">销售页面</el-menu-item>-->
              <!--</el-menu-item-group>-->
              <!--<el-menu-item-group>-->
                <!--<el-menu-item index="retailtodaylist">今日订单</el-menu-item>-->
              <!--</el-menu-item-group>-->

              <!--<el-menu-item-group>-->
                <!--<el-menu-item index="OrderImport">订单导入</el-menu-item>-->
              <!--</el-menu-item-group>-->
              <!--<el-menu-item-group>-->
                <!--<el-menu-item index="retailalllist" v-bind:style="{ display: REPORT }">全部订单</el-menu-item>-->
              <!--</el-menu-item-group>-->

              <!--<el-menu-item-group>-->
                <!--<el-menu-item index="retailunpaid">未支付订单</el-menu-item>-->
              <!--</el-menu-item-group>-->
              <!--<el-menu-item-group>-->
                <!--&lt;!&ndash;<el-menu-item&ndash;&gt;-->
                  <!--&lt;!&ndash;index="retailcollect"&ndash;&gt;-->
                  <!--&lt;!&ndash;v-bind:style="{ display: REPORT=='block'?REPORT:examinOnly }"&ndash;&gt;-->
                <!--&lt;!&ndash;&gt;订单汇总</el-menu-item>&ndash;&gt;-->
              <!--</el-menu-item-group>-->
            <!--</el-submenu>-->
            <!--<el-submenu index="9" v-bind:style="{ display: display10 }">-->
              <!--<template slot="title">-->
                <!--<i class="el-icon-menu"></i>商品管理-->
              <!--</template>-->
              <!--<el-menu-item-group>-->
                <!--<el-menu-item index="retailcommodity">商品信息</el-menu-item>-->
              <!--</el-menu-item-group>-->
              <!--<el-menu-item-group v-bind:style="{ display: Supplychain }">-->
                <!--<el-menu-item index="ProductList">新增商品</el-menu-item>-->
              <!--</el-menu-item-group>-->
            <!--</el-submenu>-->
          <!--</div>-->
          <!-- 商品审核 -->
          <!--<div v-bind:style="{ display: examin }">-->
            <!--<el-submenu index="15">-->
              <!--<template slot="title">-->
                <!--<i class="el-icon-c-scale-to-original"></i>财务审核-->
              <!--</template>-->
              <!--<el-menu-item-group>-->
                <!--<el-menu-item index="CommodityAudit">商品审核</el-menu-item>-->
              <!--</el-menu-item-group>-->
              <!--<el-menu-item-group>-->
                <!--<el-menu-item index="DetailedExaminationofCommodities">商品已审核明细</el-menu-item>-->
              <!--</el-menu-item-group>-->
              <!--<el-menu-item-group>-->
                <!--<el-menu-item index="LibraryAudit">库单审核</el-menu-item>-->
              <!--</el-menu-item-group>-->
              <!--<el-menu-item-group>-->
                <!--<el-menu-item index="Detailaudited">库单已审核明细</el-menu-item>-->
              <!--</el-menu-item-group>-->
              <!--<el-menu-item-group>-->
                <!--<el-menu-item index="Errorlibrarylist">库单不通过详情列表</el-menu-item>-->
              <!--</el-menu-item-group>-->
              <!--<el-menu-item-group>-->
                <!--<el-menu-item index="AuditofPropertyData">机场数据审核</el-menu-item>-->
              <!--</el-menu-item-group>-->
            <!--</el-submenu>-->
            <!--<el-submenu index="18" v-bind:style="{ display: Financialdisplay }">-->
              <!--<template slot="title">-->
                <!--<i class="el-icon-menu"></i>商品管理-->
              <!--</template>-->
              <!--<el-menu-item-group>-->
                <!--<el-menu-item index="FinancialCommodityAudit">商品信息</el-menu-item>-->
              <!--</el-menu-item-group>-->
            <!--</el-submenu>-->
          <!--</div>-->
          <!--<el-submenu index="17" v-bind:style="{ display: MembershipAuthority }">-->
            <!--<template slot="title">-->
              <!--<i class="el-icon-s-opportunity"></i>会员管理-->
            <!--</template>-->
            <!--<el-menu-item-group>-->
              <!--<el-menu-item index="MembershipRecharge">会员充值</el-menu-item>-->
            <!--</el-menu-item-group>-->
            <!--<el-menu-item-group>-->
              <!--<el-menu-item index="MembershipInformation">会员信息</el-menu-item>-->
            <!--</el-menu-item-group>&ndash;&gt;-->
            <!-- <el-menu-item-group>
              <el-menu-item index="RechargeSummary">会员累计充值汇总表</el-menu-item>
            </el-menu-item-group>-->
          <!--</el-submenu>-->
          <!-- 供应链 -->
          <!--<div v-bind:style="{ display: Supplychain }">-->
            <!--<el-submenu index="16">-->
              <!--<template slot="title">-->
                <!--<i class="el-icon-receiving"></i>供应商管理-->
              <!--</template>-->
              <!--<el-menu-item-group>-->
                <!--<el-menu-item index="supplychain">供应商明细</el-menu-item>-->
              <!--</el-menu-item-group>-->
            <!--</el-submenu>-->
          <!--</div>-->
          <!-- 仓库 -->
          <!--<div v-bind:style="{ display:AuditDetails }">-->
            <!--<el-submenu index="14">-->
              <!--<template slot="title">-->
                <!--<i class="el-icon-s-claim"></i>仓库审核-->
              <!--</template>-->
              <!--&lt;!&ndash; <el-menu-item-group>-->
								<!--<el-menu-item index="increased">新增商品</el-menu-item>-->
              <!--</el-menu-item-group>&ndash;&gt;-->
              <!--<el-menu-item-group>-->
                <!--<el-menu-item index="auditdetails">审核明细</el-menu-item>-->
              <!--</el-menu-item-group>-->
              <!--<el-menu-item-group>-->
                <!--<el-menu-item index="AuditofPurchaseOrder">申购单审核</el-menu-item>-->
              <!--</el-menu-item-group>-->
            <!--</el-submenu>-->
          <!--</div>-->
          <!--<div v-bind:style="{ display: warehouse }">-->
            <!--<el-submenu index="10">-->
              <!--<template slot="title">-->
                <!--<i class="el-icon-box"></i>仓库管理-->
              <!--</template>-->
              <!--&lt;!&ndash; <el-menu-item-group>-->
								<!--<el-menu-item index="increased">新增商品</el-menu-item>-->
              <!--</el-menu-item-group>&ndash;&gt;-->
              <!--&lt;!&ndash;<el-menu-item-group v-bind:style="{ display:stockcontrol }">&ndash;&gt;-->
                <!--<el-menu-item index="stock">库存管理</el-menu-item>-->
              <!--&lt;!&ndash;</el-menu-item-group>&ndash;&gt;-->

              <!--<el-menu-item-group>-->
                <!--<el-menu-item index="repertory">库存明细</el-menu-item>-->
              <!--</el-menu-item-group>-->
              <!--&lt;!&ndash; <el-menu-item-group v-bind:style="{ display:AuditDetails }">-->
								<!--<el-menu-item index="auditdetails">审核明细</el-menu-item>-->
              <!--</el-menu-item-group>&ndash;&gt;-->
              <!--<el-menu-item-group>-->
                <!--<el-menu-item index="cancel">作废明细</el-menu-item>-->
              <!--</el-menu-item-group>-->
              <!--<el-menu-item-group>-->
                <!--<el-menu-item index="theoreticalinventory">理论库存</el-menu-item>-->
              <!--</el-menu-item-group>-->

              <!--<el-menu-item-group>-->
                <!--<el-menu-item index="AuditDetailaudited">库单已审核明细</el-menu-item>-->
              <!--</el-menu-item-group>-->
              <!--<el-menu-item-group>-->
                <!--<el-menu-item index="AuditErrorlibrarylist">库单不通过详情列表</el-menu-item>-->
              <!--</el-menu-item-group>-->
            <!--</el-submenu>-->
            <!--<el-submenu index="11">-->
              <!--<template slot="title">-->
                <!--<i class="el-icon-s-finance"></i>盘点管理-->
              <!--</template>-->
              <!--<el-menu-item-group>-->
                <!--<el-menu-item index="effectivepair">盘点校对</el-menu-item>-->
              <!--</el-menu-item-group>-->
              <!--<el-menu-item-group>-->
                <!--<el-menu-item index="inventoryDerivation">盘点导出</el-menu-item>-->
              <!--</el-menu-item-group>-->
              <!--<el-menu-item-group>-->
                <!--<el-menu-item index="InventoryConsolidation">盘点合并</el-menu-item>-->
              <!--</el-menu-item-group>-->
            <!--</el-submenu>-->
            <!--<el-submenu index="12">-->
              <!--<template slot="title">-->
                <!--<i class="el-icon-document-copy"></i>调拨管理-->
              <!--</template>-->
              <!--<el-menu-item-group>-->
                <!--<el-menu-item index="inventoryallocation">库存调拨</el-menu-item>-->
              <!--</el-menu-item-group>-->
              <!--<el-menu-item-group>-->
                <!--<el-menu-item index="purchaserequisition">申购单</el-menu-item>-->
              <!--</el-menu-item-group>-->
            <!--</el-submenu>-->
          <!--</div>-->
          <!-- 店长权限 -->
          <!--<div v-bind:style="{ display: displayquan && REPORT }">-->
            <el-submenu index="7">
              <template slot="title">
                <i class="el-icon-notebook-2"></i>报表中心
              </template>
              <!--<el-menu-item index="nav">报表导航页</el-menu-item>-->
              <el-submenu index="7-1">
                <template slot="title">汇总类报表</template>
                <el-menu-item-group>
                  <el-menu-item index="Categorysummary">品类汇总</el-menu-item>
                </el-menu-item-group>
                <!--<div v-bind:style="{ display: canyinTabulation }">-->
                  <el-menu-item-group>
                    <el-menu-item index="Salesvolumesummary">餐饮单品销量汇总</el-menu-item>
                  </el-menu-item-group>
                <!--</div>-->
                <!--<div v-bind:style="{ display: lingshouTabulation }">-->
                  <el-menu-item-group>
                    <el-menu-item index="SalesvolumesummaryRetail">零售单品销量汇总</el-menu-item>
                  </el-menu-item-group>
                <!--</div>-->
                <el-menu-item-group>
                  <el-menu-item index="comprehensive">综合汇总</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group>
                  <el-menu-item index="ReportFormsLinkFelativeMonth">月环比报表</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group>
                  <el-menu-item index="ReportFormsLinkFelativeWeek">周环比报表</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group>
                  <el-menu-item index="intervalDataComparisonReportD">日环比报表</el-menu-item>
                </el-menu-item-group>

                <el-menu-item-group>
                  <el-menu-item index="DataReportDay">日汇总报表</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group>
                  <el-menu-item index="DataReportM">月汇总报表</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group>
                  <el-menu-item index="shopstonehourlyreport">易石历史数据时汇总</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group>
                  <el-menu-item index="shopstonedailyreport">易石历史数据日汇总</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group>
                  <el-menu-item index="shopstonemonthreport">易石历史数据月汇总</el-menu-item>
                </el-menu-item-group>
              </el-submenu>

              <!--零售类-->
              <!--<div v-bind:style="{ display: lingshouTabulation }">-->
                <el-submenu index="7-2">
                  <template slot="title">零售类报表</template>
                  <el-menu-item-group>
                    <el-menu-item index="theoreticalinventory_v2">库存明细报表</el-menu-item>
                  </el-menu-item-group>
                  <!--<el-menu-item-group v-bind:style="{ display: lingshouTabulation }">-->
                    <el-menu-item index="BillDetailTabulationRetail">零售账单明细表</el-menu-item>
                  <!--</el-menu-item-group>-->
                  <el-menu-item-group>
                    <el-menu-item index="salesPerformance">销售业绩报表</el-menu-item>
                  </el-menu-item-group>
                  <el-menu-item-group>
                    <el-menu-item index="SupplierSalesStatement_2">供应商销售报表</el-menu-item>
                  </el-menu-item-group>

                  <el-menu-item-group>
                    <el-menu-item index="InventoryStatement">库单报表</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
              <!--</div>-->

              <!--<el-menu-item-group v-bind:style="{ display: canyinTabulation }">-->
                <el-menu-item index="BillDetailTabulation">餐饮账单明细表</el-menu-item>
              <!--</el-menu-item-group>-->

              <el-menu-item-group>
                <el-menu-item index="OrderCouponDetail">订单优惠信息查询</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <!--<el-submenu index="13" v-bind:style="{ display: unpaiddisplay }">-->
              <!--<template slot="title">-->
                <!--<i class="el-icon-turn-off"></i>权限管理-->
              <!--</template>-->
              <!--<el-menu-item-group>-->
                <!--<el-menu-item index="promotion">门店权限设置</el-menu-item>-->
              <!--</el-menu-item-group>-->
            <!--</el-submenu>-->
          <!--</div>-->
        </el-menu>
      </el-aside>
      <!--右侧-->
      <el-container>
        <el-header
          style="text-align: right; font-size: 12px;background-color: rgb(51, 51, 51);position: relative;"
        >
          <i
            class="el-icon-s-fold username leftclose"
            style="margin-right: 15px"
            @click="hidechange"
          ></i>
          <span class="username" @click="layout">{{username}} 退出</span>
          <i class="el-icon-caret-bottom username" style="margin-right: 15px"></i>
          <!-- <el-dropdown>
						<span class="username" @click="layout">{{username}} 退出</span>
						<i class="el-icon-caret-bottom username" style="margin-right: 15px"></i>
						<el-dropdown-menu slot="dropdown" style='top: 2.5rem;'>
							<el-dropdown-item></el-dropdown-item>
							<el-dropdown-item style='padding: 0;'><span @click="layout" style="display: inline-block;padding: 0 1.25rem;">退出登录</span></el-dropdown-item>
						</el-dropdown-menu>
          </el-dropdown>-->
        </el-header>

        <!--路由出口-->
        <router-view></router-view>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    //		 		username(){
    //		 			return this.$store.state.userinfo.name
    //		 		},
    //辅助函数获取state
    ...mapState({
      userinfo: state => state.userinfo,
      username: state => state.userinfo.account,
      shopcode: state => state.userinfo.shopcode,
      ArrayList: state => state.ArrayList,
      ShopName: state => state.ShopName.shopName,
      profilesettlement: state => state.ShopName.profile_settlement,
      profilequeuetype: state => state.ShopName.profile_queue_type,
      typename: state => state.ShopName.shopName,
      shopgroup: state => state.ShopName.shop_group
    })
  },
  created() {
    console.log("=-=-=", this.examin === "none", this.examinAdmin, this.examin);
  },
  data() {
    return {
      tableData: [],
      isShows: true,
      shopnames: "",
      count: "",
      display1: "block",
      display2: "block",
      display3: "block",
      display4: "block",
      display5: "block",
      display6: "block",
      display7: "none",
      REPORT: "none",
      displayquan: "none",
      display9: "block",
      display10: "none",
      display11: "block",
      canyin: "block",
      techan: "block",
      warehouse: "none",
      stockcontrol: "none",
      AuditDetails: "none",
      examin: "none",
      examinOnly: "none",
      examinAdmin: "none",
      Supplychain: "none",
      lingshouTabulation: "none",
      canyinTabulation: "none",
      CashRegister: "none",
      unpaiddisplay: "block",
      MembershipAuthority: "none",
      Financialdisplay: "none",
      NamingMethod: "商家端点餐系统",
      NamingMethodChild: "商家点餐"
    };
  },
  methods: {
    layout() {
      let _self = this;
      _self.axios
        .post(_self.ApiUrl + "/logout")
        .then(response => {
          if (response.data.code == "200") {
            _self.$store.commit("SAVE_USERINFO", "");
            _self.$store.commit("SAVE_ArrayList", "");
            _self.$store.commit("SAVE_ShopName", "");
            _self.$store.commit("SAVE_BillData", "");
            _self.$store.commit("SAVE_AllPayment", "");
            _self.$router.push("/login");
            _self.$message({
              type: "success",
              message: "退出成功"
            });
          } else {
            _self.$router.push("/login");
            _self.$store.commit("SAVE_USERINFO", "");
            _self.$store.commit("SAVE_ArrayList", "");
            _self.$store.commit("SAVE_ShopName", "");
            _self.$store.commit("SAVE_BillData", "");
            _self.$store.commit("SAVE_AllPayment", "");
            _self.$message({
              type: "error",
              message: "退出失败"
            });
          }
        })
        .catch(function(error) {
          _self.$router.push("/login");
          _self.$store.commit("SAVE_USERINFO", "");
          _self.axios
            .post(_self.ApiUrl + "/logout")
            .then(response => {
              if (response.data.code == "200") {
                _self.$store.commit("SAVE_USERINFO", "");
                _self.$store.commit("SAVE_ArrayList", "");
                _self.$store.commit("SAVE_ShopName", "");
                _self.$store.commit("SAVE_BillData", "");
                _self.$store.commit("SAVE_AllPayment", "");
                _self.$router.push("/login");
              } else {
                _self.$router.push("/login");
                _self.$store.commit("SAVE_USERINFO", "");
                _self.$store.commit("SAVE_ArrayList", "");
                _self.$store.commit("SAVE_BillData", "");
                _self.$store.commit("SAVE_ShopName", "");
                _self.$store.commit("SAVE_AllPayment", "");
              }
            })
            .catch(function(error) {
              _self.$router.push("/login");
              _self.$store.commit("SAVE_USERINFO", "");
              _self.$store.commit("SAVE_ArrayList", "");
              _self.$store.commit("SAVE_BillData", "");
              _self.$store.commit("SAVE_ShopName", "");
              _self.$store.commit("SAVE_AllPayment", "");
            });
          _self.$message.error("响应时间过长，请重试");
        });
    },
    // logins() {
    //   let _self = this;
    //   console.log(_self.ArrayList);
    //   if (
    //     _self.$store.state.userinfo == "" ||
    //     _self.$store.state.userinfo == undefined ||
    //     _self.$store.state.userinfo == null
    //   ) {
    //     _self.$router.push("/login");
    //     _self.axios
    //       .post(_self.ApiUrl + "/logout")
    //       .then(response => {
    //         if (response.data.code == "200") {
    //           _self.$store.commit("SAVE_USERINFO", "");
    //           _self.$store.commit("SAVE_ArrayList", "");
    //           _self.$store.commit("SAVE_ShopName", "");
    //           _self.$router.push("/login");
    //         } else {
    //           _self.$router.push("/login");
    //           _self.$store.commit("SAVE_USERINFO", "");
    //           _self.$store.commit("SAVE_ArrayList", "");
    //           _self.$store.commit("SAVE_ShopName", "");
    //         }
    //       })
    //       .catch(function(error) {
    //         _self.$router.push("/login");
    //         _self.$store.commit("SAVE_USERINFO", "");
    //         _self.$store.commit("SAVE_ArrayList", "");
    //         _self.$store.commit("SAVE_ShopName", "");
    //       });
    //   }
    // },
    // 隐藏开关
    hidechange() {
      let _self = this;
      _self.isShows = !_self.isShows;
    }
  },
  async mounted() {
    this.logins();
    await this.gettodaylist();
  }
};
</script>

<style>
.el-header {
  background-color: #263445;
  color: #333;
  line-height: 56px;
  height: 56px !important;
}

.el-aside {
  background-color: rgb(51, 51, 51) !important;
}

html,
body,
#app,
.index {
  height: 100%;
  overflow-y: hidden;
}

.leftclose {
  position: absolute;
  left: 0.625rem;
  line-height: 56px;
}

.el-container {
  height: 100% !important;
}

.el-menu {
  border-right: 0;
}

.top-header {
  text-align: center;
  padding: 18px 0;
  background: #333333;
}

.top-header .title {
  color: #fff;
  font-weight: bold;
}

.top {
  /* background: #1c1c1c !important; */
  border-bottom: 3px solid #1c1c1c;
  height: 7.5rem;
}

.username {
  font-size: 16px;
  color: #fff;
  cursor: pointer;
}

.slow {
  width: 25px;
  height: 25px;
  display: inline-block;
  border-radius: 50%;
  background: #ff0000;
  color: white;
  margin-left: 10px;
  font-size: 12px;
  text-align: center;
  position: relative;
}

.slow span {
  position: absolute;
  top: -13px;
  left: 0;
  width: 100%;
}

.el-popper {
  margin-top: -0.7rem !important;
}
</style>
