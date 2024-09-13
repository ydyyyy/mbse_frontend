<template>
  <el-card class="custom-card">
    {{ text }}
  </el-card>
</template>

<script>
  export default {
    name: 'CardDemand',
    props: {
      text: {
        type: String,
        required: true
      }
    }
  }
</script>

<style scoped>
.custom-card {
    width: 200px;
    height: 50px;
    background-color: lightblue;
    text-align: center;
    line-height: 12px;
    border: 1px solid #5c96bc;
    border-radius: 5px;
    cursor: pointer;
}

.custom-card:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-3px);
}

.custom-card:hover::after {
  width: 100%;
}
</style>
