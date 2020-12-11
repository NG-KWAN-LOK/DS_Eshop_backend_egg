'use strict';

module.exports = app => {
  const { Sequelize } = app;
  const sequelize = app.model;

  const Coupon = sequelize.define('coupon', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      allowNull: false,
      unique: true,
      defaultValue: Sequelize.UUIDV4,
    },
    discount: {
      type: Sequelize.INTERGER,
      allowNull: false,
      defaultValue: 0,
    },

    // usersId: {
    //   type: Sequelize.UUID,
    //   allowNull: false,
    // },
    // itemsId: {
    //   type: Sequelize.UUID,
    //   allowNull: false,
    // },
    // itemsSub_id: {
    //   type: Sequelize.UUID,
    //   allowNull: false,
    // },

  }, {
    freezeTableName: true,
    timestamps: true,
    underscored: true,
    charset: 'utf8'
  });

  Coupon.sync({ force: false });

  // Association
  Coupon.associate = () => {

    Items.belongsToMany(Users, { through: 'coupon' });
    Users.belongsToMany(Items, { through: 'coupon' });

  };

  return Coupon;
};