import { active, completed } from '../../constants/filters'

export const getAllTodos = async ctx => {
  try {
    const { query } = ctx

    const { user } = ctx.state
    const params = {
      where: {
        userId: user.id
      }
    }
    const result = {}

    if (query.filter === completed) {
      params.where = { ...params.where, completed: true }
    }

    if (query.filter === active) {
      params.where = { ...params.where, completed: false }
    }

    await ctx.db.todos
      .count({ where: { completed: true, userId: user.id } })
      .then(countCompleted => {
        result.completed = countCompleted
      })

    await ctx.db.todos
      .count({ where: { completed: false, userId: user.id } })
      .then(countActive => {
        result.active = countActive
      })

    await ctx.db.todos.findAll(params).then(todos => {
      result.list = todos
    })
    ctx.body = result
    ctx.io.emit('task:get', { list: result.list })
  } catch (e) {
    ctx.status = 400
    ctx.body = e.message
  }
}
