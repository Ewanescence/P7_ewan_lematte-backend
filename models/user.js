const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD, 
  {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST
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
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "http://localhost:3000/images/profile_placeholder.png"
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Bienvenue sur votre espace d'échanges en ligne Groupomania, vous pouvez éditer votre profil en utilisant le bouton sur votre droite."
    },
    role: {
      type: DataTypes.STRING,
      alloNull: true,
      defaultValue: "user"
    }
  }, {
    // Other model options go here
    modelName: 'user',
    tableName: 'users',
    sequelize
  });

module.exports = User