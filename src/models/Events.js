const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize.db');

class Event extends Model {}

Event.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',  // Lowercase reference
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        len: [3, 150],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    categoryOrTag: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    venueType: {
      type: DataTypes.ENUM('physical', 'virtual', 'hybrid'),
      allowNull: false,
    },
    venueAccessMedium: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    ticketType: {
      type: DataTypes.ENUM('general', 'vip', 'earlybird'),
      allowNull: false,
    },
    ticketQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    ticketDiscountCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'none'
    },
    ticketSaleStartDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    ticketSaleEndDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfterStart(value) {
          if (value <= this.ticketSaleStartDate) {
            throw new Error('End date must be after start date.');
          }
        },
      },
    },
    ticketPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0,
      },
    },
    speakersPerformers: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    registrationRequirement: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Event',  // Singular
    tableName: 'events',  // Lowercase
    timestamps: true,
    indexes: [
      { fields: ['date'] },
      { fields: ['userId'] },
      { fields: ['categoryOrTag'] }
    ]
  }
);

// Fixed association function
Event.associate = function(models) {
  Event.belongsTo(models.User, { 
    foreignKey: 'userId',
    as: 'organizer',
    onDelete: 'CASCADE'  // Added cascade delete
  });
};

module.exports = Event;