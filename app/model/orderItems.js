'use strict';

module.exports = app => {
  const { Sequelize } = app;

  const OrderItems = app.model.define('orderItems', {
    item_id: {
      foreignKey: true,
      type: Sequelize.UUID,
      allowNull: false,
    },
    order_no: {
      foreignKey: true,
      type: Sequelize.UUID,
      allowNull: false,
    },
    seller_id: {
      foreignKey: true,
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: ""
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
    underscored: true,
    charset: 'utf8'
  });

  OrderItems.sync({ force: false });

  // Association
  OrderItems.associate = () => {
    const { Order, Items, Users } = app.model;
    Order.belongsToMany(Items, { through: OrderItems, foreignKey: 'order_no' });
    Items.belongsToMany(Order, { through: OrderItems, foreignKey: 'item_id' });
    Users.belongsToMany(Items, { through: OrderItems, foreignKey: 'seller_id', targetKey: 'id' });
  };

  return OrderItems;
}
