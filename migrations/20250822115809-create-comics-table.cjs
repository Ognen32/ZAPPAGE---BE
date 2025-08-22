'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Comics', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      slug: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      author: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      shortDescription: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      releaseDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      publisher: {
        type: Sequelize.ENUM("Marvel", "DC Comics"),
        allowNull: false,
        defaultValue: "Marvel"
      },
      mainCover: {
        type: Sequelize.STRING,
        allowNull: true
      },
      coverArt: {
        type: Sequelize.STRING,
        allowNull: true
      },
      page_count: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      totalViewed: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
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
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Comics');
  }
};
