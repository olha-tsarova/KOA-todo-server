'use strict'
import bcrypt from 'bcrypt'

const hash = async (pass) => await bcrypt.hash(pass, 2)

export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert(
    'User',
    [
      {
        name: 'John Doe',
        login: 'John',
        email: 'JohnDoe@test.test',
        status: 1,
        password: await hash('John'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Palette',
        login: 'Palette',
        email: 'Palette@test.test',
        status: 1,
        password: await hash('Palette'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'The Dude',
        login: 'Dude',
        email: 'mrLebowski@test.test',
        status: 0,
        password: await hash('Dude'),
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
