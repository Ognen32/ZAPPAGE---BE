'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ComicPages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
      page: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      pageUrl: {
        type: Sequelize.STRING,
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

    // Composite unique constraint on (comicId, page)
    await queryInterface.addConstraint('ComicPages', {
      fields: ['comicId', 'page'],
      type: 'unique',
      name: 'unique_comic_page_per_comic',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ComicPages');
  },
};
