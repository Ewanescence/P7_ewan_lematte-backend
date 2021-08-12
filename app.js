const express = require('express');


const { Sequelize } = require('sequelize');
const sequelize = new Sequelize("test","root","root", {
    dialect: "mysql",
    host: "localhost"
});

const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');

try {
    sequelize.authenticate();
    console.log('[MYSQL] • CONNECTED');
  } catch (error) {
    console.error('[MYSQL] • ERROR => ', error);
}

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/user', userRoutes);
app.use('/post', postRoutes);

module.exports = app;