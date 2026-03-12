const rawList = import.meta.env.VITE_API_URLS
const single = import.meta.env.VITE_API_URL
const API_BASES = (rawList || single || 'http://localhost:4000')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean)

let resolvedBase = null

async function requestJson(base, path) {
  const response = await fetch(`${base}${path}`)
  if (!response.ok) {
    const message = `Error ${response.status} al solicitar ${path}`
    throw new Error(message)
  }
  return response.json()
}

export async function fetchJson(path) {
  if (resolvedBase) {
    try {
      return await requestJson(resolvedBase, path)
    } catch (error) {
      resolvedBase = null
    }
  }

  let lastError = null
  for (const base of API_BASES) {
    try {
      const data = await requestJson(base, path)
      resolvedBase = base
      return data
    } catch (error) {
      lastError = error
    }
  }

  throw lastError || new Error('No se pudo contactar con la API.')
}

export { API_BASES }
