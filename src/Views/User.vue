<template>
  <div class="show">
    role:
    {{this.role}}
    <el-button
      type="success"
      plain
      icon="el-icon-check"
      @click="logout()"
    >
      注销
    </el-button>
  </div>
</template>
<script>
import {storage} from "../storage/storage";
import router from "../router";

export default {
  data() {
    return {
      role: ''
    };
  },
  created() {
    this.role = storage.get('role')
  },

  methods: {
    logout(){
      storage.remove('isAuthenticated')
      router.push('/login')
    },

  },
};
</script>
<style>
.show {
  width: 100%;
  height: 100%;

  display: table-cell;
  vertical-align: middle;
  text-align: center;
}


</style>
