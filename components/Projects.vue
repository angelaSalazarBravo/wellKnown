<template>
    <Header 
    title="Projects"
    ></Header>
  <div class="projects-grid">
    <div v-for="project in projects" :key="project.name" class="project-card">
      <h2 class="project-title">{{ project.name }}</h2>
      <p class="project-description">{{ project.description }}</p>
      <p class="project-dates">
        <strong>Inicio:</strong> {{ formatDate(project.start_date) }} <br />
        <strong>Fin:</strong> {{ formatDate(project.end_date) }}
      </p>
    </div>
  </div>
</template>

<script setup>
import Header from '~/components/Header.vue'
const projects = [
  {
    name: 'E-commerce Platform Development',
    description: 'Web platform for online product sales.',
    start_date: '2025-04-01',
    end_date: '2025-07-01',
    created_by: 1,
  },
  {
    name: 'Institutional Website Redesign',
    description: 'Redesign of the company website.',
    start_date: '2025-05-01',
    end_date: '2025-06-15',
    created_by: 1,
  },
    {
        name: 'Mobile App Development',
        description: 'Development of a mobile application for iOS and Android.',
        start_date: '2025-06-01',
        end_date: '2025-09-01',
        created_by: 1,
    },
    {
        name: 'API Development for Third Parties',
        description: 'Development of an API for third-party integrations.',
        start_date: '2025-07-01',
        end_date: '2025-08-15',
        created_by: 1,
    },
    {
        name: 'Data Analysis and Reporting Tool',
        description: 'Tool for data analysis and report generation.',
        start_date: '2025-08-01',
        end_date: '2025-10-01',
        created_by: 1,
    }
]

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}
</script>

<style scoped>
.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
}

.project-card:hover {
  transform: scale(1.02);
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
}

.project-dates {
  font-size: 0.85rem;
  color: #666;
}
</style>
