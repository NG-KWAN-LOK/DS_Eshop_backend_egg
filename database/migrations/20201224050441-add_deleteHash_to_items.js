'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'items',
      'deleteHash',
      Sequelize.STRING
    );
  },

  down: async (queryInterface, Sequelize) => {
    // await queryInterface.dropTable('items');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
