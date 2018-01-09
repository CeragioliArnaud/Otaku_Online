const S = require('string');

module.exports = {

	isNullOrBlank: (object) => {
		if (object == null || typeof object === 'undefined' || S(object).trim() == "")
			return true;
		return false;
	},

	isCallback: (object) => {
		if (object && typeof object === "function")
			return true;
		return false;
	},

	isEmail: (text) => {
		if (S(text).match( 	
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
			return true;
		return false;
	}
}