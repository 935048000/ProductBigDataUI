//引入vue
import Vue from 'vue'
import Vuex from 'vuex'
//注册vuex
Vue.use(Vuex)

//状态
const state={
	userinfo: localStorage.getItem('userinfo') ? JSON.parse(localStorage.getItem('userinfo')): {},
	ArrayList: localStorage.getItem('ArrayList') ? JSON.parse(localStorage.getItem('ArrayList')): [],
	ShopName: localStorage.getItem('ShopName'),
	billData: localStorage.getItem('billData') ? JSON.parse(localStorage.getItem('billData')): {},
	allPayment: localStorage.getItem('allPayment')
}

//mutations 主要用来操作state
const mutations={
	//保存用户数据
	SAVE_USERINFO(state,userinfo){
		//先把数据存入本地数据库
		localStorage.setItem('userinfo',JSON.stringify(userinfo))
		//再更新数据
		state.userinfo = userinfo
		
	},
	SAVE_ArrayList(state,ArrayList){
		//先把数据存入本地数据库
		localStorage.setItem('ArrayList',JSON.stringify(ArrayList))
		//再更新数据
		state.ArrayList = ArrayList
		
	},
	SAVE_ShopName(state,ShopName){
		//先把数据存入本地数据库
		localStorage.setItem('ShopName',JSON.stringify(ShopName))
		//再更新数据
		state.ShopName = ShopName
		
	},
	SAVE_BillData(state,billData){
		localStorage.setItem('billData',JSON.stringify(billData))
		state.billData = billData
	},
	SAVE_AllPayment(state,allPayment){
		localStorage.setItem('allPayment',JSON.stringify(allPayment))
		state.allPayment = allPayment
	}
}


//创建store仓库暴露出去
export default new Vuex.Store({
	 state,
	 mutations
})
