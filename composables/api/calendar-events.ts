export const useCalendarEventsApi = () => {
  const getCalendarEvents = async (projectId?: number) => {
    let url = 'http://localhost:8001/api/calendar-events'
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

  const createCalendarEvent = async (event: {
    title: string
    description: string
    start_date: string
    end_date: string
    project_id: number
    created_by: number
  }) => {
    const token = localStorage.getItem('authToken')

    const response = await $fetch('http://localhost:8001/api/calendar-events', {
      method: 'POST',
      body: event,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    return response
  }

  return {
    getCalendarEvents,
    createCalendarEvent,
  }
}
