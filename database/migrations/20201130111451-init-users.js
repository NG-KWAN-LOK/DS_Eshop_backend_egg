'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    await queryInterface.createTable('users', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        defaultValue: Sequelize.UUIDV4,
      },
      telephone: {
        type: Sequelize.STRING(32),
        allowNull: false,
        unique: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      last_login: {
        type: Sequelize.DATE,
        defaultValue: null
      },
      name: {
        type: Sequelize.STRING(32),
        allowNull: false,
        unique: false
      },
      pwhash: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      username: {
        type: Sequelize.STRING(32),
        allowNull: false,
        unique: true,
      },
      bankAccount: {
        type: Sequelize.STRING(255),
        allowNull: true,
        unique: true,
        defaultValue: null,
      },
      is_online: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      avatar: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      status: {
        type: Sequelize.INTEGER.UNSIGNED,
        defaultValue: 0,
        allowNull: false,
      },
      invite_code: {
        type: Sequelize.STRING(32),
        allowNull: true,
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });

  },

  down: async queryInterface => {
    await queryInterface.dropTable('users');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
