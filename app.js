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

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials','true');
    next();
});

app.use('/api', userRoutes);
app.use('/api', postRoutes);

module.exports = app;