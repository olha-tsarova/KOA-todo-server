'use strict'

export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert(
    'User',
    [
      {
        name: 'John Doe',
        login: 'John',
        email: 'JohnDoe@test.test',
        password: 'John',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Palette',
        login: 'Palette',
        email: 'Palette@test.test',
        password: 'Palette',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'The Dude',
        login: 'Dude',
        email: 'mrLebowski@test.test',
        password: 'Dude',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    {}
  )
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('User', null, {})
}
