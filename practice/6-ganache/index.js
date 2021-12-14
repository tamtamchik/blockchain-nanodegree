import Web3 from 'web3'
import ET from '@ethereumjs/tx'

const { Transaction } = ET

const GANACHE_RPC_URL = 'http://127.0.0.1:7545'

const sendingAddress = '0x1cD22b9E6A8b725892ce55999F0e13C6d3e438D8'
const receivingAddress = '0x9cF9Dfe1ff18b1ea622291cc314EdAF314283695'

const web3 = new Web3(GANACHE_RPC_URL)

console.info('---------------------')
console.info('Blockchain stats.')
console.info('---------------------')

const gasPrice = await web3.eth.getGasPrice()
const uncles = await web3.eth.getBlockUncleCount('latest')
const transactions = await web3.eth.getBlockTransactionCount('latest')

console.info(`Gas Price: ${gasPrice}`)
console.info(`Latest block uncles: ${uncles}`)
console.info(`Latest block transactions: ${transactions}`)

console.info('---------------------')
console.info('Starting balance.')
console.info('---------------------')

const sendingBalance = await web3.eth.getBalance(sendingAddress)
const receivingBalance = await web3.eth.getBalance(receivingAddress)

console.log(`Sending: ${sendingBalance} Wei`)
console.log(`Receiving: ${receivingBalance} Wei`)

const nonce = await web3.eth.getTransactionCount(sendingAddress)
const value = web3.utils.toWei('1')

const txParams = {
  nonce,
  to: receivingAddress,
  gasPrice: 20000000,
  gasLimit: 30000,
  value: web3.utils.toBN(value),
  data: '',
}

const sendingPrivateKey = 'd96e8ce9bf298dfe7da690cff1ecbebc4d17011a88c7fdb78fa67e8325288e2d'
const sendingPrivateKeyHex = Buffer.from(sendingPrivateKey, 'hex')
const tx = Transaction.fromTxData(txParams)
const signedTx = tx.sign(sendingPrivateKeyHex)
const serializedTx = signedTx.serialize()

console.info('---------------------')
console.info(`Transaction RAW: ${JSON.stringify(txParams)}`)
console.info(`Transaction ETH: ${JSON.stringify(tx)}`)
console.info(`Transaction ETH & Signed: ${JSON.stringify(signedTx)}`)
console.info(`Transaction ETH & Signed & Serialized: ${JSON.stringify(serializedTx)}`)

await web3.eth.sendSignedTransaction(serializedTx)

console.info('---------------------')
