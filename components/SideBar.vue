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
                <li class="sidebar-item">
                 
                  <span>home</span>
                </li>
                <li class="sidebar-item active">
                
                  <span>projects</span>
                </li>
                <li class="sidebar-item">
                 
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
            
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
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

.sidebar-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1a1a1a;
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



.icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #d1d5db;
  min-width: 0;
  overflow: hidden;
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
