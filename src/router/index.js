//import Vue from 'vue'
import Router from 'vue-router'

//引入组件
//import login from '@/components/login'
//import index from '@/view/index/index'
//异步加载
//const login = resolve => require(['@/components/login'], resolve),
//const index = resolve => require(['@/view/index/index'], resolve),
//const todaylist = resolve => require(['@/view/todaylist/todaylist'], resolve),
//const alllist = resolve => require(['@/view/alllist/alllist'], resolve),
//const home = resolve => require(['@/view/home/home'], resolve),
//注册路由
Vue.use(Router)

//导出路由
export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component:  resolve => require(["@/components/login"], resolve)
    },
    {
      path: '/advertisement',
      name: 'advertisement',
      component:  resolve => require(["@/view/advertisement"], resolve)
    },
    {
      path: '/',
      name: 'index',
      component: resolve => require(['@/view/index/index'], resolve),
      children: [{
          path: '',
          name: 'home',
          component: resolve => require(['@/view/home/home'], resolve),
        },
        {
          path: '/todaylist',
          name: 'todaylist',
          component: resolve => require(['@/view/todaylist/todaylist'], resolve),
        },
        {
          path: '/alllist',
          name: 'alllist',
          component: resolve => require(['@/view/alllist/alllist'], resolve),
        },
        {
          path: '/business',
          name: 'business',
          component: resolve => require(['@/view/business/business'], resolve),
        },
        {
          path: '/unpaid',
          name: 'unpaid',
          component: resolve => require(['@/view/unpaid/unpaid'], resolve),
        },
        {
          path: '/collect',
          name: 'collect',
          component: resolve => require(['@/view/collect/collect'], resolve),
        },
        {
          path: '/commodity',
          name: 'commodity',
          component: resolve => require(['@/view/commodity/commodity'], resolve),
        },
        {
          path: '/storesummary',
          name: 'storesummary',
          component: resolve => require(['@/view/storesummary/storesummary'], resolve),
        },
        {
          path: '/refunddetail',
          name: 'refunddetail',
          component: resolve => require(['@/view/storesummary/refunddetail'], resolve),
        },
        {
          path: '/financialSummaryDay',
          name: 'financialSummaryDay',
          component: resolve => require(['@/view/storesummary/financialSummaryDay'], resolve),
        },
        {
          path: '/profitStatement',
          name: 'profitStatement',
          component: resolve => require(['@/view/storesummary/profitStatement'], resolve),
        },
        {
          path: '/checkexport',
          name: 'checkexport',
          component: resolve => require(['@/view/storesummary/checkexport'], resolve),
        },
        {
          path: '/storedetail',
          name: 'storedetail',
          component: resolve => require(['@/view/storedetail/storedetail'], resolve),
        },
        {
          path: '/shoprefunddetail',
          name: 'shoprefunddetail',
          component: resolve => require(['@/view/storedetail/shoprefunddetail'], resolve),
        },
        {
          path: '/category',
          name: 'category',
          component: resolve => require(['@/view/category/category'], resolve),
        },
        {
          path: '/StoreManagement',
          name: 'StoreManagement',
          component: resolve => require(['@/view/StoreManagement/StoreManagement'], resolve),
        },
        {
          path: '/yytgather',
          name: 'yytgather',
          component: resolve => require(['@/view/yytgather/yytgather'], resolve),
        },
        {
          path: '/Categorysummary',
          name: 'Categorysummary',
          component: resolve => require(['@/view/Categorysummary/Categorysummary'], resolve),
        },
        {
          path: '/Salesvolumesummary',
          name: 'Salesvolumesummary',
          component: resolve => require(['@/view/Salesvolumesummary/Salesvolumesummary'], resolve),
        },
        {
          path: '/comprehensive',
          name: 'comprehensive',
          component: resolve => require(['@/view/comprehensive/comprehensive'], resolve),
        },
        {
          path: '/Retailordering',
          name: 'Retailordering',
          component: resolve => require(['@/retail/Retailordering/Retailordering'], resolve),
        },
        {
          path: '/retailtodaylist',
          name: 'retailtodaylist',
          component: resolve => require(['@/retail/todaylist/todaylist'], resolve),
        },
        {
          path: '/retailcollect',
          name: 'retailcollect',
          component: resolve => require(['@/retail/collect/collect'], resolve),
        },
        {
          path: '/retailunpaid',
          name: 'retailunpaid',
          component: resolve => require(['@/retail/unpaid/unpaid'], resolve),
        },
        {
          path: '/retailalllist',
          name: 'retailalllist',
          component: resolve => require(['@/retail/alllist/alllist'], resolve),
        },
        {
          path: '/takeOutList',
          name: 'takeOutList',
          component: resolve => require(['@/view/takeoutList/takeoutList'], resolve),
        },
        {
          path: '/retailcommodity',
          name: 'retailcommodity',
          component: resolve => require(['@/retail/commodity/commodity'], resolve),
        },
        {
          path: '/increased',
          name: 'increased',
          component: resolve => require(['@/storehouse/increased/increased'], resolve),
        }, {
          path: '/stock',
          name: 'stock',
          component: resolve => require(['@/storehouse/stock/stock'], resolve),
        }, {
          path: '/BillDetailTabulation',
          name: 'BillDetailTabulation',
          component: resolve => require(['@/view/BillDetailTabulation/BillDetailTabulation'], resolve),
        }, {
          path: '/ReportFormsLinkFelativeMonth',
          name: 'ReportFormsLinkFelativeMonth',
          component: resolve => require(['@/view/ReportFormsLinkFelativeMonth/ReportFormsLinkFelativeMonth'], resolve),
        }, {
          path: '/ReportFormsLinkFelativeWeek',
          name: 'ReportFormsLinkFelativeWeek',
          component: resolve => require(['@/view/ReportFormsLinkFelativeWeek/ReportFormsLinkFelativeWeek'], resolve),
        },
        {
          path: '/intervalDataComparisonReportD',
          name: 'intervalDataComparisonReportD',
          component: resolve => require(['@/view/intervalDataReportD/intervalDataComparisonReportD'], resolve),
        },

        {
          path: '/addstock',
          name: 'addstock',
          component: resolve => require(['@/storehouse/addstock/addstock'], resolve),
        },
        {
          path: '/stockdetail',
          name: 'stockdetail',
          component: resolve => require(['@/storehouse/stockdetail/stockdetail'], resolve),
        },
        {
          path: '/exhibition',
          name: 'exhibition',
          component: resolve => require(['@/storehouse/exhibition/exhibition'], resolve),
        },
        {
          path: '/exhibitionstok',
          name: 'exhibitionstok',
          component: resolve => require(['@/storehouse/exhibition/exhibitionstok'], resolve),
        },
        {
          path: '/auditdetails',
          name: 'auditdetails',
          component: resolve => require(['@/storehouse/auditdetails/auditdetails'], resolve),
        },
        {
          path: '/cancel',
          name: 'cancel',
          component: resolve => require(['@/storehouse/cancel/cancel'], resolve),
        },
        {
          path: '/repertory',
          name: 'repertory',
          component: resolve => require(['@/storehouse/repertory/repertory'], resolve),
        }, {
          path: '/StoreBillDetailTabulation',
          name: 'StoreBillDetailTabulation',
          component: resolve => require(['@/view/storesummary/StoreBillDetailTabulation'], resolve),
        }, {
          path: '/effectivepair',
          name: 'effectivepair',
          component: resolve => require(['@/storehouse/effectivepair/effectivepair'], resolve),
        }, {
          path: '/inventoryDerivation',
          name: 'inventoryDerivation',
          component: resolve => require(['@/storehouse/effectivepair/inventoryDerivation'], resolve),
        }, {
          path: '/inventoryallocation',
          name: 'inventoryallocation',
          component: resolve => require(['@/storehouse/inventoryallocation/inventoryallocation'], resolve),
        }, {
          path: '/inventoryalauditdetails',
          name: 'inventoryalauditdetails',
          component: resolve => require(['@/storehouse/inventoryallocation/auditdetails'], resolve),
        }, {
          path: '/inventoryalstockdetail',
          name: 'inventoryalstockdetail',
          component: resolve => require(['@/storehouse/inventoryallocation/stockdetail'], resolve),
        }, {
          path: '/inventoryalexhibition',
          name: 'inventoryalexhibition',
          component: resolve => require(['@/storehouse/inventoryallocation/exhibition'], resolve),
        }, {
          path: '/inventoryalcancel',
          name: 'inventoryalcancel',
          component: resolve => require(['@/storehouse/inventoryallocation/cancel'], resolve),
        }, {
          path: '/todaycredit',
          name: 'todaycredit',
          component: resolve => require(['@/view/todaycredit/todaycredit'], resolve),
        }, {
          path: '/addmenu',
          name: 'addmenu',
          component: resolve => require(['@/view/addmenu/addmenu'], resolve),
        }, {
          path: '/salesPerformance',
          name: 'salesPerformance',
          component: resolve => require(['@/view/ReportFormsCentre/salesPerformance'], resolve),
        }, {
          path: '/categoryup',
          name: 'categoryup',
          component: resolve => require(['@/view/category/categoryup'], resolve),
        }, {
          path: '/promotion',
          name: 'promotion',
          component: resolve => require(['@/view/authorization/promotion'], resolve),
        },
        {
          path: '/theoreticalinventory',
          name: 'theoreticalinventory',
          component: resolve => require(['@/retail/theoreticalinventory/theoreticalinventory'], resolve),
        },
        {
          path: '/DataReportDay',
          name: 'DataReportDay',
          component: resolve => require(['@/view/ReportFormsCentre/DataReportDay'], resolve),
        },
        {
          path: '/DataReportM',
          name: 'DataReportM',
          component: resolve => require(['@/view/ReportFormsCentre/DataReportM'], resolve),
        },
        {
          path: '/storesummaryall',
          name: 'storesummaryall',
          component: resolve => require(['@/view/storesummary/storesummaryall'], resolve),
        }, {
          path: '/OrderCouponDetail',
          name: 'OrderCouponDetail',
          component: resolve => require(['@/view/ReportFormsCentre/OrderCouponDetail'], resolve),
        }, {
          path: '/purchaserequisition',
          name: 'purchaserequisition',
          component: resolve => require(['@/storehouse/purchaserequisition/purchaserequisition'], resolve),
        }, {
          path: '/purchaseexhibition',
          name: 'purchaseexhibition',
          component: resolve => require(['@/storehouse/purchaserequisition/exhibition'], resolve),
        }, {
          path: '/purchasestockdetail',
          name: 'purchasestockdetail',
          component: resolve => require(['@/storehouse/purchaserequisition/stockdetail'], resolve),
        }, {
          path: '/AuditofPurchaseOrder',
          name: 'AuditofPurchaseOrder',
          component: resolve => require(['@/storehouse/auditdetails/AuditofPurchaseOrder'], resolve),
        },
        {
          path: '/SupplierSalesStatement',
          name: 'SupplierSalesStatement',
          component: resolve => require(['@/view/storesummary/SupplierSalesStatement'], resolve),
        },
        {
          path: '/shopAreaReportD',
          name: 'shopAreaReportD',
          component: resolve => require(['@/view/storesummary/ShopAreaReportD'], resolve),
        },
        {
          path: '/ShopAreaReportM',
          name: 'shopAreaReportM',
          component: resolve => require(['@/view/storesummary/ShopAreaReportM'], resolve),
        },
        {
          path: '/RetailSaleSummary',
          name: 'RetailSaleSummary',
          component: resolve => require(['@/view/storesummary/RetailSaleSummary'], resolve),
        },
        {
          path: '/ProviderShopSalesList',
          name: 'ProviderShopSalesList',
          component: resolve => require(['@/view/storesummary/ProviderShopSalesList'], resolve),
        },
        {
          path: '/SupplierSalesStatement_2',
          name: 'SupplierSalesStatement_2',
          component: resolve => require(['@/view/ReportFormsCentre/SupplierSalesStatement_2'], resolve),
        },
        {
          path: '/ProductList',
          name: 'ProductList',
          component: resolve => require(['@/retail/commodity/ProductList'], resolve),
        },
        {
          path: '/newlyIncreased',
          name: 'newlyIncreased',
          component: resolve => require(['@/retail/commodity/newlyIncreased'], resolve),
        },
        {
          path: '/CommodityModification',
          name: 'CommodityModification',
          component: resolve => require(['@/retail/commodity/CommodityModification'], resolve),
        },
        {
          path: '/CommodityDetails',
          name: 'CommodityDetails',
          component: resolve => require(['@/retail/commodity/CommodityDetails'], resolve),
        },
        { //商品审核
          path: '/CommodityAudit',
          name: 'CommodityAudit',
          component: resolve => require(['@/retail/commodity/CommodityAudit'], resolve),
        },
        { //商品审核明细
          path: '/DetailedExaminationofCommodities',
          name: 'DetailedExaminationofCommodities',
          component: resolve => require(['@/retail/commodity/DetailedExaminationofCommodities'], resolve),
        },

        { //供应商
          path: '/supplychain',
          name: 'supplychain',
          component: resolve => require(['@/retail/supplychain/supplychain'], resolve),
        }, {
          path: '/BillDetailTabulationRetail',
          name: 'BillDetailTabulationRetail',
          component: resolve => require(['@/view/ReportFormsCentre/BillDetailTabulationRetail'], resolve),
        }, {
          path: '/CommodityModificationAudit',
          name: 'CommodityModificationAudit',
          component: resolve => require(['@/retail/commodity/CommodityModificationAudit'], resolve),
        }, {
          path: '/warehousequery',
          name: 'warehousequery',
          component: resolve => require(['@/storehouse/warehousequery/warehousequery'], resolve),
        },
        {
          path: '/warehousedetail',
          name: 'warehousedetail',
          component: resolve => require(['@/storehouse/warehousequery/warehousedetail'], resolve),
        },
        {
          path: '/theoreticalinventory_v2',
          name: 'theoreticalinventory_v2',
          component: resolve => require(['@/view/ReportFormsCentre/theoreticalinventory_v2'], resolve),
        },
        {
          path: '/InventoryStatement',
          name: 'InventoryStatement',
          component: resolve => require(['@/view/ReportFormsCentre/InventoryStatement'], resolve),
        },
        {
          path: '/InventoryStatement_v2',
          name: 'InventoryStatement_v2',
          component: resolve => require(['@/view/storesummary/InventoryStatement_v2'], resolve),
        },
        {
          path: '/BillDetailTabulationRetail_v2',
          name: 'BillDetailTabulationRetail_v2',
          component: resolve => require(['@/view/storesummary/BillDetailTabulationRetail_v2'], resolve),
        }, {
          path: '/SalesvolumesummaryRetail',
          name: 'SalesvolumesummaryRetail',
          component: resolve => require(['@/view/ReportFormsCentre/SalesvolumesummaryRetail'], resolve),
        },
        {
          path: '/SupplierSalesStatement_3',
          name: 'SupplierSalesStatement_3',
          component: resolve => require(['@/view/storesummary/SupplierSalesStatement_3'], resolve),
        },
        {
          path: '/AuditofPropertyData',
          name: 'AuditofPropertyData',
          component: resolve => require(['@/view/storesummary/AuditofPropertyData'], resolve),
        },
        {
          path: '/MembershipRecharge',
          name: 'MembershipRecharge',
          component: resolve => require(['@/view/MembershipRecharge/MembershipRecharge'], resolve),
        },
        {
          path: '/StockSellStorage',
          name: 'StockSellStorage',
          component: resolve => require(['@/view/storesummary/StockSellStorage'], resolve),
        },
        {
          path: '/LibraryAudit',
          name: 'LibraryAudit',
          component: resolve => require(['@/storehouse/LibraryAudit/LibraryAudit'], resolve),
          meta: {
            keepAlive: true // 需要被缓存
          }
        },
        {
          path: '/Auditexhibition',
          name: 'Auditexhibition',
          component: resolve => require(['@/storehouse/LibraryAudit/Auditexhibition'], resolve),
          meta: {
            keepAlive: true // 需要被缓存
          }
        },
        {
          path: '/Detailaudited',
          name: 'Detailaudited',
          component: resolve => require(['@/storehouse/LibraryAudit/Detailaudited'], resolve),
        },
        {
          path: '/Errorlibrarylist',
          name: 'Errorlibrarylist',
          component: resolve => require(['@/storehouse/LibraryAudit/Errorlibrarylist'], resolve),
        },
        {
          path: '/Errorlibrarylistdetail',
          name: 'Errorlibrarylistdetail',
          component: resolve => require(['@/storehouse/LibraryAudit/Errorlibrarylistdetail'], resolve),
          meta: {
            keepAlive: true // 需要被缓存
          }
        },
        {
          path: '/Errorlibrarylistdetail2',
          name: 'Errorlibrarylistdetail2',
          component: resolve => require(['@/storehouse/LibraryAudit/Errorlibrarylistdetail2'], resolve),
        },
        {
          path: '/InventoryConsolidation',
          name: 'InventoryConsolidation',
          component: resolve => require(['@/storehouse/effectivepair/InventoryConsolidation'], resolve),
        },
        {
          path: '/AuditDetailaudited',
          name: 'AuditDetailaudited',
          component: resolve => require(['@/storehouse/WarehouseAuditList/Detailaudited'], resolve),
        },
        {
          path: '/AuditErrorlibrarylist',
          name: 'AuditErrorlibrarylist',
          component: resolve => require(['@/storehouse/WarehouseAuditList/Errorlibrarylist'], resolve),
        },
        {
          path: '/cashiers',
          name: 'cashiers',
          component: resolve => require(['@/view/canteenterm/cashiers'], resolve),
        },
        {
          path: '/shopdailyreport',
          name: 'shopdailyreport',
          component: resolve => require(['@/view/storesummary/shopdailyreport'], resolve),
        },
        {
          path: '/FinancialCommodityAudit',
          name: 'FinancialCommodityAudit',
          component: resolve => require(['@/retail/FinancialCommodityAudit/FinancialCommodityAudit'], resolve),
        },
        {
          path: '/RechargeSummary',
          name: 'RechargeSummary',
          component: resolve => require(['@/view/MembershipRecharge/RechargeSummary'], resolve),
        }, {
          path: '/shopstonehourlyreport',
          name: 'shopstonehourlyreport',
          component: resolve => require(['@/view/ReportFormsCentre/shopstonehourlyreport'], resolve),
        },
        {
          path: '/shopstonedailyreport',
          name: 'shopstonedailyreport',
          component: resolve => require(['@/view/ReportFormsCentre/shopstonedailyreport'], resolve),
        },
        {
          path: '/shopstonemonthreport',
          name: 'shopstonemonthreport',
          component: resolve => require(['@/view/ReportFormsCentre/shopstonemonthreport'], resolve),
        },
        {
          path: '/stonehourlyreport',
          name: 'stonehourlyreport',
          component: resolve => require(['@/view/storesummary/stonehourlyreport'], resolve),
        },
        {
          path: '/stonedailyreport',
          name: 'stonedailyreport',
          component: resolve => require(['@/view/storesummary/stonedailyreport'], resolve),
        },
        {
          path: '/stonemonthreport',
          name: 'stonemonthreport',
          component: resolve => require(['@/view/storesummary/stonemonthreport'], resolve),
        },
        // 隔日退款
        {
          path: '/yestodayRefund',
          name: 'yestodayRefund',
          component: resolve => require(['@/view/storesummary/yestodayRefund'], resolve),
        },
        {
          path: '/commodityinfo',
          name: 'commodityinfo',
          component: resolve => require(['@/view/storesummary/commodityinfo'], resolve),
        },
        {
          path: '/providerreport',
          name: 'providerreport',
          component: resolve => require(['@/view/storesummary/providerreport'], resolve),
        },
        {
          path: '/salesendkeep',
          name: 'salesendkeep',
          component: resolve => require(['@/view/storesummary/salesendkeep'], resolve),
        },
        {
          path: '/nav',
          name: 'nav',
          component: resolve => require(['@/view/index/nav'], resolve),
        }, {
          path: '/OrderImport',
          name: 'OrderImport',
          component: resolve => require(['@/retail/todaylist/OrderImport'], resolve),
        }, {
          path: '/MembershipInformation',
          name: 'MembershipInformation',
          component: resolve => require(['@/view/MembershipRecharge/MembershipInformation'], resolve),
        }, { //今日外卖
          path: '/Takeawaytoday',
          name: 'Takeawaytoday',
          component: resolve => require(['@/view/Takeawaytoday/Takeawaytoday'], resolve),
        }, {
          path: '/MembershipRecharge2',
          name: 'MembershipRecharge2',
          component: resolve => require(['@/view/MembershipRecharge/MembershipRecharge2'], resolve),
        }, {
          path: '/MembershipInformation2',
          name: 'MembershipInformation2',
          component: resolve => require(['@/view/MembershipRecharge/MembershipInformation2'], resolve),
        }, {
          path: '/reconciliation',
          name: 'reconciliation',
          component: resolve => require(['@/view/reconciliation/reconciliation'], resolve),
        }
      ]
    }
  ]
})
