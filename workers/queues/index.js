const Queue = require('bull')

// Connect to a local redis instance locally
let REDIS_URL = 'redis://127.0.0.1:6379'

// This is just a helper function written to help simplify the redis url and convert it into opts automatically.
// Feel free to ignore :)
const redisOptsFromUrl = (url) => {
  const redisOpts = {}
  try {
    const redisUrl = new URL(url)
    redisOpts.port = parseInt(redisUrl.port) || 6379
    redisOpts.host = redisUrl.hostname
    if (redisUrl.password) {
      redisOpts.username = redisUrl.username
      redisOpts.password = redisUrl.password
    }
    if (redisUrl.protocol === 'rediss:') {
      redisOpts.tls = {
        rejectUnauthorized: false,
      }
    }
  } catch (e) {
    throw new Error(e.message)
  }
  return redisOpts
}

const redisOpts = redisOptsFromUrl(REDIS_URL)

let mintQueue = new Queue('mint', { redis: redisOpts })

module.exports = {
  mintQueue,
}
