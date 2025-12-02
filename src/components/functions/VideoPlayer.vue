<template>
  <div class="video-player-container">
    <video
      ref="videoRef"
      :src="src"
      :autoplay="autoplay"
      :loop="loop"
      :muted="muted"
      :controls="controls"
      :poster="poster"
      @play="handlePlay"
      @pause="handlePause"
      @ended="handleEnded"
      @timeupdate="handleTimeUpdate"
      @loadedmetadata="handleLoadedMetadata"
      class="video-player"
    >
      Your browser does not support the video tag.
    </video>

    <!-- 进度条容器 -->
    <div 
      ref="progressContainerRef"
      class="progress-container" 
      @click="handleProgressClick"
    >
      <!-- 缓冲进度条 -->
      <div 
        class="progress-buffered" 
        :style="{ width: `${bufferedProgress}%` }"
      ></div>
      <!-- 已播放进度条 -->
      <div 
        class="progress-played" 
        :style="{ width: `${playedProgress}%` }"
      ></div>
      <!-- 滑块 -->
      <div 
        class="progress-slider" 
        :style="{ left: `${playedProgress}%` }"
        @mousedown="startDrag"
        @touchstart="startDrag"
      ></div>
    </div>
    <p>当前时间: {{ currentTime.toFixed(2) }}s / 总时长: {{ duration.toFixed(2) }}s</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

// ------------------------------------
// 1. Refs
// ------------------------------------
const videoRef = ref<HTMLVideoElement | null>(null);
const progressContainerRef = ref<HTMLDivElement | null>(null); // 新增进度条容器的ref

const currentTime = ref(0);
const duration = ref(0);

// ------------------------------------
// 2. Props 定义
// ------------------------------------

interface VideoPlayerProps {
  /** 视频源地址 */
  src: string;
  /** 是否自动播放 */
  autoplay?: boolean;
  /** 是否循环播放 */
  loop?: boolean;
  /** 是否静音 */
  muted?: boolean;
  /** 是否显示原生控制条 */
  controls?: boolean;
  /** 视频封面图 */
  poster?: string;
}

const props = withDefaults(defineProps<VideoPlayerProps>(), {
  autoplay: false,
  loop: false,
  muted: false,
  controls: false,
  poster: '',
});

// ------------------------------------
// 3. Emits 定义
// ------------------------------------

interface VideoPlayerEmits {
  /** 视频开始播放时触发 */
  (e: 'play'): void;
  /** 视频暂停时触发 */
  (e: 'pause'): void;
  /** 视频播放结束时触发 */
  (e: 'ended'): void;
  /** 播放时间更新时触发，抛出当前时间 */
  (e: 'time-update', currentTime: number): void;
  /** 视频元数据加载完成时触发，抛出总时长 */
  (e: 'loaded-metadata', duration: number): void;
}

const emit = defineEmits<VideoPlayerEmits>();

// ------------------------------------
// 4. 内部状态
// ------------------------------------

/** 当前播放进度百分比 */
const playedProgress = ref(0);

/** 缓冲进度百分比 */
const bufferedProgress = ref(0);

/** 拖拽状态 */
const isDragging = ref(false);

// ------------------------------------
// 5. 事件处理函数
// ------------------------------------

const handlePlay = () => {
  emit('play');
};

const handlePause = () => {
  emit('pause');
};

const handleEnded = () => {
  playedProgress.value = 100;
  emit('ended');
};

const handleTimeUpdate = (event: Event) => {
  const video = event.target as HTMLVideoElement;
  if (!isDragging.value) { // 避免拖拽时被更新覆盖
    const currentTime = video.currentTime;
    const duration = video.duration || 1; // 防止duration为0
    playedProgress.value = (currentTime / duration) * 100;
  }
  currentTime.value = video.currentTime;
  emit('time-update', video.currentTime);
};

const handleLoadedMetadata = (event: Event) => {
  const video = event.target as HTMLVideoElement;
  updateBufferedProgress(video);
  duration.value = video.duration;
  emit('loaded-metadata', video.duration);
};

const updateBufferedProgress = (video: HTMLVideoElement) => {
  if (video.buffered.length > 0) {
    const end = video.buffered.end(video.buffered.length - 1);
    const duration = video.duration || 1;
    bufferedProgress.value = (end / duration) * 100;
  }
};

// ------------------------------------
// 6. 进度条交互处理
// ------------------------------------

const handleProgressClick = (event: MouseEvent) => {
  if (!videoRef.value || !progressContainerRef.value) return;
  const rect = progressContainerRef.value.getBoundingClientRect();
  const pos = (event.clientX - rect.left) / rect.width;
  const newTime = pos * videoRef.value.duration;
  videoRef.value.currentTime = newTime;
  playedProgress.value = pos * 100;
};

const startDrag = (event: MouseEvent | TouchEvent) => {
  event.preventDefault(); // 防止拖拽时选中其他元素
  isDragging.value = true;
  document.addEventListener('mousemove', handleDrag);
  document.addEventListener('touchmove', handleDrag);
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchend', stopDrag);
};

const handleDrag = (event: MouseEvent | TouchEvent) => {
  if (!isDragging.value || !videoRef.value || !progressContainerRef.value) return;

  const rect = progressContainerRef.value.getBoundingClientRect();
  let clientX;
  if (event instanceof TouchEvent) {
    clientX = event.touches[0]!.clientX;
  } else {
    clientX = event.clientX;
  }

  let pos = (clientX - rect.left) / rect.width;
  pos = Math.max(0, Math.min(1, pos)); // 限制在0-1之间

  const newTime = pos * videoRef.value.duration;
  videoRef.value.currentTime = newTime;
  playedProgress.value = pos * 100;
};

const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', handleDrag);
  document.removeEventListener('touchmove', handleDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('touchend', stopDrag);
};

// ------------------------------------
// 7. 暴露公共方法
// ------------------------------------

const play = () => {
  videoRef.value?.play();
};

const pause = () => {
  videoRef.value?.pause();
};

const seek = (time?: number): number | undefined => {
  if (!videoRef.value) return;
  if (time !== undefined) {
    videoRef.value.currentTime = time;
    const duration = videoRef.value.duration || 1;
    playedProgress.value = (time / duration) * 100;
  }
  return videoRef.value.currentTime;
};

defineExpose({
  play,
  pause,
  seek,
  videoElement: videoRef,
});

// ------------------------------------
// 8. 响应式处理
// ------------------------------------

watch(() => props.src, (newSrc) => {
  if (videoRef.value && newSrc) {
    videoRef.value.pause();
    playedProgress.value = 0;
    bufferedProgress.value = 0;
  }
});

onMounted(() => {
  if (videoRef.value) {
    videoRef.value.addEventListener('progress', () => {
      if (videoRef.value) {
        updateBufferedProgress(videoRef.value);
      }
    });
  }
});
</script>

<style scoped>
.video-player-container {
  width: 100%;
  height: 100%;
  max-height: 1200px;
  max-width: 800px;
  margin: 0 auto;
}

.video-player {
  background-color: #000;
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9; /* 保持16:9比例，兼容现代浏览器 */
  display: block;
}

/* 进度条容器 */
.progress-container {
  position: relative;
  width: 100%;
  height: 6px;
  background-color: #ffffff;
  cursor: pointer;
  margin-top: 8px;
  border-radius: 3px;
  box-sizing: border-box;
  margin: 10px 0;
}

/* 已播放进度条 */
.progress-played {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0%;
  background-color: #007bff;
  border-radius: 3px;
  transition: width 0.1s ease;
  z-index: 2;
}

/* 缓冲进度条 */
.progress-buffered {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0%;
  background-color: #ccc;
  border-radius: 3px;
  z-index: 1;
}

/* 滑块 */
.progress-slider {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #007bff;
  z-index: 2;
  transition: opacity 0.2s;
  opacity: 0;
}

.progress-container:hover .progress-slider,
.progress-slider:active {
  opacity: 1;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .video-player {
    /* 避免固定宽高溢出 */
    max-width: 100vw;
    height: auto;
    /* 兜底：部分旧浏览器不支持 aspect-ratio */
    padding-top: 56.25%; /* 16:9 的 padding-top 技巧 */
    position: relative;
    background-color: #000;
  }

  /* 若使用 padding-top 技巧，则需要嵌套 video 元素 */
  /* 但我们目前 video 是直接子元素，所以更推荐用 aspect-ratio + fallback */
  /* 已在 video-player 中用 aspect-ratio 实现，此处再加一层保险 */

  .video-player::before {
    content: '';
    display: block;
    padding-top: 56.25%; /* 16:9 */
  }

  .video-player video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .progress-container {
    height: 8px; /* 稍微加高便于触控 */
  }

  .progress-slider {
    width: 20px;
    height: 20px;
  }

  /* 提升移动端触控体验 */
  .progress-container {
    touch-action: manipulation; /* 禁用双击缩放，提升拖拽流畅性 */
  }

  .progress-slider::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 40px;
    height: 40px;
    transform: translate(-50%, -50%);
    /* 不可见但可点击 */
  }

  /* 时间文字微调 */
  .video-player-container > p {
    font-size: 0.85rem;
    margin: 4px 0;
  }
}

/* 超小屏（如 iPhone SE）进一步优化 */
@media (max-width: 375px) {
  .progress-slider {
    width: 22px;
    height: 22px;
  }

  .progress-container {
    height: 10px;
  }
}
</style>