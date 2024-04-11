<template>
  <div class="header-container">
    
    <div class="l-content">
      <el-dropdown @command="handleClick">
        <span class="el-dropdown-link">
          <img class="user" src="../assets/logo.png" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>个人中心</el-dropdown-item>
          <el-dropdown-item command="cancel">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <div class="r-content">
        <el-button type="primary" icon="el-icon-upload" @click="goFilePage">大模型功能</el-button>
    </div>


  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    goFilePage() {
      this.$router.push('/file'); 
    }
  },
  computed: {
   
  },
};
</script>
<style lang="less" scoped>
.header-container {
  background-color: #333;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  .text {
    color: #fff;
    font-size: 14px;
    margin-left: 10px;
  }
  .user {
    width: 40px;
    height: 40px;
  }
  .l-content {
    display: flex;
    align-items: center;
    /deep/.el-breadcrumb__item {
      .el-breadcrumb__inner {
        font-weight: normal;
        &.is-link {
          color: #666;
        }
      }
      &:last-child {
        .el-breadcrumb__inner {
          color: #fff;
        }
      }
    }
  }
}
</style>
