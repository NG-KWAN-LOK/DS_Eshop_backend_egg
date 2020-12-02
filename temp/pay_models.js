'use strict';

module.exports = app => {
  const { Sequelize } = app;
  const sequelize = app.model;

  const PayModels = sequelize.define('pay_models', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      allowNull: false,
      unique: true,
      defaultValue: Sequelize.UUIDV4,
    },
    event_id: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    // 順位
    idx: {
      type: Sequelize.INTEGER(1).UNSIGNED,
      defaultValue: 0,
      allowNull: false,
    },
    // 分期期數
    // 預設: 1
    pay_parts: {
      type: Sequelize.INTEGER.UNSIGNED,
      defaultValue: 1,
      allowNull: false,
    },
    // 每期金額
    // 預設: 1
    amount_per_part: {
      type: Sequelize.INTEGER.UNSIGNED,
      defaultValue: 1,
      allowNull: false,
    },
    // Description
    description: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: '一次付清'
    },
  }, {
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    underscored: true,
    charset: 'utf8mb4'
  });

  PayModels.sync({ force: false });

  PayModels.associate = () => {
    const { shop, } = app.model;

    shop.hasMany(PayModels, {
      foreignKey: 'event_id',
    });

  };

  return PayModels;

}