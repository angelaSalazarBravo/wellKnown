export const useMessagesApi = () => {
  const getMessages = async (projectId: number) => {
    const token = localStorage.getItem('authToken')
    if (!token) throw new Error('No token found')

    return await $fetch(`http://localhost:8000/api/messages?project_id=${projectId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
  }

  const sendMessage = async (payload: { project_id: number; sender_id: number; message: string }) => {
    const token = localStorage.getItem('authToken')
    if (!token) throw new Error('No token found')

    return await $fetch('http://localhost:8000/api/messages', {
      method: 'POST',
      body: payload,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
  }

  return {
    getMessages,
    sendMessage,
  }
}
