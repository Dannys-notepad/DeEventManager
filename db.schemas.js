/************************** FOR EVENT **********/

/*
// models/Event.js
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    id: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      defaultValue: () => `evt_${crypto.randomBytes(10).toString('hex')}`
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM('draft', 'published', 'cancelled'),
      defaultValue: 'draft'
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    duration: DataTypes.FLOAT,
    locationType: {
      type: DataTypes.ENUM('physical', 'virtual'),
      defaultValue: 'physical'
    },
    address: DataTypes.STRING(200),
    mapLink: DataTypes.STRING(500),
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    currentRegistrations: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    registrationOpen: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    registrationDeadline: DataTypes.DATE,
    categories: DataTypes.JSON,
    notificationSettings: {
      type: DataTypes.JSON,
      defaultValue: {
        sendConfirmation: true,
        sendReminder: true,
        capacityAlertThreshold: 80
      }
    },
    actionRequired: {
      type: DataTypes.JSON,
      defaultValue: []
    }
  }, {
    timestamps: true,
    underscored: false
  });

  Event.associate = models => {
    Event.belongsTo(models.User, {
      foreignKey: 'organizerId',
      as: 'organizer'
    });
  };

  return Event;
};
*/

/************** FOR USER PROFILE *******************/

/*
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('User', {
    id: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      defaultValue: sequelize.Sequelize.literal(
        `'usr_' + REPLACE(CONVERT(VARCHAR(255), NEWID()), '-', '')`
      )
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    passwordHash: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    avatarUrl: DataTypes.STRING(500),
    accountType: {
      type: DataTypes.ENUM('attendee', 'organizer', 'admin'),
      defaultValue: 'attendee'
    },
    organization: DataTypes.STRING(100),
    notificationPreferences: {
      type: DataTypes.JSON,
      defaultValue: {
        email: true,
        sms: false,
        eventReminders: true,
        registrationUpdates: true
      }
    }
  }, {
    timestamps: true,
    paranoid: true // Soft deletes
  });
};
*/