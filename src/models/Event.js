const { Sequelize, DataTypes,  Model} = require('sequelize')
const sequelize = require('../config/sequelize.db')

class Event extends Model {}

Event.init(
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
    userId: {
      type: DataTypes.UUID,
      references: {
        model: "Users",
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    categoryOrTag: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false
    },
    venueType: {
      type: DataTypes.ENUM('physical', 'virtual', 'hybrid'),
      allowNull: false
    },
    venueAccessMeduim: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ticketType: {
      type: DataTypes.ENUM('general', 'vip', 'earlybird'),
      allowNull: false
    },
    ticketQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ticketDiscountCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ticketSaleStartDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ticketSaleEndDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ticketPrice: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Speakers$Performers: {
      type: DataTypes.STRING,
      allowNull: false
    },
    registrationRequirement: {
      type: DataType.STRING,
      allowNull: false
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
    modelName: 'Event',
    tableName: 'Event'
  }
)

Event.associate = (models) => {
    Event.belongsTo(models.Users, { foreignKey: 'userId' });
  return Event;
};

module.exports = Event