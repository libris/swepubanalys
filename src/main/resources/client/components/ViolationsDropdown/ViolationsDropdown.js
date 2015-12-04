'use strict';

// Vendor
var _clone = require('lodash/lang/clone');
// Utils
var SearchFormUtil = require('utils/SearchFormUtil/SearchFormUtil');

/**
 * Violations Dropdown Component
 *
 */
var ViolationsDropdown = {
	props: ['onClickOption'],
	template: require('./ViolationsDropdown.html'),
	data: function() {
		return {
			violations: []
		}
	},
	ready: function() {
		/**
		 * Get violations and populate array to be used in template
		 */
		SearchFormUtil.getViolations(function(violations) {
			this.$set('violations', _clone(violations))
		}.bind(this));
	}
};

module.exports = ViolationsDropdown;