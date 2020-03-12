<template>
  <div class="app-contion">
    <div class="block">
      <div style="width: 90%;">
        <el-date-picker
          v-model="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="至"
          start-placeholder="起始时间"
          end-placeholder="结束时间"
          style="width: 40%;"
          :picker-options="{'disabledDate': (time)=>{
				 return time.getTime() < new Date('2019-09-01  00:00:00');
			 }}"
        ></el-date-picker>
        <el-button type="primary" plain @click="search">搜索</el-button>
        <span class="titles">
          实时流水金额：
          <span class="titles title-color">{{streamsum}}</span>元
        </span>
        <span class="titles">
          搜索总金额：
          <span class="titles title-color">{{searchsum}}</span>元
        </span>
        <span class="titles">
          订单总数：
          <span class="titles title-color">{{total}}</span>单
        </span>
      </div>
      <el-button type="success" class="daochu" @click="exportExcel" style="top: 70px;">导出</el-button>
    </div>
    <el-table
      :data="tableData"
      border
      v-loading="loading"
      style="width: 100%;"
      tooltip-effect="dark"
      :height="tableHeight"
    >
      <el-table-column prop="orderCode" label="订单号"></el-table-column>
      <el-table-column label="订单详情">
        <template slot-scope="scope">
          <el-button size="mini" @click="detailmenu(scope.$index, scope.row)">详情</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="comments" label="备注"></el-table-column>
      <el-table-column prop="orderType" label="订单类型"></el-table-column>
      <el-table-column prop="payAmount" label="订单金额"></el-table-column>
      <el-table-column prop="actualAmount" label="实际金额"></el-table-column>
      <el-table-column prop="orderWay" label="下单方式"></el-table-column>
      <el-table-column prop="create_at" label="下单时间"></el-table-column>
      <el-table-column prop="source" label="支付方式"></el-table-column>
      <el-table-column prop="source" label="支付方式"></el-table-column>
      <el-table-column prop="source" label="支付方式"></el-table-column>
      <el-table-column prop="address" label="重新打印">
        <template slot-scope="scope">
          <el-button size="mini" @click="MySendData(scope.$index, scope.row)">打印</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="sales" label="操作人"></el-table-column>
    </el-table>
    <div style="position: fixed;bottom: 0.625rem;right: 0;">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="current_change"
      ></el-pagination>
    </div>
    <!-- 详情 -->
    <el-dialog title="详情" :visible.sync="menudetails" width="50%" :before-close="handleClose">
      <el-table
        :data="tableDatamenu"
        stripe
        border
        class="table-center"
        :height="280"
        style="width: 100%"
      >
        <el-table-column prop="name" label="商品名"></el-table-column>
        <el-table-column prop="price" label="商品原价"></el-table-column>
        <el-table-column prop="promotional_price" label="商品实价"></el-table-column>
        <el-table-column prop="order_amount" label="商品数量"></el-table-column>
        <el-table-column prop="actual_amount" label="小计"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="menudetails = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getLodop, needCLodop } from "../../vuex/LodopFuncs.js";
export default {
  computed: {
    ...mapState({
      id: state => state.userinfo.id,
      shopcode: state => state.userinfo.shopcode,
      username: state => state.userinfo.account
    })
  },
  data() {
    return {
      tableData: [],
      datetime: [],
      loading: true,
      streamsum: "0",
      searchsum: "0",
      pagesize: 10,
      currentPage: 1,
      menudetails: false,
      total: 0,
      jsondate: "",
      tabindex: 0,
      tableDatamenu: [],
      qrcode: "",
      tableHeight: window.innerHeight - 200
    };
  },
  methods: {
    detailmenu(index) {
      let _self = this;
      _self.menudetails = true;
      _self.tableDatamenu = _self.tableData[index].odrOrderDetailList;
    },
    exportExcel() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../vendor/Export2Excel");
        const tHeader = [
          "订单号",
          "订单详情",
          "备注",
          "订单类型",
          "订单金额",
          "实际金额",
          "下单方式",
          "下单时间",
          "支付方式",
          "操作人"
        ];
        // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "orderCode",
          "productNameArr",
          "comments",
          "orderType",
          "payAmount",
          "actualAmount",
          "orderWay",
          "create_at",
          "source",
          "operation"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        const list = this.tableData; //把data里的tableData存到list
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "订单详情");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    current_change: function(currentPage) {
      let _self = this;
      console.log(_self.tabindex);
      _self.currentPage = currentPage;
      if (_self.tabindex == "0") {
        let formData = new FormData();
        formData.append("shopCode", _self.shopcode);
        formData.append("pageNum", _self.currentPage);
        formData.append("pageSize", _self.pagesize);
        //发送请求
        _self.axios
          .post(_self.ApiUrl + "/catering/getShopAllOrder", formData)
          .then(response => {
            if (response.data.errcode == "0") {
              _self.loading = false;
              _self.tableData = response.data.data.data.list;
              _self.total = response.data.data.data.total;
              for (var i = 0; i < response.data.data.data.list.length; i++) {
                if (_self.tableData[i].comments == "null") {
                  _self.tableData[i].comments = "";
                }
                if (
                  response.data.data.data.list[i].orderType == "DISCOUNT_ORDER"
                ) {
                  _self.tableData[i].orderType = "折扣订单";
                } else if (
                  response.data.data.data.list[i].orderType == "NORMAL_ORDER"
                ) {
                  _self.tableData[i].orderType = "核销订单";
                } else if (
                  response.data.data.data.list[i].orderType == "WITHDRAW_ORDER"
                ) {
                  _self.tableData[i].orderType = "退款订单";
                } else if (
                  response.data.data.data.list[i].orderType ==
                  "creditType.daily"
                ) {
                  _self.tableData[i].orderType = "赊付日结";
                } else if (
                  response.data.data.data.list[i].orderType == "creditType.week"
                ) {
                  _self.tableData[i].orderType = "赊付周结";
                } else if (
                  response.data.data.data.list[i].orderType ==
                  "creditType.month"
                ) {
                  _self.tableData[i].orderType = "赊付月结";
                }
              }
              // 搜索金額
              let formData2 = new FormData();
              formData2.append("shopCode", _self.shopcode);
              formData2.append("userId", _self.id);
              _self.axios
                .post(
                  _self.ApiUrl + "/catering/getTodayOperationOrderFee",
                  formData2
                )
                .then(response => {
                  if (response.data.errcode == "0") {
                    if (response.data.data != null) {
                      _self.streamsum = response.data.data.allPayAmount;

                      //_self.searchsum=response.data.data.data.payAmount
                    } else {
                      _self.streamsum = "0";
                      _self.searchsum = "0";
                    }
                  } else {
                    _self.$message.error("数据找不到啦，请刷新重试");
                  }
                })
                .catch(function(error) {
                  _self.$message.error("响应时间过长，请重试");
                });
            } else {
              _self.$message.error("数据找不到啦，请刷新重试");
            }
          })
          .catch(function(error) {
            _self.$message.error("响应时间过长，请重试");
          });
      } else {
        let formData = new FormData();
        let _self = this;
        _self.loading = true;
        console.log(_self.pagesize);
        formData.append("shopCode", _self.shopcode);
        formData.append("pageNum", _self.currentPage);
        formData.append("pageSize", _self.pagesize);
        formData.append("startTime", _self.datetime[0]);
        formData.append("endTime", _self.datetime[1]);
        //发送请求
        _self.axios
          .post(_self.ApiUrl + "/catering/timeSearchOrder", formData)
          .then(response => {
            if (response.data.errcode == "0") {
              _self.loading = false;
              _self.tableData = response.data.data.data.list;
              _self.total = response.data.data.data.total;
              for (var i = 0; i < response.data.data.data.list.length; i++) {
                if (_self.tableData[i].comments == "null") {
                  _self.tableData[i].comments = "";
                }
                if (
                  response.data.data.data.list[i].orderType == "DISCOUNT_ORDER"
                ) {
                  _self.tableData[i].orderType = "折扣订单";
                } else if (
                  response.data.data.data.list[i].orderType == "NORMAL_ORDER"
                ) {
                  _self.tableData[i].orderType = "核销订单";
                } else if (
                  response.data.data.data.list[i].orderType == "WITHDRAW_ORDER"
                ) {
                  _self.tableData[i].orderType = "退款订单";
                } else if (
                  response.data.data.data.list[i].orderType ==
                  "creditType.daily"
                ) {
                  _self.tableData[i].orderType = "赊付日结";
                } else if (
                  response.data.data.data.list[i].orderType == "creditType.week"
                ) {
                  _self.tableData[i].orderType = "赊付周结";
                } else if (
                  response.data.data.data.list[i].orderType ==
                  "creditType.month"
                ) {
                  _self.tableData[i].orderType = "赊付月结";
                }
              }
              //console.log(_self.total)
              let formData2 = new FormData();
              formData2.append("shopCode", _self.shopcode);
              formData2.append("startTime", _self.datetime[0]);
              formData2.append("endTime", _self.datetime[1]);
              _self.axios
                .post(
                  _self.ApiUrl + "/catering/getSearchOrderPayamount",
                  formData2
                )
                .then(response => {
                  if (response.data.errcode == "0") {
                    if (response.data.data.data != null) {
                      _self.streamsum = response.data.data.data.actualAmount;
                      _self.searchsum = response.data.data.data.allPayment;
                    } else {
                      _self.streamsum = "0";
                      _self.searchsum = "0";
                    }
                  } else {
                    _self.$message.error("数据找不到啦，请刷新重试");
                  }
                })
                .catch(function(error) {
                  _self.$message.error("响应时间过长，请重试");
                });
            } else {
              _self.$message.error("数据找不到啦，请刷新重试");
            }
          })
          .catch(function(error) {
            _self.$message.error("响应时间过长，请重试");
          });
      }
    },
    getdata() {
      let _self = this;
      let formData = new FormData();
      formData.append("shopCode", _self.shopcode);
      formData.append("pageNum", _self.currentPage);
      formData.append("pageSize", _self.pagesize);
      //发送请求
      _self.axios
        .post(_self.ApiUrl + "/catering/getShopAllOrder", formData)
        .then(response => {
          if (response.data.errcode == "0") {
            _self.loading = false;
            _self.tableData = response.data.data.data.list;
            _self.total = response.data.data.data.total;
            for (var i = 0; i < response.data.data.data.list.length; i++) {
              if (_self.tableData[i].comments == "null") {
                _self.tableData[i].comments = "";
              }
              if (
                response.data.data.data.list[i].orderType == "DISCOUNT_ORDER"
              ) {
                _self.tableData[i].orderType = "折扣订单";
              } else if (
                response.data.data.data.list[i].orderType == "NORMAL_ORDER"
              ) {
                _self.tableData[i].orderType = "核销订单";
              } else if (
                response.data.data.data.list[i].orderType == "WITHDRAW_ORDER"
              ) {
                _self.tableData[i].orderType = "退款订单";
              } else if (
                response.data.data.data.list[i].orderType == "creditType.daily"
              ) {
                _self.tableData[i].orderType = "赊付日结";
              } else if (
                response.data.data.data.list[i].orderType == "creditType.week"
              ) {
                _self.tableData[i].orderType = "赊付周结";
              } else if (
                response.data.data.data.list[i].orderType == "creditType.month"
              ) {
                _self.tableData[i].orderType = "赊付月结";
              }
            }
            // 搜索金額
            let formData2 = new FormData();
            formData2.append("shopCode", _self.shopcode);
            formData2.append("userId", _self.id);
            _self.axios
              .post(
                _self.ApiUrl + "/catering/getTodayOperationOrderFee",
                formData2
              )
              .then(response => {
                if (response.data.errcode == "0") {
                  console.log(response);
                  if (response.data.data != null) {
                    _self.streamsum = response.data.data.allPayAmount;

                    //_self.searchsum=response.data.data.payAmount
                  } else {
                    _self.streamsum = "0";
                    _self.searchsum = "0";
                  }
                } else {
                  _self.$message.error("数据找不到啦，请刷新重试");
                }
              })
              .catch(function(error) {
                _self.$message.error("响应时间过长，请重试");
              });
          } else {
            _self.$message.error("数据找不到啦，请刷新重试");
          }
        })
        .catch(function(error) {
          //console.log(error.response.data.status);
          if (
            error.response.data.status == "403" ||
            error.response.data.status == "302"
          ) {
            _self.$message.error("用户登录过期，请重新登录");
            _self.$router.push("/login");
            _self.$store.commit("SAVE_USERINFO", "");
            _self.axios
              .post(_self.ApiUrl + "/logout")
              .then(response => {})
              .catch(function(error) {
                _self.$router.push("/login");
                _self.$store.commit("SAVE_USERINFO", "");
                _self.$store.commit("SAVE_ArrayList", "");
                _self.$store.commit("SAVE_ShopName", "");
              });
          } else if (error.response.data.status == "408") {
            _self.getstart();
          } else if (error.response.data.status == "504") {
            _self.getstart();
          } else {
            console.log(error);
          }
        });
    },
    search() {
      let formData = new FormData();
      let _self = this;

      _self.loading = true;
      formData.append("shopCode", _self.shopcode);
      formData.append("pageNum", _self.currentPage);
      formData.append("pageSize", _self.pagesize);
      formData.append("startTime", _self.datetime[0]);
      formData.append("endTime", _self.datetime[1]);
      //发送请求
      _self.axios
        .post(_self.ApiUrl + "/catering/timeSearchOrder", formData)
        .then(response => {
          if (response.data.errcode == "0") {
            _self.loading = false;
            _self.tableData = response.data.data.data.list;
            _self.total = response.data.data.data.total;
            _self.tabindex = "1";
            for (var i = 0; i < response.data.data.data.list.length; i++) {
              if (_self.tableData[i].comments == "null") {
                _self.tableData[i].comments = "";
              }
              if (
                response.data.data.data.list[i].orderType == "DISCOUNT_ORDER"
              ) {
                _self.tableData[i].orderType = "折扣订单";
              } else if (
                response.data.data.data.list[i].orderType == "NORMAL_ORDER"
              ) {
                _self.tableData[i].orderType = "核销订单";
              } else if (
                response.data.data.data.list[i].orderType == "WITHDRAW_ORDER"
              ) {
                _self.tableData[i].orderType = "退款订单";
              } else if (
                response.data.data.data.list[i].orderType == "creditType.daily"
              ) {
                _self.tableData[i].orderType = "赊付日结";
              } else if (
                response.data.data.data.list[i].orderType == "creditType.week"
              ) {
                _self.tableData[i].orderType = "赊付周结";
              } else if (
                response.data.data.data.list[i].orderType == "creditType.month"
              ) {
                _self.tableData[i].orderType = "赊付月结";
              }
            }
            //console.log(_self.total)
            let formData2 = new FormData();
            formData2.append("shopCode", _self.shopcode);
            formData2.append("startTime", _self.datetime[0]);
            formData2.append("endTime", _self.datetime[1]);
            _self.axios
              .post(
                _self.ApiUrl + "/catering/getSearchOrderPayamount",
                formData2
              )
              .then(response => {
                if (response.data.errcode == "0") {
                  if (response.data.data.data != null) {
                    _self.streamsum = response.data.data.data.actualAmount;
                    _self.searchsum = response.data.data.data.allPayment;
                  } else {
                    _self.streamsum = "0";
                    _self.searchsum = "0";
                  }
                } else {
                  _self.$message.error("数据找不到啦，请刷新重试");
                }
              })
              .catch(function(error) {
                _self.$message.error("响应时间过长，请重试");
              });
          } else {
            _self.$message.error("数据找不到啦，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("响应时间过长，请重试");
        });
    },
    //传送
    MySendData(index, row) {
      console.log(index);
      let _self = this;

      let namecode = "";

      let QrCodeTip = new FormData();
      QrCodeTip.append("str", "QrCode");
      _self.axios
        .post(_self.ApiUrl + "/catering/getQrCodeTip", QrCodeTip)
        .then(response => {
          if (response.data.errcode == "0") {
            namecode = response.data.data.data.value;
            let getorder = new FormData();
            getorder.append("orderid", _self.tableData[index].orderCode);
            _self.axios
              .post(
                "https://dolphin.daisha.com.cn/weixinbydc/getorderqr.php",
                getorder,
                {
                  // 单独配置
                  withCredentials: false
                }
              )
              .then(response => {
                if (response.data.expire_seconds == "86400") {
                  _self.qrcode = response.data.url;
                  let formData = new FormData();
                  formData.append(
                    "orderCode",
                    _self.tableData[index].orderCode
                  );
                  formData.append("shopCode", _self.shopcode);
                  formData.append("seatNum", _self.tableData[index].seatNum);
                  formData.append("comments", _self.tableData[index].comments);
                  formData.append("state", "1");
                  _self.axios
                    .post(_self.ApiUrl + "/catering/spreadFoodBtn", formData)
                    .then(response => {
                      if (response.data.errcode == "0") {
                        //创建小票打印页
                        _self.jsondate = response.data.data;
                        var goodslist = _self.jsondate;

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
                        LODOP.SET_PRINT_STYLE("FontSize", 9); //字体大小
                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          60,
                          pageWidth,
                          rowHeight,
                          goodslist.shop
                        );

                        hPos += rowHeight;
                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          60,
                          pageWidth,
                          rowHeight,
                          "零售收款单"
                        );
                        hPos += rowHeight;
                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          1,
                          pageWidth,
                          rowHeight,
                          "单据日期:"
                        );
                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          60,
                          pageWidth,
                          rowHeight,
                          goodslist.create_at
                        );
                        hPos += rowHeight;
                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          1,
                          pageWidth,
                          rowHeight,
                          "制单人:"
                        );
                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          60,
                          pageWidth,
                          rowHeight,
                          goodslist.sales
                        );
                        hPos += rowHeight;
                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          1,
                          pageWidth,
                          rowHeight,
                          "销售单据号:"
                        );
                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          65,
                          pageWidth,
                          rowHeight,
                          goodslist.orderCode
                        );
                        hPos += rowHeight;
                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          1,
                          pageWidth,
                          rowHeight,
                          "投诉电话:"
                        );
                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          60,
                          pageWidth,
                          rowHeight,
                          goodslist.customer_service_number
                        );
                        hPos += rowHeight;
                        LODOP.ADD_PRINT_LINE(hPos, 2, hPos, pageWidth, 2, 1);
                        hPos += 5;
                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          1,
                          pageWidth,
                          rowHeight,
                          "数量"
                        );
                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          40,
                          pageWidth,
                          rowHeight,
                          "订单价"
                        );
                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          90,
                          pageWidth,
                          rowHeight,
                          "实销价"
                        );
                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          140,
                          pageWidth,
                          rowHeight,
                          "折扣率"
                        );
                        hPos += rowHeight;
                        //遍历goodslist的商品数组
                        for (var i = 0; i < goodslist.goodsList.length; i++) {
                          if (
                            goodslist.goodsList[i].productionName.length < 7
                          ) {
                            LODOP.ADD_PRINT_TEXT(
                              hPos,
                              1,
                              pageWidth,
                              rowHeight,
                              goodslist.goodsList[i].bar_code +
                                goodslist.goodsList[i].productionName
                            );
                            hPos += rowHeight;
                          } else if (
                            goodslist.goodsList[i].productionName.length > 12 ||
                            goodslist.goodsList[i].bar_code.length > 12
                          ) {
                            LODOP.ADD_PRINT_TEXT(
                              hPos,
                              1,
                              pageWidth,
                              rowHeight,
                              goodslist.goodsList[i].bar_code
                            );
                            hPos += rowHeight;
                            LODOP.ADD_PRINT_TEXT(
                              hPos,
                              1,
                              pageWidth,
                              rowHeight,
                              goodslist.goodsList[i].productionName
                            );
                            hPos += rowHeight;
                          } else {
                            LODOP.ADD_PRINT_TEXT(
                              hPos,
                              1,
                              pageWidth,
                              rowHeight,
                              goodslist.goodsList[i].bar_code +
                                goodslist.goodsList[i].productionName
                            );
                            hPos += rowHeight;
                          }
                          LODOP.ADD_PRINT_TEXT(
                            hPos,
                            1,
                            pageWidth,
                            rowHeight,
                            goodslist.goodsList[i].orderAmount
                          );
                          LODOP.ADD_PRINT_TEXT(
                            hPos,
                            50,
                            pageWidth,
                            rowHeight,
                            goodslist.goodsList[i].payAmount
                          );
                          LODOP.ADD_PRINT_TEXT(
                            hPos,
                            95,
                            pageWidth,
                            rowHeight,
                            goodslist.goodsList[i].actual_amount
                          );
                          LODOP.ADD_PRINT_TEXT(
                            hPos,
                            150,
                            pageWidth,
                            rowHeight,
                            parseInt(
                              goodslist.goodsList[i].discountRate * 100
                            ) + "%"
                          );
                          hPos += rowHeight;
                        }
                        //商品遍历打印完毕,空一行
                        hPos += rowHeight;
                        LODOP.ADD_PRINT_LINE(hPos, 2, hPos, pageWidth, 2, 1);
                        hPos += 5;
                        //合计
                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          70,
                          pageWidth,
                          rowHeight,
                          "合计数量：" + goodslist.totalCount
                        );
                        // hPos += rowHeight;
                        // LODOP.ADD_PRINT_TEXT(
                        //   hPos,
                        //   70,
                        //   pageWidth,
                        //   rowHeight,
                        //   "合计金额：" + goodslist.orderPayment
                        // );
                        hPos += rowHeight;
                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          70,
                          pageWidth,
                          rowHeight,
                          "实销金额：" + goodslist.total
                        );
                        hPos += rowHeight;
                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          70,
                          pageWidth,
                          rowHeight,
                          "抹零金额：" + goodslist.maLing
                        );
                        hPos += rowHeight;
                        LODOP.ADD_PRINT_LINE(hPos, 2, hPos, pageWidth, 2, 1);
                        hPos += 5;
                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          1,
                          pageWidth,
                          rowHeight,
                          "本次收款金额："
                        );
                        hPos += rowHeight;
                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          80,
                          pageWidth,
                          rowHeight,
                          goodslist.paymentMethod
                        );

                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          120,
                          pageWidth,
                          rowHeight,
                          "￥" + goodslist.total
                        );
                        hPos += rowHeight;
                        LODOP.ADD_PRINT_LINE(hPos, 2, hPos, pageWidth, 2, 1);
                        hPos += 5;
                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          2,
                          pageWidth,
                          rowHeight,
                          new Date().toLocaleDateString() +
                            " " +
                            new Date().toLocaleTimeString()
                        );
                        hPos += rowHeight;
                        LODOP.ADD_PRINT_TEXT(
                          hPos,
                          25,
                          pageWidth,
                          rowHeight,
                          "谢谢惠顾,欢迎下次光临!"
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
                      } else {
                        _self.$message.error("数据找不到啦，请刷新重试");
                      }
                    })
                    .catch(function(error) {
                      _self.$message.error("响应时间过长，请重试");
                    });
                } else {
                  _self.$message.error("获取二维码失败，请刷新重试");
                }
              })
              .catch(function(error) {
                _self.$message.error("二维码响应时间过长，请重试");
              });
          } else {
            _self.$message.error("获取二维码失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("二维码响应时间过长，请重试");
        });
    }
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

.block {
  margin-bottom: 15px;
}

.titles {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  font-size: 14px;
  margin: 0 15px;
}

.title-color {
  color: red;
}
/* .el-button--primary{
		min-width: 73px;
	} */
.daochu {
  position: absolute;
  right: 10px;
  top: 70px;
}
.el-table__body-wrapper {
  overflow-x: auto;
  overflow-y: auto;
}
</style>
