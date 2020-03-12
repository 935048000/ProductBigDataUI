<template>
	<div class="app-contion">
	<div class="table-box" style="margin-bottom: 60px;">
	<el-button type="success" class="daochu"  @click="exportExcel">导出</el-button>
  </div>
  <div id="tableid">
   <el-table
    :data="tableData"
    border
    style="width: 100%"
		:height="tableHeight"
		>
  <el-table-column
    prop="create_at"
    label="日期"
    >
  </el-table-column>
    <el-table-column
      prop="shop"
      label="门店"
      >
    </el-table-column>
    <el-table-column
      prop="order_code"
      label="订单号">
    </el-table-column>
	<el-table-column
	  prop="totalPayment"
	  label="订单金额">
	</el-table-column>
	<el-table-column
	  prop="totalActualPayment"
	  label="实际金额">
	</el-table-column>
	<el-table-column
	  prop="serial_number"
	  label="流水号">
	</el-table-column>
	<el-table-column
	  prop="source"
	  label="支付方式">
	</el-table-column>
	
	<el-table-column
	  prop="operation"
	  label="当天收银员">
	</el-table-column>
  </el-table>
  </div>
  <div class="footerdeom">
   <el-pagination
    background
    layout="prev, pager, next"
    :total="total"
    @current-change="current_change">
  </el-pagination>
  </div>
	</div>
</template>

<script>
// import FileSaver from 'file-save'
// import XLSX from 'xlsx'
import {
		mapState
	} from 'vuex';
	export default {
			computed: {
			...mapState({
				username: state => state.userinfo.account,
				token: state => state.userinfo.token,
				id: state => state.userinfo.id,
				shopcode: state => state.userinfo.shopcode
			})},
		data() {
			return {
				pagesize:10,
				currentPage:1,
				total: 0,
				value1:'',
				options: [],
				value:'',
				 tableData: [],
				  tableHeight:window.innerHeight - 190
			}
		},
		methods: {
			current_change:function(currentPage){
			let _self=this;
			 console.log(currentPage)
			 _self.currentPage = currentPage;
			 let formData = new FormData();
			formData.append('dateTime ', _self.$route.query.create_at);
		formData.append('shopCode',  _self.$route.query.shopCode);
		formData.append('pageNum', _self.currentPage);
		formData.append('pageSize', _self.pagesize);
		_self.axios.post(_self.ApiUrl + '/commodity/getdailySalesDetail',formData).then(response => {
			 	if (response.data.errcode == '0') {
					console.log(_self.total)
			 		_self.tableData = response.data.data.list.list;
			 		_self.total = response.data.data.list.total;
			 	} else {
			 		_self.$message.error('菜单加载失败');
			 	}
			 
			 }).catch(function(error) {
			 	_self.$message.error('响应时间过长，请重试');
			 });
			 },
exportExcel() {
      require.ensure([], () => {
        const { export_json_to_excel } = require('../../vendor/Export2Excel');
        const tHeader = ['日期', '门店', '订单号','订单金额','实际金额','流水号','支付方式','当天收银员'];
        // 上面设置Excel的表格第一行的标题
        const filterVal = ['create_at', 'shop', 'order_code','totalPayment','totalActualPayment','serial_number','source','user_id'];
        // 上面的index、nickName、name是tableData里对象的属性
        const list = this.tableData;  //把data里的tableData存到list
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, '店铺汇总');
      })
    },
	formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
//获取table数据
getdata(){
	let _self = this
	let formData = new FormData();
	formData.append('dateTime ', _self.$route.query.create_at);
	formData.append('shopCode', _self.$route.query.shopCode);
	formData.append('pageNum', _self.currentPage);
	formData.append('pageSize', _self.pagesize);
	_self.axios.post(_self.ApiUrl + '/commodity/getdailySalesDetail',formData).then(response => {
		if (response.data.errcode == '0') {
			
			 _self.tableData = response.data.data.list.list
			 _self.total = response.data.data.list.total
		}
	}).catch(function(error) {
		_self.$message.error('商铺列表响应时间过长，请刷新重试');
	});
}

		},
		created: function() {
			let _self = this
			_self.getdata();
			
		}
	}
</script>

<style>
	.app-contion {
		margin: 10px;
	}
	
	.el-card__body {
		font-size: 16px;
	}
	
	.el-card {
		width: 100%;
	}
	
	.people {
		display: inline-block;
		margin: 10px 0;
	}
	.table-box{
		margin: 10px 0;
		position: relative;
	}
	.footerdeom{
		position: fixed;
		right: 10px;
		bottom: 10px;
	}
	.daochu{
		position: absolute;
		right: 10px;
		top: 0;
	}
</style>