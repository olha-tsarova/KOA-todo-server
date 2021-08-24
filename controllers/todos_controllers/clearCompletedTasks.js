import { appUpdated, todoClearCompleted } from "../../constants/socketEvents"

export const clearCompletedTasks = async ctx => {
  try {
    const result = {}
    const { user } = ctx.state

    await ctx.db.todos.destroy({
      where: { completed: true, userId: user.id }
    })

    result.list = await ctx.db.todos.findAll({ where: { userId: user.id } })

    if (ctx.io) {
      ctx.io.emit(appUpdated, {
        type: todoClearCompleted,
        userId: user.id,
        data: { list: result.list }
      })
    }
    ctx.body = result
  } catch (e) {
    ctx.status = 400
    ctx.body = e.message
  }
}
