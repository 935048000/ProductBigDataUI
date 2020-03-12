<template>
  <div class="app-contion">
    <el-row class="mar-increased">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"
        style='margin: 0;width: auto;padding: 0;border: 0;'>
        <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="商品名称" prop="productionName">
              <el-input v-model="ruleForm.productionName" placeholder="请输入商品名称"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="一级品类" prop="CategoryName">
              <el-select v-model="ruleForm.CategoryName" :multiple='false' filterable allow-create default-first-option
                placeholder="请选择商品品类" style='width: 100%;' @change="wareblur">
                <el-option v-for="item in options" :key="item.level03_category_code" :label="item.level03_category_name"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="二级品类" prop="shopteam2">
              <el-select v-model="ruleForm.shopteam2" :multiple='false' filterable allow-create default-first-option
                placeholder="请选择商品品类" style='width: 100%;' @change="wareblur2">
                <el-option v-for="item in options2" :key="item.level02_category_code" :label="item.level02_category_name"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="三级品类" prop="shoplei">
              <el-select v-model="ruleForm.shoplei" :multiple='false' filterable allow-create default-first-option
                placeholder="请选择商品品类" style='width: 100%;' @change="wareblur3">
                <el-option v-for="item in options3" :key="item.level01_category_code" :label="item.level01_category_name"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>

        <!-- <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="商品编码" prop="productionCode">
              <el-input v-model="ruleForm.productionCode" placeholder="商品编码为四位数字形式"></el-input>
            </el-form-item>
          </div>
        </el-col> -->
        <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="商品条形码" prop="barCode">
              <el-input v-model="ruleForm.barCode" placeholder="请输入商品条形码"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="供应商名称" prop="providerName">
              <el-select v-model="ruleForm.providerName" :multiple='false' filterable allow-create default-first-option
                placeholder="请选择供应商名称" style='width: 100%;' @change="providerchange">
                <el-option v-for="item in options4" :key="item.supplier_name" :label="item.supplier_name" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <!-- <el-col :span="12">
					<div class="grid-content bg-purple f-s">
						<el-form-item label="供应商编码" prop="providerCode">
							<el-input v-model="ruleForm.providerCode" placeholder="请输入供应商编码"></el-input>
						</el-form-item>
					</div>
				</el-col> -->
        <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="成本价" prop="cost">
              <el-input v-model="ruleForm.cost" placeholder="请输入成本价"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="零售价" prop="price">
              <el-input v-model="ruleForm.price" placeholder="请输入零售价"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="商品单位" prop="unit">
              <el-input v-model="ruleForm.unit" placeholder="请输入商品单位"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="商品规格" prop="CommoditySize">
              <el-input v-model="ruleForm.CommoditySize" placeholder="请输入商品规格"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple f-s">
            <el-form-item label="商品品牌" prop="CommodityBrand">
              <el-input v-model="ruleForm.CommodityBrand" placeholder="请输入商品品牌"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple f-s footer-increased">
            <el-form-item class='btnbox-increased'>
              <el-button type="primary" @click="submitForm('ruleForm')" class='widsni'>保存</el-button>

            </el-form-item>
          </div>
        </el-col>

      </el-form>
    </el-row>
  </div>
</template>

<script>
  import {
    mapState
  } from 'vuex';
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
        ruleForm: {
          productionName: '',
          CategoryName: '',
          // productionCode: '',
          barCode: '',
          providerName: '',
          CommoditySize: '', //商品尺寸
          providerCode: '',
          cost: '',
          price: '',
          unit: '',
          shopteam2: '',
          shoplei: '',
          CommodityBrand: ''
        },
        rules: {

          productionName: [{
              required: true,
              message: '请输入商品名称',
              trigger: 'blur'
            },

          ],
          CategoryName: [

            {
              required: true,
              message: '请选择或输入商品品类名称',
              trigger: 'change'
            }
          ],
          // productionCode: [{
          //   required: true,
          //   message: '请输入商品品类编码',
          //   trigger: 'blur'
          // }, ],
          unit: [{
            required: true,
            message: '请输入商品单位',
            trigger: 'blur'
          }, ],
          barCode: [{
            required: true,
            message: '请输入商品条码',
            trigger: 'blur'
          }, ],
          providerName: [{
            required: true,
            message: '请选择供应商名称',
            trigger: 'change'
          }, ],

          cost: [{
            required: true,
            message: '请输入进货价',
            trigger: 'blur'
          }, ],
          price: [{
            required: true,
            message: '请输入零售价',
            trigger: 'blur'
          }, ],
          shopteam2: [{
              required: true,
              message: '请选择二级品类',
              trigger: 'change'
            },

          ],
          shoplei: [{
              required: true,
              message: '请选择三级品类',
              trigger: 'change'
            },

          ],
        },
        options: [],
        options2: [],
        options3: [],
        options4: [], //供应商名称
        options5: [], //商品尺寸
        CategoryName: [],
        CategoryCode: ''
      };
    },
    methods: {
      providerchange(Vid) {
        let _self = this;
        _self.ruleForm.providerName = Vid.supplier_name
        _self.providerCode = Vid.supplier_code
      },
      submitForm(formName) {
        let _self = this;
        _self.$refs[formName].validate((valid) => {
          if (valid) {
            // var regu = "^[0-9]{4}$";
            // var re = new RegExp(regu);
            // if (!re.test(_self.ruleForm.productionCode)) {
            //   _self.$message({
            //     type: 'warning',
            //     message: '商品编码为四位数字形式 ',
            //     duration: 10000,
            //     showClose: true,
            //   })
            //   return false
            // }
            let formData = new FormData();

            formData.append('productionName', _self.ruleForm.productionName);
            formData.append('cost', _self.ruleForm.cost);
            formData.append('price', _self.ruleForm.price);
            formData.append('categoryName', _self.ruleForm.shoplei);
            if (_self.CategoryCode == '') {
              formData.append('categoryCode', _self.$route.query.tabledataDetail.category_code);
              // formData.append('productionCode', _self.$route.query.tabledataDetail.category_code + _self.ruleForm.productionCode);
            } else {
              formData.append('categoryCode', _self.CategoryCode);
              // formData.append('productionCode', _self.CategoryCode + _self.ruleForm.productionCode);
            }

            formData.append('barCode', _self.ruleForm.barCode);
            formData.append('providerName', _self.ruleForm.providerName);
            if (_self.providerCode == undefined) {
              formData.append('providerCode', _self.$route.query.tabledataDetail.provider_code);
            } else {
              formData.append('providerCode', _self.providerCode);
            }

            if (_self.ruleForm.CommoditySize == null || _self.ruleForm.CommoditySize == undefined) {
              formData.append('specification', '');
            } else {
              formData.append('specification', _self.ruleForm.CommoditySize);
            }
            formData.append('picUrl', '');
            formData.append('unit', _self.ruleForm.unit);
            formData.append('id', _self.idcode);
            if (_self.ruleForm.CommodityBrand == null || _self.ruleForm.CommodityBrand == undefined) {
              formData.append('brand', '');
            } else {
              formData.append('brand', _self.ruleForm.CommodityBrand);
            }

            _self.axios.post(_self.ApiurlStorehouse + '/productManagement/updateGoods', formData, {
              // 单独配置
              withCredentials: false
            }).then(response => {
              console.log(response)
              if (response.data.errcode == '0') {
                _self.$message({
                  message: '修改成功',
                  type: 'success'
                });
                _self.$router.push({
                  path: '/ProductList',

                })
                _self.$refs[formName].resetFields();
              } else {
                _self.$message.error(response.data.errmsg);
              }
            }).catch(function(error) {
              _self.$message.error('响应时间过长，请重试5');

            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      wareblur(vId) {
        let _self = this;
        console.log(vId)
        // _self.ruleForm.CategoryName = vId.level01_category_name
        // _self.ruleForm.CategoryCode =vId.level01_category_code
        _self.ruleForm.CategoryName = vId.level03_category_name
        _self.ruleForm.shopteam2 = '';
        _self.ruleForm.shoplei = '';
        let formDatamb = new FormData();
        formDatamb.append('level03CategoryCode', vId.level03_category_code);
        //发送请求
        _self.axios.post(_self.ApiurlStorehouse + '/inventory/queryLevel02CategoryCode', formDatamb, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode = '0') {

            _self.options2 = response.data.data.list

          } else {
            _self.$message.error('品类找不到啦');
          }
        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试4');
        });
      },
      wareblur2(val) {
        let _self = this
        console.log(val)
        _self.ruleForm.shopteam2 = val.level02_category_name
        let formData = new FormData();
        formData.append('level02CategoryCode', val.level02_category_code);
        //发送请求
        _self.axios.post(_self.ApiurlStorehouse + '/inventory/queryLevel03CategoryCode', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode = '0') {
            _self.options3 = response.data.data.list
          } else {
            _self.$message.error('品类找不到啦');
          }
        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试1');
        });
      },
      wareblur3(val) {
        let _self = this

        _self.ruleForm.shoplei = val.level01_category_name
        _self.CategoryCode = val.level01_category_code
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      getcategory() {
        let _self = this;
        let formData3 = new FormData();
        _self.axios.post(_self.ApiurlStorehouse + '/inventory/queryLevel01CategoryCode', formData3, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode = '0') {
            _self.options = response.data.data.list

          } else {
            _self.$message.error('品类找不到啦');
          }
        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试2');
        });
      },
      //选择供应商
      Supplierchange() {
        let _self = this;
        let formData3 = new FormData();
        formData3.append('pageNum', '1');
        formData3.append('pageSize', '1000');
        _self.axios.post(_self.ApiurlStorehouse + '/productManagement/getSupplierList', formData3, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode = '0') {
            _self.options4 = response.data.data.data.list

          } else {
            _self.$message.error('供应商找不到啦');
          }
        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试3');
        });
      },
      getdata() {
        let _self = this;
        var codes = _self.$route.query.tabledataDetail.code.substr(_self.$route.query.tabledataDetail.code.length - 4)
        _self.ruleForm.productionName = _self.$route.query.tabledataDetail.name;
        _self.ruleForm.CategoryName = _self.$route.query.tabledataDetail.level03_category_name;
        // _self.ruleForm.productionCode = codes;
        _self.ruleForm.barCode = _self.$route.query.tabledataDetail.bar_code;
        _self.ruleForm.providerName = _self.$route.query.tabledataDetail.provider_name;
        _self.ruleForm.CommoditySize = _self.$route.query.tabledataDetail.specification;
        _self.ruleForm.cost = _self.$route.query.tabledataDetail.cost;
        _self.ruleForm.price = _self.$route.query.tabledataDetail.price;
        _self.ruleForm.unit = _self.$route.query.tabledataDetail.unit;
        _self.ruleForm.shopteam2 = _self.$route.query.tabledataDetail.level02_category_name;
        _self.ruleForm.shoplei = _self.$route.query.tabledataDetail.category_name;
        _self.ruleForm.CommodityBrand = _self.$route.query.tabledataDetail.brand
        _self.idcode = _self.$route.query.tabledataDetail.id
      },
    },

    created: function() {
      let _self = this;
      _self.getcategory();
      _self.Supplierchange();
      _self.getdata();
    }
  }
</script>

<style>
  .app-contion {
    margin: 0.625rem;
  }

  .f-s {
    font-size: 1rem;
  }

  .mar-increased {
    margin: 1.25rem 1.25rem 0 0;
  }

  .footer-increased {
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 12.5rem;
    right: 0;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  }

  .btnbox-increased {
    margin: 0.9375rem;
  }

  .widsni {
    width: 30%;
    margin-left: 20%;
  }
</style>
