import { appUpdated, todoDeleted } from "../../constants/socketEvents"

export const removeTask = async ctx => {
  try {
    const data = ctx.request.body
    const { user } = ctx.state
    await ctx.db.todos
      .findOne({ where: { id: data.id, userId: user.id } })
      .then(todo => {
        if (!todo) {
          return (ctx.body = 'Not Found')
        }
        ctx.body = todo
        todo.destroy()
        ctx.io.emit(appUpdated, {
          type: todoDeleted,
          userId: user.id,
          data: todo
        })
      })
  } catch (e) {
    ctx.status = 400
    ctx.body = e.message
  }
}
