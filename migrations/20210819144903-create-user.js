'use strict'
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('User', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    login: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    role: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    },
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    },
    createdAt: {
      type: Sequelize.STRING
    },
    updatedAt: {
      type: Sequelize.STRING
    }
  })
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('User')
}
