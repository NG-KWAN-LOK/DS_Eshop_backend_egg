'use strict';

module.exports = app => {
  const { Sequelize } = app;
  const sequelize = app.model;

  const Permissions = sequelize.define('permissions', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      allowNull: false,
      unique: true,
      defaultValue: Sequelize.UUIDV4,
    },
    route: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      defaultValue: null
    },
    creator_id: {
      type: Sequelize.UUID,
      defaultValue: null
    },
    modifier_id: {
      type: Sequelize.UUID,
      defaultValue: null
    }
  }, {
    freezeTableName: true,
    timestamps: true,
    underscored: true,
    charset: 'utf8mb4'
  });

  Permissions.sync({ force: false });

  return Permissions;
};
