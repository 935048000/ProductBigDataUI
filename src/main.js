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

// 正式环境
const ApiUrlData = 'http://49.235.241.182:8080';
// 本地测试环境
// const ApiUrlData = 'http://127.0.0.1:8089';

//挂载域名
Vue.prototype.ApiUrlData = ApiUrlData;
   
// devLogin()

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
