'use strict';

// Vendor
var $ = require('jquery');

/**
 * Data util. Used to fetch data from server
 */
var DataUtil = {
	/**
	 * Gets aggregations without providing formModel
	 * @param {Function} callback
	 */
	getAggregations: function(callback) {
		$.ajax({
			type: 'GET',
			url: '/api/2.0/elastic/aggregations', 
			success: function(response) {
				callback(response);
			},
			error: function(response, e) {
				callback({ error: e, response: response });
			}
		});
	},
	/**
	 * Gets aggregations by providing formModel
	 * @param {formModel}
	 * @param {Function} callback
	 */
	getFilterAggregations: function(formModel, callback) {
        $.ajax({
			type: 'GET',
			url: '/api/2.0/elastic/aggregations',
			data: {
				model: JSON.stringify(formModel),
			},
			success: function(response) {
				callback(response);

			},
			error: function(response, e) {
				callback({ error: e, response: response });
			}
		});
	}
};

module.exports = DataUtil;