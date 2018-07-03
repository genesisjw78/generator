const fs = require('fs');
const path = require("path");

const controllers = require('../app/controllers');

module.exports = (app) => {
	console.log('Initializing routes.');

	fs
		.readdirSync(path.join(__dirname, '../app/controllers'))
		.filter(function (file) {
			return (file.indexOf(".") !== 0) && (file !== 'index.js');
		})
		.forEach(function (file) {
			console.log('/' + file.split('.')[0]);
			app.use('/' + file.split('.')[0], controllers[file.split('.')[0]]);
		});

	console.log('\r');
};