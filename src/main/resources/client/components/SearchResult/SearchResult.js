'use strict';

// Vendor
var _each = require('lodash/collection/each');
var _cloneDeep = require('lodash/lang/cloneDeep');
var _findIndex = require('lodash/array/findIndex');
// Utils
var SparqlUtil = require('utils/SparqlUtil.js');
// Components
var ListPreview = require('components/ListPreview/ListPreview.js');

/**
 * Search Result-component
 * @prop {Object} formModel
 */
var SearchResult = {
	template: require('./SearchResult.html'),
	props: ['formModel'],
	data: function() {
		return {
			// UI state
			showFilterFields: false,
			// Data
			query: '',
			templateName: '',
			filterFields: [],
			result: {
				head: {
					vars: [],
				},
				results: {
					bindings: [],
				}
			},
		};
	},
	watch: {
		/**
		 *
		 */
		'formModel': function() {
			// If templateName has changed since update, renew filterFields list
			if(this.formModel.templateName !== this.templateName) {
				this.$set('templateName', this.formModel.templateName);
				// Will also trigger updateQuery()
				this.$set('filterFields', SparqlUtil.getFilterFields(this.formModel.templateName));
			}
			else {
				this.updateQuery({ formModelChanged : true });
			}
		},
	},
	ready: function() {
		// Watch for mutation of filterFields, regenerate query if this occurs
		this.$watch('filterFields', function() {
			this.updateQuery();
		}.bind(this), { deep: true });
		// Generate query on ready hook
		this.updateQuery();
	},
	components: {
		'list-preview': ListPreview,
	},
	methods: {
		/**
		 *
		 */
		selectNoFilterFields: function() {
			_each(this.filterFields, function(field) {
				field.$set('checked', false);
			});
		},
		/**
		 *
		 */
		selectAllFilterFields: function() {
			_each(this.filterFields, function(field) {
				field.$set('checked', true);
			});
		},
		/**
		 *
		 */
		toggleShowFilterFields: function() {
			this.$set('showFilterFields', !this.showFilterFields);
		},
		/**
		 * This function generates two queries. 
		 * 
		 * One is posted to the server, the result of which is sent as a prop to the ListPreview-component. 
		 * However, the query is only posted if there are checked filterFields which are not stored in a 
		 * previous result, or if the conf.formModelChanged configuration is set to true, since a changed 
		 * formModel should result in a posted query anyway. Thus, we do not compare the data.formModel 
		 * with to a previous result as with filterFields, and leave that to the caller. 
		 *
		 * The other query is set to data.query to display in the interface.
		 * @param {Object} conf
		 */
		updateQuery: function(conf) {
			var formModel = _cloneDeep(this.formModel);
			formModel.filterFields = this.filterFields;
			var formModelChanged = conf ? (conf.formModelChanged ? true : false) : false;
			if(this.formModel.templateName) {
				// *** Post "Preview-query" if there are selected filterFields which does not exist in result
				// *** Update list preview with result
				SparqlUtil.generateQuery({
					limit: true,
					formModel: formModel
				}, function(query) {
					for(var i = 0; i < formModel.filterFields.length; i++) {
						if(formModel.filterFields[i].checked === true) {
							var index = _findIndex(this.result.head.vars, function(field) {
								return '?' + field === formModel.filterFields[i].field;
							});
							if(index === -1 || formModelChanged === true) {
								console.log('*** SearchResults.updateQuery(): Posting query');
								this.postQuery(query, function(result) {
									this.$set('result', result);
								}.bind(this));
								return false;
							}
						}
					}
				}.bind(this));
				// *** Generate new query for query-window
				SparqlUtil.generateQuery({
					limit: false,
					formModel: formModel
				}, function(query) {
					this.$set('query', query);
				}.bind(this));
			}
		},
		/**
		 *
		 */
		postQuery: function(query, callback) {
			SparqlUtil.postQuery(query, function(response) {
				// Validate response here
				callback(response);
			}.bind(this));
			if(!query) {
				console.error('*** SearchResult.postQuery(): No query argument provided');
				return false;
			}
			if(!callback) {
				console.error('*** SearchResult.postQuery(): No callback provided');
				return false;
			}
		}
	}
};

module.exports = SearchResult;