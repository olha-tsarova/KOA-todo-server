export default (DataTypes, sequalize) => {
  const Token = sequalize.define(
    'Token',
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
      token: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    { tableName: 'Token' }
  )

  return Token
}
