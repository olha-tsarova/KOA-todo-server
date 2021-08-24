import supertest from 'supertest'

import app from '../../app'
import { CLEAR_COMPLETED_TASKS } from '../../constants/endpoints'
import db from '../../lib/sequalize-config'
import jwtSign from '../../helpers/jwtSign'

describe('Testing CLEAR COMPLETED TODOS Api', () => {
  beforeAll(() => {
    return db.sequelize.sync()
  })

  it('should clear all completed tasks', async () => {
    const users = await db.users.findAll()
    const user = users[1]
    const userToken = jwtSign(user)

    const response = await supertest(app)
      .delete(CLEAR_COMPLETED_TASKS)
      .set('Authorization', `Bearer ${userToken}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.list).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          completed: false,
        })
      ])
    )
    expect(response.body.list.length).toBe(1)
  })

  it('should return an authentication error', async () => {
    const users = await db.users.findAll()
    const userToken = jwtSign(users[1])

    const response = await supertest(app)
      .delete(CLEAR_COMPLETED_TASKS)
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
