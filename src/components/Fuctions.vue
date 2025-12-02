<template>
  <main>
    <section>
      <h1>功能</h1>
      <div class="project">
        <h2>摸鱼日历</h2>
        <h3>点击跳转:</h3><router-link to="/holidaycalendar" class="btn">前往</router-link><br/><br/>
      </div>
    </section>

    <section>
      <h1>功能</h1>
      <div class="project">
        <h2>音频播放器</h2>
        <h3>点击跳转:</h3><router-link to="/audioplayer" class="btn">前往</router-link><br/><br/>
      </div>
    </section>

    <router-link to="/" class="btn" style="display:flex">返回主页</router-link>
  </main>
</template>

<script setup lang="ts"></script>