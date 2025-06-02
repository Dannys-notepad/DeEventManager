const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize.db');

class UserProfile extends Model {}

UserProfile.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: 'Users',
        key: 'id'
      },
      allowNull: false
    },
    profilePicUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bio: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tellphoneNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    socialLinks: {
      type: DataTypes.STRING,
      allowNull: true
    },
    profileIsComplete: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
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
    }
  },
  {
    sequelize,
    modelName: 'UserProfile',
    tableName: 'UserProfile'
  }
);

// Association
UserProfile.associate = (models) => {
  UserProfile.belongsTo(models.Users, {
    foreignKey: 'id'});
  return UserProfile
};

module.exports = UserProfile;
