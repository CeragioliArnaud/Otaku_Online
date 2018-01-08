const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('./Properties/db.properties');
const utils = require('./functionsUtils');

module.exports = {

	get: (key) => {
		return properties.get(key);
	},

	set: (key, value) => {
		if (!utils.isNullOrBlank(key) && !utils.isNullOrBlank(value)) {
			try {
				properties.set(key, value);
			} catch (e) {
				//TODO Gestion erreur
			}
		}
	}
}