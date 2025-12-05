<!-- Footer备案.vue -->
<template>
  <footer class="footer-copyright" :class="{ 'dark': isDarkMode }">
    <div class="container">
      <!-- 备案信息区 -->
      <div class="record-section">
        <template v-if="showIcp">
          <a
            :href="icpLink"
            target="_blank"
            rel="noopener noreferrer"
            class="record-link"
          >
            {{ icpText }}
          </a>
        </template>

        <template v-if="showPolice">
          <span class="divider" v-if="showIcp">｜</span>
          <img
            :src="policeIconPath"
            style="height: 25px;width: 25px;"
            alt="公安部"
          />
          <a
            :href="policeLink"
            target="_blank"
            rel="noopener noreferrer"
            class="record-link"
          >
            {{ policeText }}
          </a>
        </template>
      </div>

      <!-- 版权信息区 -->
      <div class="copyright">
        <span>&copy; {{ copyYear }} {{ copyrightOwner }}. All rights reserved.</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

// Props：支持灵活配置
const props = defineProps({
  // ICP 备案号
  icpText: {
    type: String,
    default: ''
  },
  // ICP 备案跳转链接（工信部官网查询页）
  icpLink: {
    type: String,
    default: 'https://beian.miit.gov.cn'
  },
  // 公安备案号
  policeText: {
    type: String,
    default: ''
  },
  // 公安备案跳转链接（上海公安备案查询页，可替换为全国通）
  policeLinkNumber: {
    type: String,
    default: ''
  },
  // 是否显示公安备案（默认显示）
  showPolice: {
    type: Boolean,
    default: true
  },
  // 是否显示ICP（默认显示）
  showIcp: {
    type: Boolean,
    default: true
  },
  // 版权所有者名称
  copyrightOwner: {
    type: String,
    default: 'bishop9910'
  },
  // 版权起始年份（自动计算当前年）
  startYear: {
    type: Number,
    default: 2025
  },
  policeIconPath: {
    type: String,
    default: ''
  }
})

const policeLink = computed(()=>{
  return `https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=${props.policeLinkNumber}`;
})

// 计算版权年份显示：2025 或 2023-2025（若跨年）
const copyYear = computed(() => {
  const now = new Date().getFullYear()
  return props.startYear === now ? `${now}` : `${props.startYear}–${now}`
})

// 暗色模式检测
const isDarkMode = ref(false)

/**
onMounted(() => {
  const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
  isDarkMode.value = darkQuery.matches
  darkQuery.addEventListener('change', (e) => {
    isDarkMode.value = e.matches
  })
})
*/
</script>

<style scoped>
.footer-copyright {
  background-color: #f8f9faad;
  color: #6c757d;
  font-size: 0.875rem;
  line-height: 1.6;
  padding: 1rem 0;
  border-top: 1px solid #e9ecef;
  margin-top: auto;
}

.footer-copyright.dark {
  background-color: #1e293b;
  color: #94a3b8;
  border-top-color: #334155;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.record-section {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.record-link {
  color: #495057;
  text-decoration: none;
  transition: color 0.2s;
}

.record-link:hover {
  color: #0d6efd;
  text-decoration: underline;
}

.footer-copyright.dark .record-link {
  color: #cbd5e1;
}

.footer-copyright.dark .record-link:hover {
  color: #93c5fd;
}

.divider {
  color: #adb5bd;
  margin: 0 0.3rem;
}

.footer-copyright.dark .divider {
  color: #64748b;
}

.copyright {
  white-space: nowrap;
}

/* 小屏适配：堆叠显示 */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
    text-align: center;
  }
  .record-section {
    justify-content: center;
  }
}
</style>