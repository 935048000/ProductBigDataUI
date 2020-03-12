<template>
    <div class="adver_body">
       <div class="left">
          <Adver></Adver>
       </div>
       <div class="right">
         <Bill></Bill>
       </div>
    </div>
</template>
<script>
import Adver from '@/components/advertisement.vue'
import Bill from '@/components/bill.vue'
export default {
   components:{
       Adver,
       Bill
   }
}
</script>
<style lang="less" scoped>
.adver_body{
  display: flex;
  .left{
      flex: 1;
  }
  .right{
      width: 300px;
      height: 100vh;
      border-left: 1px solid #333;
  }
}
</style>