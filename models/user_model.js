export default (DataTypes, sequalize) => {
  const User = sequalize.define(
    'User',
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
      }
    },
    { tableName: 'User' }
  )

  // User.associate = model => {
  //   User.hasMany(model.Todo, {
  //     onDelete: 'cascade'
  //   })
  // }

  return User
}
