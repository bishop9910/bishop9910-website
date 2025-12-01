<template>
  <main>
    <section>
      <div class="download">
        <h1>坤哥USB提示音</h1>
        <p>点击下方按钮下载 提示音</p>
        <!-- 下载按钮 -->
        <h3>版本-v1.0.0 2025/9/21</h3>
        <button class="btn" @click="version = '1.0.0';showModal = true">点击下载</button><br/>
        <router-link to="/stableprojects" class="btn">返回稳定项目</router-link>
      </div>

      <!-- 弹窗组件（内联模板） -->
      <div v-if="showModal">
        <div class="modal-mask" @click.self="showModal = false">
          <div class="modal-wrapper">
            <div class="modal-header">
              下载提示音（坤哥版）
            </div>
            <div class="modal-body">
              <p>请点击按钮下载</p>
              <br>
              <a class="btn" @click="downloadKun" style="font-size:14px;">点击直接下载</a>
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
import { ref, onMounted} from 'vue';
import { downloadFromUrl } from '@/scripts/download';
import swal from 'sweetalert';

const showModal = ref(false);
const version = ref("1.0.0");

function downloadKun(){
  downloadFromUrl(`/assets/files/kunRing/kunRing${version.value}.zip`,`kunRing${version.value}.zip`);
}

onMounted(()=>{
  swal({
      icon: 'info',
      title: '必读',
      text: `确保audio.mp3和kunRing.exe存在且在同一目录\n启动kunRing.exe以启动该程序\nkill.exe可以清理这个文件的开机自启动和杀死该进程\n所有权限仅与开机自启动修改注册表有关，非病毒程序`
  })
})
</script>