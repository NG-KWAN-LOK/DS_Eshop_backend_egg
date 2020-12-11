'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orderItems', {
      orderNo: {
        primaryKey: true,
        foreignKey: true,
        type: Sequelize.UUID,
      },
      itemsId: {
        primaryKey: true,
        foreignKey: true,
        type: Sequelize.UUID,
      },
      itemsSub_Id: {
        primaryKey: true,
        foreignKey: true,
        type: Sequelize.UUID,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('orderItems');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
