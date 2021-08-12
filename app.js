import {} from 'dotenv/config'

import Koa from 'koa'
import cors from '@koa/cors'
import jwt from 'koa-jwt'

import { port } from './lib/config'
import db from './lib/sequalize-config'
import bodyParser from './handlers/body-parser'
import errors from './handlers/errors'
import controllers from './controllers'

db.sequelize.sync().then(() => {
  console.log('Connected to MariaDB')
})

const app = new Koa()

app.use(async (ctx, next) => {
  ctx.db = db

  await next()
})

app.use(cors())
app.use(bodyParser)
app.use(errors)
app.use(
  jwt({
    secret: process.env.SECRET
  }).unless({
    path: [/^\/public/, '/']
  })
)

app.use(controllers.routes()).listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
