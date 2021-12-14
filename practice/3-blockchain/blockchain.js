import crypto from 'node:crypto'

import { Block } from './block.js'

const cryptoHash = block => crypto.createHash('sha256').update((JSON.stringify(block)).toString()).digest('hex')

class Blockchain {
  constructor () {
    this.chain = []
    this.addBlock(this.createGenesisBlock())
  }

  createGenesisBlock () {
    return new Block('First block in the chain - Genesis block')
  }

  getLatestBlock () {
    return this.chain[this.chain.length - 1]
  }

  addBlock (block) {
    block.height = this.chain.length
    block.time = Number(new Date())

    if (this.chain.length > 0) {
      block.previousBlockHash = this.getLatestBlock().hash
    }

    block.hash = cryptoHash(block)
    this.chain.push(block)
  }
}

const blockchain = new Blockchain()

blockchain.addBlock(new Block('Second block'))
blockchain.addBlock(new Block('Third block block'))

console.log(blockchain)
