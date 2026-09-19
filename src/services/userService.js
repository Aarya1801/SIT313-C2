const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Keep account and subscription requests in one small API helper.
async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })
  const data = await response.json()

  if (!response.ok) {
    const error = new Error(data.message || 'Request failed')
    error.status = response.status
    throw error
  }

  return data
}

export async function registerUser({ fullName, email, password }) {
  try {
    return await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName, email, password }),
    })
  } catch (error) {
    if (error.status === 409) return { success: false, reason: 'duplicate-email' }
    throw error
  }
}

export async function verifyLoginCredentials(email, password) {
  try {
    return await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  } catch (error) {
    if (error.status === 401) return null
    throw error
  }
}

export function getCurrentUser(token) {
  return request('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
}

export function upgradePlan(token) {
  return request('/users/plan', {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ plan: 'paid' }),
  })
}
