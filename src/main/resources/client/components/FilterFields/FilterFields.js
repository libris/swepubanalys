'use strict';

// Vendor
var _each = require('lodash/collection/each');
var _cloneDeep = require('lodash/lang/cloneDeep');
// Mixins
var FractionalMixin = require('mixins/FractionalMixin.js');
var HelpMixin = require('mixins/HelpMixin.js')
// CSS modules
var styles = require('!!style!css?modules!./FilterFields.css');

/**
 * Filter Fields component
 * @prop {Array} filterFields
 * @prop {Array} defaultFilterFields
 */
var FilterFields = {
	mixins: [FractionalMixin, HelpMixin],
	props: ['filterFields', 'defaultFilterFields'],
	template: require('./FilterFields.html'),
	data: function() {
		return {
			_styles: styles,
		}
	},
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
	},
	ready: function() {
		this.initHelp({
			title: 'FRAKTIONERAD DATA',
			content: require('./filterFields.Help.html'),
			anchorToElement: this.$el.getElementsByClassName('fractSymbol')[0],
			placement: 'top',
			marginLeft: '3px',
			marginTop: '-15px'
		});
	}
};

module.exports = FilterFields;