const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const cors = require('cors');
const cryptoService = require('./services/crypto.service');
const v1 = require('./routes/v1');
const models = require('./models');
const { limiter } = require('./middlewares/rateLimiter');
const mysql = require('mysql2/promise'); // <-- NEW

const app = express();
app.use("/healthcheck", require("express-healthcheck")());


app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(limiter);

async function ensureDatabaseExists() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    console.log("Database created or already exists");
    await connection.end();
  } catch (err) {
    console.error("Failed to create database:", err);
    process.exit(1);
  }
}
ensureDatabaseExists().then(() => {
  return models.sequelize.authenticate();
}).then(() => {
  console.log('Sequelize connected to database');
  if (CONFIG.app === 'local') {
    return models.sequelize.sync();
  }
}).catch((err) => {
  console.error('Unable to connect with database:', err);
});

app.use(cors({
  origin: 'https://test.rochedev.info',
  credentials: true
}));

app.use(function (req, res, next) {
  if(req.headers.authorization){
    req.headers.authorization = cryptoService.decrypt(req.headers.authorization);
  }
  next();
});

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST,PUT, , OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, content-type, Authorization, Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Cache-Control", "no-cache ,no-store");
    next();
  });

app.use('/v1', v1);

module.exports = app;
