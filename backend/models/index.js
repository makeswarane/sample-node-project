const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
require('../config/config');
const db = {};

const sequelize = new Sequelize(CONFIG.db_name, CONFIG.db_user, CONFIG.db_pass, {
    host : CONFIG.db_host,
    dialect : CONFIG.db_dialect,
    port : CONFIG.db_port,
    operatorsAliases: false,
    define: {
      timestamps: false
    },
    dialectOptions: {
      decimalNumbers: true
    },
    pool: {
      max: Number(CONFIG.pool_max),
      min: Number(CONFIG.pool_min),
      idleTime: CONFIG.pool_idle_time
    }
});

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });


Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

module.exports = db;