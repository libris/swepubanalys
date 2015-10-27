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
		$.get('/api/2.0/elastic/aggregations', function(response) {
			callback(response);
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
			cossDomain: true,
			async: true,
			success: function(response) {
				callback(response);
			},
			error: function(response, e) {
				console.log(e);
			}
		});
	}
};

module.exports = DataUtil;