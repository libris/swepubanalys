'use strict';

// Vendor
var Vue = require('vue');
var _find = require('lodash/collection/find');
var _assign = require('lodash/object/assign');
// Mixins
var FractionalMixin = require('mixins/FractionalMixin/FractionalMixin.js');
// CSS modules
var styles = _assign(require('!!style!css?modules!./ListPreview.css'), require('!!style!css?modules!css/StaticHeader.css'));

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
			_styles: styles,
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
				console.error('*** ListPreview.ready: filterFields prop required');
			}
		}.bind(this), { deep: true });
	},
	methods: {
		/**
		 * Used to determine whether a field should constitute a link.
		 * This method is not for validating Urls and VERY basic! It only checks if the
		 * string starts with "http://"
		 */
		startsWithHttp: function(str) {
			return str.search(/http\:\/\//i) === 0;
		}
	}
};

/**
 * Filter table cells on checked filterFields
 * @param {Object} cells
 * @param {Array} filterFields
 */
Vue.filter('filterFields', function(cells, filterFields) {
	if(filterFields) {
		var filteredCells = [];
		for(var i = 0; i < filterFields.length; i++) {
			if(filterFields[i].checked === true) {
				var fieldName = filterFields[i].field ? filterFields[i].field.substring(1) : undefined;
				if(fieldName) {
					var cell = cells[fieldName];
					if(cell) {
						filteredCells.push(cell);
					} else {
						filteredCells.push({ value: '' });
					}
				}
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
 * @param {Object} filterFields
 */
Vue.filter('onlyCheckedFilterFields', function(filterFieldKeys) {
	if(filterFieldKeys) {
		var checkedFilterFields = [];
		Object.keys(filterFieldKeys).map(function(key) {
			var filterFieldKey = filterFieldKeys[key];
			if(filterFieldKey.checked === true) {
				checkedFilterFields.push(filterFieldKey);
			}
		});
		return checkedFilterFields;
	}
	else {
		return [];
	}
});

module.exports = ListPreview;