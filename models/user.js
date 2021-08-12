const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize("test","root","root", {
    dialect: "mysql",
    host: "localhost"
});

const User = sequelize.define('User', {
    user_login: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    user_email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    user_password: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    // Other model options go here
    modelName: 'user',
    tableName: 'users',
    sequelize
  });

module.exports = User