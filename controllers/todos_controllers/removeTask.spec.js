import supertest from 'supertest'

import app from '../../app'
import { DELETE_TASK } from '../../constants/endpoints'
import db from '../../lib/sequalize-config'
import jwtSign from '../../helpers/jwtSign'

describe('Testing DELETE TODOS Api', () => {
  beforeAll(() => {
    return db.sequelize.sync()
  })

  it("should delete user's task", async () => {
    const users = await db.users.findAll()
    const user = users[2]
    const userToken = jwtSign(user)
    const tasks = await db.todos.findAll({ where: { userId: user.id } })
    const task = tasks[0].dataValues

    const response = await supertest(app)
      .delete(DELETE_TASK)
      .set('Authorization', `Bearer ${userToken}`)
      .send(task)

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        title: task.title,
        completed: task.completed,
        id: task.id,
        userId: user.id
      })
    )
  })

  it("shouldn't delete user's task", async () => {
    const users = await db.users.findAll()
    const user = users[2]
    const userToken = jwtSign(user)
    const tasks = await db.todos.findAll({ where: { userId: user.id } })
    const task = tasks[0].dataValues

    task.id = 3

    const response = await supertest(app)
      .delete(DELETE_TASK)
      .set('Authorization', `Bearer ${userToken}`)
      .send(task)

    expect(response.statusCode).toEqual(400)
    expect(response.text).toBe('Not Found')
  })

  it("shouldn't delete user's task because id is not defined", async () => {
    const users = await db.users.findAll()
    const user = users[2]
    const userToken = jwtSign(user)
    const tasks = await db.todos.findAll({ where: { userId: user.id } })
    const task = tasks[0].dataValues
    const editedTask = {
      title: task.title
    }

    const response = await supertest(app)
      .delete(DELETE_TASK)
      .set('Authorization', `Bearer ${userToken}`)
      .send(editedTask)

    expect(response.statusCode).toEqual(400)
    expect(response.text).toBe('Wrong data')
  })

  it('should return an authentication error', async () => {
    const users = await db.users.findAll()
    const userToken = jwtSign(users[2])

    const response = await supertest(app)
      .delete(DELETE_TASK)
      .set('Authorization', `Bearer 325${userToken}`)

    expect(response.statusCode).toEqual(401)
    expect(response.body).toEqual(
      expect.objectContaining({
        error: 'Authentication Error'
      })
    )
  })

  afterAll(() => {
    return db.sequelize.close()
  })
})
