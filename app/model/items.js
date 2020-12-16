'use strict';
const Users = require("./users");
module.exports = app => {
  const { Sequelize } = app;
  // const sequelize = app.model;


  const Items = app.model.define('items', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    },
    sub_id: {
      // primaryKey: true,
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
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    pay_parts: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 0,
    },
    pay_index: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    is_discount: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    discount_price: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    image_url: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "",
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "",
    },
    is_display: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    user_id: {
      type: Sequelize.UUID,
      allowNull: false,
    }
  }, {
    freezeTableName: true,
    timestamps: true,
    derscored: true,
    arset: 'utf8'
  });
  Items.sync({ force: false });
  //Association
  Items.associate = () => {
    Items.belongsTo(app.model.Users, { foreignKey: 'user_id', targetKey: 'id' });
  };
  return Items;
};