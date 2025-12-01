<template>
  <main>
    <section>
      <div class="download">
        <h1>计时器（网页版）</h1>
        <p>点击下方按钮下载 计时器</p>
        <!-- 下载按钮 -->
        <h3>版本-v1.0.0 2025/8/19</h3>
        <button class="btn" @click="version = '1.0.0';showModal = true">点击下载</button><br/>
        <router-link to="/stableprojects" class="btn">返回稳定项目</router-link>
      </div>

      <!-- 弹窗组件（内联模板） -->
      <div v-if="showModal">
        <div class="modal-mask" @click.self="showModal = false">
          <div class="modal-wrapper">
            <div class="modal-header">
              下载计时器（网页版）
            </div>
            <div class="modal-body">
              <p>请点击按钮下载</p>
              <br>
              <a class="btn" @click="downloadTSO" style="font-size:14px;">点击直接下载</a>
            </div>
            <div class="modal-footer">
              <button class="btn-close" @click="showModal = false">关闭</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { downloadFromUrl } from '@/scripts/download';

const showModal = ref(false);
const version = ref("1.0.0");

function downloadTSO(){
  downloadFromUrl(`/assets/files/timeSetOut/tso${version.value}.zip`,`tso${version.value}.zip`);
}
</script>