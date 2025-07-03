const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize.db');

class EventRegistration extends Model {}

EventRegistration.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    eventId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'events',
        key: 'id'
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ticketCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1
      }
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: false
    },
    registrationDate: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'attended'),
      defaultValue: 'pending'
    },
    paymentStatus: {
      type: DataTypes.ENUM('unpaid', 'pending', 'paid', 'refunded'),
      defaultValue: 'unpaid'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'EventRegistration',
    tableName: 'event_registrations',
    indexes: [
      { fields: ['eventId'] },
      { fields: ['email'] },
      { fields: ['ipAddress'] },
      { fields: ['status'] }
    ]
  }
);

EventRegistration.associate = function(models) {
  EventRegistration.belongsTo(models.Event, {
    foreignKey: 'eventId',
    as: 'event'
  });
};

module.exports = EventRegistration;