<template>
  <main>
    <div class="wrapper">
      <div class="typing">
          {{ showText }}
      </div>
    </div>

    <br/><br/>

    <section>
      <div class="wel">欢迎来到bishop9910的主页</div>
      <p>在这里你可以查看我的项目，并和我联系。</p>
      <router-link to="/about" class="btn">了解更多</router-link>
    </section>

    <section>
      <h2>项目</h2>
      <p>我开发的各种项目</p>
      <router-link to="/projects" class="btn">前往</router-link>
    </section>

    <section>
      <h2>功能</h2>
      <p>网站自带的各种奇妙功能</p>
      <router-link to="/functions" class="btn">前往</router-link>
    </section>

    <section>
      <h2>取得联系</h2>
      <p>前往</p>
      <router-link to="/contactme" class="btn">联系我</router-link>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue"
const showText = ref("眩しさだけは 忘れなかった。")
</script>

<style scoped>
.wel{
  font-weight: 300;
  font-size: 40px;
  display: inline-block;
}

.typing {
  width: 70%;
  color:#9fffcf;
  animation: typing 2s steps(22), blink .5s step-end infinite alternate;
  white-space: nowrap;
  overflow: hidden;
  border-right: 3px solid;
  font-family: monospace;
  font-size: 5em;
}

@keyframes typing {
  from {
    width: 0;
  }
}

@keyframes blink {
  50% {
    border-color: transparent;
  }
}

@media (max-width: 830px) {
  .typing{
      font-size: 3.4em;
    }
}

@media (max-width: 798px) {
  .typing{
    font-size: 3em;
  }
}

@media (max-width: 599.98px) {
  .typing{
    font-size: 1.37em;
  }
}
</style>