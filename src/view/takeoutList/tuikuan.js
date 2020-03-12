import { getPayCode, shouShopPayBodyCode, wxRefund, cateringFullRefund, wxRefundQuery } from '@/service'
export default async function (_self) {
    if (
        _self.ReasonsforRefund == ""
    ) {
        _self.$message({
            type: "warning",
            message: "请完善您的信息！",
            showClose: true
        });
        return false;
    }
    // if (_self.NumberofRefunds > _self.Quantity) {
    //     _self.$message({
    //         message: "您输入的数量不能大于商品本身的数量哦",
    //         type: "warning"
    //     });
    //     return false;
    // }
    // if (_self.refund > _self.TotalRefund) {
    //     _self.$message({
    //         type: "warning",
    //         message: "退款金额不能大于退款合计哦！",
    //         showClose: true
    //     });
    //     return false;
    // }
    // if (_self.NumberofRefunds == 0) {
    //     _self.$message({
    //         message: "您的数量为0哦",
    //         type: "warning"
    //     });
    //     return false;
    // }
    // if (_self.refund > _self.actuals2) {
    //     _self.$message({
    //         type: "warning",
    //         message: "退款金额不能大于实际金额哦！",
    //         showClose: true
    //     });
    //     return false;
    // }
    _self.tuikuanVisible = false;
    _self.loadwait = true;

    await getPayCode({
        order_code: _self.orderCodedetail
    }).then(res => {
        _self.pay_code = res.data.data.data.pay_code
    }).catch(error => {
        _self.$message.error('获取支付码失败')
    })
    await shouShopPayBodyCode({
        shop_code: _self.shopcode
    }).then(res => {
        _self.pay_body_code = res.data.data.data[0].pay_body_code

    }).catch(error => {
        _self.$message.error('获取支付主体失败')
    })
    console.log(typeof (parseFloat(_self.TotalRefund)), parseFloat(_self.TotalRefund));
    // return
    wxRefund({
        pay_body_code: _self.pay_body_code,
        pay_code: _self.pay_code,
        total_fee: parseInt(_self.TotalRefund * 100),
        refund_fee: parseInt(_self.TotalRefund * 100)
    }).then(res => {
        if (res.data.errcode === 0) {
            if (res.data.data.return_code === 'SUCCESS') {
  
                wxRefundQuery({
                    pay_body_code: _self.pay_body_code,
                    pay_code: _self.pay_code
                }).then(res => {
                    if (res.data.errcode === 0) {
                        if (res.data.data.return_code == 'SUCCESS') {
                            cateringFullRefund({
                                orderCode: _self.orderCodedetail,//订单号
                                userId: _self.id,
                                payCode: _self.pay_code,//外卖订单那里有返回一个字段pay_code
                                state: '2',//2表示退款成功，3表示退款失败
                                source: '微信',//表示来源，比如微信退款，就写微信
                            }).then(res => {
                                if (res.data.errcode !== 0) {
                                    _self.$message.error('记录退款失败')
                                    _self.search()
                                }else{
                                    _self.$message.success('退款成功')
                                    _self.search()
                                }
                            }).catch(err => {
                                _self.$message.error('记录退款失败')
                            })
                        } else {
                            _self.$message.error("未退款");
                        }
                    } else {
                        self.$message.error('退款失败')
                        cateringFullRefund({
                            orderCode: _self.orderCodedetail,//订单号
                            userId: _self.id,
                            payCode: _self.pay_code,//外卖订单那里有返回一个字段pay_code
                            state: '3',//2表示退款成功，3表示退款失败
                            source: '微信',//表示来源，比如微信退款，就写微信
                        }).then(res => {
                            if (res.data.errcode !== 0) {
                                _self.$message.error('记录退款失败')
                            }
                        }).catch(err => {
                            _self.$message.error('记录退款失败')
                        })
                    }
                })

            } else {
                _self.$message.error('退款失败')
            }
        } else {
            _self.$message.error(res.data.errmsg)
        }
    })
}
