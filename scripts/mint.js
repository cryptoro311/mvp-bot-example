// Make sure we have access to our environment variables
require('dotenv').config()

// Import everything we'll need
const premintAbi = require('../helpers/abis/premint.json')
const AlchemyWeb3 = require('@alch/alchemy-web3')
const { ALCHEMY_URI, ALCHEMY_API_KEY, WALLET_1_ADDRESS, WALLET_1_PKEY, WALLET_2_ADDRESS, WALLET_2_PKEY } = process.env

// Setup Alchemy
const web3 = AlchemyWeb3.createAlchemyWeb3(`${ALCHEMY_URI}/${ALCHEMY_API_KEY}`)

//
// Setup any wallets we want to use
//

const fetchWallets = () => {
  return [
    {
      address: WALLET_1_ADDRESS,
      key: WALLET_1_PKEY,
    },
  ]
}

//
// Sign any transaction
//

const signTx = async (wallet, fields = {}) => {
  const nonce = await web3.eth.getTransactionCount(wallet.address, 'latest')

  const transaction = {
    nonce: nonce,
    ...fields,
  }

  return await web3.eth.accounts.signTransaction(transaction, wallet.key)
}

//
// Send a transaction and wait for a success!
//

const sendTx = async (wallet, fields = {}) => {
  const signedTx = await signTx(wallet, fields)

  return new Promise((resolve, reject) => {
    try {
      web3.eth.sendSignedTransaction(signedTx.rawTransaction, function (error, hash) {
        if (!error) {
          console.log('Transaction sent!', hash)

          const interval = setInterval(function () {
            console.log(hash, '...pending...')

            web3.eth.getTransactionReceipt(hash, function (err, rec) {
              if (rec) {
                console.log(hash, { rec })
                clearInterval(interval)
                resolve()
              }
            })
          }, 1000)
        } else {
          console.log('Something went wrong while submitting your transaction:', error)
          reject(error)
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}

//
// Wait for the next block number after a certain time
//

const waitForNextBlock = (currentBlockNumber) => {
  return new Promise(async (resolve) => {
    let newBlockNumber = await web3.eth.getBlockNumber()
    let loop = 0

    while (!newBlockNumber || newBlockNumber === currentBlockNumber) {
      loop += 1
      newBlockNumber = await new Promise((resolve) =>
        setTimeout(async () => {
          let number = await web3.eth.getBlockNumber()
          resolve(number)
        }, 500)
      )

      console.log(`Waiting for next block..${[...Array(loop)].map((i) => '.').join('')}`)
    }

    console.log('Hit next block!')
    resolve(newBlockNumber)
  })
}

//
// Fire off our mint function!
//

const purchaseWithWallet = ({ wallet, tokenAddress, data, amount, maxPriorityFee, test: isTest }) => {
  return new Promise(async (resolve, reject) => {
    let contract

    try {
      contract = new web3.eth.Contract(premintAbi, tokenAddress)

      // Create the transaction data so we can send it
      const transactionData = contract.methods.premint(data, amount).encodeABI()

      // Get our estimated gas price for this specific transaction
      const estimatedTransactionGas = await web3.eth.estimateGas({
        to: tokenAddress,
        from: wallet.id,
        data: transactionData,
        value: data.allowance.unitPrice,
      })

      // Now send our actual transaction to buy it!
      try {
        // Calculate the current blocks base fee
        const currentBlock = await web3.eth.getBlock('pending')
        const baseFee = Number(currentBlock.baseFeePerGas)

        // Calculate the priority fee we want to use
        const baseMaxPriorityFee = maxPriorityFee || 10
        const baseTip = await web3.eth.getMaxPriorityFeePerGas()
        const tip = web3.utils.toWei(`${baseMaxPriorityFee}`, 'gwei')
        const maxTip = Math.max(Number(baseTip), Number(tip))

        // How much we'll pay not including transaction fee (priority fee + base)
        const maxFeeGas = Number(maxTip) + Number(baseFee) - 1

        // Create the transaction and set our gas prices
        const txData = {
          gas: Number(estimatedTransactionGas),
          maxPriorityFeePerGas: Number(tip),
          maxFeePerGas: Number(maxFeeGas),
          to: tokenAddress,
          data: transactionData,
          value: data.allowance.unitPrice,
        }

        // If we're a test, end here!
        if (isTest) {
          console.log('Test complete!', { txData })
          resolve({ wallet })
        } else {
          await sendTx(web3, wallet, txData)
          console.log('Successfully purchased item!')
          resolve({ wallet })
        }
      } catch (err) {
        console.log('createAndPurchaseViaWallet SendTX failed:', { err })
        reject({ err, wallet })
      }
    } catch (err) {
      const data = err?.data
      let customError
      // Find the actual error! Premint uses custom errors in their contract, so we don't get much
      // info back when we fail... this just tells us the name of the failing error so we know.
      // NOTE: If a contract uses require('xxx') style errors, this isn't required
      if (data) {
        const errors = premintAbi.reduce((acc, item) => {
          if (item?.type !== 'error') return acc
          return [...acc, { name: item.name, signature: web3.eth.abi.encodeFunctionSignature(item) }]
        }, [])

        customError = errors.find((e) => e.signature === data)?.name
      }

      console.log('purchaseWithWallet error', { message: customError || err?.message })
      reject({ err: { message: customError || err?.message }, wallet })
    }
  })
}

const mint = async (job) => {
  const { maxPriorityFee, data, amount, disableWait, test } = job.data

  // Fetch all of the wallets we want to use so we can submit for all of them
  const wallets = fetchWallets()

  try {
    if (!wallets?.length) {
      throw { message: 'No wallets selected' }
    }

    const currentBlockNumber = await web3.eth.getBlockNumber()
    console.log('Mint fired at block', currentBlockNumber)

    // Wait for the next block
    if (!disableWait) {
      await waitForNextBlock(currentBlockNumber)
    }

    // Loop through our wallets and purchase each one
    await Promise.allSettled(
      wallets.map((wallet, i) => {
        // We have one! Send it
        return purchaseWithWallet({
          wallet,
          maxPriorityFee,
          tokenAddress: data.allowance.target,
          data,
          amount,
          test,
        })
      })
    )

    // Make sure this job is done
    return Promise.resolve()
  } catch (err) {
    console.log('Failed to purchase', { err })
    // Make sure this job is done
    return Promise.resolve()
  }
}

module.exports = mint
