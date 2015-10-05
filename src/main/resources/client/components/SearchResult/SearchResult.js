'use strict';

// Vendor
var _each = require('lodash/collection/each');
var _cloneDeep = require('lodash/lang/cloneDeep');
var _findIndex = require('lodash/array/findIndex');
// Utils
var SparqlUtil = require('utils/SparqlUtil.js');
// Components
var ListPreview = require('components/ListPreview/ListPreview.js');
// CSS
require('css/transitions.css');
require('./SearchResult.css');

/**
 * Search Result-component
 * @prop {Object} formModel
 */
var SearchResult = {
	template: require('./SearchResult.html'),
	props: ['formModel'],
	data: function() {
		return {
			// Flags
			formModelHasChanged: false, // To let methods.updateQuery() know that formModel has changed and that a POST should be performed
			// UI state
			showFilterFields: false,
			pendingUpdate: true,
			pendingRefresh: true,
			pendingExport: false,
			// Data
			query: '',
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
	/** 
	 * Ready hook adds deep listener to data.filterFields and triggers formModelChanged()
	 */ 
	ready: function() {
		// Watch for mutation of formModel, regenerate query if this occurs
		this.$watch('formModel', function() {
			this.formModelChanged();
		}.bind(this));
		// Watch for deep mutation of filterFields, regenerate query if this occurs
		this.$watch('filterFields', function() {
			// Call after current stack has finished executing, so the GUI may update before
			// queries are generated etc...
			setTimeout(function() { this.filterFieldsChanged(); }.bind(this), 0);
		}.bind(this), { deep: true });
		// Generate query on ready hook
		this.formModelChanged();
	},
	components: {
		'list-preview': ListPreview,
	},
	methods: {
		/** 
		 * Should be called if props.formModel has been received or updated. Gets appropriate filterFields according
		 * to template name and updates data.filterFields accordingly
		 */
		formModelChanged: function() {
			if(this.formModel && this.formModel.templateName && this.formModel.templateName.length > 0) {
				this.$set('formModelHasChanged', true);
				this.$set('pendingExport', false);
				this.$set('filterFields', SparqlUtil.getFilterFields(this.formModel.templateName)); // Will in turn trigger updateQuery()
			}
		},
		/**
		 * Should be called if data.filterFields has been mutated. This can be triggered either by the user interacting
		 * with the GUI or if formModelChanged(). We subsequently updateQuery(), and let that function decide whether
		 * to do a POST or not
		 */
		filterFieldsChanged: function() {
			this.updateQuery();
		},
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
		 * User wants to see filterFields
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
		updateQuery: function() {
			var formModel = _cloneDeep(this.formModel);
			formModel.filterFields = this.filterFields;
			var formModelChanged = this.formModelHasChanged;
			if(formModelChanged === true) { this.$set('formModelHasChanged', false); };
			if(this.formModel.templateName) {
				// *** Post "Preview-query" if there are selected filterFields which does not exist in result
				// *** Update list preview with result
				SparqlUtil.generateQuery({
					limit: true,
					formModel: formModel
				}, function(query) {
					for(var i = 0; i < formModel.filterFields.length; i++) {
						if(formModel.filterFields[i].checked === true) {
							if(this.result && this.result.head && this.result.head.vars) {
								var index = _findIndex(this.result.head.vars, function(field) {
									return '?' + field === formModel.filterFields[i].field;
								});
								if(index === -1 || formModelChanged === true) {
									console.log('*** SearchResults.updateQuery(): Posting query');
									this.$set(formModelChanged === true ? 'pendingUpdate' : 'pendingRefresh', true);
									this.postQuery(query, function(result) {
										this.$set('result', result);
										this.$set('pendingUpdate', false);
										this.$set('pendingRefresh', false);
									}.bind(this));
									break;
								}
							}
							else {
								console.error('*** SearchResult.updateQuery(): Invalid former response');
							}							
						}
					}
				}.bind(this));
				// *** Generate new query for query-window
				SparqlUtil.generateQuery({
					//limit: false,
					limit: true, // Only use limited queries for now, testing purposes
					formModel: formModel
				}, function(query) {
					this.$set('query', query);
				}.bind(this));
			}
		},
		/**
		 * Posts a query to the server
		 * @param {String} query
		 * @param {Function} callback
		 */
		postQuery: function(query, callback) {
			if(!query) {
				console.error('*** SearchResult.postQuery(): No query argument provided');
				return false;
			}
			if(!callback) {
				console.error('*** SearchResult.postQuery(): No callback provided');
				return false;
			}
			SparqlUtil.postQuery(query, function(response) {
				// Validate response here
				callback(response);
			}.bind(this));
		},
		/**
		 * Calls appropriate export-function depending on fileFormat
		 * @param {String} fileType
		 */
		performExport: function(fileType) {
			switch(fileType) {
				case 'csv':
					this.performCsvExport();
				break;
				case 'tsv':
					this.performTsvExport();
				break;
			}
		},
		/**
		 * Gets a file as .csv
		 */
		performCsvExport: function() {
			SparqlUtil.getFile(this.query, 'text/csv', function() {
				//this.$set('pendingExport', true);
			}.bind(this));
		},
		/**
		 * Gets a file as .tsv
		 */
		performTsvExport: function() {
			SparqlUtil.getFile(this.query, 'text/tab-separated-values', function() {
				//this.$set('pendingExport', true);
			}.bind(this));
		}
	}
};

module.exports = SearchResult;