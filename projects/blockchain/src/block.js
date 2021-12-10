import hex2ascii from 'hex2ascii'

import { cryptoHash } from './utils.js'

export class Block {
  constructor (data) {
    this.hash = null
    this.height = 0
    this.body = Buffer.from(JSON.stringify(data)).toString('hex')
    this.time = 0
    this.previousBlockHash = null
  }

  /**
   * Note: we do not really need a Promise here since using node:crypto
   *  I left it here just because Project Rubric said so.
   */
  async validate () {
    const originalHash = this.hash
    const hash = cryptoHash(this)
    return originalHash === hash
  }

  getBData () {
    if (this.height === 0) {
      throw new Error('Genesis block has no data')
    }
    return JSON.parse(hex2ascii(this.body))
  }
}
