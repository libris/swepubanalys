'use strict'
/**
 * This utility module is used to retrive technical information
 */
var $ = require('jquery');

var TechnicalInfoUtil = {
	/**
	 * Attempt to retreive technical information from server
	 */
	getTechInfo: function(callback) {
		$.ajax({
			type: 'GET',
			url: '/api/2.0/technicalInfo', 
			success: function(response) {
				callback(response);		
			},
			error: function(response, e) {
				callback({ error: e, response: response });
			}
		});
		
	}
};

module.exports = TechnicalInfoUtil;