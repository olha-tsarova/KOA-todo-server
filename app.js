import {} from 'dotenv/config'

import Koa from 'koa'
// import cors from 'koa-cors'
import cors from '@koa/cors'

import { port } from './lib/config'
import mongooseConfig from './lib/mongoose-config'
import bodyParser from './handlers/body-parser'
import errors from './handlers/errors'
import controllers from './controllers'

const app = new Koa()

mongooseConfig()

app.use(cors())
app.use(bodyParser)
app.use(errors)

app.use(controllers.routes()).listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
