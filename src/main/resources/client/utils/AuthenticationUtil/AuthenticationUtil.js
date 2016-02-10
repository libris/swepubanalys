'use strict'

/**
 * This utility module is used to ask the server if a user is logged in
 */
var AuthenticationUtil = {
	/**
	 * Attempt to retreive user credentials from server
	 */
	authenticate: function(callback) {
		$.ajax({
			type: 'GET',
			url: 'https://spfs.libris.kb.se/secure', 
			success: function(response) {
				callback(response);
			},
			error: function(response, e) {
				callback({ error: e, response: response });
			}
		});
	}
};

module.exports = AuthenticationUtil;