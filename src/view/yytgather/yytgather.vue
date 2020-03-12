<template>
	<div class="app-contion">
		<div class="table-box" style="height: 40px;">
			
			<el-button type="success" class="daochu" @click="exportExcel">导出</el-button>
		</div>
		<div id="tableid">
			<el-table :data="tableData" border style="width: 100%" :height="tableHeight">
				
				<el-table-column prop="name" label="店名">
				</el-table-column>
				<el-table-column prop="totalActualPayment" label="销售金额">
				</el-table-column>
				
			</el-table>
		</div>
	
	</div>
</template>

<script>
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
			})
		},
		data() {
			return {
			
				tableData: [],
				
				tableHeight:window.innerHeight - 195,
	}
		},
		
		methods: {
			
			
			exportExcel() {
				require.ensure([], () => {
					const {
						export_json_to_excel
					} = require('../../vendor/Export2Excel');
					const tHeader = ['店名', '销售金额'];
					// 上面设置Excel的表格第一行的标题
					const filterVal = ['name', 'totalActualPayment'];
					// 上面的index、nickName、name是tableData里对象的属性
					const list = this.tableData; //把data里的tableData存到list
					const data = this.formatJson(filterVal, list);
					export_json_to_excel(tHeader, data, '汇总');
				})
			},
			formatJson(filterVal, jsonData) {
				return jsonData.map(v => filterVal.map(j => v[j]))
			},
			//列表
			getdata() {
				let _self = this;
				_self.axios.post(_self.ApiUrl + '/home/getYYTPaymentData').then(response => {
					console.log(response)
					if (response.data.errcode == '0') {
						_self.tableData = response.data.data.data;
					}else{
						_self.$message.error(response.data.errmsg);
					}
				}).catch(function(error) {
					_self.$message.error('响应时间过长，请重试');
				});
			},
		
			
		},
		created: function() {
			let _self = this
			_self.getdata()
		
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

	.table-box {
		margin: 10px 0;
		position: relative;
	}

	.footerdeom {
		position: fixed;
		right: 10px;
		bottom: 10px;
	}

	.daochu {
		position: absolute;
		right: 10px;
		top: 0;
	}
</style>
