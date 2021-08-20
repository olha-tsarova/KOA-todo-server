import config from '../../config/config.json'
const env = process.env.NODE_ENV || 'development'

export default {
  [env]: {
    dialect: config[env]['dialect'],
    username: config[env]['username'],
    password: config[env]['password'],
    host: config[env]['host'],
    migrationStorageTableName: 'SequelizeMeta'
  }
}
