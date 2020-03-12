import axios from 'axios'

function getdatalist () {
	let _self = this;
	let formData = new FormData();
	formData.append('shopCode', 'AIX');
	formData.append('pageNum', 1);
	formData.append('pageSize', 10);
	//发送请求
	this.axios.post('http://10.10.65.11:8082/catering/getShopAllOrder', formData).then(response => {
		console.log(response.data.data.data)
		_self.loading = false;
		_self.tableData = response.data.data.data.list
		// 搜索金額
		let formData2 = new FormData();
	formData2.append('shopCode', 'AIX');
	formData2.append('userId', '67');
	this.axios.post('http://10.10.65.11:8082/catering/getTodayOperationOrderFee', formData2).then(response => {
			console.log(response.data.data.data)
			if(response.data.data.data!=null){
			 _self.streamsum=response.data.data.data.actualAmount
			_self.searchsum=response.data.data.data.payAmount
			}else{
				 _self.streamsum='0'
				 _self.searchsum='0'
			}
	}).catch(function(error) {
			alert(error);
		});
	}).catch(function(error) {
		alert(error);
	});
}


export{
	getdatalist
	}