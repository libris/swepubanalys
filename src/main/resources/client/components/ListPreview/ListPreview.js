'use strict';

// Vendor
var Vue = require('vue');
var _cloneDeep = require('lodash/lang/cloneDeep');

/**
 * List Preview-component
 * @prop {Object} result
 * @prop {Array} filterFields
 */
var ListPreview = {
	template: require('./ListPreview.html'),
	props: ['result', 'filterFields'],
	data: function() {
		return {
			checkedFilterFields: { },
		}
	},
	ready: function() {
		// On update of filterFields prop, update data.checkedFilterFields
		this.$watch('filterFields', function() {
			if(this.filterFields) {
				var filterFields = this.filterFields;
				// Turn arr into object for access through index
				var n = {};
				for(var i = 0; i < filterFields.length; i++) {
					n[filterFields[i].field] = {
						fieldName: filterFields[i].fieldName,
						checked: filterFields[i].checked,
					}
				};
				this.$set('checkedFilterFields', n);
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
	var filteredCells = [];
	for(var i = 0; i < cells.length; i++) {
		if(filterFields['?' + cells[i].$key] && filterFields['?' + cells[i].$key].checked === true) {
			filteredCells.push(cells[i]);
		}
	};
	return filteredCells;
});

/**
 * Filter filterFields and return only checked ones
 * @param {Array} filterFields
 */
Vue.filter('onlyCheckedFilterFields', function(filterFields) {
	var checkedFilterFields = [];
	for(var i = 0; i < filterFields.length; i++) {
		if(filterFields[i].$value.checked === true) {
			checkedFilterFields.push(filterFields[i]);
		}
	};
	return checkedFilterFields;
});

module.exports = ListPreview;