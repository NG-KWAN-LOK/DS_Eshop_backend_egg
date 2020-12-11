'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('items', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      sub_id: {
        primaryKey: true,
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        foreignKey: true,
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING(254),
      },
      sub_name: {
        type: Sequelize.STRING(254),
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      remain_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      pay_parts: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 0,
      },
      pay_index: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      is_discount: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      discount_price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      image_url: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "",
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "",
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('items');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
