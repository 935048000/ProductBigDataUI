<template>
  <div class="app-contion">
    <div class="table-box">
      <el-input v-model="IdCode" placeholder="请输入店铺编码" style="width: 15%;"></el-input>
      <el-date-picker
        :picker-options="pickerOptions"
        v-model="value1"
        unlink-panels
        type="datetimerange"
        range-separator="至"
        value-format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <el-select v-model="value" placeholder="请选择商铺" @change="founcs2" value-key="index">
        <el-option v-for="(item,index) in options" :key="index" :label="item.label" :value="index"></el-option>
      </el-select>
      <el-button type="primary" @click="serch" style="width: 73px;">查询</el-button>
      <el-button type="success" class="daochu" @click="exportExcel">导出</el-button>
    </div>
    <div style="margin-bottom: 5px;">
      <p style="color: #E6A23C">温馨提示：当店铺编码和商铺名称同时存在时以店铺编码为准</p>
    </div>
    <el-collapse>
      <el-collapse-item name="1">
        <span class="collapse-title" slot="title">
          <b>报表说明书</b>（点击查看报表使用说明）
        </span>
        <!--<b>注意事项：</b>可选的时间是为了满足查询早餐或者某个点的销售情况，结束子时间是包括该小时的数据。 <br>-->
        <!-- <b>报表功能：</b>查询某个时间区间的品类和商品的销售情况汇总。
        <br />
        <b>使用方法：</b>选择必选时间区间即可满足大部分查询，特殊情况需要查某小时区间，选择可选时间即可。
        <br />
        <b>使用案例：</b>查询2019年1月整月的品类和商品的销售情况。选择时间：2019-01-01 00:00:00 到 2019-02-01 00:00:00
        <font face="arial" color="red">( 2019-02-01 00:00:00 便于选择，约等于 2019-01-31 23:59:59 )</font>-->
      </el-collapse-item>
    </el-collapse>
    <div id="tableid">
      <el-table :data="tableData" border style="width: 100%" :height="tableHeight">
        <!--<el-table-column label="日期">-->
        <!--<template slot-scope="scope">-->
        <!--<span @click="time(scope.$index, scope.row)">{{ scope.row.create_at }}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column prop="orderCode" label="订单编号"></el-table-column>
        <el-table-column prop="productionName" label="产品名称"></el-table-column>
        <el-table-column prop="categoryName" label="品类名称"></el-table-column>
        <el-table-column prop="order_date" label="销售时间"></el-table-column>
        <el-table-column prop="totalBillAmount" label="销售数量"></el-table-column>
        <el-table-column prop="price" label="产品单价"></el-table-column>
        <el-table-column prop="discount" label="订单折扣额"></el-table-column>
        <el-table-column prop="totalBillPayment" label="销售金额"></el-table-column>
        <el-table-column prop="totalBillActualAmount" label="实际销售金额"></el-table-column>
      </el-table>
    </div>
    <!--<div class="footerdeom">-->
    <!--<el-pagination background layout="prev, pager, next" :total="total" @current-change="current_change">-->
    <!--</el-pagination>-->
    <!--</div>-->
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      username: state => state.userinfo.account,
      token: state => state.userinfo.token,
      id: state => state.userinfo.id,
      shopcode: state => state.userinfo.shopcode,
      cityusername: state => state.userinfo.userName
    })
  },
  data() {
    return {
      pagesize: 100,
      currentPage: 1,
      total: 1,
      value1: "",
      options: [],
      codes: "",
      value: "",
      tableData: [],
      IdCode: "",
      tableHeight: window.innerHeight - 200,
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.value1 = minDate.getTime();
          if (maxDate) {
            this.value1 = "";
          }
        },
        disabledDate: time => {
          // if (this.value1 !== "") {
          //   const one = 30 * 24 * 3600 * 1000;
          //   const minTime = this.value1 - one;
          //   const maxTime = this.value1 + one;
          //   return time.getTime() < minTime || time.getTime() > maxTime;
          // }
				 return time.getTime() < new Date('2019-09-01  00:00:00');
        },
      //           :picker-options="{'disabledDate': (time)=>{
			// 	 return time.getTime() < new Date('2019-09-01  00:00:00');
			//  }}"
      }
    };
  },
  watch: {
    value: function(val) {
      console.log(val);
    }
  },
  methods: {
    current_change: function(currentPage) {
      let _self = this;
      console.log(currentPage);
      _self.currentPage = currentPage;
    },

    exportExcel() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../vendor/Export2Excel");
        const tHeader = [
          "订单编号",
          "产品名称",
          "品类名称",
          "销售时间",
          "销售数量",
          "产品单价",
          "订单折扣额",
          "订单销售金额",
          "实际销售金额"
        ];
        // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "orderCode",
          "productionName",
          "categoryName",
          "order_date",
          "totalBillAmount",
          "price",
          "discount",
          "totalBillPayment",
          "totalBillActualAmount"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        const list = this.tableData; //把data里的tableData存到list
        const data = this.formatJson(filterVal, list);
        var dayTemp = new Date();
        dayTemp.setTime(dayTemp.getTime());
        var excelFlieName =
          dayTemp.getFullYear() +
          "-" +
          (dayTemp.getMonth() + 1) +
          "-" +
          dayTemp.getDate() +
          "销售账单明细表";
        export_json_to_excel(tHeader, data, excelFlieName);
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    //商铺列表
    getdata() {
      let _self = this;
      let formData2 = new FormData();
      formData2.append("city ", _self.cityusername);
      _self.axios
        .post(_self.ApiUrl + "/commodity/getShopList", formData2)
        .then(response => {
          if (response.data.errcode == "0") {
            _self.options = response.data.data.list;
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    throughShopIdGetShopsList() {
      let _self = this;
      let formData2 = new FormData();
      formData2.append("id ", _self.IdCode);
      formData2.append("city ", _self.cityusername);
      _self.axios
        .post(_self.ApiUrl + "/commodity/throughShopIdGetShopsList", formData2)
        .then(response => {
          if (response.data.errcode == "0") {
            _self.codes = response.data.data.data.shopCode;
            // console.log(_self.codes)
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    //搜索数据
    serch() {
      let _self = this;
      var startTime = _self.value1[0];
      var endTime = _self.value1[1];
      var regu = "^[0-9]*$";
      var re = new RegExp(regu);
      if (!re.test(_self.IdCode)) {
        _self.$message({
          type: "warning",
          message: "店铺编码只能为数字形式 ",
          duration: 10000,
          showClose: true
        });
        return false;
      }

      _self.throughShopIdGetShopsList();

      let formData2 = new FormData();
      formData2.append("id ", _self.IdCode);
      // 获取门店code
      formData2.append("city ", _self.cityusername);
      _self.axios
        .post(_self.ApiUrl + "/commodity/throughShopIdGetShopsList", formData2)
        .then(response => {
          if (response.data.errcode == "0") {
            _self.codes = response.data.data.data.shopCode;
            // console.log(_self.codes)
          }
          let formData = new FormData();
          formData.append("startTime ", startTime);
          formData.append("endTime", endTime);

          if (_self.IdCode == "") {
            formData.append("shopCode", _self.options[_self.value].shopCode);
          } else {
            formData.append("shopCode", _self.codes);
          }

          // formData.append('shopCode', _self.codes);
          // 查询账单数据
          _self.axios
            .post(_self.ApiUrl + "/home/billingDetailsTable", formData)
            .then(response => {
              if (response.data.errcode == "0") {
                _self.tableData = response.data.data.data;
                _self.IdCode = "";
                _self.value1 = "";

                //_self.total = response.data.data.list.total;
              } else {
                _self.$message.error("菜单加载失败");
              }
            })
            .catch(function(error) {
              _self.$message.error("响应时间过长，请重试");
            });
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });

      // let formData = new FormData();
      // formData.append('startTime ', startTime);
      // formData.append('endTime', endTime);
      // console.log(_self.codes);
      // console.log(_self.options[_self.value].shopCode);
      // if(_self.IdCode == ''){
      // 	formData.append('shopCode', _self.options[_self.value].shopCode);
      // }else{
      // 		formData.append('shopCode', '');
      // }
      // formData.append('shopCode', _self.options[_self.codes].shopCode);

      // formData.append('pageNum', _self.currentPage);
      // formData.append('pageSize', _self.pagesize);
      // formData.append('id', _self.IdCode);
      // _self.axios.post(_self.ApiUrl + '/commodity/dailySales', formData).then(response => {

      // _self.axios.post(_self.ApiUrl + '/home/billingDetailsTable', formData).then(response => {
      // 	if (response.data.errcode == '0') {
      // 		_self.tableData = response.data.data.data;
      // 		_self.IdCode='';
      // 		 _self.value1='';
      //
      // 		//_self.total = response.data.data.list.total;
      // 	} else {
      // 		_self.$message.error('菜单加载失败');
      // 	}
      //
      // }).catch(function(error) {
      // 	_self.$message.error('响应时间过长，请重试');
      // });
    }
    //跳转至详情页
    // time(index){
    // 	let _self=this;
    // 	console.log(index)
    // 	console.log(_self.value)
    // 	if(_self.codes==''){
    // 		var codedetail=_self.options[_self.value].shopCode;
    // 	}else{
    // 		var codedetail=_self.codes;
    // 	}
    //
    // 	 _self.$router.push({
    // 		 path:'/storedetail',
    // 		 query:{
    // 			 create_at:_self.tableData[index].create_at,
    // 			 shopCode:codedetail
    // 		 }
    // 	 })
    // }
  },
  created: function() {
    let _self = this;
    _self.getdata();
  }
};
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
.el-table__body-wrapper {
  overflow-x: auto;
  overflow-y: auto;
}
</style>
