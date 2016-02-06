'use strict';

// Vendor
var _clone = require('lodash/lang/clone');
// Utils
var SearchFormUtil = require('utils/SearchFormUtil/SearchFormUtil');

var compareVal = ''; 

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
			activeViolation: ''
		}
	},
	
	ready: function() {
		/**
		 * Get violations and populate array to be used in template
		 */

		 this.$set('activeViolation', compareVal);
		
		SearchFormUtil.getViolations(function(violations) {
			this.$set('violations', _clone(violations));

		}.bind(this));
	},
	methods: {
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
	}
	
};


module.exports = ViolationsDropdown;