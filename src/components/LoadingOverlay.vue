<template>
  <transition name="slide">
    <div v-if="show" class="loading-overlay">
      <div class="spinner"></div>
      <p>Loading...</p>
    </div>
  </transition>
</template>

<script setup>
import { defineProps } from 'vue';

// 接收一个 props 来控制显示/隐藏
const props = defineProps({
  show: {
    type: Boolean,
    required: true
  }
});
</script>

<style scoped>
/* 关键样式：使加载层覆盖整个屏幕 */
.loading-overlay {
  position: fixed; /* 固定定位 */
  top: 0;
  left: 0;
  width: 100vw; /* 视口宽度 */
  height: 100vh; /* 视口高度 */
  background-color: rgba(255, 255, 255, 0.95); /* 半透明白色背景 */
  z-index: 9999; /* 确保它在所有页面元素之上 */
  
  /* 使内容居中 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* ------------------ 过渡 CSS ------------------ */

/* 1. 离开和进入的初始/结束状态：从底部移出/进入 */
.slide-enter-from,
.slide-leave-to {
  /* 关键：将整个加载层移到视口下方 */
  transform: translateY(100vh); 
}

/* 2. 过渡中的状态 */
.slide-enter-active,
.slide-leave-active {
  /* 定义动画效果和持续时间 */
  transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.5, 1);
}

/* 3. 进入的结束状态（回到正常位置，可以省略，因为默认就是 translateY(0)）
.slide-enter-to,
.slide-leave-from {
  transform: translateY(0);
} */

/* 示例 Spinner 样式 */
.spinner {
  /* ... 你的加载动画样式 ... */
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>