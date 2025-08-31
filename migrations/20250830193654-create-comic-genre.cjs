'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ComicGenres', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
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
      genreId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Genres',
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

    // Add unique constraint on (comicId, genreId)
    await queryInterface.addConstraint('ComicGenres', {
      fields: ['comicId', 'genreId'],
      type: 'unique',
      name: 'unique_comic_genre_pair'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ComicGenres');
  }
};
