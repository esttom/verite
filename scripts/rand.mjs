import { randomBytes } from 'node:crypto'

const len = 64

randomBytes(len, (err, buf) => {
  if (err)
    throw err
  console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`)
})
