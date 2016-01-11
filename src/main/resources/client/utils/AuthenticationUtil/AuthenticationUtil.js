'use strict'

/**
 * This utility module is used to ask the server if a user is logged in
 */
var AuthenticationUtil = {
	/**
	 * Attempt to retreive user credentials from server
	 */
	authenticate: function(callback) {
		callback(false);
	}
};

module.exports = AuthenticationUtil;