import supertest from 'supertest'

import app from '../../app'
import { GET_COUNTERS } from '../../constants/endpoints'
import db from '../../lib/sequalize-config'
import jwtSign from '../../helpers/jwtSign'

describe('Testing GET TODOS COUNTERS Api', () => {
  beforeAll(() => {
    return db.sequelize.sync()
  })

  it('should return counter of active & completed tasks', async () => {
    const users = await db.users.findAll()
    const user = users[0]
    const userToken = jwtSign(user)

    const response = await supertest(app)
      .get(GET_COUNTERS)
      .set('Authorization', `Bearer ${userToken}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        completed: expect.any(Number),
        active: expect.any(Number)
      })
    )
  })

  it('should return an authentication error', async () => {
    const users = await db.users.findAll()
    const userToken = jwtSign(users[0])

    const response = await supertest(app)
      .get(GET_COUNTERS)
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
