'use strict';

// Vendor
var Vue = require('vue');
var _find = require('lodash/collection/find');
// Mixins
var FractionalMixin = require('mixins/FractionalMixin.js');

/**
 * List Preview-component
 * @prop {Object} result
 * @prop {Array} filterFields
 */
var ListPreview = {
	mixins: [FractionalMixin],
	template: require('./ListPreview.html'),
	props: ['result', 'filterFields'],
	data: function() {
		return {
			filterFieldKeys: { },
		}
	},
	ready: function() {
		// On update of filterFields prop, update data.filterFieldKeys
		this.$watch('filterFields', function() {
			if(this.filterFields) {
				var filterFields = this.filterFields;
				// Turn arr into object for access through index
				var n = {};
				for(var i = 0; i < filterFields.length; i++) {
					n[filterFields[i].field] = {
						field: filterFields[i].field,
						fieldName: filterFields[i].fieldName,
						checked: filterFields[i].checked,
					}
				};
				this.$set('filterFieldKeys', n);
			}
			else {
				console.error('*** ListPreview.ready(): filterFields prop required');
			}
		}.bind(this), { deep: true });
	}
};

/**
 * Filter table cells on checked filterFields
 * @param {Array} cells
 * @param {Array} filterFields
 */
Vue.filter('filterFields', function(cells, filterFields) {
	if(filterFields) {
		var filteredCells = [];
		for(var i = 0; i < filterFields.length; i++) {
			if(filterFields[i].checked === true) {
				var cell = _find(cells, function(cell) {
					return '?' + cell.$key === filterFields[i].field;
				});
				filteredCells.push(cell ? cell : { $value: { value: '' }});
			}
		};
		return filteredCells;
	}
	else {
		return [];
	}
});

/**
 * Filter filterFields and return only checked ones
 * @param {Array} filterFields
 */
Vue.filter('onlyCheckedFilterFields', function(filterFieldKeys) {
	if(filterFieldKeys) {
		var checkedFilterFields = [];
		for(var i = 0; i < filterFieldKeys.length; i++) {
			if(filterFieldKeys[i].$value.checked === true) {
				checkedFilterFields.push(filterFieldKeys[i]);
			}
		};
		return checkedFilterFields;
	}
	else {
		return [];
	}
});

module.exports = ListPreview;