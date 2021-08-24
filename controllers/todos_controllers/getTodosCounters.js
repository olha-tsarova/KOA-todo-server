import { appUpdated, todoGetCounters } from '../../constants/socketEvents'

export const getTodosCounters = async ctx => {
  try {
    const result = {}
    const { user } = ctx.state

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
    // ctx.body = JSON.stringify(result)
    ctx.body = result
    if (ctx.io) {
      ctx.io.emit(appUpdated, {
        type: todoGetCounters,
        userId: user.id,
        data: {
          active: result.active,
          completed: result.completed
        }
      })
    }
  } catch (e) {
    ctx.status = 400
    ctx.body = e.message
  }
}
