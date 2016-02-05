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
			violations: [],
			styleObject: {
			    color: 'red',
			    fontSize: '13px'
			  },
			compare: function() {
				console.log('hej');
				if (1 == 2) {
		    		return true;
		    	}
		    	else {
		    		return false;
		    	}

			}  
		}
	},
	ready: function() {
		/**
		 * Get violations and populate array to be used in template
		 */
		/*
		SearchFormUtil.getCleanViolations(function(violationsObjects) {
			this.$set('violations', _clone(violationsObjects))

		}.bind(this));
		*/
		
		SearchFormUtil.getViolations(function(violations) {
			this.$set('violations', _clone(violations))

		}.bind(this));
	}
	
};

//violation.text == 'Ämne saknas'

module.exports = ViolationsDropdown;