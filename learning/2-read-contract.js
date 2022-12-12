// Make sure we have access to our environment variables
require('dotenv').config()

// Import everything we'll need
const potatozAbi = require('../helpers/abis/potatoz.json')
const AlchemyWeb3 = require('@alch/alchemy-web3')
const { ALCHEMY_URI, ALCHEMY_API_KEY } = process.env

// Setup Alchemy
const web3 = AlchemyWeb3.createAlchemyWeb3(`${ALCHEMY_URI}/${ALCHEMY_API_KEY}`)

const readContract = async () => {
  try {
    // Create an instance of the Potatoz contract by using the Potatoz ABI and ETH address
    const contract = new web3.eth.Contract(potatozAbi, '0x39ee2c7b3cb80254225884ca001F57118C8f21B6')

    // Use this contract instance to read a value
    const totalSupply = await contract.methods.totalSupply().call()
    console.log(`There are a max of ${totalSupply} Potatoz!`, { totalSupply })

    // Resolve our promise so wherever we call this, we know it's done!
    return Promise.resolve()
  } catch (err) {
    console.log({ err })
    // We can also reject here if we want so the parent function throws an error
    return Promise.resolve()
  }
}

module.exports = readContract