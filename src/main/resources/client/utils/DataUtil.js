'use strict';

var $ = require('jquery');

/**
 * fyllp�
 */
var DataUtil = {
	/**
	 * fyllp�
	 */
	getAggregations: function(callback) {
		$.get('/api/2.0/elastic/aggregations', function(response) {
			callback(response);
		});
	}
};

module.exports = DataUtil;