<template>
  <!--{{$store.state.userinfo}}-->
  <div class="index">
    <el-container style=" border: 1px solid #eee">
      <!--左侧导航-->
      <el-aside width="200px" style="background-color:#333333;" v-show="isShows">
        <!--<div class="top-header">
  		<h1 class="title">首页</h1>
        </div>-->
        <el-menu
          default-active="2"
          router
          background-color="#333333"
          text-color="#fff"
          class="el-menu-vertical-demo"
          active-text-color="#ff5e59"
        >
          <el-menu-item index="/" class="top">
            <div style="width: 100%;text-align: center;">
              <div style="width: 3.125rem;height: 3.125rem;margin-left:55px;padding: 10px 0 0 0;">
                <img src="../../assets/hearder.png" style="width: 100%;" />
              </div>
              <!--<p>{{"testshop"}}</p>-->
            </div>
            <i class="el-icon-setting"></i>
          </el-menu-item>
            <el-submenu index="7">
              <template slot="title">
                <i class="el-icon-notebook-2"></i>报表中心
              </template>
              <!--<el-menu-item index="nav">报表导航页</el-menu-item>-->
              <!--<el-submenu index="7-1">-->
                <!--<template slot="title">汇总类报表</template>-->
                <el-menu-item-group>
                  <el-menu-item index="DataReportDay">产品日均价（模板）</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group>
                  <el-menu-item index="DataReportM">月汇总报表</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group>
                  <el-menu-item index="shopstonehourlyreport">易石历史数据时汇总</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group>
                  <el-menu-item index="shopstonedailyreport">易石历史数据日汇总</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group>
                  <el-menu-item index="shopstonemonthreport">易石历史数据月汇总</el-menu-item>
                </el-menu-item-group>
              <!--</el-submenu>-->


                <!--<el-submenu index="7-2">-->
                  <!--<template slot="title">零售类报表</template>-->
                  <el-menu-item-group>
                    <el-menu-item index="theoreticalinventory_v2">库存明细报表</el-menu-item>

                    <el-menu-item index="salesPerformance">销售业绩报表</el-menu-item>
                  </el-menu-item-group>
                  <el-menu-item-group>
                    <el-menu-item index="SupplierSalesStatement_2">供应商销售报表</el-menu-item>
                  </el-menu-item-group>

                  <el-menu-item-group>
                    <el-menu-item index="InventoryStatement">库单报表</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>

            <!--</el-submenu>-->

        </el-menu>
      </el-aside>
      <!--右侧-->
      <el-container>
        <el-header
          style="text-align: right; font-size: 12px;background-color: rgb(51, 51, 51);position: relative;"
        >

        </el-header>

        <!--路由出口-->
        <router-view></router-view>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    //		 		username(){
    //		 			return this.$store.state.userinfo.name
    //		 		},
    //辅助函数获取state
    ...mapState({
      userinfo: state => state.userinfo,
      username: state => state.userinfo.account,
      shopcode: state => state.userinfo.shopcode,
      ArrayList: state => state.ArrayList,
      ShopName: state => state.ShopName.shopName,
      profilesettlement: state => state.ShopName.profile_settlement,
      profilequeuetype: state => state.ShopName.profile_queue_type,
      typename: state => state.ShopName.shopName,
      shopgroup: state => state.ShopName.shop_group
    })
  },
  created() {
    console.log("=-=-=", this.examin === "none", this.examinAdmin, this.examin);
  },
  data() {
    return {
      tableData: [],
      isShows: true,
      shopnames: "",
      count: "",
      display1: "block",
      display2: "block",
      display3: "block",
      display4: "block",
      display5: "block",
      display6: "block",
      display7: "none",
      REPORT: "none",
      displayquan: "none",
      display9: "block",
      display10: "none",
      display11: "block",
      canyin: "block",
      techan: "block",
      warehouse: "none",
      stockcontrol: "none",
      AuditDetails: "none",
      examin: "none",
      examinOnly: "none",
      examinAdmin: "none",
      Supplychain: "none",
      lingshouTabulation: "none",
      canyinTabulation: "none",
      CashRegister: "none",
      unpaiddisplay: "block",
      MembershipAuthority: "none",
      Financialdisplay: "none",
      NamingMethod: "商家端点餐系统",
      NamingMethodChild: "商家点餐"
    };
  },
  // methods: {
  //   layout() {
  //     let _self = this;
  //     _self.axios
  //       .post(_self.ApiUrl + "/logout")
  //       .then(response => {
  //         if (response.data.code == "200") {
  //           _self.$store.commit("SAVE_USERINFO", "");
  //           _self.$store.commit("SAVE_ArrayList", "");
  //           _self.$store.commit("SAVE_ShopName", "");
  //           _self.$store.commit("SAVE_BillData", "");
  //           _self.$store.commit("SAVE_AllPayment", "");
  //           _self.$router.push("/login");
  //           _self.$message({
  //             type: "success",
  //             message: "退出成功"
  //           });
  //         } else {
  //           _self.$router.push("/login");
  //           _self.$store.commit("SAVE_USERINFO", "");
  //           _self.$store.commit("SAVE_ArrayList", "");
  //           _self.$store.commit("SAVE_ShopName", "");
  //           _self.$store.commit("SAVE_BillData", "");
  //           _self.$store.commit("SAVE_AllPayment", "");
  //           _self.$message({
  //             type: "error",
  //             message: "退出失败"
  //           });
  //         }
  //       })
  //       .catch(function(error) {
  //         _self.$router.push("/login");
  //         _self.$store.commit("SAVE_USERINFO", "");
  //         _self.axios
  //           .post(_self.ApiUrl + "/logout")
  //           .then(response => {
  //             if (response.data.code == "200") {
  //               _self.$store.commit("SAVE_USERINFO", "");
  //               _self.$store.commit("SAVE_ArrayList", "");
  //               _self.$store.commit("SAVE_ShopName", "");
  //               _self.$store.commit("SAVE_BillData", "");
  //               _self.$store.commit("SAVE_AllPayment", "");
  //               _self.$router.push("/login");
  //             } else {
  //               _self.$router.push("/login");
  //               _self.$store.commit("SAVE_USERINFO", "");
  //               _self.$store.commit("SAVE_ArrayList", "");
  //               _self.$store.commit("SAVE_BillData", "");
  //               _self.$store.commit("SAVE_ShopName", "");
  //               _self.$store.commit("SAVE_AllPayment", "");
  //             }
  //           })
  //           .catch(function(error) {
  //             _self.$router.push("/login");
  //             _self.$store.commit("SAVE_USERINFO", "");
  //             _self.$store.commit("SAVE_ArrayList", "");
  //             _self.$store.commit("SAVE_BillData", "");
  //             _self.$store.commit("SAVE_ShopName", "");
  //             _self.$store.commit("SAVE_AllPayment", "");
  //           });
  //         _self.$message.error("响应时间过长，请重试");
  //       });
  //   },
  //   // logins() {
  //   //   let _self = this;
  //   //   console.log(_self.ArrayList);
  //   //   if (
  //   //     _self.$store.state.userinfo == "" ||
  //   //     _self.$store.state.userinfo == undefined ||
  //   //     _self.$store.state.userinfo == null
  //   //   ) {
  //   //     _self.$router.push("/login");
  //   //     _self.axios
  //   //       .post(_self.ApiUrl + "/logout")
  //   //       .then(response => {
  //   //         if (response.data.code == "200") {
  //   //           _self.$store.commit("SAVE_USERINFO", "");
  //   //           _self.$store.commit("SAVE_ArrayList", "");
  //   //           _self.$store.commit("SAVE_ShopName", "");
  //   //           _self.$router.push("/login");
  //   //         } else {
  //   //           _self.$router.push("/login");
  //   //           _self.$store.commit("SAVE_USERINFO", "");
  //   //           _self.$store.commit("SAVE_ArrayList", "");
  //   //           _self.$store.commit("SAVE_ShopName", "");
  //   //         }
  //   //       })
  //   //       .catch(function(error) {
  //   //         _self.$router.push("/login");
  //   //         _self.$store.commit("SAVE_USERINFO", "");
  //   //         _self.$store.commit("SAVE_ArrayList", "");
  //   //         _self.$store.commit("SAVE_ShopName", "");
  //   //       });
  //   //   }
  //   // },
  //   // 隐藏开关
  //   // hidechange() {
  //   //   let _self = this;
  //   //   _self.isShows = !_self.isShows;
  //   // }
  // },
  // async mounted() {
  //   this.logins();
  //   await this.gettodaylist();
  // }
};
</script>

<style>
.el-header {
  background-color: #263445;
  color: #333;
  line-height: 56px;
  height: 56px !important;
}

.el-aside {
  background-color: rgb(51, 51, 51) !important;
}

html,
body,
#app,
.index {
  height: 100%;
  overflow-y: hidden;
}

.leftclose {
  position: absolute;
  left: 0.625rem;
  line-height: 56px;
}

.el-container {
  height: 100% !important;
}

.el-menu {
  border-right: 0;
}

.top-header {
  text-align: center;
  padding: 18px 0;
  background: #333333;
}

.top-header .title {
  color: #fff;
  font-weight: bold;
}

.top {
  /* background: #1c1c1c !important; */
  border-bottom: 3px solid #1c1c1c;
  height: 7.5rem;
}

.username {
  font-size: 16px;
  color: #fff;
  cursor: pointer;
}

.slow {
  width: 25px;
  height: 25px;
  display: inline-block;
  border-radius: 50%;
  background: #ff0000;
  color: white;
  margin-left: 10px;
  font-size: 12px;
  text-align: center;
  position: relative;
}

.slow span {
  position: absolute;
  top: -13px;
  left: 0;
  width: 100%;
}

.el-popper {
  margin-top: -0.7rem !important;
}
</style>
