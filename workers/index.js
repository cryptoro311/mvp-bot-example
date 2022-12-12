let throng = require('throng')
let MintWorker = require('./../scripts/mint')
let { mintQueue } = require('./queues')

function start() {
  const loadWorkers = async () => {
    try {
      console.log('Starting workers...')
      // 5 is `max jobs per worker`
      mintQueue.process(1, MintWorker)
      console.log('Running workers!')
    } catch (err) {
      console.error('Failed to start workers', { err })
    }
  }

  loadWorkers()
}

// Initialize the clustered worker process
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
throng({
  workers: process.env.WEB_CONCURRENCY || 1,
  lifetime: Infinity,
  start,
})
