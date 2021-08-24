import supertest from 'supertest'

import app from '../../app'
import { EDIT_TASK } from '../../constants/endpoints'
import db from '../../lib/sequalize-config'
import jwtSign from '../../helpers/jwtSign'

describe('Testing EDIT TODO Api', () => {
  beforeAll(() => {
    return db.sequelize.sync()
  })

  it('should change status for the task', async () => {
    const users = await db.users.findAll()
    const user = users[0]
    const userToken = jwtSign(user)

    const tasks = await db.todos.findAll({ where: { userId: user.id } })
    const task = tasks[0].dataValues

    const editedTask = {
      title: task.title,
      userId: task.userId,
      completed: !task.completed
    }

    const response = await supertest(app)
      .put(EDIT_TASK)
      .set('Authorization', `Bearer ${userToken}`)
      .send(task)

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(expect.objectContaining(editedTask))
  })

  it('should change status and title for the task', async () => {
    const users = await db.users.findAll()
    const user = users[0]
    const userToken = jwtSign(user)

    const tasks = await db.todos.findAll({ where: { userId: user.id } })
    const task = tasks[0].dataValues
    const str = 'sdfhb'

    const editedTask = {
      title: task.title + str,
      userId: task.userId,
      completed: !task.completed
    }

    const response = await supertest(app)
      .put(EDIT_TASK)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ ...task, title: task.title + str })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(expect.objectContaining(editedTask))
  })

  it("shouldn't change status nor title but throw an error", async () => {
    const users = await db.users.findAll()
    const user = users[0]
    const userToken = jwtSign(user)

    const tasks = await db.todos.findAll({ where: { userId: user.id } })
    const task = tasks[0].dataValues

    const response = await supertest(app)
      .put(EDIT_TASK)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ ...task, id: 2 })

    expect(response.statusCode).toEqual(400)
    expect(response.text).toBe('Not Found')
  })

  it("shouldn't change status nor title but throw an error", async () => {
    const users = await db.users.findAll()
    const user = users[0]
    const userToken = jwtSign(user)

    const tasks = await db.todos.findAll({ where: { userId: user.id } })
    const task = tasks[0].dataValues
    const editedTask = {
      completed: task.completed,
      id: task.id,
      userId: task.userId
    }

    const response = await supertest(app)
      .put(EDIT_TASK)
      .set('Authorization', `Bearer ${userToken}`)
      .send(editedTask)

    expect(response.statusCode).toEqual(400)
    expect(response.text).toBe('Wrong data')
  })

  it("shouldn't change status nor title but throw an error", async () => {
    const users = await db.users.findAll()
    const user = users[0]
    const userToken = jwtSign(user)

    const tasks = await db.todos.findAll({ where: { userId: user.id } })
    const task = tasks[0].dataValues
    const editedTask = {
      title: task.title,
      id: task.id,
      userId: task.userId
    }

    const response = await supertest(app)
      .put(EDIT_TASK)
      .set('Authorization', `Bearer ${userToken}`)
      .send(editedTask)

    expect(response.statusCode).toEqual(400)
    expect(response.text).toBe('Wrong data')
  })

  it("shouldn't change status nor title but throw an error", async () => {
    const users = await db.users.findAll()
    const user = users[0]
    const userToken = jwtSign(user)

    const tasks = await db.todos.findAll({ where: { userId: user.id } })
    const task = tasks[0].dataValues
    const editedTask = {
      title: task.title,
      completed: task.completed,
      userId: task.userId
    }

    const response = await supertest(app)
      .put(EDIT_TASK)
      .set('Authorization', `Bearer ${userToken}`)
      .send(editedTask)

    expect(response.statusCode).toEqual(400)
    expect(response.text).toBe('Wrong data')
  })

  it('should return an authentication error', async () => {
    const users = await db.users.findAll()
    const userToken = jwtSign(users[0])

    const response = await supertest(app)
      .put(EDIT_TASK)
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
