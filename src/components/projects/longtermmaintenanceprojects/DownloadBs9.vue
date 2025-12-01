<template>
  <main>
    <section>
      <div class="download">
        <h1>bs9 code</h1>
        <p>点击下方按钮下载bs9 code</p>
        <!-- 下载按钮 -->
        <h3>最新版本-v1.2.175 2025/8/18</h3>
        <button class="btn" @click="version = '1.2.175';showModal = true">点击下载</button>
        <h3>中古版本-v9.2.1 2025/7/9</h3>
        <button class="btn" @click="version = '9.2.1';showModal = true">点击下载</button>
        <h3>怀旧版本-v5系列 2025/2/2</h3>
        <button class="btn" @click="version = '5';showModal = true">点击下载</button>
        <h3>怀旧版本-最初代 2025/1/31</h3>
        <button class="btn" @click="version = '0.0.0';showModal = true">点击下载</button><br/>
        <router-link to="/longtermmaintenanceprojects" class="btn">返回长期维护项目</router-link>
      </div>

      <!-- 弹窗组件（内联模板） -->
      <div v-if="showModal">
        <div class="modal-mask" @click.self="showModal = false">
          <div class="modal-wrapper">
            <div class="modal-header">
              下载bs9版本{{ version }}
            </div>
            <div class="modal-body">
              <p>请点击按钮下载</p>
              <br>
              <a class="btn" @click="downloadBs9" style="font-size:14px;">点击直接下载</a>
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
import { onMounted, ref } from 'vue';
import { downloadFromUrl } from '@/scripts/download';
import swal from 'sweetalert';

const showModal = ref(false);
const version = ref("1.2.175");

function downloadBs9(){
  downloadFromUrl(`./assets/files/bs9/${version.value}.zip`,`${version.value}.zip`);
}

onMounted(()=>{
  swal({
    icon:'info',
    title:'必读',
    text:"每个版本的bs9各不相通，请按需下载\n最新版本向来优化和加密更好"
  })
})
</script>