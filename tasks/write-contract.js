const writeContract = require('../learning/3-write-contract')

const run = async () => {
  try {
    console.log('Running write function...')
    await writeContract()
  } catch (err) {
    console.log({ err })
  }

  return process.exit(0)
}

run()
