const User = require('./user');
const Post = require('./post');

const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD, 
  {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST
});

const Comment = sequelize.define('Comment', {
    comment_content:  {
      type: DataTypes.STRING,
      allowNull: false
    },
    comment_media: {
      type: DataTypes.STRING,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id'
      }
    },
    post_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Post,
        key: 'id'
      }
    }
  }, {
    modelName: 'comment',
    tableName: 'comments',
    sequelize
  });

module.exports = Comment
