'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {  // Changed to lowercase
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        // Removed validate - migrations shouldn't contain validations
      },
      username: {
        type: Sequelize.STRING(50),  // Added length constraint
        allowNull: true
      },
      firstName: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING(50),
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
      password: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      googleId: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      emailVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      accountStatus: {
        type: Sequelize.ENUM('active', 'inactive', 'suspended'),  // Added suspended
        defaultValue: 'inactive'
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
      }
    }, {
      // Engine and charset specification for MySQL
      engine: 'InnoDB',
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    });

    // Create indexes for better performance
    await queryInterface.addIndex('users', ['email'], {
      unique: true,
      name: 'users_email_unique'
    });
    
    await queryInterface.addIndex('users', ['googleId'], {
      name: 'users_googleId_index'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove indexes first
    await queryInterface.removeIndex('users', 'users_email_unique');
    await queryInterface.removeIndex('users', 'users_googleId_index');
    
    // Drop table
    await queryInterface.dropTable('users');
  }
};