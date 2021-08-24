import supertest from 'supertest'

import app from '../../app'
import { GET_TASKS } from '../../constants/endpoints'
import db from '../../lib/sequalize-config'
import jwtSign from '../../helpers/jwtSign'

describe('Testing GET TODOS Api', () => {
  beforeAll(() => {
    return db.sequelize.sync()
  })

  it('should return all the tasks', async () => {
    const users = await db.users.findAll()
    const user = users[0]
    const userToken = jwtSign(user)

    const response = await supertest(app)
      .get(GET_TASKS)
      .set('Authorization', `Bearer ${userToken}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.list).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: expect.any(String),
          completed: expect.any(Boolean),
          id: expect.any(Number),
          userId: expect.any(Number)
        })
      ])
    )
  })

  it('should return all active tasks', async () => {
    const users = await db.users.findAll()
    const user = users[0]
    const userToken = jwtSign(user)

    const response = await supertest(app)
      .get(GET_TASKS + '?filter=active')
      .set('Authorization', `Bearer ${userToken}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.list).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: expect.any(String),
          completed: false,
          id: expect.any(Number),
          userId: expect.any(Number)
        })
      ])
    )
  })

  it('should return all completed tasks', async () => {
    const users = await db.users.findAll()
    const user = users[0]
    const userToken = jwtSign(user)

    const response = await supertest(app)
      .get(GET_TASKS + '?filter=completed')
      .set('Authorization', `Bearer ${userToken}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.list).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: expect.any(String),
          completed: true,
          id: expect.any(Number),
          userId: expect.any(Number)
        })
      ])
    )
  })

  it('should return an authentication error', async () => {
    const users = await db.users.findAll()
    const userToken = jwtSign(users[0])

    const response = await supertest(app)
      .get(GET_TASKS)
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
