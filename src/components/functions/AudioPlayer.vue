<template>
  <div class="audio-player">
    <button @click="togglePlay" class="control-button">
      {{ isPlaying ? '⏸️' : '▶️' }}
    </button>

    <span class="time-display">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>

    <div class="progress-bar-container" @click="seek">
      <div class="progress-bar" :style="{ width: progressPercent + '%' }"></div>
    </div>

    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      v-model="volume"
      @input="setVolume"
      class="volume-slider"
    />

    <audio ref="audioRef" :src="src" @loadedmetadata="handleLoadedMetadata" @timeupdate="handleTimeUpdate" @ended="handleEnded"></audio>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';

// ------------------------------------
// 1. Props 定义
// ------------------------------------
const props = defineProps({
  src: {
    type: String,
    required: true
  },
  autoPlay: {
    type: Boolean,
    default: false
  }
});

// ------------------------------------
// 2. 状态管理 (Ref)
// ------------------------------------
const audioRef = ref(null); // 对 <audio> 元素的引用
const isPlaying = ref(false); // 是否正在播放
const currentTime = ref(0); // 当前播放时间 (秒)
const duration = ref(0); // 总时长 (秒)
const volume = ref(0.5); // 音量 (0.0 到 1.0)
let updateTimer = null; // 用于定期更新进度的定时器

// ------------------------------------
// 3. Computed 属性
// ------------------------------------
// 计算进度条的百分比
const progressPercent = computed(() => {
  return duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0;
});

// ------------------------------------
// 4. 方法/函数
// ------------------------------------

/**
 * 格式化秒数为 mm:ss 格式
 * @param {number} seconds - 秒数
 */
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const pad = (num) => (num < 10 ? '0' + num : num);
  return `${pad(mins)}:${pad(secs)}`;
};

/**
 * 播放或暂停
 */
const togglePlay = () => {
  if (!audioRef.value) return;

  if (isPlaying.value) {
    audioRef.value.pause();
  } else {
    audioRef.value.play().catch(e => {
        console.error("播放失败，可能是浏览器自动播放限制:", e);
        // 可以向用户显示一个友好的提示
    });
  }
  isPlaying.value = !isPlaying.value;
};

/**
 * 设置音量
 */
const setVolume = () => {
  if (audioRef.value) {
    audioRef.value.volume = parseFloat(volume.value);
  }
};

/**
 * 处理进度条点击事件 (快进/快退)
 * @param {MouseEvent} event
 */
const seek = (event) => {
  if (!audioRef.value || duration.value === 0) return;

  // 获取点击位置相对于进度条容器的百分比
  const clickX = event.offsetX;
  const containerWidth = event.currentTarget.clientWidth;
  const clickPercent = clickX / containerWidth;

  // 计算新的播放时间
  const newTime = duration.value * clickPercent;

  audioRef.value.currentTime = newTime;
  currentTime.value = newTime;
};


// ------------------------------------
// 5. Audio 元素事件处理器
// ------------------------------------

/**
 * 元数据加载完毕时触发 (获取时长)
 */
const handleLoadedMetadata = () => {
  duration.value = audioRef.value.duration;
  // 确保初始音量设置正确
  setVolume();
  if (props.autoPlay) {
    togglePlay();
  }
};

/**
 * 播放时间更新时触发 (实时更新进度)
 * 注意: 为了性能，我们依赖 `timeupdate` 偶尔更新，并使用 `requestAnimationFrame` 进行平滑更新。
 */
const handleTimeUpdate = () => {
  currentTime.value = audioRef.value.currentTime;
};

/**
 * 播放结束时触发
 */
const handleEnded = () => {
  isPlaying.value = false;
  currentTime.value = 0; // 重置到开头
  if (audioRef.value) {
      audioRef.value.currentTime = 0; // 确保 audio 元素也重置
  }
};


// ------------------------------------
// 6. 生命周期钩子
// ------------------------------------
onMounted(() => {
    // 初始设置音量
    if (audioRef.value) {
        audioRef.value.volume = volume.value;
    }
});

onUnmounted(() => {
  // 清理工作
  if (audioRef.value) {
    audioRef.value.pause();
  }
});

// ------------------------------------
// 7. Watch 监听器
// ------------------------------------
// 当 src 变化时，重新加载音频并重置状态
watch(() => props.src, (newSrc) => {
    if (audioRef.value) {
        isPlaying.value = false;
        currentTime.value = 0;
        duration.value = 0;
        // 浏览器会自动加载新的 src
        audioRef.value.load();
    }
});
</script>

<style scoped>
.audio-player {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 20px auto;
}

.control-button {
  background: #fff;
  border: none;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 18px;
  transition: background 0.2s;
}

.control-button:hover {
  background: #e0e0e0;
}

.time-display {
  font-size: 14px;
  min-width: 90px; /* 确保时间显示区域宽度固定 */
  text-align: center;
}

.progress-bar-container {
  flex-grow: 1;
  height: 8px;
  background-color: #ccc;
  border-radius: 4px;
  cursor: pointer;
  overflow: hidden; /* 确保进度条在容器内 */
}

.progress-bar {
  height: 100%;
  background-color: #007bff;
  transition: width 0.1s linear; /* 让进度条更新更平滑 */
}

.volume-slider {
  width: 100px;
}

/* 隐藏原生的 audio 元素 */
audio {
  display: none;
}
</style>