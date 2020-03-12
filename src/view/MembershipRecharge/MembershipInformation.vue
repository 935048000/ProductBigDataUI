<template>
  <div class="app-contion">
    <!-- 表单提交 -->
    <div style="display: flex;width: 100%;">
      <div style="margin: 10px 0.3125rem;">
        <label style="font-size: 0.875rem;">会员：</label>
        <el-input v-model="phoneandname" placeholder="请输入手机号或姓名" style="width: 70%;"></el-input>
      </div>
      <div style="margin: 10px 0.3125rem;">
        <label style="font-size: 0.875rem;">入会时间：</label>
        <el-date-picker
          :picker-options="{'disabledDate': (time)=>{
				 return time.getTime() < new Date('2019-09-01  00:00:00');
			 }}"
          v-model="memberstime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          style="width: 70%;"
        ></el-date-picker>
      </div>
      <div>
        <el-button type="warning" style="margin-top: 0.6125rem;" @click="searchbtn">搜索</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <el-table
      :data="tableData"
      v-loading="loading"
      border
      style="width: 100%"
      :height="tableHeight"
    >
      <el-table-column prop="name" label="会员姓名"></el-table-column>
      <el-table-column prop="tel" label="手机号码"></el-table-column>
      <el-table-column prop="balance" label="会员金额"></el-table-column>
      <el-table-column prop="frozen_amount" label="冻结金额"></el-table-column>

      <el-table-column prop="company" label="所属公司"></el-table-column>
      <el-table-column prop="create_at" label="入会时间"></el-table-column>
      <el-table-column prop="state" label="状态"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="修改" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="所属公司" prop="company">
          <el-select v-model="ruleForm.company" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in AttributionCompany"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="入会时间" prop="time">
          <el-input v-model="ruleForm.time" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-switch v-model="ruleForm.state" active-text="会员" inactive-text="非会员"></el-switch>
        </el-form-item>
        <!-- </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
      </span>
    </el-dialog>
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
      phoneandname: "",
      tableHeight: window.innerHeight - 160,
      memberstime: "",
      AttributionCompany: [],
      tableData: [], //table
      dialogVisible: false,
      ruleForm: {
        name: "",
        phone: "",
        userKey: "",
        company: "",
        state: false
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入会员名称",
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            message: "请输入会员手机号",
            trigger: "blur"
          }
        ],
        company: [
          {
            required: true,
            message: "请输入所属公司",
            trigger: "blur"
          }
        ]
      },
      flag: 1
    };
  },
  methods: {
    searchbtn() {
      let _self = this;
      _self.flag = 2;
      if (_self.memberstime == "" && _self.phoneandname == "") {
        _self.$message({
          message: "请输入搜索条件",
          type: "warning"
        });
        return false;
      }
      let formData = new FormData();
      formData.append("telStr", _self.phoneandname);
      formData.append("datetime", _self.memberstime);
      _self.axios
        .post(
          _self.ApiUrlMember2 + "/mem/stored/selectByTelOrNameAndDatetime",
          formData,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if (response.data.errcode == "0") {
            _self.tableData = response.data.data.list;
            for (var i = 0; i < _self.tableData.length; i++) {
              if (_self.tableData[i].state == "1") {
                _self.tableData[i].state = "会员";
              } else {
                _self.tableData[i].state = "非会员";
              }
              _self.tableData[i].balance =
                Number(_self.tableData[i].balance) / 100;
              _self.tableData[i].balance = _self.tableData[i].balance.toFixed(
                2
              );
              _self.tableData[i].frozen_amount =
                Number(_self.tableData[i].frozen_amount) / 100;
              _self.tableData[i].frozen_amount = _self.tableData[
                i
              ].frozen_amount.toFixed(2);
            }
          } else {
            _self.$message.error("修改失败");
          }
        })
        .catch(function(error) {
          _self.$message.error("修改响应时间过长，请重试");
        });
    },

    handleEdit(index) {
      let _self = this;
      _self.dialogVisible = true;
      _self.userKey = _self.tableData[index].user_key;
      _self.ruleForm.name = _self.tableData[index].name;
      _self.ruleForm.phone = _self.tableData[index].tel;
      _self.ruleForm.company = _self.tableData[index].company;
      _self.ruleForm.time = _self.tableData[index].create_at;
      if (_self.tableData[index].state == "会员") {
        _self.ruleForm.state = true;
      } else {
        _self.ruleForm.state = false;
      }
    },
    submitForm(formName) {
      let _self = this;
      console.log(_self.ruleForm.state);
      _self.$refs[formName].validate(valid => {
        if (valid) {
          let formData = new FormData();
          formData.append("name", _self.ruleForm.name);
          formData.append("tel", _self.ruleForm.phone);
          formData.append("userKey", _self.userKey);
          formData.append("company", _self.ruleForm.company);
          if (_self.ruleForm.state == true) {
            formData.append("status", "1");
          } else {
            formData.append("status", "2");
          }
          _self.axios
            .post(
              _self.ApiUrlMember2 + "/mem/stored/updateByUserkeyInfo",
              formData,
              {
                // 单独配置
                withCredentials: false
              }
            )
            .then(response => {
              if (response.data.errcode == "0") {
                _self.$message({
                  message: "恭喜你，修改成功",
                  type: "success"
                });

                if (_self.flag == 1) {
                  _self.getdata();
                } else {
                  _self.searchbtn();
                }
                _self.dialogVisible = false;
              } else {
                _self.$message.error("修改失败");
              }
            })
            .catch(function(error) {
              _self.$message.error("修改响应时间过长，请重试");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getdata() {
      let _self = this;
      let formData = new FormData();

      _self.axios
        .post(
          _self.ApiUrlMember2 + "/mem/stored/selectByMenberList",
          formData,
          {
            // 单独配置
            withCredentials: false
          }
        )
        .then(response => {
          if (response.data.errcode == "0") {
            _self.tableData = response.data.data.list;
            for (var i = 0; i < _self.tableData.length; i++) {
              if (_self.tableData[i].state == "1") {
                _self.tableData[i].state = "会员";
              } else {
                _self.tableData[i].state = "非会员";
              }
              _self.tableData[i].balance =
                Number(_self.tableData[i].balance) / 100;
              _self.tableData[i].balance = _self.tableData[i].balance.toFixed(
                2
              );
              _self.tableData[i].frozen_amount =
                Number(_self.tableData[i].frozen_amount) / 100;
              _self.tableData[i].frozen_amount = _self.tableData[
                i
              ].frozen_amount.toFixed(2);
            }
          } else {
            _self.$message.error("获取列表信息失败");
          }
        })
        .catch(function(error) {
          _self.$message.error("列表响应时间过长，请重试");
        });
    },
    getcompany() {
      let _self = this;
      let formData = new FormData();
      formData.append("code", "company_name");
      formData.append("shopCode", _self.shopcode);
      _self.axios
        .post(_self.ApiUrl + "/catering/enumerationSorting", formData)
        .then(response => {
          if (response.data.errcode == "0") {
            _self.AttributionCompany = response.data.data.commentsGroup;
          } else {
            _self.$message.error("获取公司信息失败");
          }
        })
        .catch(function(error) {
          _self.$message.error("公司信息响应时间过长，请重试");
        });
    }
  },
  created: function() {
    let _self = this;
    _self.getdata();
    _self.getcompany();
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
</style>
