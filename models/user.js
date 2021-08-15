const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize("test","root","root", {
    dialect: "mysql",
    host: "localhost"
});

const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
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