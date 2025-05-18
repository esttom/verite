import { Buffer } from 'node:buffer'
import { Hono } from 'hono'
import { getCookie, setCookie } from 'hono/cookie'

const encoder = new TextEncoder()

const app = new Hono()

app.all('*', async (c) => {
  const env = c.env

  const secretKeyData = encoder.encode(
    env.SECRET_DATA,
  )

  const key = await crypto.subtle.importKey(
    'raw',
    secretKeyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )

  const queryVerify = c.req.query('verify')
  const cookieVerify = getCookie(c, 'verify')

  const verifyValue = queryVerify ?? cookieVerify

  if (!verifyValue) {
    return c.text('Missing query parameter', 403)
  }

  const [fromTimestamp, toTimestamp, hmac] = verifyValue.split('-')
  const assertedFromTimestamp = Number(fromTimestamp)
  const assertedToTimestamp = Number(toTimestamp)

  const dataToAuthenticate = `${assertedFromTimestamp}${assertedToTimestamp}`

  const receivedMac = Buffer.from(hmac, 'base64')

  // Verify the signature
  const verified = await crypto.subtle.verify(
    'HMAC',
    key,
    receivedMac,
    encoder.encode(dataToAuthenticate),
  )

  if (!verified) {
    return c.text('Invalid Request', 403)
  }

  const currentTimestamp = Date.now() / 1000
  if (currentTimestamp < assertedFromTimestamp) {
    return c.text(
      `URL is before expiration as of ${new Date((assertedFromTimestamp) * 1000).toLocaleString()}`,
      403,
    )
  }
  if (currentTimestamp > assertedToTimestamp) {
    return c.text(
      `URL expired at ${new Date((assertedToTimestamp) * 1000).toLocaleString()}`,
      403,
    )
  }

  if (queryVerify) {
    setCookie(c, 'verify', queryVerify, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
    })
  }

  const res = await env.ASSETS.fetch(c.req.raw)
  const hoge = await res.arrayBuffer()

  return c.body(hoge, {
    status: res.status,
    headers: res.headers,
  })
})

export default app
