'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_profiles', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'users',  // Lowercase reference
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      profilePicUrl: {
        type: Sequelize.STRING(512),
        allowNull: true
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      phoneNumber: {  // Corrected field name
        type: Sequelize.STRING(20),
        allowNull: true,
        unique: true  // Added uniqueness
      },
      socialLinks: {
        type: Sequelize.JSON,
        allowNull: true
      },
      profileIsComplete: {
        type: Sequelize.BOOLEAN,
        allowNull: false,  // Not null
        defaultValue: false
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
      engine: 'InnoDB',
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    });

    // Add unique constraint for phone number
    await queryInterface.addIndex('user_profiles', ['phoneNumber'], {
      unique: true,
      name: 'user_profiles_phoneNumber_unique'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove unique constraint first
    await queryInterface.removeIndex('user_profiles', 'user_profiles_phoneNumber_unique');
    
    // Drop table
    await queryInterface.dropTable('user_profiles');
  }
};