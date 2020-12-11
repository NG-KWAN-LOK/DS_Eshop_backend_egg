'use strict';
const Users = require("./users");
module.exports = app => {
  const { Sequelize } = app;
  const sequelize = app.model;


  const Items = sequelize.define('Items', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    },
    sub_id: {
      primaryKey: true,
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    }, 
    name: {
      type: Sequelize.STRING(254),
    },
    sub_name: {
      type: Sequelize.STRING(254),
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    remain_quantity: {
      type: sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    pay_parts: {
      type: sequelize.STRING,
      allowNull: false,
      defaultValue: 0,
    },
    pay_index: {
      type: sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    is_discount: {
      type: sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    discount_price: {
      type: sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    image_url: {
      type: sequelize.STRING,
      allowNull: false,
      defaultValue: "",
    },
    description: {
      type: sequelize.STRING,
      allowNull: false,
      defaultValue: null,
    },

  }, {
    freezeTableName: true,
    timestamps: true,
    underscored: true,
    charset: 'utf8'
  });

  // Association
  Items.associate = () => {

    Items.belongsToMany(Users, { foreignKey: 'userId', sourceKey: 'id' });

  };
  Items.sync({ force: false });
  return Items;
};