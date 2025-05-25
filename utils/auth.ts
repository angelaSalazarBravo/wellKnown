export const getLoggedUser = () => {
  const userStr = localStorage.getItem('user')
  try {
    return userStr ? JSON.parse(userStr) : null
  } catch {
    return null
  }
}
