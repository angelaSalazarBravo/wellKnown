<template>
  <Header title="Projects" />
  <img src="/images/wk1.png" alt="Projects" class="project-img" />
  <div v-if="isAdmin" class="admin-actions">
    <button class="btn-add" @click="showModal = true">Crear Proyecto</button>
  </div>
<div v-if="showModal" class="modal-overlay">
  <div class="modal-content">
    <h2>Crear Proyecto</h2>
    <form @submit.prevent="createProjectHandler">
      <label>Nombre:</label>
      <input v-model="newProject.name" required />

      <label>Descripción:</label>
      <textarea v-model="newProject.description" required></textarea>

      <label>Inicio:</label>
      <input type="date" v-model="newProject.start_date" required />

      <label>Fin:</label>
      <input type="date" v-model="newProject.end_date" required />

      <div class="modal-buttons">
        <button type="submit">Crear</button>
        <button type="button" @click="showModal = false">Cancelar</button>
      </div>
    </form>
  </div>
</div>

<div v-if="isLoading" class="spinner-container">
  <div class="spinner"></div>
</div>

  <p v-else-if="error" class="error">{{ error }}</p>

  <div v-else class="projects-grid">
     
    <router-link
      v-for="project in projects"
      :key="project.id"
      :to="`/project/${project.id}`"
      class="project-card"
    >
      <h2 class="project-title">{{ project.name }}</h2>
      <p class="project-description">{{ project.description }}</p>
      <p class="project-dates">
        <strong>Inicio:</strong> {{ formatDate(project.start_date) }} <br />
        <strong>Fin:</strong> {{ formatDate(project.end_date) }}
      </p>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '~/components/Header.vue'
import { useProjectsApi } from '~/composables/api/projects'
import { getLoggedUser } from '~/utils/auth'
const { getProjects, createProject } = useProjectsApi()

const user = getLoggedUser()
const isAdmin = user?.role === 'admin'
const projects = ref([] as any[])
const isLoading = ref(false)
const error = ref('')

const showModal = ref(false)
const newProject = ref({
  name: '',
  description: '',
  start_date: '',
  end_date: ''
})

const createProjectHandler = async () => {
  try {
    const payload = {
      ...newProject.value,
      created_by: user.id
    }
    await createProject(payload)
    showModal.value = false
    const response = await getProjects()
    projects.value = Array.isArray(response) ? response : response.data
  } catch (err) {
    console.error('Error al crear proyecto:', err)
  }
}
const router = useRouter()

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })


onMounted(async () => {
  isLoading.value = true
  try {
    const response = await getProjects()
    projects.value = Array.isArray(response) ? response : response.data
  } catch (err: any) {
    console.error(err)
    if (err?.status === 401) {
      // token inválido → volver al login
      router.push('/login')
    } else {
      error.value = 'No se pudieron cargar los proyectos'
    }
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.projects-grid {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  max-width: 100%;
  padding: 0 2.5rem 2.5rem 2.5rem;

}

.project-card {
  background: linear-gradient(to bottom, #87CEEB, #4682B4);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  text-decoration: none;
  color: #fff;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease;
  
}

.project-card:hover {
  transform: scale(1.02);
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

.error {
  color: crimson;
  padding: 1rem 2rem;
}
.project-img{
  width:90%;
  height: 20%;
  border-radius: 8px;
  margin-left: 5%;
  margin-top:5%;
}
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px; /* o el alto que desees mientras carga */
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
.btn-add {
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

.btn-add:hover {
  background-color: #356a95;
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

</style> 