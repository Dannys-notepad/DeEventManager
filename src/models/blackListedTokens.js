const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize.db');

class BlacklistedToken extends Model {}

BlacklistedToken.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      // Removed validation - validations belong in services
    },
    token: {
      type: DataTypes.STRING(512), // Increased length for security
      allowNull: false,
      unique: true, // Ensure token uniqueness
      validate: {
        notEmpty: true, // Token shouldn't be empty
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false, // Added not null
      references: {
        model: 'users', // Lowercase reference
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW // Standard Sequelize handling
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW // Standard Sequelize handling
    }
  },
  {
    sequelize,
    modelName: 'BlacklistedToken', // Singular PascalCase
    tableName: 'blacklisted_tokens', // Snake_case to match migration
    timestamps: true, // Enable automatic timestamp management
    paranoid: false, // Disable soft deletes for tokens
    indexes: [
      // Create indexes for performance
      { unique: true, fields: ['token'] },
      { fields: ['userId'] },
      { fields: ['expiresAt'] }
    ]
  }
);

// Proper association
BlacklistedToken.associate = function(models) {
  BlacklistedToken.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'CASCADE' // Cascade delete when user is deleted
  });
};

module.exports = BlacklistedToken;