const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

async function parseResponse(response) {
  const body = await response.text()

  if (!body) return {}

  try {
    return JSON.parse(body)
  } catch {
    return {}
  }
}

export async function subscribeToNewsletter(email) {
  const response = await fetch(`${API_URL}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  const data = await parseResponse(response)

  if (response.status !== 202) {
    throw new Error(data.message || 'The subscription could not be completed. Please try again.')
  }

  return {
    message: typeof data.message === 'string'
      ? data.message
      : 'Your subscription request was accepted and the welcome email was queued.',
  }
}
