<template>
  <div class="layout">
    <div class="container">
      <!-- Sidebar -->
      <div class="sidebar">
        <div class="sidebar-inner">
          <div class="sidebar-content">
            <div class="sidebar-header">
              <span class="sidebar-title">Well Known</span>
            </div>
            <nav class="sidebar-menu">
              <ul>
                <li class="sidebar-item">
                  <router-link to="/" class="link" active-class="active">home</router-link>
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
            <div v-if="isLoading">Cargando proyecto...</div>

            <div v-else-if="error" class="error">{{ error }}</div>

            <div v-else-if="project" class="project-detail">
              <Header :title="project.name" />
              <p>{{ project.description }}</p>
              <p>
                <strong>Inicio:</strong> {{ formatDate(project.start_date) }}
                <strong>Fin:</strong> {{ formatDate(project.end_date) }}
              </p>
            </div>

            <div v-else class="error">Proyecto no encontrado</div>
            <div v-if="events.length > 0" class="events-section">
            <h2>Eventos</h2>
              <ul>
                <li v-for="event in events" :key="event.id">
                  <strong>{{ event.title }}</strong><br />
                  <small>
                    Desde: {{ formatDate(event.start_date) }} <br />
                    Hasta: {{ formatDate(event.end_date) }}
                  </small>
                  <p>{{ event.description }}</p>
                </li>
              </ul>
            </div>

            
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectsApi } from '~/composables/api/projects'
import { useCalendarEventsApi } from '~/composables/api/calendar-events'

const route = useRoute()
const router = useRouter()

const { getProjectById } = useProjectsApi()
const { getCalendarEvents } = useCalendarEventsApi()

const project = ref<any>(null)
const isLoading = ref(false)
const error = ref('')
const events = ref([])

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })

onMounted(async () => {
  const id = Number(route.params.id)
  if (!id) {
    error.value = 'ID de proyecto inválido'
    return
  }

  isLoading.value = true
  try {
    const data = await getProjectById(id)
    project.value = data
    events.value = await getCalendarEvents(id)
  } catch (err: any) {
    console.error(err)
    if (err?.status === 401) {
      router.push('/login')
    } else {
      error.value = 'No se pudo cargar el proyecto'
    }
  } finally {
    isLoading.value = false
  }
})
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
.link {
  text-decoration: none;
  color: inherit;
  width: 100%;
  display: block;
}

.main-inner {
  height: 100%;
  padding-top: 2.5rem;
  padding-left: 2.5rem;
}

/* Project detail 
.project-detail {
  max-width: 600px;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.project-detail h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.project-detail p {
  font-size: 1.1rem;
  color: #333;
  line-height: 1.5;
}
*/
.error {
  text-align: center;
  color: crimson;
  margin-top: 2rem;
}
</style>
