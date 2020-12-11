'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('items', 'sales');
    await queryInterface.removeColumn('items', 'category');
    await queryInterface.addColumn(
      'items',
      'sales',
      {
        type: Sequelize.INTEGER.UNSIGNED,
        defaultValue: 0,
        allowNull: false
      }
    )
    await queryInterface.addColumn(
      'items',
      'category',
      {
        type: Sequelize.STRING,
        defaultValue: "",
        allowNull: false
      }
    )
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
