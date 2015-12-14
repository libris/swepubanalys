'use strict';

// Vendor
var Vue = require('vue');
var _find = require('lodash/collection/find');
var _assign = require('lodash/object/assign');
// Mixins
var FractionalMixin = require('mixins/FractionalMixin/FractionalMixin.js');
// CSS modules
var styles = _assign(
	require('./ListPreview.css'),
	require('css/modules/StaticHeader.css')
);

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
			_styles: styles,
		}
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
						if(fieldName === '_doiValue' && !this.startsWithHttp(cell.value)) {
							cell.value = 'http://dx.doi.org/' + cell.value;
						}
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
Vue.filter('onlyCheckedFilterFields', function(filterFields) {
    return filterFields.filter(function(field) {
        return field.checked === true;
    });
});

module.exports = ListPreview;