'use strict';

module.exports = app => {
  const { Sequelize } = app;
  const sequelize = app.model;

  const Sell_list = sequelize.define('sell_list', {
    userId: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    itemsId: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    itemsSubId: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
    },

  }, {
    freezeTableName: true,
    timestamps: true,
    underscored: true,
    charset: 'utf8'
  });

  Sell_list.sync({ force: false });

  // Association
  Sell_list.associate = () => {

    Items.belongsToMany(Users, { through: 'Sell_list', foreignKey: 'userId',sourceKey:'id' });

  };

  return Company;
};