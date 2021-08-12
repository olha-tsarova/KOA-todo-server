import Router from 'koa-router'
import todosRouter from './todosRouter'
import usersRouter from './usersRouter'

const router = new Router()
router.use(todosRouter)
router.use(usersRouter)

export default router
