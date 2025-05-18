import { Buffer } from 'node:buffer'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const encoder = new TextEncoder()

const app = new Hono()

app.all('*', async (c) => {
  const url = new URL('https://example.com')

  // You will need some secret data to use as a symmetric key
  const secretKeyData = encoder.encode(
    'dev-secret-value',
  )

  // Import the secret as a CryptoKey for both 'sign' and 'verify' operations
  const key = await crypto.subtle.importKey(
    'raw',
    secretKeyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )

  if (!c.req.query('from') || !c.req.query('to')) {
    return c.text('Missing query parameter', 403)
  }

  // 2020-01-01T00:00:00
  const fromDate = new Date(c.req.query('from'))
  const fromTimestamp = Math.floor(fromDate.getTime() / 1000)
  const toDate = new Date(c.req.query('to'))
  const toTimestamp = Math.floor(toDate.getTime() / 1000)

  // Data to authenticate: timestamp
  const dataToAuthenticate = `${fromTimestamp}${toTimestamp}`

  // Sign the data
  const mac = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(dataToAuthenticate),
  )

  // Convert the signature to base64
  const base64Mac = Buffer.from(mac).toString('base64')

  // Add verification parameter to URL
  url.searchParams.set('verify', `${fromTimestamp}-${toTimestamp}-${base64Mac}`)

  return c.text(`/${url.search}`)
})

serve({
  fetch: app.fetch,
  port: 3210,
})
