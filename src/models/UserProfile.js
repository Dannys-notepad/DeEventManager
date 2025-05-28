const { Sequelize, DataTypes,  Model} = require('sequelize')
const sequelize = require('../config/sequelize.db')

class UserProfile extends Model {}

UserProfile.init(
  {
    userId: {
      type: DataTypes.UUID,
      references: {
        model: "Users",
        key: 'id'
      },
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      references: {
        model: "Users",
        key: 'username'
      },
      allowNull: true
    },
    firstName: {
      type: DataTypes.STRING,
      references: {
        model: "Users",
        key: 'firstName'
      },
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      references: {
        model: "Users",
        key: 'lastName'
      },
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      references: {
        model: "Users",
        key: 'email'
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
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.NOW,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'UserProfile',
    tableName: 'UserProfile'
  }
)

UserProfile.associate = (models) => {
    UserProfile.belongsTo(models.Users, { foreignKey: 'userId' });
  return UserProfile;
};

module.exports = UserProfile