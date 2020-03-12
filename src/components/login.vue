<template>
  <div class="login">
    <!--登陆表单-->
    <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" class="demo-ruleForm">
      <h1 class="title">业务中台</h1>

      <el-form-item prop="username">
        <el-input type="text" v-model="loginForm.username" placeholder="用户名" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" placeholder="密码" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm('loginForm')"
          :loading="loading"
          style="width: 100%;background: #2887cd;"
        >登陆</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Cookies from "js-cookie";
export default {
  data() {
    return {
      //登陆表单数据
      loginForm: {
        password: "",
        username: ""
      },
      loading: false,
      //验证规则
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }, //非空
          { min: 4, max: 18, message: "长度在 4 到 18 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 4, max: 18, message: "长度在 4 到 18 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      let _self = this;
      _self.loading = true;
      this.$refs[formName].validate(valid => {
        if (valid) {
          //发送请求
          let formData = new FormData();
          formData.append("account", _self.loginForm.username);
		  formData.append("password", _self.loginForm.password);
		  sessionStorage.setItem('account',_self.loginForm.username)
		  sessionStorage.setItem('password',_self.loginForm.password)
          this.axios.post(_self.ApiUrl + "/login", formData).then(response => {
            if (response.data.code == "200") {
              //把当前用户数据存入state
              _self.$router.push("/");
              // window.open('/advertisement')
              _self.loading = false;
              _self.$store.commit("SAVE_USERINFO", response.data.data.UsrUser);
              _self.$store.commit(
                "SAVE_ArrayList",
                response.data.data.ArrayList
              );
              _self.$message({
                type: "success",
                message: "登录成功"
              });
              //跳转到首页
            } else {
              _self.$message({
                type: "error",
                message: "用户名密码错误"
              });
              _self.loading = false;
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    loginindex() {
      let _self = this;
      if (
        _self.$store.state.userinfo == "" ||
        _self.$store.state.userinfo == null
      ) {
        _self.$router.push("/login");
        _self.$store.commit("SAVE_USERINFO", "");
        _self.$store.commit("SAVE_ArrayList", "");
        _self.$store.commit("SAVE_ShopName", "");
      } else {
        _self.$router.push("/");
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  created: function() {
    this.loginindex();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
// .el-button--primary {
//   width: 100%;
// }
</style>
<style >
html,
body {
  margin: 0;
  padding: 0;
}
html,
body,
#app,
.login {
  height: 100%;
}
.login {
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-form {
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
.title {
  font-size: 22px;
  color: #333;
  font-weight: bold;
  text-align: center;
  padding-bottom: 30px;
}
</style>
