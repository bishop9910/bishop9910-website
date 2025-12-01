<template>
  <main>
  <section>
    <h1>项目类型</h1>
    <div class="project">
      <h2>稳定项目</h2>
      <h3>点击跳转:</h3><router-link to="/stableprojects" class="btn">前往</router-link><br/><br/>
      <h2>长期维护项目</h2>
      <h3>点击跳转:</h3><router-link to="/longtermmaintenanceprojects" class="btn">前往</router-link><br/><br/>
    </div>
  </section>

    <router-link to="/" class="btn" style="display:flex">返回主页</router-link>
  </main>
</template>

<script setup lang="ts"></script>