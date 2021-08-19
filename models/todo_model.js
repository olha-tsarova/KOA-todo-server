export default (DataTypes, sequalize) => {
  const Todo = sequalize.define(
    'Todo',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        }
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        type: DataTypes.STRING,
        defaultValue: new Date().toISOString()
      }
    },
    { tableName: 'Todo' }
  )

  return Todo
}
