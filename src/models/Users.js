const { Sequelize, DataTypes,  Model} = require('sequelize')
const sequelize = require('../database/sequelize')

class Users extends Model {}

Users.init(
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
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
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
      allowNull: true
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'null'
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    accountStatus: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'inactive'
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
    modelName: 'Users',
    tableName: 'Users'
  }
)

Users.associate = (models) => {
    Users.hasMany(models.blackListedTokens, { foreignKey: 'userId' });
  return Users;
};

module.exports = Users