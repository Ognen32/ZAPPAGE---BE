'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'city');
    await queryInterface.removeColumn('Users', 'address');
  },

  down: async (queryInterface, Sequelize) => {
    // Rollback: add columns back in case of rollback
    await queryInterface.addColumn('Users', 'city', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn('Users', 'address', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};
