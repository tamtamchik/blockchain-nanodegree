import crypto from 'node:crypto'

export const cryptoHash = block => {
  const blockClone = { ...block, hash: null }

  return crypto
    .createHash('sha256')
    .update((JSON.stringify(blockClone)).toString())
    .digest('hex')
}

export const getTimestamp = () => parseInt(new Date().getTime().toString().slice(0, -3))
