'use strict';

module.exports = app => {
  const { Sequelize } = app;

  const Coupon = app.model.define('Coupon', {
    coupon_id: {
      primaryKey: true,
      type: Sequelize.UUID,
      unique: true,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    },
    content: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    discount_rate: {
      type: Sequelize.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    startdate:{
      type: Sequelize.DATE,
    },
    enddate: {
      type: Sequelize.DATE
    },
  }, {
    freezeTableName: true,
    timestamps: true,
    underscored: true,
    charset: 'utf8'
  });

  Coupon.sync({ force: true });

  // Association
  Coupon.associate = () => {
  };

  return Coupon;
}
