<template>
  <div class="header-container">
    <div class="l-content">
      <span class="text">{{ name }}</span>
    </div>
    <div class="r-content">
      欢迎{{this.username}}
      <el-button
        type="warning" plain
        icon="el-icon-circle-close"
        @click="logout()"
      >
        注销
      </el-button>
    </div>
  </div>
</template>
<script>
import {storage} from "../storage/storage";
import router from "../router";

export default {
  mounted() {
    console.log()
  },
  created() {
    this.username = storage.get('username')
  },
  data() {
    return {
      username: '',
    }
  },
  methods: {
    logout() {
      storage.remove('isAuthenticated')
      router.push('/login')
    },
  },
  props: ['name']
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
