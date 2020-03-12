<template>
    <div class="cell">
       <div class="cellTitle">
           {{this.title+':'}}
       </div>
       <div class="cellContent">
           <slot></slot>
       </div>
    </div>
</template>
<script>
export default {
    props:['title']
}
</script>
<style lang="less" scoped>
 .cell{
     display: flex;
     margin: 10px 10px;
     .cellTitle{
         width: 80px;
     }
     .cellContent{
         flex: 1;
     }
 }
</style>