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
      </div>
    </div>

    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange"
      :height="tableHeight" border>

      <el-table-column prop="bar_code" label="商品条码">
      </el-table-column>
      <el-table-column prop="name" label="商品名称">
      </el-table-column>
      <el-table-column prop="cost" label="成本价">
      </el-table-column>
      <el-table-column prop="price" label="零售价">
      </el-table-column>
       <el-table-column prop="is_enabled" label="条码状态">
      </el-table-column>
      <el-table-column prop="provider_name" label="供应商">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button size="mini" type="danger" @click="SwitchEdit(scope.$index, scope.row)" v-if="scope.row.is_enabled=='已启用'">停用</el-button>
          <el-button size="mini" type="warning" @click="SwitchEdit(scope.$index, scope.row)" v-if="scope.row.is_enabled=='已暂停'">开启</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="position: fixed;bottom: 0.625rem;right: 0;">
      <el-pagination background layout="prev, pager, next" :total="total" @current-change="current_change">
      </el-pagination>
    </div>

    <!--编辑弹框-->
    <el-dialog title="" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <div class="title-box">
        <label class="titles w-30">商品名称：</label>
        <el-input v-model="shopname" style="width:50%;"></el-input>
      </div>

      <div class="title-box">
        <label class="titles w-30">一级品类：</label>
        <el-select v-model="shopteam" placeholder="请选择" style="width:50%;" filterable @change="founcs($event)">
          <el-option v-for="item in options" :key="item.level03_category_code" :label="item.level03_category_name"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <div class="title-box">
        <label class="titles w-30">二级品类：</label>
        <el-select v-model="shopteam2" placeholder="请选择" filterable style="width:50%;" @change="founcs2($event)">
          <el-option v-for="item in options4" :key="item.level02_category_code" :label="item.level02_category_name"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <div class="title-box">
        <label class="titles w-30">三级品类：</label>
        <el-select v-model="shoplei" placeholder="请选择" style="width:50%;" filterable @change="founcs3($event)">
          <el-option v-for="item in options3" :key="item.level01_category_code" :label="item.level01_category_name"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <div class="title-box">
        <label class="titles w-30">供应商名称：</label>
        <el-select v-model="providerName" :multiple='false' filterable allow-create default-first-option placeholder="请选择供应商名称"
          style='width: 50%;' @change="providerNamechange">
          <el-option v-for="item in providerNameoptions" :key="item.supplier_name" :label="item.supplier_name" :value="item">
          </el-option>
        </el-select>
      </div>
      <div class="title-box">
        <label class="titles w-30">商品编码：</label>
        <el-input v-model="shopcodes" placeholder="商品编码只能以‘4位数字’的形式填写" style="width:50%;" :disabled='display2==="none"'></el-input>
      </div>
      <div class="title-box">
        <label class="titles w-30">商品条形码：</label>
        <el-input v-model="barCode" placeholder="请输入商品条形码" style="width:50%;"></el-input>
      </div>

      <div class="title-box">
        <label class="titles w-30">成本价：</label>
        <el-input v-model="cost" placeholder="请输入成本价" style="width:50%;"></el-input>
      </div>
      <!-- end -->
      <div class="title-box">
        <label class="titles w-30">零售价：</label>
        <el-input v-model="shopmoney" placeholder="请输入原价" style="width:50%;"></el-input>
      </div>
      <div class="title-box">
        <label class="titles w-30">商品规格：</label>
        <el-input v-model="specifications" style="width:50%;"></el-input>
      </div>
      <div class="title-box">
        <label class="titles w-30">商品单位：</label>
        <el-input v-model="CommodityUnit" style="width:50%;"></el-input>
      </div>


      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleEditup">保 存</el-button>

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
        pageshow: true,

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
        providerNameoptions: [],
        isShelves: '',
        cost: '', //成本
        providerCode: '', //供应商编码
        providerName: '', //供应商名称
        dialogVisible: false,
        disableds: true,
        idcard: '',
        isShelvesup: '',
        brand: '',
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
        flag: false,

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
      //开关停用
      SwitchEdit(index) {
        let _self = this;
        var flags = '';
        if (_self.tableData[index].is_enabled == '已启用') {
          flags = '1';
        } else if (_self.tableData[index].is_enabled == '已暂停') {
          flags = '0';
        }
        let formData3 = new FormData();
        formData3.append('barCode', _self.tableData[index].bar_code);
        formData3.append('isEnbled', flags);
        _self.axios.post(_self.ApiurlStorehouse + '/productManagement/stopUsingBarcode', formData3, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode = '0') {
            _self.$message({
              message: '操作成功',
              type: 'success'
            });
             if (_self.indextab == '0') {
              _self.getdata();
            } else {
              _self.screen();
            }
          } else {
            console.log('操作失败，请刷新重试');
          }
        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试3');
        });
      },
      providerNamechange(Vid) {
        let _self = this;
        _self.providerCode = Vid.supplier_code //供应商编码
        _self.providerName = Vid.supplier_name //供应商名称
      },

      discountchanges(val, $event) {
        let _self = this;

        _self.discountType = val.label;
        _self.discountTypecode = val.value
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
            _self.providerNameoptions = response.data.data.data.list

          } else {
            console.log('供应商找不到啦');
          }
        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试3');
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

      handleEdit(index) {
        let _self = this;
        _self.dialogVisible = true;

        _self.picnew = ''
        _self.display2 = 'none';
        _self.editindex = index
        _self.shopname = _self.tableData[index].name;
        _self.shoppic = _self.tableData[index].pic_url;
        _self.shopcodes = _self.tableData[index].code;
        _self.shoplei = _self.tableData[index].category_name;
        _self.categoryCodes = _self.tableData[index].category_code;
        _self.categoryNames = _self.tableData[index].category_name;
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
        _self.idcard = _self.tableData[index].id
        _self.brand = _self.tableData[index].brand
        _self.disableds = true;
        if (_self.tableData[index].promotional_price_switch == 'Y') {
          _self.kaiguan = true
        } else {
          _self.kaiguan = false
        }

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
        _self.shopteam2 = '';
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
        if (_self.shopname == '' || _self.shopname == undefined || _self.categoryNames == '' || _self.CommodityUnit ==
          ''|| _self.providerName == '' || _self.barCode == '' || _self.providerName == null || _self.CommodityUnit ==
          null || _self.cost == null) {

          _self.$message({
            message: '请完善您的信息',
            type: 'warning'
          });
          return false;
        }

        let formData = new FormData();
        formData.append('productionName', _self.shopname);
        formData.append('categoryCode', _self.categoryCodes);
        formData.append('categoryName', _self.categoryNames);
        formData.append('picUrl', '');
        if (_self.specifications == null || _self.specifications == undefined) {
          formData.append('specification', '');
        } else {
          formData.append('specification', _self.specifications);
        }
        formData.append('barCode', _self.barCode);
        if (_self.CommodityUnit == null || _self.CommodityUnit == undefined) {
          formData.append('unit', '');
        } else {
          formData.append('unit', _self.CommodityUnit);
        }
        formData.append('cost', _self.cost);
        formData.append('price', _self.shopmoney);
        formData.append('providerCode', _self.providerCode);
        formData.append('providerName', _self.providerName);
        formData.append('id', _self.idcard);
        if (_self.brand == null) {
          formData.append('brand', '');
        } else {
          formData.append('brand', _self.brand);
        }

        formData.append('userId', _self.id);
        //发送请求
        _self.axios.post(_self.ApiurlStorehouse + '/productManagement/financialItemModification', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode == '0') {
            _self.kaiguan = false
            _self.dialogVisible = false
            _self.$message({
              message: '编辑成功',
              type: 'success'
            });
            if (_self.indextab == '0') {
              _self.getdata();
            } else {
              _self.screen();
            }



          } else if (response.data.errcode == '2') {
            _self.$message({
              message: '请完善您的信息',
              type: 'warning'
            });
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

        formData.append('pageNum', _self.currentPage);
        formData.append('pageSize', _self.pagesize);
        formData.append('barCode', _self.barcodes);
        formData.append('productionName', _self.code);
        formData.append('level01Name', _self.shopteam1);
        formData.append('level02Name', _self.shopteam22);
        formData.append('level03Name', _self.shoplei3);
        //发送请求
        _self.axios.post(_self.ApiurlStorehouse + '/productManagement/queryFinancialItemList', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode = '0') {
            _self.tableData = response.data.data.data.list;
            _self.total = response.data.data.data.total;
            _self.indextab = '1'
            for(var i=0;i<_self.tableData.length;i++){
              if(_self.tableData[i].is_enabled=='0'||_self.tableData[i].is_enabled==null){
                _self.tableData[i].is_enabled='已启用'
              }else{
                  _self.tableData[i].is_enabled='已暂停'
              }
            }
          } else {
            _self.$message.error('找不到商品品类了');
          }

        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试');
        });
      },


      getdata() {
        let _self = this;

        let formData = new FormData();

        formData.append('pageNum', _self.currentPage);
        formData.append('pageSize', _self.pagesize);

        _self.axios.post(_self.ApiurlStorehouse + '/productManagement/financialItemList', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode = '0') {
            _self.tableData = response.data.data.data.list
            _self.total = response.data.data.data.total
            _self.indextab = '0'
              for(var i=0;i<_self.tableData.length;i++){
                if(_self.tableData[i].is_enabled=='0'||_self.tableData[i].is_enabled==null){
                  _self.tableData[i].is_enabled='已启用'
                }else{
                    _self.tableData[i].is_enabled='已暂停'
                }
              }
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
          _self.getdata();
        } else {
          _self.screen();
        }

      },

    },
    created: function() {
      let _self = this;
      _self.getdata();
      _self.OneCategoryCode();
      _self.Supplierchange();
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
