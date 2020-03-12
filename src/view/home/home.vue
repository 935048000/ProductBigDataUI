<template>
  <div class="app-contion minHeights">
    <el-row>
      <el-col :span="12" style="height: 200px;">
        <el-card :body-style="{ padding: '0px' }" style="height: 200px;">
          <div style="padding: 14px;">
            <div style="text-align: left;">
              <span style="font-size: 20px;">今日实时流水</span>
            </div>
            <div style="text-align: center;">
              <div
                class="bottom clearfix"
                style="margin: 30px 0;font-size: 40px;"
              >{{dan1}} 单 {{todaymoney}} 元</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <!-- <el-col :span="12" style="height: 200px;">
        <el-card :body-style="{ padding: '0px' }" style="height: 200px;">
          <div style="padding: 14px;">
            <div style="text-align: left;">
              <span style="font-size: 20px;">昨日实时流水</span>
            </div>
            <div style="text-align: center;">
              <div
                class="bottom clearfix"
                style="margin: 30px 0;font-size: 40px;"
              >{{dan2}} 单{{zuomoney}} 元</div>
            </div>
          </div>
        </el-card>
      </el-col> -->
    </el-row>
    <div style="display: none">
      <el-card class="box-card" style="height: 600px;">
        <div class="text item">
          <div style="text-align: center;">

          </div>
          <div style="height:460px">
            <div id="myChart" style="width：200px;height:460px"></div>
          </div>
        </div>
      </el-card>
      <el-card class="box-card" style="height: 600px;">
        <div class="text item">
          <div style="text-align: center;">
          </div>
          <div style="height:460px;">
            <div id="myCharts" style="width：200px;height:460px;"></div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
// 	var echarts = require('echarts');
// 	// 引入 ECharts 主模块
// var echarts = require('echarts/lib/echarts');
// // 引入柱状图等
// require('echarts/lib/chart/bar');
// require("echarts/lib/chart/line");
// require("echarts/lib/chart/pie");
//
// // 引入提示框和标题组件
// require('echarts/lib/component/tooltip');
// require('echarts/lib/component/title');
// require("echarts/lib/component/dataZoom");
// require("echarts/lib/component/markPoint");
// require("echarts/lib/component/markLine");
import { mapState } from "vuex";
import echarts from 'echarts';

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
      todaymoney: "",
      zuomoney: "",
      dan1: "",
      dan2: "",
      goodlist: [],
      goodlistpinlei: []
    };
  },
  mounted() {
    this.todaysales();
    this.todaypinlei();
  },
  methods: {
    summary() {
      let _self = this;
      var day2 = new Date();
      day2.setTime(day2.getTime());
      var s2 =
        day2.getFullYear() +
        "-" +
        (day2.getMonth() + 1) +
        "-" +
        day2.getDate() +
        " " +
        "00:00:00";

      var day1 = new Date();
      day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
      var s1 =
        day1.getFullYear() +
        "-" +
        (day1.getMonth() + 1) +
        "-" +
        day1.getDate() +
        " " +
        "00:00:00";

      var day3 = new Date();
      day3.setTime(day3.getTime() + 24 * 60 * 60 * 1000);
      var s3 =
        day3.getFullYear() +
        "-" +
        (day3.getMonth() + 1) +
        "-" +
        day3.getDate() +
        " " +
        "00:00:00";

      let formData = new FormData();
      formData.append("shopCode", _self.shopcode);
      formData.append("startTime", s2);
      formData.append("endTime", s3);
      formData.append("classes", "全天");
      formData.append("userName", "中台");
      _self.axios
        .post(_self.ApiUrl + "/catering/getPeriodOfTimePayment", formData)
        .then(response => {
          if (response.data.errcode == "0") {
            _self.todaymoney = response.data.data.totalMoney;
            _self.dan1 = response.data.data.totalAmount;
          } else {
            _self.$message.error("数据找不到啦，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });

      let formData1 = new FormData();
      formData1.append("shopCode", _self.shopcode);
      formData1.append("startTime", s1);
      formData1.append("endTime", s2);
      formData1.append("classes", "全天");
      formData1.append("userName", "中台");
      _self.axios
        .post(_self.ApiUrl + "/catering/getPeriodOfTimePayment", formData1)
        .then(response => {
          if (response.data.errcode == "0") {
            _self.zuomoney = response.data.data.totalMoney;
            _self.dan2 = response.data.data.totalAmount;
          } else {
            _self.$message.error("数据找不到啦，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    //今日菜品销量
    todaysales() {
      let _self = this;
      var day2 = new Date();
      day2.setTime(day2.getTime());
      var s2 =
        day2.getFullYear() +
        "-" +
        (day2.getMonth() + 1) +
        "-" +
        day2.getDate() +
        " " +
        "00:00:00";

      var day1 = new Date();
      day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
      var s1 =
        day1.getFullYear() +
        "-" +
        (day1.getMonth() + 1) +
        "-" +
        day1.getDate() +
        " " +
        "00:00:00";

      var day3 = new Date();
      day3.setTime(day3.getTime() + 24 * 60 * 60 * 1000);
      var s3 =
        day3.getFullYear() +
        "-" +
        (day3.getMonth() + 1) +
        "-" +
        day3.getDate() +
        " " +
        "00:00:00";
      let formData1 = new FormData();
      formData1.append("shopCode", _self.shopcode);
      formData1.append("startTime", s2);
      formData1.append("endTime", s3);

      _self.axios
        .post(_self.ApiUrl + "/home/homeMenuSales", formData1)
        .then(response => {
          if (response.data.errcode == "0") {
            _self.goodlist = response.data.data.data;
            var arr = [];
            var arr2 = [];
            var arr3 = [];
            for (var i = 0; i < _self.goodlist.length; i++) {
              arr.push(_self.goodlist[i].productionName);
              arr2.push(_self.goodlist[i].tc);
              arr3.push(_self.goodlist[i].tc2);
            }
            var max1 = Math.max.apply(null, arr2);
            var max2 = Math.max.apply(null, arr3);
            if (max1 >= max2) {
              var max = max1;
            } else {
              var max = max2;
            }

            // 基于准备好的dom，初始化echarts实例
            let myChart = echarts.init(
              document.getElementById("myChart")
            );
            // 绘制图表
            myChart.setOption({
              tooltip: {
                trigger: "axis",
                axisPointer: {
                  type: "cross",
                  crossStyle: {
                    color: "#999"
                  }
                }
              },
              toolbox: {
                feature: {
                  dataView: { show: true, readOnly: false },
                  magicType: { show: true, type: ["line", "bar"] },
                  restore: { show: true },
                  saveAsImage: { show: true }
                }
              },
              legend: {
                data: ["今日菜品销量", "昨日菜品销量"]
              },
              xAxis: [
                {
                  type: "category",
                  data: arr,
                  axisPointer: {
                    type: "shadow"
                  },
                  axisLabel: {
                    interval: 0,
                    rotate: "90",
                    maxInterval: "0",
                    textStyle: {
                      fontSize: 12 //更改坐标轴文字大小
                    }
                  }
                }
              ],
              grid: {
                y2: 100,
                left: "12%",
                right: "10%",
                // bottom:'20%',
                top: "30%"
              },
              yAxis: [
                {
                  type: "value",
                  name: "销量",
                  min: 0,
                  max: max,
                  interval: 50,
                  axisLabel: {
                    formatter: "{value} 份"
                  }
                }
              ],
              series: [
                {
                  name: "今日菜品销量",
                  type: "bar",
                  data: arr2,
                  barGap: 0
                },
                {
                  name: "昨日菜品销量",
                  type: "bar",
                  data: arr3,
                  barGap: 0
                }
              ]
            });
          } else {
            _self.$message.error("数据找不到啦，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },

    //今日品类销量 2019-5-30
    todaypinlei() {
      let _self = this;
      var day2 = new Date();
      day2.setTime(day2.getTime());
      var s2 =
        day2.getFullYear() +
        "-" +
        (day2.getMonth() + 1) +
        "-" +
        day2.getDate() +
        " " +
        "00:00:00";

      var day1 = new Date();
      day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
      var s1 =
        day1.getFullYear() +
        "-" +
        (day1.getMonth() + 1) +
        "-" +
        day1.getDate() +
        " " +
        "00:00:00";

      var day3 = new Date();
      day3.setTime(day3.getTime() + 24 * 60 * 60 * 1000);
      var s3 =
        day3.getFullYear() +
        "-" +
        (day3.getMonth() + 1) +
        "-" +
        day3.getDate() +
        " " +
        "00:00:00";
      let formData1 = new FormData();
      formData1.append("shopCode", _self.shopcode);
      formData1.append("startTime", s2);
      formData1.append("endTime", s3);

      _self.axios
        .post(_self.ApiUrl + "/home/homeMenuCategorySales", formData1)
        .then(response => {
          if (response.data.errcode == "0") {
            _self.goodlist = response.data.data.data;
            var arr = [];
            var arr2 = [];
            var arr3 = [];
            for (var i = 0; i < _self.goodlist.length; i++) {
              arr.push(_self.goodlist[i].categoryName);
              arr2.push(_self.goodlist[i].tc);
              arr3.push(_self.goodlist[i].tc2);
            }
            var max1 = Math.max.apply(null, arr2);
            var max2 = Math.max.apply(null, arr3);
            if (max1 >= max2) {
              var max = max1;
            } else {
              var max = max2;
            }
            // 基于准备好的dom，初始化echarts实例
            let myCharts = echarts.init(
              document.getElementById("myCharts")
            );
            // 绘制图表
            myCharts.setOption({
              tooltip: {
                trigger: "axis",
                axisPointer: {
                  type: "cross",
                  crossStyle: {
                    color: "#999"
                  }
                }
              },
              toolbox: {
                feature: {
                  dataView: { show: true, readOnly: false },
                  magicType: { show: true, type: ["line", "bar"] },
                  restore: { show: true },
                  saveAsImage: { show: true }
                }
              },
              legend: {
                data: ["昨日品类销量", "今日品类销量"]
              },
              xAxis: [
                {
                  type: "category",
                  data: arr,
                  axisPointer: {
                    type: "shadow"
                  },
                  axisLabel: {
                    interval: 0,
                    rotate: "90",
                    maxInterval: "0",
                    textStyle: {
                      fontSize: 12 //更改坐标轴文字大小
                    }
                  }
                }
              ],
              grid: {
                y2: 100,
                left: "12%",
                right: "10%",
                // bottom:'20%',
                top: "30%"
              },
              yAxis: [
                {
                  type: "value",
                  name: "销量",
                  min: 0,
                  max: max,
                  interval: 50,
                  axisLabel: {
                    formatter: "{value} 份"
                  }
                }
              ],
              series: [
                {
                  name: "今日品类销量",
                  type: "bar",
                  data: arr2,
                  barGap: 0
                },
                {
                  name: "昨日品类销量",
                  type: "bar",
                  data: arr3,
                  barGap: 0
                }
              ]
            });
          } else {
            _self.$message.error("数据找不到啦，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("品类销量模块响应时间过长，请重试");
        });
    }

    //今日品类销量
    // 		 todaypinlei(){
    // 			 let _self = this;
    // 			 var day2 = new Date();
    // 			 day2.setTime(day2.getTime());
    // 			 var s2 = day2.getFullYear()+"-" + (day2.getMonth()+1) + "-" + day2.getDate()+ ' ' + '00:00:00';
    //
    // 			 var day1 = new Date();
    // 			 day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
    // 			 var s1 = day1.getFullYear() + "-" + (day1.getMonth() + 1) + "-" + day1.getDate() + ' ' + '00:00:00';
    //
    // 			 var day3 = new Date();
    // 			 day3.setTime(day3.getTime() + 24 * 60 * 60 * 1000);
    // 			 var s3 = day3.getFullYear() + "-" + (day3.getMonth() + 1) + "-" + day3.getDate() + ' ' + '00:00:00';
    // 			 	let formData1 = new FormData();
    // 			 formData1.append('shopCode', _self.shopcode);
    // 			 formData1.append('startTime', s2);
    // 			 formData1.append('endTime', s3);
    //
    // 			 // _self.axios.post(_self.ApiUrl + '/home/homeMenuCategorySales', formData1).then(response => {
    //          // debugger;
    //        _self.axios.post(_self.ApiUrl + '/home/homeMenuSales', formData1).then(response => {
    // 			 	if(response.data.errcode == '0') {
    // 					console.log(response);
    // 			 		_self.goodlistpinlei = response.data.data.data;
    // 					var arrCategoryName=[];
    // 					var arrTc=[];
    //           var arrTc2=[];
    //           // console.log(_self.goodlistpinlei);
    //           // window.alert(_self.goodlistpinlei[0].tc);
    //           // window.alert(_self.goodlistpinlei[0].tc2);
    // 					for(var i=0;i<_self.goodlistpinlei.length;i++){
    //             // arrCategoryName.push(_self.goodlistpinlei[i].categoryName);
    //             arrCategoryName.push(_self.goodlistpinlei[i].productionName);
    //             arrTc.push(_self.goodlist[i].tc);
    //             arrTc2.push(_self.goodlist[i].tc2);
    // 					}
    //
    // 					var max =Math.max.apply(null,arrTc2);
    //
    // 			 		// 基于准备好的dom，初始化echarts实例
    // 			 		let myChart = _self.echarts.init(document.getElementById('myCharts'));
    // 			 		// 绘制图表
    // 			 		myChart.setOption({
    // 			 		      tooltip: {
    // 			 		        trigger: 'axis',
    // 			 		        axisPointer: {
    // 			 		            type: 'cross',
    // 			 		            crossStyle: {
    // 			 		                color: '#999'
    // 			 		            }
    // 			 		        }
    // 			 		    },
    // 			 		    toolbox: {
    // 			 		        feature: {
    // 			 		            dataView: {show: true, readOnly: false},
    // 			 		            magicType: {show: true, type: ['line', 'bar']},
    // 			 		            restore: {show: true},
    // 			 		            saveAsImage: {show: true}
    // 			 		        }
    // 			 		    },
    // 			 		    legend: {
    // 			 		        data:['昨日品类销量','今日品类销量']
    // 			 		    },
    // 						xAxis: [
    // 			 		        {
    // 			 		            type: 'category',
    // 			 		            data: arrCategoryName,
    // 			 		            axisPointer: {
    // 			 		                type: 'shadow'
    // 			 		            },
    // 								axisLabel:{
    // 		interval: 0,
    // 		 rotate:"90",
    // 		  textStyle: {
    // 		fontSize : 12     //更改坐标轴文字大小
    //     }
    // 	}
    // 			 		        }
    // 			 		    ],
    //             grid:{
    //               y2:100,
    //               left:'12%',
    //               right:'10%',
    //               // bottom:'20%',
    //               top:'50%'
    //             },
    // 			 		    yAxis: [
    // 			 		        {
    // 			 		            type: 'value',
    // 			 		            name: '销量',
    // 			 		            min: 0,
    // 			 		            max: max,
    // 			 		            interval: 50,
    // 			 		            axisLabel: {
    // 			 		                formatter: '{value} 份'
    // 			 		            }
    // 			 		        }
    // 			 		    ],
    //             series: [
    //               {
    //                 name:'今日品类销量',
    //                 type:'bar',
    //                 data:arrTc,
    //                 barGap:0,
    //
    //               },
    //               {
    //                 name:'昨日品类销量',
    //                 type:'bar',
    //                 data:arrTc2,
    //                 barGap:0,
    //               }
    //             ]
    // 			 		});
    // 			 	} else {
    // 			 		_self.$message.error('数据找不到啦，请刷新重试');
    // 			 	}
    // 			 }).catch(function(error) {
    //          console.log(arrCategoryName);
    //          console.log(arrTc);
    //          console.log(arrTc2);
    // 			 	_self.$message.error('品类销量模块响应时间过长，请重试');
    // 			 });
    //
    // },
  },
  created: function() {
    let _self = this;
    _self.summary();
    // _self.todaysales();
    // _self.todaypinlei();
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
  width: 100% !important;
}

.people {
  display: inline-block;
  margin: 10px 0;
}
.minHeights {
  min-height: calc(100vh - 80px);
  width: 99%;
  overflow-x: hidden;
  overflow-y: scroll;
}
</style>
