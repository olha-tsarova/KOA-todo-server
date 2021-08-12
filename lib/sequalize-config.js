import { Sequelize, DataTypes } from 'sequelize'
import todosModel from '../models/todo_model'
import tokenModel from '../models/token_model'
import usersModel from '../models/user_model'
import { dataBase, dialect, host, login, password } from './config'

const sequalize = new Sequelize(dataBase, login, password, {
  dialect: dialect,
  host: host
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequalize

db.users = usersModel(DataTypes, sequalize)
db.todos = todosModel(DataTypes, sequalize)
db.tokens = tokenModel(DataTypes, sequalize)

export default db
