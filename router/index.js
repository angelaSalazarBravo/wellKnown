import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import Projects from '@/components/Projects.vue'
import Events from '@/components/Events.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/projects', name: 'Projects', component: Projects },
  { path: '/events', name: 'Events', component: Events }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
