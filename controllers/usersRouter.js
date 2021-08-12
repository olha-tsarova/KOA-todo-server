import Router from 'koa-router'
import { ADD_USER, LOGIN, REFRESH_TOKEN } from '../constants/endpoints'
import { login } from './users_controllers/login'
import { registration } from './users_controllers/registration'
import { refreshToken } from './users_controllers/refreshToken'

const usersRouter = new Router().prefix('/public')

usersRouter.post(ADD_USER, registration)
usersRouter.post(LOGIN, login)
usersRouter.get(REFRESH_TOKEN, refreshToken)

export default usersRouter.routes()
