<script setup lang="ts">
import { ref } from 'vue';
import { TimeSetOut } from '@/scripts/timeSetOut';

const formattedTime = ref("")
const countdown = ref<TimeSetOut | null>(null);

function createTSO(){
  //正则表达式测试格式
  const regex = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;
  if (!regex.test(formattedTime.value)) {
  swal({
      icon:'error',
      title:'提示',
      text:'请输入正确格式的时间：YYYY-MM-DD hh:mm:ss'
      });
  return;
  }
  //检测日期是否存在
  const date = new Date(formattedTime.value);
  const isValidDate = !isNaN(date.getTime());
  if (!isValidDate){
    swal({
        icon:'error',
        title:'提示',
        text:'输入的日期不存在'
        });
    return;
  }

  // 检查年月日时分秒是否匹配（防止如 "2024-13-01 00:00:00" 这类伪匹配）
  const matches = formattedTime.value.match(/\d+/g)!;
  const [year, month, day, hour, minute, second] = matches.map(Number);

  if (
      date.getFullYear() !== year ||
      date.getMonth() + 1 !== month ||
      date.getDate() !== day ||
      date.getHours() !== hour ||
      date.getMinutes() !== minute ||
      date.getSeconds() !== second
  ) {
    swal({
      icon:'error',
      title:'提示',
      text:'输入的日期不合法'
      });
    return;
  }

  countdown.value?.stop();
  
  // 创建新实例
  countdown.value = new TimeSetOut({
    title: '预定时间',
    time: formattedTime.value,
    swal, // 或全局 swal
  });

  // 绑定 Vue 生命周期（自动清理 timer）
  const obj = countdown.value;
  obj?.useLifecycle();
}
</script>

<template>
  <main>
    <section>
      <h2>稳定项目</h2>
      <div class="project">
        <h2>网页js类</h2>
        <p>简单计时器</p>
        <h2>预览</h2>
        <p>在下面输入框中输入时间，对应格式为YYYY-MM-DD hh:mm:ss</p>
        <p>例如2025年9月1日凌晨零点为：2025-09-01 00:00:00</p>
        <form @submit.prevent="createTSO">
          <input v-model="formattedTime" placeholder="输入对应格式时间" required style="width:40%; padding:10px; margin:10px 0; border:1px solid #ddd; border-radius:4px;"/>
          <button type="submit" class="btn">生成计时器</button>
        </form><br/>
        <div v-if="countdown && !countdown.isExpired" id="timesetout">
        <h2>{{ countdown.title }}</h2>
        <div>
          <span>{{ countdown.day }}</span>天
          <span>{{ countdown.hour }}</span>小时
          <span>{{ countdown.minute }}</span>分
          <span>{{ countdown.second }}</span>秒
        </div>
        </div><br/>
      </div>
      <h3>点击跳转下载页面:</h3><router-link to="/downloadtimesetout" class="btn">计时器（网页版）</router-link><br/><br/>
      <div class="project">
        <h2>USB提示音</h2>
        <p>坤哥版（可自定义audio.mp3），纯python，在usb设备插入和拔出时都有反馈</p>
      </div>
      <h3>点击跳转下载页面:</h3><router-link to="/downloadkunring" class="btn">USB提示音（坤哥版）</router-link>
    </section>

    <router-link to="/projects" class="btn" style="display:flex">返回项目</router-link>
  </main>
</template>