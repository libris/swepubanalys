'use strict';

// Vendor
var Vue = require('vue');
var _each = require('lodash/collection/each');
var _cloneDeep = require('lodash/lang/cloneDeep');
// Mixins
var FractionalMixin = require('mixins/FractionalMixin/FractionalMixin.js');
var HelpMixin = require('mixins/HelpMixin/HelpMixin.js')
// Utils
var SearchFormUtil = require('utils/SearchFormUtil.js');
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
			filterFieldGroups: {},
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
		SearchFormUtil.getFilterFieldGroups(function(filterFieldGroups) {
			this.filterFieldGroups = filterFieldGroups;
		}.bind(this));
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

/**
 * Groups filterFields against filterFieldGroups
 */
Vue.filter('filterFieldGroups', function(filterFields, filterFieldGroups) {
	var groups = {};
	for(var i = 0; i < filterFields.length; i++) {
		var field = filterFields[i].field || '';
		var group = filterFieldGroups[field] || 'none';
		if(!groups[group]) {
			groups[group] = [filterFields[i]];
		}
		else {
			groups[group].push(filterFields[i]);
		}
	}
	filterFields = Object.keys(groups).map(function(key, i) {
		return {
			$index: i,
			$key: key,
			$value: groups[key],
		}
	});
	return filterFields;
});


module.exports = FilterFields;