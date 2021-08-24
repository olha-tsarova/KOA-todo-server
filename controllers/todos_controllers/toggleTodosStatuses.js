import { appUpdated, todoToggled } from '../../constants/socketEvents'

export const toggleTodosStatuses = async ctx => {
  try {
    const data = ctx.request.body
    const { user } = ctx.state

    if (data.status === undefined || typeof(data.status) !== 'boolean') {
      throw new Error('Wrong data')
    }

    await ctx.db.todos.update(
      {
        completed: data.status
      },
      { where: { userId: user.id } }
    )

    const todos = await ctx.db.todos.findAll({ where: { userId: user.id } })
    ctx.body = todos
    if (ctx.io) {
      ctx.io.emit(appUpdated, {
        type: todoToggled,
        userId: user.id,
        data: todos
      })
    }
  } catch (e) {
    ctx.status = 400
    ctx.body = e.message
  }
}
