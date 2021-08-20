'use strict'
import { Model } from 'sequelize'
export default (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      })
    }
  }
  Todo.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        }
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
      // createdAt: {
      //   type: DataTypes.STRING,
      //   defaultValue: new Date().toISOString()
      // }
    },
    {
      sequelize,
      modelName: 'Todo',
      tableName: 'Todo'
    }
  )
  return Todo
}
