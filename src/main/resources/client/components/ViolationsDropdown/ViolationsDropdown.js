'use strict';

// Vendor
var Vue = require('vue');
var _clone = require('lodash/lang/clone');
var _sortBy = require('lodash/collection/sortBy');
// Utils
var SearchFormUtil = require('utils/SearchFormUtil/SearchFormUtil');

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
		/**
		 * Get violations and populate array to be used in template
		 */

		//this.$set('activeViolation', compareVal);
		SearchFormUtil.getViolations(function(violations) {
			this.$set('violations', _clone(violations));
			//console.log(_clone(violations));

		}.bind(this));
	},
	methods: {
		//Start of work to mark selected values in dropdown 
		 /*
		compareActive: function(valueble) {
			//gets choosen vialation 
			//console.log(valueble);
			compareVal = valueble;
		},
		returnCompare: function(val) {
			console.log(val);

			if (val == compareVal) {
				return true;
			}
			else {
				return false;
			}
		}
		*/
	}
	
};

Vue.filter('orderViolations', function(violations) {
	violations = _sortBy(violations, function(violation) {
		return violation.grade;
	});
	return violations.reverse();
});



module.exports = ViolationsDropdown;