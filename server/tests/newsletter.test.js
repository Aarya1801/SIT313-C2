import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import express from 'express'
import { createNewsletterRouter, handleMalformedJson } from '../routes/newsletter.js'

const openServers = new Set()
const silentLogger = { log() {}, error() {} }

afterEach(async () => {
  await Promise.all([...openServers].map((server) => new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve())
  })))
  openServers.clear()
})

async function startTestServer(options) {
  const app = express()
  app.use(express.json())
  app.use(handleMalformedJson)
  app.use('/api', createNewsletterRouter({ logger: silentLogger, ...options }))

  const server = await new Promise((resolve) => {
    const listener = app.listen(0, '127.0.0.1', () => resolve(listener))
  })
  openServers.add(server)

  return `http://127.0.0.1:${server.address().port}/api/subscribe`
}

function configuredOptions(sendEmail) {
  return {
    sendEmail,
    getConfig: () => ({ apiKey: 'test-api-key', fromEmail: 'sender@example.com' }),
  }
}

test('invalid and malformed requests return 400 without invoking the provider', async () => {
  let providerCalls = 0
  const url = await startTestServer(configuredOptions(async () => {
    providerCalls += 1
    return [{ statusCode: 202 }]
  }))
  const invalidBodies = [
    {},
    { email: 'not-an-email' },
    { email: 'valid@example.com', extra: true },
    { email: 123 },
  ]

  for (const body of invalidBodies) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    assert.equal(response.status, 400)
  }

  const malformedResponse = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{"email":',
  })
  assert.equal(malformedResponse.status, 400)
  assert.deepEqual(await malformedResponse.json(), { message: 'Request body must be valid JSON.' })
  assert.equal(providerCalls, 0)
})

test('missing email configuration returns 500 without invoking the provider', async () => {
  let providerCalls = 0
  const url = await startTestServer({
    sendEmail: async () => {
      providerCalls += 1
      return [{ statusCode: 202 }]
    },
    getConfig: () => ({ apiKey: '', fromEmail: '' }),
  })
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'reader@example.com' }),
  })

  assert.equal(response.status, 500)
  assert.equal(providerCalls, 0)
})

test('provider acceptance returns 202 and uses the normalized address', async () => {
  let sentMessage
  const url = await startTestServer(configuredOptions(async (message) => {
    sentMessage = message
    return [{ statusCode: 202 }]
  }))
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: '  Reader@Example.COM  ' }),
  })

  assert.equal(response.status, 202)
  assert.equal(sentMessage.to, 'reader@example.com')
  assert.equal(sentMessage.from.name, 'DEV@Deakin')
})

test('provider failure returns 502 without exposing sensitive error details', async () => {
  const sensitiveDetail = 'secret-provider-detail'
  const url = await startTestServer(configuredOptions(async () => {
    throw new Error(sensitiveDetail)
  }))
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'reader@example.com' }),
  })
  const body = await response.text()

  assert.equal(response.status, 502)
  assert.equal(body.includes(sensitiveDetail), false)
})

test('an unexpected provider response returns 502', async () => {
  const url = await startTestServer(configuredOptions(async () => [{ statusCode: 200 }]))
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'reader@example.com' }),
  })

  assert.equal(response.status, 502)
})
