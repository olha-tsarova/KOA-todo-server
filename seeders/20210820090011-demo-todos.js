'use strict'

export async function up(queryInterface, Sequelize) {
  const users = await queryInterface.sequelize.query(`SELECT id from User;`)
  const user = users[0]
  
  await queryInterface.bulkInsert(
    'Todo',
    [
      {
        title: 'test task',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: user[1].id
      },
      {
        title: 'task',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: user[1].id
      },
      {
        title: 'The TASK',
        completed: true,
        userId: user[1].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'do it',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: user[2].id
      },
      {
        title: 'faster',
        completed: true,
        userId: user[2].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'task, The',
        completed: false,
        userId: user[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'the task',
        completed: true,
        userId: user[0].id,
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
