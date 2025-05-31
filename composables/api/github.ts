export async function getAssignedIssues() {
  const token = import.meta.env.VITE_GITHUB_TOKEN

  const response = await fetch('https://api.github.com/issues', {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json'
    }
  })

  if (!response.ok) {
    throw new Error('Error al obtener issues: ' + response.statusText)
  }

  return await response.json()
}
export async function getIssues(isAdmin: boolean) {
  const token = import.meta.env.VITE_GITHUB_TOKEN
  const url = isAdmin
    ? 'https://api.github.com/issues?filter=all'
    : 'https://api.github.com/issues' 

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
    }
  })

  if (!response.ok) {
    throw new Error('Error al obtener issues: ' + response.statusText)
  }

  return await response.json()
}
