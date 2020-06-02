const config = require('config');
const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');

const db = Object.assign({})
const dbConfig = config.get('db');

db.sequelize = new Sequelize({
    dialect: 'mysql',
    ...dbConfig,
});

fs.readdirSync(`${__dirname}/models`)
    .forEach((file) => {
        if (file.slice(-3) !== '.js') return;
        const model = db.sequelize.import(path.join(`${__dirname}/models`, file));
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) db[modelName].associate(db);
});

module.exports = db;
