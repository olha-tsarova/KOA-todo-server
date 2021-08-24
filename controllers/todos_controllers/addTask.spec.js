import supertest from 'supertest'

import app from '../../app'
import { ADD_TASK } from '../../constants/endpoints'
import db from '../../lib/sequalize-config'
import jwtSign from '../../helpers/jwtSign'

describe('Testing ADD TODO Api', () => {
  beforeAll(() => {
    return db.sequelize.sync()
  })

  const testTask = {
    title: 'test',
    completed: true
  }

  const testTaskWithWrongUserId = {
    title: 'test',
    completed: true,
    userId: 4
  }

  const testTaskWithoutTitle = {
    title: '    ',
    completed: true
  }

  const testTaskLong = {
    title:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
    completed: true
  }

  it('should add a new task', async () => {
    const users = await db.users.findAll()
    const userToken = jwtSign(users[0])

    const response = await supertest(app)
      .post(ADD_TASK)
      .set('Authorization', `Bearer ${userToken}`)
      .send(testTask)

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        title: testTask.title,
        completed: testTask.completed,
        userId: expect.any(Number),
        id: expect.any(Number)
      })
    )
  })

  it('should add a new task for user who creates it', async () => {
    const users = await db.users.findAll()
    const user = users[0]
    const userToken = jwtSign(user)

    const response = await supertest(app)
      .post(ADD_TASK)
      .set('Authorization', `Bearer ${userToken}`)
      .send(testTaskWithWrongUserId)

    expect(response.statusCode).toEqual(200)
    expect(response.body.userId).toEqual(user.id)
  })

  it("shouldn't add a new task because title is empty", async () => {
    const users = await db.users.findAll()
    const userToken = jwtSign(users[0])

    const response = await supertest(app)
      .post(ADD_TASK)
      .set('Authorization', `Bearer ${userToken}`)
      .send(testTaskWithoutTitle)

    expect(response.statusCode).toEqual(400)
    expect(response.text).toBe('Title is empty!')
  })

  it("shouldn't add a new task because it's too long", async () => {
    const users = await db.users.findAll()
    const userToken = jwtSign(users[0])

    const response = await supertest(app)
      .post(ADD_TASK)
      .set('Authorization', `Bearer ${userToken}`)
      .send(testTaskLong)

    expect(response.statusCode).toEqual(400)
    expect(response.text).toBe(
      'Title is too long. Maximum 160 characters allowed'
    )
  })

  it('should return an authentication error', async () => {
    const users = await db.users.findAll()
    const userToken = jwtSign(users[0])

    const response = await supertest(app)
      .post(ADD_TASK)
      .set('Authorization', `Bearer 325${userToken}`)
      .send(testTask)

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
