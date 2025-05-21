<template>
  <div class="layout">
    <div class="container">
      <div class="sidebar">
        <div class="sidebar-inner">
          <div class="sidebar-content">
            <div class="sidebar-header">
              <span class="sidebar-title">Well Known</span>
            </div>
            <nav class="sidebar-menu">
              <ul>
                <li
                  class="sidebar-item"
                  :class="{ active: selected === 'home' }"
                  @click="selected = 'home'"
                >
                 <img src="/icons/home.png" alt="Home Icon" class="icon" />
                  <span>home</span>
                </li>
                <li
                  class="sidebar-item"
                  :class="{ active: selected === 'projects' }"
                  @click="selected = 'projects'"
                >
                  <img src="/icons/projects.png" alt="Projects Icon" class="icon" />
                  <span>projects</span>
                </li>
                <li
                  class="sidebar-item"
                  :class="{ active: selected === 'events' }"
                  @click="selected = 'events'"
                >
                 <img src="/icons/events.png" alt="Events Icon" class="icon" />
                  <span>events</span>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <!-- Main content -->
      <div class="main">
        <main class="main-content">
          <div class="main-inner">
            <component :is="currentComponent" />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Home from '~/components/Home.vue'
import Projects from '~/components/Projects.vue'
import Events from '~/components/Events.vue'

const selected = ref('home') 

const currentComponent = computed(() => {
  if (selected.value === 'home') return Home
  if (selected.value === 'projects') return Projects
  if (selected.value === 'events') return Events
  return null
})
</script>

<style scoped>
@font-face {
  font-family: 'title';
  src: url('/fonts/Title.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
.sidebar-title{
  font-family: title;
  font-size: 2rem;
  font-weight: bold;
  color: #130d61;
}
.layout {
  font-family: sans-serif;
}

.container {
  display: flex;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.sidebar {
  width: 256px;
  display: flex;
  flex-shrink: 0;
}

.sidebar-inner {
  display: flex;
  width: 100%;
  flex-direction: column;
  border-right: 1px solid #ccc;
  background-color: #eef0f7;
}

.sidebar-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding-top: 2.5rem;
  padding-bottom: 1rem;
}

.sidebar-header {
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  margin-bottom: 2rem;
}

.sidebar-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: #111;
  cursor: pointer;
  transition: background-color 0.3s;
}

.sidebar-item:hover {
  background-color: #d1e8e2;
}

¡

.sidebar-item.active {
  background-color: #399991;
}


.icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f1f2f3;
  min-width: 0;
  overflow: hidden;
}
.main-content::-webkit-scrollbar {
  display: none;
}
.main-content {
  position: relative;
  z-index: 0;
  flex: 1;
  overflow-y: auto;
  outline: none;
}

.main-inner {
  height: 100%;
  padding-top: 2.5rem;
  padding-left: 2.5rem;
}
</style>
