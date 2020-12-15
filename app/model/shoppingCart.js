'use strict';

const items = require("./items");

module.exports = app => {
  const { Sequelize } = app;

  const ShoppingCart = app.model.define('shoppingCart', {
    quantity: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    user_id: {
      foreignKey: true,
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    },
    seller_id: {
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
    items_id: {
      foreignKey: true,
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    },
    itemsSub_Id: {
      foreignKey: true,
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
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

  ShoppingCart.sync({ force: true });
  ShoppingCart.associate = () => {
    const { Users, Items, } = app.model;
    Users.belongsToMany(Items, { through: ShoppingCart, foreignKey: 'user_id' });
    Items.belongsToMany(Users, { through: ShoppingCart, foreignKey: 'items_id' });
  };

  return ShoppingCart;

}