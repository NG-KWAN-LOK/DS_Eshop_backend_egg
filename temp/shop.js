'use strict';

module.exports = app => {
  const { Sequelize } = app;
  const sequelize = app.model;

  const shop = sequelize.define('shop', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      allowNull: false,
      unique: true,
      defaultValue: Sequelize.UUIDV4,
    },
    human_id: {
      type: Sequelize.STRING(25),
      allowNull: false,
    },
    title_zh: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    title_en: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    slug_zh: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },
    slug_en: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },
    desc_zh: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    desc_en: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    address_en: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    address_zh: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    base_price: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      default: 4990
    },
    start_time: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    end_time: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    // 商品法規相關
    // 是否須年滿18
    adult_event: {
      type: Sequelize.INTEGER(1).UNSIGNED,
      defaultValue: 0,
      allowNull: false,
    },
    //商品名稱
    item_name: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    // 商品數
    item_count: {
      type: Sequelize.INTEGER.UNSIGNED,
      defaultValue: 10,
      allowNull: false,
    },
    // 有幾種付款方式由 pay_models 決定

  }, {
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    underscored: true,
    charset: 'utf8mb4'
  });

  shop.sync({ force: false });

  return shop;

}