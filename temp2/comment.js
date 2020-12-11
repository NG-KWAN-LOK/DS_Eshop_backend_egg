'use strict';

module.exports = app => {
  const { Sequelize } = app;
  const sequelize = app.model;

  const Comment = sequelize.define('comment', {
    // usersId: {
    //   foriegnKey: true,
    //   primaryKey: true,
    //   type: Sequelize.UUID,
    //   allowNull: false,
    // },
    // itemsId: {
    //   foriegnKey: true,
    //   primaryKey: true,
    //   type: Sequelize.UUID,
    //   allowNull: false,
    // },
    // itemsSub_id: {
    //   foriegnKey: true,
    //   primaryKey: true,
    //   type: Sequelize.UUID,
    //   allowNull: false,
    // },
    content: {
      type: Sequelize.STRING,
      allowNull: false
    },
  }, {
    freezeTableName: true,
    timestamps: true,
    underscored: true,
    charset: 'utf8'
  });

  Comment.sync({ force: false });
  // Association
  Comment.associate = () => {
    const { Users, Items, } = app.model;

    Users.hasMany(Comment, {
      foreignKey: 'user_id',
    });
    Items.hasMany(Comment);
  };
  return Comment;
};
