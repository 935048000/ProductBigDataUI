<template>
  <div class="app-contion">

    <div class="searchBox" style="display: flex; flex-wrap:wrap ">
      <div class="ChooseStyles">
        <label class="titles">请输入条形码：</label>
        <el-input v-model="barcodes" placeholder="请输入内容" size="mini" style="width: 50%;"></el-input>
      </div>
      <div class="ChooseStyles">
        <label class="titles">请输入商品名：</label>
        <el-input v-model="code" placeholder="请输入内容" style="width: 50%;" size="mini"></el-input>
      </div>
      <div class="ChooseStyles">
        <label class="titles">一级品类：</label>
        <el-select v-model="shopteam1" size="mini" placeholder="请选择" filterable @change="founcs($event)">
          <el-option v-for="item in options" :key="item.level03_category_code" :label="item.level03_category_name"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <div class="ChooseStyles">
        <label class="titles">二级品类：</label>
        <el-select v-model="shopteam22" size="mini" placeholder="请选择" filterable @change="founcs2($event)">
          <el-option v-for="item in options4" :key="item.level02_category_code" :label="item.level02_category_name"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <div class="ChooseStyles">
        <label class="titles">三级品类：</label>
        <el-select v-model="shoplei3" size="mini" placeholder="请选择" filterable @change="founcs3($event)">
          <el-option v-for="item in options3" :key="item.level01_category_code" :label="item.level01_category_name"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <div class="ChooseStyles" style="margin-left: 0.625rem;">
        <el-button type="primary" size="mini" @click='screen'>查找</el-button>
       <!-- <el-button type="success" size='mini' @click="add" v-if="flag===true">新增商品</el-button> -->
      </div>
    </div>

    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange"
      :height="tableHeight" border>
      <!-- <el-table-column type="selection">
			</el-table-column> -->
      <!-- <el-table-column label="商品图">
				<template slot-scope="scope">
					<div class="images">
						<img :src="scope.row.pic_url" />
					</div>
				</template>
			</el-table-column> -->
      <el-table-column prop="bar_code" label="商品条码">
      </el-table-column>
      <el-table-column prop="name" label="商品名称">
      </el-table-column>
      <el-table-column prop="price" label="统一售价">
      </el-table-column>
      <el-table-column label="促销价">
        <template slot-scope="scope">
          <span v-if="scope.row.promotional_price_switch=== ''" style="color: #A6A9AD;">无</span>
          <span v-if="scope.row.promotional_price_switch!= ''">{{scope.row.promotional_price}}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column prop="salesCount" label="总销量">
			</el-table-column> -->

      <!-- <el-table-column prop="create_at" label="创建时间">
			</el-table-column> -->
      <!-- <el-table-column prop="production_code" label="商品编码">
			</el-table-column> -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">改价</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <div class="footers">

			<el-button style="padding: 6px 25px;" @click='upAndDownCommodity'>{{changeup}}</el-button>
		</div> -->
    <div style="position: fixed;bottom: 0.625rem;right: 0;" >
      <el-pagination background layout="prev, pager, next"   :total="total"
        @current-change="current_change">
      </el-pagination>
    </div>

    <!--编辑弹框-->
    <el-dialog title="" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <div class="title-box">
        <label class="titles w-30">商品名称：</label>
        <el-input v-model="shopname" placeholder="请输入内容" style="width:50%;" :disabled='display2==="none"'></el-input>
      </div>
      <!-- <div class="title-box" style="display: flex;flex-wrap: wrap;">
				<label class="titles w-30">商品图片：</label>

				<div style="width: 15%;">
					<img :src="picnew" style="width:100%;" v-if="shoppic==''">
					<img :src="shoppic" style="width:100%;" v-if="picnew==''">
				</div>
				<el-input placeholder="请输入图片本地地址并点击提交" v-model="shoppic" style="width:50%;margin-left: 22%;" disabled class="input-with-select">
					<el-button slot="append" icon="el-icon-search" @click='picClicks' :loading="loading" disabled>提交</el-button>
				</el-input>
				<p style="font-size: 12px; color: red;width: 100%;margin-left: 22%;margin-top: 10px;">请输入图片本地地址并点击提交</p>

			</div> -->

      <div class="title-box">
        <label class="titles w-30">一级品类：</label>
        <el-select v-model="shopteam" placeholder="请选择" style="width:50%;" filterable @change="founcs($event)"
          :disabled='display2==="none"'>
          <el-option v-for="item in options" :key="item.level03_category_code" :label="item.level03_category_name"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <div class="title-box">
        <label class="titles w-30">二级品类：</label>
        <el-select v-model="shopteam2" placeholder="请选择" filterable style="width:50%;" @change="founcs2($event)"
          :disabled='display2==="none"'>
          <el-option v-for="item in options4" :key="item.level02_category_code" :label="item.level02_category_name"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <div class="title-box">
        <label class="titles w-30">三级品类：</label>
        <el-select v-model="shoplei" placeholder="请选择" style="width:50%;" filterable @change="founcs3($event)"
          :disabled='display2==="none"'>
          <el-option v-for="item in options3" :key="item.level01_category_code" :label="item.level01_category_name"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <div class="title-box">
        <label class="titles w-30">商品编码：</label>
        <el-input v-model="shopcodes" placeholder="商品编码只能以‘4位数字’的形式填写" style="width:50%;" :disabled='display2==="none"'></el-input>
      </div>
      <div class="title-box">
        <label class="titles w-30">商品条形码：</label>
        <el-input v-model="barCode" placeholder="请输入商品条形码" style="width:50%;" :disabled='display2==="none"'></el-input>
      </div>
      <!-- start -->
      <div class="title-box">
        <label class="titles w-30">供应商名称：</label>
        <el-input v-model="providerName " placeholder="请输入供应商名称" style="width:50%;" :disabled='display2==="none"'></el-input>
      </div>
      <div class="title-box">
        <label class="titles w-30">供应商名编码：</label>
        <el-input v-model="providerCode" placeholder="请输入供应商名编码" style="width:50%;" :disabled='display2==="none"'></el-input>
      </div>
      <div class="title-box">
        <label class="titles w-30">成本价：</label>
        <el-input v-model="cost" placeholder="请输入成本价" style="width:50%;" :disabled='display2==="none"'></el-input>
      </div>
      <!-- end -->
      <div class="title-box">
        <label class="titles w-30">商品原价：</label>
        <el-input v-model="shopmoney" placeholder="请输入原价" style="width:50%;" :disabled='display2==="none"'></el-input>
      </div>
      <div class="title-box">
        <label class="titles w-30">商品规格：</label>
        <el-input v-model="specifications" placeholder="请输入商品规格" style="width:50%;" :disabled='display2==="none"'></el-input>
      </div>
      <div class="title-box">
        <label class="titles w-30">商品单位：</label>
        <el-input v-model="CommodityUnit" placeholder="请输入商品单位" style="width:50%;" :disabled='display2==="none"'></el-input>
      </div>
      <div v-if='display2==="none"'>
        <div style="margin-top: 0.625rem;margin-bottom: 0.625rem;">
          <label class="titles w-30">是否启用促销价：</label>
          <el-switch v-model="kaiguan" active-color="#13ce66" inactive-color="#ff4949" active-text="开启" inactive-text="关闭">
          </el-switch>
        </div>
        <p style="font-size: 0.75rem; color: red;margin-top: 0.625rem;margin-bottom: 0.625rem;margin-left: 22%;">修改时，促销类型和促销价格必填！</p>
        <div style="margin-top: 0.625rem;margin-bottom: 0.625rem;">
          <label class="titles w-30">促销类型：</label>
          <el-select v-model="discountType" placeholder="请选择" @change='discountchanges($event)'>
            <el-option v-for="item in discountTypeoptions" :key="item.value" :label="item.label" :value="item">
            </el-option>
          </el-select>
        </div>
        <div>
          <label class="titles w-30">促销价格：</label>
          <el-input v-model="promotionalPrice" placeholder="请输入内容" style="width:50%;"></el-input>
        </div>
      </div>
      <!-- <div class="btn-box">
				<el-checkbox-group v-model="checked" :min="0" :max="1">
					<el-checkbox label="上架" border></el-checkbox>
					<el-checkbox label="下架" border></el-checkbox>
				</el-checkbox-group>
			</div> -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleEditup" v-bind:style="{ display: display1 }">保 存</el-button>
        <el-button type="primary" @click="addup" v-bind:style="{ display: display2 }">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    mapState
  } from 'vuex';


  import {
    getLodop,
    needCLodop
  } from '../../vuex/LodopFuncs.js'
  export default {
    data() {
      return {
        checked: ['上架'],
        avatar: '',
        discountType: '',
        pageshow:true,
        promotionalPrice: '',
        shopname: '',
        discountTypeoptions: [{
          value: 'inner_price',
          label: '员工价'
        }, {
          value: 'inner_disccount',
          label: '内部折扣'
        }, {
          value: 'promotion',
          label: '促销价'
        }],
        shoppic: '',
        barcodes: '', //商品条码
        shopcodes: '',
        shoplei: '',
        barCode: '', //商品条形码
        shopmoney: '',
        shopteam: '',
        tableData: [],
        multipleSelection: [],
        total: 10,
        currentPage: 1,
        pagesize: 10,
        code: '',
        classify: '',
        options: [],
        options2: [],
        options3: [],
        options4: [],
        isShelves: '',
        cost: '', //成本
        providerCode: '', //供应商编码
        providerName: '', //供应商名称
        dialogVisible: false,
        disableds: true,
        changeup: '下架',
        isShelvesup: '',
        display1: 'none',
        display2: 'none',
        shopteam2: '',
        categoryCodes: '',
        categoryNames: '',
        dialogVisible2: false,
        editindex: '',
        picnew: '',
        loading: false,
        indextab: '0',
        tableHeight: window.innerHeight - 240,
        kaiguan: false,
        shopteam1: '',
        shopteam22: '',
        shoplei3: '',
        Promotionrecord: '',
        discountTypecode: '',
        specifications: '',
        CommodityUnit: '',
        flag: false
      }
    },
    computed: {
      ...mapState({
        username: state => state.userinfo.account,
        token: state => state.userinfo.token,
        id: state => state.userinfo.id,
        shopcode: state => state.userinfo.shopcode,
        ArrayList: state => state.ArrayList
      })
    },
    methods: {
      discountchanges(val, $event) {
        let _self = this;

        _self.discountType = val.label;
        _self.discountTypecode = val.value
      },
      picClicks() {
        let _self = this;
        _self.loading = true
        _self.$notify({
          title: '提示',
          message: '请等待图片上传成功后再保存'
        });
        let formData = new FormData();
        formData.append('shopCode', _self.shopcode);
        formData.append('picUrl', _self.shoppic);
        _self.axios.post(_self.ApiUrl + '/aliyun/util/uploadPic', formData).then(response => {
          console.log(response.data.data.url)
          if (response.data.code == '200') {
            _self.picnew = response.data.data.url
            _self.loading = false
            _self.$message({
              message: '上传图片成功',
              type: 'success'
            });
          } else {
            _self.$message.error('上传图片失败');
          }
        }).catch(function(error) {
          _self.$message.error('数据错误');
        });
      },
      changeImage(e) {

        var file = e.target.files[0]
        var pic = e.target.value

        var reader = new FileReader()
        var _self = this

        reader.readAsDataURL(file)
        reader.onload = function(e) {

          _self.shoppic = this.result
          var a = document.getElementById('uppic').value

          let formData = new FormData();
          formData.append('shopCode', _self.shopcode);
          formData.append('picUrl', a);
          _self.axios.post(_self.ApiUrl + '/aliyun/util/uploadPic', formData).then(response => {

          }).catch(function(error) {
            _self.$message.error('数据错误');
          });
        }
      },
      preview() {
        let _self = this;
        let formData = new FormData();
        formData.append('shopCode', _self.shopcode);
        formData.append('picUrl', '');
        _self.axios.post('http://localhost:8084/aliyun/util/uploadPic', formData).then(response => {

        }).catch(function(error) {
          _self.$message.error('数据错误');
        });
      },

      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        let _self = this;
        _self.multipleSelection = val;

      },
      //上下架
      upAndDownCommodity() {
        let _self = this;
        console.log(_self.multipleSelection)
        var productionRrr = [];
        for (var i = 0; i < _self.multipleSelection.length; i++) {
          productionRrr.push(_self.multipleSelection[i].production_code)
        }
        var states = '';
        if (_self.isShelvesup == 'Y') {

          states = 1
        } else {
          states = 0
        }
        console.log(productionRrr)
        let formData = new FormData();
        formData.append('shopCode', _self.shopcode);
        formData.append('productionCode', productionRrr);
        formData.append('state', states);

        //发送请求
        _self.axios.post(_self.ApiUrl + '/commodity/upAndDownCommodity', formData).then(response => {
          console.log(response)
          if (response.data.errcode = '0') {
            if (states == '0') {
              _self.$message({
                message: '已成功上架',
                type: 'success'
              });
              _self.undercarriage();

            } else {
              _self.$message({
                message: '已成功下架',
                type: 'success'
              });
              _self.getdata();
            }


          } else {
            _self.$message.error('数据错误');
          }


        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试');
        });
      },
      add() {
        let _self = this;
        _self.dialogVisible = true;
        _self.disableds = false;
        _self.display1 = 'none';
        _self.display2 = 'block';
        _self.shopname = '';
        _self.shoppic = '';
        _self.shopcodes = '';
        _self.shoplei = '';
        _self.shopteam = '';
        _self.shopmoney = '';
        _self.shopteam2 = '';
        _self.picnew = ''
        _self.specifications = '';
        _self.CommodityUnit = '';
        _self.barCode = '';
        _self.kaiguan = false
        _self.promotionalPrice = '';
        _self.discountType = '';
        _self.cost = '';
        _self.providerCode = '';
        _self.providerName = '';
        let formData3 = new FormData();
        _self.axios.post(_self.ApiurlStorehouse + '/inventory/queryLevel01CategoryCode', formData3, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode = '0') {
            _self.options = response.data.data.list

          } else {
            _self.$message.error('数据错误');
          }
        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试');
        });
      },
      founcs2(val, $event) {
        let _self = this
        _self.shopteam2 = val.level02_category_name
        _self.shopteam22 = val.level02_category_name
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
            _self.$message.error('数据找不到啦');
          }
        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试');
        });
      },
      founcs3(val, $event) {
        let _self = this
        _self.categoryCodes = val.level01_category_code
        _self.categoryNames = val.level01_category_name
        _self.shoplei = val.level01_category_name
        _self.shoplei3 = val.level01_category_name
      },
      //新增提交
      addup() {
        let _self = this;
        // if (_self.checked[0] == '上架') {
        // 	_self.isShelves = 'Y'
        // } else {
        // 	_self.isShelves = 'N'
        // }
        var regu = "^[0-9]{4}$";
        var re = new RegExp(regu);
        if (_self.shopname == '' || _self.shopcodes == '' || _self.shoplei == '' || _self.shopteam == '' || _self.CommodityUnit ==
          '' || _self.specifications == '' || _self.shopmoney ==
          '' || _self.cost == '' || _self.providerCode == '' || _self.providerName == '') {
          _self.$message({
            type: 'warning',
            message: '请把信息填写完整',
            duration: 10000,
            showClose: true,
          })

          return false
        }
        if (!re.test(_self.shopcodes)) {
          _self.$message({
            type: 'warning',
            message: '商品编码为四位数字形式 ',
            duration: 10000,
            showClose: true,
          })
          return false
        }

        // if (_self.kaiguan == true) {
        // 	var promotional = 'Y'
        // 	if (_self.promotionalPrice == '' || _self.discountType == '') {
        // 		_self.$message({
        // 			type: 'warning',
        // 			message: '当开启促销价开关时，促销类型和促销价格必填！',
        // 			duration: 10000,
        // 			showClose: true,
        // 		})
        // 		return false
        // 	}
        // } else {
        // 	var promotional = 'N'
        //
        // 	_self.promotionalPrice = ''
        // 	_self.discountType = ''
        // }
        let formData = new FormData();
        formData.append('productionName', _self.shopname);
        if (_self.picnew == '') {
          formData.append('picUrl', _self.shoppic);
        } else {
          formData.append('picUrl', _self.picnew);
        }
        formData.append('productionCode', _self.categoryCodes + _self.shopcodes);
        formData.append('categoryName', _self.categoryNames); //类里边的categoryName
        formData.append('categoryCode', _self.categoryCodes); //品类里边的categoryCode
        formData.append('price', _self.shopmoney);
        formData.append('specification', _self.specifications);
        formData.append('unit', _self.CommodityUnit);
        formData.append('barCode', _self.barCode);
        formData.append('cost', _self.cost);
        formData.append('providerCode', _self.providerCode);
        formData.append('providerName', _self.providerName);
        //发送请求

        _self.axios.post(_self.ApiUrl + '/resales/addResalesProduction', formData).then(response => {

          if (response.data.errcode == '0') {
            _self.dialogVisible = false
            _self.kaiguan = false
            _self.$message({
              message: '新增成功',
              type: 'success'
            });
            if (_self.isShelves = 'Y') {

              _self.getdata();
            } else {
              _self.undercarriage();
            }

          } else if (response.data.errcode == '2') {
            _self.$message.error('参数不全，请重新填写');
          } else {
            _self.$message.error(response.data.errmsg);
          }


        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试');
        });
      },
      handleEdit(index) {
        let _self = this;
        _self.dialogVisible = true;
        _self.display1 = 'block';
        _self.picnew = ''
        _self.display2 = 'none';
        _self.editindex = index
        _self.shopname = _self.tableData[index].name;
        _self.shoppic = _self.tableData[index].pic_url;
        _self.shopcodes = _self.tableData[index].production_code;
        _self.shoplei = _self.tableData[index].level01_category_name;
        _self.shopteam = _self.tableData[index].level03_category_name;
        _self.shopteam2 = _self.tableData[index].level02_category_name;
        _self.shopmoney = _self.tableData[index].price;
        _self.barCode = _self.tableData[index].bar_code;
        _self.Promotionrecord = _self.tableData[index].promotional_price_switch;
        _self.specifications = _self.tableData[index].specification;
        _self.CommodityUnit = _self.tableData[index].unit;
        _self.cost = _self.tableData[index].cost;
        _self.providerCode = _self.tableData[index].provider_code;
        _self.providerName = _self.tableData[index].provider_name;
        _self.disableds = true;
        if (_self.tableData[index].promotional_price_switch == 'Y') {
          _self.kaiguan = true
        } else {
          _self.kaiguan = false
        }
        _self.promotionalPrice = _self.tableData[index].promotional_price;
        _self.discountTypecode = _self.tableData[index].discount_type;
        if (_self.tableData[index].discount_type == 'inner_price') {
          _self.discountType = '员工价'
        } else if (_self.tableData[index].discount_type == 'inner_disccount') {
          _self.discountType = '内部折扣'
        } else if (_self.tableData[index].discount_type == 'promotion') {
          _self.discountType = '促销价'
        } else {
          _self.discountType = ''
        }
        let formData3 = new FormData();
        _self.axios.post(_self.ApiurlStorehouse + '/inventory/queryLevel01CategoryCode', formData3, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode = '0') {

            _self.options = response.data.data.list
          } else {
            _self.$message.error('数据找不到啦');
          }


        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试');
        });

      },
      //一级品类
      OneCategoryCode() {
        let _self = this;
        let formData3 = new FormData();
        _self.axios.post(_self.ApiurlStorehouse + '/inventory/queryLevel01CategoryCode', formData3, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode = '0') {

            _self.options = response.data.data.list
          } else {
            _self.$message.error('数据找不到啦');
          }


        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试');
        });
      },
      founcs(vId, $event) {
        let _self = this;
        _self.shopteam = vId.level03_category_name;
        _self.shopteam1 = vId.level03_category_name;
        _self.shopteam2='';
        _self.shoplei = '';
        let formDatamb = new FormData();
        formDatamb.append('level03CategoryCode', vId.level03_category_code);
        //发送请求
        _self.axios.post(_self.ApiurlStorehouse + '/inventory/queryLevel02CategoryCode', formDatamb, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode = '0') {
            _self.options4 = response.data.data.list

          } else {
            _self.$message.error('数据找不到啦');
          }
        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试');
        });
      },
      handleEditup() {
        let _self = this;

        // if (_self.checked[0] == '上架') {
        // 	_self.isShelves = 'Y'
        // } else {
        // 	_self.isShelves = 'N'
        // }

//         if (_self.shopname == '' || _self.shopcodes == '' || _self.shoplei == '' || _self.shopteam == '' || _self.shopmoney ==
//           '') {
//           _self.$message({
//             type: 'warning',
//             message: '请把信息填写完整',
//             duration: 10000,
//             showClose: true,
//           })
//
//           return false
//         }
        if (_self.kaiguan == true) {
          var promotional = 'Y'
          if (_self.promotionalPrice == '' || _self.discountType == '' || _self.promotionalPrice == null || (_self.promotionalPrice
              .length > 0 && _self.promotionalPrice.trim().length == 0)) {
            _self.$message({
              type: 'warning',
              message: '当开启促销价开关时，促销类型和促销价格必填！',
              duration: 10000,
              showClose: true,
            })
            return false
          }
        } else {
          if (_self.promotionalPrice == '' || _self.discountType == '' || _self.promotionalPrice == null || (_self.promotionalPrice
              .length > 0 && _self.promotionalPrice.trim().length == 0)) {
            _self.$message({
              type: 'warning',
              message: '修改时，促销类型和促销价格必填！',
              duration: 10000,
              showClose: true,
            })
            return false
          }
        }

        let formData = new FormData();
        formData.append('shopCode', _self.shopcode);
        formData.append('productionCode', _self.shopcodes);
        formData.append('categoryCode', _self.tableData[_self.editindex].category_code);
        if (_self.kaiguan == true) {
          var kaiguans = 'Y'
        } else {
          var kaiguans = 'N'
        }
        formData.append('promotionalPriceState', kaiguans);
        formData.append('promotionalPrice', _self.promotionalPrice);
        formData.append('discountType', _self.discountTypecode);
        //发送请求
        _self.axios.post(_self.ApiUrl + '/resales/addResalesCommodity', formData).then(response => {

          if (response.data.errcode == '0') {
            _self.kaiguan = false
            _self.dialogVisible = false
            _self.$message({
              message: '编辑成功',
              type: 'success'
            });

            if (_self.indextab == '0') {
              _self.getdata();
              _self.shopname = '';
              _self.shoppic = '';
              _self.shopcodes = '';
              _self.shoplei = '';
              _self.shopteam = '';
              _self.shopmoney = '';
              _self.shopteam1 = '';
              _self.barCode = '';
            } else {
              _self.screen2();
               _self.shopname = '';
              _self.shoppic = '';
              _self.shopteam1='';
              _self.shopcodes = '';
              _self.shoplei = '';
              _self.shopteam = '';
              _self.shopmoney = '';
              _self.barCode = '';
            }


          } else {
            _self.$message.error(response.data.errmsg);
          }


        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试');
        });



      },
      //筛选
      screen() {
        let _self = this;
        // _self.currentPage = 1
        if (_self.barcodes == '' && _self.code == '' && _self.shopteam == '' && _self.shopteam22 == '' && _self.shoplei3 ==
          '') {
          _self.$message({
            message: '您还什么都没有输入哦！',
            type: 'warning'
          });
          return false
        }
        let formData = new FormData();
        formData.append('shopCode', _self.shopcode);

        formData.append('pageNum', _self.currentPage);
        formData.append('pageSize', _self.pagesize);
        formData.append('barCode', _self.barcodes);
        formData.append('productionName', _self.code);
        formData.append('level01Name', _self.shopteam1);
        formData.append('level02Name', _self.shopteam22);
        formData.append('level03Name', _self.shoplei3);
        //发送请求
        _self.axios.post(_self.ApiUrl + '/resales/resalesQueryCommodity', formData).then(response => {

          if (response.data.errcode = '0') {
            _self.tableData = response.data.data.data.list;
            _self.total = response.data.data.data.total;
            _self.indextab = '1'
          } else {
            _self.$message.error('找不到商品品类了');
          }

        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试');
        });
      },
      //筛选
      screen2() {
        let _self = this;

        if (_self.barcodes == '' && _self.code == '' && _self.shopteam == '' && _self.shopteam22 == '' && _self.shoplei3 ==
          '') {
          _self.$message({
            message: '您还什么都没有输入哦！',
            type: 'warning'
          });
          return false
        }

        let formData = new FormData();
        formData.append('shopCode', _self.shopcode);
        formData.append('pageNum', _self.currentPage);
        formData.append('pageSize', _self.pagesize);
        formData.append('barCode', _self.barcodes);
        formData.append('productionName', _self.code);
        formData.append('level01Name', _self.shopteam1);
        formData.append('level02Name', _self.shopteam22);
        formData.append('level03Name', _self.shoplei3);
        //发送请求
        _self.axios.post(_self.ApiUrl + '/resales/resalesQueryCommodity', formData).then(response => {

          if (response.data.errcode = '0') {
            _self.tableData = response.data.data.data.list;
            _self.total = response.data.data.data.total;
            _self.indextab = '1'
          } else {
            _self.$message.error('找不到商品品类了');
          }

        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试');
        });
      },
      //上架商品
      getdata() {
        let _self = this;
        _self.isShelvesup = 'Y'
        for (var i = 0; i < _self.ArrayList.length; i++) {
          if (_self.ArrayList[i].role == 'SUPPLY-CHAIN') {
            _self.flag = true
          }
        }
        let formData = new FormData();
        formData.append('shopCode', _self.shopcode);
        formData.append('pageNum', _self.currentPage);
        formData.append('pageSize', _self.pagesize);
        //formData.append('state', _self.isShelvesup);
        //发送请求
        _self.axios.post(_self.ApiUrl + '/resales/resalesCommodityLists', formData).then(response => {

          if (response.data.errcode = '0') {
            _self.tableData = response.data.data.data.list
            _self.total = response.data.data.data.total
            _self.indextab = '0'
            //发送请求
//             _self.axios.post(_self.ApiUrl + '/commodity/chooseLevelOneCategoryCode').then(response => {
//
//               if (response.data.errcode = '0') {
//
//                 _self.options2 = response.data.data.list
//               } else {
//                 _self.$message.error('找不到商品品类了');
//               }
//
//             }).catch(function(error) {
//               _self.$message.error('响应时间过长，请重试');
//             });
            //发送请求
            _self.changeup = "下架"
          } else {
            _self.$message.error('数据错误');
          }


        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试');
        });
      },

      current_change: function(currentPage) {
        let _self = this;
        _self.currentPage = currentPage;

        if (_self.indextab == '0') {
          _self.isShelvesup = 'Y'
          let formData = new FormData();
          formData.append('shopCode', _self.shopcode);
          formData.append('pageNum', _self.currentPage);
          formData.append('pageSize', _self.pagesize);
          //formData.append('state', _self.isShelvesup);
          //发送请求
          _self.axios.post(_self.ApiUrl + '/resales/resalesCommodityLists', formData).then(response => {

            if (response.data.errcode = '0') {
              _self.tableData = response.data.data.data.list
              _self.total = response.data.data.data.total
              _self.indextab = '0'
              //发送请求
//               _self.axios.post(_self.ApiUrl + '/commodity/chooseLevelOneCategoryCode').then(response => {
//
//                 if (response.data.errcode = '0') {
//
//                   _self.options2 = response.data.data.list
//                 } else {
//                   _self.$message.error('找不到商品品类了');
//                 }
//
//               }).catch(function(error) {
//                 _self.$message.error('响应时间过长，请重试');
//               });
              //发送请求
              _self.changeup = "下架"
            } else {
              _self.$message.error('数据找不到啦');
            }


          }).catch(function(error) {
            _self.$message.error('响应时间过长，请重试');
          });
        } else {

          let formData = new FormData();
          formData.append('shopCode', _self.shopcode);
          formData.append('pageNum', _self.currentPage);
          formData.append('pageSize', _self.pagesize);
          formData.append('barCode', _self.barcodes);
          formData.append('productionName', _self.code);
          formData.append('level01Name', _self.shopteam);
          formData.append('level02Name', _self.shopteam22);
          formData.append('level03Name', _self.shoplei3);
          //发送请求
          _self.axios.post(_self.ApiUrl + '/resales/resalesQueryCommodity', formData).then(response => {

            if (response.data.errcode = '0') {
              _self.tableData = response.data.data.data.list;
              _self.total = response.data.data.data.total;
              _self.indextab = '1'
            } else {
              _self.$message.error('找不到商品品类了');
            }

          }).catch(function(error) {
            _self.$message.error('响应时间过长，请重试');
          });
        }

      },

    },
    created: function() {
      let _self = this;
      _self.getdata();
      _self.OneCategoryCode();
    }
  }
</script>
<style>
  .searchBox {
    padding: 0.625rem 0;

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
