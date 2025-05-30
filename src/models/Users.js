const { Sequelize, DataTypes,  Model} = require('sequelize')
const sequelize = require('../config/sequelize.db')

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
    username: {
      type: DataTypes.STRING,
      allowNull: true
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
    authProvider: {
      type: DataTypes.ENUM('local', 'google'),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true
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
    Users.hasMany(models.blackListedTokens, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
     });
  return Users;
};

Users.associate = (models) => {
  Users.hasOne(models.UserProfile, {
    foreignKey: 'userId',
    as: 'profile'
  });
};


module.exports = Users