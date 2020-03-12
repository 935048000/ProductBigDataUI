<template>
  <div class="app-contion">
    <div style="text-align: center;font-size: 16px;display: flex;">
      <div
        style="width: 450px;height:400px;line-height:auto;box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);padding: 10px;"
      >
        订单汇总
        <div style="margin: 10px;text-align: left;">
          <div>
            <span class="people">门店：</span>
            <el-select v-model="selectStore" placeholder="请选择">
              <el-option
                v-for="item in storeList"
                :key="item.shop_code"
                :label="item.shop_name"
                :value="item.shop_code"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div style="margin: 10px;text-align: left;">
          <div>
            <span class="people">班次：</span>
            <el-select v-model="banci" placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div style="margin: 10px;text-align: left;">
          <div>
            <span class="people">时间段：</span>
            <el-date-picker
              :picker-options="{'disabledDate': (time)=>{
				      return  time.getTime() < new Date(new Date().getTime() - 48*60*60*1000) || time.getTime() > new Date(new Date().getTime());
		        	 }}"
              v-model="time"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              end-placeholder="结束日期"
              style="width: 98%;"
            ></el-date-picker>
          </div>
        </div>

        <el-button type="primary" plain style="margin: 10px; width: 100px;" @click="summary">开始汇总</el-button>
      </div>
      <div
        style="width: 450px;height:400px;border: 1px solid #C0C4CC; margin-left: 20px;font-size: 18px;padding: 15px;"
      >
        <div style="font-size: 20px;">德航空港当班营业收入</div>
        <div style="text-align: left;margin-left: 25px;">
          <p>门店：{{goodslist2.shopName}}</p>
          <p>开始营业日期：{{time[0]}}</p>
          <p>结束营业时间：{{time[1]}}</p>
          <p>班次：{{banci}}</p>
          <p>收银员：{{input}}</p>
          <p>单数：{{goodslist2.totalAmount}}</p>
          <p>营业额：{{goodslist2.totalMoney}}</p>
          <span>付款方式</span>
          <span style="margin-left: 20px;">金额</span>
          <span style="margin-left: 20px;">订单数</span>
          <p v-for="(item,index) in goodslist" :key="index">
            <span>{{item.source}}</span>
            <span style="margin-left: 50px;">{{item.totalActualPayment}}</span>
            <span style="margin-left: 50px;">{{item.totalCount}}</span>
          </p>
          <p>合计：{{goodslist2.totalMoney}}</p>
        </div>
      </div>
      <el-button type="primary" @click="print" style="width: auto;">打印小票</el-button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getLodop, needCLodop } from "../../vuex/LodopFuncs.js";
import {showUserReportLimited } from '@/service/index.js'
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
      storeList: [1, 2, 3, 4],
      selectStore: '',
      input: "",
      time: "",
      options: [
        {
          value: "早班",
          label: "早班"
        },
        {
          value: "中班",
          label: "中班"
        },
        {
          value: "晚班",
          label: "晚班"
        }
      ],
      banci: "",
      goodslist: [],
      goodslist2: ""
    };
  },
  created(){
    showUserReportLimited({
      userid: this.$store.state.userinfo.id
    }).then(res=>{
      this.storeList = res.data.data.data
    })
  },
  methods: {
    print() {
      let _self = this;
      //结束
      var hPos = 10, //小票上边距
        pageWidth = 580, //小票宽度
        rowHeight = 15, //小票行距
        //获取控件对象
        LODOP = getLodop(
          document.getElementById("LODOP_OB"),
          document.getElementById("LODOP_EM")
        );
      //初始化
      LODOP.PRINT_INIT("");
      //消费小票********************************************************************************************************
      LODOP.SET_PRINT_STYLE("FontSize", 17); //字体大小
      LODOP.ADD_PRINT_TEXT(
        hPos,
        1,
        pageWidth,
        rowHeight,
        "德航空港当班营业收入"
      );

      hPos += rowHeight;
      hPos += rowHeight;
      LODOP.SET_PRINT_STYLE("FontSize", 11); //字体大小
      //添加小票标题文本
      LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, "门店:");
      LODOP.ADD_PRINT_TEXT(
        hPos,
        60,
        pageWidth,
        rowHeight,
        _self.goodslist2.shopName
      );
      //上边距往下移
      hPos += rowHeight;
      LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, "开始营业日期:");
      hPos += rowHeight;
      LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, _self.time[0]);

      hPos += rowHeight;
      LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, "结束营业时间:");
      hPos += rowHeight;
      LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, _self.time[1]);

      hPos += rowHeight;
      LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, "班次:");
      LODOP.ADD_PRINT_TEXT(hPos, 60, pageWidth, rowHeight, _self.banci);
      hPos += rowHeight;
      LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, "收银员:");
      LODOP.ADD_PRINT_TEXT(hPos, 60, pageWidth, rowHeight, _self.input);
      hPos += rowHeight;
      LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, "单数:");
      LODOP.ADD_PRINT_TEXT(
        hPos,
        60,
        pageWidth,
        rowHeight,
        _self.goodslist2.totalAmount
      );
      hPos += rowHeight;
      LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, "营业额:");
      LODOP.ADD_PRINT_TEXT(
        hPos,
        60,
        pageWidth,
        rowHeight,
        _self.goodslist2.totalMoney
      );
      hPos += rowHeight;
      LODOP.ADD_PRINT_LINE(hPos, 2, hPos, pageWidth, 2, 1);
      hPos += 5;
      LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, "付款方式");
      LODOP.ADD_PRINT_TEXT(hPos, 80, pageWidth, rowHeight, "金额");
      LODOP.ADD_PRINT_TEXT(hPos, 130, pageWidth, rowHeight, "订单数");

      hPos += rowHeight;
      //遍历goodslist的商品数组
      for (var i = 0; i < _self.goodslist.length; i++) {
        LODOP.ADD_PRINT_TEXT(
          hPos,
          1,
          pageWidth,
          rowHeight,
          _self.goodslist[i].source
        );
        LODOP.ADD_PRINT_TEXT(
          hPos,
          80,
          pageWidth,
          rowHeight,
          _self.goodslist[i].totalActualPayment
        );
        LODOP.ADD_PRINT_TEXT(
          hPos,
          150,
          pageWidth,
          rowHeight,
          _self.goodslist[i].totalCount
        );
        hPos += rowHeight;
      }
      //商品遍历打印完毕,空一行
      hPos += rowHeight;
      //合计
      LODOP.ADD_PRINT_TEXT(
        hPos,
        80,
        pageWidth,
        rowHeight,
        "合计:" + _self.goodslist2.totalMoney
      );

      LODOP.ADD_PRINT_LINE(hPos, 2, hPos, pageWidth, 2, 1);
      hPos += rowHeight;
      hPos += rowHeight;
      LODOP.ADD_PRINT_TEXT(
        hPos,
        2,
        pageWidth,
        rowHeight,
        new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()
      );
      hPos += rowHeight;

      //初始化打印页的规格

      LODOP.SET_PRINT_PAGESIZE(3, pageWidth, 45, 2);
      hPos += rowHeight;
      // 厨房小票**************************************************************************************************************
      hPos += rowHeight;
      hPos += rowHeight;
      hPos += rowHeight;
      hPos += rowHeight;
      //添加小票标题文本

      //开始打印
      LODOP.PRINT();
    },
    summary() {
      let _self = this;
      if (
        _self.time[0] == undefined ||
        _self.time[0] == "" ||
        _self.time[1] == undefined ||
        _self.time[1] == ""
      ) {
        _self.$message({
          type: "warning",
          message: "时间为必选项！",
          showClose: true
        });
        return false;
      }
      if(!_self.selectStore){
        return this.$message.warning('请选择门店')
      }
      let formData = new FormData();
      formData.append("shopCode", _self.selectStore);
      formData.append("startTime", _self.time[0]);
      formData.append("endTime", _self.time[1]);
      formData.append("classes", _self.banci);
      formData.append("userName", _self.input);
      _self.axios
        .post(_self.ApiUrl + "/catering/getPeriodOfTimePayment", formData)
        .then(response => {
          if (response.data.errcode == "0") {
            _self.goodslist = response.data.data.data;
            _self.goodslist2 = response.data.data;
            var qs = require("qs");
            console.log(_self.goodslist);
            console.log(response.data.data);
            var timestamp = Math.round(new Date().getTime() / 1000);
            //_self.print();
            var orderInfo = "";
            orderInfo += "<CB>" + "德航空港当班营业收入 " + "</CB>" + "<BR>";
            orderInfo +=
              "<B>" + "门店： " + response.data.data.shopName + "</B>" + "<BR>";
            orderInfo +=
              "<B>" + "开始营业日期：" + _self.time[0] + "</B>" + "<BR>";
            orderInfo +=
              "<B>" + "结束营业时间：" + _self.time[1] + "</B>" + "<BR>";
            orderInfo += "<B>" + " 班次：" + _self.banci + "</B>" + "<BR>";
            orderInfo += "<B>" + " 收银员：" + _self.input + "</B>" + "<BR>";
            orderInfo +=
              "<B>" +
              "单数：" +
              response.data.data.totalAmount +
              "</B>" +
              "<BR>";
            orderInfo +=
              "<B>" +
              "营业额：" +
              response.data.data.totalMoney +
              "</B>" +
              "<BR>";
            orderInfo += "--------------------------------<BR>";
            orderInfo += "付款方式　　金额         订单数<BR>";
            for (var i = 0; i < _self.goodslist.length; i++) {
              orderInfo +=
                "<B>" +
                _self.goodslist[i].source +
                "  " +
                _self.goodslist[i].totalActualPayment +
                "  " +
                _self.goodslist[i].totalCount +
                "</B>" +
                "<BR>";
            }
            orderInfo += "--------------------------------<BR>";
            orderInfo +=
              "<CB>" +
              "合计：" +
              response.data.data.totalMoney +
              "</CB>" +
              "<BR>";

            orderInfo += "<BR>";
            orderInfo += "<BR>";
            orderInfo += "<BR>";
            orderInfo += "<BR>";
            console.log(orderInfo);
            var orderInfo2 = "";
            orderInfo2 +=
              "<FB><FS2>" + "德航空港当班营业收入 " + "</FS2></FB>" + "\r";
            orderInfo2 +=
              "<FB><FS2>" +
              "门店： " +
              response.data.data.shopName +
              "</FS2></FB>" +
              "\r";
            orderInfo2 +=
              "<FB><FS2>" +
              "开始营业日期：" +
              _self.time[0] +
              "</FS2></FB>" +
              "\r";
            orderInfo2 +=
              "<FB><FS2>" +
              "结束营业时间：" +
              _self.time[1] +
              "</FS2></FB>" +
              "\r";
            orderInfo2 +=
              "<FB><FS2>" + " 班次：" + _self.banci + "</FS2></FB>" + "\r";
            orderInfo2 +=
              "<FB><FS2>" + " 收银员：" + _self.input + "</FS2></FB>" + "\r";
            orderInfo2 +=
              "<FB><FS2>" +
              "单数：" +
              response.data.data.totalAmount +
              "</FS2></FB>" +
              "\r";
            orderInfo2 +=
              "<FB><FS2>" +
              "营业额：" +
              response.data.data.totalMoney +
              "</FS2></FB>" +
              "\r";
            orderInfo2 += "————————————————————————" + "\r";
            orderInfo2 +=
              "付款方式　       　金额                订单数" + "\r";
            for (var i = 0; i < _self.goodslist.length; i++) {
              orderInfo2 +=
                "<FB><FS2>" +
                _self.goodslist[i].source +
                "   " +
                _self.goodslist[i].totalActualPayment +
                "      " +
                _self.goodslist[i].totalCount +
                "</FS2></FB>" +
                "\r";
            }
            orderInfo2 += "————————————————————————" + "\r";
            orderInfo2 +=
              "<FB><FS2>" +
              "合计：" +
              response.data.data.totalMoney +
              "</FS2></FB>" +
              "\r";

            orderInfo2 += "\r";
            orderInfo2 += "\r";
            orderInfo2 += "\r";
            orderInfo2 += "\r";
            var order = {
              name1: orderInfo,
              name2: orderInfo2
            };
            let formDataOpen = new FormData();
            formDataOpen.append("shopCode", _self.shopcode);
            formDataOpen.append("content", JSON.stringify(order));
            formDataOpen.append("orderCode", undefined);

            _self.axios
              .post(
                _self.ApiUrls + "/printer/connectionPrinter",
                formDataOpen,
                {
                  // 单独配置
                  withCredentials: false
                }
              )
              .then(function(response) {
                console.log(response);
              })
              .catch(function(error) {
                console.log(error);
              });
          } else {
            _self.$message.error("数据找不到啦，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    }
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
</style>