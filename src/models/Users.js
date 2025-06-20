const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize.db');

class Users extends Model {}

Users.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      // Removed validate - validations belong in controllers/services
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
      unique: true,
      validate: {
        isEmail: true
      }
    },
    authProvider: {
      type: DataTypes.ENUM('local', 'google'),
      allowNull: false,
      defaultValue: 'local'
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [8, 128] // Enforce password length if provided
      }
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
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      defaultValue: 'inactive'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW // Standard Sequelize timestamp
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW // Standard Sequelize timestamp
    }
  },
  {
    sequelize,
    modelName: 'User', // Changed to singular (best practice)
    tableName: 'users', // Changed to lowercase
    timestamps: true, // Enable automatic timestamp management
    paranoid: true, // Optional: enable soft deletes
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    indexes: [
      // Add indexes for better performance
      { unique: true, fields: ['email'] },
      { fields: ['googleId'] },
      { fields: ['accountStatus'] }
    ]
  }
);

// Consolidated associate function
Users.associate = function(models) {
  // Has many blacklisted tokens
  Users.hasMany(models.BlacklistedToken, {
    foreignKey: 'userId',
    as: 'blacklistedTokens',
    onDelete: 'CASCADE'
  });
  
  // Has one profile
  Users.hasOne(models.UserProfile, {
    foreignKey: 'userId', // Changed from 'id' to 'userId'
    as: 'profile',
    onDelete: 'CASCADE'
  });
  
  // Add relationship to Events
  Users.hasMany(models.Event, {
    foreignKey: 'userId',
    as: 'events',
    onDelete: 'CASCADE'
  });
};

module.exports = Users;