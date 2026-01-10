<template>
  <main>
    <Sakura/>
    <section>
      <h1>关于我</h1>
      <p>{{ introduce }}</p>
      <p>技能:{{ skills }}</p>
      <img src="../assets/img/bishop9910.jpg" alt="bishop9910" title="bishop9910" style="max-width: 200px; border-radius: 50%; margin-top: 20px;">
      <br/>
      <router-link to="/" class="btn">返回主页</router-link>
    </section>
  </main>
</template>

<script setup lang="ts">
import Sakura from "./Sakura.vue"
import { ref } from "vue"
const introduce = ref("我是一名臭自学代码的大学生，专注于 Python、C#、JS等语言")
const skills = ref("Vue2/3, electron, HTML5, CSS3, PySide, Go-lang等")
</script>