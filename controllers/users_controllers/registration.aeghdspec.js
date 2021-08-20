import supertest from 'supertest'
import boot from '../../app'
import { ADD_USER } from '../../constants/endpoints'
import db from '../../lib/sequalize-config'

describe('Post Endpoints', () => {
  beforeAll(() => {
    return db.sequelize.sync()
  })

  it('should register a new user', async () => {
    const response = await supertest(boot)
      .post(ADD_USER)
      .send({
        user: {
          login: 'test',
          name: 'test',
          email: 'test@test.test',
          password: 'test'
        }
      })

    console.log('response + ', response)
    expect(response.statusCode).toEqual(201)
    // expect(response.body).toBe(JSON.stringify('User was created successfully!'))
    // done()
  })

  afterAll(() => {
    return db.sequelize.close()
  })
})
