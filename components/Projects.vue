<template>
  <Header title="Projects" />

  <p v-if="isLoading">Cargando proyectos…</p>

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

const projects = ref([] as any[])
const isLoading = ref(false)
const error = ref('')

const { getProjects } = useProjectsApi()
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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}
.project-card {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
  color: inherit;
  text-decoration: none;
  display: flex;
  flex-direction: column;
}
.project-card:hover {
  transform: scale(1.02);
  background-color: #f9f9f9;
}
.project-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}
.project-description {
  font-size: 0.95rem;
  margin-bottom: 0.75rem;
  color: #444;
  flex-grow: 1;
}
.project-dates {
  font-size: 0.85rem;
  color: #666;
}
.error {
  color: crimson;
  padding: 1rem 2rem;
}
</style>
