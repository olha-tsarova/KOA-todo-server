import Router from 'koa-router'
import todosRouter from './todos'

const router = new Router()
router.use(todosRouter)

export default router
