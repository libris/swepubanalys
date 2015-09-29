'use strict';

// Vendor
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
			fields: [],
			articles: [],
			checkedFilterFields: { },
		}
	},
	ready: function() {
		// On update of filterFields prop, update data.checkedFilterFields
		this.$watch('filterFields', function() {
			if(this.filterFields) {
				// Get currently checked filterFields
				var checkedFilterFields = _cloneDeep(this.filterFields).filter(function(filterField) {
					return filterField.checked === true;
				});
				// Make array to object in order to access through index
				var filterFields = {};
				checkedFilterFields.map(function(filterField) {
					filterFields[filterField.field] = filterField.fieldName;
				});
				this.$set('checkedFilterFields', filterFields);
				this.update();
			}
			else {
				console.error('*** ListPreview.ready(): Invalid filterFields prop');
			}
		}.bind(this), { deep: true });
	},
	watch: {
		/**
		 * On update result prop, trigger update of list
		 */
		'result': function() {
			this.update();
		},
	},
	methods: {
		/**
		 * Makes use of result prop and data.checkedFilterFields to set data.articles which is
		 * rendered in view.
		 */
		update: function() {
			if(this.result && this.result.results && this.result.results.bindings && this.result.head && this.result.head.vars) {
				var previewList = this.result.results.bindings.map(function(article, i) {
					var fields = this.result.head.vars.filter(function(field) {
						return this.checkedFilterFields['?' + field] ? true : false;
					}.bind(this));
					fields = fields.map(function(field) {
						return {
							field: field,
							value: article[field] ? article[field].value : '',
						}
					});
					return {
						article: i,
						fields: fields,
					}
				}.bind(this));
				this.$set('articles', previewList);
			}
			else {
				console.error('*** ListPreview.update(): Invalid result prop');
			}
		}
	}
};

module.exports = ListPreview;