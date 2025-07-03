'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      authProvider: {
        type: Sequelize.ENUM('local', 'google'),
        allowNull: false,
        defaultValue: 'local'
      },
      passwordHash: {
        type: Sequelize.STRING(128),
        allowNull: true
      },
      googleId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      emailVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      accountStatus: {
        type: Sequelize.ENUM('active', 'inactive', 'suspended'),
        defaultValue: 'inactive'
      },
      accountType: {
        type: Sequelize.ENUM('organizer', 'attendee', 'admin'),
        defaultValue: 'organizer'
      },
      organization: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      passwordResetToken: {
        type: Sequelize.STRING,
        allowNull: true
      },
      passwordResetExpires: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    });

    await queryInterface.addIndex('users', ['email'], {
      unique: true,
      name: 'users_email_unique'
    });

    await queryInterface.addIndex('users', ['googleId'], {
      name: 'users_googleId_index'
    });

    await queryInterface.addIndex('users', ['accountStatus'], {
      name: 'users_accountStatus_index'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('users', 'users_email_unique');
    await queryInterface.removeIndex('users', 'users_googleId_index');
    await queryInterface.removeIndex('users', 'users_accountStatus_index');

    await queryInterface.dropTable('users');
  }
};
