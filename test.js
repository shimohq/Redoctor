const execSync = require('child_process').execSync

const randomjs = require('randomjs')
const Redis = require('ioredis')
const redis = new Redis()

const keys = []
const limit = 10000

;(async function () {
  for (let i = 1; i <= limit; i++) {
    const key = randomjs('[a-z]:[a-zA-Z0-9]{6}')
    await redis.set(key, 1)
    keys.push(key)
    console.log(`set ${i}: ${key}`)
  }

  execSync('node index --strip-pattern="[^:]*$" --count=1', {
    cwd: __dirname,
    stdio: 'inherit'
  })

  await redis.del(keys)
  process.exit()
})().catch(console.error)