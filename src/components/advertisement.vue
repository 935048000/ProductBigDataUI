<template>
  <div class="adverBody">
    <el-carousel :interval="3000" arrow="always" height='100vh'>
      <el-carousel-item v-for="item in 4" :key="item">
        <div class="carouselImage">
          <img src="https://dh-web-resource.oss-cn-hangzhou.aliyuncs.com/aver/bannar.jpg" alt="" srcset="">
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script>
import { Carousel } from "element-ui";

export default {
  components: {
    Carousel
  }
};
</script>
<style lang="less" scoped>
.adverBody{
  overflow: hidden;
}
.carouselImage{
  overflow: hidden;
  img{
    height: 100%;
    width: 100%;
  }
}
</style>