const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const bearerToken = require('express-bearer-token');
const cors = require('cors');

// 환경번수 세팅
process.env.NODE_ENV = (!!process.env.NODE_ENV) ? process.env.NODE_ENV : 'development';

global.config = require('config');

module.exports = (app) => {
	app.use(bodyParser.json());

	app.use(bodyParser.urlencoded({
		extended: true
	}));

	// CORS 설정
	app.use(cors());

	app.use(cookieParser());
	app.use(compression());
	app.use(bearerToken());

	app.set('view engine', 'ejs');
	app.set('views', path.join(__dirname, '/../app/views'));
	app.set('trust proxy', true);

	app.disable('etag');
	app.disable('x-powered-by');

	console.log('---------------------------------------------------------------');
	console.log('[%s] running by [%s]', global.config.app.name, global.config.app.env);
	console.log('\r');
};