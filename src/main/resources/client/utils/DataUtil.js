'use strict';

var $ = require('jquery');

/**
 * fyllpå
 */
var DataUtil = {
	/**
	 * fyllpå
	 */
	getAggregations: function(callback) {
		$.get('/api/2.0/elastic/aggregations', function(response) {
			callback(response);
		});
	}
};

module.exports = DataUtil;