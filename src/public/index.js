 
 // 导出excel表格函数
export function tableToExcel (tableData ,tHeader ,filterVal ,title){
require.ensure([], () => {
    const {
        export_json_to_excel
    } = require('@/vendor/Export2Excel');
    // const tHeader = ['订单号', '订单详情', '备注','订单类型','订单金额','实际金额','下单方式','下单时间','支付方式','操作人'];
    // // 上面设置Excel的表格第一行的标题
    // const filterVal = ['orderCode', 'productNameArr','comments','orderType','payAmount','actualAmount','orderWay','create_at','source','operation'];
    // 上面的index、nickName、name是tableData里对象的属性
    const list = tableData; //把data里的tableData存到list
    const data = formatJson(filterVal, list);
    export_json_to_excel(tHeader, data, title);
})
}
function formatJson(filterVal, jsonData) {
    return jsonData.map(v => filterVal.map(j => v[j]))
}
