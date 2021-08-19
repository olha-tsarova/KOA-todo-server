import { appUpdated, todoEdited } from "../../constants/socketEvents"

export const editTask = async ctx => {
  try {
    const data = ctx.request.body
    const { user } = ctx.state

    await ctx.db.todos
      .findOne({ where: { id: data.id, userId: user.id } })
      .then(todo => {
        if (!todo) {
          throw new Error('Not Found')
        }
        todo.update({
          title: data.title,
          completed: !data.completed
        })

        ctx.body = todo
        ctx.io.emit(appUpdated, {
          type: todoEdited,
          userId: user.id,
          data: todo
        })
      })
  } catch (e) {
    ctx.status = 400
    ctx.body = e.message
  }
}
