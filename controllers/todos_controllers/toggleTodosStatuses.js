import { appUpdated, todoToggled } from "../../constants/socketEvents"

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

    const todos = await ctx.db.todos.findAll({ where: { userId: user.id } })
    ctx.body = todos
    ctx.io.emit(appUpdated, {
      type: todoToggled,
      userId: user.id,
      data: todos
    })
  } catch (e) {
    ctx.status = 401
    ctx.body = e.message
  }
}
