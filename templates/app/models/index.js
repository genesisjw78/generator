const fs = require("fs");
const path = require("path");
const Sequelize = require('sequelize');

const db = {};

const sequelize = new Sequelize(global.config.database.dbname[0], global.config.database.user, global.config.database.password, {
	host: global.config.database.host,
	port: global.config.database.port,
	dialect: global.config.database.protocol,
	username: global.config.database.user,
	password: global.config.database.password,
	define: {
		freezeTableName: true
	}
});

fs
	.readdirSync(__dirname)
	.filter(function (file) {
		return (file.indexOf(".") !== 0) && (file !== 'index.js') && (file !== '_query.js') && (file !== 'v2');
	})
	.forEach(function (file) {
		var model = sequelize.import(path.join(__dirname, file));
		db[model.name] = model;
	});

Object.keys(db).forEach(function (modelName) {
	if ("associate" in db[modelName]) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;

module.exports = db;