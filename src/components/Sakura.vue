<template>
    <div class="fc-top-sakura">
          <div class="fc-top-sakura-inner">
              <img src="../assets/img/sakura/sakura_1.png"> 
              <img src="../assets/img/sakura/sakura_2.png"> 
              <img src="../assets/img/sakura/sakura_3.png"> 
              <img src="../assets/img/sakura/sakura_4.png"> 
              <img src="../assets/img/sakura/sakura_5.png"> 
              <img src="../assets/img/sakura/sakura_6.png">
          </div>
      </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const verison = ref("1.0.0")
console.log("Sakura Animation verion:", verison.value)
</script>

<style scoped>
/* 樱花动画 */
.fc-top-sakura {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
}

.fc-top-sakura-inner {
  position: relative;
  width: 100%;
  height: 100%;
  padding-top: 75%;
}

.fc-top-sakura-inner img {
  position: absolute;
  top: -10%;
  left: 0;
  width: 24px;
  height: auto;
  opacity: 0.9;
  pointer-events: none;
}

/* 动画定义 */
@keyframes fall {
  0% {
    opacity: 0;
    top: -10%;
    transform: translateY(0) rotate(0deg);
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    top: 90%;
  }
}

@keyframes sway1 {
  0% {
    transform: translateX(0) rotate(0deg);
    filter: blur(0);
  }
  100% {
    transform: translateX(150px) rotate(-45deg);
    filter: blur(1px);
  }
}

@keyframes sway2 {
  0% {
    transform: translateX(200px) rotate(-45deg);
  }
  100% {
    transform: translateX(0) rotate(0deg);
  }
}

@keyframes sway3 {
  0% {
    transform: translateX(0) rotate(45deg);
    filter: blur(0);
  }
  100% {
    transform: translateX(150px) rotate(0deg);
    filter: blur(2px);
  }
}

/* 樱花动画实例 */
.fc-top-sakura-inner img:nth-child(1) {
  left: 10%;
  width: 24px;
  animation: fall 10s linear infinite, sway1 4s ease-in-out infinite alternate;
  animation-delay: 0s, 0s;
}

.fc-top-sakura-inner img:nth-child(2) {
  left: 30%;
  width: 28px;
  animation: fall 12s linear infinite, sway2 3s ease-in-out infinite alternate;
  animation-delay: 1s, 1s;
}

.fc-top-sakura-inner img:nth-child(3) {
  left: 55%;
  width: 30px;
  animation: fall 10s linear infinite, sway3 3s ease-in-out infinite alternate;
  animation-delay: 0.5s, 0.5s;
}

.fc-top-sakura-inner img:nth-child(4) {
  left: 80%;
  width: 24px;
  animation: fall 8s linear infinite, sway1 3s ease-in-out infinite alternate;
  animation-delay: 0s, 0s;
}

.fc-top-sakura-inner img:nth-child(5) {
  left: 60%;
  width: 28px;
  animation: fall 8s linear infinite, sway2 4.5s ease-in-out infinite alternate;
  animation-delay: 1s, 1s;
}

.fc-top-sakura-inner img:nth-child(6) {
  left: 70%;
  width: 30px;
  animation: fall 12s linear infinite, sway3 3s ease-in-out infinite alternate;
  animation-delay: 2s, 2s;
}

/* 平板及以下 */
@media (max-width: 798px) {
  .fc-top-sakura-inner {
    padding-top: 120%; /* 减少高度，避免过长 */
  }
}

/* 手机端（小屏） */
@media (max-width: 599.98px) {
  .fc-top-sakura-inner {
    padding-top: 100%;
  }

  /* 降低动画幅度 */
  @keyframes sway1 {
    to {
      transform: translateX(50px) rotate(-45deg);
      filter: blur(0.5px);
    }
  }

  @keyframes sway2 {
    from {
      transform: translateX(100px) rotate(-45deg);
    }
    to {
      transform: translateX(0) rotate(0deg);
    }
  }

  @keyframes sway3 {
    to {
      transform: translateX(50px) rotate(0deg);
      filter: blur(1px);
    }
  }

  /* 缩小樱花尺寸 */
  .fc-top-sakura-inner img {
    width: 18px;
  }

  .fc-top-sakura-inner img:nth-child(1),
  .fc-top-sakura-inner img:nth-child(4) {
    width: 16px;
  }
}

/* 减少动画（无障碍/省电模式） */
@media (prefers-reduced-motion: reduce) {
  .fc-top-sakura-inner img {
    animation: none !important;
    display: none;
  }
}

/* 大屏优化 */
@media (min-width: 1440px) {
  .fc-top-sakura-inner {
    padding-top: 72%;
  }
}
</style>