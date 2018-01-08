const S = require('string');

module.exports = {

	isNullOrBlank: (object) => {
		if (object == null || typeof object === 'undefined' || S(object).trim() == "")
			return true;
		return false;
    }
}