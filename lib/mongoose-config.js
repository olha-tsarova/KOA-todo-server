import { connect } from 'mongoose'

import { mongoUri } from './config'

export default () => {
  connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => console.log('MongoDB has been connected'))
    .catch(e => console.log(e))
}
