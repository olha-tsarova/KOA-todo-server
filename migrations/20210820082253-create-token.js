'use strict'
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Token', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    token: {
      type: Sequelize.STRING,
      allowNull: false
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
      type: Sequelize.STRING
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.STRING
    }
  })
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('Token')
}
