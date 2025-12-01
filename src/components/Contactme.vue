<template>
  <main>
    <section>
      <h1>联系我</h1>
      <p>欢迎通过以下方式联系我：</p>
      <ul>
        <li><img src="../assets/img/qq.ico" alt="QQ" style="width:16px;height:16px" />QQ：1139988936</li>
      </ul>
      <p>也可以填写下方表格对我进行留言：</p>
      <form @submit.prevent="submitForm">
        <input type="text" v-model="name" placeholder="你的名字（昵称也可以）" required style="width:100%; padding:10px; margin:10px 0; border:1px solid #ddd; border-radius:4px;" />
        <input type="email" v-model="email" placeholder="你的邮箱" required style="width:100%; padding:10px; margin:10px 0; border:1px solid #ddd; border-radius:4px;" />
        <textarea v-model="message" placeholder="你的留言" required style="width:100%; padding:10px; margin:10px 0; border:1px solid #ddd; border-radius:4px; height:100px;"></textarea>
        <button type="submit" class="btn">发送消息</button>
      </form><br/>
      <p v-if="submitted" style="color: green; margin-top: 10px;">感谢你的留言！我会尽快回复（通过邮箱）。</p>
      <div style="display:flex;">
        <div class="blank"></div>
        <router-link to="/" class="btn">返回主页</router-link>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Base64 } from '@/scripts/base64';
import swal from 'sweetalert';

const name = ref("")
const email = ref("")
const message = ref("")
const submitted = ref(false)

function submitForm() {
      // 加密信息
      var base64: Base64 = new Base64();
      var enName: string = base64.encodePostParam(name.value)
      var enEmail: string = base64.encodePostParam(email.value)
      var enMessage: string = base64.encodePostParam(message.value)
      //组装
      var data = {
        time: Date.now(),
        enName, enEmail, enMessage
      }

      const url =  `/message?` +
        `name=${encodeURIComponent(data.enName.toString())}&` +
        `email=${encodeURIComponent(data.enEmail.toString())}&` +
        `message=${encodeURIComponent(data.enMessage.toString())}`;

      fetch(url)
      .then(res => res.text())
      .then(text => console.log(text))
      .then(_ => {
        submitted.value = true;
        name.value = '';
        email.value = '';
        message.value = '';
        setTimeout(() => { submitted.value = false; }, 3000);
      })
      .catch(err => {
        swal({
        icon: 'error',
        title: '错误',
        text: 'err'
      })
        console.error(err);
      });
    }

</script>