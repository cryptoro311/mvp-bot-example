const readContract = require('../learning/2-read-contract')

const run = async () => {
  try {
    console.log('Running read function...')
    await readContract()
  } catch (err) {
    console.log({ err })
  }

  return process.exit(0)
}

run()
