export const toggleTodosStatuses = async ctx => {
  try {
    const data = ctx.request.body
    const { user } = ctx.state

    await ctx.db.todos.update(
      {
        completed: data.status
      },
      { where: { userId: user.id } }
    )

    ctx.body = await ctx.db.todos.findAll({ where: { userId: user.id } })
  } catch (e) {
    ctx.status = 401
    ctx.body = e.message
  }
}
