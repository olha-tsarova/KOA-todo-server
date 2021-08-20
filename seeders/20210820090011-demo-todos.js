'use strict'

export async function up(queryInterface, Sequelize) {
  const users = await queryInterface.sequelize.query(`SELECT id from User;`)
  const user = users[0]
  await queryInterface.bulkInsert(
    'Todo',
    [
      {
        title: 'John Doe',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: user[0].id
      },
      {
        title: 'The Dude',
        completed: false,
        userId: user[1].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    {}
  )
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('Todo', null, {})
}
