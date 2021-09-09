const User = require('./user');

const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD, 
  {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST
});

const Post = sequelize.define('Post', {
    post_content:  {
      type: DataTypes.STRING,
      allowNull: false
    },
    post_media: {
      type: DataTypes.STRING,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id'
      }
    }
  }, {
    modelName: 'post',
    tableName: 'posts',
    sequelize
  });

module.exports = Post
