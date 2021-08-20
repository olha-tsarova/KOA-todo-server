'use strict'
import { Model } from 'sequelize'
export default (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Todo, {
        foreignKey: 'userId',
      })
      this.hasOne(models.Token, {
        as: 'token',
        foreignKey: 'userId',
        sourceKey: 'id'
      })
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      login: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
      // updatedAt: {
      //   type: DataTypes.STRING
      // }
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'User'
    }
  )
  return User
}
