const moment = require('moment');
const winston = require('winston');
const logger_server = new (winston.Logger);
const logger_dbManager = new (winston.Logger);

const dir = "./logs";

const logLevels = {
	levels: {
		fatal: 0,
		error: 1,
		warn: 2,
		info: 3,
		debug: 5
	},
	colors: {
		fatal: 'magenta',
		error: 'red',
		warn: 'yellow',
		info: 'green',
		debug: 'white'
	}
};

logger_server.configure({
	levels: logLevels.levels,
	colors: logLevels.colors,
	transports: [
		new winston.transports.Console({
			colorize: true,
			humanReadableUnhandledException: true,
			level: "debug", //prod => "info"...ou error ?
			json: false,
			showLevel: true,
			timestamp() {
				return moment().format('YYYY-MM-DD HH:mm:ss.SSS');
			}
		}),
		new winston.transports.File({
			filename: (dir + "/webServices.log"),
			json: true,
			level: 'info',
			maxFiles: 5,
			maxsize: 500000000,
			name: 'file.infos',
			prettyPrint: false,
			showLevel: true,
			silent: false,
			tailable: true,
			timestamp() {
				return moment().format('YYYY-MM-DD HH:mm:ss.SSS');
			},
			zippedArchive: true
		})
	]
});

logger_dbManager.configure({
	levels: logLevels.levels,
	colors: logLevels.colors,
	transports: [
		new winston.transports.Console({
			colorize: true,
			humanReadableUnhandledException: true,
			level: "debug", //prod => "info"...ou error ?
			json: false,
			showLevel: true,
			timestamp() {
				return moment().format('YYYY-MM-DD HH:mm:ss.SSS');
			}
		}),
		new winston.transports.File({
			filename: (dir + "/dbManager.log"),
			json: true,
			level: 'info',
			maxFiles: 5,
			maxsize: 500000000,
			name: 'file.infos',
			prettyPrint: false,
			showLevel: true,
			silent: false,
			tailable: true,
			timestamp() {
				return moment().format('YYYY-MM-DD HH:mm:ss.SSS');
			},
			zippedArchive: true
		})
	]
});


module.exports = {
	logger_server: logger_server,
	logger_dbManager: logger_dbManager
}