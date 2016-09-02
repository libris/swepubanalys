'use strict';

// Vendor
var Vue = require('vue');
var _clone = require('lodash/lang/clone');
var _sortBy = require('lodash/collection/sortBy');
// Utils
var SearchFormUtil = require('utils/SearchFormUtil/SearchFormUtil');
var DataUtil = require('utils/DataUtil/DataUtil.js');

//var compareVal = '';

/**
 * Violations Dropdown Component
 *
 */
var ViolationsDropdown = {
	props: ['onClickOption'],
	template: require('./ViolationsDropdown.html'),
	data: function() {
		return {
			violations: [],
			activeViolation: '',
			selected: '',
		}
	},

	ready: function() {
		DataUtil.getAggregations(function(data) {
 	        //console.log(data);
	      });
		/**
		 * Get violations and populate array to be used in template
		 */
		SearchFormUtil.getViolations(function(violations) {
			this.$set('violations', _clone(violations));
		}.bind(this))
	},
	methods: {
	}

};

Vue.filter('orderViolations', function(violations) {
	violations = _sortBy(violations, function(violation) {
		return violation.grade;
	});
	return violations.reverse();
});



module.exports = ViolationsDropdown;
