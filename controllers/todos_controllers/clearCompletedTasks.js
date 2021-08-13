export const clearCompletedTasks = async ctx => {
  try {
    const result = {}
    const { user } = ctx.state

    await ctx.db.todos.destroy({
      where: { completed: true, userId: user.id }
    })

    result.list = await ctx.db.todos.findAll({ where: { userId: user.id } })

    ctx.io.emit('task:clear-completed', { list: result.list })
    ctx.body = result
  } catch (e) {
    ctx.status = 400
    ctx.body = e.message
  }
}
