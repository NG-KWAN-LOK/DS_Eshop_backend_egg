'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'comment',
      'user_name',
      Sequelize.STRING
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('comment', 'user_name')
    // await queryInterface.renameColumn('comment', 'user_id', 'usersId');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
