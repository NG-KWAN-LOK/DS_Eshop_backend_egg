'use strict';

module.exports = app => {
  const { Sequelize } = app;
  const sequelize = app.model;

  const Comment = sequelize.define('comment', {
    user_id: {
      foriegnKey: true,
      primaryKey: true,
      type: Sequelize.UUID,
      allowNull: false,
    },
    items_id: {
      foriegnKey: true,
      primaryKey: true,
      type: Sequelize.UUID,
      allowNull: false,
    },
    content: {
      type: Sequelize.STRING,
      allowNull: false
    },
  }, {
    freezeTableName: true,
    timestamps: true,
    arset: 'utf8'
  });

  Comment.sync({ force: false });
  // Association
  Comment.associate = () => {
    const { Users, Items, } = app.model;
    Users.belongsToMany(Items, { through: Comment, foreignKey: 'user_id' });
    Items.belongsToMany(Users, { through: Comment, foreignKey: 'items_id' });

  };
  return Comment;
};
