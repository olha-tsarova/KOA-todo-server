import {} from 'dotenv/config'

import Koa from 'koa'
import cors from '@koa/cors'
import jwt from 'koa-jwt'
import http from 'http'

import { port } from './config'
import db from './lib/sequalize-config'
import bodyParser from './handlers/body-parser'
import errors from './handlers/errors'
import controllers from './controllers'
import io from './websocket/socketClient'
import socketRoutes from './websocket/socketServer'

const app = new Koa()
const server = http.createServer(app.callback())

app.use(async (ctx, next) => {
  ctx.db = db
  await next()
})

if (process.env.NODE_ENV !== 'test') {
  app.use(async (ctx, next) => {
    ctx.io = io
    await next()
  })

  socketRoutes()
}

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

if (process.env.NODE_ENV !== 'test') {
  server.listen(port, () => console.log(`Listening on port ${port}`))
}

export default server
