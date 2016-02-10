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
			url: '/api/2.0/security', 
			success: function(response) {
				//https://spfs.libris.kb.se/secure
				callback(response);
			},
			error: function(response, e) {
				callback({ error: e, response: response });
			}
		});
	}
};

module.exports = AuthenticationUtil;