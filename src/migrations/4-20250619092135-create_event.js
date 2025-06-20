'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('events', {  // Lowercase
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',  // Lowercase reference
          key: 'id'
        }
      },
      title: {
        type: Sequelize.STRING(150),  // Added length
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      categoryOrTag: {
        type: Sequelize.STRING(50),  // Added length
        allowNull: false,
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      time: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      venueType: {
        type: Sequelize.ENUM('physical', 'virtual', 'hybrid'),
        allowNull: false,
      },
      venueAccessMedium: {
        type: Sequelize.STRING(200),  // Added length
        allowNull: false,
      },
      ticketType: {
        type: Sequelize.ENUM('general', 'vip', 'earlybird'),
        allowNull: false,
      },
      ticketQuantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ticketDiscountCode: {
        type: Sequelize.STRING(50),  // Added length
        allowNull: true,
        defaultValue: 'none'
      },
      ticketSaleStartDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      ticketSaleEndDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      ticketPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      speakersPerformers: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: Sequelize.literal('(JSON_ARRAY())'),  // MySQL-compatible default
      },
      registrationRequirement: {
        type: Sequelize.STRING(100),  // Added length
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    }, {
      engine: 'InnoDB',
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    });

    // Add foreign key constraint with cascade rules
    await queryInterface.addConstraint('events', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_events_user',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    // Add indexes for better performance
    await queryInterface.addIndex('events', ['date'], {
      name: 'events_date_index'
    });
    
    await queryInterface.addIndex('events', ['userId'], {
      name: 'events_userId_index'
    });
    
    await queryInterface.addIndex('events', ['categoryOrTag'], {
      name: 'events_category_index'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove foreign key first
    await queryInterface.removeConstraint('events', 'fk_events_user');
    
    // Remove indexes
    await queryInterface.removeIndex('events', 'events_date_index');
    await queryInterface.removeIndex('events', 'events_userId_index');
    await queryInterface.removeIndex('events', 'events_category_index');
    
    // Drop table
    await queryInterface.dropTable('events');
  }
};