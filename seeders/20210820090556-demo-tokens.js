'use strict'
import { v4 as uuid } from 'uuid'

export async function up(queryInterface, Sequelize) {
  const users = await queryInterface.sequelize.query(`SELECT id from User;`)
  const user = users[0]
  await queryInterface.bulkInsert(
    'Token',
    [
      {
        token: uuid(),
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: user[0].id,
      },
      {
        token: uuid(),
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: user[1].id,
      },
      {
        token: uuid(),
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: user[2].id,
      }
    ],
    {}
  )
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('Token', null, {})
}
