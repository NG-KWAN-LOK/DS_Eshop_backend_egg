'use strict';

module.exports = app => {
  const { Sequelize } = app;

  const Coupon = app.model.define('Coupon', {
    content: {
      primaryKey:true,
      type: Sequelize.STRING,
      unique: true,
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
