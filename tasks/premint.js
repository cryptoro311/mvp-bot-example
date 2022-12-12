const mint = require('./../scripts/mint')

const run = async () => {
  await mint({
    data: {
      maxPriorityFee: 100, // Gwei
      test: true, // If test is true, it won't actually fire the transaction
      amount: 1, // How many do we want to mint?
    },
  })

  return process.exit(0)
}

run()
