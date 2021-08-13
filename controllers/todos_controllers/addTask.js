export const addTask = async ctx => {
  try {
    const { request } = ctx
    const { title, completed, key } = request.body
    const { user } = ctx.state

    if (!title.trim()) {
      throw new Error('Title is empty!')
    }

    if (title.trim().length > 160) {
      throw new Error('Title is too long. Maximum 160 characters allowed')
    }

    const newTodo = {
      title,
      completed,
      key,
      userId: user.id
    }

    ctx.io.emit('task:add', newTodo)

    await ctx.db.todos.create(newTodo)
    ctx.body = newTodo
  } catch (e) {
    ctx.status = 400
    ctx.body = e.message
  }
}
