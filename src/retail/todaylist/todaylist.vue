<template>
	<div class="app-contion">

		<div class="block">
			<span class="titles">订单总数：<span class="titles title-color">{{total}}</span>单</span>

		</div>
		<el-table :data="tableData" v-loading="loading" border style="width: 100%;" tooltip-effect="dark" :height="tableHeight">

			<el-table-column label="订单详情">
				<template slot-scope="scope">
					<el-button size="mini" @click="detailmenu(scope.$index, scope.row)">详情</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="comments" label="备注">
			</el-table-column>
			<el-table-column label="订单类型">
				<template slot-scope="scope">
					<span v-if="scope.row.orderType=== '退款订单'" style="color: #F125B0;">{{scope.row.orderType}}</span>
					<span v-else-if="scope.row.orderType=== '折扣订单'" style="color: red;">{{scope.row.orderType}}</span>
					<span v-else-if="scope.row.orderType=== '核销订单'" style="color: #FC1461;">{{scope.row.orderType}}</span>
					<span v-else-if="scope.row.orderType=== '赊付日结'" style="color: #67C23A;">{{scope.row.orderType}}</span>
					<span v-else-if="scope.row.orderType=== '赊付周结'" style="color: #E6A23C;">{{scope.row.orderType}}</span>
					<span v-else-if="scope.row.orderType=== '赊付月结'" style="color: #909399;">{{scope.row.orderType}}</span>
				</template>
			</el-table-column>
			<el-table-column label="订单状态">
				<template slot-scope="scope">
					<span v-if="scope.row.new_order_state=== '已支付'" style="color:#67C23A;">{{scope.row.new_order_state}}</span>
					<span v-else-if="scope.row.new_order_state=== '未支付'" style="color: #F56C6C;">{{scope.row.new_order_state}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="address" label="重新打印" width="105">
				<template slot-scope="scope">
					<el-button size="mini" @click="MySendData(scope.$index, scope.row)">重新打印</el-button>
				</template>
			</el-table-column>
			<!-- <el-table-column prop="address" label="退换菜品">
				<template slot-scope="scope">
					<el-button size="mini" @click="exchange(scope.$index, scope.row)">换菜</el-button>
				</template>
			</el-table-column> -->
			<el-table-column label="退款">
				<template slot-scope="scope">
					<el-button size="mini" @click="tuikuan(scope.$index, scope.row)" :disabled="scope.row.new_order_state=== '未支付'||ArrayListmanger!='open'||scope.row.source=='会员'||scope.row.orderWay=='业务中台(导入)'">退款</el-button>
				</template>
			</el-table-column>

			<el-table-column prop="address" label="核销">
				<template slot-scope="scope">
					<el-button size="mini" @click="cancel(scope.$index, scope.row)" :disabled="scope.row.new_order_state=== '未支付'">核销</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="address" label="退款验证" width="105">
				<template slot-scope="scope">
					<el-button size="mini" @click="Verification(scope.$index, scope.row)" :disabled="scope.row.new_order_state=== '未支付'||scope.row.source=='会员'||scope.row.orderWay=='业务中台(导入)'">退款验证</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="payAmount" label="订单金额">
			</el-table-column>
			<el-table-column prop="actualAmount" label="实际金额">
			</el-table-column>
			<el-table-column prop="source" label="支付方式">
			</el-table-column>
			<el-table-column prop="orderWay" label="下单类型">
			</el-table-column>

			<el-table-column prop="orderCode" label="订单号">
			</el-table-column>
			<el-table-column prop="create_at" label="下单时间">
			</el-table-column>

			<el-table-column fixed="right" label="操作" width="78">
				<template slot-scope="scope">
					<el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
				</template>
			</el-table-column>
		</el-table>

		<div style="position: fixed;bottom: 0.625rem;right: 0;">
			<el-pagination background layout="prev, pager, next" :total="total" @current-change="current_change">
			</el-pagination>
		</div>
		<!-- 弹出框 -->
		<el-dialog title="退换菜品" :visible.sync="dialogVisible" width="20%" :before-close="handleClose">
			<div style="margin-bottom: 15px;">
				<span>需退菜品：</span>
				<el-select v-model="tuicai" placeholder="请选择">
					<el-option v-for="(item,index1) in options2" :key="item.value" :label="item.label" :value="index1+1+'_'+item.value">
					</el-option>
				</el-select>
			</div>
			<div style="margin-bottom: 25px;">
				<span>添加菜品：</span>
				<el-select v-model="tiancai" placeholder="请选择">
					<el-option v-for="(item,index2) in options" :key="item.value" :label="item.label" :value="index2+1+'_'+item.value">
					</el-option>
				</el-select>
			</div>
			<div style="margin-bottom: 25px;">
				<span>实际金额：</span>
				<el-input v-model="Actualamount" placeholder="请输入内容" style="width: 64%;"></el-input>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="exchangeup">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 弹出框桌号、备注 -->
		<el-dialog title="编辑" :visible.sync="dialogVisible2" width="20%" :before-close="handleClose">
			<div style="margin-bottom: 15px;">
				<span>桌号：</span>
				<el-input v-model="zhuohao" placeholder="请修改" class="width-input"></el-input>
				<!-- <el-select v-model="zhuohao" placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select> -->
			</div>
			<div style="margin-bottom: 25px;">
				<span>备注：</span>
				<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="comments" class="width-input"></el-input>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible2 = false">取 消</el-button>
				<el-button type="primary" @click="handleEditup">确 定</el-button>
			</span>
		</el-dialog>
		<!--退款弹框-->
		<el-dialog title="退款" :visible.sync="tuikuanVisible" width="40%" :before-close="handleClose">
			<div style="margin-bottom: 15px;">
				<span style="width: 15%;display: inline-block;">退款商品：</span>
				<el-select v-model="RefundDishes" placeholder="请选择退款商品" style='width: 60%;' @change="RefundDishesChange($event)">
					<el-option v-for="item in tableDatamenu" :key="item.name" :label="item.name" :value="item">
					</el-option>
				</el-select>
			</div>
			<div style="margin-bottom: 15px;">
				<span style="width: 15%;display: inline-block;">退款数量：</span>
				<el-input v-model="NumberofRefunds" type="serch" placeholder="请输入退款数量" style='width: 60%;' @blur="AmountCalculation"></el-input>
			</div>
			<div style="margin-bottom: 15px;">
				<span style="width: 15%;display: inline-block;">退款原因：</span>
				<el-select v-model="ReasonsforRefund" placeholder="请选择退款原因" style='width: 60%;'>
					<el-option v-for="item in ReasonsforRefundBox" :key="item.name" :label="item.name" :value="item.name">
					</el-option>
				</el-select>
			</div>
			<div style="margin-bottom: 15px;">
				<span style="width: 15%;display: inline-block;">商户单号：</span>
				<el-input v-model="trade" ref="inputVal" type="serch" placeholder="请输入商户单号" style='width: 60%;'></el-input>
			</div>
			<div style="margin-bottom: 15px;">
				<span style="width: 15%;display: inline-block;">退款合计：</span>
				<span style="color: red;font-size: 16px;">{{TotalRefund}}</span>
			</div>
			<div>
				<span style="width: 15%;display: inline-block;">退款金额：</span>
				<el-input v-model="refund" placeholder="请输入退款金额" style='width: 60%;'></el-input>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="tuikuanVisible = false">取 消</el-button>
				<el-button type="primary" @click="tuikuanup" :loading='loadwait'>确 定</el-button>
			</span>
		</el-dialog>
		<!-- 微信支付宝退款弹框 -->
		<el-dialog title="提示" :visible.sync="paymentpay" width="30%">
			<div style="width: 100%;display: flex;">
				<div style="margin-left: 10px;width: 50%;" @click="WeChat">
					<img src="../../assets/1.jpg" style="width: 100%;" />

				</div>
				<div style="margin-left: 10px;width: 50%;" @click="Alipay">
					<img src="../../assets/2.jpg" style="width: 100%;" />
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="paymentpay = false">取 消</el-button>
				<el-button type="primary" @click="paymentpay = false">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 详情 -->
		<el-dialog title="详情" :visible.sync="menudetails" width="50%" :before-close="handleClose">
			<el-table :data="tableDatamenu" stripe border class='table-center' :height='280' style="width: 100%">
				<el-table-column prop="name" label="商品名">
				</el-table-column>
				<el-table-column prop="price" label="商品原价">
				</el-table-column>
				<el-table-column prop="promotional_price" label="商品实价">
				</el-table-column>

				<el-table-column prop="order_amount" label="商品数量">
				</el-table-column>
				<el-table-column prop="actual_amount" label="小计">
				</el-table-column>
			</el-table>
			<span slot="footer" class="dialog-footer">
				<el-button @click="menudetails = false">取 消</el-button>

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
				refund: '',
				trade: '',
				ArrayListmanger:'',
				remark: '',
				pagesize: 10,
				currentPage: 1,
				tableDatamenu: [],
				total: 0,
				input: "",
				orderCode: '',
				NumberofRefunds: 1, //退款数量
				ReasonsforRefund: '', //退款原因
				TotalRefund: 0, //退款合计
				ReasonsforRefundBox: [{
						name: '价格贵'
					}, {
						name: '包装损坏'
					},
					{
						name: '食品安全'
					},
					{
						name: '其它'
					}
				],
				loading: true,
				RefundDishes: '',
				Actualamount: '',
				tableData: [],
				datetime: [],
				dialogVisible: false,
				dialogVisible2: false,
				tuikuanVisible: false,
				options: [],
				options2: [],
				tuicai: '',
				tiancai: '',
				zhuohao: '',
				can: '',
				shu: '',
				menudetails: false,
				jin: '',
				str: '',
				comments: '',
				productionCodetui: '',
				productionCodetian: '',
				jsondate: '',
				product: '',
				yanse: '#606266',
				xuhao: '0',
				actuals: '',
				orderCodedetail: '',
				source: '',
				actuals2: '',
				qrcode: '',
				tableHeight: window.innerHeight - 150,
				loadwait: false,
				totalfell: '',
				yinliancode: '',
				ChooseAmount: '', //选择菜品金额,
				Quantity: '', //商品数量,
				productionCode: "", //退菜商品编码
				discountTypeReasons: '', //退菜促销类型
				detailids: ''
			}
		},
		computed: {
			...mapState({
				username: state => state.userinfo.account,
				token: state => state.userinfo.token,
				id: state => state.userinfo.id,
				ArrayList: state => state.ArrayList,
				shopcode: state => state.userinfo.shopcode,
				shopname: state => state.ShopName.shopName,
				profilesettlement: state => state.ShopName.profile_settlement,
				profilequeuetype: state => state.ShopName.profile_queue_type
			})

		},
		methods: {
			RefundDishesChange(Vid) {
				let _self = this;
				console.log(Vid)
				_self.RefundDishes = Vid.name;
				_self.ChooseAmount = Vid.promotional_price;
				_self.Quantity = Vid.order_amount;
				_self.productionCode = Vid.production_code;
				_self.discountTypeReasons = Vid.discount_type;
				_self.detailids = Vid.id
				if (_self.NumberofRefunds > _self.Quantity) {
					_self.$message({
						message: '您输入的数量不能大于商品本身的数量哦',
						type: 'warning'
					});

				}
				_self.NumberofRefunds = Number(_self.NumberofRefunds)
				_self.TotalRefund = parseFloat(( _self.NumberofRefunds*_self.ChooseAmount).toPrecision(12))
			},
			AmountCalculation() {
				let _self = this;
				if (_self.NumberofRefunds > _self.Quantity) {
					_self.$message({
						message: '您输入的数量不能大于商品本身的数量哦',
						type: 'warning'
					});

				}
				if (_self.NumberofRefunds == 0) {
					_self.$message({
						message: '您的数量为0哦',
						type: 'warning'
					});
					return false
				}
				_self.NumberofRefunds = Number(_self.NumberofRefunds)
				_self.TotalRefund = parseFloat(( _self.NumberofRefunds*_self.ChooseAmount).toPrecision(12))
			},
			detailmenu(index) {
				let _self = this;
				_self.menudetails = true
				_self.tableDatamenu = _self.tableData[index].odrOrderDetailList
			},
			current_change: function(currentPage) {
				let _self = this;
				_self.currentPage = currentPage;
				let formData = new FormData();
				formData.append('shopCode', _self.shopcode);
				formData.append('pageNum', _self.currentPage);
				formData.append('pageSize', _self.pagesize);
				_self.axios.post(_self.ApiUrl + '/catering/getTodayAllOrder', formData).then(response => {
					if (response.data.errcode == '0') {
						_self.loading = false;
						_self.tableData = response.data.data.data.list;
						_self.total = response.data.data.data.total
						for (var i = 0; i < response.data.data.data.list.length; i++) {
							if (response.data.data.data.list[i].orderType == 'WITHDRAW_ORDER') {
								_self.tableData[i].orderType = '退款订单'
							} else if (response.data.data.data.list[i].orderType == 'DISCOUNT_ORDER') {
								_self.tableData[i].orderType = '折扣订单'
							} else if (response.data.data.data.list[i].orderType == 'NORMAL_ORDER') {
								_self.tableData[i].orderType = '核销订单'
							} else if (response.data.data.data.list[i].orderType == 'creditType.daily') {
								_self.tableData[i].orderType = '赊付日结'
							} else if (response.data.data.data.list[i].orderType == 'creditType.week') {
								_self.tableData[i].orderType = '赊付周结'
							} else if (response.data.data.data.list[i].orderType == 'creditType.month') {
								_self.tableData[i].orderType = '赊付月结'
							}
						}

					} else {
						_self.$message.error('列表加载失败请刷新重做');
					}
				}).catch(function(error) {
					_self.$message.error('数据响应过长，请重试');
				});

			},
			handleEdit(index, row) {
				this.dialogVisible2 = true;
				this.zhuohao = this.tableData[index].seatNum
				this.orderCode = this.tableData[index].orderCode
				this.comments = this.tableData[index].comments

			},
			qucan(index) {
				let _self = this;
				if (_self.tableData[index].orderWay == "业务中台点餐") {
					console.log(_self.tableData[index])
					var moneys = _self.tableData[index].actualAmount.toFixed(2)
					let formData = new FormData();
					formData.append('orderid', _self.tableData[index].orderCode);
					formData.append('shoping_name', _self.shopname);
					formData.append('foodnum', _self.tableData[index].serialNumber);
					formData.append('money', moneys);
					formData.append('order_status', _self.tableData[index].orderType);
					formData.append('paytime', _self.tableData[index].create_at);
					_self.axios.post(_self.realmphp + 'fwhmsgxp.php', formData, {
						// 单独配置
						withCredentials: false
					}).then(response => {
						if (response.data.errcode == '0') {
							_self.$message({
								message: '已提醒顾客取餐',
								type: 'success'
							});
						} else {
							_self.$message.error('用户没有扫描二维码，不能提醒顾客取餐');
						}
					}).catch(function(error) {
						_self.$message.error('数据响应过长，请重试');
					});
				} else {
					let formData = new FormData();
					formData.append('orderid', _self.tableData[index].orderCode);
					formData.append('foodnum', _self.tableData[index].serialNumber);
					_self.axios.post(_self.realmphp + 'dzfmsgqctx2.php', formData, {
						// 单独配置
						withCredentials: false
					}).then(response => {
						if (response.data.errcode == '0') {
							_self.$message({
								message: '已提醒顾客取餐',
								type: 'success'
							});
						} else {
							_self.$message.error('提醒取餐失败');
						}
					}).catch(function(error) {
						_self.$message.error('数据响应过长，请重试');
					});
				}

			},

			handleEditup() {
				let _self = this;
				let formData = new FormData();
				formData.append('orderCode', _self.orderCode);
				formData.append('seatNum', _self.zhuohao);
				formData.append('comments', _self.comments);
				_self.axios.post(_self.ApiUrl + '/catering/modifyOrderSeatNum', formData).then(response => {
					if (response.data.errcode == '0') {
						_self.dialogVisible2 = false
						_self.getstart()
					} else {
						_self.$message.error('编辑失败');
					}
				}).catch(function(error) {
					_self.$message.error('数据响应时间过长，请重试');
				});

			},
			//核销
			cancel(index, row) {
				let _self = this;
				let formData = new FormData();
				formData.append('orderCode', _self.tableData[index].orderCode);
				formData.append('userId', _self.id);
				// formData.append('productionCode', _self.product);
				_self.axios.post(_self.ApiUrl + '/catering/cancelAfterVerificationBtn', formData).then(response => {
					if (response.data.errcode == '0') {
						this.$message({
							message: '核销成功',
							type: 'success'
						});
						// _self.product=''
						_self.getstart();
					} else {
						_self.$message.error('核销失败');
					}
				}).catch(function(error) {
					_self.$message.error('数据响应时间过长，请重试');
				});
			},
			Verification(index) {
				let _self = this;
				if (_self.tableData[index].source == '微信') {
					let formData = new FormData();
					formData.append('orderCode', _self.tableData[index].orderCode);
					formData.append('payCode', _self.tableData[index].pay_code);
					formData.append('state', '0');
					// formData.append('productionCode', _self.product);
					_self.axios.post(_self.ApiUrls + '/pay/refundValidation', formData, {
						// 单独配置
						withCredentials: false
					}).then(response => {
						if (response.data.errcode == '0') {
							_self.$message({
								message: '验证结果：' + response.data.data.msg,
								type: 'success'
							});

						} else {
							_self.$message.error('退款验证失败');
						}
					}).catch(function(error) {
						_self.$message.error('数据响应时间过长，请重试');
					});
				} else if (_self.tableData[index].source == '支付宝') {
					let formData = new FormData();
					formData.append('orderCode', _self.tableData[index].orderCode);
					formData.append('payCode', _self.tableData[index].pay_code);
					formData.append('state', '1');
					// formData.append('productionCode', _self.product);
					_self.axios.post(_self.ApiUrls + '/pay/refundValidation', formData, {
						// 单独配置
						withCredentials: false
					}).then(response => {
						if (response.data.errcode == '0') {
							this.$message({
								message: '验证结果：' + response.data.data.msg,
								type: 'success'
							});

						} else {
							_self.$message.error('退款验证失败');
						}
					}).catch(function(error) {
						_self.$message.error('数据响应时间过长，请重试');
					});
				} else if (_self.tableData[index].source == '现金') {
					_self.$message({
						message: '现金退款请查看实际金额',
						type: 'warning'
					});
				} else if (_self.tableData[index].source == '银联') {
					_self.$message({
						message: '银联退款请查看实际金额',
						type: 'warning'
					});
				}

			},
			//更换菜品
			exchange(index, row) {
				let _self = this;
				//_self.product='';
				_self.actualAmount = '';
				let formData = new FormData();
				let formData2 = new FormData();
				formData.append('shopCode', _self.shopcode);
				formData2.append('orderCode', _self.tableData[index].orderCode);
				_self.axios.post(_self.ApiUrl + '/catering/getOrderDetailAllProductionName', formData2).then(
					response => {
						if (response.data.errcode == '0') {
							_self.dialogVisible = true
							_self.options2 = response.data.data.data

						} else {
							_self.$message.error('获取菜单失败');
						}
					}).catch(function(error) {
					_self.$message.error('error');
				});
				_self.axios.post(_self.ApiUrl + '/catering/getShopProduction', formData).then(response => {
					if (response.data.errcode == '0') {
						_self.options = response.data.data.data

					} else {
						_self.$message.error('获取菜单失败');
					}
				}).catch(function(error) {
					_self.$message.error('数据响应时间过长，请重试');
				});

			},
			//提交更换菜品
			exchangeup() {
				let _self = this;
				_self.product = ''
				var sex1 = _self.tuicai.indexOf("\_");
				var sex1s = _self.tuicai.substring(sex1, -1);
				sex1s = sex1s - 1
				var sex2 = _self.tiancai.indexOf("\_");
				var sex2s = _self.tiancai.substring(sex2, -1);
				sex2s = sex2s - 1

				let formData = new FormData();
				formData.append('orderCode', _self.options2[sex1s].orderCode);
				formData.append('newProductionCode', _self.options[sex2s].productionCode);
				formData.append('oldProductionCode', _self.options2[sex1s].productionCode);
				formData.append('price', _self.options[sex2s].price);
				formData.append('actualAmount', _self.Actualamount);
				formData.append('userId', _self.id);
				formData.append('productionCate', _self.options[sex2s].categoryName);
				_self.axios.post(_self.ApiUrl + '/catering/replaceDishBtn', formData).then(response => {
					console.log(response)
					if (response.data.errcode == '0') {
						//_self.product=response.data.data.data
						_self.dialogVisible = false;
						_self.tuicai = '';
						_self.tiancai = ''
						_self.actualAmount = '';
						console.log(_self.actualAmount)
						_self.getstart()
					} else {
						_self.$message.error('更换菜品失败');
					}
				}).catch(function(error) {
					_self.$message.error('数据响应时间过长，请重试');
				});
			},
			MySendData(index, row) {
				let _self = this;

				let namecode = '';

				let QrCodeTip = new FormData();
				QrCodeTip.append('str', 'QrCode');
				_self.axios.post(_self.ApiUrl + '/catering/getQrCodeTip', QrCodeTip).then(response => {

					if (response.data.errcode == '0') {

						namecode = response.data.data.data.value
						let getorder = new FormData();
						getorder.append('orderid', _self.tableData[index].orderCode);
						_self.axios.post(_self.realmphp + 'getorderqr.php', getorder, {
							// 单独配置
							withCredentials: false
						}).then(response => {

							if (response.data.expire_seconds == '86400') {

								_self.qrcode = response.data.url
								let formData = new FormData();
								formData.append('orderCode', _self.tableData[index].orderCode);
								formData.append('shopCode', _self.shopcode);
								formData.append('seatNum', _self.tableData[index].seatNum);
								formData.append('comments', _self.comments);
								formData.append('state', '0');
								_self.axios.post(_self.ApiUrl + '/catering/spreadFoodBtn', formData).then(response => {
									if (response.data.errcode == '0') {

										//创建小票打印页
										_self.jsondate = response.data.data
										var goodslist = _self.jsondate
										var hPos = 10, //小票上边距
											pageWidth = 580, //小票宽度
											rowHeight = 15, //小票行距
											//获取控件对象
											LODOP = getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'));
										//初始化
										 LODOP.PRINT_INIT("");
										//消费小票********************************************************************************************************
										LODOP.SET_PRINT_STYLE("FontSize", 9); //字体大小
										LODOP.ADD_PRINT_TEXT(hPos, 60, pageWidth, rowHeight, goodslist.shop);

										hPos += rowHeight;
										LODOP.ADD_PRINT_TEXT(hPos, 60, pageWidth, rowHeight, '零售收款单');
										hPos += rowHeight;
										LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, "单据日期:");
										LODOP.ADD_PRINT_TEXT(hPos, 60, pageWidth, rowHeight, goodslist.create_at);
										hPos += rowHeight;
										LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, "制单人:");
										LODOP.ADD_PRINT_TEXT(hPos, 60, pageWidth, rowHeight, goodslist.sales);
										hPos += rowHeight;
										LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, "销售单据号:");
										LODOP.ADD_PRINT_TEXT(hPos, 65, pageWidth, rowHeight, goodslist.orderCode);
										hPos += rowHeight;
										LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, "投诉电话:");
										LODOP.ADD_PRINT_TEXT(hPos, 60, pageWidth, rowHeight, goodslist.customer_service_number);
										hPos += rowHeight;
										LODOP.ADD_PRINT_LINE(hPos, 2, hPos, pageWidth, 2, 1);
										hPos += 5;
										LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, "数量");
										LODOP.ADD_PRINT_TEXT(hPos, 40, pageWidth, rowHeight, "订单价");
										LODOP.ADD_PRINT_TEXT(hPos, 90, pageWidth, rowHeight, "实销价");
										LODOP.ADD_PRINT_TEXT(hPos, 140, pageWidth, rowHeight, "折扣率");
										hPos += rowHeight;
										//遍历goodslist的商品数组
										for (var i = 0; i < goodslist.goodsList.length; i++) {

										 if (goodslist.goodsList[i].productionName.length < 7) {
										   LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, goodslist.goodsList[i].bar_code + goodslist.goodsList[i]
										     .productionName);
										   hPos += rowHeight;
										 } else if (goodslist.goodsList[i].productionName.length > 12 || goodslist.goodsList[i].bar_code.length > 12) {
                         LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, goodslist.goodsList[i].bar_code);
                       hPos += rowHeight;
										   LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, goodslist.goodsList[i].productionName);
										   hPos += rowHeight;

										 } else {

										   LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, goodslist.goodsList[i].bar_code + goodslist.goodsList[i]
										     .productionName);
										   hPos += rowHeight;
										 }
										  LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, goodslist.goodsList[i].orderAmount);
										  LODOP.ADD_PRINT_TEXT(hPos, 50, pageWidth, rowHeight, goodslist.goodsList[i].payAmount);
										  LODOP.ADD_PRINT_TEXT(hPos, 95, pageWidth, rowHeight, goodslist.goodsList[i].actual_amount);
										  LODOP.ADD_PRINT_TEXT(hPos, 150, pageWidth, rowHeight, parseInt(goodslist.goodsList[i].discountRate * 100) +
										    '%');
										  hPos += rowHeight;
										}
										//商品遍历打印完毕,空一行
										hPos += rowHeight;
										LODOP.ADD_PRINT_LINE(hPos, 2, hPos, pageWidth, 2, 1);
										hPos += 5;
										//合计
										LODOP.ADD_PRINT_TEXT(hPos, 70, pageWidth, rowHeight, "合计数量：" + goodslist.totalCount);
										hPos += rowHeight;
										// LODOP.ADD_PRINT_TEXT(hPos, 70, pageWidth, rowHeight, "合计金额：" + goodslist.orderPayment);
										// hPos += rowHeight;
										LODOP.ADD_PRINT_TEXT(hPos, 70, pageWidth, rowHeight, "实销金额：" + goodslist.total);
										hPos += rowHeight;
										LODOP.ADD_PRINT_TEXT(hPos, 70, pageWidth, rowHeight, "抹零金额：" + goodslist.maLing);
										hPos += rowHeight;
										LODOP.ADD_PRINT_LINE(hPos, 2, hPos, pageWidth, 2, 1);
										hPos += 5;
										LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, "本次收款金额：");
										hPos += rowHeight;
										LODOP.ADD_PRINT_TEXT(hPos, 80, pageWidth, rowHeight, goodslist.paymentMethod);

										LODOP.ADD_PRINT_TEXT(hPos, 120, pageWidth, rowHeight, "￥" + goodslist.total);
										hPos += rowHeight;
										LODOP.ADD_PRINT_LINE(hPos, 2, hPos, pageWidth, 2, 1);
										hPos += 5;
										LODOP.ADD_PRINT_TEXT(hPos, 2, pageWidth, rowHeight, (new Date()).toLocaleDateString() + " " + (new Date())
										  .toLocaleTimeString())
										hPos += rowHeight;
										LODOP.ADD_PRINT_TEXT(hPos, 25, pageWidth, rowHeight, "谢谢惠顾,欢迎下次光临!");
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
										_self.getstart()
									} else {
										_self.$message.error('传菜失败');
									}
								}).catch(function(error) {
									_self.$message.error('数据响应时间过长，请重试');
								});
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


			},
			CreatePrintPage(json) {
				//json 创建模拟服务器响应的订单信息对象


			},
			getstart() {
				let _self = this
				for(var i=0;i<_self.ArrayList.length;i++){
					if(_self.ArrayList[i].role=="MANAGER"||_self.ArrayList[i].role=="ADMIN"){
						_self.ArrayListmanger = 'open'
					}
				}

				let formData = new FormData();
				formData.append('shopCode', _self.shopcode);
				formData.append('pageNum', _self.currentPage);
				formData.append('pageSize', _self.pagesize);
				_self.axios.post(_self.ApiUrl + '/catering/getTodayAllOrder', formData).then(response => {

					if (response.data.errcode == '0') {
						_self.loading = false;
						_self.tableData = response.data.data.data.list;
						_self.total = response.data.data.data.total

						for (var i = 0; i < response.data.data.data.list.length; i++) {
							if (response.data.data.data.list[i].orderType == 'WITHDRAW_ORDER') {
								_self.tableData[i].xuhao = i + 1
								_self.tableData[i].orderType = '退款订单'
							} else if (response.data.data.data.list[i].orderType == 'DISCOUNT_ORDER') {
								_self.tableData[i].orderType = '折扣订单'
							} else if (response.data.data.data.list[i].orderType == 'NORMAL_ORDER') {
								_self.tableData[i].orderType = '核销订单'
							} else if (response.data.data.data.list[i].orderType == 'creditType.daily') {
								_self.tableData[i].orderType = '赊付日结'
							} else if (response.data.data.data.list[i].orderType == 'creditType.week') {
								_self.tableData[i].orderType = '赊付周结'
							} else if (response.data.data.data.list[i].orderType == 'creditType.month') {
								_self.tableData[i].orderType = '赊付月结'
							}

							if (response.data.data.data.list[i].new_order_state == '1') {

								_self.tableData[i].new_order_state = '已支付'
							} else if (response.data.data.data.list[i].new_order_state == '4') {
								_self.tableData[i].new_order_state = '已支付'
							} else if (response.data.data.data.list[i].new_order_state == '5') {
								_self.tableData[i].new_order_state = '已支付'
							} else if (response.data.data.data.list[i].new_order_state == '6') {
								_self.tableData[i].new_order_state = '已支付'
							} else if (response.data.data.data.list[i].new_order_state == '7') {
								_self.tableData[i].new_order_state = '已支付'
							} else if (response.data.data.data.list[i].new_order_state == '0') {
								_self.tableData[i].new_order_state = '未支付'
							}
						}
						// this.timeOut = setTimeout(() => {
						// 	_self.getstart();
						// }, 2000);
 this.timeOut = setTimeout(() => {
						 	_self.getstart();
						 }, 10000);
					} else {
						_self.$message.error('数据加载异常');
					}
				}).catch(function(error) {
					console.log(error.response);
					if (error.response.data.status == '403' || error.response.data.status == '302') {
						_self.$message.error('用户登录过期，请重新登录');
						_self.$router.push('/login')
						_self.$store.commit('SAVE_USERINFO', '')
						_self.axios.post(_self.ApiUrl + '/logout').then(response => {}).catch(function(error) {
							_self.$router.push('/login')
							_self.$store.commit('SAVE_USERINFO', '')
							_self.$store.commit('SAVE_ArrayList', '')
							_self.$store.commit('SAVE_ShopName', '')
						});
					} else if (error.response.data.status == '408') {
						_self.getstart();
					} else if (error.response.data.status == '504') {
						_self.getstart();
					} else {
						console.log(error)
					}

				});


			},
			search() {
				let _self = this;
				let formData = new FormData();
				formData.append('shopCode', _self.shopcode);
				formData.append('pageNum', _self.currentPage);
				formData.append('pageSize', _self.pagesize);
				formData.append('startTime', _self.datetime[0]);
				formData.append('endTime', _self.datetime[1]);
				_self.axios.post(_self.ApiUrl + '/catering/todayPageSearchOrder', formData).then(response => {
					if (response.data.errcode == '0') {
						_self.loading = false;
						_self.tableData = response.data.data.data.list
					} else {
						_self.$message.error('搜索错误');
					}
				}).catch(function(error) {
					_self.$message.error('数据响应时间过长，请重试');
				});

			},
			tuikuan(index) {
				let _self = this
				_self.trade = ''
				_self.refund = ''
				_self.tuikuanVisible = true
				_self.loadwait = false
				_self.$nextTick(function() {
					//DOM 更新了
					_self.$refs.inputVal.focus()
				})
				_self.actuals2 = _self.tableData[index].actualAmount
				_self.actuals = _self.tableData[index].actualAmount
				_self.actuals = parseInt(_self.actuals * 100)
				_self.tableDatamenu = _self.tableData[index].odrOrderDetailList
				_self.orderCodedetail = _self.tableData[index].orderCode
				_self.source = _self.tableData[index].source
				_self.yinliancode = _self.tableData[index].pay_code
			},
			tuikuanup() {
				let _self = this;

				if (_self.refund == '' || _self.RefundDishes == '' || _self.ReasonsforRefund == '') {
					_self.$message({
						type: 'warning',
						message: '请完善您的信息！',
						showClose: true,
					})
					return false
				}
				if (_self.NumberofRefunds > _self.Quantity) {
					_self.$message({
						message: '您输入的数量不能大于商品本身的数量哦',
						type: 'warning'
					});
					return false
				}
				if (_self.refund > _self.TotalRefund) {
					_self.$message({
						type: 'warning',
						message: '退款金额不能大于退款合计哦！',
						showClose: true,
					})
					return false
				}
				if (_self.NumberofRefunds == 0) {
					_self.$message({
						message: '您的数量为0哦',
						type: 'warning'
					});
					return false
				}
				if (_self.refund > _self.actuals2) {
					_self.$message({
						type: 'warning',
						message: '退款金额不能大于实际金额哦！',
						showClose: true,
					})
					return false
				}
				_self.tuikuanVisible = false
				_self.loadwait = true
				let formDatas = new FormData();
				formDatas.append('orderCode', _self.orderCodedetail);
				if (_self.source == '现金') {
					formDatas.append('payCode', "xianjin01");
					formDatas.append('state', '1');
				} else if (_self.source == '银联') {
					formDatas.append('payCode', _self.yinliancode);
					formDatas.append('state', '1');
				} else {
					formDatas.append('payCode', _self.trade);
					formDatas.append('state', '0');
				}
				_self.axios.post(_self.ApiUrls + '/buyer/findByOrderCodeAndPayCode', formDatas, {
					// 单独配置
					withCredentials: false
				}).then(response => {
					if (response.data.errcode == '0') {
						 _self.totalfell =parseFloat((response.data.data.data.pay_amount*100).toPrecision(12))
						if (response.data.data.data.source == '支付宝') {
							let formData = new FormData();
							var money =parseFloat((_self.refund*100).toPrecision(12))
							formData.append('out_trade_no', _self.trade);
							formData.append('refund_fee', money);
							_self.axios.post('http://pay.daisha.com.cn/alipay/f2fpay/refund.php', formData, {
								// 单独配置
								withCredentials: false
							}).then(response => {
								if (response.data.code == '10000') {
									_self.$message({
										type: 'success',
										message: '退款成功'
									});

									_self.loadwait = false
									var payCodes = response.data.out_trade_no
									let formData2 = new FormData();
									formData2.append('payCode', _self.trade);
									formData2.append('orderCode', _self.orderCodedetail);
									formData2.append('dishPayment', _self.refund);
									formData2.append('productionCode', _self.productionCode);
									formData2.append('amount', _self.NumberofRefunds);
									formData2.append('discountType', _self.discountTypeReasons);
									formData2.append('refundInstruction', _self.ReasonsforRefund);
									formData2.append('detailId', _self.detailids);
									formData2.append('userId', _self.id);
									formData2.append('source', "支付宝");
									formData2.append('state', "2");
									//发送请求
									_self.axios.post(_self.ApiUrls + '/buyer/resalesRefund', formData2, {
										// 单独配置
										withCredentials: false
									}).then(response => {

										if (response.data.errcode == '0') {
											_self.trade = '';
											_self.refund = '';
											_self.RefundDishes = '';
											_self.NumberofRefunds = 1;
											_self.detailids = '';
											_self.ReasonsforRefund = '';
											_self.discountTypeReasons = '';
											_self.productionCode = '';
											_self.TotalRefund = 0;

										} else {
											_self.$message.error('退款未载入今日订单');
										}

									}).catch(function(error) {
										_self.$message.error('响应时间过长，请重试');
									});

								} else {

									_self.$message.error(response.data.sub_msg);
									_self.loadwait = false
									var payCodes = response.data.out_trade_no;
									let formData2 = new FormData();
									formData2.append('payCode', payCodes);
									formData2.append('orderCode', _self.orderCodedetail);
									formData2.append('dishPayment', _self.refund);
									formData2.append('productionCode', _self.productionCode);
									formData2.append('amount', _self.NumberofRefunds);
									formData2.append('discountType', _self.discountTypeReasons);
									formData2.append('refundInstruction', _self.ReasonsforRefund);
									formData2.append('detailId', _self.detailids);
									formData2.append('userId', _self.id);
									formData2.append('source', "支付宝");
									formData2.append('state', "3");
									//发送请求
									_self.axios.post(_self.ApiUrls + '/buyer/resalesRefund', formData2, {
										// 单独配置
										withCredentials: false
									}).then(response => {

										if (response.data.errcode == '0') {
											_self.tuikuanVisible = false

											_self.trade = ''
											_self.refund = ''
										} else {
											_self.$message.error('退款失败未记录701');
										}

									}).catch(function(error) {
										_self.$message.error('响应时间过长，请重试');
									});

								}

							}).catch(function(error) {
								_self.$message.error('响应时间过长，请重试');
							});
						} else if (response.data.data.data.source == "微信") {
							let formData = new FormData();
								var money =parseFloat((_self.refund*100).toPrecision(12))
							formData.append('out_trade_no', _self.trade);
							formData.append('total_fee', _self.totalfell);
							formData.append('refund_fee', money);
							_self.axios.post(_self.realmphp + 'dcrefund.php', formData, {
								// 单独配置
								withCredentials: false
							}).then(response => {

								if (response.data.result_code == 'SUCCESS') {
									_self.$message({
										type: 'success',
										message: '退款成功'
									});

									_self.tuikuanVisible = false

									var payCodes = response.data.out_trade_no
									let formData2 = new FormData();
									formData2.append('payCode', payCodes);
									formData2.append('orderCode', _self.orderCodedetail);
									formData2.append('dishPayment', _self.refund);
									formData2.append('productionCode', _self.productionCode);
									formData2.append('amount', _self.NumberofRefunds);
									formData2.append('discountType', _self.discountTypeReasons);
									formData2.append('refundInstruction', _self.ReasonsforRefund);
									formData2.append('detailId', _self.detailids);
									formData2.append('userId', _self.id);
									formData2.append('source', "微信");
									formData2.append('state', "2");
									//发送请求
									_self.axios.post(_self.ApiUrls + '/buyer/resalesRefund', formData2, {
										// 单独配置
										withCredentials: false
									}).then(response => {

										if (response.data.errcode == '0') {
											_self.getstart()
											_self.trade = '';
											_self.refund = '';
											_self.RefundDishes = '';
											_self.NumberofRefunds = 1;
											_self.detailids = '';
											_self.ReasonsforRefund = '';
											_self.discountTypeReasons = '';
											_self.productionCode = '';
											_self.TotalRefund = 0;
										} else {
											_self.$message.error('未记录退款信息');
										}

									}).catch(function(error) {
										_self.$message.error('响应时间过长，请重试');
									});

								} else {
									if (response.data.err_code_des == undefined) {
										_self.$message.error(response.data.return_msg);
									} else {
										_self.$message.error(response.data.err_code_des);
									}


									let formData2 = new FormData();
									formData2.append('payCode', _self.trade);
									formData2.append('orderCode', _self.orderCodedetail);
									formData2.append('dishPayment', _self.refund);
									formData2.append('productionCode', _self.productionCode);
									formData2.append('amount', _self.NumberofRefunds);
									formData2.append('discountType', _self.discountTypeReasons);
									formData2.append('refundInstruction', _self.ReasonsforRefund);
									formData2.append('detailId', _self.detailids);
									formData2.append('userId', _self.id);
									formData2.append('source', "微信");
									formData2.append('state', "3");
									//发送请求
									_self.axios.post(_self.ApiUrls + '/buyer/resalesRefund', formData2, {
										// 单独配置
										withCredentials: false
									}).then(response => {

										if (response.data.errcode == '0') {
											_self.getstart()
											_self.trade = '';
											_self.refund = '';
											_self.RefundDishes = '';
											_self.NumberofRefunds = 1;
											_self.ReasonsforRefund = '';
											_self.TotalRefund = 0;
											_self.tuikuanVisible = false
										} else {
											_self.$message.error('退款失败响应异常');

										}

									}).catch(function(error) {
										_self.$message.error('响应时间过长，请重试');
									});
								}

							}).catch(function(error) {
								_self.$message.error('响应时间过长，请重试');
							});
						} else if (response.data.data.data.source == "现金") {
							if (_self.actuals2 >= _self.refund) {
								let formData2 = new FormData();

								formData2.append('payCode', 'xianjin01');
								formData2.append('orderCode', _self.orderCodedetail);
								formData2.append('dishPayment', _self.refund);
								formData2.append('productionCode', _self.productionCode);
								formData2.append('amount', _self.NumberofRefunds);
								formData2.append('discountType', _self.discountTypeReasons);
								formData2.append('refundInstruction', _self.ReasonsforRefund);
								formData2.append('detailId', _self.detailids);
								formData2.append('userId', _self.id);
								formData2.append('source', "现金");
								formData2.append('state', "2");
								//发送请求
								_self.axios.post(_self.ApiUrls + '/buyer/resalesRefund', formData2, {
									// 单独配置
									withCredentials: false
								}).then(response => {

									if (response.data.errcode == '0') {
										_self.tuikuanVisible = false
										_self.$message({
											type: 'success',
											message: '退款成功'
										});
										_self.trade = '';
										_self.refund = '';
										_self.RefundDishes = '';
										_self.NumberofRefunds = 1;
										_self.detailids = '';
										_self.ReasonsforRefund = '';
										_self.discountTypeReasons = '';
										_self.productionCode = '';
										_self.TotalRefund = 0;
									} else {
										_self.$message.error('退款失败');
										let formData2 = new FormData();

										formData2.append('payCode', 'xianjin01');
										formData2.append('orderCode', _self.orderCodedetail);
										formData2.append('dishPayment', _self.refund);
										formData2.append('productionCode', _self.productionCode);
										formData2.append('amount', _self.NumberofRefunds);
										formData2.append('discountType', _self.discountTypeReasons);
										formData2.append('refundInstruction', _self.ReasonsforRefund);
										formData2.append('detailId', _self.detailids);
										formData2.append('userId', _self.id);
										formData2.append('source', "现金");
										formData2.append('state', "3");
										//发送请求
										_self.axios.post(_self.ApiUrls + '/buyer/resalesRefund', formData2, {
											// 单独配置
											withCredentials: false
										}).then(response => {

											if (response.data.errcode == '0') {
												_self.tuikuanVisible = false
												_self.trade = '';
												_self.refund = '';
												_self.RefundDishes = '';
												_self.NumberofRefunds = 1;
												_self.detailids = '';
												_self.ReasonsforRefund = '';
												_self.discountTypeReasons = '';
												_self.productionCode = '';
												_self.TotalRefund = 0;

											} else {
												_self.$message.error('退款失败异常信息');
											}

										}).catch(function(error) {
											_self.$message.error('响应时间过长，请重试');
										});
									}

								}).catch(function(error) {
									_self.$message.error('响应时间过长，请重试');
								});
							} else {
								_self.$message.error('退款失败');
							}
						} else if (response.data.data.data.source == "银联") {
							if (_self.actuals2 >= _self.refund) {
								let formData2 = new FormData();
								formData2.append('payCode', 'yinlian');
								formData2.append('orderCode', _self.orderCodedetail);
								formData2.append('dishPayment', _self.refund);
								formData2.append('productionCode', _self.productionCode);
								formData2.append('amount', _self.NumberofRefunds);
								formData2.append('discountType', _self.discountTypeReasons);
								formData2.append('refundInstruction', _self.ReasonsforRefund);
								formData2.append('detailId', _self.detailids);
								formData2.append('userId', _self.id);
								formData2.append('source', "银联");
								formData2.append('state', "2");
								//发送请求
								_self.axios.post(_self.ApiUrls + '/buyer/resalesRefund', formData2, {
									// 单独配置
									withCredentials: false
								}).then(response => {

									if (response.data.errcode == '0') {
										_self.tuikuanVisible = false
										_self.trade = '';
										_self.refund = '';
										_self.RefundDishes = '';
										_self.NumberofRefunds = 1;
										_self.detailids = '';
										_self.ReasonsforRefund = '';
										_self.discountTypeReasons = '';
										_self.productionCode = '';
										_self.TotalRefund = 0;
										_self.$message({
											type: 'success',
											message: '退款成功'
										});
										_self.refund = ''
									} else {
										_self.$message.error('退款失败');
										let formData2 = new FormData();
										formData2.append('payCode', 'yinlian');
										formData2.append('orderCode', _self.orderCodedetail);
										formData2.append('dishPayment', _self.refund);
										formData2.append('productionCode', _self.productionCode);
										formData2.append('amount', _self.NumberofRefunds);
										formData2.append('discountType', _self.discountTypeReasons);
										formData2.append('refundInstruction', _self.ReasonsforRefund);
										formData2.append('detailId', _self.detailids);
										formData2.append('userId', _self.id);
										formData2.append('source', "银联");
										formData2.append('state', "3");
										//发送请求
										_self.axios.post(_self.ApiUrls + '/buyer/resalesRefund', formData2, {
											// 单独配置
											withCredentials: false
										}).then(response => {

											if (response.data.errcode == '0') {
												_self.tuikuanVisible = false
												_self.trade = '';
												_self.refund = '';
												_self.RefundDishes = '';
												_self.NumberofRefunds = 1;
												_self.detailids = '';
												_self.ReasonsforRefund = '';
												_self.discountTypeReasons = '';
												_self.productionCode = '';
												_self.TotalRefund = 0;
											} else {
												_self.$message.error('退款失败');
											}

										}).catch(function(error) {
											_self.$message.error('响应时间过长，请重试');
										});
									}

								}).catch(function(error) {
									_self.$message.error('响应时间过长，请重试');
								});
							} else {
								_self.$message.error('退款失败');
							}
						}

					} else {
						_self.$message.error(response.data.errmsg);
					}
				}).catch(function(error) {
					_self.$message.error('数据响应时间过长，请重试');
				});
				// 结束


			}

		},
		created: function() {
			let _self = this

			_self.getstart()
		}
	}
</script>
<style>
	* {
		padding: 0;
		margin: 0;
	}

	h1 {
		font-size: 20px;
	}

	h3 {
		font-size: 16px;
	}

	.left {
		float: left;
	}

	.right {
		float: right;
	}

	.clearfix {
		clear: both;
	}

	ul {
		list-style: none;
	}

	.print_container {
		padding: 20px;
		width: 188px;
	}

	.section1 {}

	.section2 label {
		display: block;
	}

	.section3 label {
		display: block;
	}

	.section4 {}

	.section4 .total label {
		display: block;
	}

	.section5 label {
		display: block;
	}

	.app-contion {
		margin: 10px;
	}

	.block {
		margin-bottom: 15px;
	}

	.titles {
		font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
		font-size: 14px;
		margin: 0 15px;
	}

	.title-color {
		color: red;
	}

	.width-input {
		width: 80%;
	}

	/* .el-button--primary {
		width: 73px;
	} */

	.el-table__body-wrapper {
		overflow-x: auto;
		overflow-y: auto;
	}
</style>
