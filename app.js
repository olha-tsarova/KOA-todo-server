import {} from 'dotenv/config'

import Koa from 'koa'
import cors from '@koa/cors'
import jwt from 'koa-jwt'
import socketIo from 'socket.io'
import socketClient from 'socket.io-client'
import http from 'http'

import { port } from './lib/config'
import db from './lib/sequalize-config'
import bodyParser from './handlers/body-parser'
import errors from './handlers/errors'
import controllers from './controllers'
import SocketChannel from './lib/SocketChannel'
import { appUpdated, connection, disconnect, userConnected, userDisconnect, userDisconnected } from './constants/socketEvents'

const boot = async () => {
  const app = new Koa()

  const server = http.createServer(app.callback())
  const socketServer = socketIo(3001, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: '*',
      credentials: true
    }
  })

  const io = socketClient('http://localhost:3001')

  const channel = new SocketChannel(socketServer)

  app.use(async (ctx, next) => {
    ctx.db = db
    ctx.io = io

    await next()
  })

  app.use(cors())
  app.use(bodyParser)
  app.use(errors)
  app.use(
    jwt({
      secret: process.env.SECRET
    }).unless({
      path: [/^\/public/, /^\/socket.io/, '/']
    })
  )

  app.use(controllers.routes())
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })

  socketServer.on(connection, socket => {
    console.log('Connected -------------', socket.id)

    socket.on(userConnected, data => {
      if (data.userId && socket.id) {
        socket.userId = data.userId
        channel.connectUser(socket.userId, socket.id)
      }
    })

    socket.on(userDisconnect, data => {
      if (data.userId && socket.id) {
        channel.notify(data.userId, { type: userDisconnected })
        channel.disconnectUser(data.userId)
      }
    })

    socket.on(disconnect, data => {
      if (socket.userId && socket.id) {
        channel.disconnectSocket(socket.id, socket.userId)
      }
    })

    socket.on(appUpdated, data => {
      channel.notify(data.userId, data)
    })
  })
}

export default boot
