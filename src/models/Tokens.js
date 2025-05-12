const { Sequelize, DataTypes,  Model} = require('sequelize')
const sequelize = require('../database/sequelize')

class Tokens extends Model {}

Tokens.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      validate: {
        isUUID: 4,
      },
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.NOW,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Token',
    tableName: 'Tokens'
  }
)

module.exports = Tokens