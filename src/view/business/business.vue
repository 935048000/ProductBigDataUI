<template>
  <div style="background: #f2f2f2;overflow: hidden;height: 100%;">
    <div class="kadianstyle">
      <!-- <el-button type="primary" plain @click="opendian" style="padding: 6px 15px;">开店</el-button>
		<el-button type="danger" plain @click="closedian" style="padding: 6px 15px;">闭店</el-button>
		<span style="color: red;margin-left: 15px;">{{state}}</span> -->
      <el-switch style="display: block" v-model="kaidianbtn" active-color="#13ce66" inactive-color="#ff4949"
        active-text="开 店" inactive-text="闭 店" @change="opendian">
      </el-switch>
    </div>
    <div class="app-contion" style="overflow: hidden;height: auto;display: flex;">
      <!-- <el-tabs v-model="activeName2" type="card" @tab-click="handleClick" style="width: 70%;">
			<el-tab-pane :label="item.categoryName" v-for='item in category' :key="item.categoryName" class="category-box"> -->

      <!-- 挂起菜单 -->
      <transition name="slide-fade">
        <div class="footerbus" style="z-index: 1000;background: #fff;border-radius: 0.625rem;position: fixed;right: 0;width: 33%;"
          v-show="isShow">
          <div class="close" @click="closemenus"><i class="el-icon-close"></i></div>
          <!-- 菜单 -->
          <div class="max-heights" v-bind:style="{ height: height+ 'px'}">
            <div class="caidan" v-for=" (item,index) in hangOrderDetail" :key="item.serialNumber">
              <div style="position: relative;font-size: 16px;">
                <div>创建时间：{{item.create_at}}</div>
                <div class="gua1">挂起{{item.serialNumber}}
                  <i class="el-icon-close" style="display: inline-block;padding: 0 2px;" @click="deletlist(index)"></i>
                </div>
              </div>
              <div class="navemeun">
                <div class="navemeun-chirld">
                  <!-- 循环菜单 -->
                  <div style="width: 100%;text-align: left;" v-for="(tab,index) in item.hangOrderDetailList" :key="index">
                    <span class="navemeun-span" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;display: inline-block;">{{tab.productionName}}</span>
                    <span class="navemeun-span">{{tab.price}}</span>
                    <span class="navemeun-span">{{tab.orderAmount}}份</span>
                  </div>
                </div>
                <div class="continue" @click="continues(index)">继续选购</div>
              </div>
            </div>

          </div>
        </div>
      </transition>
      <!-- 菜品 -->

      <div style="width: 60%;background: #FFFFFF;height: auto;border-radius: 0.625rem;padding: 0.3125rem;position: relative;">

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
              <!-- <div class="item-s" v-bind:class="{ 'activeshang': shangjia==index }">
							<i style="color: #67C23A;font-style: normal;">{{good.state}}</i>
						</div> -->
            </span>
            <span :class="{'border-color':clickeds==index}" @click="xiajiatop" v-else>{{good.productionName}}
              <i class="fenlei-i">￥{{good.price}}元</i>
              <!-- <div class="item-s" v-bind:class="{ 'activeshang': shangjia==index }">
							<i style="color: #67C23A;font-style: normal;">{{good.state}}</i>
						</div> -->
            </span>

            <!-- <button class="btn-shang" @click="shangjiabtn(index)">上架</button>
					<button class="btn-shang" style="background-color: #f56c6c;" @click="xiajiabtn(index)">下架</button> -->
          </div>
        </div>

        <div class="page-breaks">
          <ul class="page-uls">
            <li v-if="cur>1">
              <a v-on:click="cur--,pageClick()" class="el-icon-arrow-left"></a>
            </li>
            <li v-if="cur==1">
              <a class="banclick el-icon-arrow-left"></a>
            </li>
            <li v-for="(item,index) in indexs" v-bind:class="{'active':cur==item}" :key="index">
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
        <el-button plain class="check" style="width: 45%;margin: 2%;" @click="temporary">临时挂起</el-button>
        <el-button plain class="check" style="width: 45%;margin: 2%;" @click="history">历史小票</el-button>
        <el-table ref="table" :data="menudate" border :height="tableHeight" class='medatwidth' :header-cell-style="tableHeaderColor">
          <el-table-column prop="productionName" label="商品名称">
          </el-table-column>
          <el-table-column prop="promotional_price" label="商品单价">
          </el-table-column>
          <el-table-column prop="actual_amount" label="实际总价">
          </el-table-column>
          <el-table-column label="商品数量" fixed="right" width="130">
            <template slot-scope="scope">
              <el-button @click="cuts((scope.$index, scope.row))" class="adds" :loading="loadings2">-</el-button>
              <span style="width: 30px;display: inline-block;text-align: center;" @click="changequantic((scope.$index, scope.row))">{{scope.row.order_amount}}</span>
              <el-button @click="add((scope.$index, scope.row))" class="adds" :loading="loadings">+</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div>
          <!-- <el-button type="primary" plain @click='check' class="check" style="width: 97%;">下单</el-button> -->
          <div style="font-size: 17px;float: right;margin: 0.3125rem 0;">
            总价：
            <!-- <span style="color: #A52A2A;font-size: 16px;" v-if="moneyzhe!=''">{{moneyzhe}}元</span> -->
            <span style="color: #ff545a;font-size: 21px;">{{allmenudate.allPayment}}元</span>

          </div>
          <div style="clear: both;"></div>
          <el-radio-group v-model="checkboxGroup" :max="1" style='width: 93%;' @change="checkbtn" size="small">
            <div style="float: left;margin-top: 0.3125rem;margin-left: 0.9875rem;">
              <el-radio :label="0" border style="margin-right: 1px;">{{SelfTaking}}</el-radio>
              <el-radio :label="1" border style="margin-right:5px;">{{distribution}}</el-radio>
            </div>
            <div style="float: right;">
              <!-- <el-button @click="idcard" style="padding: 0;padding: 8px 14px 7px 14px;border-radius: 4px; border: 1px solid #dcdfe6; -webkit-box-sizing: border-box; box-sizing: border-box;   border-radius: 4px;  border: 1px solid #dcdfe6; -webkit-box-sizing: border-box; box-sizing: border-box; ">银联支付</el-button> -->
              <el-button type="danger" class=" btn-foot" @click="clearCartList" style="padding: 0;padding: 8px 14px 7px 14px;border-radius: 4px; border: 1px solid #dcdfe6; -webkit-box-sizing: border-box; box-sizing: border-box;   border-radius: 4px;  border: 1px solid #dcdfe6; -webkit-box-sizing: border-box; box-sizing: border-box;margin-left: 5px; ">一键清空</el-button>
            </div>
            <div style="clear: both;"></div>
          </el-radio-group>

          <el-button @click="guamen" style="width: 45%;line-height: 50px;margin: 0; margin:1% 1.5%;padding: 0.3125rem 0.625rem;">挂起菜单</el-button>
          <el-button style="width: 45%;line-height: 50px;margin: 0;margin:1% 1.5%;padding: 0.3125rem 0.625rem;" @click="cash">其他支付</el-button>
          <el-button style="width: 45%;line-height: 50px;margin: 0;margin:1% 1.5%;padding: 0.3125rem 0.625rem;" @click="otherpayment">移动支付</el-button>
          <el-button @click="discount" style="width: 45%;line-height: 50px;margin: 0;margin:1% 1.5%;padding: 0.3125rem 0.625rem;"
            :disabled="profilesettlement=='POST-PAY'">折扣价</el-button>
        </div>
      </div>
      <!-- 弹框 添加购物车-->
      <el-dialog :title="production.productionName" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <div class="flower">
          <div class="guige-title">规格</div>
          <span :class="{'border-color':clicked==index}" v-for="(item,index) in production.productionSizes" :key="item.size"
            @click="prosize(index)">{{item.size}}</span>
          <span style="border: 2px solid red;" v-if="production.productionSizes==null">默认</span>
          <div class="guige-title">常用备注</div>
          <span :class="{'border-color':clickeds2==index}" v-for="(item,index) in commentsGroup" :key="item.value"
            @click="procoment(index)">{{item.value}}</span>
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
          <el-button type="primary" @click="addmenu(tab)">添 加</el-button>
        </span>
      </el-dialog>

      <!-- 微信支付宝弹框 -->
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
      <!-- 支付弹框 -->
      <el-dialog title="付款码" :visible.sync="tankuang" width="30%" :before-close="handleClose">
        <!-- <el-input v-model="code" placeholder="请输入内容" ref="inputVal" @keypress="searchGoods" type="serch"></el-input> -->

        <p style="margin-bottom: 10px;text-align: center;">总金额：
          <!-- <span style="color: #A52A2A;font-size: 16px;" v-if="moneyzhe!=''">{{moneyzhe}}元</span> -->
          <span style="color: #A52A2A;font-size: 16px;">{{allmenudate.allPayment}}元</span>
        </p>
        <div style="margin: 10px 0;" v-if='profilequeuetype=="TABLE-NUM"'>
          <p style="margin: 12px 0;">请输入桌号</p>
          <el-input v-model="zhuosum" placeholder="请输入桌号" style="width: 60%;"></el-input>
        </div>
        <form @submit.prevent action="#">
          <p style="margin: 12px 0;">请扫入支付码（或输入支付码按回车键结束）</p>
          <input v-model="code" placeholder="请输入支付码" ref="inputVal" type="serch" @keypress="searchGoods" class="keyinput">
        </form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="tankuang = false">取 消</el-button>
        </span>
      </el-dialog>
      <!--金额计算-->
      <!-- <el-dialog title="请输入已给金额" :visible.sync="moneysum" width="30%" :before-close="handleClose">
			<el-input v-model="moneyinput" placeholder="请输入已给现金" ref="inputVal2" type="serch"></el-input>
			<span slot="footer" class="dialog-footer">
				<el-button @click="moneysum = false">取 消</el-button>
				<el-button type="primary" @click="cashup">确 定</el-button>
			</span>
		</el-dialog> -->

      <!-- <el-dialog title="已找金额" :visible.sync="moneysum2" width="30%" :before-close="handleClose">
			<span style="font-size: 50px;">{{sum}}</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="moneysum2 = false">取 消</el-button>
				<el-button type="primary" @click="cashmoneyup">确 定</el-button>
			</span>
		</el-dialog> -->
      <el-dialog title="现金收款" :visible.sync="moneysum" width="50%" :before-close="handleClose">
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="现金支付" name="first">
            <div style="position: relative;">
              <div style="margin: 10px 0;" v-if='profilequeuetype=="TABLE-NUM"'>
                <p style="margin: 12px 0;">请输入桌号</p>
                <el-input v-model="zhuosum" placeholder="请输入桌号" style="width: 60%;"></el-input>
              </div>
              <div style="display: flex;">
                <div>
                  <label>应收：</label>
                  <el-input v-model="allmenudate.allPayment" placeholder="应收金额" style="width: 70%;" :disabled="true"></el-input>
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
                  <el-button type="primary" @click="cashmoneyup" style="height: 60px;width: 6.5rem;" :loading='loadingcash'>确
                    定</el-button>
                </div>
                <div class="margin-butoms" style="margin-bottom:1.6rem">
                  <el-button type="success" @click="cashmoneyup" style="height: 60px;width:  6.5rem;" :loading='loadingcash'>正
                    好</el-button>
                </div>
                <div>
                  <el-button @click="cashquxiao" style="height: 60px;width: 6.5rem;">取 消</el-button>
                </div>
              </span>
            </div>
          </el-tab-pane>
          <el-tab-pane label="银联支付" name="second">
            <div style="margin: 10px 0;" v-if='profilequeuetype=="TABLE-NUM"'>
              <p style="margin: 12px 0;">请输入桌号</p>
              <el-input v-model="zhuosum" placeholder="请输入桌号" style="width: 60%;"></el-input>
            </div>
            <div style="position: relative;">
              <p style="margin: 12px 0;">请选择银行卡</p>
              <div class="idcards">
                <span :class="{'border-color':clicked==index}" v-for="(item,index) in UnionPayBox" :key="item.value"
                  @click="UnionPayclick(index)">{{item.value}}</span>
              </div>
              <p style="margin: 12px 0;">应收金额</p>
              <!-- 	<p style="font-size: 40px;color: red;" v-if="moneyzhe!=''">{{moneyzhe}}</p> -->
              <p style="font-size: 40px;color: red;">{{allmenudate.allPayment}}</p>

              <span slot="footer" class="dialog-footer">
                <el-button @click="cashquxiao">取 消</el-button>
                <el-button type="primary" @click="UnionPayclickup" :loading='loadingcash1'>确 定</el-button>
              </span>
            </div>
          </el-tab-pane>
          <el-tab-pane label="先赊后结" name="third" v-if='profilesettlement=="POST-PAY"'>
            <div style="position: relative;">
              <p style="margin: 12px 0;">请选择赊账方式</p>
              <div class="idcards">
                <span :class="{'border-color':clickedshe==index}" v-for="(item,index) in oncreditstyle" :key="item"
                  @click="oncreditclick(index)">{{item}}</span>
              </div>
              <div style="margin: 10px 0;" v-if='profilequeuetype=="TABLE-NUM"'>
                <p style="margin: 12px 0;">请输入桌号</p>
                <el-input v-model="zhuosum" placeholder="请输入桌号" style="width: 60%;"></el-input>
              </div>
              <p style="margin: 12px 0;">应收金额</p>
              <!-- 	<p style="font-size: 40px;color: red;" v-if="moneyzhe!=''">{{moneyzhe}}</p> -->
              <p style="font-size: 40px;color: red;">{{allmenudate.allPayment}}</p>

              <span slot="footer" class="dialog-footer">
                <el-button @click="cashquxiao">取 消</el-button>
                <el-button type="primary" @click="oncreditclickup" :loading='loadingcash'>确 定</el-button>
              </span>
            </div>
          </el-tab-pane>
          <el-tab-pane label="会员支付" name="four">
            <div style="position: relative;">

              <p style="margin: 12px 0;">应收金额</p>
              <!-- 	<p style="font-size: 40px;color: red;" v-if="moneyzhe!=''">{{moneyzhe}}</p> -->
              <p style="font-size: 40px;color: red;">{{allmenudate.allPayment}}</p>
              <div style="margin: 20px 0;" v-if='profilequeuetype=="TABLE-NUM"'>
                <p style="margin: 12px 0;">请输入桌号</p>
                <el-input v-model="zhuosum" placeholder="请输入桌号" style="width: 60%;"></el-input>
              </div>
              <div style="margin: 20px 0;">
                <p style="margin: 12px 0;">请输入会员支付码</p>
                <el-input v-model="Paymentcode" placeholder="请输入会员支付码" style="width: 60%;"></el-input>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="MembershipPayment" :loading='loadingcash'>确 定</el-button>
              </span>
            </div>
          </el-tab-pane>
        </el-tabs>

      </el-dialog>

      <!--银联支付-->
      <el-dialog title="银联支付" :visible.sync="Unionpay" width="50%" :before-close="handleClose">
        <p style="margin: 12px 0;">请选择银行卡</p>
        <div class="idcards">
          <span :class="{'border-color':clicked==index}" v-for="(item,index) in UnionPayBox" :key="item.name" @click="UnionPayclick(index)">{{item.name}}</span>
        </div>
        <p style="margin: 12px 0;">应收金额</p>
        <!-- 	<p style="font-size: 40px;color: red;" v-if="moneyzhe!=''">{{moneyzhe}}</p> -->
        <p style="font-size: 40px;color: red;">{{allmenudate.allPayment}}</p>

        <div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="Unionpay = false">取 消</el-button>
          <el-button type="primary" @click="UnionPayclickup">确 定</el-button>
        </span>
      </el-dialog>
      <!--折扣-->
      <el-dialog title="折扣金额提示" :visible.sync="rebate" width="50%" :before-close="handleClose">
        <p class='pfalg'>注意：如需兑换优惠卷，请先选择优惠券再选择折扣(已选择折扣，不可再次选择优惠券)。</p>
        <el-tabs v-model="activeName2" type="card">
          <el-tab-pane label="优惠券" name="first">
            <div style="position: relative;">
              <div>
                <label>请输入核销码：</label>
                <el-input v-model="cancellation" placeholder="请输入核销码" style='width:50%'></el-input>
                             <el-button type="warning" @click="QueryCoupons">查询</el-button>
              </div>

              <p style='margin:10px 0'>请选择单张优惠金额：</p>
              <div>
                <span :class="{'border-color':discountclicked==index}" class="spans" v-for="(item,index) in Discountamount"
                  :key="item.value" @click="discountchange(index)">{{item.value}}</span>
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
                <el-button type="primary" @click="couponup" :loading='isloading'>提 交</el-button>
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
                <el-button type="primary" @click="rebateup">确 定</el-button>
              </span>
            </div>
          </el-tab-pane>


        </el-tabs>


      </el-dialog>
      <!-- 数量 -->
      <el-dialog title="请选择数量" :visible.sync="ChangeTheNumber" width="40%" :before-close="handleClose">
        <div style='margin-bottom:60px'>
          <span :class="{'border-color':clickedNumber==index}" class="spans" v-for="(item,index) in NumberBox" :key="item.value"
            @click="changeNumber(index)">{{item.value}}</span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="ChangeTheNumber = false">取 消</el-button>
          <el-button type="primary" @click="changequanticup">确 定</el-button>
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
        shopstatus: state => state.ShopName.state,
        typename: state => state.ShopName.shopName,
          shopgroup: state => state.ShopName.shop_group
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
        SelfTaking:'自取',
        distribution:'外卖',
        inputShow: {
          value: '0'
        },
        flags: '0',
        loadingcash: false,
        loadingcash1: false,
        discountclicked: -1,
        couponclicked: -1,
        clickedNumber: -1,
        Discountamount: [], //优惠金额
        coupon: [], //优惠来源
        coupontableData: [], //获取优惠信息table
        coupontableData2: [], //获取优惠信息table
        cancellation: '', //核销码
        isloading: false,
        NumberBox: [{
            value: '5'
          },
          {
            value: '10'
          }, {
            value: '20'
          }, {
            value: '50'
          }, {
            value: '100'
          },
        ],
        ChangeTheNumber: false,
        activeName2: 'first',
        activeName: 'first',
        zhuosum: '',
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
        allmenudate: [],
        type0Goods: [],
        checkList: [],
        category: [],
        ins: '',
        guige: '',
        productionSizes: '',
        production: [],
        dialogVisible: false,
        paymentpay: false,
        clicked: -1,
        clickeds: -1,
        clickedshe: -1,
        clicked2: -1,
        clicked3: -1,
        clickeds2: -1,
        clickedmoney: 0,
        kaidianbtn: true, //开店开关
        textarea: '',
        price: '',
        checkboxGroup: 0,
        oncreditstyle: ['日结', '周结', '月结'],
        isShow: false,
        height: '600',
        hangOrderDetail: [],
        code: '',
        tankuang: false,
        keyword: '',
        indextabs: '0',
        indexxonune: '0',
        goodslist: '',
        cur: 1,
        createCartOrder: '',
        pageSize: 15,
        all: 1,
        typelist: 'AIX_GA',
        shangjia: -1,
        moneysum: false,
        outerVisible: false,
        activedis: 'none',
        activedis2: 'none',
        moneyinput: '',
        sum: '',
        serialnum: '',
        money2: '',
        moneyzhe: '',
        moneysum2: false,
        Unionpay: false,
        rebate: false,
        qrcodes: '',
        UnionPayBox: [],
        Unioninput: '',
        UnionPayBoxindex: '',
        zhehoumoneyt: '',
        state: '开店',
        discountplay: '',
        indexdiscount: -1,
        loadings: false,
        loadings2: false,
        commentsGroup: [],
        arrlist: [],
        codename: '',
        names: '',
        namecode: '',
        godetailnum: '',
        allPaymentmoney: 0,
        allPaymentcopum: 0,
        flages: '',
        quanticnum: '',
        Paymentcode: '',
        cancellation2:'',
        addCartCouponBox:[]
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

    watch: {
      cur: function(newValue, oldValue) {
        //console.log(arguments);
      },
      menudate: function(newV,oldV) {
        this.$store.commit('SAVE_BillData',newV)
        console.log(this.$store.state.billData,'billdata');
        
      },
      allmenudate:function(newV,oldV){
        console.log('allPayment',newV);
        this.$store.commit('SAVE_AllPayment',newV.allPayment)

      }
    },
    methods: {
      QueryCoupons(){
         let _self = this;
          console.log(_self.cancellation)
            if(_self.cancellation==''||_self.cancellation==undefined){
               _self.$message({
          message: '您还没有输入核销码哦',
          type: 'warning'
        });
        return false
            }

          let formData = new FormData();
          formData.append('couponSerialNumber', _self.cancellation);
           _self.axios.post(_self.ApiUrlMember2 + '/mem/coupons/couponSerialNumberDetail', formData, {
            // 单独配置
            withCredentials: false
          }).then(response => {

            if (response.data.errcode == '0') {

                if(response.data.data.data!=undefined){
                  var n = Number(response.data.data.data.balance) /100
                    n= parseFloat(n).toFixed(2);
                  var box = [{
                    code: "vouchers_"+n,
                    value: n
                  }]
                  _self.Discountamount = box
                  console.log(box)
                }else{
                  return
                }
            } else {
              _self.$message.error('获取优惠券金额失败');
            }
          }).catch(function(error) {
            _self.$message.error('响应时间过长，请重试');
          });
      },
      //改变数量
      changequantic(index) {
        let _self = this;
        _self.quanticnum = index;
        _self.ChangeTheNumber = true;
        _self.clickedNumber = -1;
      },
      checkbtn() {
        let _self = this;
        console.log(_self.checkboxGroup)
        _self.$notify({
          title: '警告',
          message: '更换方式时，请自觉删减费用！',
          type: 'warning'
        });
      },
      //选择数量
      changeNumber(index) {
        let _self = this;
        _self.clickedNumber = index

      },
      changequanticup() {
        let _self = this;
        if (_self.clickedNumber < 0) {
          _self.$message({
            message: '您还没有选择任何数量哦',
            type: 'warning'
          });
          return false
        }

        let formData = new FormData();
        formData.append('productionCode', _self.quanticnum.production_code);
        formData.append('amount', _self.NumberBox[_self.clickedNumber].value);
        formData.append('discountType', _self.quanticnum.discount_type);
        formData.append('cartOrderCode', _self.createCartOrder);
        formData.append('type', _self.checkboxGroup);
        formData.append('shopCode', _self.shopcode);
        _self.axios.post(_self.ApiUrls + '/buyer/updateCateringShopingCarAmount', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode == '0') {
            _self.ChangeTheNumber = false;
            _self.moneyzhe = '';
            _self.shopdetail()
          } else {
            _self.$message.error('修改数量失败，请重新选择添加');
          }
        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试');
        });
      },
      //添加优惠
      addcoupon() {
        let _self = this;
        if( _self.cancellation==''|| _self.cancellation==undefined){
           _self.$message({
          message: '您还没有输入核销码哦',
          type: 'warning'
        });

          return false;
        }
         let formData = new FormData();
        formData.append('couponSerialNumber', _self.cancellation);

        _self.axios.post(_self.ApiUrlMember2 + '/mem/coupons/whetherToUsed', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode == '0') {
                let formData = new FormData();
           formData.append('cartOrderCode', _self.createCartOrder);
           _self.axios.post(_self.ApiUrls + '/buyer/whetherDiscount', formData, {
             // 单独配置
             withCredentials: false
           }).then(response => {
             if (response.data.errcode == '0') {
               if (response.data.data.list == '') {

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
                   coupon_actual_value: moneycoupon,
                   coupon_source: _self.coupon[_self.couponclicked].value
                 }
                 var newdata2 = {
                   coupon_state: 0,
                   coupon_type: 'vouchers',
                   coupon_code: _self.cancellation,
                   coupon_actual_value: _self.Discountamount[_self.discountclicked].value,
                   coupon_face_value: _self.Discountamount[_self.discountclicked].value,
                   coupon_source: _self.coupon[_self.couponclicked].value
                 }
                 _self.allPaymentmoney += parseInt(_self.Discountamount[_self.discountclicked].value)

                 _self.coupontableData2.push(newdata2)
                 _self.coupontableData.push(newdata)
                 _self.discount()
                _self.cancellation = '';

                 _self.discountclicked = -1;
                 _self.couponclicked = -1;

               } else if (response.data.data.list[0].coupon_code == "1.0" || response.data.data.list[0].coupon_code ==
                 "1") {

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
                   coupon_actual_value: moneycoupon,
                   coupon_source: _self.coupon[_self.couponclicked].value
                 }
                 var newdata2 = {
                   coupon_state: 0,
                   coupon_type: 'vouchers',
                   coupon_code: _self.cancellation,
                   coupon_actual_value: _self.Discountamount[_self.discountclicked].value,
                   coupon_face_value: _self.Discountamount[_self.discountclicked].value,
                   coupon_source: _self.coupon[_self.couponclicked].value
                 }
                 _self.allPaymentmoney += parseInt(_self.Discountamount[_self.discountclicked].value)

                 _self.coupontableData2.push(newdata2)
                 _self.coupontableData.push(newdata)
                   _self.discount()
                 _self.cancellation = '';

                 _self.discountclicked = -1;
                 _self.couponclicked = -1;

               } else {
                 _self.$message({
                   message: '您已先选择折扣，不能再次添加优惠券,请先选择优惠券再选择折扣，谢谢',
                   type: 'warning'
                 });
                 return false;
               }
             }
           }).catch(function(error) {
             _self.$message.error('响应时间过长，请重试');
           });
          } else {
            _self.$message.error(response.data.errmsg);
          }
        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试');
        });


      },
      //优惠选择更新
      couponup() {
        let _self = this;
        if (_self.createCartOrder == '') {
          _self.$message({
            message: '您的购物车单号为空不能添加优惠券，请重新添加菜品',
            type: 'warning'
          });
          return false;
        };
        var newdata = {
          orderCode: _self.createCartOrder,
          list: _self.coupontableData
        }
        console.log(_self.allPaymentmoney + '优惠金额')
        console.log(_self.allPaymentcopum + '订单金额')
        if (_self.allPaymentmoney > _self.allPaymentcopum) {
          _self.$message({
            message: '优惠金额只能小于或者等于订单金额',
            type: 'warning'
          });

          return false;
        }
        console.log(newdata)

        if (_self.coupontableData == '') {
          _self.$message({
            message: '您并没有 ‘ 添加 ’ 任何优惠方式',
            type: 'warning'
          });

          return false;
        }
        _self.isloading = true

        _self.axios.post(_self.ApiUrls + '/buyer/addCartCoupon', {
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
            _self.addCartCouponBox = response.data.data.couponCodeList
            _self.shopdetail();
            _self.rebate = false;
            _self.allPaymentmoney = 0;

            _self.discountclicked = -1;
            _self.couponclicked = -1;
            _self.coupontableData = [];
            _self.coupontableData2 = [];
          } else {
             _self.rebate = false;
            _self.$message.error(response.data.errmsg);
          }
        }).catch(function(error) {
           _self.rebate = false;
          _self.$message.error('响应时间过长，请重试');

        });
      },
   CouponTraceState(cancellation){
      let _self = this;
     let formData = new FormData();
     formData.append('couponSerialNumber',cancellation);

     _self.axios.post(_self.ApiUrlMember2 + '/mem/coupons/updateCouponTraceState', formData, {
       // 单独配置
       withCredentials: false
     }).then(response => {

       if (response.data.errcode == '0') {
       console.log('记录成功')
        _self.cancellation = '';
       } else {
         console.log('记录失败')
       }
     }).catch(function(error) {

     });
   },
      //删除优惠
      handlecouponClick(index) {
        let _self = this;
        _self.allPaymentmoney = _self.allPaymentmoney - _self.coupontableData2[index].coupon_actual_value
        _self.coupontableData2.splice(index, 1)
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
        this.sum = parseFloat(this.inputShow.value - this.allmenudate.allPayment).toFixed(2)
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
          this.sum = parseFloat(this.inputShow.value - this.allmenudate.allPayment).toFixed(2)
        }
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
      discount() {
        let _self = this;
        if (_self.menudate == '') {
          _self.$message({
            message: '您还没有添加任何菜品',
            type: 'warning'
          });
          return false;
        };
        _self.rebate = true;
        _self.isloading = false;
        _self.clicked = -1;
        _self.indexdiscount = -1;
        _self.clicked3 = -1;
        _self.discountclicked = -1;
        _self.cancellation = '';
        _self.couponclicked = -1;

        let formData2 = new FormData();
        formData2.append('code', 'coupon_code_discount');
        formData2.append('shopCode', _self.shopcode);
        _self.axios.post(_self.ApiUrl + '/catering/memberDiscount', formData2).then(response => {
          if (response.data.errcode == '0') {
            _self.discountplay = response.data.data.commentsGroup
            var zhekous = ''
            for (var i = 0; i < response.data.data.commentsGroup.length; i++) {
              if (response.data.data.commentsGroup[i].code == 'discount_90') {
                _self.discountplay[i].code = '九折'
                zhekous = '0.9';
              } else if (response.data.data.commentsGroup[i].code == 'discount_80') {
                _self.discountplay[i].code = '八折'
                zhekous = '0.8';
              } else if (response.data.data.commentsGroup[i].code == 'discount_70') {
                _self.discountplay[i].code = '七折'
                zhekous = '0.7';
              } else if (response.data.data.commentsGroup[i].code == 'discount_85') {
                _self.discountplay[i].code = '八点五折'
                zhekous = '0.85';
              } else if (response.data.data.commentsGroup[i].code == 'discount_60') {
                _self.discountplay[i].code = '六折'
                zhekous = '0.6';
              } else if (response.data.data.commentsGroup[i].code == 'discount_50') {
                _self.discountplay[i].code = '五折'
                zhekous = '0.5';
              } else if (response.data.data.commentsGroup[i].code == 'discount_00') {
                _self.discountplay[i].code = '免单'
                zhekous = '0';
              } else if (response.data.data.commentsGroup[i].code == 'discount_20') {
                _self.discountplay[i].code = '二折'
                zhekous = '0.2';
              } else if (response.data.data.commentsGroup[i].code == 'discount_30') {
                _self.discountplay[i].code = '三折'
                zhekous = '0.3';
              } else if (response.data.data.commentsGroup[i].code == 'discount_40') {
                _self.discountplay[i].code = '四折'
                zhekous = '0.4';
              } else if (response.data.data.commentsGroup[i].code == 'discount_10') {
                _self.discountplay[i].code = '一折'
                zhekous = '1';
              } else if (response.data.data.commentsGroup[i].code == 'discount_100') {
                _self.discountplay[i].code = '无折扣'
                zhekous = '1';
              }
            }
            let formDatas = new FormData();
            formDatas.append('cartOrderCode', _self.createCartOrder);
            _self.axios.post(_self.ApiUrls + '/buyer/whetherDiscount', formDatas, {
              // 单独配置
              withCredentials: false
            }).then(response => {
              if (response.data.errcode == '0') {
                if (response.data.data.list != '') {
                  var zhekousd = '';
                  if (response.data.data.list[0].coupon_code == '0.9') {
                    zhekousd = '九折'
                  } else if (response.data.data.list[0].coupon_code == '0.8') {
                    zhekousd = '八折'
                  } else if (response.data.data.list[0].coupon_code == '0.7') {
                    zhekousd = '七折'
                  } else if (response.data.data.list[0].coupon_code == '0.85') {
                    zhekousd = '八点五折'
                  } else if (response.data.data.list[0].coupon_code == '0.6') {
                    zhekousd = '六折'
                  } else if (response.data.data.list[0].coupon_code == '0.5') {
                    zhekousd = '五折'
                  } else if (response.data.data.list[0].coupon_code == '0' || response.data.data.list[
                      0].coupon_code ==
                    '0.0') {
                    zhekousd = '免单'
                  } else if (response.data.data.list[0].coupon_code == '0.2') {
                    zhekousd = '二折'
                  } else if (response.data.data.list[0].coupon_code == '0.3') {
                    zhekousd = '三折'
                  } else if (response.data.data.list[0].coupon_code == '0.4') {
                    zhekousd = '四折'
                  } else if (response.data.data.list[0].coupon_code == '0.1') {
                    zhekousd = '一折'
                  } else if (response.data.data.list[0].coupon_code == '1' || response.data.data.list[
                      0].coupon_code ==
                    '1.0') {
                    zhekousd = '无折扣'
                  }

                  for (var i = 0; i < _self.discountplay.length; i++) {
                    if (zhekousd == _self.discountplay[i].code) {
                      _self.clicked3 = i
                    }
                  };
                }


              } else {
                _self.$message.error(response.data.errmsg);
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
      changedisxount(index) {
        let _self = this;
        _self.indexdiscount = index
        _self.clicked3 = index
      },
      rebateup() {
        let _self = this;
        // 				_self.moneyzhe = parseFloat(_self.allmenudate.allPayment * 100 * _self.discountplay[_self.indexdiscount].value /
        // 					100).toFixed(2)
        if (_self.indexdiscount == -1) {
          _self.$message({
            message: '请选择折扣',
            type: 'warning'
          });
          return false
        }
        if (_self.createCartOrder == '') {
          _self.$message({
            message: '您的购物车单号为空不能选择折扣哦',
            type: 'warning'
          });
          return false
        }
        if (_self.discountplay[_self.indexdiscount].code == '九折') {
          _self.codename = '0.9'
        } else if (_self.discountplay[_self.indexdiscount].code == '八折') {
          _self.codename = '0.8'
        } else if (_self.discountplay[_self.indexdiscount].code == '七折') {
          _self.codename = '0.7'
        } else if (_self.discountplay[_self.indexdiscount].code == '八点五折') {
          _self.codename = '0.85'
        } else if (_self.discountplay[_self.indexdiscount].code == '六折') {
          _self.codename = '0.6'
        } else if (_self.discountplay[_self.indexdiscount].code == '五折') {
          _self.codename = '0.5'
        } else if (_self.discountplay[_self.indexdiscount].code == '免单') {
          _self.codename = '0'
        } else if (_self.discountplay[_self.indexdiscount].code == '二折') {
          _self.codename = '0.2'
        } else if (_self.discountplay[_self.indexdiscount].code == '三折') {
          _self.codename = '0.3'
        } else if (_self.discountplay[_self.indexdiscount].code == '四折') {
          _self.codename = '0.4'
        } else if (_self.discountplay[_self.indexdiscount].code == '一折') {
          _self.codename = '0.1'
        } else if (_self.discountplay[_self.indexdiscount].code == '无折扣') {
          _self.codename = '1'
        }

        _self.rebate = false
        // let formData2 = new FormData();
        // formData2.append('discount', _self.codename);
        // // formData2.append('token', _self.token);
        // formData2.append('shopCode', _self.shopcode);
        // formData2.append('cartOrderCode', _self.createCartOrder);
        // _self.axios.post(_self.ApiUrls + '/buyer/cateringMemberDiscount', formData2, {
        //   // 单独配置
        //   withCredentials: false
        // }).then(response => {
        //   if (response.data.errcode == '0') {
            var discounttable = [{
              coupon_code: _self.codename,
              coupon_source: _self.shopcode,
              coupon_state: 0,
              coupon_type: 'discount',
              coupon_face_value: 0,
              coupon_actual_value: 0
            }]
            var newdata = {
              orderCode: _self.createCartOrder,
              list: discounttable
            }
            _self.axios.post(_self.ApiUrls + '/buyer/addCartCoupon', {
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
                _self.shopdetail();
                _self.flags = '1'
                _self.codename = ''

              } else {
                 _self.rebate = false;
                _self.$message.error(response.data.errmsg);
              }
            }).catch(function(error) {
               _self.rebate = false;
              _self.$message.error('响应时间过长，请重试');

            });


        //   } else {
        //     _self.$message.error('添加折扣失败，请刷新重试');
        //   }
        // }).catch(function(error) {
        //   _self.$message.error('响应时间过长，请重试');
        // });
      },
      pageClick() {
        let _self = this
        let formData2 = new FormData();
        formData2.append('shopCode', _self.shopcode);
        formData2.append('pageNum', _self.cur);
        formData2.append('pageSize', _self.pageSize);
        formData2.append('categoryCode', _self.typelist);
        console.log(_self.typelist)
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
      opendian() {
        let _self = this
        console.log(_self.kaidianbtn)
        if (_self.kaidianbtn == true) {
          let formData2 = new FormData();
          formData2.append('shopCode', _self.shopcode);
          formData2.append('state', '1');
          _self.axios.post(_self.ApiUrl + '/catering/closeSmallProgram', formData2).then(response => {
            if (response.data.errcode == '0') {
              _self.state = '开店'
              _self.$message({
                type: 'success',
                message: '已开店'
              });
              _self.getshop();
            } else {
              _self.$message.error('暂时不能开店哦，请刷新重试');
            }
          }).catch(function(error) {
            _self.$message.error('响应时间过长，请重试');
          });
        } else {
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
              _self.getshop();
            } else {
              _self.$message.error('暂时不能关店哦，请刷新重试');
            }
          }).catch(function(error) {
            _self.$message.error('响应时间过长，请重试');
          });
        }


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
      //赊账
      oncreditclick(index) {
        let _self = this;
        _self.clickedshe = index

      },
      oncreditclickup() {
        let _self = this;

        if (_self.profilequeuetype == 'TABLE-NUM') {
          if (_self.zhuosum == '') {
            _self.$message({
              message: '请填写桌号',
              type: 'warning'
            });
            return false
          }
        }
        _self.loadingcash = true;

        var money2 = _self.allmenudate.allPayment;
        if (money2 < 0) {
          _self.$message({
            message: '订单金额不能为负数哦',
            type: 'warning'
          });
          return false
        }

        var oncreditstylenum = '';
        if (_self.oncreditstyle[_self.clickedshe] == '日结') {
          oncreditstylenum = "1"
        } else if (_self.oncreditstyle[_self.clickedshe] == '周结') {
          oncreditstylenum = "2"
        } else if (_self.oncreditstyle[_self.clickedshe] == '月结') {
          oncreditstylenum = "3"
        }
        if (oncreditstylenum == '') {
          _self.$message({
            message: '请选择赊账方式',
            type: 'warning'
          });
          return false
        }
        if (_self.createCartOrder == '' || _self.createCartOrder == undefined || _self.createCartOrder ==
          null) {
          _self.$message({
            message: '您的购物车单号为空请重新添加菜品',
            type: 'warning'
          });
          return false
        }
        _self.moneysum = false;
        var seatNums = '0'
        if (_self.zhuosum == '') {
          seatNums = '0'
        } else {
          seatNums = _self.zhuosum
        }
        var newdata = {
          token: _self.token,
          shopCode: _self.shopcode,
          payment: money2,
          code: '',
          seatNum: seatNums,
          creditType: oncreditstylenum,
          cartOrderCode: _self.createCartOrder,
          orderType: _self.checkboxGroup,
          state: '1',
          sales: '',
          list: _self.coupontableData,
          comments: ''
        }

        _self.axios.post(_self.ApiUrls + '/buyer/createOrderCode', {
          jsonData: newdata
        }, {
          // 单独配置
          withCredentials: false
        }, {
          headers: {
            'Content-Type': 'application/json;charsetset=UTF-8'
          }
        }).then(response => {
          let orderdetailcode = response.data.data.orderCode
          if (response.data.errcode == '0') {
            _self.zhehoumoneyt = '';
            _self.codename = '';
            _self.zhuosum = '';
            oncreditstylenum = '';
            _self.createCartOrder = '';
            _self.serialnum = '';
            let formData2 = new FormData();
            formData2.append('state', 1);
            formData2.append('payCode', 'credit01');
            formData2.append('orderCode', orderdetailcode);
            formData2.append('payFeed', '成功');
            formData2.append('source', '赊付');
            formData2.append('payAmount', money2);
            formData2.append('userKey', '');
            formData2.append('shopCode', _self.shopcode);
            //发送请求
            _self.axios.post(_self.ApiUrls + '/buyer/writeOrderPayTrace', formData2, {
              // 单独配置
              withCredentials: false
            }).then(response => {
              if (response.data.errcode == '0') {
                _self.serialnum = '';
                _self.loadingcash = false;
                var serialNumber = response.data.data.serialNumber
                _self.$message({
                  type: 'success',
                  message: '付款成功，请前往赊账订单查看'
                });
                let formData3 = new FormData();
                formData3.append('shopCode', _self.shopcode);
                formData3.append('orderCode', orderdetailcode);
                formData3.append('serialNumber', serialNumber);
                //发送请求
                _self.axios.post(_self.ApiUrl + '/catering/cashSettlement', formData3).then(response => {
                  console.log(response)
                  if (response.data.errcode == '0') {
                    _self.moneyzhe = ''
                    _self.shopdetail();
                    _self.goodslist = response.data.data
                    var json = _self.goodslist
                    //打印
                    _self.print(_self.goodslist);
                    //打印结束
                    _self.moneyzhe = '';
                    _self.allmenudate.allPayment = '';
                  } else {
                    _self.$message.error('打印菜单加载失败');
                    _self.moneyzhe = '';
                    _self.allmenudate.allPayment = '';
                    _self.shopdetail();
                  }

                }).catch(function(error) {
                  _self.$message.error('响应时间过长，请重试');
                });
              } else {
                let formData2 = new FormData();
                formData2.append('state', 0);
                formData2.append('payCode', 'credit01');
                formData2.append('orderCode', orderdetailcode);
                formData2.append('payFeed', '失败');
                formData2.append('source', '赊付');
                formData2.append('payAmount', money2);
                formData2.append('userKey', '');
                formData2.append('shopCode', _self.shopcode);
                //发送请求
                _self.axios.post(_self.ApiUrls + '/buyer/writeOrderPayTrace', formData2, {
                  // 单独配置
                  withCredentials: false
                }).then(response => {

                  if (response.data.errcode == '0') {
                    _self.serialnum = '';
                    _self.shopdetail();
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
          } else {
            _self.$message.error('创建订单失败，请重试');
            _self.serialnum = '';

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
            console.log(index)
            console.log(_self.typelist)
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
                console.log(_self.type0Goods)
                console.log(_self.all)
                console.log(_self.commentsGroup)
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
      history() {
        this.$router.push('/alllist')
      },
      cashquxiao() {
        let _self = this;
        _self.inputShow.value = '0';
        _self.sum = '0'
        _self.clicked = -1;
        _self.UnionPayBoxindex = '';
        _self.moneysum = false;
      },
      cash() {
        let _self = this;
        if (_self.menudate == '') {
          _self.$message({
            type: 'warning',
            message: '您还没有添加任何商品哦！',

          })
          return false
        }
        _self.moneyinput = '';
        _self.inputShow.value = '0';
        _self.sum = '0';
        _self.clickedshe = -1;
        _self.moneysum = true;
        let formData2 = new FormData();
        formData2.append('code', 'unionpay_type');
        //发送请求
        _self.axios.post(_self.ApiUrl + '/catering/memberDiscount', formData2).then(response => {

          if (response.data.errcode == '0') {
            console.log(response)
            _self.UnionPayBox = response.data.data.commentsGroup
          } else {
            _self.$message.error('获取银行卡失败，请刷新重试');
          }

        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试');
        });

      },

      //暂时无用   之前现金结算
      cashup() {
        let _self = this;
        _self.moneysum2 = true
        _self.money2 = _self.allmenudate.allPayment
        _self.sum = parseFloat(_self.moneyinput - _self.money2).toFixed(2)
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
                  orderInfos1 += '<B>' + goodslist.goodsList[i].productionName + '（' + goodslist.goodsList[i].productionSize +
                    goodslist.goodsList[i].comments + ')' + '<BR>' +
                    '                      ' +
                    goodslist
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
                orderInfos2 = '@@2<FB><FS2><center>' + goodslist.serialNumber + '</center></FS2></FB>↵' +
                  '\r'
                orderInfos2 += '<LR>名称                单价                   数量</LR>'
                orderInfos2 += '\r' + '↵————————————————————————↵' + '\r'
                for (var i = 0; i < goodslist.goodsList.length; i++) {
                  orderInfos2 += '<FB><FS2>' + goodslist.goodsList[i].productionName + '（' + goodslist.goodsList[i]
                    .productionSize + goodslist.goodsList[i].comments + ')' + '\r' +
                    '          ' +
                    goodslist.goodsList[
                      i].promotional_price +
                    '          ' + goodslist.goodsList[i].orderAmount + '</FS2></FB>' + '\r'
                }
                orderInfos2 += '\r' + '↵————————————————————————↵' + '\r'
                orderInfos2 += '下单时间：' + goodslist.create_at
                orderInfos2 += '投诉电话' + goodslist.customer_service_number


                var order = {
                  name1: orderInfos1,
                  name2: orderInfos2
                }
                let formDataOpen = new FormData();
                formDataOpen.append('shopCode', _self.shopcode);
                formDataOpen.append('content', JSON.stringify(order));
                formDataOpen.append('orderCode', goodslist.orderCode);
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
                    orderInfo2 += '<B>' + codes[c].productionName + '（' + codes[c].productionSize + codes[c].comments +
                      ')' + '<BR>' + '                      ' +
                      codes[
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
                  orderInfo2 = '@@2<FB><FS2><center>' + goodslist.serialNumber + '</center></FS2></FB>↵' +
                    '\r'
                  orderInfo2 += '<LR>名称                单价                   数量</LR>'
                  orderInfo2 += '\r' + '↵————————————————————————↵' + '\r'
                  for (var c = 0; c < codes.length; c++) {
                    orderInfo2 += '<FB><FS2>' + codes[c].productionName + '（' + codes[c].productionSize + codes[c].comments +
                      ')' + '\r' + '          ' + codes[c].promotional_price +
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
                  formDataOpens.append('orderCode', goodslist.orderCode);
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
                  LODOP = getLodop(document.getElementById('LODOP_OB'), document.getElementById(
                    'LODOP_EM'));
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
                  //   LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, goodslist.goodsList[i].productionName);
                  // } else {
                  //商品名字过长,其他字段需要换行
                  LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, goodslist.goodsList[i].productionName +
                    ' ' + goodslist.goodsList[i].productionSize + ' ' + goodslist.goodsList[i].comments);
                  hPos += rowHeight;
                  // }


                  LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, goodslist.goodsList[i].promotional_price);
                  LODOP.ADD_PRINT_TEXT(hPos, 50, pageWidth, rowHeight, goodslist.goodsList[i].orderAmount);
                  LODOP.ADD_PRINT_TEXT(hPos, 90, pageWidth, rowHeight, goodslist.goodsList[i].actual_amount);
                  LODOP.ADD_PRINT_TEXT(hPos, 150, pageWidth, rowHeight, Number(goodslist.goodsList[i].discountRate) *
                    100 + '%');
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
                LODOP.ADD_PRINT_TEXT(hPos, 2, pageWidth, rowHeight, (new Date()).toLocaleDateString() +
                  " " + (
                    new Date())
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

      //现金支付
      cashmoneyup() {

        let _self = this;

        if (_self.profilequeuetype == 'TABLE-NUM') {
          if (_self.zhuosum == '') {
            _self.$message({
              message: '请填写桌号',
              type: 'warning'
            });
            return false
          }
        }
        if (_self.createCartOrder == '' || _self.createCartOrder == undefined || _self.createCartOrder ==
          null) {
          _self.$message({
            message: '您的购物车单号为空请重新添加菜品',
            type: 'warning'
          });
          return false
        }
        if (_self.allmenudate.allPayment < 0) {
          _self.$message({
            message: '订单金额不能为负数哦',
            type: 'warning'
          });
          return false
        }
        _self.moneysum2 = false;
        _self.moneysum = false;
        var money2 = _self.allmenudate.allPayment;
        var moneys = _self.allmenudate.allPayment * 100;

        _self.loadingcash = true;
        moneys = parseInt(moneys)

        var seatNums = '0'
        if (_self.zhuosum == '') {
          seatNums = '0'
        } else {
          seatNums = _self.zhuosum
        }
        var newdata = {
          token: _self.token,
          shopCode: _self.shopcode,
          payment: money2,
          code: '',
          seatNum: seatNums,
          creditType: '0',
          cartOrderCode: _self.createCartOrder,
          orderType: _self.checkboxGroup,
          state: '1',
          sales: '',
          list: _self.coupontableData,
          comments: ''
        }
        _self.axios.post(_self.ApiUrls + '/buyer/createOrderCode', {
          jsonData: newdata
        }, {
          // 单独配置
          withCredentials: false
        }, {
          headers: {
            'Content-Type': 'application/json;charsetset=UTF-8'
          }
        }).then(response => {
          let orderdetailcode = response.data.data.orderCode
          if (response.data.errcode == '0') {
            _self.zhehoumoneyt = '';
            _self.codename = '';
            _self.serialnum = '';
            _self.zhuosum = '';
            _self.createCartOrder = '';
            let formData2 = new FormData();
            formData2.append('state', 1);
            formData2.append('payCode', 'xianjin01');
            formData2.append('orderCode', orderdetailcode);
            formData2.append('payFeed', '成功');
            formData2.append('source', '现金');
            formData2.append('payAmount', money2);
            formData2.append('userKey', '');
            formData2.append('shopCode', _self.shopcode);
            //发送请求
            _self.axios.post(_self.ApiUrls + '/buyer/writeOrderPayTrace', formData2, {
              // 单独配置
              withCredentials: false
            }).then(response => {
              if (response.data.errcode == '0') {
                _self.serialnum = '';
                _self.loadingcash = false;

                if (_self.addCartCouponBox != '' || _self.addCartCouponBox != undefined) {
                      for (var i = 0; i < _self.addCartCouponBox.length; i++) {
                        _self.CouponTraceState(_self.addCartCouponBox[i]);
                      }
                    }


                var serialNumber = response.data.data.serialNumber
                _self.$message({
                  type: 'success',
                  message: '付款成功，请前往今日订单查看'
                });
                let formData3 = new FormData();
                formData3.append('shopCode', _self.shopcode);
                formData3.append('orderCode', orderdetailcode);
                formData3.append('serialNumber', serialNumber);
                //发送请求
                _self.axios.post(_self.ApiUrl + '/catering/cashSettlement', formData3).then(response => {
                  console.log(response)
                  if (response.data.errcode == '0') {
                    _self.moneyzhe = ''
                    _self.shopdetail();
                    _self.goodslist = response.data.data
                    var json = _self.goodslist
                    //打印
                    _self.print(_self.goodslist);
                    //打印结束
                    _self.moneyzhe = '';
                    _self.allmenudate.allPayment = '';
                  } else {
                    _self.$message.error('打印菜单加载失败');
                    _self.moneyzhe = '';
                    _self.allmenudate.allPayment = '';
                    _self.shopdetail();
                  }

                }).catch(function(error) {
                  _self.$message.error('响应时间过长，请重试');
                });
              } else {
                let formData2 = new FormData();
                formData2.append('state', 0);
                formData2.append('payCode', 'xianjin01');
                formData2.append('orderCode', orderdetailcode);
                formData2.append('payFeed', '失败');
                formData2.append('source', '现金');
                formData2.append('payAmount', money2);
                formData2.append('userKey', '');
                formData2.append('shopCode', _self.shopcode);
                //发送请求
                _self.axios.post(_self.ApiUrls + '/buyer/writeOrderPayTrace', formData2, {
                  // 单独配置
                  withCredentials: false
                }).then(response => {

                  if (response.data.errcode == '0') {
                    _self.serialnum = '';
                    _self.shopdetail();
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
          } else {
            _self.$message.error('创建订单失败，请重试');
            _self.serialnum = '';

          }
        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试');
        });
      },

      //会员支付
      MembershipPayment() {

        let _self = this;

        if (_self.profilequeuetype == 'TABLE-NUM') {
          if (_self.zhuosum == '') {
            _self.$message({
              message: '请填写桌号',
              type: 'warning'
            });
            return false
          }
        }
        if (_self.createCartOrder == '' || _self.createCartOrder == undefined || _self.createCartOrder ==
          null) {
          _self.$message({
            message: '您的购物车单号为空请重新添加菜品',
            type: 'warning'
          });
          return false
        }
        if (_self.allmenudate.allPayment < 0) {
          _self.$message({
            message: '订单金额不能为负数哦',
            type: 'warning'
          });
          return false
        }
        _self.moneysum2 = false;
        _self.moneysum = false;
        var money2 = _self.allmenudate.allPayment;
        var moneys = _self.allmenudate.allPayment * 100;

        _self.loadingcash = true;
        moneys = parseInt(moneys)

        var seatNums = '0'
        if (_self.zhuosum == '') {
          seatNums = '0'
        } else {
          seatNums = _self.zhuosum
        }
        var newdata = {
          token: _self.token,
          shopCode: _self.shopcode,
          payment: money2,
          code: '',
          seatNum: seatNums,
          creditType: '0',
          cartOrderCode: _self.createCartOrder,
          orderType: _self.checkboxGroup,
          state: '1',
          sales: '',
          list: _self.coupontableData,
          comments: ''
        }
        _self.axios.post(_self.ApiUrls + '/buyer/createOrderCode', {
          jsonData: newdata
        }, {
          // 单独配置
          withCredentials: false
        }, {
          headers: {
            'Content-Type': 'application/json;charsetset=UTF-8'
          }
        }).then(response => {
          let orderdetailcode = response.data.data.orderCode
          if (response.data.errcode == '0') {
            let formDa = new FormData();
            formDa.append('verifycode', _self.Paymentcode);
            formDa.append('fee', moneys);
            formDa.append('phone', _self.username);
            formDa.append('orderid', orderdetailcode);
            formDa.append('shopname', _self.typename);
            formDa.append('shopcode', _self.shopcode);
            _self.axios.post(_self.ApiUrlMember2 + '/mem/stored/useverifycode', formDa, {
              // 单独配置
              withCredentials: false
            }).then(response => {
              if (response.data.errcode == '0' && response.data.data.result_code == 'SUCCESS' && response.data.data
                .fee ==
                moneys && response.data.data.orderid == orderdetailcode && response.data.data.out_trade_no !=
                undefined && response.data.data.out_trade_no != '') {
                var out_trade_no = response.data.data.out_trade_no
                _self.zhehoumoneyt = '';
                _self.codename = '';
                _self.serialnum = '';
                _self.zhuosum = '';
                _self.createCartOrder = '';
                   if (_self.addCartCouponBox != '' || _self.addCartCouponBox != undefined) {
                      for (var i = 0; i < _self.addCartCouponBox.length; i++) {
                        _self.CouponTraceState(_self.addCartCouponBox[i]);
                      }
                    }

                let formData2 = new FormData();
                formData2.append('state', 1);
                formData2.append('payCode', out_trade_no);
                formData2.append('orderCode', orderdetailcode);
                formData2.append('payFeed', '成功');
                formData2.append('source', '会员');
                formData2.append('payAmount', money2);
                formData2.append('userKey', '');
                formData2.append('shopCode', _self.shopcode);
                //发送请求
                _self.axios.post(_self.ApiUrls + '/buyer/writeOrderPayTrace', formData2, {
                  // 单独配置
                  withCredentials: false
                }).then(response => {
                  if (response.data.errcode == '0') {
                    _self.serialnum = '';
                    _self.Paymentcode = '';
                    _self.loadingcash = false;
                    var serialNumber = response.data.data.serialNumber
                    _self.$message({
                      type: 'success',
                      message: '付款成功，请前往今日订单查看'
                    });
                    let formData3 = new FormData();
                    formData3.append('shopCode', _self.shopcode);
                    formData3.append('orderCode', orderdetailcode);
                    formData3.append('serialNumber', serialNumber);
                    //发送请求
                    _self.axios.post(_self.ApiUrl + '/catering/cashSettlement', formData3).then(response => {
                      console.log(response)
                      if (response.data.errcode == '0') {
                        _self.moneyzhe = ''
                        _self.shopdetail();
                        _self.goodslist = response.data.data
                        var json = _self.goodslist
                        //打印
                        _self.print(_self.goodslist);
                        //打印结束
                        _self.moneyzhe = '';
                        _self.allmenudate.allPayment = '';
                      } else {
                        _self.$message.error('打印菜单加载失败');
                        _self.moneyzhe = '';
                        _self.allmenudate.allPayment = '';
                        _self.shopdetail();
                      }

                    }).catch(function(error) {
                      _self.$message.error('响应时间过长，请重试');
                    });
                  } else {

                  }

                }).catch(function(error) {
                  _self.$message.error('响应时间过长，请重试');
                });
              } else {
                var msg = response.data.errmsg;
                let formDatas = new FormData();
                if (response.data.data.out_trade_no == undefined || response.data.data.out_trade_no == null) {
                  var outtradeno = ''
                } else {
                  var outtradeno = response.data.data.out_trade_no
                }
                formDatas.append('outtradeno', outtradeno);
                formDatas.append('verifycode', _self.Paymentcode);
                _self.axios.post(_self.ApiUrlMember2 + '/mem/stored/checkdeal', formDatas, {
                  // 单独配置
                  withCredentials: false
                }).then(response => {
                  if (response.data.errcode == '0' && response.data.data.info.debit == moneys && response.data
                    .data
                    .info.verifyCode == _self.Paymentcode && response.data.data.info.outTradeNo != '' &&
                    response.data
                    .data.info.outTradeNo != undefined) {
                    var out_trade_no = response.data.data.info.outTradeNo
                    _self.loadingcash = false;
                    _self.zhehoumoneyt = '';
                    _self.codename = '';
                    _self.serialnum = '';
                    _self.zhuosum = '';
                    _self.createCartOrder = '';

                    let formData2 = new FormData();
                    formData2.append('state', 1);
                    formData2.append('payCode', out_trade_no);
                    formData2.append('orderCode', orderdetailcode);
                    formData2.append('payFeed', '成功');
                    formData2.append('source', '会员');
                    formData2.append('payAmount', money2);
                    formData2.append('userKey', '');
                    formData2.append('shopCode', _self.shopcode);
                    //发送请求
                    _self.axios.post(_self.ApiUrls + '/buyer/writeOrderPayTrace', formData2, {
                      // 单独配置
                      withCredentials: false
                    }).then(response => {
                      if (response.data.errcode == '0') {
                        _self.serialnum = '';
                        _self.Paymentcode = '';
                        _self.loadingcash = false;
                        var serialNumber = response.data.data.serialNumber
                        _self.$message({
                          type: 'success',
                          message: '付款成功，请前往今日订单查看'
                        });
                        let formData3 = new FormData();
                        formData3.append('shopCode', _self.shopcode);
                        formData3.append('orderCode', orderdetailcode);
                        formData3.append('serialNumber', serialNumber);
                        //发送请求
                        _self.axios.post(_self.ApiUrl + '/catering/cashSettlement', formData3).then(
                          response => {
                            console.log(response)
                            if (response.data.errcode == '0') {
                              _self.moneyzhe = ''
                              _self.shopdetail();
                              _self.goodslist = response.data.data
                              var json = _self.goodslist
                              //打印
                              _self.print(_self.goodslist);
                              //打印结束
                              _self.moneyzhe = '';
                              _self.allmenudate.allPayment = '';
                            } else {
                              _self.$message.error('打印菜单加载失败');
                              _self.moneyzhe = '';
                              _self.allmenudate.allPayment = '';
                              _self.shopdetail();
                            }

                          }).catch(function(error) {
                          _self.$message.error('响应时间过长，请重试');
                        });
                      } else {

                      }

                    }).catch(function(error) {
                      _self.$message.error('响应时间过长，请重试');
                    });
                  } else {
                    _self.$alert(response.data.errmsg + msg, '异常提示', {
                      confirmButtonText: '确定',
                    });
                    let formData = new FormData();
                    formData.append('orderCode ', orderdetailcode);
                    if(out_trade_no==undefined){
                      formData.append('payCode ', '');
                    }else{
                      formData.append('payCode ', out_trade_no);
                    }
                    formData.append('payBarCode', _self.Paymentcode);
                    formData.append('api', '会员');
                    formData.append('result', response.data.errmsg+ msg);
                    _self.axios.post(_self.ApiUrls + '/pay/payApitrace', formData, {
                      // 单独配置
                      withCredentials: false
                    }).then(response => {

                    }).catch(function(error) {
                      _self.$message.error('记录支付异常没有响应');
                    });

                    _self.shopdetail();
                    _self.Paymentcode = '';
                    _self.loadingcash = false;
                  }
                }).catch(function(error) {
                  _self.$message.error('支付验证响应时间过长，请重试');
                });

              }
            }).catch(function(error) {
              _self.$message.error('响应时间过长，请重试');
            });

          } else {
            _self.$message.error('创建订单失败，请重试');
            _self.serialnum = '';

          }
        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试');
        });
      },
      // 微信支付
      WeChat() {
        let _self = this;
        _self.code = ""
        _self.tankuang = true
        _self.$nextTick(function() {
          //DOM 更新了
          _self.$refs.inputVal.focus()
        })
        _self.indextabs = '0'


      },
      paymentSussecc(openId) {
        let _self = this;
        let formData = new FormData();
        formData.append('openId', openId);
        //发送请求
        _self.axios.post(_self.ApiUrls + '/buyer/paymentSusseccUpdateOpenIdToUser', formData, {
          // 单独配置
          withCredentials: false
        }).then(
          response => {

          }).catch(function(error) {
          console.log('openId响应失败')
        });
      },
      searchGoods(event) {

        let _self = this;

        if (event.keyCode == 13) {

          event.preventDefault(); //禁止默认事件（默认是换行）
          _self.keyword = event.target.value;
          if (_self.profilequeuetype == 'TABLE-NUM') {
            if (_self.zhuosum == '') {
              _self.$message({
                message: '请输入桌号',
                type: 'warning'
              });
              return false
            }
          }
          if (_self.createCartOrder == '' || _self.createCartOrder == undefined || _self.createCartOrder ==
            null) {
            _self.$message({
              message: '您的购物车单号为空请重新添加菜品',
              type: 'warning'
            });
            return false
          }
          _self.dialogVisible = false
          var money2 = _self.allmenudate.allPayment;
          if (money2 < 0) {
            _self.$message({
              message: '订单金额不能为负数哦',
              type: 'warning'
            });
            return false
          }
          var moneys = parseFloat((money2 * 100).toPrecision(12))

          var seatNums = '0'
          if (_self.zhuosum == '') {
            seatNums = '0'
          } else {
            seatNums = _self.zhuosum
          }
          // 失去焦点防止多次输入
          event.target.blur()
          var newdata = {
            token: _self.token,
            shopCode: _self.shopcode,
            payment: money2,
            code: '',
            seatNum: seatNums,
            creditType: '0',
            cartOrderCode: _self.createCartOrder,
            orderType: _self.checkboxGroup,
            state: '1',
            sales: '',
            list: _self.coupontableData,
            comments: ''
          }
          _self.axios.post(_self.ApiUrls + '/buyer/createOrderCode', {
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
              let orderdetailcode = response.data.data.orderCode
              _self.codename = '';
              _self.serialnum = '';
              _self.zhuosum = '';
              _self.createCartOrder = '';
              if (Number(_self.keyword.slice(0, 2)) <= 15) {
                let formData = new FormData();
                formData.append('auth_code', _self.keyword);
                formData.append('total_fee', moneys);
                formData.append('orderid', response.data.data.orderCode);
                formData.append('shop_name', _self.shopcode);
                //发送请求
                _self.axios.post(_self.realmphp + 'paymv2.php', formData, {
                  // 单独配置
                  withCredentials: false
                }).then(response => {
                  if (response.data.coupon_fee == undefined) {
                    var couponfee = 0;
                  } else {
                    var couponfee = Number(response.data.coupon_fee);
                  }
                  var cashfeeall = Number(response.data.cash_fee) + couponfee;

                  if (response.data.result_code == 'SUCCESS' && response.data.return_code ==
                    'SUCCESS' &&
                    response.data.return_msg ==
                    'OK' && response.data.total_fee == moneys && response.data.trade_state ==
                    'SUCCESS' &&
                    cashfeeall ==
                    moneys && response.data.fee_type == 'CNY') {
                    _self.tankuang = false;
                    _self.paymentpay = false;
                    var openId = response.data.openid;
                    _self.paymentSussecc(openId);
                    _self.serialnum = '';
                    _self.$message({
                      type: 'success',
                      message: '付款成功，请前往今日订单查看'
                    });
                     if (_self.addCartCouponBox != '' || _self.addCartCouponBox != undefined) {
                      for (var i = 0; i < _self.addCartCouponBox.length; i++) {
                        _self.CouponTraceState(_self.addCartCouponBox[i]);
                      }
                    }

                    if (response.data.out_trade_no == undefined || response.data.out_trade_no == '' ||
                      response.data.out_trade_no == null) {
                      console.log('payCode为：' + response.data.out_trade_no)
                    } else {
                      let formData2 = new FormData();
                      formData2.append('state', 1);
                      formData2.append('payCode', response.data.out_trade_no);
                      formData2.append('orderCode', orderdetailcode);
                      formData2.append('payFeed', '成功');
                      formData2.append('source', '微信');
                      formData2.append('payAmount', money2);
                      formData2.append('userKey', openId);
                      formData2.append('shopCode', _self.shopcode);
                      //发送请求
                      _self.axios.post(_self.ApiUrls + '/buyer/writeOrderPayTrace', formData2, {
                        // 单独配置
                        withCredentials: false
                      }).then(response => {

                        if (response.data.errcode == '0') {
                          var serialNumber = response.data.data.serialNumber;
                          let formData3 = new FormData();
                          formData3.append('shopCode', _self.shopcode);
                          formData3.append('orderCode', orderdetailcode);
                          formData3.append('serialNumber', serialNumber);
                          //发送请求
                          _self.axios.post(_self.ApiUrl + '/catering/cashSettlement', formData3).then(
                            response => {

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

                          _self.shopdetail();

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
                    formDatas.append('shopCode', _self.shopcode);
                    formDatas.append('orderCode', orderdetailcode);
                    _self.axios.post(_self.ApiUrls + '/pay/VerifyPay', formDatas, {
                      // 单独配置
                      withCredentials: false
                    }).then(response => {

                      if (response.data.data.result.coupon_fee == undefined) {
                        var couponfee1 = 0;
                      } else {
                        var couponfee1 = Number(response.data.data.result.coupon_fee);
                      }
                      var cashfeeall1 = Number(response.data.data.result.cash_fee) + couponfee1;

                      if (response.data.data.result.trade_state == 'SUCCESS' && response.data.data
                        .result.result_code ==
                        'SUCCESS' && response.data.data.result.return_code == 'SUCCESS' &&
                        cashfeeall1 ==
                        moneys && response.data.data.result.total_fee == moneys && response.data.data
                        .result
                        .fee_type ==
                        'CNY') {

                        _self.$message({
                          message: '该订单已付款,请核对',
                          type: 'success'
                        });
                        let formData3 = new FormData();
                        formData3.append('shopCode', _self.shopcode);
                        formData3.append('orderCode', orderdetailcode);
                        formData3.append('serialNumber', response.data.data.serialNumber);
                        //发送请求
                        _self.axios.post(_self.ApiUrl + '/catering/cashSettlement', formData3).then(
                          response => {
                            if (response.data.errcode == '0') {
                              _self.goodslist = response.data.data
                              var json = _self.goodslist
                              _self.tankuang = false;
                              _self.print(_self.goodslist);
                              _self.shopdetail();
                              //打印结束
                            } else {
                              _self.$message.error('打印菜单丢失了！');
                            }
                          }).catch(function(error) {
                          _self.$message.error('响应时间过长，请重试');
                        });

                      } else {

                        if (errcodedes == '' || errcodedes == undefined || errcodedes == null) {
                          _self.$alert('订单未付款,请选择现金或者移动支付', '异常提示', {
                            confirmButtonText: '确定',

                          });
                          _self.shopdetail();
                          _self.tankuang = false;

                        } else {
                          _self.$alert(errcodedes + ' , ' + '该订单未支付成功', '异常提示', {
                            confirmButtonText: '确定',

                          });
                          _self.shopdetail();
                          _self.tankuang = false;
                        }
                      }
                    }).catch(function(error) {
                      _self.$message.error('响应时间过长，请重试');
                    });
                    //打印结束
                    let formData = new FormData();
                    formData.append('orderCode ', orderdetailcode);
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

                    if (response.data.out_trade_no == undefined || response.data.out_trade_no == '' ||
                      response.data.out_trade_no == null) {
                      console.log('payCode为：' + response.data.out_trade_no)
                    } else {
                      let formDatafail = new FormData();
                      formDatafail.append('state', 0);
                      formDatafail.append('payCode', response.data.out_trade_no);
                      formDatafail.append('orderCode', orderdetailcode);
                      formDatafail.append('payFeed', '失败');
                      formDatafail.append('source', '微信');
                      formDatafail.append('payAmount', money2);
                      formDatafail.append('userKey', '');
                      formDatafail.append('shopCode', _self.shopcode);
                      //发送请求
                      _self.axios.post(_self.ApiUrls + '/buyer/writeOrderPayTrace', formDatafail, {
                        // 单独配置
                        withCredentials: false
                      }).then(response => {
                        _self.moneyzhe = '';
                        _self.serialnum = '';
                      }).catch(function(error) {
                        _self.$message.error('响应时间过长，请重试');
                      });
                    }

                  }

                }).catch(function(error) {
                  _self.$message.error('响应时间过长，请重试');
                });
              } else {
                let formDatas = new FormData();
                formDatas.append('auth_code', _self.keyword);
                formDatas.append('total_fee', moneys);
                formDatas.append('orderid', orderdetailcode);
                formDatas.append('shop_name', _self.shopcode);
                //发送请求
                _self.axios.post('http://pay.daisha.com.cn/alipay/f2fpay/barpay.php', formDatas, {
                  // 单独配置
                  withCredentials: false
                }).then(response => {

                  if (response.data.code == "10000") {
                      if (_self.addCartCouponBox != '' || _self.addCartCouponBox != undefined) {
                      for (var i = 0; i < _self.addCartCouponBox.length; i++) {
                        _self.CouponTraceState(_self.addCartCouponBox[i]);
                      }
                    }

                    if (response.data.out_trade_no == undefined || response.data.out_trade_no == '' ||
                      response.data.out_trade_no == null) {
                      console.log('payCode为：' + response.data.out_trade_no)
                    } else {
                      let formData2 = new FormData();
                      _self.serialnum = '';
                      formData2.append('state', 1);
                      formData2.append('payCode', response.data.out_trade_no);
                      formData2.append('orderCode', orderdetailcode);
                      formData2.append('payFeed', '成功');
                      formData2.append('source', '支付宝');
                      formData2.append('payAmount', money2);
                      formData2.append('userKey', '');
                      formData2.append('shopCode', _self.shopcode);
                      //发送请求
                      _self.axios.post(_self.ApiUrls + '/buyer/writeOrderPayTrace', formData2, {
                        // 单独配置
                        withCredentials: false
                      }).then(response => {

                        if (response.data.errcode == '0') {
                          var serialNumber = response.data.data.serialNumber;
                          _self.moneyzhe = '';
                          _self.serialnum = '';
                          let formData3 = new FormData();
                          formData3.append('shopCode', _self.shopcode);
                          formData3.append('orderCode', orderdetailcode);
                          formData3.append('serialNumber', serialNumber);
                          //发送请求
                          _self.axios.post(_self.ApiUrl + '/catering/cashSettlement', formData3).then(
                            response => {

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

                          _self.tankuang = false;
                          _self.paymentpay = false;
                          _self.$message.error('写入订单失败，请重试');
                        }

                      }).catch(function(error) {
                        _self.$message.error('写入订单响应时间过长，请重试');

                      });
                    }


                    _self.shopdetail();
                    _self.tankuang = false;
                    _self.paymentpay = false;

                  } else {
                    var errcodedes = response.data.sub_msg
                    _self.serialnum = '';
                    // 打印开始
                    let formDatas = new FormData();
                    formDatas.append('shopCode', _self.shopcode);
                    formDatas.append('orderCode', orderdetailcode);
                    _self.axios.post(_self.ApiUrls + '/pay/VerifyPay', formDatas, {
                      // 单独配置
                      withCredentials: false
                    }).then(response => {

                      if (response.data.data.result.coupon_fee == undefined) {
                        var couponfee1 = 0;
                      } else {
                        var couponfee1 = Number(response.data.data.result.coupon_fee);
                      }
                      var cashfeeall1 = Number(response.data.data.result.cash_fee) + couponfee1;
                      if (response.data.data.result.trade_state == 'SUCCESS' && response.data.data
                        .result.result_code ==
                        'SUCCESS' && response.data.data.result.return_code == 'SUCCESS' &&
                        cashfeeall1 ==
                        moneys && response.data.data.result.total_fee == moneys && response.data.data
                        .result
                        .fee_type ==
                        'CNY') {
                        _self.$message({
                          message: '该订单已付款,请核对',
                          type: 'success'
                        });
                       if (_self.addCartCouponBox != '' || _self.addCartCouponBox != undefined) {
                      for (var i = 0; i < _self.addCartCouponBox.length; i++) {
                        _self.CouponTraceState(_self.addCartCouponBox[i]);
                      }
                    }

                        let formData3 = new FormData();
                        formData3.append('shopCode', _self.shopcode);
                        formData3.append('orderCode', orderdetailcode);
                        formData3.append('serialNumber', response.data.data.serialNumber);
                        //发送请求
                        _self.axios.post(_self.ApiUrl + '/catering/cashSettlement', formData3).then(
                          response => {
                            if (response.data.errcode == '0') {
                              _self.goodslist = response.data.data
                              var json = _self.goodslist

                              _self.print(_self.goodslist);
                              _self.shopdetail();
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
                          _self.shopdetail()

                        } else {
                          _self.$alert(errcodedes + ' , ' + '该订单未支付成功', '异常提示', {
                            confirmButtonText: '确定',

                          });
                          _self.shopdetail();
                        }
                      }
                    }).catch(function(error) {
                      _self.$message.error('响应时间过长，请重试');
                    });
                    //打印结束
                    let formData = new FormData();
                    formData.append('orderCode ', orderdetailcode);
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
                    if (response.data.out_trade_no == undefined || response.data.out_trade_no == '' ||
                      response.data.out_trade_no == null) {
                      console.log('payCode为：' + response.data.out_trade_no)
                    } else {
                      let formDatafail = new FormData();
                      formDatafail.append('state', 0);
                      formDatafail.append('payCode', response.data.out_trade_no);
                      formDatafail.append('orderCode', orderdetailcode);
                      formDatafail.append('payFeed', '失败');
                      formDatafail.append('source', '支付宝');
                      formDatafail.append('payAmount', money2);
                      formDatafail.append('userKey', '');
                      formDatafail.append('shopCode', _self.shopcode);
                      //发送请求
                      _self.axios.post(_self.ApiUrls + '/buyer/writeOrderPayTrace', formDatafail, {
                        // 单独配置
                        withCredentials: false
                      }).then(response => {
                        _self.moneyzhe = '';
                      }).catch(function(error) {
                        _self.$message.error('响应时间过长，请重试1388');
                      });
                    }

                  }

                }).catch(function(error) {
                  _self.$message.error('响应时间过长，请重试1393');
                });
              }
            } else {
              _self.$message.error('创建订单失败');
            }
          }).catch(function(error) {
            _self.$message.error('响应时间过长，请重试');
          });

        }

      },
      Alipay() {
        let _self = this;
        _self.code = "";
        _self.tankuang = true;
        _self.$nextTick(function() {
          //DOM 更新了
          _self.$refs.inputVal.focus()
        })
        _self.indextabs = '1'
      },
      otherpayment() {
        let _self = this;
        if (_self.menudate == '') {
          _self.$message({
            type: 'warning',
            message: '您还没有添加任何商品哦！',

          })
          return false
        }
        _self.code = "";
        _self.tankuang = true;
        // _self.loadings = true;
        _self.$nextTick(function() {
          //DOM 更新了
          _self.$refs.inputVal.focus()
        })
      },
      // 挂起菜单
      guamen() {
        let _self = this;
        //console.log(_self.checkboxGroup)
        _self.isShow = !_self.isShow
        let formData = new FormData();
        formData.append('userId', _self.id);

        _self.axios.post(_self.ApiUrls + '/hang/cateringHangUpOrderDetail', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {
          console.log(response)
          if (response.data.errcode == '0') {
            _self.hangOrderDetail = response.data.data.data
          } else {
            _self.$message.error('挂起菜单不见了，请刷新重试');
          }
        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试');
        });
      },
      guamenlisy() {
        let _self = this;
        let formData = new FormData();
        formData.append('userId', _self.id);
        _self.axios.post(_self.ApiUrls + '/hang/cateringHangUpOrderDetail', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {
          console.log(response)
          if (response.data.errcode == '0') {
            _self.hangOrderDetail = response.data.data.data

          } else {
            _self.$message.error('加载失败，请刷新重试');
          }
        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试');
        });
      },
      //临时挂起
      temporary() {
        let _self = this
        if (_self.menudate == '') {
          _self.$message({
            type: 'warning',
            message: '您还没有添加任何商品哦！',

          })
          return false
        }
        let formData = new FormData();
        // formData.append('userId', _self.id);
        // formData.append('shopCode', _self.shopcode);
        formData.append('cartOrderCode', _self.createCartOrder);
        _self.axios.post(_self.ApiUrls + '/hang/cateringHangUpOrder', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {
          if (response.data.errcode == '0') {
            _self.moneyzhe = '';
            _self.serialnum = '';
            _self.codename = '';
            _self.shopdetail();
          } else {
            _self.$message.error(response.data.errmsg);
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
        let formDatas = new FormData();
        formDatas.append('token', _self.token);
        _self.axios.post(_self.ApiUrls + '/buyer/getUserShoppingCartNewestCartOrderCode', formDatas, {
          // 单独配置
          withCredentials: false
        }).then(response => {
          if (response.data.errcode == '0') {
            _self.createCartOrder = response.data.data.cartOrderCode
            if (_self.createCartOrder == '') {
              _self.$message({
                message: '您的购物车单号为空不能清空哦',
                type: 'warning'
              });
              return false;
            }
            let formData = new FormData();
            // formData.append('token', _self.token);
            formData.append('cartOrderCode', _self.createCartOrder);
            _self.axios.post(_self.ApiUrls + '/buyer/deleteCateringShoppingCarEmpty', formData, {
              // 单独配置
              withCredentials: false
            }).then(response => {
              if (response.data.errcode == '0') {
                _self.moneyzhe = '';
                _self.codename = '';
                _self.serialnum = '';
                // _self.shopdetail();
                _self.menudate = '';
                _self.allPaymentcopum = '';
                _self.allmenudate.allPayment = '';
              } else {
                _self.$message.error('数据错误，请刷新重试');
              }
            }).catch(function(error) {
              _self.$message.error('响应时间过长，请重试');
            });

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
        //0是关店

        if (_self.shopstatus == 0) {
          _self.kaidianbtn = false
        } else {
          _self.kaidianbtn = true
        }
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
                _self.flages = '0';
                for (var i = 0; i < response.data.data.data.list.length; i++) {
                  if (response.data.data.data.list[i].state == 'Y') {
                    _self.type0Goods[i].state = "上新产品"
                  } else if (response.data.data.data.list[i].state == 'N') {
                    _self.type0Goods[i].state = "下架了"

                  }
                }
                let formDatas = new FormData();
                formDatas.append('token', _self.token);
                _self.axios.post(_self.ApiUrls + '/buyer/getUserShoppingCartNewestCartOrderCode',
                  formDatas, {
                    // 单独配置
                    withCredentials: false
                  }).then(response => {
                  if (response.data.errcode == '0') {
                    _self.createCartOrder = response.data.data.cartOrderCode
                    _self.shopdetail();
                  } else {
                    _self.$message.error('数据错误，请刷新重试');
                  }
                }).catch(function(error) {
                  _self.$message.error('响应时间过长，请重试');
                });

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
      getshop() {
        let _self = this;
        let formData2 = new FormData();
        formData2.append('shopCode', _self.shopcode);
        _self.axios.post(_self.ApiUrls + '/buyer/getShopDetail', formData2, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode == '0') {
            _self.$store.commit('SAVE_ShopName', '')
            _self.$store.commit('SAVE_ShopName', response.data.data.data)
          }
        }).catch(function(error) {

        });
      },
      shopdetail() {
        let _self = this

        if (_self.createCartOrder != '') {
          let formData2 = new FormData();
          formData2.append('cartOrderCode', _self.createCartOrder);
          formData2.append('shopCode', _self.shopcode);
          // formData2.append('type', _self.checkboxGroup);
          formData2.append('type', '0');
          _self.axios.post(_self.ApiUrls + '/buyer/getCateringShopingCartDetail', formData2, {
            // 单独配置
            withCredentials: false
          }).then(response => {
            if (response.data.errcode == '0') {
              _self.allmenudate = response.data.data
              _self.allPaymentcopum = _self.allmenudate.allPayment
              _self.menudate = response.data.data.data
              _self.godetailnum = _self.menudate

            } else if (response.data.errcode == '2') {
              _self.$notify({
                title: '消息',
                message: '您还没有添加商品，请您添加商品哦！',
              });
            } else {
              _self.$message.error('数据错误，请刷新重试');
            }
          }).catch(function(error) {
            _self.$message.error('响应时间过长，请重试');
          });
        } else {
          _self.menudate = '';
          _self.allPaymentcopum = '';
          _self.allmenudate.allPayment = '';
        }

      },
      //添加到购物车
      addmenu() {
        let _self = this;

        console.log(_self.checkboxGroup)
        _self.dialogVisible = false;
        if (_self.production.productionSizes == null) {
          var productionCodes = _self.production.productionCode;
          _self.price = _self.arrlist[_self.clickedmoney].price;
        } else {
          var productionCodes = _self.production.productionSizes[_self.clicked].productionCode;
          _self.price = _self.production.productionSizes[_self.clicked].pricelist[_self.clickedmoney];
        }

        var coment2 = '';
        if (_self.commentsGroup == '') {
          coment2 = '';
        } else if (_self.clickeds2 == '-1') {
          coment2 = '';
        } else {
          coment2 = _self.commentsGroup[_self.clickeds2].value
        }

        if (_self.menudate == '') {
          let formData2 = new FormData();
          _self.axios.post(_self.ApiUrls + '/buyer/createCartOrderCode', formData2, {
            // 单独配置
            withCredentials: false
          }).then(response => {
            if (response.data.errcode == '0') {
              console.log(response)
              _self.createCartOrder = response.data.data.cartOrderCode
              let formData = new FormData();
              formData.append('token', _self.token);
              formData.append('shopCode', _self.shopcode);
              // formData.append('seatNum', '');
              formData.append('productionCode', productionCodes);
              formData.append('amount', '1');
              formData.append('price', _self.price);
              formData.append('comments', _self.textarea + coment2);
              formData.append('serialNumber', '');
              formData.append('type', _self.checkboxGroup);
              formData.append('discountRate', _self.codename);
              if (_self.clickedmoney == '1') {
                formData.append('discountType', _self.production.discount_type);
                console.log(_self.production.discount_type + '1')
              } else {
                formData.append('discountType', '');
                console.log(_self.production.discount_type + '2')
              }
              formData.append('cartOrderCode', _self.createCartOrder);
              if (_self.createCartOrder == '') {
                _self.$message({
                  message: '您的购物车单号为空不能添加哦',
                  type: 'warning'
                });
                return false;
              }
              _self.axios.post(_self.ApiUrls + '/buyer/addCaretingShoppingCar', formData, {
                // 单独配置
                withCredentials: false
              }).then(response => {

                if (response.data.errcode == '0') {
                  _self.clickeds2 = -1;
                  _self.clicked = -1;
                  if (_self.moneyzhe !== '') {
                    _self.moneyzhe = '';

                  }
                  //_self.getProductionName();
                  _self.shopdetail();
                } else {
                  _self.$message.error('商品添加失败，请重新添加商品');
                }
              }).catch(function(error) {
                _self.$message.error('响应时间过长，请重试');
              });
            } else {
              _self.$message.error('获取购物车单号失败，请重新获取');
            }
          }).catch(function(error) {
            _self.$message.error('响应时间过长，请重试');
          });
        } else {
          let formData = new FormData();
          formData.append('token', _self.token);
          formData.append('shopCode', _self.shopcode);
          // formData.append('seatNum', '');
          formData.append('productionCode', productionCodes);
          formData.append('amount', '1');
          formData.append('price', _self.price);
          formData.append('comments', _self.textarea + coment2);
          formData.append('serialNumber', '');
          formData.append('type', _self.checkboxGroup);
          formData.append('discountRate', _self.codename);
          if (_self.clickedmoney == '1') {
            formData.append('discountType', _self.production.discount_type);
            console.log(_self.production.discount_type + '1')
          } else {
            formData.append('discountType', '');
            console.log(_self.production.discount_type + '2')
          }
          formData.append('cartOrderCode', _self.createCartOrder);
          _self.axios.post(_self.ApiUrls + '/buyer/addCaretingShoppingCar', formData, {
            // 单独配置
            withCredentials: false
          }).then(response => {

            if (response.data.errcode == '0') {
              _self.clickeds2 = -1;
              _self.clicked = -1;
              if (_self.moneyzhe !== '') {
                _self.moneyzhe = '';

              }
              //_self.getProductionName();
              _self.shopdetail();
            } else {
              _self.$message.error('商品添加失败，请重新添加商品');
            }
          }).catch(function(error) {
            _self.$message.error('响应时间过长，请重试');
          });
        }

      },

      // 数量加
      add(index) {
        console.log(index)
        let _self = this;
        _self.dialogVisible = false;
        _self.loadings = true;
        if (_self.createCartOrder == '') {
          _self.$message({
            message: '您的购物车单号为空不能添加哦',
            type: 'warning'
          });
          return false;
        }

        let formData = new FormData();
        formData.append('token', _self.token);
        formData.append('shopCode', _self.shopcode);
        formData.append('seatNum', '');
        formData.append('productionCode', index.production_code);
        formData.append('amount', '1');
        formData.append('comments', '');
        formData.append('serialNumber', '');
        formData.append('discountRate', _self.codename);
        formData.append('type', _self.checkboxGroup);
        formData.append('price', index.promotional_price);
        formData.append('discountType', index.discount_type);
        formData.append('cartOrderCode', _self.createCartOrder);
        _self.axios.post(_self.ApiUrls + '/buyer/addCaretingShoppingCar', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {

          if (response.data.errcode == '0') {
            _self.loadings = false;
            _self.moneyzhe = '';
            _self.shopdetail()
          } else {
            _self.$message.error('商品添加失败，请重新添加商品');
          }
        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试');
        });
      },
      //数量减
      cuts(index) {
        let _self = this;
        _self.dialogVisible = false;
        _self.loadings2 = true;
        if (_self.createCartOrder == '') {
          _self.$message({
            message: '您的购物车单号为空不能删除哦',
            type: 'warning'
          });
          return false;
        }

        let formData = new FormData();
        // formData.append('token', _self.token);
        formData.append('productionCode', index.production_code);
        formData.append('discountType ', index.discount_type);
        formData.append('cartOrderCode', _self.createCartOrder);
        formData.append('type', _self.checkboxGroup);
        formData.append('shopCode', _self.shopcode);
        _self.axios.post(_self.ApiUrls + '/buyer/deleteCateringShoppingCar', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {
          if (response.data.errcode == '0') {
            _self.loadings2 = false;
            _self.moneyzhe = '';
            _self.codename = '';
            _self.shopdetail();
            //_self.getProductionName();
          } else {
            _self.$message.error('商品删减失败，请重新添加商品');
          }
        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试');
        });
      },
      //添加到未支付订单

      // check() {
      // 	let _self = this;
      // 	let formData = new FormData();
      // 	formData.append('token', _self.token);
      // 	formData.append('shopCode', _self.shopcode);
      // 	formData.append('seatNum', '');
      // 	formData.append('payment', _self.allmenudate.allPayment);
      // 	formData.append('code', '');
      // 	formData.append('state', '1');
      // 	_self.axios.post(_self.ApiUrls + '/buyer/createOrderCode ', formData, {
      // 		// 单独配置
      // 		withCredentials: false
      // 	}).then(response => {
      // 		if (response.data.errcode == '0') {
      // 			_self.$message({
      // 				message: '添加成功',
      // 				type: 'success'
      // 			});
      // 			_self.codename = ''
      // 			_self.getuser()
      // 		} else {
      // 			_self.$message.error('添加错误，请刷新重试');
      // 		}
      // 	}).catch(function(error) {
      // 		_self.$message.error('响应时间过长，请重试');
      // 	});
      // },
      //继续点餐
      continues(index, tab) {
        let _self = this;
        let formData = new FormData();
        // formData.append('userId', _self.id);
        // formData.append('serialNumber', _self.hangOrderDetail[index].serialNumber);
        formData.append('cartOrderCode', _self.hangOrderDetail[index].cartOrderCode);
        _self.axios.post(_self.ApiUrls + '/hang/cateringContinueToOrder', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {
          if (response.data.errcode == '0') {
            _self.createCartOrder = response.data.data.cartOrderCode
            _self.guamen()
            _self.shopdetail()
          } else {
            _self.$message.error('已不能继续点餐，请刷新重试');
          }
        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试1531');
        });
      },
      //删除单个挂起菜单
      deletlist(index) {

        let _self = this;

        let formData = new FormData();
        // formData.append('userId', _self.id);
        // formData.append('serialNumber', _self.hangOrderDetail[index].serialNumber);
        formData.append('cartOrderCode', _self.hangOrderDetail[index].cartOrderCode);
        _self.axios.post(_self.ApiUrls + '/hang/cateringDeleteHangUpOrderCode', formData, {
          // 单独配置
          withCredentials: false
        }).then(response => {
          if (response.data.errcode == '0') {

            _self.guamenlisy()

          } else {
            _self.$message.error('删除失败，请刷新重试');
          }
        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试');
        });
      },
      //上架
      shangjiabtn(index) {
        let _self = this;

        let formData = new FormData();
        formData.append('productionCode', _self.type0Goods[index].productionCode);
        formData.append('state', 'Y');
        _self.axios.post(_self.ApiUrl + '/catering/goodsControlForLoadingAndUnloading', formData).then(
          response => {
            if (response.data.errcode == '0') {
              _self.$message({
                message: '上架成功',
                type: 'success'
              });
              _self.getProductionName()

            } else {
              _self.$message.error('下架失败');
            }
          }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试');
        });
      },
      //下架
      xiajiabtn(index) {
        let _self = this;

        let formData = new FormData();
        formData.append('productionCode', _self.type0Goods[index].productionCode);
        formData.append('state', 'N');
        _self.axios.post(_self.ApiUrl + '/catering/goodsControlForLoadingAndUnloading', formData).then(
          response => {
            if (response.data.errcode == '0') {
              _self.$message({
                message: '下架成功',
                type: 'success'
              });
              _self.getProductionName()

            } else {
              _self.$message.error('下架失败');
            }
          }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试');
        });
      },
      xiajiatop() {
        this.$notify.info({
          title: '提示',
          message: '需手动上架后方可点菜'
        });
      },
      idcard() {
        let _self = this;
        _self.Unionpay = true
        _self.money2 = _self.allmenudate.allPayment
        // if (_self.moneyzhe == '') {
        _self.sum = parseFloat(_self.moneyinput - _self.money2).toFixed(2)
        // 				} else {
        // 					_self.sum = parseFloat(_self.moneyinput - _self.moneyzhe).toFixed(2)
        // 				}
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
      //银联
      UnionPayclick(index) {
        let _self = this;
        _self.clicked = index;
        console.log(_self.UnionPayBox[index])
        _self.UnionPayBoxindex = _self.UnionPayBox[index].value
      },
      UnionPayclickup() {
        let _self = this;
        var money2 = _self.allmenudate.allPayment;
        // if (_self.moneyzhe == '') {
        var moneys = _self.allmenudate.allPayment * 100;
        // 				} else {
        // 					var moneys = _self.moneyzhe * 100;
        // 					_self.zhehoumoneyt = parseFloat(money2 - _self.moneyzhe).toFixed(2)
        // 				}

        if (money2 < 0) {
          _self.$message({
            message: '订单金额不能为负数哦',
            type: 'warning'
          });
          return false
        }
        if (_self.UnionPayBoxindex == '') {
          _self.$message({
            message: '请选择银行卡',
            type: 'warning'
          });
          return false
        }
        if (_self.profilequeuetype == 'TABLE-NUM') {
          if (_self.zhuosum == '') {
            _self.$message({
              message: '请填写桌号',
              type: 'warning'
            });
            return false
          }
        }
        var seatNums = '0'
        if (_self.zhuosum == '') {
          seatNums = '0'
        } else {
          seatNums = _self.zhuosum
        }
        if (_self.createCartOrder == '' || _self.createCartOrder == undefined || _self.createCartOrder ==
          null) {
          _self.$message({
            message: '您的购物车单号为空请重新添加菜品',
            type: 'warning'
          });
          return false
        }
        _self.loadingcash1 = true;
        var newdata = {
          token: _self.token,
          shopCode: _self.shopcode,
          payment: money2,
          code: '',
          seatNum: seatNums,
          creditType: '0',
          cartOrderCode: _self.createCartOrder,
          orderType: _self.checkboxGroup,
          state: '1',
          sales: '',
          list: _self.coupontableData,
          comments: ''
        }
        _self.axios.post(_self.ApiUrls + '/buyer/createOrderCode', {
          jsonData: newdata
        }, {
          // 单独配置
          withCredentials: false
        }, {
          headers: {
            'Content-Type': 'application/json;charsetset=UTF-8'
          }
        }).then(response => {
          let orderdetailcode = response.data.data.orderCode
          if (response.data.errcode == '0') {
            _self.codename = '';
            _self.serialnum = '';
            _self.zhuosum = '';
            _self.createCartOrder = ''
            let formData2 = new FormData();
            formData2.append('state', 1);
            formData2.append('payCode', _self.UnionPayBoxindex);
            formData2.append('orderCode', orderdetailcode);
            formData2.append('payFeed', '成功');
            formData2.append('source', '银联');
            formData2.append('payAmount', money2);
            formData2.append('userKey', '');
            formData2.append('shopCode', _self.shopcode);
            //发送请求
            _self.axios.post(_self.ApiUrls + '/buyer/writeOrderPayTrace', formData2, {
              // 单独配置
              withCredentials: false
            }).then(response => {

              if (response.data.errcode == '0') {
                var serialNumber = response.data.data.serialNumber
                _self.clicked = '-1';
                _self.serialnum = '';
                _self.UnionPayBoxindex = '';
                _self.moneyzhe = '';
                 if (_self.addCartCouponBox != '' || _self.addCartCouponBox != undefined) {
                      for (var i = 0; i < _self.addCartCouponBox.length; i++) {
                        _self.CouponTraceState(_self.addCartCouponBox[i]);
                      }
                    }

                _self.loadingcash1 = false;
                let formData3 = new FormData();
                formData3.append('shopCode', _self.shopcode);
                formData3.append('orderCode', orderdetailcode);
                formData3.append('serialNumber', serialNumber);
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
                _self.shopdetail();
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
                formData2.append('orderCode', orderdetailcode);
                formData2.append('payFeed', '失败');
                formData2.append('source', '银联');
                formData2.append('payAmount', money2);
                formData2.append('shopCode', _self.shopcode);
                //发送请求
                _self.axios.post(_self.ApiUrls + '/buyer/writeOrderPayTrace', formData2, {
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

        }).catch(function(error) {
          _self.$message.error('响应时间过长，请重试');
        });

      }
    },
    created: function() {
      let _self = this
      _self.getuser()
      if(this.shopgroup=='R_SAMCT'){
       this.SelfTaking='自取'
      this.distribution='配送'
     }else{
         this.SelfTaking='堂食'
       this.distribution='外卖'
     }

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

  .page-breaks {
    margin-top: 10px;
    margin-left: 20px;
    position: absolute;
    bottom: 1%;
    left: 30%;
  }

  .page-uls {
    display: flex;
    height: 30px;

  }

  .page-breaks li {
    list-style: none;
    margin: 0 0.825rem;
  }

  .page-breaks a {
    /* border: 1px solid #ddd; */
    text-decoration: none;
    /* padding: 14px 22px; */
    color: #434343;
    cursor: pointer;
    font-size: 1.65rem;
    font-weight: bold;
  }

  .page-breaks a:hover {
    background-color: #eee;
  }

  .page-breaks a .banclick {
    cursor: not-allowed;
  }

  .page-breaks .active a {
    color: #aaaaaa;
    cursor: default;
    /* background-color: #409EFF; */
    border-color: #c0c4cc;
  }

  .page-breaks i {
    font-style: normal;
    color: #d44950;
    margin: 0px 4px;
    font-size: 12px;
  }

  .page-breaks .jumpbox .jumppage {
    border: 1px solid #ddd;
    margin-left: 40px;
    height: 33px;
    width: 40px;
    float: left;
  }

  .page-breaks .jumpbox .jumpbtn {
    cursor: pointer;
    margin-left: 10px;
  }

  .page-breaks .jumpbox .jumpbtn:active {
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

  .pfalg {
    font-size: 12px;
    color: #F56C6C;
    margin-bottom: 10px
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
      height: 80px;
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
