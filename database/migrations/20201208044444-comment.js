'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('comment', {
      usersId: {
        foriegnKey: true,
        primaryKey: true,
        type: Sequelize.UUID,
        allowNull: false,
      },
      itemsId: {
        foriegnKey: true,
        primaryKey: true,
        type: Sequelize.UUID,
        allowNull: false,
      },
      itemsSub_id: {
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
