<template>
	<div style="background: #f2f2f2;overflow: hidden;">
		<div class="app-contion" style="overflow: hidden;height: 100%;display: flex;">

			<!-- 菜品 -->

			<div style="width: 60%;background: #FFFFFF;height: 100%;border-radius: 0.625rem;padding: 0.3125rem;">

				<div class="pinlei-box">
					<div style="width: 100%;">
						<span :class="{'border-color':clicked2==index}" :style="{backgroundColor:sstt[index]}" v-for='(item,index) in category'
						 :key="item.categoryName" @click="handleClick(index,item)">{{item.categoryName}}</span>
					</div>

					<!-- 品类分页 -->
					<el-pagination background layout="prev,next" :total="totalpinlei" :page-size='pagesizes1' @current-change="pinleicuurent"
					 class='pinlei-fenye'>
					</el-pagination>
				</div>

				<div class="fenlei-box">
					<div v-for="(good,index) in type0Goods" :key="good.productionName" class="fenle-child">
						<span :class="{'border-color':clickeds==index}" v-if="good.state=='上新产品'" @click="checkinlist(index)">
							<i class="cainame">{{good.productionName}}</i>

							<i class="fenlei-i fenlei-money">￥{{good.price}}元</i>

						</span>
						<span :class="{'border-color':clickeds==index}" @click="xiajiatop" v-else>{{good.productionName}}
							<i class="fenlei-i">￥{{good.price}}元</i>
						</span>

					</div>
				</div>

				<div class="page-break">
					<ul class="page-ul">
						<li v-if="cur>1">
							<a v-on:click="cur--,pageClick()" class="el-icon-arrow-left"></a>
						</li>
						<li v-if="cur==1">
							<a class="banclick el-icon-arrow-left"></a>
						</li>
						<li v-for="item in indexs" v-bind:class="{'active':cur==item}">
							<a v-on:click="btnClick(item), pageClick()" style="font-size: 1.125rem;">{{item}}</a>
						</li>
						<li v-if="cur!=all">
							<a v-on:click="cur++,pageClick()" class="el-icon-arrow-right"></a>
						</li>
						<li v-if="cur==all">
							<a class="banclick el-icon-arrow-right"></a>
						</li>
						<!--<li><a>共<i>{{all}}</i>页</a></li>-->
						<div class="clear"></div>
					</ul>
				</div>

			</div>
			<!-- </el-tab-pane>
		</el-tabs> -->
			<!-- 底部菜单 -->
			<div class="footerbus" style="border-radius: 0.625rem">
				<!-- 菜单 -->
				<el-table ref="table" :data="addmenu" border :height="tableHeight" class='medatwidth' :header-cell-style="tableHeaderColor">
					<el-table-column prop="productionName" label="商品名称">
					</el-table-column>
					<el-table-column prop="productionSizes" label="商品单价">
					</el-table-column>
					<el-table-column prop="payment" label="实际总价">

					</el-table-column>
					<el-table-column label="商品数量" fixed="right" width="130">
						<template slot-scope="scope">
							<el-button @click="cuts((scope.$index, scope.row))" class="adds" :loading="loadings2">-</el-button>
							<span style="width: 20px;display: inline-block;text-align: center;">{{scope.row.amount}}</span>
							<el-button @click="add((scope.$index, scope.row))" class="adds" :loading="loadings">+</el-button>
						</template>
					</el-table-column>
				</el-table>
				<div>
					<!-- <el-button type="primary" plain @click='check' class="check" style="width: 97%;">下单</el-button> -->
					<div style="font-size: 17px;float: right;margin: 0.3125rem 0;">
						总价：
						<!-- <span style="color: #A52A2A;font-size: 16px;" v-if="moneyzhe!=''">{{moneyzhe}}元</span> -->
						<span style="color: #ff545a;font-size: 21px;">{{allmenudatemoney}}元</span>

					</div>
					<div style="clear: both;"></div>
					<el-button style='width:100%' @click="updatesn">提交</el-button>
				</div>
				<!-- <el-tree :data="data" :empty-text='name' :props="defaultProps"></el-tree> -->
				<p style='font-size:16px;'>已点菜品：</p>
				<el-table :data="tableData2" :height="tableHeight2" border style="width: 100%">
					<el-table-column prop="name" label="菜品名">
					</el-table-column>
					<el-table-column prop="promotional_price" label="菜品单价">
					</el-table-column>
					<el-table-column prop="orderAmount" label="菜品数量">
					</el-table-column>
					<el-table-column prop="actual_amount" label="小计">
					</el-table-column>

				</el-table>

			</div>
			<!-- 弹框 添加购物车-->
			<el-dialog :title="production.productionName" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
				<div class="flower">
					<div class="guige-title">规格</div>
					<span :class="{'border-color':clicked==index}" v-for="(item,index) in production.productionSizes" :key="item.size"
					 @click="prosize(index)">{{item.size}}</span>
					<span style="border: 2px solid red;" v-if="production.productionSizes==null">默认</span>
					<div class="guige-title">常用备注</div>
					<span :class="{'border-color':clickeds2==index}" v-for="(item,index) in commentsGroup" :key="item.value" @click="procoment(index)">{{item.value}}</span>
					<span style="border: 2px solid red;" v-if="commentsGroup==null">默认</span>
					<div class="guige-title">请选择价格</div>
					<span :class="{'border-color':clickedmoney==index}" v-for="(item,index) in arrlist" :key="item" @click="pricelistclick(index)">{{item.name}}
						<i style="color: red;margin-left: 5px;font-style: normal;">{{item.price}}元</i> </span>
					<!-- <span style="border: 1px solid #409EFF;" v-if="production.pricelist==null">原价</span> -->
					<div class="tan-price">￥{{price}}元</div>
					<div class="guige-title">备注</div>
					<el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="textarea">
					</el-input>

				</div>
				<span slot="footer" class="dialog-footer">
					<el-button @click='quxiao'>取 消</el-button>
					<el-button type="primary" @click="addmenus(tab)">添 加</el-button>
				</span>
			</el-dialog>

		</div>
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
		computed: {
			...mapState({
				username: state => state.userinfo.account,
				token: state => state.userinfo.token,
				shopcode: state => state.userinfo.shopcode,
				id: state => state.userinfo.id,
				profilesettlement: state => state.ShopName.profile_settlement,
				profilequeuetype: state => state.ShopName.profile_queue_type,
				ShopName: state => state.ShopName.shopName
			}),
			indexs() {
				var left = 1;
				var right = this.all;
				var arr = [];

				while (left <= right) {
					arr.push(left);
					left++;
				}
				return arr;
			}
		},
		data() {
			return {
				inputShow: {
					value: '0'
				},
				tableData2: [],
				activeName: 'first',
				zhuosum: '',
				namecode: '',
				sstt: [
					"#e99f78",
					"#dcb148",
					"#dfd870",
					"#ecefc0",
					"#e0ef88",
					"#fd8787",
					"#ace1b5",
					"#a5edec",
					"#94beee",
					"#ef6ec0",
					"#f5bfe1",
					"#69cceb",
					"#ebb1c7",
					"#dfa5a3",
					"#e3934c",
					"#edb373",
					"#e7e4ad",
					"#b1d476",
					"#eaf1cf",
					"#c7edd4",
					"#c4daf2",
					"#e1bde3",
					"#ecd7e8",
					"#fbae46",

				],
				totalpinlei: 0,
				pagesizes1: 12,
				currentPages: 1,
				menudate: [],
				allmenudatemoney: 0,
				type0Goods: [],
				checkList: [],
				category: [],
				ins: '',
				guige: '',
				productionSizes: '',
				production: [],
				dialogVisible: false,
				clicked: -1,
				clickeds: -1,
				paymentall: '',
				clicked2: -1,
				goodslist: [],
				clicked3: -1,
				clickeds2: -1,
				clickedmoney: 0,
				textarea: '',
				price: '',
				isShow: false,
				height: '600',
				code: '',
				cur: 1,
				pageSize: 10,
				all: 1,
				typelist: 'AIX_GA',
				serialnum: '',
				indexdiscount: '0',
				loadings: false,
				loadings2: false,
				commentsGroup: [],
				arrlist: [],
				codename: '',
				names: '',
				addmenu: [],
				godetailnum: '',
				data: [{
					label: '已点菜品',
					children: []
				}],
				tableHeight: window.innerHeight - 150,
				tableHeight2: window.innerHeight - 500,
				defaultProps: {
					children: 'children',
					label: 'label'
				}
			}
		},

		components: {
			'input-box': {
				props: ['inputShow'],
				computed: {
					value: function() {
						return this.inputShow.value
					}
				},
				template: '<input id="input-box" type="text" size="21" maxlength="21" v-model="value" readonly="readonly">'
			},
			'btn-list': {
				template: '<div id="btn-list"><slot></slot></div>'
			}
		},

		methods: {
			//打印
			print(goodslist) {
				let _self = this;
				var qs = require('qs');
				let formDataprinter = new FormData();
				formDataprinter.append('shopCode', _self.shopcode);
				//发送请求
				_self.axios.post(_self.ApiUrls + '/printer/choosePrinter', formDataprinter, {
					// 单独配置
					withCredentials: false
				}).then(response => {

					if (response.data.errcode == '0') {
						let category_codes = response.data.data.data
						for (var i = 0; i < category_codes.length; i++) {
							let codes = [];
							var orderInfo2;
							if (category_codes[i].categoryCodeList == '') {
								var orderInfos1;
								orderInfos1 = '<CB>' + goodslist.serialNumber + '</CB>' + '<BR>';
								orderInfos1 += '名称　　　 单价          数量<BR>';
								orderInfos1 += '--------------------------------<BR>';
								for (var i = 0; i < _self.addmenu.length; i++) {
									orderInfos1 += '<B>' + _self.addmenu[i].productionName + '<BR>' + '                      ' + _self.addmenu[
											i].productionSizes + '     ' + _self.addmenu[i].amount +
										'</B>' + '<BR>';
								}
								orderInfos1 += '--------------------------------<BR>';
								orderInfos1 += '下单时间：' + goodslist.create_at + '<BR>';
								orderInfos1 += '投诉电话' + goodslist.customer_service_number+ '<BR>'
								orderInfos1 += '<BR>'
								orderInfos1 += '<BR>'
								orderInfos1 += '<BR>'
								orderInfos1 += '<BR>'

								var orderInfos2;
								orderInfos2 = '@@2<FB><FS2><center>' + goodslist.serialNumber + '</center></FS2></FB>↵' + '\r'
								orderInfos2 += '<LR>名称                单价                   数量</LR>'
								orderInfos2 += '\r' + '↵————————————————————————↵' + '\r'
								for (var i = 0; i < _self.addmenu.length; i++) {
									orderInfos2 += '<FB><FS2>' + _self.addmenu[i].productionName + '\r' + '          ' + _self.addmenu[
											i].productionSizes +
										'          ' + _self.addmenu[i].amount + '</FS2></FB>' + '\r'
								}
								orderInfos2 += '\r' + '↵————————————————————————↵' + '\r'
								orderInfos2 += '下单时间：' + goodslist.create_at


								var order = {
									name1: orderInfos1,
									name2: orderInfos2
								}
								let formDataOpen = new FormData();
								formDataOpen.append('shopCode', _self.shopcode);
								formDataOpen.append('content', JSON.stringify(order));
								formDataOpen.append('orderCode',  _self.$route.query.orderCode);
								_self.axios.post(_self.ApiUrls + '/printer/connectionPrinter', formDataOpen, {
									// 单独配置
									withCredentials: false
								}).then(function(response) {
									if (response.data.errcode == '0') {

									} else {
										_self.$message.error('无线打印机：' + response.data.errmsg + '，请到今日订单点击重新打印');
									}
								}).catch(function(error) {
									console.log(error);
								});
							} else {
								for (var j = 0; j < _self.addmenu.length; j++) {
									for (var b = 0; b < category_codes[i].categoryCodeList.length; b++) {
										if (_self.addmenu[j].categoryCode == category_codes[i].categoryCodeList[b]) {
											codes.push(_self.addmenu[j])
										}
									}
								}
								if (category_codes[i].type == 'F') {

									orderInfo2 = '<CB>' + goodslist.serialNumber + '</CB>' + '<BR>';
									orderInfo2 += '名称　　　 单价          数量<BR>';
									orderInfo2 += '--------------------------------<BR>';
									for (var c = 0; c < codes.length; c++) {
										orderInfo2 += '<B>' + codes[c].productionName + '<BR>' + '                      ' + codes[
												c].productionSizes + '     ' + codes[c].amount +
											'</B>' + '<BR>';
									}
									orderInfo2 += '--------------------------------<BR>';
									orderInfo2 += '下单时间：' + goodslist.create_at + '<BR>';
									orderInfo2 += '投诉电话' + goodslist.customer_service_number
									orderInfo2 += '<BR>'
									orderInfo2 += '<BR>'
									orderInfo2 += '<BR>'
									orderInfo2 += '<BR>'
								} else {
									orderInfo2 = '@@2<FB><FS2><center>' + goodslist.serialNumber + '</center></FS2></FB>↵' + '\r'
									orderInfo2 += '<LR>名称                单价                   数量</LR>'
									orderInfo2 += '\r' + '↵————————————————————————↵' + '\r'
									for (var c = 0; c < codes.length; c++) {
										orderInfo2 += '<FB><FS2>' + codes[c].productionName + '\r' + '          ' + codes[c].productionSizes +
											'          ' + codes[c].amount + '</FS2></FB>' + '\r'
									}
									orderInfo2 += '\r' + '↵————————————————————————↵' + '\r'
									orderInfo2 += '下单时间：' + goodslist.create_at
									orderInfo2 += '投诉电话' + goodslist.customer_service_number
									//结束
								}
								if (codes != '') {
									let formDataOpens = new FormData();
									formDataOpens.append('machine_code', category_codes[i].printer_code);
									formDataOpens.append('content', orderInfo2);
									formDataOpens.append('account', category_codes[i].uk_account);
									formDataOpens.append('ukey', category_codes[i].uk_key);
									formDataOpens.append('type', category_codes[i].type);
									formDataOpens.append('orderCode', _self.$route.query.orderCode);
									_self.axios.post(_self.ApiUrls + '/printer/categoryCodePrinter', formDataOpens, {
										// 单独配置
										withCredentials: false
									}).then(function(response) {
										console.log(response)
									}).catch(function(error) {
										console.log(error);
									});
									// 品类打印结束
								}


							}


						}

					} else {
						
					}

				}).catch(function(error) {
					_self.$message.error('响应时间过长，请重试');
				});


				let getorder = new FormData();
				getorder.append('orderid', goodslist.orderCode);
				_self.axios.post(_self.realmphp + 'getorderqr.php', getorder, {
					// 单独配置
					withCredentials: false
				}).then(response => {

					if (response.data.expire_seconds == '86400') {
						_self.qrcodes = response.data.url
						let QrCodeTip = new FormData();
						QrCodeTip.append('str', 'QrCode');
						_self.axios.post(_self.ApiUrl + '/catering/getQrCodeTip', QrCodeTip).then(response => {

							if (response.data.errcode == '0') {

								_self.namecode = response.data.data.data.value

								var hPos = 10, //小票上边距
									pageWidth = 580, //小票宽度
									rowHeight = 15, //小票行距
									//获取控件对象
									LODOP = getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'));
								//初始化
								LODOP.PRINT_INIT("");
								//消费小票********************************************************************************************************
								LODOP.SET_PRINT_STYLE("FontSize", 20); //字体大小
								LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, goodslist.customed_title);
								hPos += rowHeight;
								hPos += rowHeight;
								if (_self.profilequeuetype == 'SERIAL') {
									LODOP.ADD_PRINT_TEXT(hPos, 60, pageWidth, rowHeight, goodslist.serialNumber);
								} else if (_self.profilequeuetype == 'TABLE-NUM') {
									LODOP.ADD_PRINT_TEXT(hPos, 60, pageWidth, rowHeight, goodslist.seatNum);
								}

								hPos += rowHeight;
								hPos += rowHeight;
								LODOP.SET_PRINT_STYLE("FontSize", 9); //字体大小
								//添加小票标题文本
								LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, "店铺名称:");
								LODOP.ADD_PRINT_TEXT(hPos, 60, pageWidth, rowHeight, goodslist.shop);
								//上边距往下移
								hPos += rowHeight;
								if (_self.profilequeuetype == 'SERIAL') {
									LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, "餐牌号:");
									LODOP.ADD_PRINT_TEXT(hPos, 60, pageWidth, rowHeight, goodslist.serialNumber);
								} else if (_self.profilequeuetype == 'TABLE-NUM') {
									LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, "桌号:");
									LODOP.ADD_PRINT_TEXT(hPos, 60, pageWidth, rowHeight, goodslist.seatNum);
								}


								hPos += rowHeight;
								LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, "收银员:");
								LODOP.ADD_PRINT_TEXT(hPos, 60, pageWidth, rowHeight, _self.username);
								hPos += rowHeight;
								LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, "订单号:");
								LODOP.ADD_PRINT_TEXT(hPos, 60, pageWidth, rowHeight, goodslist.orderCode);
								hPos += rowHeight;
								LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, "下单时间:");
								LODOP.ADD_PRINT_TEXT(hPos, 60, pageWidth, rowHeight, goodslist.create_at);
								hPos += rowHeight;
								LODOP.ADD_PRINT_LINE(hPos, 2, hPos, pageWidth, 2, 1);
								hPos += 5;
								LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, "商品名称");
								LODOP.ADD_PRINT_TEXT(hPos, 70, pageWidth, rowHeight, "单价");
								LODOP.ADD_PRINT_TEXT(hPos, 110, pageWidth, rowHeight, "数量");
								LODOP.ADD_PRINT_TEXT(hPos, 140, pageWidth, rowHeight, "小计");
								hPos += rowHeight;
								//遍历goodslist的商品数组
								for (var i = 0; i < goodslist.goodsList.length; i++) {

									if (goodslist.goodsList[i].productionName.length < 4) {
										LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, goodslist.goodsList[i].productionName);
									} else {
										//商品名字过长,其他字段需要换行
										LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, goodslist.goodsList[i].productionName);
										hPos += rowHeight;
									}
									LODOP.ADD_PRINT_TEXT(hPos, 70, pageWidth, rowHeight, goodslist.goodsList[i].promotional_price);
									LODOP.ADD_PRINT_TEXT(hPos, 115, pageWidth, rowHeight, goodslist.goodsList[i].orderAmount);
									LODOP.ADD_PRINT_TEXT(hPos, 140, pageWidth, rowHeight, goodslist.goodsList[i].actual_amount);
									hPos += rowHeight;
								}
								//商品遍历打印完毕,空一行
								hPos += rowHeight;
								//合计
								LODOP.ADD_PRINT_TEXT(hPos, 80, pageWidth, rowHeight, "合计:" + goodslist.totalCount);
								LODOP.ADD_PRINT_TEXT(hPos, 130, pageWidth, rowHeight, "￥" + goodslist.total);
								LODOP.ADD_PRINT_LINE(hPos, 2, hPos, pageWidth, 2, 1);
								hPos += rowHeight;
								hPos += rowHeight;
								LODOP.ADD_PRINT_TEXT(hPos, 2, pageWidth, rowHeight, (new Date()).toLocaleDateString() + " " + (new Date())
									.toLocaleTimeString())
								hPos += rowHeight;
								LODOP.ADD_PRINT_TEXT(hPos, 25, pageWidth, rowHeight, "谢谢惠顾,欢迎下次光临!");
								hPos += rowHeight;

								LODOP.ADD_PRINT_TEXT(hPos, 25, pageWidth, rowHeight, "监督电话：" + goodslist.customer_service_number);
								hPos += rowHeight;
								LODOP.SET_PRINT_STYLE("FontSize", 12); //字体大小
								// LODOP.ADD_PRINT_TEXT(hPos, 25, pageWidth, rowHeight, _self.namecode);
								hPos += rowHeight;
								hPos += rowHeight;
								//初始化打印页的规格
								var toplist;
								toplist = goodslist.goodsList.length * 22;
								var zonghetop;
								zonghetop = toplist + 305
								// LODOP.ADD_PRINT_BARCODE(zonghetop, 40, 150, 150, "QRCode", _self.qrcodes);
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
								_self.$message.error('获取二维码失败，请刷新重试');
							}
						}).catch(function(error) {
							_self.$message.error('二维码响应时间过长，请重试');

						});

					} else {
						_self.$message.error('获取二维码失败，请刷新重试');
					}
				}).catch(function(error) {
					_self.$message.error('二维码响应时间过长，请重试');

				});

				//结束

			},
			//保存 
			updatesn() {
				let _self = this;
					if(_self.addmenu==''){
						_self.$message({
							type: 'warning',
							message: '您没有添加任何菜品哦！',
							showClose: true,
						})
						return false
					}
				var newdata = {
					allPayment: _self.allmenudatemoney,
					orderCode: _self.$route.query.orderCode,
					list: _self.addmenu
				}
				_self.axios.post(_self.ApiUrls + '/credit/addDishes', {
					jsonData: newdata
				}, {
					// 单独配置
					withCredentials: false
				}, {
					headers: {
						'Content-Type': 'application/json;charsetset=UTF-8'
					}
				}).then(response => {

					if (response.data.errcode == '0') {
						_self.$message({
							message: '提交成功',
							type: 'success'
						});
						let formData3 = new FormData();
						formData3.append('shopCode', _self.shopcode);
						formData3.append('orderCode', _self.$route.query.orderCode);
						formData3.append('serialNumber', _self.$route.query.tableData.serialNumber);
						//发送请求
						_self.axios.post(_self.ApiUrl + '/catering/cashSettlement', formData3).then(response => {
							console.log(response)
							if (response.data.errcode == '0') {

								_self.shopdetail();
								_self.goodslist = response.data.data
								var json = _self.goodslist
								//打印
								_self.print(_self.goodslist);
								//打印结束

							} else {
								_self.$message.error('打印菜单加载失败');

								_self.shopdetail();
							}

						}).catch(function(error) {
							_self.$message.error('响应时间过长，请重试');
						});
						_self.$router.push({
							path: '/todaycredit',

						})
						_self.refordertype = ''
					} else if (response.data.errcode == '1007') {
						_self.$message.error(response.data.data.msg);
					} else {
						_self.$message.error('保存失败，请重试');
					}
				}).catch(function(error) {
					_self.$message.error('响应时间过长，请重试');

				});

			},

			//品类分页

			pinleicuurent: function(currentPage) {
				let _self = this;
				_self.currentPages = currentPage;
				let formData = new FormData();
				formData.append('shopCode', _self.shopcode);
				formData.append('pageNum', _self.currentPages);
				formData.append('pageSize', _self.pagesizes1);
				_self.axios.post(_self.ApiUrl + '/catering/getShopProductionCaregory', formData).then(response => {

					if (response.data.errcode == '0') {
						_self.category = response.data.data.data.list
						_self.totalpinlei = response.data.data.data.total
						_self.typelist = _self.category[0].categoryCode
						let formData2 = new FormData();
						formData2.append('shopCode', _self.shopcode);
						formData2.append('pageNum', _self.cur);
						formData2.append('pageSize', _self.pageSize);
						formData2.append('categoryCode', _self.category[0].categoryCode);
						_self.axios.post(_self.ApiUrl + '/catering/getShopProductionName', formData2).then(response => {
							if (response.data.errcode == '0') {
								_self.type0Goods = response.data.data.data.list;
								_self.all = response.data.data.data.pages
								_self.commentsGroup = response.data.data.commentsGroup
								_self.clicked2 = 0
								for (var i = 0; i < response.data.data.data.list.length; i++) {
									if (response.data.data.data.list[i].state == 'Y') {
										_self.type0Goods[i].state = "上新产品"
									} else if (response.data.data.data.list[i].state == 'N') {
										_self.type0Goods[i].state = "下架了"
									}
								}
							} else {
								_self.$message.error('菜品找不到了，请刷新重试');
							}
						}).catch(function(error) {
							_self.$message.error('响应时间过长，请重试');
						});
					} else {
						_self.$message.error('品类找不到啦，退出重试');
					}
				}).catch(function(error) {
					_self.$message.error('响应时间过长，请重试');
				});
			},
			quxiao() {
				let _self = this;
				_self.dialogVisible = false;
				_self.clickeds2 = -1;
			},
			procoment(index) {
				let _self = this;
				_self.clickeds2 = index;
			},
			pricelistclick(index) {
				let _self = this;
				_self.clickedmoney = index;
				if (_self.production.productionSizes == null) {

					if (_self.production.pricelist[1] == null) {
						_self.arrlist = [{
							name: '原价',
							price: _self.production.pricelist[0]
						}]
					} else {
						_self.arrlist = [{
							name: '原价',
							price: _self.production.pricelist[0]
						}, {
							name: _self.names,
							price: _self.production.pricelist[1]
						}]
					}
					_self.price = _self.arrlist[_self.clickedmoney].price;
				} else {
					if (_self.production.pricelist[1] == null) {
						_self.arrlist = [{
							name: '原价',
							price: _self.production.productionSizes[_self.clicked].pricelist[0]
						}]
					} else {
						console.log(_self.clicked)
						_self.arrlist = [{
							name: '原价',
							price: _self.production.productionSizes[_self.clicked].pricelist[0]
						}, {
							name: _self.names,
							price: _self.production.productionSizes[_self.clicked].pricelist[1]
						}]
					}

					_self.price = _self.production.productionSizes[_self.clicked].pricelist[_self.clickedmoney];

				}
			},
			btnClick(num) {
				if (num != this.cur) {
					this.cur = num;
				}
			},

			changedisxount(index) {
				let _self = this;
				_self.indexdiscount = index
				_self.clicked3 = index
			},

			pageClick() {
				let _self = this
				let formData2 = new FormData();
				formData2.append('shopCode', _self.shopcode);
				formData2.append('pageNum', _self.cur);
				formData2.append('pageSize', _self.pageSize);
				formData2.append('categoryCode', _self.typelist);
				_self.axios.post(_self.ApiUrl + '/catering/getShopProductionName', formData2).then(response => {
					if (response.data.errcode == '0') {
						_self.type0Goods = response.data.data.data.list;
						_self.all = response.data.data.data.pages;
						_self.commentsGroup = response.data.data.commentsGroup
						for (var i = 0; i < response.data.data.data.list.length; i++) {
							if (response.data.data.data.list[i].state == 'Y') {
								_self.type0Goods[i].state = "上新产品"
							} else if (response.data.data.data.list[i].state == 'N') {
								_self.type0Goods[i].state = "下架了"
							}
						}

					} else {
						_self.$message.error('菜品找不到了,请刷新重试!');
					}
				}).catch(function(error) {
					_self.$message.error('响应时间过长，请重试');
				});
			},

			closedian() {
				let _self = this
				let formData2 = new FormData();
				formData2.append('shopCode', _self.shopcode);
				formData2.append('state', '0');

				_self.axios.post(_self.ApiUrl + '/catering/closeSmallProgram', formData2).then(response => {
					if (response.data.errcode == '0') {
						_self.state = '关店'
						_self.$message({
							type: 'success',
							message: '已关店'
						});

					} else {
						_self.$message.error('暂时不能关店哦，请刷新重试');
					}
				}).catch(function(error) {
					_self.$message.error('响应时间过长，请重试');
				});
			},


			//切换菜单
			handleClick(index, item) {
				let _self = this;
				_self.clickeds = -1;
				_self.cur = 1;
				_self.clicked2 = index;
				let formData = new FormData();
				formData.append('shopCode', _self.shopcode);
				formData.append('pageNum', _self.currentPages);
				formData.append('pageSize', _self.pagesizes1);
				_self.axios.post(_self.ApiUrl + '/catering/getShopProductionCaregory', formData).then(response => {

					if (response.data.errcode == '0') {
						_self.category = response.data.data.data.list
						_self.typelist = response.data.data.data.list[index].categoryCode

						let formData2 = new FormData();
						formData2.append('shopCode', _self.shopcode);
						formData2.append('pageNum', _self.cur);
						formData2.append('pageSize', _self.pageSize);
						formData2.append('categoryCode', response.data.data.data.list[index].categoryCode);
						_self.axios.post(_self.ApiUrl + '/catering/getShopProductionName', formData2).then(response => {
							if (response.data.errcode == '0') {
								_self.type0Goods = response.data.data.data.list;
								_self.all = response.data.data.data.pages
								_self.commentsGroup = response.data.data.commentsGroup

								for (var i = 0; i < response.data.data.data.list.length; i++) {
									if (response.data.data.data.list[i].state == 'Y') {
										_self.type0Goods[i].state = "上新产品"
									} else if (response.data.data.data.list[i].state == 'N') {
										_self.type0Goods[i].state = "下架了"
									}
								}
							} else {
								_self.$message.error('菜品找不到了，请刷新重试');
							}
						}).catch(function(error) {
							_self.$message.error('响应时间过长，请重试');
						});
					} else {
						_self.$message.error('品类找不到啦，退出重试');
					}
				}).catch(function(error) {
					_self.$message.error('响应时间过长，请重试');
				});
			},
			//关闭挂起菜单
			closemenus() {
				this.isShow = false
			},
			// 一键清空
			clearCartList() {
				let _self = this
				let formData = new FormData();
				formData.append('token', _self.token);
				_self.axios.post(_self.ApiUrls + '/buyer/deleteShoppingCarAllProduction', formData, {
					// 单独配置
					withCredentials: false
				}).then(response => {
					if (response.data.errcode == '0') {
						_self.moneyzhe = '';
						_self.codename = '';
						_self.serialnum = '';
						_self.shopdetail();
					} else {
						_self.$message.error('数据错误，请刷新重试');
					}
				}).catch(function(error) {
					_self.$message.error('响应时间过长，请重试');
				});
			},
			//选择菜品
			checkinlist(index) {
				let _self = this;
				_self.textarea = '';
				_self.dialogVisible = true
				this.clickeds = index;
				_self.clickedmoney = '0';
				_self.clicked = '0';
				_self.production = _self.type0Goods[index]
				console.log(_self.type0Goods[index])
				if (_self.production.discount_type == 'inner_price') {
					_self.names = '员工价'
				} else if (_self.production.discount_type == 'inner_disccount') {
					_self.names = '内部折扣'
				} else if (_self.production.discount_type == 'promotion') {
					_self.names = '促销价'
				} else if (_self.production.discount_type == null) {
					_self.names = '无价格'
				}
				if (_self.production.productionSizes == null) {

					if (_self.production.pricelist[1] == null) {
						_self.arrlist = [{
							name: '原价',
							price: _self.production.pricelist[0]
						}]
					} else {
						_self.arrlist = [{
							name: '原价',
							price: _self.production.pricelist[0]
						}, {
							name: _self.names,
							price: _self.production.pricelist[1]
						}]
					}
					_self.price = _self.arrlist[_self.clickedmoney].price;
				} else {
					if (_self.production.pricelist[1] == null) {
						_self.arrlist = [{
							name: '原价',
							price: _self.production.productionSizes[_self.clicked].pricelist[0]
						}]
					} else {
						_self.arrlist = [{
							name: '原价',
							price: _self.production.productionSizes[_self.clicked].pricelist[0]
						}, {
							name: _self.names,
							price: _self.production.productionSizes[_self.clicked].pricelist[1]
						}]
					}

					_self.price = _self.production.productionSizes[_self.clicked].pricelist[_self.clickedmoney];

				}

			},
			prosize(index) {
				let _self = this;
				_self.clicked = index;
				_self.clickedmoney = '0';
				if (_self.production.productionSizes == null) {
					if (_self.production.pricelist[1] == null) {
						_self.arrlist = [{
							name: '原价',
							price: _self.production.pricelist[0]
						}]
					} else {
						_self.arrlist = [{
							name: '原价',
							price: _self.production.pricelist[0]
						}, {
							name: _self.names,
							price: _self.production.pricelist[1]
						}]
					}
					_self.price = _self.arrlist[_self.clickedmoney].price;

				} else {
					if (_self.production.pricelist[1] == null) {
						_self.arrlist = [{
							name: '原价',
							price: _self.production.productionSizes[_self.clicked].pricelist[0]
						}]
					} else {
						_self.arrlist = [{
							name: '原价',
							price: _self.production.productionSizes[_self.clicked].pricelist[0]
						}, {
							name: _self.names,
							price: _self.production.productionSizes[_self.clicked].pricelist[1]
						}]
					}

					_self.price = _self.production.productionSizes[_self.clicked].pricelist[_self.clickedmoney];

				}

			},
			getProductionName() {
				let _self = this
				let formData2 = new FormData();
				console.log(_self.typelist)
				formData2.append('shopCode', _self.shopcode);
				formData2.append('pageNum', _self.cur);
				formData2.append('pageSize', _self.pageSize);
				formData2.append('categoryCode', _self.typelist);
				_self.axios.post(_self.ApiUrl + '/catering/getShopProductionName', formData2).then(response => {
					if (response.data.errcode == '0') {
						_self.type0Goods = response.data.data.data.list
						_self.all = response.data.data.data.pages
						for (var i = 0; i < response.data.data.data.list.length; i++) {
							if (response.data.data.data.list[i].state == 'Y') {
								_self.type0Goods[i].state = "上新产品"
							} else if (response.data.data.data.list[i].state == 'N') {
								_self.type0Goods[i].state = "下架了"
							}
						}

					} else {
						_self.$message.error('数据错误，请刷新重试');
					}
				}).catch(function(error) {
					_self.$message.error('响应时间过长，请重试');
				});
			},
			//初始化加载
			getuser() {
				let _self = this
				let formData = new FormData();
				formData.append('shopCode', _self.shopcode);
				formData.append('pageNum', _self.currentPages);
				formData.append('pageSize', _self.pagesizes1);
				_self.axios.post(_self.ApiUrl + '/catering/getShopProductionCaregory', formData).then(response => {
					if (response.data.errcode == '0') {
						_self.category = response.data.data.data.list
						_self.totalpinlei = response.data.data.data.total
						_self.typelist = _self.category[0].categoryCode
						let formData2 = new FormData();
						formData2.append('shopCode', _self.shopcode);
						formData2.append('pageNum', _self.cur);
						formData2.append('pageSize', _self.pageSize);
						formData2.append('categoryCode', _self.category[0].categoryCode);
						_self.axios.post(_self.ApiUrl + '/catering/getShopProductionName', formData2).then(response => {
							if (response.data.errcode == '0') {
								_self.type0Goods = response.data.data.data.list
								_self.all = response.data.data.data.pages

								for (var i = 0; i < response.data.data.data.list.length; i++) {
									if (response.data.data.data.list[i].state == 'Y') {
										_self.type0Goods[i].state = "上新产品"
									} else if (response.data.data.data.list[i].state == 'N') {
										_self.type0Goods[i].state = "下架了"

									}
								}
								//_self.moneyzhe='';
								_self.shopdetail();
							} else {
								_self.$message.error('菜品找不到啦，请刷新重试');
							}
						}).catch(function(error) {
							_self.$message.error('响应时间过长，请重试');
						});
					} else {
						_self.$message.error('品类找不到了，请退出重试');
					}
				}).catch(function(error) {
					_self.$message.error('响应时间过长，请刷新重试！');
				});

			},
			//购物车
			shopdetail() {
				let _self = this
				let formData2 = new FormData();
				formData2.append('token', _self.token);
				formData2.append('shopCode', _self.shopcode);
				if (_self.serialnum == '') {
					formData2.append('seatNum', '');
				} else {
					formData2.append('seatNum', _self.serialnum);
				}
				_self.axios.post(_self.ApiUrls + '/buyer/getShoppingCarDetail', formData2, {
					// 单独配置
					withCredentials: false
				}).then(response => {
					if (response.data.errcode == '0') {
						_self.allmenudate = response.data.data
						_self.menudate = response.data.data.data
						_self.godetailnum = _self.menudate
						//console.log(_self.menudate.length)
					} else {
						_self.$message.error('数据错误，请刷新重试');
					}
				}).catch(function(error) {
					_self.$message.error('响应时间过长，请重试');
				});
			},
			getstop() {
				let _self = this;
				console.log(_self.$route.query.tablelist)
				_self.tableData2 = _self.$route.query.tablelist


			},
			//添加到购物车
			addmenus() {
				let _self = this;
				_self.dialogVisible = false;
				console.log(_self.type0Goods[_self.clickeds]);

				if (_self.production.productionSizes == null) {
					var productionCodes = _self.production.productionCode;
					_self.price = _self.arrlist[_self.clickedmoney].price;
					if (_self.clickedmoney == '1') {
						var addmenuobj = {
							categoryCode: _self.type0Goods[_self.clickeds].categoryCode,
							categoryName: _self.type0Goods[_self.clickeds].categoryName,
							commentsSize: coment2,
							comments_group_code: _self.type0Goods[_self.clickeds].comments_group_code,
							discount_type: _self.type0Goods[_self.clickeds].discount_type,
							groupCode: _self.type0Goods[_self.clickeds].groupCode,
							pictureUrl: _self.type0Goods[_self.clickeds].pictureUrl,
							price: _self.type0Goods[_self.clickeds].price,
							pricelist: _self.price,
							productionCode: _self.type0Goods[_self.clickeds].productionCode,
							productionName: _self.type0Goods[_self.clickeds].productionName,
							productionSizes: _self.price,
							promotional_price: _self.type0Goods[_self.clickeds].promotional_price,
							promotional_price_switch: _self.type0Goods[_self.clickeds].promotional_price_switch,
							size: _self.type0Goods[_self.clickeds].size,
							state: _self.type0Goods[_self.clickeds].state,
							amount: 0,
							payment: 0
						}
					} else {
						var addmenuobj = {
							categoryCode: _self.type0Goods[_self.clickeds].categoryCode,
							categoryName: _self.type0Goods[_self.clickeds].categoryName,
							commentsSize: coment2,
							comments_group_code: _self.type0Goods[_self.clickeds].comments_group_code,
							discount_type: '',
							groupCode: _self.type0Goods[_self.clickeds].groupCode,
							pictureUrl: _self.type0Goods[_self.clickeds].pictureUrl,
							price: _self.type0Goods[_self.clickeds].price,
							pricelist: _self.price,
							productionCode: _self.type0Goods[_self.clickeds].productionCode,
							productionName: _self.type0Goods[_self.clickeds].productionName,
							productionSizes: _self.price,
							promotional_price: _self.type0Goods[_self.clickeds].promotional_price,
							promotional_price_switch: _self.type0Goods[_self.clickeds].promotional_price_switch,
							size: _self.type0Goods[_self.clickeds].size,
							state: _self.type0Goods[_self.clickeds].state,
							amount: 0,
							payment: 0
						}
					}
				} else {
					var productionCodes = _self.production.productionSizes[_self.clicked].productionCode;
					_self.price = _self.production.productionSizes[_self.clicked].pricelist[_self.clickedmoney];
					console.log(_self.type0Goods[_self.clickeds])
					if (_self.clickedmoney == '1') {
						var addmenuobj = {
							categoryCode: _self.type0Goods[_self.clickeds].categoryCode,
							categoryName: _self.type0Goods[_self.clickeds].categoryName,
							commentsSize: coment2,
							comments_group_code: _self.type0Goods[_self.clickeds].comments_group_code,
							discount_type: _self.type0Goods[_self.clickeds].discount_type,
							groupCode: _self.type0Goods[_self.clickeds].groupCode,
							pictureUrl: _self.type0Goods[_self.clickeds].pictureUrl,
							price: _self.type0Goods[_self.clickeds].price,
							pricelist: _self.price,
							productionCode: _self.type0Goods[_self.clickeds].productionSizes[_self.clicked].productionCode,
							productionName: _self.type0Goods[_self.clickeds].productionName,
							productionSizes: _self.price,
							promotional_price: _self.type0Goods[_self.clickeds].promotional_price,
							promotional_price_switch: _self.type0Goods[_self.clickeds].promotional_price_switch,
							size: _self.type0Goods[_self.clickeds].size,
							state: _self.type0Goods[_self.clickeds].state,
							amount: 0,
							payment: 0
						}
					} else {
						var addmenuobj = {
							categoryCode: _self.type0Goods[_self.clickeds].categoryCode,
							categoryName: _self.type0Goods[_self.clickeds].categoryName,
							commentsSize: coment2,
							comments_group_code: _self.type0Goods[_self.clickeds].comments_group_code,
							discount_type: '',
							groupCode: _self.type0Goods[_self.clickeds].groupCode,
							pictureUrl: _self.type0Goods[_self.clickeds].pictureUrl,
							price: _self.type0Goods[_self.clickeds].price,
							pricelist: _self.price,
							productionCode: _self.type0Goods[_self.clickeds].productionSizes[_self.clicked].productionCode,
							productionName: _self.type0Goods[_self.clickeds].productionName,
							productionSizes: _self.price,
							promotional_price: _self.type0Goods[_self.clickeds].promotional_price,
							promotional_price_switch: _self.type0Goods[_self.clickeds].promotional_price_switch,
							size: _self.type0Goods[_self.clickeds].size,
							state: _self.type0Goods[_self.clickeds].state,
							amount: 0,
							payment: 0
						}
					}
				}

				var coment2 = '';
				if (_self.commentsGroup == '') {
					coment2 = '';
				} else if (_self.clickeds2 == '-1') {
					coment2 = '';
				} else {
					coment2 = _self.commentsGroup[_self.clickeds2].value
				}
				console.log(_self.type0Goods[_self.clickeds])
				console.log(_self.production)


				var ins = '1';

				if (_self.addmenu.length == '0') {
					addmenuobj.amount += 1;
					addmenuobj.payment = _self.price * addmenuobj.amount
					_self.addmenu.push(addmenuobj)
					//_self.allmenudatemoney += addmenuobj.payment
					_self.allmenudatemoney = parseFloat(_self.allmenudatemoney).toFixed(2);
					_self.allmenudatemoney = Number(_self.allmenudatemoney)

					_self.allmenudatemoney += addmenuobj.payment
					_self.allmenudatemoney = parseFloat(_self.allmenudatemoney).toFixed(2);


				} else {

					for (var i = 0; i < _self.addmenu.length; i++) {
						if (_self.addmenu[i].productionCode == addmenuobj.productionCode && _self.addmenu[i].productionSizes ==
							addmenuobj.productionSizes && _self.addmenu[i].pricelist == addmenuobj.pricelist) {
							ins = "0";
							_self.addmenu[i].amount += 1;
							_self.addmenu[i].payment = Number(_self.addmenu[i].productionSizes) * _self.addmenu[i].amount
							//_self.allmenudatemoney = _self.allmenudatemoney + _self.addmenu[i].productionSizes
							_self.allmenudatemoney = parseFloat(_self.allmenudatemoney).toFixed(2);
							_self.allmenudatemoney = Number(_self.allmenudatemoney)

							_self.allmenudatemoney += _self.addmenu[i].productionSizes
							_self.allmenudatemoney = parseFloat(_self.allmenudatemoney).toFixed(2);
						}
					}
					if (ins == '1') {
						addmenuobj.amount += 1;
						addmenuobj.payment = Number(_self.price) * addmenuobj.amount
						_self.addmenu.push(addmenuobj)
						//_self.allmenudatemoney = _self.allmenudatemoney	+ addmenuobj.payment
						_self.allmenudatemoney = parseFloat(_self.allmenudatemoney).toFixed(2);
						_self.allmenudatemoney = Number(_self.allmenudatemoney)

						_self.allmenudatemoney += addmenuobj.payment
						_self.allmenudatemoney = parseFloat(_self.allmenudatemoney).toFixed(2);
					}

				}


				var namebox = [];
				namebox = _self.addmenu

			},

			// 数量加
			add(index) {

				let _self = this;
				_self.dialogVisible = false;
				index.amount += 1
				index.payment = Number(index.productionSizes) * index.amount

				_self.allmenudatemoney = parseFloat(_self.allmenudatemoney).toFixed(2);
				_self.allmenudatemoney = Number(_self.allmenudatemoney)

				_self.allmenudatemoney += index.productionSizes
				_self.allmenudatemoney = parseFloat(_self.allmenudatemoney).toFixed(2);
			},
			//数量减
			cuts(index) {
				let _self = this;
				_self.dialogVisible = false;
				if (index.amount < 2) {

					_self.allmenudatemoney = _self.allmenudatemoney - index.productionSizes
					index.payment = Number(index.payment) - Number(index.productionSizes)
					_self.addmenu.splice(index, 1)
					return false
				} else {
					index.amount = index.amount - 1


					index.payment = Number(index.payment) - Number(index.productionSizes)
					index.payment = parseFloat(index.payment).toFixed(2)
					console.log(index.payment + '.....' + index.productionSizes)
					//_self.allmenudatemoney = _self.allmenudatemoney-index.productionSizes
					_self.allmenudatemoney = parseFloat(_self.allmenudatemoney).toFixed(2);
					_self.allmenudatemoney = Number(_self.allmenudatemoney)

					_self.allmenudatemoney -= index.productionSizes
					_self.allmenudatemoney = parseFloat(_self.allmenudatemoney).toFixed(2);
				}
			},
			//添加到未支付订单

			check() {
				let _self = this;
				let formData = new FormData();
				formData.append('token', _self.token);
				formData.append('shopCode', _self.shopcode);
				formData.append('seatNum', '');
				formData.append('payment', _self.allmenudate.allPayment);
				formData.append('code', '');
				formData.append('state', '1');
				_self.axios.post(_self.ApiUrls + '/buyer/createUserOrder ', formData, {
					// 单独配置
					withCredentials: false
				}).then(response => {
					if (response.data.errcode == '0') {
						_self.$message({
							message: '添加成功',
							type: 'success'
						});
						_self.codename = ''
						_self.getuser()
					} else {
						_self.$message.error('添加错误，请刷新重试');
					}
				}).catch(function(error) {
					_self.$message.error('响应时间过长，请重试');
				});
			},


			tableHeaderColor({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				if (rowIndex === 0) {
					return 'background-color: #f2f2f2;color: #656565;font-weight: 500;'
				}
			},

		},
		created: function() {
			let _self = this
			_self.getuser()
			_self.getstop()
			console.log(_self.$route.query.tableData)
		},
		mounted: function() {
			this.tableHeight = window.innerHeight / 2.6;
			this.height = window.innerHeight / 1.4
			//window.innerHeight:浏览器的可用高度
			//this.$refs.table.$el.offsetTop：表格距离浏览器的高度
			//后面的50：根据需求空出的高度，自行调整

		}
	}
</script>

<style>
	.btn-foot {
		margin: 5px 5px 0 5px;
	}

	.close {
		display: inline-block;
		line-height: 1;
		white-space: nowrap;
		cursor: pointer;
		background: #fff;
		border: 1px solid #dcdfe6;
		color: #606266;
		text-align: center;
		box-sizing: border-box;
		outline: none;
		margin: 0;
		font-weight: 500;
		padding: 12px 20px;
		font-size: 14px;
		border-radius: 4px;
		position: absolute;
		right: 10px;
		top: 10px;
	}

	.gua1 {
		position: absolute;
		right: 10px;
		top: 0px;
	}

	.footer-buttom {
		position: fixed;
		bottom: 0;
		width: 33%;
	}

	.adds {
		height: 30px;
		width: 30px;
		padding: 0;
	}

	.app-contion {
		margin: 10px;

	}

	.xuanfu {
		margin: 10px 0;
	}

	.guige-title {
		margin: 10px 0;
		color: #CAC6C6;
	}

	.xuanfu [class*=el-col-] {
		float: none;
	}


	.category-box {
		height: 420px;
		overflow: hidden;
		overflow-y: scroll;
	}

	.el-card {
		text-align: center;
		margin: 10px;
		width: 120px;
		height: 120px;
		line-height: 60px;
	}

	.el-card__body {
		padding: 0;
	}

	.clear {
		clear: both;
	}

	.cookList {
		display: flex;
		flex-wrap: wrap
	}

	.cookList li div {
		font-size: 15px;
	}

	.red-color {
		color: brown;
	}

	.flag {
		background: ghostwhite;
	}

	.box {
		height: 180px !important;
		width: 180px !important;
		padding: 5px;
		margin: 5px;
		line-height: 180px !important;
	}

	.el-checkbox__label {
		font-size: 14px;
	}

	.el-checkbox__input {
		vertical-align: top;
	}

	.footerbus {
		width: 39%;
		/* 	position: fixed;
		right: 0.625rem; */
		padding: 15px;
		margin-left: 1%;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
		height: 100%;
		/* 	z-index: 10; */
		background: #FFFFFF;
	}

	.el-dialog__body {
		padding: 20px 20px;
	}

	.guige-check {
		margin: 10px;
	}

	.flower span {
		display: inline-block;
		line-height: 1;
		white-space: nowrap;
		cursor: pointer;
		background: #fff;
		border: 1px solid #dcdfe6;
		color: #606266;
		-webkit-appearance: none;
		text-align: center;
		box-sizing: border-box;
		outline: none;
		margin: 0;
		transition: .1s;
		font-weight: 500;
		-moz-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		padding: 12px 20px;
		font-size: 14px;
		border-radius: 4px;
		margin: 3px;
	}

	.idcards span {
		display: inline-block;
		line-height: 1;
		white-space: nowrap;
		cursor: pointer;
		background: #fff;
		border: 2px solid #dcdfe6;
		color: #606266;
		-webkit-appearance: none;
		text-align: center;
		box-sizing: border-box;
		outline: none;
		margin: 0;
		transition: .1s;
		font-weight: 500;
		-moz-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		padding: 12px 20px;
		font-size: 14px;
		border-radius: 4px;
		margin: 10px;
	}

	.border-color {
		border: 2px solid red !important;
	}

	.fenlei-box {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
	}

	.fenle-child {
		width: 19%;
		margin: 0.5%;
	}

	.fenlei-box span {
		/* padding: 0.5625rem; */
		border-radius: 4px;
		display: inline-block;
		border: 1px solid #dcdfe6;
		box-sizing: border-box;
		overflow: hidden;
		height: 80px;
		text-align: center;
		width: 100%;
		color: #606266;
		font-weight: 500;
		font-size: 15px;
		cursor: pointer;
		position: relative;
	}

	.fenlei-i {
		font-style: normal;
		color: #ff545a;
		display: block;

	}

	.fenlei-money {
		text-align: right;
		margin-top: 3%;
		margin-right: 8px;
	}

	.tan-price {
		color: #409EFF;
		margin-top: 30px;
		font-size: 18px;
	}

	.check {
		margin: 15px;
		width: 87%;
	}

	.pinlei-box span {
		border-radius: 4px;
		display: inline-block;
		border: 2px solid #fff;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		margin: 0.5%;
		overflow: hidden;
		height: 5.25rem;
		text-align: center;
		width: 15%;
		color: #000;
		padding: 0.625rem;
		font-weight: 500;
		font-size: 0.775rem;
		cursor: pointer;
		border-radius: 0.625rem;
		/* line-height: 6.25rem; */
	}

	.pinlei-box {
		padding-bottom: 10px;
		border-bottom: 2px solid #ebebeb;
		margin-bottom: 10px;
		width: 100%;
	}

	.slide-fade-enter-active {
		transition: all .3s ease;
	}

	.slide-fade-leave-active {
		transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
	}

	.slide-fade-enter,
	.slide-fade-leave-to
	/* .slide-fade-leave-active for below version 2.1.8 */

		{
		transform: translateX(10px);
		opacity: 0;
	}

	.caidan {
		width: 96%;
		height: auto;
		border: 1px solid #ebebeb;
		border-radius: 3px;
		transition: .2s;
		margin-bottom: 20px;
		padding: 10px;
	}

	.navemeun {
		width: 100%;
		display: flex;
		border-top: 1px solid #DCDFE6;
		margin-top: 10px;
	}

	.navemeun-chirld {
		width: 50%;
		border-right: 1px solid #DCDFE6;
		padding: 10px;
		margin-top: 10px;
	}

	.navemeun-span {
		margin: 0 10px;
		width: 33.3%;
		font-size: 16px;
	}

	.el-table td,
	.el-table th.is-lea {
		text-align: center;
	}

	.continue {
		width: 50%;
		padding: 20px 10px 10px 10px;
		text-align: center;
		font-size: 18px;
		color: #67C23A;
		cursor: pointer;
	}

	.navemeun-box {
		width: 100%;
		text-align: left;
	}

	.max-heights {
		margin-top: 15%;
		overflow: hidden;
		overflow-y: scroll;
	}

	.el-checkbox.is-bordered {
		padding: 6px 15px 4px 10px;
		height: auto;
	}

	.activeshang {
		display: none;
	}

	.activexia {
		display: none;
	}

	.keyinput {
		-webkit-appearance: none;
		background-color: #fff;
		background-image: none;
		border-radius: 4px;
		border: 1px solid #dcdfe6;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		color: #606266;
		display: inline-block;
		font-size: inherit;
		height: 40px;
		line-height: 40px;
		outline: 0;
		padding: 0 15px;
		-webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
		transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
		width: 100%;
	}

	.page-break {
		margin-top: 10px;
		margin-left: 20px;
	}

	.page-ul {
		display: flex;
		height: 30px;
		position: fixed;
		bottom: 3%;
		left: 35%;
	}

	.page-break li {
		list-style: none;
		margin: 0 0.825rem;
	}

	.page-break a {
		/* border: 1px solid #ddd; */
		text-decoration: none;
		/* padding: 14px 22px; */
		color: #434343;
		cursor: pointer;
		font-size: 1.65rem;
		font-weight: bold;
	}

	.page-break a:hover {
		background-color: #eee;
	}

	.page-break a .banclick {
		cursor: not-allowed;
	}

	.page-break .active a {
		color: #aaaaaa;
		cursor: default;
		/* background-color: #409EFF; */
		border-color: #c0c4cc;
	}

	.page-break i {
		font-style: normal;
		color: #d44950;
		margin: 0px 4px;
		font-size: 12px;
	}

	.page-break .jumpbox .jumppage {
		border: 1px solid #ddd;
		margin-left: 40px;
		height: 33px;
		width: 40px;
		float: left;
	}

	.page-break .jumpbox .jumpbtn {
		cursor: pointer;
		margin-left: 10px;
	}

	.page-break .jumpbox .jumpbtn:active {
		color: #409EFF;
	}

	.clear {
		clear: both;
	}

	.xiajia {
		position: fixed;
		bottom: 10px;
		right: 35%;
	}

	.item-s {
		z-index: 20;
		border: 1px solid #DCDFE6;
		position: absolute;
		bottom: 10px;
		width: 84%;
	}

	/* .pinleibox {
		width: 10%;
		margin-left: -1.4375rem;
	} */

	.pinleibox button {
		/* display: block;
		height: 6.25rem;
		margin-top: 0.3125rem !important; */
	}

	.btn-shang {
		display: inline-block;
		line-height: 1;
		white-space: nowrap;
		cursor: pointer;
		background: #fff;
		border: 1px solid #dcdfe6;
		color: #fff;
		-webkit-appearance: none;
		text-align: center;
		box-sizing: border-box;
		outline: none;
		transition: .1s;
		font-weight: 500;
		padding: 5px 12px;
		font-size: 12px;
		border-radius: 3px;
		padding: 7px 15px;
		font-size: 12px;
		background-color: #67c23a;
		margin-left: 5px;
	}

	.rebateBox {
		font-size: 35px;
		text-align: center;
		color: red;
	}

	.rabateP {
		margin: 10px 0;
	}

	.spans {
		padding: 10px;
		display: inline-block;
		border: 1px solid #EAEAEA;
		margin: 5px;
	}

	/* calculator */
	#calculator {
		width: 50%;
		height: 245px;
		padding: 10px;
		border: 1px solid #e5e5e5;
		background: #f8f8f8;
		-moz-border-radius: 3px;
		-webkit-border-radius: 3px;
		border-radius: 3px;
		box-shadow: 0px 0px 10px #f2f2f2;
		-moz-box-shadow: 0px 0px 10px #f2f2f2;
		-webkit-box-shadow: 0px 0px 10px #f2f2f2;
		margin-left: 1.25rem;
		margin-top: 1.5625rem;
	}

	#calculator #input-box {
		margin: 0;
		width: 100%;
		padding: 9px 5px;
		height: 14px;
		border: 1px solid #e5e5e5;
		border-radius: 3px;
		-webkit-border-radius: 3px;
		-moz-border-radius: 3px;
		background: #FFF;
		text-align: right;
		line-height: 14px;
		font-size: 12px;
		font-family: Verdana, Geneva, sans-serif;
		color: #666;
		outline: none;
		text-transform: uppercase;
	}

	#calculator #btn-list {
		width: 100%;
		overflow: hidden;
	}

	#calculator #btn-list .btn-radius {
		border-radius: 2px;
		-webkit-border-radius: 2px;
		-moz-border-radius: 2px;
		border: 1px solid #e5e5e5;
		background: -webkit-gradient(linear, 0 0, 0 100%, from(#f7f7f7), to(#ebebeb));
		background: -moz-linear-gradient(top, #f7f7f7, #ebebeb);
		filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=#f7f7f7, endColorstr=#ebebeb, grandientType=1);
		line-height: 29px;
		text-align: center;
		text-shadow: 0px 1px 1px #FFF;
		font-weight: bold;
		font-family: Verdana, Geneva, sans-serif;
		color: #666;
		float: left;
		margin-left: 1%;
		margin-top: 11px;
		font-size: 12px;
		cursor: pointer;
	}

	#calculator #btn-list .btn-radius:active {
		background: #ffffff;
	}

	#calculator #btn-list .clear-marginleft {
		margin-left: 0;
	}

	#calculator #btn-list .font-14 {
		font-size: 14px;
	}

	#calculator #btn-list .color-red {
		color: #ff5050
	}

	#calculator #btn-list .color-blue {
		color: #00b4ff
	}

	#calculator #btn-list .btn-30 {
		width: 22%;
		height: 18%;
	}

	#calculator #btn-list .btn-70 {
		width: 70px;
		height: 1.8125rem;
	}

	.kadianstyle {
		padding: 0.625rem;
		background: #FFFFFF;
	}

	.cainame {
		font-style: normal;
		height: 60%;
		width: 100%;
		margin-top: 5px;
		border-bottom: 1.5px solid #cf435e;
		display: inline-block;
	}

	@media screen and (max-width:1058px) {
		.footer-buttom {
			width: 35%;
		}

		.pinlei-box span {
			width: 15%;
			height: 6rem;

		}

		/* .pinleibox {
			margin-left: -2.4375rem;

		} */

		.pinlei-box {
			width: 95%;
		}

		.fenlei-box span {
			height: 90px;
			font-size: 13px;
		}

		.fenle-child {
			width: 16%;
		}
	}

	@media screen and (max-width:1296px) {
		/* .footerbus {
			width: 27%;
		} */
	}

	@media screen and (max-width:1030px) {
		.medatwidth {
			width: 95%;
		}

		.adds {
			height: 22px;
			width: 22px;
		}
	}

	@media screen and (max-width:1021px) {
		/* .footerbus {
			width: 26%;
		} */
	}

	@media screen and (max-width:938px) {
		/* .footerbus {
			width: 25%;
		} */
	}

	@media screen and (max-width:888px) {
		/* .footerbus {
			width: 23%;
		} */
	}

	@media screen and (max-width:817px) {
		.footer-buttom {
			width: 35%;
		}

	}

	@media screen and (max-width:772px) {
		.footer-buttom {
			width: 37%;
		}

		.pinlei-box span {
			width: 14%;
		}

		/* .pinleibox {
			margin-left: -2.375rem;
		} */
	}

	@media screen and (max-width:731px) {
		.footer-buttom {
			width: 38%;
		}

		.pinlei-box span {
			width: 14%;
		}

		.pinlei-box {
			width: 85%;
		}

		/* .pinleibox {
			margin-left: -1.375rem;
		} */

		.fenlei-box span {
			font-size: 12px;
		}
	}

	.pinlei-fenye {
		text-align: center;
	}

	.el-table__body-wrapper {
		overflow-x: auto;
		overflow-y: auto;
	}

	.pinlei-fenye.is-background .btn-prev,
	.pinlei-fenye.is-background .btn-next {
		background: transparent;
	}

	.pinlei-fenye .btn-prev .el-icon,
	.pinlei-fenye .btn-next .el-icon {
		font-size: 27px;
	}
</style>
