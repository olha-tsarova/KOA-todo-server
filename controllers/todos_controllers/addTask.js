import { appUpdated, todoAdded } from '../../constants/socketEvents'

export const addTask = async ctx => {
  try {
    const { request } = ctx
    const { title, completed } = request.body
    const { user } = ctx.state

    console.log(title, completed)
    if (!title.trim()) {
      throw new Error('Title is empty!')
    }

    if (title.trim().length > 160) {
      throw new Error('Title is too long. Maximum 160 characters allowed')
    }

    if (!user.id) {
      throw new Error('No user ID!!!')
    }

    const newTodo = {
      title,
      completed,
      userId: user.id
    }

    const createdTask = await ctx.db.todos.create(newTodo)

    ctx.io.emit(appUpdated, {
      type: todoAdded,
      userId: user.id,
      data: createdTask
    })

    ctx.body = createdTask
  } catch (e) {
    ctx.status = 400
    ctx.body = e.message
  }
}
