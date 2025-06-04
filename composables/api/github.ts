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
export const createGitHubRepo = async (repoData) => {
  const token = import.meta.env.VITE_GITHUB_TOKEN

  const response = await fetch('https://api.github.com/user/repos', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json'
    },
    body: JSON.stringify({
      name: repoData.name,
      description: repoData.description,
      private: repoData.private ?? false
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`GitHub error: ${error.message}`)
  }

  return await response.json()
}
export async function getAssignedIssuesByRepo(repoFullName: string, assignee: string) {
  const token = import.meta.env.VITE_GITHUB_TOKEN
  const [owner, repo] = repoFullName.split('/')

  const url = `https://api.github.com/repos/${owner}/${repo}/issues?assignee=${assignee}`

  const response = await fetch(url, {
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
