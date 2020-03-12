<template>
  <div>
    <div class="flex">
      <div class="cell">
        <p>销售订单号：</p>
        <el-input
          style="width:150px"
          @change="onChangeCode"
          placeholder="请输入订单号"
          v-model="paramsOrder"
        ></el-input>
      </div>
      <div class="cell">
        <p>退款时间</p>
        <el-date-picker
          :picker-options="{'disabledDate': (time)=>{
				 return time.getTime() < new Date('2019-09-01  00:00:00');
			 }}"
          v-model="paramsTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="onChangeTime"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </div>
      <el-button type="primary" @click="searchDate">查询</el-button>
      <el-button type="success" @click="exportTable">导出</el-button>
      <el-button type="primary" @click="addRefund">新增隔日退款</el-button>
    </div>
    <el-table :data="dataList" border style="width: 100%">
      <el-table-column prop="orderCode" label="销售订单号" width="180"></el-table-column>
      <el-table-column prop="productionName" label="退款商品" width="180"></el-table-column>
      <el-table-column prop="provider_name" label="退货供应商" width="180"></el-table-column>
      <el-table-column prop="sales_pay" label="商品订单金额" width="180"></el-table-column>
      <el-table-column prop="retn_pay" label="退款金额" width="180"></el-table-column>
      <el-table-column prop="saler" label="申请人" width="180"></el-table-column>
      <el-table-column prop="comments" label="退款理由"></el-table-column>
    </el-table>
    <div style="text-align:right">
      <el-pagination
        :page-size="10"
        layout="prev, pager, next"
        @current-change="changePage"
        :hide-on-single-page="true"
        :total="total"
      ></el-pagination>
    </div>

    <el-dialog title="新增退款" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <div class="dialog">
        <div class="cell">
          <p>请输入需要退款的销售订单号</p>
          <el-input
            style="width:200px"
            placeholder="请输入需要退款的销售订单号"
            v-model="diaCode"
            @change="getOrderCode"
          ></el-input>
        </div>
        <div class="cell">
          <p>请选择退款商品</p>
          <el-select v-model="diaProCode" placeholder="请选择" style="width:200px">
            <el-option
              v-for="item in orderCodeList"
              :key="item.bar_code"
              :label="item.bar_code"
              :value="item.bar_code"
            ></el-option>
          </el-select>
        </div>
        <div class="cell">
          <p>输入退款金额</p>
          <el-input style="width:200px" placeholder="请输入退款金额" v-model="diaPrice"></el-input>
        </div>
        <div class="cell">
          <p>输入订单数量</p>
          <el-input style="width:200px" placeholder="请输入订单数量" v-model="diaAcount"></el-input>
        </div>
        <div class="cell">
          <p>退款理由</p>
          <el-input style="width:200px" placeholder="请输入退款理由" v-model="diaRemark"></el-input>
        </div>
        <div class="cell">
          <p>申请人</p>
          <el-input style="width:200px" placeholder="请输入申请人" v-model="diaAutor"></el-input>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  LateRefundListDate,
  getOrderPrdCode,
  addLateRefundList,
  LateRefundListCode
} from "@/service";
import { tableToExcel } from "@/public";
export default {
  data() {
    return {
      dialogVisible: false,
      paramsTime: "",
      paramsOrder: "",
      dataList: "",
      diaCode: "",
      orderCodeList: [],
      diaProCode: "",
      diaPrice: "",
      diaRemark: "",
      diaAutor: "",
      diaAcount: 0,
      type: "order",
      total: 1,
      currenPage: 1
    };
  },
  methods: {
    changePage(index) {
      console.log(index);
      this.currenPage = index;
      this.searchDate();
    },
    onChangeTime() {
      this.paramsOrder = "";
    },
    onChangeCode() {
      this.type = "order";
    },
    submit() {
      addLateRefundList({
        ordercode: this.diaCode,
        production_code: this.diaProCode,
        order_amount: this.diaAcount,
        pay_amount: this.diaPrice,
        comments: this.diaRemark,
        operator: this.diaAutor
      }).then(res => {
        if (res.data.errcode === 0) {
          this.dialogVisible = false;
          this.$message.success("提交成功");
          this.searchDate();
        }
      });
    },
    getOrderCode() {
      getOrderPrdCode({
        ordercode: this.diaCode
      }).then(res => {
        this.orderCodeList = res.data.data.list;
      });
    },
    exportTable() {
      if (this.dataList.length <= 0) {
        return;
      }
      let tHeader = [
        "销售订单号",
        "退款商品",
        "退货供应商",
        "商品订单金额",
        "退款金额",
        "申请人",
        "退款理由"
      ];
      let tFilter = [
        "orderCode",
        "productionName",
        "provider_name",
        "sales_pay",
        "retn_pay",
        "saler",
        "comments"
      ];
      tableToExcel(this.dataList, tHeader, tFilter, `${paramsOrder}退款单`);
    },
    addRefund() {
      this.dialogVisible = true;
    },
    searchDate() {
      console.log(this.paramsTime);

      if (this.paramsOrder) {
        LateRefundListCode({
          ordercode: this.paramsOrder,
          pageSize: 10,
          pageNum: this.currenPage
        }).then(res => {
          this.dataList = res.data.data.list.list
            ? res.data.data.list.list
            : [];
          this.total = res.data.data.list.total;
        });
        return;
      }

      LateRefundListDate({
        startTime: this.paramsTime[0] + " 00:00:00",
        endTime: this.paramsTime[1] + " 23:59:59",
        pageSize: 10,
        pageNum: this.currenPage
      }).then(res => {
        this.dataList = res.data.data.list.list ? res.data.data.list.list : [];
        this.total = res.data.data.list.total;
      });
    }
  },
  created() {}
};
</script>
<style lang="less" scoped>
.dialog {
  .cell {
    margin-bottom: 10px;
    p {
      width: 200px;
    }
  }
}
.flex {
  display: flex;
  padding: 20px 20px;
  border-bottom: 1px solid #909399;
  box-sizing: border-box;
  margin-bottom: 20px;
}
.cell {
  display: flex;
  align-items: center;
  margin-right: 20px;
  p {
    white-space: nowrap;
    font-size: 15px;
    margin-right: 10px;
  }
}
.dialog-footer {
  text-align: center;
}
</style>