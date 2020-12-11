'use strict';

const Items = require("./items");

module.exports = app => {
  const { Sequelize } = app;
  // const Sequelize = db.Sequelize;
  // const sequelize = app.model;
  //below: test sequelize is usefull for connect 

  const Users = app.model.define('users', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      allowNull: false,
      unique: true,
      defaultValue: Sequelize.UUIDV4,
    },
    telephone: {
      type: Sequelize.STRING(32),
      allowNull: false,
      unique: true,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    email: {
      type: Sequelize.STRING(254),
      allowNull: false,
      unique: true
    },
    name: {
      type: Sequelize.STRING(32),
      allowNull: false,
      unique: false
    },
    pwhash: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    username: {
      type: Sequelize.STRING(32),
      allowNull: false,
      unique: true,
    },
    last_login: {
      type: Sequelize.DATE,
      defaultValue: null
    },

    // bankAccount: {
    //   type: Sequelize.STRING(254),
    //   allowNull: true,
    //   unique: true,
    //   defaultValue: null,
    // },
    is_online: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    avatar: {
      type: Sequelize.STRING(254),
      allowNull: true,
    },
    status: {
      type: Sequelize.INTEGER.UNSIGNED,
      defaultValue: 0,
      allowNull: false,
    },
    invite_code: {
      type: Sequelize.STRING(32),
      allowNull: true,
    },
  }, {
    freezeTableName: true,
    timestamps: true,
    underscored: true,
    charset: 'utf8'
  });

  Users.sync({ force: false });

  // Association
  Users.associate = () => {
    Users.hasMany(app.model.Items, { foreignKey: 'userId' });
  };
  return Users;
};