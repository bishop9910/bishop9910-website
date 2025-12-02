<template>
  <main>
    <section>
    <h2>音频播放器</h2>

    <div class="input-container">
      <input
        type="text"
        v-model="inputUrl"
        placeholder="在此输入音频文件URL (如 .mp3 或 .wav 或 .m4a 等)"
        class="url-input"
      />
      <button @click="loadAudio" class="load-button">
        加载音频
      </button>
    </div>

    <p class="current-src">当前加载的音频源: <strong>{{ audioSrc || '暂无' }}</strong></p>
    </section>
    <hr>
    <section>
      <AudioPlayer
        :src="audioSrc"
        :autoPlay="false"
      />
    </section>
    <router-link to="/functions" class="btn" style="display:flex">返回功能</router-link>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AudioPlayer from './AudioPlayer.vue';

// ------------------------------------
// 状态管理
// ------------------------------------
// 实际传给 AudioPlayer 的音频 URL
const audioSrc = ref(''); 

// 用于输入框双向绑定的临时 URL
// 这里我先放一个示例链接，方便你测试（请确保这个链接是有效的）
const inputUrl = ref('https://cdn.pixabay.com/download/audio/2025/09/17/audio_32aeb1ec12.mp3'); 

// ------------------------------------
// 方法
// ------------------------------------
/**
 * 将输入框中的 URL 设置给 audioSrc，从而触发 AudioPlayer 重新加载
 */
const loadAudio = () => {
  // 简单的验证，确保输入不为空
  if (inputUrl.value.trim()) {
    audioSrc.value = inputUrl.value.trim();
    console.log('音频源已更新为:', audioSrc.value);
  } else {
    alert('请输入一个有效的音频 URL！');
  }
};

// ------------------------------------
// 初始化
// ------------------------------------
// 页面加载时，自动加载默认的示例链接
loadAudio();
</script>

<style scoped>
/* 简单的样式，让输入框和按钮看起来更好 */
.input-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.url-input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.load-button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.load-button:hover {
  background-color: #0056b3;
}

.current-src {
    font-size: 0.9em;
    color: #555;
    word-break: break-all;
}

hr {
    margin: 20px 0;
    border: 0;
    border-top: 1px solid #eee;
}
</style>