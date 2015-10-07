'use strict';

// Vendor
var _each = require('lodash/collection/each');
var _cloneDeep = require('lodash/lang/cloneDeep');
// Mixins
var FractionalMixin = require('mixins/FractionalMixin.js');
// CSS
require('./FilterFields.css');

/**
 * Filter Fields component
 * @prop {Array} filterFields
 * @prop {Array} defaultFilterFields
 */
var FilterFields = {
	mixins: [FractionalMixin],
	props: ['filterFields', 'defaultFilterFields'],
	template: require('./FilterFields.html'),
	methods: {
		/**
		 * User wants to select no filterFields
		 */
		selectNoFilterFields: function() {
			_each(this.filterFields, function(field) {
				field.$set('checked', false);
			});
		},
		/**
		 * User wants to select all filterFields
		 */
		selectAllFilterFields: function() {
			_each(this.filterFields, function(field) {
				field.$set('checked', true);
			});
		},
		/**
		 * User wants to select default filterFields
		 */
		selectDefaultFilterFields: function() {
			this.$set('filterFields', _cloneDeep(this.defaultFilterFields));
		}
	}
};

module.exports = FilterFields;