import axios from 'axios'
import Vue from 'vue'
const Qs = require('qs');

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export function login(account,password){
  return axios.post(Vue.prototype.ApiUrl + "/login", {
    account: account,
    password: password
  })
}
//审核功能
export function updatGoodsPendingState(params){
  return axios.post(Vue.prototype.ApiurlStorehouse + "/productManagement/updatGoodsPendingState", Qs.stringify(params),          {
    // 单独配置
    withCredentials: false
  })
}
//审核通过功能
export function updatGoodsPendingStateFinance(params){
  return axios.post(Vue.prototype.ApiurlStorehouse + "/productManagement/updatGoodsPendingState", Qs.stringify(params),          {
    // 单独配置
    withCredentials: false
  })
}
//隔日退款
export function LateRefundListCode(params){
  return axios.post(Vue.prototype.ApiUrl+"/home/LateRefundListCode", Qs.stringify(params))
}
export function LateRefundListDate(params){
  return axios.post(Vue.prototype.ApiUrl+"/home/LateRefundListDate", Qs.stringify(params))
}
export function getOrderPrdCode(params){
  return axios.post(Vue.prototype.ApiUrl+"/home/OrderPrdCode", Qs.stringify(params))
}
export function addLateRefundList(params){
  return axios.post(Vue.prototype.ApiUrl+"/home/addLateRefundList", Qs.stringify(params))
}

// 仓库管理
export function getInvBillsList(params){
  return axios.post(Vue.prototype.ApiurlStorehouse+"/inventory/getInvBillsList", Qs.stringify(params))
}
//审核通过功能
export function getGoodsCheckList(params){
  return axios.post(Vue.prototype.ApiurlStorehouse + "/productManagement/getGoodsCheckList", Qs.stringify(params))
}
//用户id获取可用门店
export function showUserReportLimited(params){
  return axios.post(Vue.prototype.ApiUrl + "/home/showUserReportLimited", Qs.stringify(params))
  // return axios.get("/testApi/home/showUserReportLimited", Qs.stringify(params))
}
// 抹零
export function newMaLing(params){
  return axios.post(Vue.prototype.ApiUrls + "/buyer/newMaLing", Qs.stringify(params))
  // return axios.get("/testApi/home/showUserReportLimited", Qs.stringify(params))
}
// 无打折权限的店铺
export function enumerationSorting(params){
  return axios.post(Vue.prototype.ApiUrl + "/catering/enumerationSorting", Qs.stringify(params))
}
// 门店销售日报表(区域汇总)
export function shopAreaReportD(params){
  return axios.post(Vue.prototype.ApiUrl + "/home/shopAreaReportD", Qs.stringify(params))
}
// 门店销售月报表(区域汇总))
export function shopAreaReportM(params){
  return axios.post(Vue.prototype.ApiUrl + "/home/shopAreaReportM", Qs.stringify(params))
}
// 门店销售日(区域汇总)
export function RetailSaleSummary(params){
  return axios.post(Vue.prototype.ApiUrl + "/home/RetailSaleSummary", Qs.stringify(params))
}
// 供应商(区域汇总)
export function providerShopSalesList(params){
  return axios.post(Vue.prototype.ApiUrl + "/home/providerShopSalesList", Qs.stringify(params))
}
// 获取店铺list
export function getShopList(params){
  return axios.post(Vue.prototype.ApiUrl + "/commodity/getShopList", Qs.stringify(params))
}
// 获取供应商list
export function ProviderInfoList(params){
  return axios.post(Vue.prototype.ApiUrl + "/home/ProviderInfoList", Qs.stringify(params))
}
// 打印标记
export function printRecord(params){
  return axios.post(Vue.prototype.ApiurlStorehouse + "/inventory/printRecord", Qs.stringify(params))
}
// 全部外卖订单
export function getShopAllDeliveryOrders(params){
  return axios.get(Vue.prototype.ApiUrl + "/catering/getShopAllDeliveryOrders?"+Qs.stringify(params) )
}
export function editOrderInformation(params){
  return axios.post(Vue.prototype.ApiUrl + "/catering/editOrderInformation", Qs.stringify(params) )
}
// 外卖全部订单退款
export function getPayCode(params){
  return axios.post(Vue.prototype.Gxpay + "/unifyPay/getPayCode", Qs.stringify(params) )
}
export function shouShopPayBodyCode(params){
  return axios.post(Vue.prototype.Gxpay + "/unifyPay/shouShopPayBodyCode", Qs.stringify(params) )
}
export function wxRefund(params){
  return axios.post(Vue.prototype.Gxpay + "/unifyPay/wxRefund", Qs.stringify(params) )
}
export function wxRefundQuery(params){
  return axios.post(Vue.prototype.Gxpay + "/unifyPay/wxRefundQuery", Qs.stringify(params) )
}
export function wxMicroPay(params){
  return axios.post(Vue.prototype.Gxpay + "/unifyPay/wxMicroPay", Qs.stringify(params) )
}
export function cateringFullRefund(params){
  return axios.post(Vue.prototype.ApiUrls + "/buyer/cateringFullRefund", Qs.stringify(params) ,    // 单独配置
  {withCredentials: false})

}
