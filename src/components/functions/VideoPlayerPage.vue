<template>
  <main>
    <section>
      <h2>视频播放器</h2>

      <div class="input-container">
        <input
          type="text"
          v-model="inputUrl"
          placeholder="在此输入视频文件URL (如 .mp4 等)"
          class="url-input"
        />
        <button @click="loadVideo" class="load-button">
          加载视频
        </button>
      </div>

      <p class="current-src">当前加载的视频源: <strong>{{ videoUrl || '暂无' }}</strong></p>
    </section>
    <hr>
    
    <section>
      <VideoPlayer
        ref="playerRef"
        :src="videoUrl"
        :autoplay="false"
        :controls="false"
        @play="logEvent('Play')"
        @pause="logEvent('Pause')"
        @time-update="handleTimeUpdate"
        @loaded-metadata="handleLoadedMetadata"
        :poster="DefaultPoster"
      />
      <div class="controls">
        <button @click="handlePlay" class="btn">播放</button>
        <button @click="handlePause" class="btn">暂停</button>
      </div>
    </section>
    <router-link to="/functions" class="btn" style="display:flex">返回功能</router-link>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import VideoPlayer from './VideoPlayer.vue';
import testVideo from '@/assets/video/test.mp4'
import DefaultPoster from '@/assets/img/bg_pc.png'


// ------------------------------------
// 1. 视频源
// ------------------------------------

const videoUrl = ref(testVideo); 
const inputUrl = ref(testVideo)

const loadVideo = () => {
  // 简单的验证，确保输入不为空
  if (inputUrl.value.trim()) {
    videoUrl.value = inputUrl.value.trim();
    console.log('视频源已更新为:', videoUrl.value);
  } else {
    alert('请输入一个有效的视频 URL！');
  }
};

// ------------------------------------
// 2. 引用组件实例
// ------------------------------------

// 获取组件实例的类型，这里使用 typeof 和 InstanceType
type VideoPlayerInstance = InstanceType<typeof VideoPlayer> & {
  play: () => void;
  pause: () => void;
  seek: (time: number) => number | undefined;
};

const playerRef = ref<VideoPlayerInstance | null>(null);

// ------------------------------------
// 3. 状态管理
// ------------------------------------

const currentTime = ref(0);
const duration = ref(0);

// ------------------------------------
// 4. 事件处理
// ------------------------------------

const logEvent = (name: string) => {
  console.log(`视频事件触发: ${name}`);
};

const handleTimeUpdate = (time: number) => {
  currentTime.value = time;
};

const handleLoadedMetadata = (totalDuration: number) => {
  duration.value = totalDuration;
  console.log('视频总时长:', totalDuration, "秒");
};

// ------------------------------------
// 5. 调用组件暴露的方法
// ------------------------------------

const handlePlay = () => {
  playerRef.value?.play();
};

const handlePause = () => {
  playerRef.value?.pause();
};

// 如果你想直接访问原生元素:
// onMounted(() => {
//   console.log('原生 video 元素:', playerRef.value?.videoElement.value);
// });
</script>

<style scoped>
.controls button {
  margin-right: 10px;
  display: flexbox;
}

.controls .timer {
  display: flex;
  color: #555;
  font-size: 1.3em;
}

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