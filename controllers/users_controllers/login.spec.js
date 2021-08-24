import supertest from 'supertest'

import app from '../../app'
import { LOGIN } from '../../constants/endpoints'
import db from '../../lib/sequalize-config'

describe('Testing REGISTER USER Api', () => {
  beforeAll(() => {
    return db.sequelize.sync()
  })

  it('should log in a user', async () => {
    const user = {
      login: 'hurricane',
      password: 'hurricane'
    }

    const response = await supertest(app)
      .post('/public' + LOGIN)
      .send(user)

    expect(response.statusCode).toEqual(200)
    expect(response.text).toEqual(
      expect.objectContaining({
        tokens: {
          accessToken: expect.any(String),
          refreshToken: expect.any(String)
        },
        user: {
          id: expect.any(Number),
          login: expect.any(String),
          email: expect.any(String),
          role: expect.any(Number)
        }
      })
    )
  })

  afterAll(() => {
    return db.sequelize.close()
  })
})
