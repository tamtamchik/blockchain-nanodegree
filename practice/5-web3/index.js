import Web3 from 'web3'
import dotenv from 'dotenv'

import Bat from './contracts/bat.js'

dotenv.config()

const INFURA_ENDPOINT = process.env.INFURA_MAIN
const ADDRESS = process.env.ADDRESS_EOA

const web3 = new Web3(INFURA_ENDPOINT)

const balance = await web3.eth.getBalance(ADDRESS)

console.info('---------------------')
console.info(`Account: ${ADDRESS}`)
console.info('---------------------')

const count = await web3.eth.getTransactionCount(ADDRESS)
console.info(`Number of transactions: ${count}`)

console.info('---------------------')
for (const unit of Object.keys(web3.utils.unitMap)) {
  if (unit !== 'noether') {
    console.log(`Balance in ${unit}: ${web3.utils.fromWei(balance, unit)}`)
  }
}

const contract = new web3.eth.Contract(Bat.abi, Bat.contract)
const name = await contract.methods.name().call()
console.info('---------------------')
console.info(`Contract BAT – ${name}`)
console.info('---------------------')
