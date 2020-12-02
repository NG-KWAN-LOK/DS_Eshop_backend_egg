'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'test';
// var config = require(__dirname + '/../database/config.json')[env];
var config = require(path.join(__dirname, '..', '..', 'database', 'config.json'))[env];
const db = {};
var sequelize;

if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
    console.log('.......................', env);
}

//test for connection
try {
    sequelize.authenticate();
    console.log('DB Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}


fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        //下面這行因為Sequelize v6.0.0 import模組被刪掉，所以出錯，得改成用commentJS 來require

        console.log('\nEnter: ', path.join(__dirname, file));
        // const model = sequelize['import'](path.join(__dirname, file));
        const model = require(path.join(__dirname, file))(sequelize, Sequelize);
        db[model.name] = model;
        console.log('Out: ', model.name);

    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;
// db.users = require('./users')(sequelize, Sequelize);
console.log("end of index.js");
module.exports = db;
