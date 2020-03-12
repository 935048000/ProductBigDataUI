import axios from 'axios';
// import Vue from "vue";
import App from './App'
import router from './router'
import store from './vuex/store'
import devLogin from '@/devLogin'

import Print from './vuex/print'
Vue.use(Print) // 注册
import Navigation from 'vue-navigation'

Vue.use(Navigation, { router })
//挂载在vue原型上

Vue.prototype.axios = axios;
axios.defaults.withCredentials = true
Vue.config.productionTip = false
// 定义域名
let ApiurlStorehouse 
let ApiUrls 
let ApiUrlMember 
let ApiUrlMember2 
let TotalIntegral 
let integraltoken 
let ApiUrl 
let integralappid 
let Gxpay 
if(process.env.EVN_CONFIG === 'test'){
   ApiurlStorehouse = 'http://114.55.126.232:8085';  //测试
   ApiUrls = 'http://114.55.126.232:8082';//测试
   ApiUrlMember = 'http://115.29.228.150:8626';//测试
   ApiUrl = 'http://dc.daisha.com.cn:8094';//测试
   ApiUrlMember2 = 'http://114.55.126.232:8087';//测试
   TotalIntegral = 'https://practice.jifen360.com';//测试
   integraltoken = 'f8SNF6hcUwVgj2HXtwt6wpkgtPLzHGoM'//测试/
   integralappid = 'rckTBu3FIb9Y47aQmT'//测试
   Gxpay = 'http://114.55.126.232:8086'
}else if(process.env.EVN_CONFIG === 'prod'){
   // ApiurlStorehouse = 'https://inventory.daisha.com.cn:443';  //正式
   ApiurlStorehouse = 'http://mall.dehgx.com:8085';  //正式
   ApiUrls = 'http://mall.dehgx.com:8082';  //正式
   // ApiUrls = 'https://catering.daisha.com.cn:443';
   ApiUrlMember = 'https://member.daisha.com.cn';//正式
   // ApiUrl = 'http://catering.daisha.com.cn:8084';  //正式
   ApiUrl = 'http://mall.dehgx.com:9084';  //正式
   ApiUrlMember2 = 'http://prime.dehdata.com:8087';//正式
   TotalIntegral = 'https://api-new.jifen360.com';//正式
   integraltoken = 'loAUuqDK9sEq2s1m0H2FglQu4il045Xq'
   integralappid = 'PGBTJ88fUpfPPJPQPt'//正式
   Gxpay = 'http://114.55.126.232:8086'
}else if(process.env.EVN_CONFIG === 'old'){
   ApiurlStorehouse = 'https://inventory.daisha.com.cn:443';  //正式
   // ApiurlStorehouse = 'http://mall.dehgx.com:8085';  //正式
   // ApiUrls = 'http://mall.dehgx.com:8082';  //正式
   ApiUrls = 'https://catering.daisha.com.cn:443';
   ApiUrlMember = 'https://member.daisha.com.cn';//正式
   ApiUrl = 'http://catering.daisha.com.cn:8084';  //正式
   // ApiUrl = 'http://mall.dehgx.com:9084';  //正式
   ApiUrlMember2 = 'http://prime.dehdata.com:8087';//正式
   TotalIntegral = 'https://api-new.jifen360.com';//正式
   integraltoken = 'loAUuqDK9sEq2s1m0H2FglQu4il045Xq'
   integralappid = 'PGBTJ88fUpfPPJPQPt'//正式
}
else{
   console.log('run dev');
   ApiUrl = '/api'
   ApiurlStorehouse = '/ApiurlStorehouse';  //测试
   ApiUrls = '/ApiUrls';//测试
   ApiUrlMember = '/ApiUrlMember';//测试
   ApiUrlMember2 = '/SecondApiUrlMember';//测试
   TotalIntegral = '/TotalIntegral';//测试
   integraltoken = 'f8SNF6hcUwVgj2HXtwt6wpkgtPLzHGoM'//测试/
   integralappid = 'rckTBu3FIb9Y47aQmT'//测试
   Gxpay = '/Gxpay'
}
const realmphp = 'https://dolphin.daisha.com.cn/weixinbydc/' //支付

// //const ApiurlStorehouse = 'http://localhost:8085';
// const ApiurlStorehouse = 'http://114.55.126.232:8085';  //测试
// //const ApiurlStorehouse = 'https://inventory.daisha.com.cn:443';  //正式


// const ApiUrl = '/api';
// // const ApiUrl = 'http://dc.daisha.com.cn:8094';//测试
// //const ApiUrl = 'http://catering.daisha.com.cn:8084';  //正式

// //const ApiUrls = 'https://catering.daisha.com.cn:443';  //正式
// const ApiUrls = 'http://114.55.126.232:8082';//测试
// //const ApiUrls = 'http://localhost:8082';

//大数据
const ApiUrlData = 'http://121.43.162.222:8081';
//会员
// //const ApiUrlMember = 'https://member.daisha.com.cn';//正式
// const ApiUrlMember = 'http://115.29.228.150:8626';//测试
// //const ApiUrlMember = 'http://localhost:8626';//测试

// //const ApiUrlMember2 = 'http://localhost:8087';//测试
// //const ApiUrlMember2 = 'http://prime.dehdata.com:8087';//正式
// const ApiUrlMember2 = 'http://114.55.126.232:8087';//测试

// //const TotalIntegral = 'https://api-new.jifen360.com';//正式
// const TotalIntegral = 'https://practice.jifen360.com';//测试

//全积分
//appid
// const integralappid = 'rckTBu3FIb9Y47aQmT'//测试
// //const integralappid = 'PGBTJ88fUpfPPJPQPt'//正式
// //token
// const integraltoken = 'f8SNF6hcUwVgj2HXtwt6wpkgtPLzHGoM'//测试
// //const integraltoken = 'loAUuqDK9sEq2s1m0H2FglQu4il045Xq'//正式
//挂载域名
Vue.prototype.ApiUrl = ApiUrl;
Vue.prototype.ApiUrls = ApiUrls;
Vue.prototype.realmphp = realmphp;
Vue.prototype.ApiurlStorehouse = ApiurlStorehouse;
Vue.prototype.ApiUrlData = ApiUrlData;
Vue.prototype.ApiUrlMember = ApiUrlMember;
Vue.prototype.ApiUrlMember2 = ApiUrlMember2;
Vue.prototype.TotalIntegral = TotalIntegral;
//全积分
Vue.prototype.integralappid = integralappid;
Vue.prototype.integraltoken = integraltoken;
Vue.prototype.Gxpay = Gxpay;
   
// devLogin()

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
