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

db.sequelize.sync().then(() => {
  console.log('Connected to MariaDB')
})

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

socketServer.on('connection', socket => {
  console.log('Connected -------------', socket.id)

  socket.on('task:add', data => {
    console.log('New socket event -->> ', data)
    socket.emit('todo:added', data)
  })

  socket.on('task:clear-completed', data => {
    console.log('New socket event -->> ', data)
    socket.emit('todo:clear-completed', data)
  })

  socket.on('task:edit', data => {
    console.log('New socket event -->> ', data)
    socket.emit('todo:edited', data)
  })

  socket.on('task:get', data => {
    console.log('New socket event -->> ', data)
    socket.emit('todo:get', data)
  })

  socket.on('task:get-counters', data => {
    console.log('New socket event -->> ', data)
    socket.emit('todo:got-counters', data)
  })

  socket.on('task:delete', data => {
    console.log('New socket event -->> ', data)
    socket.emit('todo:deleted', data)
  })

  socket.on('task:toggle', data => {
    console.log('New socket event -->> ', data)
    socket.emit('todo:toggled', data)
  })
})
