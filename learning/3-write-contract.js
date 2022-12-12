// Make sure we have access to our environment variables
require('dotenv').config()

// Import everything we'll need
const potatozAbi = require('../helpers/abis/potatoz.json')
const AlchemyWeb3 = require('@alch/alchemy-web3')
const { ALCHEMY_URI, ALCHEMY_API_KEY, WALLET_1_ADDRESS, WALLET_1_PKEY } = process.env

// Setup Alchemy
const web3 = AlchemyWeb3.createAlchemyWeb3(`${ALCHEMY_URI}/${ALCHEMY_API_KEY}`)

const writeContract = async () => {
  try {
    // Create an instance of the Potatoz contract by using the Potatoz ABI and ETH address
    const potatozAddress = '0x39ee2c7b3cb80254225884ca001F57118C8f21B6'
    const contract = new web3.eth.Contract(potatozAbi, potatozAddress)

    // Use this contract to try to change the contract state (unstake something!)
    console.log(`Let's try to unstake a Potato! Wish us luck!`)

    // We need to fetch a "nonce" for our transaction. Pretty much, a unique number that can only be used once. Once it's
    // used we'll get back a new number next time and so on. If we send up two transactions with the same nonce, but once one
    // is mined the other transactions with the same nonce will fail.
    const nonce = await web3.eth.getTransactionCount(WALLET_1_ADDRESS)

    // Create our transaction data that we're going to sign and send
    let tx = {
      nonce,
      from: WALLET_1_ADDRESS,
      to: potatozAddress,
      data: contract.methods.unstake('2395').encodeABI(),
    }

    // Before we do anything crazy... lets see what the estimated gas would be for this transaction.
    // NOTE: This will fail for the same reasons that our transaction will fail if we try to send it, so this is
    // helpful for things like "minting hasn't started yet" errors, which we'll catch before we send up the data
    // saving you some gas and a headache.
    // const estimatedTransactionGas = await web3.eth.estimateGas(tx)
    const estimatedTransactionGas = 21216

    // Assuming that worked, our transaction will most likely succeed! So lets figure out how much we're going to spend
    // in gas overall, since we need to send that up as well

    // Gas price is: base_fee + priority_fee (tip) + transaction_cost

    // Calculate the current pending blocks base fee, since that's where we're trying to be included
    const currentBlock = await web3.eth.getBlock('pending')
    const baseFee = Number(currentBlock.baseFeePerGas)
    const baseTip = await web3.eth.getMaxPriorityFeePerGas()

    tx = {
      ...tx,
      // Add our Gas stuff to our existing fees
      gas: Number(estimatedTransactionGas),
      maxPriorityFeePerGas: Number(baseTip),
      // How much are we going to pay miners total?
      // The -1 makes sure we don't hit a "must be less than the sum..." error
      maxFeePerGas: Number(baseFee) + Number(baseTip) - 1,
    }

    // Our new gassed up transaction
    console.log('We would be sending up this transaction', { tx })

    // NOTE: If you're building something that uses Metamask (a frontend) you'd just use `sendTransaction(tx)`
    // and then Metamask would let you sign it and move it along... but...
    // we want to be faster than pressing it ourselves! We're going to sign this transaction right in the code 🔥
    const signedTx = await web3.eth.accounts.signTransaction(tx, WALLET_1_PKEY)

    // Lets send our newly signed transaction
    await web3.eth.sendSignedTransaction(signedTx.rawTransaction, (error, hash) => {
      // Our transaction failed, why...
      if (error) {
        console.log('Something went wrong while submitting your transaction:', error.message)
        return Promise.resolve()
      }

      // Our transaction succeeded! LFG! Now lets wait until it's mined...
      console.log('Our transaction succeeded! Now lets see what happens...', { hash })

      // This interval will fire every 1 second and try to get the transaction receipt.
      // Once it is mined, we'll get our receipt if it succeeds – if it fails (minted out, or something like that)
      // we'll find that out too...
      const interval = setInterval(function () {
        console.log(hash, '...pending...')

        web3.eth.getTransactionReceipt(hash, function (err, receipt) {
          if (receipt) {
            console.log(hash, { receipt })
            clearInterval(interval)
            return Promise.resolve()
          }
        })
      }, 1000)
    })
  } catch (err) {
    console.log('We were unable to write to the contract', err.message)
    // We can also reject here if we want so the parent function throws an error
    return Promise.resolve()
  }
}

module.exports = writeContract
