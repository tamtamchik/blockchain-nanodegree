//Import the Block class
import { Block } from './block.js'

// Creating a block object
const block = new Block('Test Block')

// Generating the block hash
block
  .generateHash()
  .then((result) => {
    console.log(`Block Hash: ${result.hash}`)
    console.log(`Block: ${JSON.stringify(result)}`)
  })
  .catch((error) => {
    console.log(error)
  })
