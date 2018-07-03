const http = require('http').Server;
const path = require('path');

const express = require('express');

// 환경세팅
const environment = require('./config/environment');

//라우터 세팅
const route = require('./config/routes');

// 1. Run server
(() => {
	const app = express();
	const server = http(app);

	environment(app);
	route(app);

	if (config.http.enable) {
		httpServ = app.listen(app.get('port'), function () {
			console.log('[%s] (http) listening on port [%s]', global.config.app.name, httpServ.address().port);
			console.log('---------------------------------------------------------------');
		});
	}

	if (config.https.enable) {
		httpsServ = https.createServer({
			key: fs.readFileSync(config.https.key),
			cert: fs.readFileSync(config.https.cert),
			passphrase: config.https.passphrase
		}, app);
		httpsServ.listen(config.https.port, function () {
			console.log('[%s] (https) listening on port [%s]', global.config.app.name, httpsServ.address().port);
			console.log('---------------------------------------------------------------');
		});
	}
})();

// 2. Close connection before shutdown
//process.on('SIGINT', shutdown);
//process.on('SIGTERM', shutdown);

function shutdown(e) {
	Promise.all([
		/*
		        new Promise((rs, rj) => {
		            mongo.close(() => {
		                return rs();
		            });
		        }),
		        new Promise((rs, rj) => {
		            redis.close(() => {
		                return rs();
		            });
		        })

		*/
	]).then(() => {
		setTimeout(() => {
			console.log('* Closed all connections');
			process.exit(0);
		}, 300);

	}).catch((err) => {
		setTimeout(() => {
			console.error('* Error has occurred when closing connections');
			console.error(err);
			process.exit(1);
		}, 300);
	});
}