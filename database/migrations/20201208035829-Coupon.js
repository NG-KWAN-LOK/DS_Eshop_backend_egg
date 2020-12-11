'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('coupon', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        defaultValue: Sequelize.UUIDV4,
      },
      discount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      usersId: {
        foreignKey: true,
        type: Sequelize.UUID,
        allowNull: false,
      },
      itemsId: {
        foreignKey: true,
        type: Sequelize.UUID,
        allowNull: false,
      },
      itemsSub_id: {
        foreignKey: true,
        type: Sequelize.UUID,
        allowNull: false,
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('coupon');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
