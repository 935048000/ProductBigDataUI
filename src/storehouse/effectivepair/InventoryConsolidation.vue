<template>
  <div class="app-contion">
    <div class="stock-header" style="display: flex;">
      <label class="stock-labels stock-tiao">仓库：</label>
      <el-select v-model="wareblur" filterable placeholder="请选择" @change="wareblurchange">
        <el-option
          v-for="item in options3"
          :key="item.warehouse_code"
          :label="item.warehouse_name"
          :value="item"
        ></el-option>
      </el-select>
      <label class="stock-labels stock-tiao">时间：</label>
      <el-date-picker
        :picker-options="{'disabledDate': (time)=>{
				 return time.getTime() < new Date('2019-09-01  00:00:00');
			 }}"
        v-model="timer"
        type="month"
        placeholder="选择月"
        value-format="yyyy-MM"
      ></el-date-picker>
      <el-button type="warning" @click="seachall" style="margin-left: 0.625rem;">查询</el-button>
    </div>

    <!--startprint-->
    <el-table
      :data="tableData"
      border
      :height="tableHeight"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="code" label="盘点单号"></el-table-column>
      <el-table-column prop="owner" label="制单人"></el-table-column>
      <el-table-column prop="create_at" label="创建时间"></el-table-column>
    </el-table>
    <div style="width: 100%;text-align: center;">
      <el-button type="success" @click="consolidation" class="Inventorystyle">合并</el-button>
    </div>
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
      shopcode: state => state.userinfo.shopcode
    })
  },
  data() {
    return {
      activeName: "first",
      capitalnum: "", //主产品数量
      tableData: [],
      tableData2: [],
      multipleSelection: [],
      tableHeight: window.innerHeight - 195,
      currentPage: "",
      mastertable: "", // 主表
      mastertablecode: "", // 主表code
      dialogVisible: false,
      editdialog: false, //编辑
      timer: "",
      secondarytable: "", //次表
      secondarycode: "", //次表code
      options2: [],
      wareblur: "", //仓库
      wareblurcode: "", //仓库code
      options3: [],
      total: "",
      production_bar_code: "",
      orderId: ""
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },

    wareblurchange(Vid) {
      let _self = this;
      _self.wareblur = Vid.warehouse_name;
      _self.wareblurcode = Vid.warehouse_code;
    },
    //校对
    seachall() {
      let _self = this;
      if (_self.timer == "" || _self.wareblur == "") {
        _self.$message({
          message: "仓库和时间为必选项",
          type: "warning"
        });
        return false;
      }

      let formData = new FormData();
      formData.append("warehouseCode", _self.wareblurcode);
      formData.append("timeStr", _self.timer);
      _self.axios
        .post(
          _self.ApiurlStorehouse + "/stocktaking/queryStocktakingList",
          formData,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if (response.data.errcode == "0") {
            _self.tableData = response.data.data.list;
          } else {
            _self.$message.error("列表载入失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("列表载入响应时间过长，请重试");
        });
    },

    consolidation() {
      let _self = this;
      _self
        .$confirm("正在合并盘点单, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          var tableData2 = [];
          for (var i = 0; i < _self.multipleSelection.length; i++) {
            var newdata = {
              billId: _self.multipleSelection[i].code
            };
            tableData2.push(newdata);
          }
          var listbox = {
            list: tableData2,
            warehouseCode: _self.wareblurcode,
            userId: _self.id
          };
          _self.axios
            .post(
              _self.ApiurlStorehouse + "/stocktaking/stocktakingBillsCombine",
              {
                jsonData: listbox
              },
              {
                // 单独配置
                withCredentials: false
              },
              {
                headers: {
                  "Content-Type": "application/json;charsetset=UTF-8"
                }
              }
            )
            .then(response => {
              if (response.data.errcode == "0") {
                this.$notify({
                  title: "提示",
                  message: "合并成功，盘点单号为：" + response.data.data.billId,
                  duration: 0
                });
              } else {
                _self.$notify({
                  title: "警告",
                  message: response.data.data.msg,
                  type: "warning",
                  duration: 0
                });
              }
            })
            .catch(function(error) {
              _self.$message.error("保存响应时间过长，请重试");
            });
        })
        .catch(() => {
          _self.$message({
            type: "info",
            message: "已取消删除"
          });
        });
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
            _self.options3 = response.data.data.list;
          } else {
            _self.$message.error("获取仓库失败，请刷新重试");
          }
        })
        .catch(function(error) {
          _self.$message.error("仓库响应时间过长，请重试");
        });
    }
  },
  created: function() {
    let _self = this;
    _self.WarehouseSelection();
  }
};
</script>

<style>
.churustle {
  position: relative;
  padding: 2.925rem 0.625rem 0.625rem 0.625rem;
}

.churustlebtn {
  position: absolute;
  right: 0.625rem;
  top: 0.3125rem;
}

.app-contion {
  margin: 0.625rem;
}

.stock-header {
  margin: 5px 0;
}

.stock-labels {
  font-size: 0.875rem;
  margin-left: 0.625rem;
  display: inline-block;
}

.stock-tiao {
  margin-top: 0.6375rem;
  width: 7%;
}

.stock-margin {
  margin: 0.625rem 0;
}

.display {
  display: none;
}

.el-table__body-wrapper {
  overflow-x: auto;
  overflow-y: auto;
}

.tabsnew .el-tabs__item {
  height: 2.5rem !important;
  line-height: 2.5rem !important;
}

.Inventorystyle {
  width: 20%;
  margin-top: 0.9375rem;
}
</style>
