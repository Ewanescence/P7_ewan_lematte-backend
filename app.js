const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize("test","root","root", {
    dialect: "mysql",
    host: "localhost"
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

app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:8080']
}))

app.use(express.json());

app.use("/images", express.static("images"));

app.use('/api', userRoutes);
app.use('/api', postRoutes);

module.exports = app;