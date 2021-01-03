'use strict';

module.exports = app => {
  const { Sequelize } = app;

  const OrderItems = app.model.define('orderItems', {
    order_no: {
      primaryKey: true,
      type: Sequelize.UUID,
      allowNull: false,
    },
    item_id: {
      primaryKey: true,
      type: Sequelize.UUID,
      allowNull: false,
      unique: false,
    },
    seller_id: {
      primaryKey: true,
      type: Sequelize.UUID,
      allowNull: false,
      unique: false,
    },
    items_quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    items_url: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: ""
    },
    items_name: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ""
    },
  }, {
    freezeTableName: true,
    timestamps: true,
    arset: 'utf8'
  });

  OrderItems.sync({ force: false });

  // Association
  OrderItems.associate = () => {
    const { Order, Items, Users } = app.model;
    Order.belongsToMany(Items, { through: OrderItems, foreignKey: 'order_no' });
    Items.belongsToMany(Order, { through: OrderItems, foreignKey: 'item_id', unique: false });
    Users.belongsToMany(Items, { through: OrderItems, foreignKey: 'seller_id', targetKey: 'id', unique: false });
  };

  return OrderItems;
}
