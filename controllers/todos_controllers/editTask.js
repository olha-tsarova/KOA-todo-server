export const editTask = async ctx => {
  try {
    const data = ctx.request.body
    const { user } = ctx.state

    await ctx.db.todos
      .findOne({ where: { key: data.key, userId: user.id } })
      .then(todo => {
        if (!todo) {
          throw new Error('Not Found')
        }
        todo.update({
          title: data.title,
          completed: !data.completed
        })

        ctx.body = todo
        ctx.io.emit('task:edit', { todo })
      })
  } catch (e) {
    ctx.status = 400
    ctx.body = e.message
  }
}
