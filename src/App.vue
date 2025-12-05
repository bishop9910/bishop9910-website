<template>
  <nav class="navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-logo">bishop9910's Website</router-link>
        <ul class="nav-menu">
          <li><router-link to="/" class="nav-link">主页</router-link></li>
          <li><router-link to="/about" class="nav-link">关于我</router-link></li>
          <li><router-link to="/contactme" class="nav-link">联系我</router-link></li>
          <li><router-link to="/projects" class="nav-link">项目</router-link></li>
          <li><router-link to="/functions" class="nav-link">功能</router-link></li>
        </ul>
      </div>
    </nav>
  <router-view></router-view>

  <Footer
    icpText="苏ICP备2025223717号"
    :policeText="`苏公网安备${policeNumber}号`"
    :policeLinkNumber="policeNumber"
    :startYear="2024"
    copyrightOwner="bishop9910 个人博客"
    :policeIconPath="PoliceIconSrcPath"
  />
</template>

<script setup lang="ts">
import Footer from './components/Footer.vue';
import PoliceIconSrcPath from '@/assets/img/logo01.dd7ff50e.png';
const policeNumber = "32030302308098"
</script>

<style scoped>
/* 导航栏 */
.navbar {
  background-color: #eea7d5;
  color: #fff;
  padding: 1rem 0;
  position: relative;
  z-index: 10;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.nav-logo {
  font-size: 1.5rem;
  font-family: Majesti-Banner-MediumItalic;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
}

.nav-menu {
  list-style: none;
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #fff;
  text-decoration: none;
  font-size: 1.1rem;
  transition: color 0.3s;
}

.nav-link:hover,
.nav-link.router-link-exact-active {
  color: #fb618d;
}

@media (max-width: 798px) {
  .nav-container {
    flex-direction: column;
    gap: 1rem;
    padding: 10px 0;
  }

  .nav-menu {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}

</style>
