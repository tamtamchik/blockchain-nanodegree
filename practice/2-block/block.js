import crypto from 'node:crypto'

export class Block {

  constructor (data) {
    this.id = 0
    this.nonce = 144444
    this.body = data
    this.hash = ''
  }

  /**
   * Step hash. Implement `generateHash()`
   * method that return the `self` block with the hash.
   *
   * Create a Promise that resolve with `self` after you create
   * the hash of the object and assigned to the hash property `self.hash = ...`
   */
  //
  async generateHash () {
    // Use this to create a temporary reference of the class object
    let self = this
    //Implement your code here
    self.hash = crypto.createHash('sha256').update(JSON.stringify(self)).digest('hex')
    return self
  }
}
