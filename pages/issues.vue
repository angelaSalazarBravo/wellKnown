<template>
  <Header title="Mis Issues" />
  <div v-if="isLoading" class="spinner">Cargando...</div>
  <div v-else-if="error" class="error">{{ error }}</div>
  <ul v-else>
    <li v-for="issue in issues" :key="issue.id">
      <a :href="issue.html_url" target="_blank">{{ issue.title }}</a>
      <p>{{ issue.repository.full_name }}</p>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAssignedIssues } from '~/composables/api/github'

const issues = ref<any[]>([])
const isLoading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const data = await getAssignedIssues()
    issues.value = data
  } catch (err: any) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.spinner {
  margin: 2rem;
}
.error {
  color: crimson;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin: 1rem 0;
}
</style>
