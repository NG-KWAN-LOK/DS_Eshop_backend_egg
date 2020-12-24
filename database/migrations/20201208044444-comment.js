'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('comment', {
      user_id: {
        foriegnKey: true,
        primaryKey: true,
        type: Sequelize.UUID,
        allowNull: false,
      },
      items_id: {
        foriegnKey: true,
        primaryKey: true,
        type: Sequelize.UUID,
        allowNull: false,
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('comment');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
