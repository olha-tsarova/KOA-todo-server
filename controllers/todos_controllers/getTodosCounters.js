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
    ctx.body = result
    ctx.io.emit('task:get-counters', {
      active: result.active,
      completed: result.completed
    })
  } catch (e) {
    ctx.status = 401
    ctx.body = e.message
  }
}
