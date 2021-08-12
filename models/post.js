const User = require('./user');

const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize("test","root","root", {
    dialect: "mysql",
    host: "localhost"
});

const Post = sequelize.define('Post', {
    post_title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    post_content:  {
      type: DataTypes.STRING,
      allowNull: false
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