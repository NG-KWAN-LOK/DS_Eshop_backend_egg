'use strict';

module.exports = app => {
  const { Sequelize } = app;
  const sequelize = app.model;

  const ShoppingCart = sequelize.define('shoppingCart', {
    quantity: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    usersId: {
      primaryKey: true,
      foreignKey: true,
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    },
    itemsId: {
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

  ShoppingCart.sync({ force: false });
  ShoppingCart.associate = () => {
    const { Users, Items, } = app.model;

    Users.hasMany(ShoppingCart, {
      foreignKey: 'user_id',
    });
    Items.hasMany(ShoppingCart);
  };

  return ShoppingCart;

}