'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('order', {
      no: {
        primaryKey: true,
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        defaultValue: Sequelize.UUIDV4,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: false,
      },
      //運送狀態 - 之後調整 0:為發貨,1:已出貨正在運送中,2:已到達
      transportState: {
        type: Sequelize.INTEGER(3).UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },
      completed: {
        type: Sequelize.INTEGER(1).UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },
      MerchantID: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      MerchantTradeDate: {
        // 交易時間
        // 格式: yyyy/MM/dd HH:mm:ss
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      TradeDesc: {
        // 交易敘述
        type: Sequelize.STRING(200),
        defaultValue: '交易',
        allowNull: false,
      },
      OrderResultURL: {
        // 結帳完成後導回URL
        // 動態產生
        type: Sequelize.STRING(200),
        defaultValue: '',
        allowNull: true,
      },
      Remark: {
        // 備註
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('order');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
