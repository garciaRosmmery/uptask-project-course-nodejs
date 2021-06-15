const { Sequelize } = require('sequelize');

//-- Extraer valores de .env
require('dotenv').config({path: '.env'});

// Option 2: Passing parameters separately (other dialects)
const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, '', {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  port: process.env.DB_PORT,
  //operatorsAliases: false,
  define: {
      timestamps: false
  },
  pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      adle: 10000
  }
});

module.exports = db;