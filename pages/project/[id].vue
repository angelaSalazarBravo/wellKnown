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
            <div v-if="isLoading" class="spinner-container">
              <div class="spinner"></div>
            </div>

            <div v-else-if="error" class="error">{{ error }}</div>

            <div v-else-if="project" class="project-detail">
              <Header :title="project.name" />
              <p>{{ project.description }}</p>
              <p>
                <strong>Inicio:</strong> {{ formatDate(project.start_date) }}
                <strong>Fin:</strong> {{ formatDate(project.end_date) }}
              </p>
              <button @click="editMode = true" class="edit-btn">Edit Project</button>
            </div>

            <div v-if="editMode" class="modal-overlay">
              <div class="modal-content">
                <h2>Edit Project</h2>
                <form @submit.prevent="submitEdit">
                  <label>Name:</label>
                  <input v-model="editForm.name" required />

                  <label>Description:</label>
                  <textarea v-model="editForm.description"></textarea>

                  <label>Start date:</label>
                  <input type="date" v-model="editForm.start_date" />

                  <label>End date:</label>
                  <input type="date" v-model="editForm.end_date" />

                  <div class="modal-buttons">
                    <button type="submit">save</button>
                    <button type="button" @click="editMode = false">Cancel</button>
                  </div>
                </form>
              </div>
            </div>

            

            <div class="dual-columns">
              <div v-if="events.length > 0" class="events-section">
                <Header title="Project Events" />
                <div v-for="event in events" :key="event.id" class="event-card">
                  <strong>{{ event.title }}</strong><br />
                  <small>
                    <strong>Start Date: </strong>{{ formatDate(event.start_date) }} <br />
                    <strong>End Date:</strong> {{ formatDate(event.end_date) }}
                  </small>
                  <p>{{ event.description }}</p>
                </div>
              </div>

              <div v-if="meetings.length > 0" class="meetings-section">
                <Header title="Project Meetings" />
                <div v-for="meeting in meetings" :key="meeting.id" class="meeting-card">
                  <strong>{{ meeting.title }}</strong><br />
                  <small>
                    <strong>Date: </strong>{{ formatDate(meeting.date) }} <br />
                  </small>
                  <p>{{ meeting.description }}</p>
                </div>
              </div>


            </div>
              <div v-if="issues.length > 0" class="issues-section">
                <Header title="Assigned Issues" />
                <ul>
                  <li v-for="issue in issues" :key="issue.id" class="issue-card">
                    <a :href="issue.html_url" target="_blank" rel="noopener noreferrer">{{ issue.title }}</a>
                    <p>#{{ issue.number }} - State: {{ issue.state }}</p>
                  </li>
                </ul>
              </div>
              <Messages v-if="project" :project-id="project.id" :user-id="userId" />

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
import { useMeetingsApi } from '~/composables/api/meetings'
import { getAssignedIssues } from '~/composables/api/github'  
import Messages from '~/components/Messages.vue'

const route = useRoute()
const router = useRouter()

const { getMeetings } = useMeetingsApi()
const { getProjectById ,updateProject} = useProjectsApi()
const { getCalendarEvents } = useCalendarEventsApi()
const user = JSON.parse(localStorage.getItem('user') || '{}')
const userId = user.id

const project = ref<any>(null)
const isLoading = ref(false)
const error = ref('')
const events = ref([])
const meetings = ref([])
const issues = ref<any[]>([])

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })

const editMode = ref(false)
const editForm = ref({
  name: '',
  description: '',
  start_date: '',
  end_date: ''
})

const submitEdit = async () => {
  try {
    await updateProject(project.value.id, editForm.value)
    const updated = await getProjectById(project.value.id)
    project.value = updated
    editMode.value = false
  } catch (err) {
    console.error('Error actualizando proyecto', err)
    error.value = 'Error actualizando el proyecto'
  }
}

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

    editForm.value = {
      name: data.name,
      description: data.description,
      start_date: data.start_date,
      end_date: data.end_date
    }

    events.value = await getCalendarEvents(id)
    meetings.value = await getMeetings(id)

    if (project.value.name) {
      const allIssues = await getAssignedIssues()
      issues.value = allIssues.filter(
        (issue: any) => issue.repository.full_name.endsWith(`/${project.value.name}`)
      )
    } else {
      issues.value = []
    }

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
@font-face {
  font-family: 'title';
  src: url('/fonts/Title.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
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

.sidebar-title {
  font-family: title;
  font-size: 2rem;
  font-weight: bold;
  color: #130d61;
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

.project-detail {
  border-radius: 8px;
}

.project-detail h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #20217c;
}

.project-detail p {
  font-size: 1.1rem;
  color: #20217c;
  line-height: 1.5;
}

.event-card:hover {
  transform: scale(1.02);
}

.events-section h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #fff;
}

.event-card {
  background: linear-gradient(to bottom, #87CEEB, #4682B4);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  padding: 1rem;
  margin-top: 1.5rem;
}

.event-card strong,
.meeting-card strong {
  font-size: 1.2rem;
  color: #fff;
  display: block;
  margin-bottom: 0.5rem;
}

.event-card small,
.meeting-card small {
  font-size: 0.9rem;
  color: #e0e0e0;
  display: block;
  margin-bottom: 0.5rem;
}

.event-card p,
.meeting-card p {
  font-size: 1.1rem;
  color: #fff;
  line-height: 1.5;
}

.error {
  text-align: center;
  color: crimson;
  margin-top: 2rem;
}

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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.dual-columns {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: flex-start;
}

.events-section,
.meetings-section {
  flex: 1;
  min-width: 300px;
  max-width: 45%;
}

.meeting-card {
  background: linear-gradient(to bottom, #d8b4fe, #a78bfa);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  padding: 1rem;
  margin-top: 1.5rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
}

.modal-content h2 {
  margin-bottom: 1rem;
}

.modal-content label {
  display: block;
  margin-top: 1rem;
  font-weight: bold;
}

.modal-content input,
.modal-content textarea {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.25rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
  gap: 1rem;
}

.modal-buttons button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

.modal-buttons button[type='submit'] {
  background-color: #4682B4;
  color: white;
}

.modal-buttons button[type='button'] {
  background-color: #ccc;
  color: #333;
}

.issue-card{
  background: linear-gradient(to bottom, #87CEEB, #4682B4);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  text-decoration: none;
  color: #fff;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease;
  width: 80%;
}
.edit-btn{
  background-color: #4682B4;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 5px;
  margin: 1rem 2.5rem;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}
.issues-section ul {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  padding: 0;
  list-style: none;
}
</style>
