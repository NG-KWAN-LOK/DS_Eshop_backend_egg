'use strict';

module.exports = app => {
  const { Sequelize } = app;
  const sequelize = app.model;


  const Items = sequelize.define('Items', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    },
    name: {
      type: Sequelize.STRING(255),
    },

    price: {
      type: Sequelize.INTEGER,
    },
    /*
    shop_id: {
      primaryKey: true,
      type: Sequelize.UUID,
      allowNull: false,
      unique: false,
      defaultValue: Sequelize.UUIDV4,
    },
    subtype_id: {
      primaryKey: true,
      type: Sequelize.UUID,
      allowNull: false,
      unique: false,
    },
    name: {
      type: Sequelize.STRING(255),
      defaultValue: '_',
      allowNull: false,
    },
    subtype_name: {
      type: Sequelize.STRING(255),
      defaultValue: '_',
      allowNull: false,
    },
    price: {
      type: Sequelize.INTEGER.UNSIGNED,
      defaultValue: 1,
      allowNull: false,
    },
    remain_quantity: {
      type: Sequelize.INTEGER.UNSIGNED,
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
    //is_discount
    //有無折扣
    is_discount: {
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
      allowNull: false,
    },
    //Discount_price
    //折扣多少錢
    discount_price: {
      type: Sequelize.INTEGER.UNSIGNED,
      defaultValue: 0,
      allowNull: false,
    },
    image_url: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },

    description: {
      type: Sequelize.STRING,
      defaultValue: null,
      allowNull: false,
    },
*/

  }, {
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    underscored: true,
    charset: 'utf8mb4'
  });

  Items.sync({ force: false });
  return Items;
};