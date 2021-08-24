import supertest from 'supertest'

import app from '../../app'
import { CHANGE_TASKS_STATUSES } from '../../constants/endpoints'
import db from '../../lib/sequalize-config'
import jwtSign from '../../helpers/jwtSign'

describe('Testing TOGGLE TODOS STATUSES Api', () => {
  beforeAll(() => {
    return db.sequelize.sync()
  })

  it("should toggle all user's todos statuses", async () => {
    const users = await db.users.findAll()
    const user = users[2]
    const userToken = jwtSign(user)

    const response = await supertest(app)
      .put(CHANGE_TASKS_STATUSES)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        status: true
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: expect.any(String),
          completed: true,
          id: expect.any(Number),
          userId: user.id
        })
      ])
    )
  })

  it("shouldn't toggle user's todos statuses because status doesn't set", async () => {
    const users = await db.users.findAll()
    const user = users[2]
    const userToken = jwtSign(user)

    const response = await supertest(app)
      .put(CHANGE_TASKS_STATUSES)
      .set('Authorization', `Bearer ${userToken}`)
      .send({})

    expect(response.statusCode).toEqual(400)
    expect(response.text).toBe('Wrong data')
  })

  it("shouldn't toggle user's todos statuses because type of status is not boolean", async () => {
    const users = await db.users.findAll()
    const user = users[2]
    const userToken = jwtSign(user)

    const response = await supertest(app)
      .put(CHANGE_TASKS_STATUSES)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        status: 3
      })

    expect(response.statusCode).toEqual(400)
    expect(response.text).toBe('Wrong data')
  })

  it('should return an authentication error', async () => {
    const users = await db.users.findAll()
    const userToken = jwtSign(users[2])

    const response = await supertest(app)
      .put(CHANGE_TASKS_STATUSES)
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
