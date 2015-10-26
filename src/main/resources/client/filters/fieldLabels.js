'use strict'

// Vendor
var Vue = require('vue');

/**
 * Extract labels from fields
 * @param {Object} fields
 * @return {Array} labels
 */
Vue.filter('fieldLabels', function(fields) {
	var labels = [];
	fields.map(function(field) {
		(field.labels || []).map(function(d) {
			labels.push({
				$index: labels.length,
				$key: field.fieldName,
				$value: d.text
			});
		});
	});
	return labels;
});