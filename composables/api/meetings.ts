export const useMeetingsApi = () => {
const getMeetings = async (projectId?: number) => {
  const token = localStorage.getItem('authToken')
  if (!token) throw new Error('No token found in localStorage')

  const url = projectId
    ? `http://localhost:8000/api/meetings?project_id=${projectId}`
    : 'http://localhost:8000/api/meetings'

  return await $fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  })
}


  const getMeetingById = async (id: number) => {
    const token = localStorage.getItem('authToken')
    if (!token) throw new Error('No token found')

    return await $fetch(`http://localhost:8000/api/meetings/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
  }

  const createMeeting = async (meetingData: Record<string, any>) => {
    const token = localStorage.getItem('authToken')
    if (!token) throw new Error('No token found')

    return await $fetch('http://localhost:8000/api/meetings', {
      method: 'POST',
      body: meetingData,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
  }

  return {
    getMeetings,
    getMeetingById,
    createMeeting,
  }
}
