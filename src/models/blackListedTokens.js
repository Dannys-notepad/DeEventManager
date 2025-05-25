const { Sequelize, DataTypes,  Model} = require('sequelize')
const sequelize = require('../config/sequelize.db')

class blackListedTokens extends Model {}

blackListedTokens.init(
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
      type: DataTypes.UUID,
      references: {
        model: "Users",
        key: 'id'
      }
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
    modelName: 'blackListedTokens',
    tableName: 'blackListedTokens'
  }
)

blackListedTokens.associate = (models) => {
    blackListedTokens.belongsTo(models.Users, { foreignKey: 'userId' });
  return blackListedTokens;
};

module.exports = blackListedTokens