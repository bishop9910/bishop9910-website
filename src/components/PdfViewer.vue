<!-- src/components/PdfViewer.vue -->
<template>
  <div class="pdf-container">
    <div v-if="loading" class="pdf-loading">加载 PDF 中...</div>
    <canvas
      v-for="pageNum in totalPages"
      :key="pageNum"
      :ref="el => (pageRefs[pageNum] = el as HTMLCanvasElement)"
      class="pdf-page"
    />
    <div v-if="error" class="pdf-error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const props = defineProps<{
  src: string;
}>();

const loading = ref(true);
const error = ref('');
const totalPages = ref(0);
const pageRefs = ref<Record<number, HTMLCanvasElement | null>>({});

const renderPdf = async () => {
  loading.value = true;
  error.value = '';
  try {
    const pdf = await pdfjsLib.getDocument(props.src).promise;
    totalPages.value = pdf.numPages;

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const scale = 1.5;
      const viewport = page.getViewport({ scale });
      const canvas = pageRefs.value[i];
      if (!canvas) continue;

      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context!,
        viewport: viewport,
        canvas: canvas,
      }).promise;
    }
  } catch (err) {
    console.error('PDF 加载失败:', err);
    error.value = '无法加载 PDF 文件';
  } finally {
    loading.value = false;
  }
};

watch(() => props.src, renderPdf, { immediate: true });
</script>

<style scoped>
.pdf-container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 10px;
  box-sizing: border-box;
}

.pdf-loading,
.pdf-error {
  text-align: center;
  padding: 40px;
  color: #666;
}

.pdf-page {
  display: block;
  margin: 0 auto 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  height: auto !important; /* 防止高度被拉伸 */
}
</style>