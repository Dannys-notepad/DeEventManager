const { Sequelize, DataTypes,  Model} = require('sequelize')
const sequelize = require('../database/sequelize')

class Users extends Model {}

Users.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
  },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'Users'
  }
)

module.exports = Users