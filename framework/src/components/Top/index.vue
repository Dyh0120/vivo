<template>
  <div class="w">
    <div class="top">
      <img src="./../../../public/image/图片1.png" alt="" height="60px" />
      <div class="title">🌟心晴拾语——情感分析系统🌟</div>
    </div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.w {
  width: 1200px;
  margin: 0 auto;
  background-color: #fff;
  height: 100px;
}

.top {
  display: flex;
  align-items: center;
  height: 100%;
}

img {
  height: 60px;
  margin-left: 15px;
}

.title {
  flex-grow: 1;
  font-size: 32px;
  font-weight: 700;
  color: #004c9cd5;
  font-family: 'Arial', sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: center; 
}
</style>
