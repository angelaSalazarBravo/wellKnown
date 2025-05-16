export const useUsersApi = () => {
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBase
    console.log('Base URL:', baseURL)
  
    // Obtener todos los usuarios
    const getUsers = async () => {
      const { data, error } = await useFetch(`${baseURL}/users`, {
        method: 'GET',
        credentials: 'include'
      })
      return { data, error }
    }
  
    // Obtener un usuario específico por ID
    const getUser = async (id: number | string) => {
      const { data, error } = await useFetch(`${baseURL}/users/${id}`, {
        method: 'GET',
        credentials: 'include'
      })
      return { data, error }
    }
  
    // Crear un nuevo usuario (registro)
    const createUser = async (userData: Record<string, any>) => {
      const { data, error } = await useFetch(`${baseURL}/users`, {
        method: 'POST',
        body: userData,
        credentials: 'include'
      })
      return { data, error }
    }
  
    // Actualizar un usuario
    const updateUser = async (id: number | string, userData: Record<string, any>) => {
      const { data, error } = await useFetch(`${baseURL}/users/${id}`, {
        method: 'PUT',
        body: userData,
        credentials: 'include'
      })
      return { data, error }
    }
  
    // Eliminar un usuario
    const deleteUser = async (id: number | string) => {
      const { data, error } = await useFetch(`${baseURL}/users/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      return { data, error }
    }
  
    // Login del usuario
    const loginUser = async (email: string, password: string) => {
      const { data, error } = await useFetch(`${baseURL}/login`, {
        method: 'POST',
        body: { email, password },
        credentials: 'include'
      })
      return { data, error }
    }
  
    // Registro de un nuevo usuario
    const registerUser = async (name: string, email: string, password: string) => {
      const { data, error } = await useFetch(`${baseURL}/register`, {
        method: 'POST',
        body: { name, email, password },
        credentials: 'include'
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
  