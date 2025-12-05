<template>
  <div class="audio-player">
    <div class="audio-player-content">
      <button @click="togglePlay" class="control-button">
        <img :src="isPlaying ? pause_sign : play_sign" alt="控制图标" style="height: 10px; width: 10px;">
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
    </div>

    <div class="audio-palyer-info">
      <img 
        :src="props.poster" 
        :alt="props.name"
        style="height: 120px;width: 120px;"
      />
      <div class="audio-info-text">
        <h1 style="display: inline-flexbox;">
          {{ props.name }}
        </h1>
        <h2 style="display: inline-flexbox;">
          作者：{{ props.author }}
        </h2>
      </div>
    </div>

    <audio 
      ref="audioRef" 
      :src="src" 
      @loadedmetadata="handleLoadedMetadata" 
      @timeupdate="handleTimeUpdate" 
      @ended="handleEnded"
    ></audio>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import play_sign from "@/assets/img/play_sign.svg";
import pause_sign from "@/assets/img/pause_sign.svg";
import default_poster from '@/assets/img/bishop9910.jpg';

// ------------------------------------
// 1. Props 定义
// ------------------------------------
// defineProps 内部已经有类型推导，但在 TS 环境下明确类型是更好的实践
const props = defineProps({
  src: {
    type: String,
    required: true
  },
  autoPlay: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    default: "music"
  },
  poster: {
    type: String,
    default: default_poster
  },
  author: {
    type: String,
    default: "unkown"
  }
});

// ------------------------------------
// 2. 状态管理 (Ref)
// ------------------------------------
// 关键修正 1: 明确 audioRef 的类型为 HTMLAudioElement 或 null
const audioRef = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false); 
const currentTime = ref(0); 
const duration = ref(0); 
// volume 绑定到 input[type="range"]，其 v-model 通常为 string 类型，但在 audio 元素上需要 number
const volume = ref('0.5'); // 初始设为 string，与 input 绑定更匹配

// ------------------------------------
// 3. Computed 属性
// ------------------------------------
const progressPercent = computed(() => {
  return duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0;
});

// ------------------------------------
// 4. 方法/函数
// ------------------------------------

/**
 * 格式化秒数为 mm:ss 格式
 * 关键修正 2: 明确参数和返回值的类型
 * @param seconds - 秒数
 */
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const pad = (num: number): string => (num < 10 ? '0' + num : String(num));
  return `${pad(mins)}:${pad(secs)}`;
};

/**
 * 播放或暂停
 */
const togglePlay = () => {
  // 关键修正 3: 使用类型保护确保 audioRef.value 是 HTMLAudioElement
  const audioEl = audioRef.value;
  if (!audioEl) return;

  if (isPlaying.value) {
    audioEl.pause();
  } else {
    // play() 返回的是 Promise，需要处理可能的错误 (浏览器自动播放限制)
    audioEl.play().catch(e => {
        console.error("播放失败，可能是浏览器自动播放限制:", e);
    });
  }
  isPlaying.value = !isPlaying.value;
};

/**
 * 设置音量，由 input 事件触发
 * 关键修正 4: 明确 event 的类型为 Event 或 InputEvent
 */
const setVolume = (event: Event) => {
  const audioEl = audioRef.value;
  if (audioEl) {
    // 从 v-model 获取 string 类型的音量值
    // 或者从 event.target 获取值 (通常是 string)，并转换为 number
    const newVolume = parseFloat(volume.value);
    
    // 检查是否是有效的数字
    if (!isNaN(newVolume)) {
        audioEl.volume = newVolume;
    }
  }
};

/**
 * 处理进度条点击事件 (快进/快退)
 * 关键修正 5: 明确 event 的类型为 MouseEvent
 * @param event - MouseEvent
 */
const seek = (event: MouseEvent) => {
  const audioEl = audioRef.value;
  if (!audioEl || duration.value === 0) return;

  // 关键修正 6: 使用类型断言确保 currentTarget 是 HTMLElement
  const container = event.currentTarget as HTMLElement;

  // 获取点击位置相对于进度条容器的百分比
  const clickX = event.offsetX;
  const containerWidth = container.clientWidth;
  const clickPercent = clickX / containerWidth;

  // 计算新的播放时间
  const newTime = duration.value * clickPercent;

  audioEl.currentTime = newTime;
  currentTime.value = newTime;
};


// ------------------------------------
// 5. Audio 元素事件处理器
// ------------------------------------

/**
 * 元数据加载完毕时触发 (获取时长)
 */
const handleLoadedMetadata = () => {
  const audioEl = audioRef.value;
  if (audioEl) {
      duration.value = audioEl.duration;
      // 确保初始音量设置正确
      // setVolume() 方法依赖于 volume.value，在这里不需要 event 参数
      audioEl.volume = parseFloat(volume.value);
      
      if (props.autoPlay) {
          // 注意：现代浏览器可能禁止 without user interaction 的自动播放
          togglePlay();
      }
  }
};

/**
 * 播放时间更新时触发 (实时更新进度)
 */
const handleTimeUpdate = () => {
  const audioEl = audioRef.value;
  if (audioEl) {
      currentTime.value = audioEl.currentTime;
  }
};

/**
 * 播放结束时触发
 */
const handleEnded = () => {
  isPlaying.value = false;
  currentTime.value = 0; // 重置到开头
  const audioEl = audioRef.value;
  if (audioEl) {
      audioEl.currentTime = 0; // 确保 audio 元素也重置
  }
};


// ------------------------------------
// 6. 生命周期钩子
// ------------------------------------
onMounted(() => {
  // 初始设置音量
  const audioEl = audioRef.value;
  if (audioEl) {
      audioEl.volume = parseFloat(volume.value);
  }
});

onUnmounted(() => {
  // 清理工作
  const audioEl = audioRef.value;
  if (audioEl) {
      audioEl.pause();
  }
});

// ------------------------------------
// 7. Watch 监听器
// ------------------------------------
// 当 src 变化时，重新加载音频并重置状态
watch(() => props.src, (newSrc) => {
  const audioEl = audioRef.value;
  if (audioEl) {
      isPlaying.value = false;
      currentTime.value = 0;
      duration.value = 0;
      // load() 会触发 handleLoadedMetadata
      audioEl.load();
  }
});
</script>

<style scoped>
/* 样式部分无需改动 */
.audio-player {
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  max-width: 600px;
}

.audio-player-content {
  display: flex;
  gap: 10px;
  padding: 10px;
  max-width: 600px;
  margin: 20px 0 0 0;
  align-items: center;
}

.audio-palyer-info {
  padding: 15px;
}

.audio-info-text {
  display: inline-block;
  max-width: 400px;
  margin: 0 4%;
  padding: 10px;
  text-align: center;
}

.audio-info-text h1{
  margin: 0;
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
  min-width: 90px;
  text-align: center;
}

.progress-bar-container {
  flex-grow: 1;
  height: 8px;
  background-color: #ccc;
  border-radius: 4px;
  cursor: pointer;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #007bff;
  transition: width 0.1s linear;
}

.volume-slider {
  width: 100px;
}

audio {
  display: none;
}
</style>