'use strict';

module.exports = app => {
  const { Sequelize } = app;

  const Coupon = app.model.define('Coupon', {
    id:{
      primaryKey:true,
      type: Sequelize.UUID,
      unique : true,
      defaultValue:Sequelize.UUIDV4,
      allowNull:false,
    },
    content: {
      type: Sequelize.STRING(30),
      unique: true,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull:true
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

  Coupon.sync({ force: false });

  // Association
  Coupon.associate = () => {
  };

  return Coupon;
}
