export const useUsersApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase

  // Función para obtener el token guardado
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return token
      ? { Authorization: `Bearer ${token}` }
      : {}
  }

  const getUsers = async () => {
    const { data, error } = await useFetch(`${baseURL}/users`, {
      method: 'GET',
      headers: getAuthHeaders()
    })
    return { data, error }
  }

  const getUser = async (id: number | string) => {
    const { data, error } = await useFetch(`${baseURL}/users/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    })
    return { data, error }
  }

  const createUser = async (userData: Record<string, any>) => {
    const { data, error } = await useFetch(`${baseURL}/users`, {
      method: 'POST',
      body: userData,
      headers: getAuthHeaders()
    })
    return { data, error }
  }

  const updateUser = async (id: number | string, userData: Record<string, any>) => {
    const { data, error } = await useFetch(`${baseURL}/users/${id}`, {
      method: 'PUT',
      body: userData,
      headers: getAuthHeaders()
    })
    return { data, error }
  }

  const deleteUser = async (id: number | string) => {
    const { data, error } = await useFetch(`${baseURL}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    return { data, error }
  }

const loginUser = async (email: string, password: string) => {
  const { data, error } = await useFetch(`${baseURL}/login`, {
    method: 'POST',
    body: { email, password }
  })

  if (data.value?.data?.accessToken) {
    localStorage.setItem('token', data.value.data.accessToken)
    console.log('Token guardado:', data.value.data.accessToken)
  } else {
    console.error('Token no recibido del servidor')
  }

  return { data, error }
}


  const registerUser = async (name: string, email: string, password: string) => {
    const { data, error } = await useFetch(`${baseURL}/register`, {
      method: 'POST',
      body: { name, email, password }
    })
    return { data, error }
  }

  return {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    loginUser,
    registerUser
  }
}
