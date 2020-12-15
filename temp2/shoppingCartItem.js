'use strict';

const items = require("./items");

module.exports = app => {
  const { Sequelize } = app;
  const sequelize = app.model;

  const ShoppingCartItems = app.model.define('shoppingCartItems', {
    quantity: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
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
    itemsSub_Id: {
      primaryKey: true,
      foreignKey: true,
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    },

  }, {
    freezeTableName: true,
    timestamps: true,
    underscored: true,
    charset: 'utf8'
  });

  ShoppingCartItems.sync({ force: false });
  ShoppingCartItems.associate = () => {
    const { Users, Items, } = app.model;
    Users.belongsToMany(Items, { through: ShoppingCartItems, foreignKey: 'user_id' });
    Items.belongsToMany(Users, { through: ShoppingCartItems, foreignKey: 'items_id' });
  };

  return ShoppingCartItems;

}