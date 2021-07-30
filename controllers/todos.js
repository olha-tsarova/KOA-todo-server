import Router from 'koa-router'
import {
  ADD_TASK,
  CHANGE_TASKS_STATUSES,
  CLEAR_COMPLETED_TASKS,
  DELETE_TASK,
  EDIT_TASK,
  GET_COUNTERS,
  GET_TASKS
} from '../constants/endpoints'
import { active, completed } from '../constants/filters'

import Todo from '../models/todo'

const todosRouter = new Router().prefix('/')

todosRouter.get(GET_TASKS, async ctx => {
  const { query } = ctx
  console.log(query)

  let params = {}
  const result = {}

  if (query.filter === completed) {
    params = { completed: true }
  }

  if (query.filter === active) {
    params = { completed: false }
  }

  try {
    await Todo.countDocuments({ completed: true }).then(countCompleted => {
      result.completed = countCompleted
    })

    await Todo.countDocuments({ completed: false }).then(countActive => {
      result.active = countActive
    })

    await Todo.find(params).then(todos => {
      result.list = todos
    })
  } catch (e) {
    console.error(e)
  } finally {
    ctx.body = result
  }
})

todosRouter.get(GET_COUNTERS, async ctx => {
  const result = {}

  try {
    await Todo.countDocuments({ completed: true }).then(countCompleted => {
      result.completed = countCompleted
    })

    await Todo.countDocuments({ completed: false }).then(countActive => {
      result.active = countActive
    })
  } catch (e) {
    console.error(e)
  } finally {
    ctx.body = result
  }
})

todosRouter.post(ADD_TASK, async ctx => {
  const { request } = ctx
  const newTodo = new Todo(request.body)
  console.log(newTodo)

  try {
    await newTodo.save(newTodo)
  } catch (e) {
    console.error(e)
  } finally {
    ctx.body = newTodo
  }
})

todosRouter.delete(DELETE_TASK, async ctx => {
  console.log(ctx.request.body)
  const data = ctx.request.body
  let deletedTask

  try {
    deletedTask = await Todo.findOneAndRemove({ key: data.key })
  } catch (e) {
    console.error(e)
  } finally {
    ctx.body = deletedTask
  }
})

todosRouter.delete(CLEAR_COMPLETED_TASKS, async ctx => {
  const result = {}

  try {
    await Todo.deleteMany({ completed: true })
    result.list = await Todo.find({})
  } catch (e) {
    console.error(e)
  } finally {
    ctx.body = result
  }
})

todosRouter.put(EDIT_TASK, async ctx => {
  console.log(ctx.request)
  const { request } = ctx
  let result = {}

  try {
    result = await Todo.findOneAndUpdate(
      { key: request.body.key },
      { completed: !request.body.completed },
      { new: true }
    )
  } catch (e) {
    console.error(e)
  } finally {
    ctx.body = result
  }
})

todosRouter.put(CHANGE_TASKS_STATUSES, async ctx => {
  const data = ctx.request.body

  try {
    await Todo.updateMany({}, { completed: data.status })
  } catch (e) {
    console.error(e)
  } finally {
    ctx.body = await Todo.find({})
  }
})

export default todosRouter.routes()
