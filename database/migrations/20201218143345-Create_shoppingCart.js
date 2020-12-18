'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('shoppingCart', {

      user_id: {
        primaryKey: true,
        foreignKey: true,
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      seller_id: {
        primaryKey: true,
        foreignKey: true,
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      items_id: {
        primaryKey: true,
        foreignKey: true,
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      items_sub_id: {
        foreignKey: true,
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      seller_name: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "",
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      remain_quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      items_name: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "",
      },
      items_url: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "",
      },
      items_image_url: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "",
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('shoppingCart');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
