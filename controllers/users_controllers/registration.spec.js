import supertest from 'supertest'

import app from '../../app'
import { ADD_USER } from '../../constants/endpoints'
import db from '../../lib/sequalize-config'

describe('Testing REGISTER USER Api', () => {
  beforeAll(() => {
    return db.sequelize.sync()
  })

  it('should add a new user', async () => {
    const newUser = {
      login: 'hurricane',
      name: 'hurricane',
      email: 'hurricane@test.test',
      password: 'hurricane'
    }

    const response = await supertest(app)
      .post('/public' + ADD_USER)
      .send(newUser)

    expect(response.statusCode).toEqual(200)
    expect(response.text).toEqual(
      expect.stringContaining('User was created successfully!')
    )
  })

  it("shouldn't add a new user because this email already exists", async () => {
    const newUser = {
      login: 'another login',
      name: 'hurricane',
      email: 'hurricane@test.test',
      password: 'hurricane'
    }

    const response = await supertest(app)
      .post('/public' + ADD_USER)
      .send(newUser)

    expect(response.statusCode).toEqual(400)
    expect(response.text).toEqual(
      expect.stringContaining('Validation error')
    )
  })

  it("shouldn't add a new user because this login already exists", async () => {
    const newUser = {
      login: 'Dude',
      name: 'hurricane',
      email: 'ddddddd@test.test',
      password: 'hurricane'
    }

    const response = await supertest(app)
      .post('/public' + ADD_USER)
      .send(newUser)

    expect(response.statusCode).toEqual(400)
    expect(response.text).toEqual(
      expect.stringContaining(`User ${newUser.login} already exists!`)
    )
  })

  it("shouldn't add a new user because it needs full user data", async () => {
    const newUser = {
      login: 'LOGIN',
      email: 'dfsvgh@test.test',
      password: 'hurricane'
    }

    const response = await supertest(app)
      .post('/public' + ADD_USER)
      .send(newUser)

    expect(response.statusCode).toEqual(400)
    expect(response.text).toEqual(expect.stringContaining('Wrong data'))
  })

  afterAll(() => {
    return db.sequelize.close()
  })
})
