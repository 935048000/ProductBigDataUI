<template>
  <div id="app">
  <!--路由入口-->
  <navigation v-if="$route.meta.keepAlive">
    <router-view></router-view>
  </navigation>
   <router-view  v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>

</style>
