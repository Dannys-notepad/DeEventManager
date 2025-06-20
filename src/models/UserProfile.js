const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize.db');

class UserProfile extends Model {}

UserProfile.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'users',  // Lowercase reference
        key: 'id'
      }
    },
    profilePicUrl: {
      type: DataTypes.STRING(512),  // Added length
      allowNull: true
    },
    bio: {
      type: DataTypes.TEXT,  // Changed to TEXT for longer content
      allowNull: true
    },
    phoneNumber: {  // Corrected typo: tellphoneNumber → phoneNumber
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/  // Basic phone validation
      }
    },
    socialLinks: {
      type: DataTypes.JSON,  // Better for structured data
      allowNull: true,
      defaultValue: {}
    },
    profileIsComplete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,  // Changed to not null
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
    tableName: 'user_profiles',  // Snake_case
    timestamps: true,
    indexes: [
      { fields: ['phoneNumber'], unique: true }  // Phone number uniqueness
    ]
  }
);

// Association
UserProfile.associate = function(models) {
  UserProfile.belongsTo(models.User, {
    foreignKey: 'id',
    as: 'user',
    onDelete: 'CASCADE'  // Cascade delete
  });
};

module.exports = UserProfile;