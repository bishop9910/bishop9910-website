<template>
  <main>
    <section>
      <div class="notes-container">
        <!-- 左侧导航栏 -->
        <div class="sidebar">
          <h2>笔记目录</h2>
          <ul>
            <li v-for="item in navItems" :key="item.path">
              <router-link
                :to="`/notes${item.path}`"
                :class="{ active: item.path === currentNotePath }"
              >
                {{ item.title }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- 右侧内容区 -->
        <div class="content">
          <div v-if="loading" class="loading">加载中...</div>
          <div v-else-if="error" class="error">{{ error }}</div>
          <div v-else class="markdown-body" v-html="renderedContent"></div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import 'github-markdown-css/github-markdown-light.css'

// ========== 自动扫描 assets/notes 下的所有 .md 文件 ==========
const markdownModules = import.meta.glob(
  '/src/assets/notes/**/*.md',
  { eager: true, import: 'default', query: '?raw' }
) as Record<string, string>

interface NavItem {
  path: string // 如 '/intro' 或 '/vue/reactivity'
  title: string
}

marked.setOptions({
  async: false,  // 关闭异步模式
  gfm: true,     // 启用 GitHub Flavored Markdown
  breaks: true,  // 启用换行转 <br>
})

// 构建导航项和内容映射
const navItems: NavItem[] = []
const contentMap: Record<string, string> = {}

for (const filePath in markdownModules) {
  // 转换路径：/src/assets/notes/foo/bar.md → /foo/bar
  const normalizedPath = filePath
    .replace(/^\/src\/assets\/notes/, '')
    .replace(/\.md$/, '')
    .replace(/\/index$/, '') // 可选：支持 index.md 作为目录首页

  const title = normalizedPath.split('/').pop() || "Home"
  navItems.push({ path: normalizedPath, title })

  // 渲染 Markdown 为 HTML
  let html = marked.parse(markdownModules[filePath]!) as string
  contentMap[normalizedPath] = html
}

// ========== 响应式状态 ==========
const route = useRoute()
const loading = ref(false)
const error = ref('')
const renderedContent = ref('')

// 当前笔记路径（如 '/vue/basics'）
const currentNotePath = computed(() => {
  let path = route.path.replace(/^\/notes/, '')
  // 移除末尾的 /（可选，避免 /notes/ 和 /notes 不一致）
  if (path === '' || path === '/') {
    return '' // 统一用空字符串代表根
  }
  return path
})

// ========== 加载内容 ==========
watch(
  currentNotePath,
  (path) => {
    loading.value = false
    const content = contentMap[path]
    if (content !== undefined) {
      renderedContent.value = content
      error.value = ''
    } else {
      error.value = '未找到对应的笔记文件'
      renderedContent.value = ''
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.notes-container {
  display: flex;
  height: calc(100vh - 60px);
  gap: 20px;
  padding: 20px;
}

.sidebar {
  width: 20%;
  background: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  overflow-y: auto;
}

.sidebar h2 {
  margin-top: 0;
  font-size: 1.2rem;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar li {
  margin-bottom: 8px;
}

.sidebar a {
  text-decoration: none;
  color: #333;
  padding: 6px 10px;
  border-radius: 4px;
  display: block;
}

.sidebar a.active,
.sidebar a:hover {
  background-color: #e0e0e0;
}

.content {
  flex: 1;
  background: white;
  padding: 24px;
  border-radius: 8px;
  overflow-y: auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.loading, .error {
  text-align: center;
  padding: 40px;
  color: #666;
}
</style>