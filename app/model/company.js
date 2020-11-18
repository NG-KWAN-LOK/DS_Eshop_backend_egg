'use strict';

module.exports = app => {
  const { Sequelize } = app;
  const sequelize = app.model;

  const Company = sequelize.define('Company', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      allowNull: false,
      unique: true,
      defaultValue: Sequelize.UUIDV4,
    },
    email: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: false
    },
    is_online: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    avatar: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    status: {
      type: Sequelize.INTEGER.UNSIGNED,
      defaultValue: 0,
      allowNull: false,
    },
    telephone: {
      type: Sequelize.STRING(32),
      allowNull: true,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    creator_id: {
      type: Sequelize.UUID,
      allowNull: true,
    },
    
  }, {
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    underscored: true,
    charset: 'utf8mb4'
  });

  Users.sync({ force: false });

  // Association
  Company.associate = () => {

    Company.hasOne(Company, {
      foreignKey: 'creator_id'
    });

  };

  return Company;
};