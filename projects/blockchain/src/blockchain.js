import bitcoinMessage from 'bitcoinjs-message'

import { Block } from './block.js'
import { cryptoHash, getTimestamp } from './utils.js'

export class Blockchain {

  constructor () {
    this.chain = []
    this.height = -1
    /**
     * Question: Why do we need an ignored promise in constructor?
     */
    this.initializeChain()
  }

  /**
   * Note: do we really need a Promise here?
   */
  async _addBlock (block) {
    const errors = await this.validateChain()
    if (errors.length) {
      throw new Error('Invalid blockchain!')
    }

    let height = this.getChainHeight()
    let previousBlockHash = null
    if (height >= 0) {
      previousBlockHash = this.chain[height].hash
    }

    block.time = getTimestamp()
    block.height = ++height
    block.previousBlockHash = previousBlockHash
    block.hash = cryptoHash(block).toString()

    this.chain.push(block)
    this.height = height
  }

  async initializeChain () {
    if (this.height === -1) {
      let block = new Block({ data: 'Genesis Block' })
      await this._addBlock(block)
    }
  }

  getChainHeight () {
    return this.height
  }

  async getBlockByHash (hash) {
    return this.chain.filter(b => b.hash === hash)[0] || null
  }

  async getBlockByHeight (height) {
    return this.chain.filter(p => p.height === height)[0] || null
  }

  /**
   * Note: do we really need a Promise here?
   */
  async requestMessageOwnershipVerification (address) {
    return `${address}:${getTimestamp()}:starRegistry`
  }

  async submitStar (address, message, signature, star) {
    const verificationTimestamp = parseInt(message.split(':')[1])
    const currentTime = getTimestamp()

    if (currentTime - verificationTimestamp > 5 * 60) {
      throw new Error('Time elapsed is more than 5 minutes!')
    }

    if (!bitcoinMessage.verify(message, address, signature)) {
      throw new Error('Verification failed!')
    }

    await this._addBlock(new Block({ owner: address, star }))

    return this.chain[this.getChainHeight()]
  }

  async getStarsByWalletAddress (address) {
    const blocks = []
    for (const block of this.chain) {
      if (block.height) {
        const data = block.getBData()
        if (data.owner === address) {
          blocks.push(data)
        }
      }
    }

    return blocks
  }

  /**
   * Note: do we really need a Promise here?
   *  Since block.validate() can be called synchronously.
   */
  async validateChain () {
    const errors = []

    let lastBlock = null
    for (const block of this.chain) {
      const isValidBlock = await block.validate()
      if (!isValidBlock) {
        const errorMessage = `Block ${block.height} has wrong hash!`
        errors.push(errorMessage)
      }

      if (lastBlock && lastBlock.hash !== block.previousBlockHash) {
        const errorMessage = `Block ${block.height} has wrong previousBlockHash!`
        errors.push(errorMessage)
      }

      lastBlock = block
    }

    return errors
  }
}
