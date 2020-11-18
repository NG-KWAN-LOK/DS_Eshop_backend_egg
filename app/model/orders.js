'use strict';

module.exports = app => {
  const { Sequelize } = app;
  const sequelize = app.model;

  const Orders = sequelize.define('orders', {
    id: {
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
    item_id: {
      type: Sequelize.UUID,
      unique: false,
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
    TotalAmount: {
      // 結帳金額
      // Unsigned Integer
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    TradeDesc: {
      // 交易敘述
      type: Sequelize.STRING(200),
      defaultValue: '交易',
      allowNull: false,
    },
    ItemName: {
      // 商品名稱
      // 有多個的話用 # 分隔
      type: Sequelize.STRING(200),
      defaultValue: 'Item',
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
  }, {
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    underscored: true,
    charset: 'utf8mb4'
  });

  Orders.sync({ force: false });

  // Association
  Orders.associate = () => {
    const { Users, Items, } = app.model;

    Users.hasMany(Orders, {
      foreignKey: 'user_id',
    });

    Items.hasMany(Orders, {
      foreignKey: 'ticket_id',
    });

  };

  return Orders;
}
