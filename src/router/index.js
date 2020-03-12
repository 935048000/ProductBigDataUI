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
    // {
    //   path: '/login',
    //   name: 'login',
    //   component:  resolve => require(["@/components/login"], resolve)
    // },
    // {
    //   path: '/advertisement',
    //   name: 'advertisement',
    //   component:  resolve => require(["@/view/advertisement"], resolve)
    // },
    {
      path: '/',
      name: 'index',
      component: resolve => require(['@/view/index/index'], resolve),
      children: [
        // {
        //   path: '',
        //   name: 'home',
        //   component: resolve => require(['@/view/home/home'], resolve),
        // },
        // {
        //   path: '/todaylist',
        //   name: 'todaylist',
        //   component: resolve => require(['@/view/todaylist/todaylist'], resolve),
        // },
        {
          path: '/salesPerformance',
          name: 'salesPerformance',
          component: resolve => require(['@/view/ReportFormsCentre/salesPerformance'], resolve),
        },
        // {
        //   path: '/categoryup',
        //   name: 'categoryup',
        //   component: resolve => require(['@/view/category/categoryup'], resolve),
        // },
        {
          path: '/DataReportDay',
          name: 'DataReportDay',
          component: resolve => require(['@/view/ReportFormsCentre/DataReportDay'], resolve),
        },
        {
          path: '/DataReportM',
          name: 'DataReportM',
          component: resolve => require(['@/view/ReportFormsCentre/DataReportM'], resolve),
        }, {
          path: '/OrderCouponDetail',
          name: 'OrderCouponDetail',
          component: resolve => require(['@/view/ReportFormsCentre/OrderCouponDetail'], resolve),
        },
        {
          path: '/SupplierSalesStatement_2',
          name: 'SupplierSalesStatement_2',
          component: resolve => require(['@/view/ReportFormsCentre/SupplierSalesStatement_2'], resolve),
        },{
          path: '/BillDetailTabulationRetail',
          name: 'BillDetailTabulationRetail',
          component: resolve => require(['@/view/ReportFormsCentre/BillDetailTabulationRetail'], resolve),
        }, {
          path: '/CommodityModificationAudit',
          name: 'CommodityModificationAudit',
          component: resolve => require(['@/retail/commodity/CommodityModificationAudit'], resolve),
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
        }, {
          path: '/SalesvolumesummaryRetail',
          name: 'SalesvolumesummaryRetail',
          component: resolve => require(['@/view/ReportFormsCentre/SalesvolumesummaryRetail'], resolve),
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
        // {
        //   path: '/reconciliation',
        //   name: 'reconciliation',
        //   component: resolve => require(['@/view/reconciliation/reconciliation'], resolve),
        // }
      ]
    }
  ]
})
