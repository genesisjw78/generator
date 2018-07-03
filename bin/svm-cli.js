#!/usr/bin/env node

var program = require('commander');
var mkdirp = require('mkdirp');
var os = require('os');
var fs = require('fs');
var path = require('path');
var readline = require('readline');
var sortedObject = require('sorted-object');

var _exit = process.exit;
var eol = os.EOL;
var pkg = require('../package.json');

var version = pkg.version;

// Re-assign process.exit because of commander
// TODO: Switch to a different command framework
process.exit = exit

// CLI

before(program, 'outputHelp', function () {
	this.allowUnknownOption();
});

program
	.version(version)
	.usage('[options] [dir]')
	.option('    --git', 'add .gitignore')
	.option('-f, --force', 'force on non-empty directory')
	.parse(process.argv);

if (!exit.exited) {
	main();
}

/**
 * Install a before function; AOP.
 */

function before(obj, method, fn) {
	var old = obj[method];

	obj[method] = function () {
		fn.call(this);
		old.apply(this, arguments);
	};
}

/**
 * Prompt for confirmation on STDOUT/STDIN
 */

function confirm(msg, callback) {
	var rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	rl.question(msg, function (input) {
		rl.close();
		callback(/^y|yes|ok|true$/i.test(input));
	});
}

/**
 * Create application at the given directory `path`.
 *
 * @param {String} path
 */

function createApplication(app_name, path) {
	var wait = 5;

	console.log();

	function complete() {
		if (--wait) return;
		var prompt = launchedFromCmd() ? '>' : '$';

		console.log();
		console.log('   install dependencies:');
		console.log('     %s cd %s && npm install', prompt, path);
		console.log();
		console.log('   run the app:');

		if (launchedFromCmd()) {
			console.log('     %s SET DEBUG=%s:* & npm start', prompt, app_name);
		} else {
			console.log('     %s DEBUG=%s:* npm start', prompt, app_name);
		}

		console.log();
	}

	// JavaScript
	var app = loadTemplate('app.js');
	var controllers_index = loadTemplate('app/controllers/index.js');
	var controllers_user = loadTemplate('app/controllers/user.js');
	var models_index = loadTemplate('app/models/index.js');
	var models_user = loadTemplate('app/models/users.js');

	// config
	var config_default = loadTemplate('config/default.json');
	var config_development = loadTemplate('config/development.json');
	var config_production = loadTemplate('config/production.json');
	var config_staging = loadTemplate('config/staging.json');

	var config_env = loadTemplate('config/environment.js');
	var config_routes = loadTemplate('config/routes.js');

	var root_readme = loadTemplate('README.md');

	mkdir(path, function () {

		//app
		mkdir(path + '/app', function () {
			mkdir(path + '/app/controllers', function () {
				write(path + '/app/controllers/index.js', controllers_index);
				write(path + '/app/controllers/user.js', controllers_user);
				complete();
			});
			mkdir(path + '/app/models', function () {
				write(path + '/app/models/index.js', models_index);
				write(path + '/app/models/users.js', models_user);
				complete();
			});
		});

		mkdir(path + '/config', function () {
			write(path + '/config/default.json', config_default);
			write(path + '/config/development.json', config_development);
			write(path + '/config/production.json', config_production);
			write(path + '/config/staging.json', config_staging);

			write(path + '/config/environment.js', config_env);
			write(path + '/config/routes.js', config_routes);
			complete();
		});

		// package.json
		var pkg = {
			name: app_name,
			version: '0.0.0',
			private: true,
			scripts: {
				"start": "node ./app.js",
				"debug": "node --inspect-brk=9229 app.js"
			},
			dependencies: {
				"async": "^2.6.1",
				"body-parser": "~1.18.3",
				"compression": "^1.7.2",
				"config": "^1.30.0",
				"cookie-parser": "~1.4.3",
				"cors": "^2.8.4",
				"debug": "~2.6.9",
				"express": "~4.16.0",
				"express-bearer-token": "^2.1.1",
				"http-errors": "~1.6.2",
				"lodash": "^4.17.10",
				"morgan": "~1.9.0",
				"mysql2": "^1.5.3",
				"response-format": "^1.0.4",
				"sequelize": "^4.37.10",
				"uuid-random": "^1.0.6",
				"validator": "^10.3.0"
			}
		}


		// sort dependencies like npm(1)
		pkg.dependencies = sortedObject(pkg.dependencies);

		// write files
		write(path + '/package.json', JSON.stringify(pkg, null, 2));
		write(path + '/app.js', app);
		write(path + '/README.md', root_readme);

		mkdir(path + '/bin', function () {
			//			www = www.replace('{name}', app_name);
			//			write(path + '/bin/www', www, 0755);
			complete();
		});

		write(path + '/.gitignore', fs.readFileSync(__dirname + '/../templates/gitignore', 'utf-8'));

		complete();
	});
}

function copy_template(from, to) {
	from = path.join(__dirname, '..', 'templates', from);
	write(to, fs.readFileSync(from, 'utf-8'));
}

/**
 * Check if the given directory `path` is empty.
 *
 * @param {String} path
 * @param {Function} fn
 */

function emptyDirectory(path, fn) {
	fs.readdir(path, function (err, files) {
		if (err && 'ENOENT' != err.code) throw err;
		fn(!files || !files.length);
	});
}

/**
 * Graceful exit for async STDIO
 */

function exit(code) {
	// flush output for Node.js Windows pipe bug
	// https://github.com/joyent/node/issues/6247 is just one bug example
	// https://github.com/visionmedia/mocha/issues/333 has a good discussion
	function done() {
		if (!(draining--)) _exit(code);
	}

	var draining = 0;
	var streams = [process.stdout, process.stderr];

	exit.exited = true;

	streams.forEach(function (stream) {
		// submit empty write request and wait for completion
		draining += 1;
		stream.write('', done);
	});

	done();
}

/**
 * Determine if launched from cmd.exe
 */

function launchedFromCmd() {
	return process.platform === 'win32' &&
		process.env._ === undefined;
}

/**
 * Load template file.
 */

function loadTemplate(name) {
	return fs.readFileSync(path.join(__dirname, '..', 'templates', name), 'utf-8');
}

/**
 * Main program.
 */

function main() {
	// Path
	var destinationPath = program.args.shift() || '.';

	// App name
	var appName = path.basename(path.resolve(destinationPath));

	// Template engine
	program.template = 'jade';
	if (program.ejs) program.template = 'ejs';
	if (program.hogan) program.template = 'hjs';
	if (program.hbs) program.template = 'hbs';

	// Generate application
	emptyDirectory(destinationPath, function (empty) {
		if (empty || program.force) {
			createApplication(appName, destinationPath);
		} else {
			confirm('destination is not empty, continue? [y/N] ', function (ok) {
				if (ok) {
					process.stdin.destroy();
					createApplication(appName, destinationPath);
				} else {
					console.error('aborting');
					exit(1);
				}
			});
		}
	});
}

/**
 * echo str > path.
 *
 * @param {String} path
 * @param {String} str
 */

function write(path, str, mode) {
	fs.writeFileSync(path, str, {
		mode: mode || 0666
	});
	console.log('   \x1b[36mcreate\x1b[0m : ' + path);
}

/**
 * Mkdir -p.
 *
 * @param {String} path
 * @param {Function} fn
 */

function mkdir(path, fn) {
	mkdirp(path, 0755, function (err) {
		if (err) throw err;
		console.log('   \033[36mcreate\033[0m : ' + path);
		fn && fn();
	});
}