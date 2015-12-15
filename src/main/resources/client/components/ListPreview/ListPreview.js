'use strict';

// Vendor
var Vue = require('vue');
var _assign = require('lodash/object/assign');
var $ = require('jquery');
// Mixins
var FractionalMixin = require('mixins/FractionalMixin/FractionalMixin.js');
// CSS modules
var styles = _assign(
	require('./ListPreview.css'),
	require('css/modules/StaticHeader.css')
);

var show = 50;

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
            show: show,
			_styles: styles,
		}
	},
    computed: {
        /**
         * Show only <this.show> amount of rows
         */
        articles: function() {
            var articles = ((this.result && this.result.results && this.result.results.bindings) ? this.result.results.bindings : []);
            return articles.slice(0, this.show);
        }
    },
	methods: {
		/**
		 * For old browsers
		 */
		onScrollContainer: function(e) {
			this.onScroll(this.$els.container);
		},
		/**
		 * If we reach the bottom of the <tbody>, load more rows
		 */
		onScrollTbody: function(e) {
			this.onScroll(this.$els.tBody);
			
		},
		/**
		 * Load more rows
		 */
		onScroll: function(el) {
			if($(el).scrollTop() + $(el).innerHeight() >= $(el)[0].scrollHeight) {
				this.$set('show', this.show+show);
			}
		},
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