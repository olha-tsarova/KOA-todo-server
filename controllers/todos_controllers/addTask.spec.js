import supertest from 'supertest'
import jwt from 'jsonwebtoken'
import app from '../../app'
import { ADD_TASK } from '../../constants/endpoints'
import db from '../../lib/sequalize-config'

describe('Testing ADD TODO Api', () => {
  beforeAll(() => {
    return db.sequelize.sync()
  })

  const userToken = jwt.sign({ id: 1, status: 1 }, process.env.SECRET)

  it('should add a new task', async () => {
    const response = await supertest(app)
      .post(ADD_TASK)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'test',
        completed: true
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
