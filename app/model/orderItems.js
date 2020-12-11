'use strict';

module.exports = app => {
  const { Sequelize } = app;
  const sequelize = app.model;

  const OrderItems = sequelize.define('orderItems', {

    // orderNo: {
    //   primaryKey: true,
    //   foreignKey: true,

    // },
    // itemsId: {
    //   primaryKey: true,
    //   foreignKey: true,
    // },
    // itemsSub_Id: {
    //   primaryKey: true,
    //   foreignKey: true,
    // },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
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
    const { Orders, Items, } = app.model;

    OrderItems.hasMany(Items);
    Orders.hasMany(OrderItems);

  };

  return OrderItems;
}
