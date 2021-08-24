import { appUpdated, todoDeleted } from '../../constants/socketEvents'

export const removeTask = async ctx => {
  try {
    const data = ctx.request.body
    const { user } = ctx.state
    if (!data.id) {
      throw new Error('Wrong data')
    }

    await ctx.db.todos
      .findOne({ where: { id: data.id, userId: user.id } })
      .then(todo => {
        if (!todo) {
          throw new Error('Not Found')
        }
        ctx.body = todo
        todo.destroy()
        if (ctx.io) {
          ctx.io.emit(appUpdated, {
            type: todoDeleted,
            userId: user.id,
            data: todo
          })
        }
      })
  } catch (e) {
    ctx.status = 400
    ctx.body = e.message
  }
}
