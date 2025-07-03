'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('blacklisted_tokens', {  // Changed to snake_case
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        // Removed validation - migrations shouldn't contain validations
      },
      token: {
        type: Sequelize.STRING(512),  // Added length for security tokens
        allowNull: false,
        unique: true
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,  // Added not null constraint
        references: {
          model: 'users',  // Changed to lowercase reference
          key: 'id'
        },
        onDelete: 'CASCADE',  // Added cascade delete
        onUpdate: 'CASCADE'
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

    // Add explicit index for faster token lookups
    await queryInterface.addIndex('blacklisted_tokens', ['token'], {
      unique: true,
      name: 'blacklisted_tokens_token_unique'
    });

    // Add index for user ID
    await queryInterface.addIndex('blacklisted_tokens', ['userId'], {
      name: 'blacklisted_tokens_userId_index'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove indexes first
    await queryInterface.removeIndex('blacklisted_tokens', 'blacklisted_tokens_token_unique');
    await queryInterface.removeIndex('blacklisted_tokens', 'blacklisted_tokens_userId_index');
    
    // Drop table
    await queryInterface.dropTable('blacklisted_tokens');
  }
};