<template>
	<div class="app-contion">
		<div style='margin:5px 0'>
			<el-row type="flex" class="row-bg" justify="center">
				<el-col :span="6">
					<div class="grid-content bg-purple">
						<el-button style='width:100%' @click='getstart'>日结</el-button>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="grid-content bg-purple-light">
						<el-button style='width:100%' @click='weeks'>周结</el-button>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="grid-content bg-purple">
						<el-button style='width:100%' @click='mounths'>月结</el-button>
					</div>
				</el-col>
			</el-row>
		</div>
		<el-table :data="tableData" v-loading="loading" border style="width: 100%;" tooltip-effect="dark" :height="tableHeight">

			<el-table-column label="桌号" prop="seatNum" v-if='profilequeuetype == "TABLE-NUM"'>
			</el-table-column>

			<el-table-column label="餐牌号" prop="serialNumber">
			</el-table-column>
			<el-table-column label="订单详情">
				<template slot-scope="scope">
					<el-button size="mini" @click="detailmenu(scope.$index, scope.row)">详情</el-button>
				</template>
			</el-table-column>
			<!-- <el-table-column prop="orderType" label="订单类型">
			</el-table-column> -->
			<el-table-column label="订单状态">
				<template slot-scope="scope">
					<span style="color: #67C23A;">{{scope.row.state}}</span>
				</template>
			</el-table-column>
			<!-- <el-table-column prop="address" label="重新打印" width="100">
				<template slot-scope="scope">
					<el-button size="mini" @click="MySendData(scope.$index, scope.row)">重新打印</el-button>
				</template>
			</el-table-column> -->

			<el-table-column label="加菜">
				<template slot-scope="scope">
					<el-button size="mini" @click="addmenuclick(scope.$index, scope.row)" v-if='scope.row.state=="待支付"'>加菜</el-button>
					<span v-if='scope.row.state=="已支付"'>不可加菜</span>
				</template>
			</el-table-column>
			<el-table-column label="退菜">
				<template slot-scope="scope">
					<el-button size="mini" @click="cancel(scope.$index, scope.row)" v-if='scope.row.state=="待支付"'>退菜</el-button>
					<span v-if='scope.row.state=="已支付"'>不可退菜</span>
				</template>
			</el-table-column>

			<el-table-column prop="pay_amount" label="订单金额">
			</el-table-column>
			<el-table-column prop="actualAmount" label="实际金额">
			</el-table-column>
			<el-table-column prop="orderCode" label="订单号">
			</el-table-column>
			<el-table-column prop="create_at" label="下单时间">
			</el-table-column>

			<el-table-column fixed="right" label="操作" width="370">
				<template slot-scope="scope">
					<el-button size="mini" type="danger" @click="otherpayment(scope.$index, scope.row)" v-if='scope.row.state=="待支付"'>移动支付</el-button>
					<el-button size="mini" type="warning" @click="cash(scope.$index, scope.row)" v-if='scope.row.state=="待支付"'>其它支付</el-button>
					<el-button size="mini" @click="discount(scope.$index, scope.row)" v-if='scope.row.state=="待支付"'>折扣</el-button>
					<el-button size="mini" type="primary" @click="yanzheng(scope.$index, scope.row)">验证</el-button>
				</template>
			</el-table-column>
		</el-table>

		<div style="position: fixed;bottom: 0.625rem;right: 0;">
			<el-pagination background layout="prev, pager, next" :total="total" @current-change="current_change">
			</el-pagination>
		</div>
		<!-- 详情 -->
		<el-dialog title="详情" :visible.sync="menudetails" width="50%" :before-close="handleClose">
			<el-table :data="tableDatamenu" stripe border class='table-center' :height='280' style="width: 100%">
				<el-table-column prop="name" label="菜品名">
				</el-table-column>
			<el-table-column
			  prop="price"
			  label="菜品原价"
			 >
			</el-table-column>
			<el-table-column
			  prop="promotional_price"
			  label="菜品实价"
			 >
			</el-table-column>
				<el-table-column prop="orderAmount" label="菜品数量">
				</el-table-column>
				<el-table-column prop="actual_amount" label="小计">
				</el-table-column>
			</el-table>
			<span slot="footer" class="dialog-footer">
				<el-button @click="menudetails = false">取 消</el-button>

			</span>
		</el-dialog>

		<!-- 退菜弹框 -->
		<el-dialog title="退菜" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
			<el-select v-model="valuemenu" placeholder="请选择" @change='tuicaibtn'>
				<el-option v-for="item in options" :key="item.productionCode" :label="item.name+'--'+item.actual_amount+'元'" :value="item">
				</el-option>
			</el-select>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="cancelup">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 移动支付 -->
		<el-dialog title="付款码" :visible.sync="tankuang" width="30%" :before-close="handleClose">
			<!-- <el-input v-model="code" placeholder="请输入内容" ref="inputVal" @keypress="searchGoods" type="serch"></el-input> -->

			<p style="margin-bottom: 10px;text-align: center;">总金额：
				<!-- <span style="color: #A52A2A;font-size: 16px;" v-if="moneyzhe!=''">{{moneyzhe}}元</span> -->
				<span style="color: #A52A2A;font-size: 16px;">{{allpayment}}元</span>
			</p>

			<form @submit.prevent action="#">
				<p style="margin: 12px 0;">请扫入支付码（或输入支付码按回车键结束）</p>
				<input v-model="code" placeholder="请输入支付码" ref="inputVal" type="serch" @keypress="searchGoods" class="keyinput">
			</form>

			<span slot="footer" class="dialog-footer">
				<el-button @click="tankuang = false">取 消</el-button>
			</span>
		</el-dialog>
		<!-- 其它支付 -->
		<el-dialog title="现金收款" :visible.sync="moneysum" width="50%" :before-close="handleClose">
			<el-tabs v-model="activeName" type="card">
				<el-tab-pane label="现金支付" name="first">
					<div style="position: relative;">

						<div style="display: flex;">
							<div>
								<label>应收：</label>
								<el-input v-model="allpayment" style="width: 70%;" :disabled="true"></el-input>
							</div>
							<div>
								<label>应找：</label>
								<el-input v-model="sum" placeholder="0" style="width: 70%;" :disabled="true"></el-input>
							</div>
						</div>
						<!--显示框-->
						<div id="calculator">
							<!--显示框-->
							<span>实收：</span>
							<input-box v-bind:input-show="inputShow">
							</input-box>
							<btn-list>
								<div @click="inputValue('1')" class=" btn-30 btn-radius">1</div>
								<div @click="inputValue('2')" class=" btn-30 btn-radius">2</div>
								<div @click="inputValue('3')" class=" btn-30 btn-radius">3</div>
								<div @click="inputValue('4')" class=" btn-30 btn-radius">4</div>
								<div @click="inputValue('5')" class=" btn-30 btn-radius">5</div>
								<div @click="inputValue('6')" class=" btn-30 btn-radius">6</div>
								<div @click="inputValue('7')" class=" btn-30 btn-radius">7</div>
								<div @click="inputValue('8')" class=" btn-30 btn-radius">8</div>
								<div @click="inputValue('9')" class=" btn-30 btn-radius">9</div>
								<div @click="inputValue('0')" class="btn-30 btn-radius">0</div>
								<div @click="inputValue('10')" class="btn-30 btn-radius">10</div>
								<div @click="inputValue('20')" class="btn-30 btn-radius">20</div>
								<div @click="inputValue('50')" class="btn-30 btn-radius">50</div>
								<div @click="inputValue('100')" class="btn-30 btn-radius">100</div>
								<div @click="inputValue('.')" class=" btn-30 btn-radius">.</div>
								<div @click="clearValue()" class=" btn-30 btn-radius color-red ">C</div>

								<div @click="backValue()" class=" btn-70 btn-radius color-red font-14">←</div>


							</btn-list>
						</div>
						<span slot="footer" class="dialog-footer" style="position: absolute;right:0.9375rem;bottom: 3rem">
							<div class="margin-butoms" style="margin-bottom:1.6rem">
								<el-button type="primary" @click="cashmoneyup" style="height: 60px;width: 6.5rem;">确 定</el-button>
							</div>
							<div class="margin-butoms" style="margin-bottom:1.6rem">
								<el-button type="success" @click="cashmoneyup" style="height: 60px;width:  6.5rem;">正 好</el-button>
							</div>
							<div>
								<el-button @click="cashquxiao" style="height: 60px;width: 6.5rem;">取 消</el-button>
							</div>
						</span>
					</div>
				</el-tab-pane>
				<el-tab-pane label="银联支付" name="second">

					<div style="position: relative;">
						<p style="margin: 12px 0;">请选择银行卡</p>
						<div class="idcards">
							<span :class="{'border-color':clicked==index}" v-for="(item,index) in UnionPayBox" :key="item.value" @click="UnionPayclick(index)">{{item.value}}</span>
						</div>
						<p style="margin: 12px 0;">应收金额</p>
						<!-- 	<p style="font-size: 40px;color: red;" v-if="moneyzhe!=''">{{moneyzhe}}</p> -->
						<p style="font-size: 40px;color: red;">{{allpayment}}</p>

						<span slot="footer" class="dialog-footer">
							<el-button @click="cashquxiao">取 消</el-button>
							<el-button type="primary" @click="UnionPayclickup">确 定</el-button>
						</span>
					</div>
				</el-tab-pane>
			</el-tabs>

		</el-dialog>

		<!-- 折扣 -->

		<el-dialog title="折扣金额提示" :visible.sync="rebate" width="50%" :before-close="handleClose">
			<p class='pfalg'>注意：如需兑换优惠卷，请先选择优惠券再选择折扣。</p>
			<el-tabs v-model="activeName2" type="card">
					<el-tab-pane label="优惠券" name="first">
					<div style="position: relative;">
						<div>
							<label>请输入核销码：</label>
							<el-input v-model="cancellation" placeholder="请输入核销码" style='width:50%'></el-input>
						</div>
						<p style='margin:10px 0'>请选择单张优惠金额：</p>
						<div>
							<span :class="{'border-color':discountclicked==index}" class="spans" v-for="(item,index) in Discountamount" :key="item.value"
							 @click="discountchange(index)">{{item.value}}</span>
						</div>
						<p style='margin:10px 0'>请选择优惠卷来源：</p>
						<div>
							<span :class="{'border-color':couponclicked==index}" class="spans" v-for="(item,index) in coupon" :key="item.value"
							 @click="couponchange(index)">{{item.value}}</span>
						</div>
						<el-button style='width:40%;margin:10px 0' @click="addcoupon">添加</el-button>
						<p style='margin:10px 0'>当前优惠券：</p>
						<el-table :data="coupontableData2" style='margin-bottom:20px'>
							<el-table-column prop="coupon_code" label="核销码">
							</el-table-column>
							<el-table-column prop="coupon_face_value" label="优惠金额">
							</el-table-column>
							<el-table-column prop="coupon_source" label="优惠来源">
							</el-table-column>
							<el-table-column prop="address" label="操作">
								<template slot-scope="scope">
									<el-button @click="handlecouponClick(scope.$index, scope.row)" size="mini">删除</el-button>
								</template>
							</el-table-column>
						</el-table>

						<span slot="footer" class="dialog-footer">
							<el-button @click="rebate = false">取 消</el-button>
							<el-button type="primary" @click="couponup">提 交</el-button>
						</span>
					</div>
				</el-tab-pane>
				<el-tab-pane label="折扣" name="second">
					<div style="position: relative;">
						<div style='margin-bottom:60px'>
							<span :class="{'border-color':clicked3==index}" class="spans" v-for="(item,index) in discountplay" :key="item.value"
							 @click="changedisxount(index)">{{item.code}}</span>
						</div>

						<span slot="footer" class="dialog-footer">
							<el-button @click="rebate = false">取 消</el-button>
							<el-button type="primary" @click="discountbtn">确 定</el-button>
						</span>
					</div>
				</el-tab-pane>


			</el-tabs>


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
				tableDatamenu: [],
				tableData: [

				],
				flags: '0',
				discountclicked: -1,
				couponclicked: -1,
				Discountamount: [], //优惠金额
				coupon: [], //优惠来源
				coupontableData: [], //获取优惠信息table,
				coupontableData2: [], //获取优惠信息table
				cancellation: '', //核销码
				activeName2: 'first',
				tableHeight: window.innerHeight - 160,
				currentPage: 1,
				rebate: false,
				pagesize: 10,
				dialogVisible: false,
				valuemenu: '',
				options: [],
				UnionPayBoxindex: '',
				productioncodes: '',
				orderCodeindex: '',
				menudetails: false,
				tankuang: false,
				code: '',
				keyword: '',
				discountplay: [],
				clicked: -1,
				clicked: -1,
				allpayment: '',
				orderCodeindex2: '',
				moneysum2: false,
				moneysum: false,
				activeName: 'first',
				sum: '',
				discountTypes: '',
				clicked3: -1,
				inputShow: {
					value: '0'
				},
				allPaymentmoney: '',
				codename: '',
				indextabe: '1',
				serialNumberins: '',
				UnionPayBox: [
				],
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
		computed: {
			...mapState({
				username: state => state.userinfo.account,
				token: state => state.userinfo.token,
				id: state => state.userinfo.id,
				shopcode: state => state.userinfo.shopcode,
				shopname: state => state.ShopName.shopName,
				profilesettlement: state => state.ShopName.profile_settlement,
				profilequeuetype: state => state.ShopName.profile_queue_type
			})

		},
		methods: {
			//添加优惠
			addcoupon() {
				let _self = this;
				let formData = new FormData();
				formData.append('orderCode', _self.orderCodeindex2);
				_self.axios.post(_self.ApiUrls + '/credit/whetherDiscount', formData, {
					// 单独配置
					withCredentials: false
				}).then(response => {
					if (response.data.errcode == '0') {
					if(response.data.data.list==''){
							if (_self.cancellation == '') {
								_self.$message({
									message: '请输入核销码',
									type: 'warning'
								});
								return false;
							}
							if (_self.discountclicked == -1) {
								_self.$message({
									message: '请选择优惠金额',
									type: 'warning'
								});
								return false;
							}
							if (_self.couponclicked == -1) {
								_self.$message({
									message: '请选择优惠来源',
									type: 'warning'
								});
								return false;
							}
							var moneycoupon = parseInt(_self.Discountamount[_self.discountclicked].value * 100)
							var newdata = {
								coupon_state: 0,
								coupon_type: 'vouchers',
								coupon_code: _self.cancellation,
								coupon_face_value: moneycoupon,
								coupon_actual_value:moneycoupon,
								coupon_source: _self.coupon[_self.couponclicked].value
							}
							var newdata2 = {
								coupon_state: 0,
								coupon_type: 'vouchers',
								coupon_code: _self.cancellation,
								coupon_actual_value:_self.Discountamount[_self.discountclicked].value,
								coupon_face_value: _self.Discountamount[_self.discountclicked].value,
								coupon_source: _self.coupon[_self.couponclicked].value
							}
							_self.allPaymentmoney += parseInt(_self.Discountamount[_self.discountclicked].value)
							_self.allPaymentmoney = parseInt(_self.allPaymentmoney)
							_self.coupontableData2.push(newdata2)
							_self.coupontableData.push(newdata)
							_self.cancellation = '';
							_self.discountclicked = -1;
							_self.couponclicked = -1;
						}else if(response.data.data.list[0].coupon_code=="discount_100"){
						if (_self.cancellation == '') {
							_self.$message({
								message: '请输入核销码',
								type: 'warning'
							});
							return false;
						}
						if (_self.discountclicked == -1) {
							_self.$message({
								message: '请选择优惠金额',
								type: 'warning'
							});
							return false;
						}
						if (_self.couponclicked == -1) {
							_self.$message({
								message: '请选择优惠来源',
								type: 'warning'
							});
							return false;
						}
						var moneycoupon = parseInt(_self.Discountamount[_self.discountclicked].value * 100)
						var newdata = {
							coupon_state: 0,
							coupon_type: 'vouchers',
							coupon_code: _self.cancellation,
							coupon_face_value: moneycoupon,
							coupon_actual_value:moneycoupon,
							coupon_source: _self.coupon[_self.couponclicked].value
						}
						var newdata2 = {
							coupon_state: 0,
							coupon_type: 'vouchers',
							coupon_code: _self.cancellation,
							coupon_actual_value:_self.Discountamount[_self.discountclicked].value,
							coupon_face_value: _self.Discountamount[_self.discountclicked].value,
							coupon_source: _self.coupon[_self.couponclicked].value
						}
						_self.allPaymentmoney += parseInt(_self.Discountamount[_self.discountclicked].value)
						_self.allPaymentmoney = parseInt(_self.allPaymentmoney)
						_self.coupontableData2.push(newdata2)
						_self.coupontableData.push(newdata)
						_self.cancellation = '';
						_self.discountclicked = -1;
						_self.couponclicked = -1;

						}else{
							_self.$message({
								message: '您已先选择折扣，不能再次添加优惠券,请先选择优惠券再选择折扣，谢谢',
								type: 'warning'
							});
							return false;
						}

					} else {
						_self.$message.error('添加失败，请刷新重试');
					}
				}).catch(function(error) {
					_self.$message.error('响应时间过长，请重试');
				});

			},
			//优惠选择更新
			couponup() {
				let _self = this;
				if (_self.coupontableData == '') {
					_self.$message({
						message: '您并没有 ‘ 添加 ’ 任何优惠方式',
						type: 'warning'
					});
					return false;
				}
				if (_self.allPaymentmoney > _self.allpayment) {
					_self.$message({
						message: '优惠金额只能小于或者等于订单金额',
						type: 'warning'
					});

					return false;
				}
				var newdata = {
					orderCode: _self.orderCodeindex2,
					list: _self.coupontableData
				}

				_self.axios.post(_self.ApiUrls+'/credit/addCoupons', {
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

						if (_self.indextabe == '1') {
							_self.getstart();
						} else if (_self.indextabe == '2') {
							_self.weeks();
						} else if (_self.indextabe == '3') {
							_self.mounths();
						}
						_self.rebate = false;
						_self.cancellation = '';
            _self.allPaymentmoney = 0;
						_self.discountclicked = -1;
						_self.couponclicked = -1;
						_self.coupontableData = [];
						_self.coupontableData2 = [];
					} else {
						_self.$message.error('提交失败，请重试'+response.data.errmsg);
					}
				}).catch(function(error) {
					_self.$message.error('响应时间过长，请重试');

				});
			},
			//删除优惠
			handlecouponClick(index) {
				let _self = this;
				console.log(index)
				_self.allPaymentmoney = _self.allPaymentmoney - _self.coupontableData2[index].coupon_actual_value
				_self.coupontableData2.splice(index, 1);
				_self.coupontableData.splice(index, 1)
			},
			//优惠金额选择
			discountchange(index) {
				let _self = this;
				_self.discountclicked = index

			},
			//优惠来源
			couponchange(index) {
				let _self = this;
				_self.couponclicked = index

			},
			//金额优惠
			moneydiscount() {
				let _self = this;
				let formData = new FormData();
				formData.append('code', 'coupon_code_vouchers_value');
				formData.append('shopCode', _self.shopcode);
				_self.axios.post(_self.ApiUrl + '/catering/enumerationSorting', formData).then(response => {
					if (response.data.errcode == '0') {
						_self.Discountamount = response.data.data.commentsGroup
					} else {
						_self.$message.error('加载优惠金额失败，请刷新重试');
					}
				}).catch(function(error) {
					_self.$message.error('响应时间过长，请重试');
				});
			},
			//优惠来源
			moneylaiyuan() {
				let _self = this;
				let formData = new FormData();
				formData.append('code', 'coupon_code_vouchers_source');
				formData.append('shopCode', _self.shopcode);
				_self.axios.post(_self.ApiUrl + '/catering/memberDiscount', formData).then(response => {
					if (response.data.errcode == '0') {
						_self.coupon = response.data.data.commentsGroup
					} else {
						_self.$message.error('加载优惠金额失败，请刷新重试');
					}
				}).catch(function(error) {
					_self.$message.error('响应时间过长，请重试');
				});
			},
			//详情
			detailmenu(index) {
				let _self = this;
				_self.menudetails = true
				_self.tableDatamenu = _self.tableData[index].orderDetailList
			},
			cashquxiao() {
				let _self = this;
				_self.inputShow.value = '0';
				_self.sum = '0'
				_self.moneysum = false;
			},
			changedisxount(index) {
				let _self = this;
				_self.indexdiscount = index
				_self.clicked3 = index
			},
			discount(index) {
				let _self = this;
				_self.rebate = true;
				_self.clicked = -1;
				_self.indexdiscount = -1;
				_self.clicked3 = -1;
				_self.discountclicked = -1;
				_self.cancellation = '';
				_self.couponclicked = -1;
				_self.orderCodeindex2 = _self.tableData[index].orderCode
				_self.allpayment = _self.tableData[index].actualAmount

				let formData2 = new FormData();
				formData2.append('code', 'coupon_code_discount');
				formData2.append('shopCode', _self.shopcode);
				_self.axios.post(_self.ApiUrl + '/catering/memberDiscount', formData2).then(response => {
					if (response.data.errcode == '0') {
						_self.discountplay = response.data.data.commentsGroup
						for (var i = 0; i < response.data.data.commentsGroup.length; i++) {
							if (response.data.data.commentsGroup[i].code == 'discount_90') {
								_self.discountplay[i].code = '九折'
							} else if (response.data.data.commentsGroup[i].code == 'discount_80') {
								_self.discountplay[i].code = '八折'
							} else if (response.data.data.commentsGroup[i].code == 'discount_70') {
								_self.discountplay[i].code = '七折'
							} else if (response.data.data.commentsGroup[i].code == 'discount_85') {
								_self.discountplay[i].code = '八点五折'
							} else if (response.data.data.commentsGroup[i].code == 'discount_60') {
								_self.discountplay[i].code = '六折'
							} else if (response.data.data.commentsGroup[i].code == 'discount_50') {
								_self.discountplay[i].code = '五折'
							} else if (response.data.data.commentsGroup[i].code == 'discount_00') {
								_self.discountplay[i].code = '免单'
							}else if (response.data.data.commentsGroup[i].code == 'discount_20') {
								_self.discountplay[i].code = '二折'
							}else if (response.data.data.commentsGroup[i].code == 'discount_30') {
								_self.discountplay[i].code = '三折'
							}else if (response.data.data.commentsGroup[i].code == 'discount_40') {
								_self.discountplay[i].code = '四折'
							}else if (response.data.data.commentsGroup[i].code == 'discount_10') {
								_self.discountplay[i].code = '一折'
							}
							else if (response.data.data.commentsGroup[i].code == 'discount_100') {
								_self.discountplay[i].code = '无折扣'
							}
						}
									let formDatas = new FormData();
						formDatas.append('orderCode', _self.orderCodeindex2);
						_self.axios.post(_self.ApiUrls + '/credit/whetherDiscount', formDatas, {
							// 单独配置
							withCredentials: false
						}).then(response => {
							if (response.data.errcode == '0') {
								if(response.data.data.list!=''){
										var zhekousd='';
										if (response.data.data.list[0].coupon_code == 'discount_90') {
											zhekousd = '九折'
										} else if (response.data.data.list[0].coupon_code == 'discount_80') {
											zhekousd = '八折'
										} else if (response.data.data.list[0].coupon_code == 'discount_70') {
											zhekousd = '七折'
										} else if (response.data.data.list[0].coupon_code == 'discount_85') {
											zhekousd = '八点五折'
										} else if (response.data.data.list[0].coupon_code == 'discount_60') {
											zhekousd = '六折'
										} else if (response.data.data.list[0].coupon_code == 'discount_50') {
											zhekousd = '五折'
										} else if (response.data.data.list[0].coupon_code == 'discount_00') {
											zhekousd = '免单'
										}else if (response.data.data.list[0].coupon_code == 'discount_20') {
											zhekousd = '二折'
										}else if (response.data.data.list[0].coupon_code == 'discount_30') {
											zhekousd = '三折'
										}else if (response.data.data.list[0].coupon_code == 'discount_40') {
											zhekousd = '四折'
										}else if (response.data.data.list[0].coupon_code == 'discount_10') {
											zhekousd = '一折'
										}
										else if (response.data.data.list[0].coupon_code == 'discount_100') {
											zhekousd = '无折扣'
										}

									for(var i=0;i<_self.discountplay.length;i++){
										if(zhekousd==_self.discountplay[i].code){
											_self.clicked3 = i
										}
									};
								}


							}
							else {
								_self.$message.error('没有获取成功哦');
							}
						}).catch(function(error) {
							_self.$message.error('响应时间过长，请重试');
						});
						_self.moneydiscount();
						_self.moneylaiyuan();
					} else {
						_self.$message.error('数据找不到啦，请刷新重试！');
					}
				}).catch(function(error) {
					_self.$message.error('响应时间过长，请重试');
				});
			},
			//折扣
			discountbtn() {
				let _self = this;
				if (_self.indexdiscount == -1) {
					_self.$message({
						message: '请选择折扣',
						type: 'warning'
					});
					return false
				}
				var zhekous = ''
				if (_self.discountplay[_self.indexdiscount].code == '九折') {
					_self.codename = '0.9'
					zhekous = "discount_90"
				} else if (_self.discountplay[_self.indexdiscount].code == '八折') {
					_self.codename = '0.8'
					zhekous = "discount_80"
				} else if (_self.discountplay[_self.indexdiscount].code == '七折') {
					_self.codename = '0.7'
					zhekous = "discount_70"
				} else if (_self.discountplay[_self.indexdiscount].code == '八点五折') {
					_self.codename = '0.85'
					zhekous = "discount_85"
				} else if (_self.discountplay[_self.indexdiscount].code == '六折') {
					_self.codename = '0.6'
					zhekous = "discount_60"
				} else if (_self.discountplay[_self.indexdiscount].code == '五折') {
					_self.codename = '0.5'
					zhekous = "discount_50"
				} else if (_self.discountplay[_self.indexdiscount].code == '免单') {
					_self.codename = '0'
					zhekous = "discount_00"
				}else if (_self.discountplay[_self.indexdiscount].code == '二折') {
					_self.codename = '0.2'
					zhekous = "discount_20"
				}else if (_self.discountplay[_self.indexdiscount].code == '三折') {
					_self.codename = '0.3'
					zhekous = "discount_30"
				}else if (_self.discountplay[_self.indexdiscount].code == '四折') {
					_self.codename = '0.4'
					zhekous = "discount_40"
				}else if (_self.discountplay[_self.indexdiscount].code == '一折') {
					_self.codename = '0.1'
					zhekous = "discount_10"
				}else if (_self.discountplay[_self.indexdiscount].code == '无折扣') {
					_self.codename = '1'
					zhekous = "discount_100"
				}
				let formData = new FormData();
				formData.append('orderCode', _self.orderCodeindex2);
				formData.append('discount', _self.codename);
				formData.append('shopCode', _self.shopcode);
				_self.axios.post(_self.ApiUrls + '/credit/creditDiscount', formData, {
					// 单独配置
					withCredentials: false
				}).then(response => {
					if (response.data.errcode == '0') {
						_self.rebate = false;
						this.$message({
							message: '操作成功',
							type: 'success'
						});
						var discounttable = [{
							coupon_code: zhekous,
							coupon_source: _self.shopcode,
							coupon_state: 0,
							coupon_type: 'discount',
							coupon_face_value: 0,
							coupon_actual_value:0
						}]
						var newdata = {
							orderCode: _self.orderCodeindex2,
							list: discounttable
						}
						_self.axios.post(_self.ApiUrls + '/credit/addCoupons', {
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


							} else {
								_self.$message.error('提交失败，请重试');
							}
						}).catch(function(error) {
							_self.$message.error('响应时间过长，请重试');

						});
						_self.flags = '1';
						_self.codename = '';
						_self.valuemenu = '';

						if (_self.indextabe == '1') {
							_self.getstart();
						} else if (_self.indextabe == '2') {
							_self.weeks();
						} else if (_self.indextabe == '3') {
							_self.mounths();
						}
					} else {
						_self.$message.error('操作失败');
					}
				}).catch(function(error) {
					_self.$message.error('数据响应过长，请重试');
				});
			},
			//计算器
			inputValue(param) {
				console.log(param)
				if (Object.prototype.toString.call(this.inputShow.value) == "[object Number]") { //判断输入框内容是否为数字类型
					this.inputShow.value = "0"; //数字类型说明是上个计算结果,清空内容
				}
				var str = '' + this.inputShow.value; //输入内容时,将输入框内容转为字符串类型
				var len = str.length;
				var arr = ["+", "-", "×", "÷"];
				var num = ('' + parseFloat(str.split('').reverse().join(''))).split('').reverse().join(''); //parseInt(str.split('').reverse().join('')))是获取输入框内最后一串数字,再反转回来 ,num为输入框内最后一串数字
				var nlen = num.length;
				if ((num != '0' && param != '.') || (param == '.' && num.indexOf(".") == -1)) { //输入框内最后一串数字不为0时拼接字符串
					if (arr.indexOf(str.charAt(len - 1)) != -1 && arr.indexOf(param) != -1) { //若一开始输入内容为运算符,输入无效
						return;
					}
					this.inputShow.value += param; //拼接输入内容
					console.log(this.inputShow.value)
				} else {
					arr.push("%");
					if (param == '.') { //若num中已有小数点,输入内容为小数点,视为无效
						return;
					} else if (!(arr.indexOf(param) != -1)) { //判断输入框内最后一个字符不为运算符
						this.inputShow.value = str.substring(0, str.length - nlen) + param; //输入框内最后一串数字为0时,删除0拼接
					}
				}
				this.sum = parseFloat(this.inputShow.value - this.allpayment).toFixed(2)
			},
			clearValue() { //清空输入框内容
				this.inputShow.value = '0';
				this.sum = '0'
			},
			backValue() {
				//删除键,删除单个字符
				var str = this.inputShow.value;
				if (str.length == 1) {
					this.inputShow.value = "0";
					this.sum = "0";
				} else {
					this.inputShow.value = str.slice(0, str.length - 1);
				}
			},
			//移动支付
			otherpayment(index) {
				let _self = this;
				_self.code = "";
				_self.tankuang = true;
				_self.allpayment = _self.tableData[index].actualAmount
				_self.orderCodeindex2 = _self.tableData[index].orderCode
				_self.serialNumberins = _self.tableData[index].serialNumber
				// _self.loadings = true;
				_self.$nextTick(function() {
					//DOM 更新了
					_self.$refs.inputVal.focus()
				})
			},
			//验证
			yanzheng(index) {
				let _self = this;

				var moneys = _self.tableData[index].actualAmount * 100
				let formDatas = new FormData();
				formDatas.append('orderCode', _self.tableData[index].orderCode);
				_self.axios.post(_self.ApiUrls + '/credit/creditVerifyPay', formDatas, {
					// 单独配置
					withCredentials: false
				}).then(response => {
					if(response.data.data.result.coupon_fee==undefined){
						var  couponfee1 = 0;
					}else{
						var  couponfee1 = Number(response.data.data.result.coupon_fee);
					}
					var cashfeeall1 = Number(response.data.data.result.cash_fee)+couponfee1;

					if (response.data.data.result.trade_state == 'SUCCESS' && response.data.data.result.result_code ==
						'SUCCESS' && response.data.data.result.return_code == 'SUCCESS' && cashfeeall1 ==
						moneys && response.data.data.result.total_fee == moneys && response.data.data.result.fee_type ==
						'CNY') {

						_self.$message({
							message: '该订单已付款,请核对',
							type: 'success'
						});
						if (_self.indextabe == '1') {
							_self.getstart();
						} else if (_self.indextabe == '2') {
							_self.weeks();
						} else if (_self.indextabe == '3') {
							_self.mounths();
						}
						let formData3 = new FormData();
						formData3.append('shopCode', _self.shopcode);
						formData3.append('orderCode', _self.tableData[index].orderCode);
						formData3.append('serialNumber', _self.tableData[index].serialNumber);
						//发送请求
						_self.axios.post(_self.ApiUrl + '/catering/cashSettlement', formData3).then(response => {
							if (response.data.errcode == '0') {
								_self.goodslist = response.data.data
								var json = _self.goodslist

								_self.print(_self.goodslist);

								//打印结束
							} else {
								_self.$message.error('打印菜单丢失了！');
							}
						}).catch(function(error) {
							_self.$message.error('响应时间过长，请重试');
						});

					} else {

						_self.$message.error('订单未支付');
					}
				}).catch(function(error) {
					_self.$message.error('响应时间过长，请重试');
				});

			},
			searchGoods(event) {

				let _self = this;

				if (event.keyCode == 13) {

					event.preventDefault(); //禁止默认事件（默认是换行）
					_self.keyword = event.target.value;

					_self.dialogVisible = false
					var money2 = _self.allpayment;


					var moneys = _self.allpayment * 100;

					if (Number(_self.keyword.slice(0, 2)) <= 15) {
						let formData = new FormData();
						formData.append('auth_code', _self.keyword);
						formData.append('total_fee', moneys);
						formData.append('orderid', _self.orderCodeindex2);
						formData.append('shop_name', _self.shopcode);
						//发送请求
						_self.axios.post(_self.realmphp + 'paymv2.php', formData, {
							// 单独配置
							withCredentials: false
						}).then(response => {
							if(response.data.coupon_fee==undefined){
								var  couponfee = 0;
							}else{
								var  couponfee = Number(response.data.coupon_fee);
							}
							var cashfeeall = Number(response.data.cash_fee)+couponfee;
							if (response.data.result_code == 'SUCCESS' && response.data.return_code == 'SUCCESS' && response.data.return_msg ==
								'OK' && response.data.total_fee == moneys && response.data.trade_state == 'SUCCESS' && cashfeeall ==
								moneys && response.data.fee_type == 'CNY') {
								_self.tankuang = false;
								_self.paymentpay = false;
								_self.serialnum = '';
								if (_self.indextabe == '1') {
									_self.getstart();
								} else if (_self.indextabe == '2') {
									_self.weeks();
								} else if (_self.indextabe == '3') {
									_self.mounths();
								}
								_self.$message({
									type: 'success',
									message: '付款成功，请前往今日订单查看'
								});
                if(response.data.out_trade_no==undefined||response.data.out_trade_no==''||response.data.out_trade_no==null){
                    console.log('payCode为：'+response.data.out_trade_no)
                }else{
                   let formData2 = new FormData();
                   formData2.append('state', 1);
                   formData2.append('payCode', response.data.out_trade_no);
                   formData2.append('orderCode', _self.orderCodeindex2);
                   formData2.append('payFeed', '成功');
                   formData2.append('source', '微信');
                   formData2.append('payAmount', money2);
                   formData2.append('userKey', '');

                   //发送请求
                   _self.axios.post(_self.ApiUrls + '/credit/creditOrderRecord', formData2, {
                   	// 单独配置
                   	withCredentials: false
                   }).then(response => {

                   	if (response.data.errcode == '0') {

                   		let formData3 = new FormData();
                   		formData3.append('shopCode', _self.shopcode);
                   		formData3.append('orderCode', _self.orderCodeindex2);
                   		formData3.append('serialNumber', _self.serialNumberins);
                   		//发送请求
                   		_self.axios.post(_self.ApiUrl + '/catering/cashSettlement', formData3).then(response => {

                   			if (response.data.errcode == '0') {
                   				_self.goodslist = response.data.data
                   				var json = _self.goodslist
                   				_self.print(_self.goodslist);
                   				//打印结束
                   				_self.moneyzhe = '';

                   			} else {
                   				_self.$message.error('打印失败');
                   			}

                   		}).catch(function(error) {
                   			_self.$message.error('打印失败');
                   		});

                   		if (_self.indextabe == '1') {
                   			_self.getstart();
                   		} else if (_self.indextabe == '2') {
                   			_self.weeks();
                   		} else if (_self.indextabe == '3') {
                   			_self.mounths();
                   		}

                   	} else {
                   		_self.$message.error('写入今日订单失败');
                   	}

                   }).catch(function(error) {
                   	_self.$message.error('响应时间过长，请重试');
                   });
                 }


							} else {
								var errcodedes = response.data.err_code_des;
								_self.serialnum = '';

								// 打印开始验证
								let formDatas = new FormData();
								formDatas.append('orderCode', _self.orderCodeindex2);
								_self.axios.post(_self.ApiUrls + '/credit/creditVerifyPay', formDatas, {
									// 单独配置
									withCredentials: false
								}).then(response => {
									if(response.data.data.result.coupon_fee==undefined){
										var  couponfee1 = 0;
									}else{
										var  couponfee1 = Number(response.data.data.result.coupon_fee);
									}
									var cashfeeall1 = Number(response.data.data.result.cash_fee)+couponfee1;
									if (response.data.data.result.trade_state == 'SUCCESS' && response.data.data.result.result_code ==
										'SUCCESS' && response.data.data.result.return_code == 'SUCCESS' && cashfeeall1 ==
										moneys && response.data.data.result.total_fee == moneys && response.data.data.result.fee_type ==
										'CNY') {

										_self.$message({
											message: '该订单已付款,请核对',
											type: 'success'
										});
										let formData3 = new FormData();
										formData3.append('shopCode', _self.shopcode);
										formData3.append('orderCode', _self.orderCodeindex2);
										formData3.append('serialNumber', _self.serialNumberins);
										//发送请求
										_self.axios.post(_self.ApiUrl + '/catering/cashSettlement', formData3).then(response => {
											if (response.data.errcode == '0') {
												_self.goodslist = response.data.data
												var json = _self.goodslist
												_self.tankuang = false;
												_self.print(_self.goodslist);

												//打印结束
											} else {
												_self.$message.error('打印菜单丢失了！');
											}
										}).catch(function(error) {
											_self.$message.error('响应时间过长，请重试');
										});

									} else {
										_self.tankuang = false;

										if (errcodedes == '' || errcodedes == undefined || errcodedes == null) {
											_self.$alert('订单未付款,请选择现金或者移动支付', '异常提示', {
												confirmButtonText: '确定',

											});
											if (_self.indextabe == '1') {
												_self.getstart();
											} else if (_self.indextabe == '2') {
												_self.weeks();
											} else if (_self.indextabe == '3') {
												_self.mounths();
											}
											_self.tankuang = false;

										} else {
											_self.$alert(errcodedes + ' , ' + '该订单未支付成功', '异常提示', {
												confirmButtonText: '确定',

											});
											if (_self.indextabe == '1') {
												_self.getstart();
											} else if (_self.indextabe == '2') {
												_self.weeks();
											} else if (_self.indextabe == '3') {
												_self.mounths();
											}
											_self.tankuang = false;
										}
									}
								}).catch(function(error) {
									_self.$message.error('响应时间过长，请重试');
								});
								//打印结束
								let formData = new FormData();
								formData.append('orderCode ', _self.orderCodeindex2);
								formData.append('payCode ', response.data.out_trade_no);
								formData.append('payBarCode', _self.keyword);
								formData.append('api', 'weixinbydc/paymv2.php');
								formData.append('result', response.data.err_code_des);
								_self.axios.post(_self.ApiUrls + '/pay/payApitrace', formData, {
									// 单独配置
									withCredentials: false
								}).then(response => {

								}).catch(function(error) {
									_self.$message.error('记录支付异常没有响应');
								});

							}

						}).catch(function(error) {
							console.log(error)
						});
					} else {
						let formDatas = new FormData();
						formDatas.append('auth_code', _self.keyword);
						formDatas.append('total_fee', moneys);
						formDatas.append('orderid', _self.orderCodeindex2);
						formDatas.append('shop_name', _self.shopcode);
						//发送请求
						_self.axios.post('http://pay.daisha.com.cn/alipay/f2fpay/barpay.php', formDatas, {
							// 单独配置
							withCredentials: false
						}).then(response => {

							if (response.data.code == "10000") {
                if(response.data.out_trade_no==undefined||response.data.out_trade_no==''||response.data.out_trade_no==null){
                    console.log('payCode为：'+response.data.out_trade_no)
                }else{
                   let formData2 = new FormData();
                   _self.serialnum = '';
                   formData2.append('state', 1);
                   formData2.append('payCode', response.data.out_trade_no);
                   formData2.append('orderCode', _self.orderCodeindex2);
                   formData2.append('payFeed', '成功');
                   formData2.append('source', '支付宝');
                   formData2.append('payAmount', money2);
                   formData2.append('userKey', '');

                   //发送请求
                   _self.axios.post(_self.ApiUrls + '/credit/creditOrderRecord', formData2, {
                   	// 单独配置
                   	withCredentials: false
                   }).then(response => {

                   	if (response.data.errcode == '0') {

                     if (_self.indextabe == '1') {
                   			_self.getstart();
                   		} else if (_self.indextabe == '2') {
                   			_self.weeks();
                   		} else if (_self.indextabe == '3') {
                   			_self.mounths();
                   		}
                   		_self.moneyzhe = '';
                   		_self.serialnum = '';
                   		let formData3 = new FormData();
                   		formData3.append('shopCode', _self.shopcode);
                   		formData3.append('orderCode', _self.orderCodeindex2);
                   		formData3.append('serialNumber', _self.serialNumberins);
                   		//发送请求
                   		_self.axios.post(_self.ApiUrl + '/catering/cashSettlement', formData3).then(response => {

                   			if (response.data.errcode == '0') {
                   				//console.log(response)
                   				_self.goodslist = response.data.data
                   				var json = _self.goodslist
                   				//打印
                   				_self.print(_self.goodslist);
                   				//打印结束

                   			} else {
                   				_self.$message.error('小票菜单详情获取失败');
                   			}

                   		}).catch(function(error) {
                   			_self.$message.error('小票菜单详情响应时间过长，请重试');
                   		});
                   		_self.$message({
                   			type: 'success',
                   			message: '付款成功，请前往今日订单查看'
                   		});
                   	} else {


                   	}

                   }).catch(function(error) {
                   	_self.$message.error('写入订单响应时间过长，请重试');

                   });
                 }


								if (_self.indextabe == '1') {
									_self.getstart();
								} else if (_self.indextabe == '2') {
									_self.weeks();
								} else if (_self.indextabe == '3') {
									_self.mounths();
								}
								_self.tankuang = false;
								_self.paymentpay = false;

							} else {
								var errcodedes = response.data.sub_msg
								_self.serialnum = '';

								//打印开始
								let formDatas = new FormData();
              formDatas.append('orderCode', _self.orderCodeindex2);
								_self.axios.post(_self.ApiUrls + '/credit/creditVerifyPay', formDatas, {
									// 单独配置
									withCredentials: false
								}).then(response => {
									if(response.data.coupon_fee==undefined){
										var  couponfee1 = 0;
									}else{
										var  couponfee1 = Number(response.data.coupon_fee);
									}
									var cashfeeall1 = Number(response.data.cash_fee)+couponfee1;
									if (response.data.result_code == 'SUCCESS' && response.data.return_code == 'SUCCESS' && response.data.return_msg ==
										'OK' && response.data.total_fee == moneys && response.data.trade_state == 'SUCCESS' && cashfeeall1 ==
										moneys && response.data.fee_type == 'CNY') {
										_self.$message({
											message: '该订单已付款,请核对',
											type: 'success'
										});
										let formData3 = new FormData();
										formData3.append('shopCode', _self.shopcode);
										formData3.append('orderCode', _self.orderCodeindex2);
										formData3.append('serialNumber', _self.serialNumberins);
										//发送请求
										_self.axios.post(_self.ApiUrl + '/catering/cashSettlement', formData3).then(response => {
											if (response.data.errcode == '0') {
												_self.goodslist = response.data.data
												var json = _self.goodslist

												_self.print(_self.goodslist);
												if (_self.indextabe == '1') {
													_self.getstart();
												} else if (_self.indextabe == '2') {
													_self.weeks();
												} else if (_self.indextabe == '3') {
													_self.mounths();
												}
												//打印结束
											} else {
												_self.$message.error('打印菜单丢失了！');
											}
										}).catch(function(error) {
											_self.$message.error('打印菜单响应时间过长，请重试');
										});

									} else {
										if (errcodedes == '' || errcodedes == undefined || errcodedes == null) {
											_self.$alert('该订单未支付成功', '异常提示', {
												confirmButtonText: '确定',

											});
											if (_self.indextabe == '1') {
												_self.getstart();
											} else if (_self.indextabe == '2') {
												_self.weeks();
											} else if (_self.indextabe == '3') {
												_self.mounths();
											}
											_self.tankuang = false;

										} else {
											_self.$alert(errcodedes + ' , ' + '该订单未支付成功', '异常提示', {
												confirmButtonText: '确定',

											});
											if (_self.indextabe == '1') {
												_self.getstart();
											} else if (_self.indextabe == '2') {
												_self.weeks();
											} else if (_self.indextabe == '3') {
												_self.mounths();
											}
											_self.tankuang = false;

										}
									}
								}).catch(function(error) {
									_self.$message.error('响应时间过长，请重试');
								});
								//打印结束
								let formData = new FormData();
								formData.append('orderCode ', _self.orderCodeindex2);
								formData.append('payCode ', response.data.out_trade_no);
								formData.append('payBarCode', _self.keyword);
								formData.append('api', 'alipay/f2fpay/barpay.php');
								formData.append('result', response.data.sub_msg);
								_self.axios.post(_self.ApiUrls + '/pay/payApitrace', formData, {
									// 单独配置
									withCredentials: false
								}).then(response => {

								}).catch(function(error) {
									_self.$message.error('记录支付异常没有响应');
								});
								_self.tankuang = false;
								_self.paymentpay = false;

							}

						}).catch(function(error) {
							_self.$message.error('响应时间过长，请重试1393');
						});
					}


				}

			},
			tuicaibtn(Vid) {
				let _self = this;
				_self.valuemenu = Vid.name
				_self.productioncodes = Vid.productionCode
				_self.discountTypes = Vid.discount_type

			},
			current_change: function(currentPage) {
				let _self = this;
				_self.currentPage = currentPage;
				if (_self.indextabe == '1') {
					let formData = new FormData();
					formData.append('shopCode', _self.shopcode);
					formData.append('pageNum', _self.currentPage);
					formData.append('pageSize', _self.pagesize);
					formData.append('orderType', 'creditType.daily');
					_self.axios.post(_self.ApiUrls + '/credit/getCreditList', formData, {
						// 单独配置
						withCredentials: false
					}).then(response => {
						if (response.data.errcode == '0') {

							_self.tableData = response.data.data.list.list;
							_self.total = response.data.data.list.total

							for (var i = 0; i < response.data.data.list.list.length; i++) {
								if (response.data.data.list.list[i].orderType == 'creditType.daily') {
									_self.tableData[i].orderType = '日结'
								} else if (response.data.data.list.list[i].orderType == 'creditType.week') {
									_self.tableData[i].orderType = '周结'
								} else if (response.data.data.list.list[i].orderType == 'creditType.month') {
									_self.tableData[i].orderType = '月结'
								}
								if (response.data.data.list.list[i].state == '0') {
									_self.tableData[i].state = '待支付'
								} else if (response.data.data.list.list[i].state == '1') {
									_self.tableData[i].state = '已支付'
								}
							}
						} else {
							_self.$message.error('列表加载失败请刷新重做');
						}
					}).catch(function(error) {
						_self.$message.error('数据响应过长，请重试');
					});
				} else if (_self.indextabe == '2') {
					let formData = new FormData();
					formData.append('shopCode', _self.shopcode);
					formData.append('pageNum', _self.currentPage);
					formData.append('pageSize', _self.pagesize);
					formData.append('orderType', 'creditType.week');
					_self.axios.post(_self.ApiUrls + '/credit/getCreditList', formData, {
						// 单独配置
						withCredentials: false
					}).then(response => {
						if (response.data.errcode == '0') {

							_self.tableData = response.data.data.list.list;
							_self.total = response.data.data.list.total

							for (var i = 0; i < response.data.data.list.list.length; i++) {
								if (response.data.data.list.list[i].orderType == 'creditType.month') {
									_self.tableData[i].orderType = '日结'
								} else if (response.data.data.list.list[i].orderType == 'creditType.week') {
									_self.tableData[i].orderType = '周结'
								} else if (response.data.data.list.list[i].orderType == 'creditType.month') {
									_self.tableData[i].orderType = '月结'
								}
								if (response.data.data.list.list[i].state == '0') {
									_self.tableData[i].state = '待支付'
								} else if (response.data.data.list.list[i].state == '1') {
									_self.tableData[i].state = '已支付'
								}
							}
						} else {
							_self.$message.error('列表加载失败请刷新重做');
						}
					}).catch(function(error) {
						_self.$message.error('数据响应过长，请重试');
					});
				} else if (_self.indextabe == '3') {
					let formData = new FormData();
					formData.append('shopCode', _self.shopcode);
					formData.append('pageNum', _self.currentPage);
					formData.append('pageSize', _self.pagesize);
					formData.append('orderType', 'creditType.month');
					_self.axios.post(_self.ApiUrls + '/credit/getCreditList', formData, {
						// 单独配置
						withCredentials: false
					}).then(response => {
						if (response.data.errcode == '0') {
							console.log(response)
							_self.tableData = response.data.data.list.list;
							_self.total = response.data.data.list.total

							for (var i = 0; i < response.data.data.list.list.length; i++) {
								if (response.data.data.list.list[i].orderType == 'creditType.daily') {
									_self.tableData[i].orderType = '日结'
								} else if (response.data.data.list.list[i].orderType == 'creditType.week') {
									_self.tableData[i].orderType = '周结'
								} else if (response.data.data.list.list[i].orderType == 'creditType.month') {
									_self.tableData[i].orderType = '月结'
								}
								if (response.data.data.list.list[i].state == '0') {
									_self.tableData[i].state = '待支付'
								} else if (response.data.data.list.list[i].state == '1') {
									_self.tableData[i].state = '已支付'
								}
							}
						} else {
							_self.$message.error('列表加载失败请刷新重做');
						}
					}).catch(function(error) {
						_self.$message.error('数据响应过长，请重试');
					});
				}


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
										var json = _self.jsondate
										var hPos = 10, //小票上边距
											pageWidth = 580, //小票宽度
											rowHeight = 15, //小票行距
											//获取控件对象
											LODOP = getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'));
										//初始化
										LODOP.PRINT_INIT("");
										//消费小票********************************************************************************************************
										//添加小票标题文本
										LODOP.SET_PRINT_STYLE("FontSize", 20); //字体大小
										LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, json.customed_title);
										hPos += rowHeight;
										hPos += rowHeight;
										LODOP.ADD_PRINT_TEXT(hPos, 60, pageWidth, rowHeight, json.serialNumber);
										hPos += rowHeight;
										hPos += rowHeight;
										LODOP.SET_PRINT_STYLE("FontSize", 8); //字体大小
										//开始
										LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, "店铺名称:");
										LODOP.ADD_PRINT_TEXT(hPos, 60, pageWidth, rowHeight, json.shop);
										//上边距往下移
										hPos += rowHeight;
										LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, "桌号:");
										LODOP.ADD_PRINT_TEXT(hPos, 60, pageWidth, rowHeight, json.seatNum);
										hPos += rowHeight;

										LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, "餐牌号:", "Bold");
										LODOP.ADD_PRINT_TEXT(hPos, 60, pageWidth, rowHeight, json.serialNumber);

										hPos += rowHeight;
										LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, "收银员:");
										LODOP.ADD_PRINT_TEXT(hPos, 60, pageWidth, rowHeight, _self.username);
										hPos += rowHeight;
										LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, "订单号:");
										LODOP.ADD_PRINT_TEXT(hPos, 60, pageWidth, rowHeight, json.orderCode);
										hPos += rowHeight;
										LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, "下单时间:");
										LODOP.ADD_PRINT_TEXT(hPos, 60, pageWidth, rowHeight, json.create_at);
										hPos += rowHeight;
										LODOP.ADD_PRINT_LINE(hPos, 2, hPos, pageWidth, 2, 1);
										hPos += 5;
										LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, "单价");
										LODOP.ADD_PRINT_TEXT(hPos, 50, pageWidth, rowHeight, "数量");
										LODOP.ADD_PRINT_TEXT(hPos, 90, pageWidth, rowHeight, "小计");
										LODOP.ADD_PRINT_TEXT(hPos, 140, pageWidth, rowHeight, "折扣率");
										hPos += rowHeight;
										//遍历json的商品数组
										for (var i = 0; i < json.goodsList.length; i++) {

											// if (json.goodsList[i].productionName.length < 4) {
											// 	LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, json.goodsList[i].productionName);
											// } else {
												//商品名字过长,其他字段需要换行
												LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, json.goodsList[i].productionName);
												hPos += rowHeight;
											// }
											LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, json.goodsList[i].promotional_price);
											LODOP.ADD_PRINT_TEXT(hPos, 50, pageWidth, rowHeight, json.goodsList[i].orderAmount);
											LODOP.ADD_PRINT_TEXT(hPos, 90, pageWidth, rowHeight, json.goodsList[i].actual_amount);
                       LODOP.ADD_PRINT_TEXT(hPos, 150, pageWidth, rowHeight, Number(goodslist.goodsList[i].discountRate) * 100+'%');
											hPos += rowHeight;
										}
										//商品遍历打印完毕,空一行
										hPos += rowHeight;
										//合计
										LODOP.ADD_PRINT_TEXT(hPos, 80, pageWidth, rowHeight, "合计:" + json.totalCount);
										LODOP.ADD_PRINT_TEXT(hPos, 130, pageWidth, rowHeight, "￥" + json.total);
										LODOP.ADD_PRINT_LINE(hPos, 2, hPos, pageWidth, 2, 1);
										hPos += rowHeight;
										hPos += rowHeight;
										LODOP.ADD_PRINT_TEXT(hPos, 2, pageWidth, rowHeight, (new Date()).toLocaleDateString() + " " + (new Date())
											.toLocaleTimeString())
										hPos += rowHeight;
										LODOP.ADD_PRINT_TEXT(hPos, 25, pageWidth, rowHeight, "谢谢惠顾,欢迎下次光临!");
										hPos += rowHeight;

										LODOP.ADD_PRINT_TEXT(hPos, 25, pageWidth, rowHeight, "监督电话：" + json.customer_service_number);
										hPos += rowHeight;
										LODOP.SET_PRINT_STYLE("FontSize", 12); //字体大小
										LODOP.ADD_PRINT_TEXT(hPos, 25, pageWidth, rowHeight, namecode);
										hPos += rowHeight;
										hPos += rowHeight;
										//初始化打印页的规格

										hPos += rowHeight;
										var toplist;
										toplist = json.goodsList.length * 24;
										var zonghetop;
										zonghetop = toplist + 300
										console.log(_self.qrcode)
										LODOP.ADD_PRINT_BARCODE(zonghetop, 40, 150, 150, "QRCode", _self.qrcode);
										LODOP.SET_PRINT_PAGESIZE(3, pageWidth, 45, 2);
										hPos += rowHeight;
										// 厨房小票**************************************************************************************************************
										hPos += rowHeight;
										hPos += rowHeight;
										hPos += rowHeight;
										hPos += rowHeight;

										//添加小票标题文本
										hPos += rowHeight;
										hPos += rowHeight;

										//打印预览
										//LODOP.PREVIEW();

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
			cash(index) {
				let _self = this;
				_self.moneyinput = ''
				_self.inputShow.value = '0';
				_self.sum = '0'
				_self.moneysum = true;
				_self.orderCodeindex2 = _self.tableData[index].orderCode
				_self.allpayment = _self.tableData[index].actualAmount
				_self.serialNumberins = _self.tableData[index].serialNumber
				let formData2 = new FormData();
				formData2.append('code', 'unionpay_type');
				//发送请求
				_self.axios.post(_self.ApiUrl + '/catering/memberDiscount', formData2).then(response => {

					if (response.data.errcode == '0') {
						console.log(response)
								_self.UnionPayBox=response.data.data.commentsGroup
					} else {
						_self.$message.error('获取银行卡失败，请刷新重试');
					}

				}).catch(function(error) {
					_self.$message.error('响应时间过长，请重试');
				});
			},
			//现金支付
			cashmoneyup() {

				let _self = this;

				_self.moneysum2 = false;
				_self.moneysum = false;
				var money2 = _self.allpayment;

				var moneys = _self.allpayment * 100;

				moneys = parseInt(moneys)


				let formData2 = new FormData();
				formData2.append('state', 1);
				formData2.append('payCode', 'xianjin01');
				formData2.append('orderCode', _self.orderCodeindex2);
				formData2.append('payFeed', '成功');
				formData2.append('source', '现金');
				formData2.append('payAmount', money2);
				formData2.append('userKey', '');

				//发送请求
				_self.axios.post(_self.ApiUrls + '/credit/creditOrderRecord', formData2, {
					// 单独配置
					withCredentials: false
				}).then(response => {
					if (response.data.errcode == '0') {

						_self.$message({
							type: 'success',
							message: '付款成功，请前往今日订单查看'
						});
						console.log(_self.indextabe)
						if (_self.indextabe == '1') {
							_self.getstart();
						} else if (_self.indextabe == '2') {
							_self.weeks();
						} else if (_self.indextabe == '3') {
							_self.mounths();
						}
						let formData3 = new FormData();
						formData3.append('shopCode', _self.shopcode);
						formData3.append('orderCode', _self.orderCodeindex2);
						formData3.append('serialNumber', _self.serialNumberins);
						//发送请求
						_self.axios.post(_self.ApiUrl + '/catering/cashSettlement', formData3).then(response => {
							console.log(response)
							if (response.data.errcode == '0') {

								_self.goodslist = response.data.data
								var json = _self.goodslist
								//打印
								_self.print(_self.goodslist);
								//打印结束

							} else {
								_self.$message.error('打印菜单加载失败');

								if (_self.indextabe == '1') {
									_self.getstart();
								} else if (_self.indextabe == '2') {
									_self.weeks();
								} else if (_self.indextabe == '3') {
									_self.mounths();
								}
							}

						}).catch(function(error) {
							_self.$message.error('响应时间过长，请重试');
						});
					} else {
						let formData2 = new FormData();
						formData2.append('state', 0);
						formData2.append('payCode', 'xianjin01');
						formData2.append('orderCode', _self.orderCodeindex2);
						formData2.append('payFeed', '失败');
						formData2.append('source', '现金');
						formData2.append('payAmount', money2);
						formData2.append('userKey', '');

						//发送请求
						_self.axios.post(_self.ApiUrls + '/credit/creditOrderRecord', formData2, {
							// 单独配置
							withCredentials: false
						}).then(response => {

							if (response.data.errcode == '0') {
								_self.serialNumberins = '';

								_self.$message({
									type: 'error',
									message: '现金支付失败，请重新操作'
								});

							} else {
								_self.$message.error('现金支付失败未写入');
							}

						}).catch(function(error) {
							_self.$message.error('响应时间过长，请重试');
						});
					}

				}).catch(function(error) {
					_self.$message.error('响应时间过长，请重试');
				});

			},
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
								for (var i = 0; i < goodslist.goodsList.length; i++) {
									orderInfos1 += '<B>' + goodslist.goodsList[i].productionName + '<BR>' + '                      ' + goodslist
										.goodsList[
											i].promotional_price + '     ' + goodslist.goodsList[i].orderAmount +
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
								for (var i = 0; i < goodslist.goodsList.length; i++) {
									orderInfos2 += '<FB><FS2>' + goodslist.goodsList[i].productionName + '\r' + '          ' + goodslist.goodsList[
											i].promotional_price +
										'          ' + goodslist.goodsList[i].orderAmount + '</FS2></FB>' + '\r'
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
									formDataOpen.append('orderCode', _self.orderCodeindex2);
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
								for (var j = 0; j < goodslist.goodsList.length; j++) {
									for (var b = 0; b < category_codes[i].categoryCodeList.length; b++) {
										if (goodslist.goodsList[j].categoryCode == category_codes[i].categoryCodeList[b]) {
											codes.push(goodslist.goodsList[j])
										}
									}
								}
								if (category_codes[i].type == 'F') {

									orderInfo2 = '<CB>' + goodslist.serialNumber + '</CB>' + '<BR>';
									orderInfo2 += '名称　　　 单价          数量<BR>';
									orderInfo2 += '--------------------------------<BR>';
									for (var c = 0; c < codes.length; c++) {
										orderInfo2 += '<B>' + codes[c].productionName + '<BR>' + '                      ' + codes[
												c].promotional_price + '     ' + codes[c].orderAmount +
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
										orderInfo2 += '<FB><FS2>' + codes[c].productionName + '\r' + '          ' + codes[c].promotional_price +
											'          ' + codes[c].orderAmount + '</FS2></FB>' + '\r'
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
									formDataOpens.append('orderCode', _self.orderCodeindex2);
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
							     LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, "单价");
							LODOP.ADD_PRINT_TEXT(hPos, 50, pageWidth, rowHeight, "数量");
							LODOP.ADD_PRINT_TEXT(hPos, 90, pageWidth, rowHeight, "小计");
							LODOP.ADD_PRINT_TEXT(hPos, 140, pageWidth, rowHeight, "折扣率");
								hPos += rowHeight;
								//遍历goodslist的商品数组
								for (var i = 0; i < goodslist.goodsList.length; i++) {

									// if (goodslist.goodsList[i].productionName.length < 4) {
									// 	LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, goodslist.goodsList[i].productionName);
									// } else {
										//商品名字过长,其他字段需要换行
										LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, goodslist.goodsList[i].productionName);
										hPos += rowHeight;
									// }
									LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, goodslist.goodsList[i].promotional_price);
									LODOP.ADD_PRINT_TEXT(hPos, 50, pageWidth, rowHeight, goodslist.goodsList[i].orderAmount);
									LODOP.ADD_PRINT_TEXT(hPos, 90, pageWidth, rowHeight, goodslist.goodsList[i].actual_amount);
                  LODOP.ADD_PRINT_TEXT(hPos, 150, pageWidth, rowHeight, Number(goodslist.goodsList[i].discountRate) * 100+'%');
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
			//退菜
			cancel(index) {
				let _self = this;
				_self.dialogVisible = true;
				_self.options = _self.tableData[index].orderDetailList
				_self.orderCodeindex = _self.tableData[index].orderCode


			},
			cancelup(index) {
				let _self = this;
				if(_self.valuemenu==''){
					_self.$message({
						type: 'warning',
						message: '您没有选择任何菜品哦！',
						showClose: true,
					})
					return false
				}
				let formData = new FormData();
				formData.append('orderCode', _self.orderCodeindex);
				formData.append('productionCode', _self.productioncodes);
				formData.append('discountType', _self.discountTypes);
				_self.axios.post(_self.ApiUrls + '/credit/returnDishes', formData, {
					// 单独配置
					withCredentials: false
				}).then(response => {
					if (response.data.errcode == '0') {
						_self.dialogVisible = false;
						this.$message({
							message: '退菜成功',
							type: 'success'
						});
						_self.valuemenu = ''
						if (_self.indextabe == '1') {
							_self.getstart();
						} else if (_self.indextabe == '2') {
							_self.weeks();
						} else if (_self.indextabe == '3') {
							_self.mounths();
						}
					} else {
						_self.$message.error('退菜失败');
					}
				}).catch(function(error) {
					_self.$message.error('退菜数据响应过长，请重试');
				});
			},
			//加菜
			addmenuclick(index) {
				let _self = this;
				_self.$router.push({
					path: '/addmenu',
					query: {
						orderCode: _self.tableData[index].orderCode,
						tablelist: _self.tableData[index].orderDetailList,
						tableData: _self.tableData[index]
					}
				})
			},
			getstart() {

				let _self = this;
				_self.indextabe = '1'
				let formData = new FormData();
				formData.append('shopCode', _self.shopcode);
				formData.append('pageNum', _self.currentPage);
				formData.append('pageSize', _self.pagesize);
				formData.append('orderType', 'creditType.daily');
				_self.axios.post(_self.ApiUrls + '/credit/getCreditList', formData, {
					// 单独配置
					withCredentials: false
				}).then(response => {
					if (response.data.errcode == '0') {
						console.log(response)
						_self.tableData = response.data.data.list.list;
						_self.total = response.data.data.list.total

						for (var i = 0; i < response.data.data.list.list.length; i++) {
							if (response.data.data.list.list[i].orderType == 'creditType.daily') {
								_self.tableData[i].orderType = '日结'
							} else if (response.data.data.list.list[i].orderType == 'creditType.week') {
								_self.tableData[i].orderType = '周结'
							} else if (response.data.data.list.list[i].orderType == 'creditType.month') {
								_self.tableData[i].orderType = '月结'
							}
							if (response.data.data.list.list[i].state == '0') {
								_self.tableData[i].state = '待支付'
							} else if (response.data.data.list.list[i].state == '1') {
								_self.tableData[i].state = '已支付'
							}
						}
					} else {
						_self.$message.error('列表加载失败请刷新重做');
					}
				}).catch(function(error) {
					_self.$message.error('数据响应过长，请重试');
				});

			},
			weeks() {
				let _self = this;
				_self.indextabe = '2'
				let formData = new FormData();
				formData.append('shopCode', _self.shopcode);
				formData.append('pageNum', _self.currentPage);
				formData.append('pageSize', _self.pagesize);
				formData.append('orderType', 'creditType.week');
				_self.axios.post(_self.ApiUrls + '/credit/getCreditList', formData, {
					// 单独配置
					withCredentials: false
				}).then(response => {
					if (response.data.errcode == '0') {
						_self.tableData = response.data.data.list.list;
						_self.total = response.data.data.list.total
						for (var i = 0; i < response.data.data.list.list.length; i++) {
							if (response.data.data.list.list[i].orderType == 'creditType.daily') {
								_self.tableData[i].orderType = '日结'
							} else if (response.data.data.list.list[i].orderType == 'creditType.week') {
								_self.tableData[i].orderType = '周结'
							} else if (response.data.data.list.list[i].orderType == 'creditType.month') {
								_self.tableData[i].orderType = '月结'
							}
							if (response.data.data.list.list[i].state == '0') {
								_self.tableData[i].state = '待支付'
							} else if (response.data.data.list.list[i].state == '1') {
								_self.tableData[i].state = '已支付'
							}
						}
					} else {
						_self.$message.error('列表加载失败请刷新重做');
					}
				}).catch(function(error) {
					_self.$message.error('数据响应过长，请重试');
				});

			},
			mounths() {

				let _self = this;
				_self.indextabe = '3'
				let formData = new FormData();
				formData.append('shopCode', _self.shopcode);
				formData.append('pageNum', _self.currentPage);
				formData.append('pageSize', _self.pagesize);
				formData.append('orderType', 'creditType.month');
				_self.axios.post(_self.ApiUrls + '/credit/getCreditList', formData, {
					// 单独配置
					withCredentials: false
				}).then(response => {
					if (response.data.errcode == '0') {
						console.log(response)
						_self.tableData = response.data.data.list.list;
						_self.total = response.data.data.list.total
						for (var i = 0; i < response.data.data.list.list.length; i++) {
							if (response.data.data.list.list[i].orderType == 'creditType.daily') {
								_self.tableData[i].orderType = '日结'
							} else if (response.data.data.list.list[i].orderType == 'creditType.week') {
								_self.tableData[i].orderType = '周结'
							} else if (response.data.data.list.list[i].orderType == 'creditType.month') {
								_self.tableData[i].orderType = '月结'
							}
							if (response.data.data.list.list[i].state == '0') {
								_self.tableData[i].state = '待支付'
							} else if (response.data.data.list.list[i].state == '1') {
								_self.tableData[i].state = '已支付'
							}
						}
					} else {
						_self.$message.error('列表加载失败请刷新重做');
					}
				}).catch(function(error) {
					_self.$message.error('数据响应过长，请重试');
				});

			},
			//银联
			UnionPayclick(index) {
				let _self = this;
				_self.clicked = index;

				_self.UnionPayBoxindex = _self.UnionPayBox[index].value
			},
			UnionPayclickup() {
				let _self = this;
				let types = ''
				var money2 = _self.allpayment;

				var moneys = _self.allpayment * 100;
				if (_self.UnionPayBoxindex == '') {
					_self.$message({
						message: '请选择银行卡',
						type: 'warning'
					});
					return false
				}

				let formData2 = new FormData();
				formData2.append('state', 1);
				formData2.append('payCode', _self.UnionPayBoxindex);
				formData2.append('orderCode', _self.orderCodeindex2);
				formData2.append('payFeed', '成功');
				formData2.append('source', '银联');
				formData2.append('payAmount', money2);
				formData2.append('userKey', '');

				//发送请求
				_self.axios.post(_self.ApiUrls + '/credit/creditOrderRecord', formData2, {
					// 单独配置
					withCredentials: false
				}).then(response => {

					if (response.data.errcode == '0') {

						_self.clicked = '-1';
						_self.serialnum = '';
						_self.UnionPayBoxindex = '';
						if (_self.indextabe == '1') {
							_self.getstart();
						} else if (_self.indextabe == '2') {
							_self.weeks();
						} else if (_self.indextabe == '3') {
							_self.mounths();
						}
						let formData3 = new FormData();
						formData3.append('shopCode', _self.shopcode);
						formData3.append('orderCode', _self.orderCodeindex2);
						formData3.append('serialNumber', _self.serialNumberins);
						//发送请求
						_self.axios.post(_self.ApiUrl + '/catering/cashSettlement', formData3).then(response => {
							if (response.data.errcode == '0') {
								_self.goodslist = response.data.data
								var json = _self.goodslist

								_self.print(_self.goodslist);
								//打印结束
							} else {
								_self.$message.error('打印菜单详情失败');
							}

						}).catch(function(error) {
							_self.$message.error('响应时间过长，请重试');
						});

						_self.$message({
							type: 'success',
							message: '付款成功，请前往今日订单查看'
						});
						_self.moneysum = false
					} else {
						_self.$message.error('支付失败');
						let formData2 = new FormData();
						_self.serialnum = '';
						formData2.append('state', 0);
						formData2.append('payCode', _self.UnionPayBoxindex);
						formData2.append('orderCode', _self.orderCodeindex2);
						formData2.append('payFeed', '失败');
						formData2.append('source', '银联');
						formData2.append('payAmount', money2);

						//发送请求
						_self.axios.post(_self.ApiUrls + '/credit/creditOrderRecord', formData2, {
							// 单独配置
							withCredentials: false
						}).then(response => {



						}).catch(function(error) {
							_self.$message.error('响应时间过长，请重试');
						});
					}

				}).catch(function(error) {
					_self.$message.error('响应时间过长，请重试');
				});


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


	.el-table__body-wrapper {
		overflow-x: auto;
		overflow-y: auto;
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

	.el-table--border th {
		text-align: center;
	}
</style>
