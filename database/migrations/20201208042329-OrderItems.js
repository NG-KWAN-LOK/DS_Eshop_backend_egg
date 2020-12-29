'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orderItems', {
      item_id: {
        foreignKey: true,
        type: Sequelize.UUID,
        allowNull: false,
      },
      order_no: {
        foreignKey: true,
        type: Sequelize.UUID,
        allowNull: false,
      },
      seller_id: {
        foreignKey: true,
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: ""
      },
      items_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      items_url: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ""
      },
      items_name: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ""
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
