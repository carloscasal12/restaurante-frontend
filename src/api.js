const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export async function fetchJson(path) {
  const response = await fetch(`${API_BASE}${path}`)
  if (!response.ok) {
    const message = `Error ${response.status} al solicitar ${path}`
    throw new Error(message)
  }
  return response.json()
}

export { API_BASE }
