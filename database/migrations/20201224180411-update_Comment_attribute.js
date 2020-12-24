'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('comment', 'usersId', 'user_id');
    await queryInterface.renameColumn('comment', 'itemsId', 'items_id');
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('comment', 'user_id', 'usersId');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
