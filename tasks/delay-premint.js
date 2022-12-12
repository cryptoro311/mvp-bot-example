const { mintQueue } = require('../workers/queues')

// For testing...
// https://www.epochconverter.com/

const run = async () => {
  const args = process.argv.slice(2)
  const date = args[0] && args[0] !== 'none' ? new Date(parseInt(args[0] * 1000)) : null
  let delay = date ? date - new Date() : 0

  if (date) console.log(`Added pending mint of Cockpunch at ${date.toISOString()} (delay: ${delay})`)

  await mintQueue.add(
    {
      maxPriorityFee: 100, // Gwei
      test: true, // If test is true, it won't actually fire the transaction
      amount: 1, // How many do we want to mint?
      title: 'Cockpunch',
    },
    { priority: 1, attempts: 1, delay, backoff: 500 }
  )

  let queueCounts = await mintQueue.getJobCounts()
  console.log('new mintQueue Job Count:\n', queueCounts)

  return process.exit(0)
}

run()
