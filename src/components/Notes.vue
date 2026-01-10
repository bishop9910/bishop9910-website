<template>
  <main>
    <section>
      <div class="notes-container">
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

        <div class="content">
          <div v-if="loading" class="loading">加载中...</div>
          <div v-else-if="error" class="error">{{ error }}</div>
          <div v-else-if="currentType === 'md'" class="markdown-body" v-html="renderedContent"></div>
          <div v-else-if="currentType === 'pdf'" class="pdf-viewer">
            <PdfViewer :src="currentPdfUrl" width="100%" height="100%"/>
          </div>
        </div>
      </div>
    </section>
    <router-link to="/" class="btn" style="display:flex">返回主页</router-link>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { marked } from 'marked';
import swal from 'sweetalert';
import 'github-markdown-css/github-markdown-light.css';
import PdfViewer from './PdfViewer.vue';

const markdownModules = import.meta.glob(
  '/src/assets/notes/**/*.md',
  { eager: true, import: 'default', query: '?raw' }
) as Record<string, string>;

const pdfModules = import.meta.glob(
  '/src/assets/notes/**/*.pdf',
  { eager: true, import: 'default', query: '?url' }
) as Record<string, string>;

interface NavItem {
  path: string;
  title: string;
  type: 'md' | 'pdf';
}

marked.setOptions({
  async: false,
  gfm: true,
  breaks: true, 
})

const navItems: NavItem[] = [];
const contentMap: Record<string, string> = {};
const pdfUrlMap: Record<string, string> = {};

for (const filePath in markdownModules) {
  const normalizedPath = filePath
    .replace(/^\/src\/assets\/notes/, '')
    .replace(/\.md$/, '')
    .replace(/\/index$/, '');

  const title = normalizedPath.split('/').pop() || "Home";
  navItems.push({ path: normalizedPath, title,  type: 'md'});

  let html = marked.parse(markdownModules[filePath]!) as string;
  contentMap[normalizedPath] = html;
}

for (const filePath in pdfModules) {
  const normalizedPath = filePath
    .replace(/^\/src\/assets\/notes/, '')
    .replace(/\.pdf$/, '');
  const title = normalizedPath.split('/').pop() || "PDF";
  navItems.push({ path: normalizedPath, title, type: 'pdf' });
  pdfUrlMap[normalizedPath] = pdfModules[filePath]!;
}

const route = useRoute();
const loading = ref(false);
const error = ref('');
const renderedContent = ref('');
const currentType = ref<'md' | 'pdf' | null>(null);
const currentPdfUrl = ref('');

const currentNotePath = computed(() => {
  let path = route.path.replace(/^\/notes/, '');
  if (path === '' || path === '/') {
    return '';
  }
  return path;
})

watch(
  currentNotePath,
  (path) => {
    loading.value = false;

    if (contentMap[path] !== undefined) {
      renderedContent.value = contentMap[path];
      currentType.value = 'md';
      error.value = '';
      currentPdfUrl.value = '';
    }
    else if (pdfUrlMap[path] !== undefined) {
      currentPdfUrl.value = pdfUrlMap[path];
      currentType.value = 'pdf';
      renderedContent.value = '';
      error.value = '';
    }
    else {
      error.value = '未找到对应的笔记或文档';
      renderedContent.value = '';
      currentPdfUrl.value = '';
      currentType.value = null;
    }
  },
  { immediate: true }
)

onMounted(()=>{
  swal({
    icon: 'info',
    title: '必读',
    text: '该页面只支持电脑端样式，暂不支持移动端。'
  })
})
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

.pdf-viewer{
  width: 100%;
  height: 100%;
}
</style>