const express = require('express')
require('dotenv').config()
const helmet = require("helmet")
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { Sequelize } = require('sequelize')
const path = require('path')

const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD, 
    {
        dialect: process.env.DB_DIALECT,
        host: process.env.DB_HOST
});

try {
    sequelize.authenticate();
    console.log('[MYSQL] • CONNECTED');
  } catch (error) {
    console.error('[MYSQL] • ERROR => ', error);
}

const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');

const app = express();


app.use(cookieParser())

// Helmet : pour sécuriser les entêtes des requêtes
app.use(helmet());

// Définition des autorisations des requêtes
app.use((req, res, next) => { 
    res.setHeader('Access-Control-Allow-Origin', `${process.env.APP_FRONTEND}`); // Origine des requêtes autorisée
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // Entêtes autorisées
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // Méthodes autorisées
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Méthodes autorisées
    res.setHeader('Access-Control-Max-Age', '86400'); // Durée de vie d'une requête
    next();
  });

/*app.use(cors({
    credentials: true,
    origin: [process.env.APP_BACKEND, process.env.APP_FRONTEND]
}))*/

app.use(express.json());

app.use("/images", express.static("images"));

app.use('/api', userRoutes);
app.use('/api', postRoutes);

module.exports = app;