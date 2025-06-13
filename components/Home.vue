<template>
  <Header title="Home" />
  
  <div class="welcome-message">
    Welcome! {{ userName }} ! 
  </div>

  <p class="little-p">Projects</p>

  <div v-if="isLoading" class="spinner-container">
    <div class="spinner"></div>
  </div>

  <div v-else class="slider-container">
    <button class="slider-btn left" @click="scrollLeft('projects')">&#10094;</button>

    <div class="slider" ref="projectsSlider">
      <div
        v-for="project in projects"
        :key="project.id"
        class="project-card"
      >
        <h2 class="project-title">{{ project.name }}</h2>
        <p class="project-description">{{ project.description }}</p>
        <p class="project-dates">
          <strong>Inicio:</strong> {{ formatDate(project.start_date) }} <br />
          <strong>Fin:</strong> {{ formatDate(project.end_date) }}
        </p>
      </div>
    </div>

    <button class="slider-btn right" @click="scrollRight('projects')">&#10095;</button>
  </div>

  <p class="little-p">Events</p>

  <div v-if="isLoading" class="spinner-container">
    <div class="spinner"></div>
  </div>

  <div v-else class="slider-container">
    <button class="slider-btn left" @click="scrollLeft('events')">&#10094;</button>
    
    <div class="slider" ref="eventsSlider">
      <div
        v-for="event in events"
        :key="event.id"
        class="project-card"
      >
        <h2 class="project-title">{{ event.title }}</h2>
        <p class="project-description">{{ event.description }}</p>
        <p class="project-dates">
          <strong>Inicio:</strong> {{ formatDate(event.start_date) }} <br />
          <strong>Fin:</strong> {{ formatDate(event.end_date) }}
        </p>
      </div>
    </div>
    
    <button class="slider-btn right" @click="scrollRight('events')">&#10095;</button>
  </div>
  <p class="little-p">Issues</p>

<div v-if="isLoading" class="spinner-container">
  <div class="spinner"></div>
</div>

<div v-else-if="issues.length === 0" class="empty-msg">
  No hay issues para mostrar.
</div>

<div v-else class="slider-container">
  <button class="slider-btn left" @click="scrollLeft('issues')">&#10094;</button>
  
  <div class="slider" ref="issuesSlider">
    <div
      v-for="issue in issues"
      :key="issue.id"
      class="project-card"
    >
      <h2 class="project-title">{{ issue.title }}</h2>
      <p class="project-description">{{ issue.repository.full_name }}</p>
      <a :href="issue.html_url" target="_blank" class="project-dates">Go GitHub</a>
    </div>
  </div>

  <button class="slider-btn right" @click="scrollRight('issues')">&#10095;</button>
</div>

  <p v-if="error" class="error">{{ error }}</p>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProjectsApi } from '~/composables/api/projects'
import { useCalendarEventsApi } from '~/composables/api/calendar-events'
import { getIssues } from '~/composables/api/github'
import { getLoggedUser } from '~/utils/auth'
const { getProjects } = useProjectsApi()
const { getCalendarEvents } = useCalendarEventsApi()

const projects = ref<any[]>([])
const events = ref<any[]>([])
const userName = ref('')
const projectsSlider = ref<HTMLElement | null>(null)
const eventsSlider = ref<HTMLElement | null>(null)
const issuesSlider = ref<HTMLElement | null>(null)

const isLoading = ref(true)
const error = ref('')

const issues = ref<any[]>([])
const isAdmin = ref(false)


const loadIssues = async () => {
  try {
    const user = getLoggedUser()
    isAdmin.value = user?.role === 'admin'
    const data = await getIssues(isAdmin.value)
    issues.value = data
  } catch (err: any) {
    console.error('Error cargando issues', err)
    error.value = 'Error cargando issues'
  }
}
const scrollAmount = 300 

const scrollLeft = (type: 'projects' | 'events' | 'issues') => {
  const sliders = {
    projects: projectsSlider,
    events: eventsSlider,
    issues: issuesSlider,
  }
  const el = sliders[type].value
  if (el) el.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
}

const scrollRight = (type: 'projects' | 'events' | 'issues') => {
  const sliders = {
    projects: projectsSlider,
    events: eventsSlider,
    issues: issuesSlider,
  }
  const el = sliders[type].value
  if (el) el.scrollBy({ left: scrollAmount, behavior: 'smooth' })
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })

onMounted(async () => {
  isLoading.value = true
  error.value = ''
  
  const userJson = localStorage.getItem('user')
  if (userJson) {
    try {
      const user = JSON.parse(userJson)
      userName.value = user.name || ''
    } catch (e) {
      console.error('Error parsing user from localStorage', e)
    }
  }

  try {
    const response = await getProjects()
    projects.value = Array.isArray(response) ? response : response.data
  } catch (e) {
    console.error('Error loading projects', e)
    error.value = 'Error loading projects'
  }

  try {
    const eventsResponse = await getCalendarEvents()
    events.value = Array.isArray(eventsResponse) ? eventsResponse : eventsResponse.data
  } catch (e) {
    console.error('Error loading events', e)
    error.value = 'Error loading events'
  }
  await loadIssues()

  isLoading.value = false
})
</script>

<style scoped>
@font-face {
  font-family: 'title';
  src: url('/fonts/Title.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
.little-p{
  font-family: 'title';
  font-size: 1.5rem;
  margin-left: 6rem;
  color: #333;
}
.welcome-message {
  font-family: 'title';
  font-size: 2rem;
  margin: 2rem;
  color: #333;
}

.today {
  font-family: 'title';
  font-size: 1.2rem;
  margin-left: 2rem;
  color: #494aa8;
}

/* Spinner styles */
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.spinner {
  border: 4px solid #cce6ff;
  border-top: 4px solid #4682B4;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Slider container & buttons */
.slider-container {
  position: relative;
  margin: 2rem;
  display: flex;
  align-items: center;
}

.slider {
  overflow-x: auto;
  scroll-behavior: smooth;
  display: flex;
  gap: 1.5rem;
  padding: 1rem 0;
  scrollbar-width: none; 
  -ms-overflow-style: none;  
  flex-grow: 1;
}

.slider::-webkit-scrollbar {
  display: none; 
}

.project-card {
  min-width: 280px;
  max-width: 280px;
  background: linear-gradient(to bottom, #87CEEB, #4682B4);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  color: #fff;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease;
  cursor: default;
}

.project-card:hover {
  transform: scale(1.05);
}

.project-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #fff;
}

.project-description {
  font-size: 1.1rem;
  color: #fff;
  line-height: 1.5;
  flex-grow: 1;
  margin-bottom: 0.75rem;
}

.project-dates {
  font-size: 0.9rem;
  color: #e0e0e0;
}

.slider-btn {
  background: transparent;
  border: none;
  color: rgb(45, 41, 88);
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 16px;
  cursor: pointer;
  user-select: none;
  z-index: 10;
}


.slider-btn:hover {
  transform: scale(1.1);
}

.slider-btn.left {
  margin-right: 0.5rem;
}

.slider-btn.right {
  margin-left: 0.5rem;
}

.error {
  color: crimson;
  margin: 1rem 6rem;
  font-weight: bold;
}
</style>
