'use strict';

const items = require("./items");

module.exports = app => {
  const { Sequelize } = app;

  const ShoppingCart = app.model.define('shoppingCart', {

    user_id: {
      primaryKey: true,
      foreignKey: true,
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    },
    seller_id: {
      primaryKey: true,
      foreignKey: true,
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    },
    items_id: {
      primaryKey: true,
      foreignKey: true,
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    },
    items_sub_id: {
      foreignKey: true,
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    },
    seller_name: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "",
    },
    quantity: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    remain_quantity: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    items_name: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "",
    },
    items_url: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "",
    },
    items_image_url: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "",
    },

  }, {
    freezeTableName: true,
    timestamps: true,
    underscored: true,
    charset: 'utf8'
  });

  ShoppingCart.sync({ force: false });
  ShoppingCart.associate = () => {
    const { Users, Items, } = app.model;
    Users.belongsToMany(Items, { through: ShoppingCart, foreignKey: 'user_id' });
    Items.belongsToMany(Users, { through: ShoppingCart, foreignKey: 'items_id' });
  };

  return ShoppingCart;

}