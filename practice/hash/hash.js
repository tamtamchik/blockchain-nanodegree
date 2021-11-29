import crypto from 'node:crypto'

/**
 * Variables: Do not change variable values.
 */
const data1 = 'Blockchain Rock!'
const dataObject = {
  id: 1,
  body: 'With Object Works too',
  time: new Date().getTime().toString().slice(0, -3),
}

/**
 * Step 3: Add code to the `generateHash` function
 * Function that generates the SHA256 Hash
 * @param {*} obj
 */
function generateHash (obj) {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(obj))
    .digest('hex')
}

console.log(`SHA256 Hash: ${generateHash(data1)}`)
console.log('************************************')
console.log(`SHA256 Hash: ${generateHash(dataObject)}`)
