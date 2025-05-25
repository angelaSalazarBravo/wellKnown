export const useProjectsApi = () => {
  const getProjects = async () => {
    const token = localStorage.getItem('authToken') // Leer desde localStorage

    if (!token) {
      throw new Error('No token found in localStorage')
    }
    const response = await $fetch('http://localhost:8000/api/projects', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
    return response
  }

  const getProjectById = async (id: number) => {
    const token = localStorage.getItem('authToken')
    if (!token) throw new Error('No token found')
    return $fetch(`http://localhost:8000/api/projects/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  }

    const createProject = async (projectData: Record<string, any>) => {
    const token = localStorage.getItem('authToken')
    if (!token) throw new Error('No token found')

    return await $fetch('http://localhost:8000/api/projects', {
      method: 'POST',
      body: projectData,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
  }

  return {
    getProjects,
    getProjectById,
    createProject
  }
}
