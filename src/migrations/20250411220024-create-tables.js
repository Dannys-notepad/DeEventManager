'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        validate: {
          isUUID: 4,
        },
      },
      username: {
        type: Sequelize.STRING
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      authProvider: {
        type: Sequelize.ENUM('local', 'google')
      },
      password: {
        type: Sequelize.STRING
      },
      googleId: {
        type: Sequelize.STRING
      },
      emailVerified: {
        type: Sequelize.BOOLEAN
      },
      accountStatus: {
        type: Sequelize.ENUM('active', 'inactive')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }),
    await queryInterface.createTable('blackListedTokens', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        validate: {
          isUUID: 4,
        },
      },
      token: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }),

    await queryInterface.createTable('UserProfile', {
      userId: {
        type: Sequelize.UUID,
        references: {
          model: "Users",
          key: 'id'
        },
        allowNull: false
      },
      username: {
        type: Sequelize.STRING,
        references: {
          model: "Users",
          key: 'username'
        },
        allowNull: true
      },
      firstName: {
        type: Sequelize.STRING,
        references: {
          model: "Users",
          key: 'firstName'
        },
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        references: {
          model: "Users",
          key: 'lastName'
        },
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        references: {
          model: "Users",
          key: 'email'
        },
        allowNull: false
      },
      profilePicUrl: {
        type: Sequelize.STRING,
        allowNull: true
       },
      bio: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tellphoneNumber: {
        type: Sequelize.STRING,
        allowNull: true
      },
      socialLinks: {
        type: Sequelize.STRING,
        allowNull: true
      },
      profileIsComplete: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserProfile')
    await queryInterface.dropTable('blackListedTokens'),
    await queryInterface.dropTable('Users')
  }
};