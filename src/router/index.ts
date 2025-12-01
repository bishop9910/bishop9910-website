import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';
import Home from '@/components/Home.vue';
import About from '@/components/About.vue';
import Contactme from '@/components/Contactme.vue';
import Projects from '@/components/Projects.vue';
import Fuctions from '@/components/Fuctions.vue';
import Stableprojects from '@/components/projects/Stableprojects.vue';
import DownloadTimeSetOut from '@/components/projects/stableprojects/DownloadTimeSetOut.vue';
import DownloadKunRing from '@/components/projects/stableprojects/DownloadKunRing.vue';


const routes: RouteRecordRaw[] = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/contactme', component: Contactme},
  { path: '/projects', component: Projects},
  { path: '/functions', component: Fuctions},
  { path: '/stableprojects', component: Stableprojects},
  { path: '/downloadtimesetout', component: DownloadTimeSetOut},
  { path: '/downloadkunring', component: DownloadKunRing}
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router;