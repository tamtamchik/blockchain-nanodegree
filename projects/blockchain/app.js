import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'

import { Blockchain } from './src/blockchain.js'

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

function start () {
  const app = express()
  const blockchain = new Blockchain()

  app.set('port', 8000)

  app.use(morgan('dev'))
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())

  // Endpoint to get a block by height or by hash (GET Endpoint)
  app.get('/block/:id', asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!id) {
      return res.status(404).send('Block Not Found! Review the Parameters!')
    }

    const block = isNaN(id) ? await blockchain.getBlockByHash(id) : await blockchain.getBlockByHeight(+id)
    if (block) {
      return res.status(200).json(block)
    } else {
      return res.status(404).send('Block Not Found!')
    }
  }))

  // Endpoint that allows user to request ownership of a wallet address (POST Endpoint)
  app.post('/requestValidation', asyncHandler(async (req, res) => {
    const { address } = req.body
    if (!address) {
      return res.status(500).send('Check the Body Parameter!')
    }

    const message = await blockchain.requestMessageOwnershipVerification(address)
    if (message) {
      return res.status(200).json(message)
    } else {
      return res.status(500).send('An error happened!')
    }
  }))

  // Endpoint that allow submit a star, you need first to `requestOwnership` to have the message (POST endpoint)
  app.post('/submit', asyncHandler(async (req, res) => {
    const { address, message, signature, star } = req.body

    if (!address || !message || !signature || !star) {
      return res.status(500).send('Check the Body Parameter!')
    }

    try {
      let block = await blockchain.submitStar(address, message, signature, star)
      if (block) {
        return res.status(200).json(block)
      } else {
        return res.status(500).send('An error happened!')
      }
    } catch (error) {
      return res.status(500).send(error.message)
    }
  }))

  // This endpoint allows you to request the list of Stars registered by an owner
  app.get('/blocks/:address', async (req, res) => {
    const { address } = req.params
    if (!address) {
      return res.status(500).send('Block Not Found! Review the Parameters!')
    }

    try {
      let stars = await blockchain.getStarsByWalletAddress(address)
      if (stars) {
        return res.status(200).json(stars)
      } else {
        return res.status(404).send('Block Not Found!')
      }
    } catch (error) {
      console.log(error)
      return res.status(500).send('An error happened!')
    }
  })

  app.get('/validateChain', asyncHandler(async (req, res) => {
    try {
      const errors = await blockchain.validateChain()

      if (!errors.length) {
        return res.status(200).json(blockchain)
      } else {
        return res.status(500).json(errors)
      }
    } catch (error) {
      console.log(error)
      return res.status(500).send('An error happened!')
    }
  }))

  app.listen(app.get('port'), () => {
    console.log(`Server Listening for port: ${app.get('port')}`)
  })
}

start()
