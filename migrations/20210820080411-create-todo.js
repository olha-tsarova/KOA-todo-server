'use strict'
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Todo', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    completed: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    userId: {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'User',
        key: 'id',
        as: 'userId'
      }
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.STRING,
      defaultValue: new Date()
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.STRING,
      defaultValue: new Date()
    }
  })
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('Todo')
}
