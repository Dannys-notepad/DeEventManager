const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize.db');

class Users extends Model {}

Users.init(
  {
    id: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
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
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [8, 128]
      }
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    accountStatus: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      defaultValue: 'inactive'
    },
    accountType: {
      type: DataTypes.ENUM('organizer', 'attendee', 'admin'),
      defaultValue: 'organizer'
    },
    organization: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW 
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
  },
  {
    sequelize,
    modelName: 'User', 
    tableName: 'users', 
    timestamps: true, 
    paranoid: true, 
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    indexes: [
      { unique: true, fields: ['email'] },
      { fields: ['googleId'] },
      { fields: ['accountStatus'] }
    ]
  }
);

Users.prototype.toJSON = ()=>{
  const values = Object.assign({}, this.get());
  delete values.passwordHash;
  delete values.passwordResetToken;
  delete values.passwordResetExpires;
  return values;
};

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
    foreignKey: 'userId', 
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