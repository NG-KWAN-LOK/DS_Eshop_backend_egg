'use strict';

module.exports = app => {
  const { Sequelize } = app;
  const sequelize = app.model;

  const Items = sequelize.define('Items', {
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
    shop_id: {
      type: Sequelize.UUID,
      allowNull: false,
      unique: false,
    },
    // status
    // 購買狀態
    // 0: 已建立
    // 1: 已預訂/支付中
    // 2: 已結帳
    // 3: 已取消
    status: {
      type: Sequelize.INTEGER(1).UNSIGNED,
      defaultValue: 0,
      allowNull: false,
    },
    // price
    // 票價
    // 正整數
    price: {
      type: Sequelize.INTEGER.UNSIGNED,
      defaultValue: 1,
      allowNull: false,
    },
    // pay_idx
    // 支付類型
    // 對應到 pay_models 的 idx
    // 0: 一次付清
    // 1: 部分折抵
    // 2: 分期付款
    pay_idx: {
      type: Sequelize.INTEGER(1).UNSIGNED,
      defaultValue: 0,
      allowNull: false,
    },
    // pay_parts
    // 分期付款期數
    // 2~6 期
    pay_parts: {
      type: Sequelize.INTEGER(1).UNSIGNED,
      allowNull: true,
    },
    // coupon_recieved
    // 折價券是否已收
    // Boolean
    coupon_received: {
      type: Sequelize.INTEGER(1).UNSIGNED,
      defaultValue: 0,
      allowNull: true,
    },
    // coupon_amount
    // 折價數值
    // 正整數
    coupon_amount: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
    },

    name: {
      type: Sequelize.STRING(255),
      defaultValue: '_',
      allowNull: false,
    },
    nationality: {
      type: Sequelize.STRING(32),
      defaultValue: '_',
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING(255),
      defaultValue: '_',
      allowNull: false,
    },
    phone: {
      type: Sequelize.STRING(255),
      defaultValue: '_',
      allowNull: false,
    },
    notes: {
      type: Sequelize.STRING(255),
      defaultValue: '',
      allowNull: true,
    },
  }, {
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    underscored: true,
    charset: 'utf8mb4'
  });

  Items.sync({ force: false });

  // Association
  Items.associate = () => {
    const { Users, shop, } = app.model;

    Users.hasMany(Items, {
      foreignKey: 'user_id',
    });

    shop.hasMany(Items, {
      foreignKey: 'event_id',
    });

  };

  return Items;
};