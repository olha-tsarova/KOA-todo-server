import supertest from 'supertest'

import app from '../../app'
import { LOGIN } from '../../constants/endpoints'
import db from '../../lib/sequalize-config'

describe('Testing LOGIN USER Api', () => {
  beforeAll(() => {
    return db.sequelize.sync()
  })

  it('should log in a user', async () => {
    const user = {
      login: 'Palette',
      password: 'Palette'
    }

    const response = await supertest(app)
      .post('/public' + LOGIN)
      .send(user)

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(
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

  it("shouldn't log in a blocked user", async () => {
    const user = {
      login: 'Dude',
      password: 'Dude'
    }

    const response = await supertest(app)
      .post('/public' + LOGIN)
      .send(user)

    expect(response.statusCode).toEqual(400)
    expect(response.text).toEqual(
      expect.stringContaining(`User ${user.login} is blocked`)
    )
  })

  it("shouldn't log in user with wrong password", async () => {
    const user = {
      login: 'Palette',
      password: 'Dude'
    }

    const response = await supertest(app)
      .post('/public' + LOGIN)
      .send(user)

    expect(response.statusCode).toEqual(400)
    expect(response.text).toEqual(
      expect.stringContaining('Wrong login or password')
    )
  })

  it("shouldn't log in user which didn't registered", async () => {
    const user = {
      login: 'Bagrov',
      password: 'Bagrov'
    }

    const response = await supertest(app)
      .post('/public' + LOGIN)
      .send(user)

    expect(response.statusCode).toEqual(400)
    expect(response.text).toEqual(
      expect.stringContaining(`User ${user.login} not found!`)
    )
  })

  afterAll(() => {
    return db.sequelize.close()
  })
})
