import supertest from 'supertest'
import { v4 as uuid } from 'uuid'

import app from '../../app'
import { REFRESH_TOKEN } from '../../constants/endpoints'
import db from '../../lib/sequalize-config'

describe('Testing REFRESH USER TOKEN Api', () => {
  beforeAll(() => {
    return db.sequelize.sync()
  })

  it('should refresh token for a user', async () => {
    const users = await db.users.findAll()
    const user = users[0]
    const token = await db.tokens.findOne({ where: { userId: user.id } })

    const response = await supertest(app)
      .get('/public' + REFRESH_TOKEN + `?oldToken=${token.dataValues.token}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        tokens: {
          accessToken: expect.any(String),
          refreshToken: expect.any(String)
        },
        user: {
          id: expect.any(Number),
          role: expect.any(Number),
          status: expect.any(Number),
          name: expect.any(String),
          login: expect.any(String),
          email: expect.any(String),
          password: expect.any(String),
          updatedAt: expect.any(String),
          createdAt: expect.any(String)
        }
      })
    )
  })

  it('shouldn\'t refresh invalid token', async () => {
    const token = uuid()

    const response = await supertest(app)
      .get('/public' + REFRESH_TOKEN + `?oldToken=${token}`)

    expect(response.statusCode).toEqual(400)
    expect(response.text).toEqual(expect.stringContaining('Token is invalid'))
  })

  afterAll(() => {
    return db.sequelize.close()
  })
})
