export const removeTask = async ctx => {
  try {
    const data = ctx.request.body
    const { user } = ctx.state
    await ctx.db.todos
      .findOne({ where: { key: data.key, userId: user.id } })
      .then(todo => {
        if (!todo) {
          return (ctx.body = 'Not Found')
        }
        ctx.body = todo
        todo.destroy()
      })
  } catch (e) {
    ctx.status = 400
    ctx.body = e.message
  }
}
