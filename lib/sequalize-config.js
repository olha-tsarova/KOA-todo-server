import { Sequelize, DataTypes } from 'sequelize'
// import todosModel from '../models/todo_model'
// import tokenModel from '../models/token_model'
// import usersModel from '../models/user_model'
import user from '../models/user'
import todo from '../models/todo'
import token from '../models/token'
import {
  dataBase,
  dialect,
  host,
  login,
  password,
  testDataBase
} from './config'

let sequalize

if (process.env.NODE_ENV === 'test') {
  sequalize = new Sequelize(testDataBase, login, password, {
    dialect: dialect,
    host: host
  })
} else {
  sequalize = new Sequelize(dataBase, login, password, {
    dialect: dialect,
    host: host
  })
}

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequalize

db.users = user(sequalize, DataTypes)
db.todos = todo(sequalize, DataTypes)
db.tokens = token(sequalize, DataTypes)

db.sequelize.sync().then(() => {
  console.log('Connected to MariaDB')
})

export default db
