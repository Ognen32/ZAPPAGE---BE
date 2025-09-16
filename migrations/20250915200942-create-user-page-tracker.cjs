'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserPageTrackers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      comicId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Comics',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      currentPageNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Composite unique constraint on (userId, comicId)
    await queryInterface.addConstraint('UserPageTrackers', {
      fields: ['userId', 'comicId'],
      type: 'unique',
      name: 'unique_user_comic_page_tracker',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserPageTrackers');
  },
};
