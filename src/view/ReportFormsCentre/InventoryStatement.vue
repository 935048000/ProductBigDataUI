<template>
  <div class="app-contion">
    <div class="table-box" style="display: flex; flex-wrap:wrap ">
      <div class="ChooseStyles">
        <label class="titles">仓库：</label>
        <el-select v-model="wareblur" filterable placeholder="请选择" @change="wareblurfouncs($event)">
          <el-option
            v-for="item in optionsstorehouse"
            :key="item.warehouse_code"
            :label="item.warehouse_name"
            :value="item"
          ></el-option>
        </el-select>
        <el-select
          v-model="value_way"
          placeholder="选择库单类型"
          @change="founcs02"
          value-key="index"
          style="width: 20%;"
        >
          <el-option
            v-for="(item) in options02"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-date-picker
          v-model="value1"
          type="datetimerange"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
            :picker-options="{'disabledDate': (time)=>{
				 return time.getTime() < new Date('2019-09-01  00:00:00');
			 }}"
        ></el-date-picker>
      </div>
      <div class="ChooseStyles" style="margin-left: 0.625rem;">
        <el-button type="primary" @click="screen">查找</el-button>
        <el-button type="warning" @click="exportExcel">导出</el-button>
      </div>
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
        <font face="arial" color="red">( 2019-02-01 00:00:00 便于选择，约等于 2019-01-31 23:59:59 )</font> -->
      </el-collapse-item>
    </el-collapse>
    <el-table
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      :height="tableHeight"
      border
    >
      <el-table-column prop="warehouse_name" label="仓库"></el-table-column>
      <el-table-column prop="ref_order_code" label="涉及单据号"></el-table-column>
      <el-table-column prop="production_name" label="商品名称"></el-table-column>
      <el-table-column prop="bar_code" label="条形码"></el-table-column>
      <el-table-column prop="specification" label="产品规格"></el-table-column>
      <el-table-column prop="amount" label="计算库存数"></el-table-column>
      <el-table-column prop="actual_amount" label="系统库存数"></el-table-column>
      <el-table-column prop="value" label="库单类型"></el-table-column>
      <el-table-column prop="operator" label="库单操作人"></el-table-column>
      <el-table-column prop="checked_by" label="库单审核人"></el-table-column>
      <el-table-column prop="margin_cause" label="商品备注"></el-table-column>
      <el-table-column prop="comments" label="库单备注"></el-table-column>
    </el-table>

    <!--<div style="position: fixed;bottom: 0.625rem;right: 0;">-->
    <!--<el-pagination background layout="prev, pager, next" :total="total" @current-change="current_change">-->
    <!--</el-pagination>-->
    <!--</div>-->

    <!--编辑弹框-->
  </div>
</template>

<script>
import { mapState } from "vuex";

import { getLodop, needCLodop } from "../../vuex/LodopFuncs.js";
export default {
  data() {
    return {
      barcodes: "", //商品条码
      shoplei: "",
      barCode: "", //商品条形码
      shopteam: "",
      tableData: [],
      total: 10,
      wareblur: "",
      wareblurcode: "",
      currentPage: 1,
      pagesize: 10,
      code: "",
      optionsstorehouse: [],
      options: [],
      options2: [],
      options3: [],
      options4: [],
      disableds: true,
      shopteam2: "",
      categoryCodes: "",
      categoryNames: "",
      indextab: "0",
      tableHeight: window.innerHeight - 200,
      shopteam1: "",
      shopteam22: "",
      shoplei3: "",
      value_way: "",
      value1: "",
      options02: [
        {
          value: "warehouse.out",
          label: "出库单"
        },
        {
          value: "warehouse.in",
          label: "入库单"
        },
        {
          value: "tranfer.out",
          label: "调拨出库"
        },
        {
          value: "tranfer.in",
          label: "调拨入库"
        },
        {
          value: "warehouse.return",
          label: "退货单"
        }
      ]
    };
  },
  computed: {
    ...mapState({
      username: state => state.userinfo.account,
      token: state => state.userinfo.token,
      id: state => state.userinfo.id,
      shopcode: state => state.userinfo.shopcode
    })
  },
  methods: {
    wareblurfouncs(Vid) {
      let _self = this;
      console.log(Vid);
      _self.wareblur = Vid.warehouse_name;
      _self.wareblurcode = Vid.warehouse_code;
    },
    //仓库选择
    WarehouseSelection() {
      let _self = this;
      let formData = new FormData();
      formData.append("userId", _self.id);
      _self.axios
        .post(
          _self.ApiurlStorehouse + "/inventory/choouseTransferOut",
          formData,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if (response.data.errcode == "0") {
            _self.optionsstorehouse = response.data.data.list;
          } else {
            _self.$message.error("获取仓库失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("仓库响应时间过长，请重试");
        });
    },
    exportExcel() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../vendor/Export2Excel");
        const tHeader = [
          "仓库",
          "涉及单据号",
          "商品名称",
          "条形码",
          "产品规格",
          "计算库存数",
          "系统库存数",
          "库单类型",
          "库单操作人",
          "库单审核人",
          "商品备注",
          "库单备注"
        ];
        // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "warehouse_name",
          "ref_order_code",
          "production_name",
          "bar_code",
          "specification",
          "amount",
          "actual_amount",
          "value",
          "operator",
          "checked_by",
          "margin_cause",
          "comments"
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
          "库单报表";
        export_json_to_excel(tHeader, data, excelFlieName);
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },

    // founcs2(val, $event) {
    // 	let _self = this
    // 	_self.shopteam2 = val.level02_category_name
    // 	_self.shopteam22 = val.level02_category_name
    // 	let formData = new FormData();
    // 	formData.append('level02CategoryCode', val.level02_category_code);
    // 	//发送请求
    // 	_self.axios.post(_self.ApiurlStorehouse + '/inventory/queryLevel03CategoryCode', formData, {
    // 		// 单独配置
    // 		withCredentials: false
    // 	}).then(response => {
    //
    // 		if (response.data.errcode = '0') {
    // 			_self.options3 = response.data.data.list
    // 		} else {
    // 			_self.$message.error('数据找不到啦');
    // 		}
    // 	}).catch(function(error) {
    // 		_self.$message.error('响应时间过长，请重试');
    // 	});
    // },

    // founcs3(val, $event) {
    // 	let _self = this
    // 	_self.categoryCodes = val.level01_category_code
    // 	_self.categoryNames = val.level01_category_name
    // 	_self.shoplei3 = val.level01_category_name
    // },

    // 一级品类
    // OneCategoryCode() {
    // 	let _self = this;
    // 	let formData3 = new FormData();
    // 	_self.axios.post(_self.ApiurlStorehouse + '/inventory/queryLevel01CategoryCode', formData3, {
    // 		// 单独配置
    // 		withCredentials: false
    // 	}).then(response => {
    //
    // 		if (response.data.errcode = '0') {
    //
    // 			_self.options = response.data.data.list
    // 		} else {
    // 			_self.$message.error('数据找不到啦');
    // 		}
    //
    //
    // 	}).catch(function(error) {
    // 		_self.$message.error('响应时间过长，请重试');
    // 	});
    // },

    // founcs(vId, $event) {
    // 	let _self = this;
    // 	_self.shopteam = vId.level03_category_name
    // 	_self.shopteam1 = vId.level03_category_name
    // 	let formData = new FormData();
    // 	console.log(vId)
    // 	let formDatamb = new FormData();
    // 	formDatamb.append('level03CategoryCode', vId.level03_category_code);
    // 	//发送请求
    // 	_self.axios.post(_self.ApiurlStorehouse + '/inventory/queryLevel02CategoryCode', formDatamb, {
    // 		// 单独配置
    // 		withCredentials: false
    // 	}).then(response => {
    //
    // 		if (response.data.errcode = '0') {
    // 			_self.options4 = response.data.data.list
    //
    // 		} else {
    // 			_self.$message.error('数据找不到啦');
    // 		}
    // 	}).catch(function(error) {
    // 		_self.$message.error('响应时间过长，请重试');
    // 	});
    // },

    //筛选
    screen() {
      let _self = this;
      // if(_self.wareblur==''||_self.wareblur==null||_self.wareblur==undefined){
      // 	_self.$message({
      // 		message: '仓库为必选项！',
      // 		type: 'warning'
      // 	});
      // 	return false
      // }

      let formData = new FormData();
      formData.append("warehouseCode", _self.wareblurcode);
      formData.append("startDate", _self.value1[0]);
      formData.append("endDate", _self.value1[1]);
      formData.append("InventoryType", this.value_way);
      //发送请求
      _self.axios
        .post(
          _self.ApiurlStorehouse + "/inventory/InventoryStatement",
          formData,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if ((response.data.errcode = "0")) {
            _self.tableData = response.data.data.data;
            // _self.total = response.data.data.data.total;
            console.log(this.tableData);
          } else {
            _self.$message.error("找不到列表信息了");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    }
    // current_change: function(currentPage) {
    // 	let _self = this;
    // 	_self.currentPage = currentPage;
    //
    // 	let formData = new FormData();
    // 	formData.append('warehouseCode', _self.wareblurcode);
    //   formData.append('startDate', _self.value1[0]);
    //   formData.append('endDate', _self.value1[1]);
    //   formData.append('InventoryType', this.value_way);
    // 	//发送请求
    // 	_self.axios.post(_self.ApiurlStorehouse + '/inventory/InventoryStatement', formData, {
    // 				// 单独配置
    // 				withCredentials: false
    // 			}).then(response => {
    //
    // 		if (response.data.errcode = '0') {
    // 			_self.tableData = response.data.data.data.list;
    // 			_self.total = response.data.data.data.total;
    //
    // 		} else {
    // 			_self.$message.error('找不到列表信息了');
    // 		}
    //
    // 	}).catch(function(error) {
    // 		_self.$message.error('响应时间过长，请重试');
    // 	});
    //
    // },
  },
  created: function() {
    let _self = this;
    // _self.OneCategoryCode();
    _self.WarehouseSelection();
  }
};
</script>
<style>
.searchBox {
  padding: 0.625rem 0;
  /* border-bottom: 0.0625rem solid rgb(235, 238, 245); */
}

.app-contion {
  margin: 10px;
}

.btn-box {
  text-align: center;
  margin: 10px;
}

.footers {
  position: fixed;
  bottom: 0.625rem;
  left: 210px;
  background: #fff;
  width: 85%;
}

.titles {
  font-size: 14px;
  margin-left: 10px;
}

.addlistsd12 {
  position: fixed;
  right: 15px;
  top: 65px;
}

.w-30 {
  width: 20%;
  display: inline-block;
  text-align: center;
}

.title-box {
  margin: 10px 0;
}

.images {
  width: 60px;
  height: 60px;
}

.images img {
  width: 100%;
}

.el-upload--picture-card {
  width: 100px;
  height: 100px;
  line-height: 100px;
}

.el-table__body-wrapper {
  overflow-x: auto;
  overflow-y: auto;
}
.ChooseStyles {
  margin: 3px 0;
}
</style>
