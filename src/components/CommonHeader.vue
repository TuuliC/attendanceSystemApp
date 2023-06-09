<template>
  <div class="header-container">
    <div class="l-content">
      <span class="text">{{name}}</span>
    </div>
    <div class="r-content"></div>
  </div>
</template>
<script>
export default {
  props:['name'],
  mounted () {
    console.log()
  },
  data () {
    return {}
  }
}
</script>
<style lang="less" scoped>
.header-container {
  padding: 0 20px;
  background-color: #333;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .text {
    color: #fff;
    font-size: 14px;
    // margin-left: 10px;
  }
}
</style>
