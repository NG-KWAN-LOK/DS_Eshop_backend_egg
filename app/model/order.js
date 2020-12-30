'use strict';

module.exports = app => {
  const { Sequelize } = app;

  const Order = app.model.define('order', {
    no: {
      primaryKey: true,
      type: Sequelize.UUID,
      allowNull: false,
      unique: true,
      defaultValue: Sequelize.UUIDV4,
    },
    user_id: {
      foreignKey: true,
      type: Sequelize.UUID,
      allowNull: false,
      unique: false,
    },
    //運送狀態 - 之後調整 0:為發貨,1:已出貨正在運送中,2:已到達
    transportState: {
      type: Sequelize.INTEGER(3).UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    completed: {
      type: Sequelize.INTEGER(1).UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    OrderResultURL: {
      // 結帳完成後導回URL
      // 動態產生
      type: Sequelize.STRING(200),
      defaultValue: '',
      allowNull: true,
    },
    Remark: {
      // 備註
      type: Sequelize.STRING(100),
      allowNull: true,
    },
  }, {
    freezeTableName: true,
    timestamps: true,
    underscored: true,
    charset: 'utf8'
  });

  Order.sync({ force: false });

  // Association
  Order.associate = () => {
    const { Users, Items, } = app.model;
    // Users.hasMany(Order, { foreignKey: 'user_id', });
    Items.belongsTo(Users, { foreignKey: 'user_id', targetKey: 'id' });
  };

  return Order;
}
