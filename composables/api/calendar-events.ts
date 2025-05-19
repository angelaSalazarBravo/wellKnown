export const useCalendarEventsApi = () => {
  const getCalendarEvents = async (projectId?: number) => {
    let url = 'http://localhost:8000/api/calendar-events'
    if (projectId) {
      url += `?project_id=${projectId}`
    }

    const token = localStorage.getItem('authToken')

    const events = await $fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })

    return events
  }

  return {
    getCalendarEvents,
  }
}
