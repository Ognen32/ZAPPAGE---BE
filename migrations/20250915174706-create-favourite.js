'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Favourites', {
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
    await queryInterface.addConstraint('Favourites', {
      fields: ['userId', 'comicId'],
      type: 'unique',
      name: 'unique_user_comic',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Favourites');
  },
};
