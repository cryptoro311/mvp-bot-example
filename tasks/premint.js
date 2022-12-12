const mint = require('./../scripts/mint')

const run = async () => {
  // This is the data the Premint "premint" function requires
  const data = {
    allowance: {
      listId: '0x0000000000000000000000000000000000000000000000000000000000000002',
      account: '0x2718aa38cb0c94ba5d22a920b97942f359381683',
      target: '0xc178994cb9b66307cd62db8b411759dd36d9c2ee',
      startsAt: 1670439600,
      endsAt: 1670443200,
      unitPrice: '300000000000000000',
      amount: 0,
    },
    allowanceSignature:
      '0xb3f1bf7f8a871450b80f6af1c9b303ac132c38013d229c17be939d42a9d2602c7b9136aca92b53c472cd25c55c0cec597fc8d6db1c4b0224800c350371e749fb1c',
    validator: '0xEf647e713f8A72CE8Ae0C7B8876aD9c721D67E7E',
    validatorAuthorizationSignature:
      '0xaa335d6a673700f9bed1b8d07f4b1f15cb11567dbc89a9b8bac474f8f83eda0d4c791850d5597501b8af72178b1ce8bbce50d4738dc05acfd6056b96881412961c',
  }

  await mint({
    data: {
      maxPriorityFee: 100, // Gwei
      test: true, // If test is true, it won't actually fire the transaction
      amount: 1, // How many do we want to mint?
      data,
    },
  })

  return process.exit(0)
}

run()
