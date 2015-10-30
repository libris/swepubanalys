'use strict';

// Vendor
var Vue = require('vue');
var _cloneDeep = require('lodash/lang/cloneDeep');
var _findIndex = require('lodash/array/findIndex');
// Components
var ListPreview = require('components/ListPreview/ListPreview.js');
var FilterFields = require('components/FilterFields/FilterFields.js');
// Mxins
var FieldLabelMixin = require('mixins/FieldLabelMixin/FieldLabelMixin.js');
// Utils
var SparqlUtil = require('utils/SparqlUtil/SparqlUtil.js');
// CSS-modules
var styles = require('!!style!css?modules!./SearchResult.css');
// CSS
require('css/transitions.css');

/**
 * Search Result-component
 * @prop {Object} formModel
 * @prop {Object} fields
 * @prop {Function} onResultReceived
 */
var SearchResult = {
	mixins: [FieldLabelMixin],
	template: require('./SearchResult.html'),
	props: ['formModel', 'fields', 'onResultReceived'],
	data: function() {
		return {
			// Flags
			formModelHasChanged: false, // To let methods.updateQuery() know that formModel has changed and that a POST should be performed
			// UI state
			pendingUpdate: true,
			pendingRefresh: true,
			pendingExport: false,
			// Data
			query: '',
			filterFields: [],
			defaultFilterFields: [],
			result: {
				head: {
					vars: [],
				},
				results: {
					bindings: [],
				}
			},
			_styles: styles
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
			this.filterFieldsChanged();
		}.bind(this), { deep: true });
		// Generate query on ready hook
		this.formModelChanged();
	},
	components: {
		'list-preview': ListPreview,
		'filter-fields': FilterFields,
	},
	methods: {
		/** 
		 * Should be called if props.formModel has been received or updated. Gets appropriate filterFields according
		 * to template name and updates data.filterFields accordingly
		 */
		formModelChanged: function() {
			if(this.formModel && this.formModel.templateName && this.formModel.templateName.length > 0) {
				var filterFields = SparqlUtil.getFilterFields(this.formModel.templateName);
				this.$set('formModelHasChanged', true);
				this.$set('pendingExport', false);
				this.$set('filterFields', _cloneDeep(filterFields).map(function(field, i) { field.checked = i === 0; return field; })); // Will in turn trigger updateQuery()
				this.$set('defaultFilterFields', filterFields); 
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
					var selectedFields = 0;
					for(var i = 0; i < formModel.filterFields.length; i++) {
						if(formModel.filterFields[i].checked === true) {
							selectedFields++;
							if(this.result && this.result.head && this.result.head.vars) {
								var index = _findIndex(this.result.head.vars, function(field) {
									return '?' + field === formModel.filterFields[i].field;
								});
								if(index === -1 || formModelChanged === true) {
									console.log('*** SearchResults.updateQuery: Posting query');
									this.$set(formModelChanged === true ? 'pendingUpdate' : 'pendingRefresh', true);
									this.postQuery(query, function(result) {
										if(!result.error) {
											this.$set('result', result);
										} else {
											console.error('*** SearchResult.updateQuery: Failed to post query. Error:');
											console.log(result);
										}
										this.$set('pendingUpdate', false);
										this.$set('pendingRefresh', false);
										if(this.onResultReceived) {
											this.onResultReceived();
										}
									}.bind(this));
									break;
								}
							} else {
								console.error('*** SearchResult.updateQuery: Invalid former response');
							}							
						}
					}
					if(selectedFields === 0) {
						this.$set('pendingUpdate', false);
						this.$set('pendingRefresh', false);
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
				console.error('*** SearchResult.postQuery: No query argument provided');
				return false;
			}
			if(!callback) {
				console.error('*** SearchResult.postQuery: No callback provided');
				return false;
			}
			SparqlUtil.postQuery(query, function(response) {
				// Validate response here
				callback(response);
			}.bind(this));
		},
		/**
		 * Count number of selected filter fields atm.
		 */
		countSelectedFilterFields: function() {
			var n = 0;
			this.filterFields.map(function(filterField) {
				n += filterField.checked === true ? 1 : 0;
			});
			return n;
		},
		/**
		 * Calls appropriate export-function depending on fileFormat
		 * @param {String} fileType
		 */
		performExport: function(fileType) {
			this.$set('pendingExport', true);
			var finished = function() {
				this.$set('pendingExport', false);
			}.bind(this);
			switch(fileType) {
				case 'json':
					this.performJsonExport(finished);
				break;
				case 'xml':
					this.performXmlExport(finished);
				break;
				case 'csv':
					this.performCsvExport(finished);
				break;
				case 'tsv':
					this.performTsvExport(finished);
				break;
			}
		},
		/**
		 * Gets a file as .json
		 */
		performJsonExport: function(callback) {
			SparqlUtil.getFile(this.query, 'application/json', function() {
				callback();
			}.bind(this));
		},
		/**
		 * Gets file as .xml
		 */
		performXmlExport: function(callback) {
			SparqlUtil.getFile(this.query, 'application/xml', function() {
				callback();
			}.bind(true));
		},
		/**
		 * Gets a file as .csv
		 */
		performCsvExport: function(callback) {
			SparqlUtil.getFile(this.query, 'text/csv', function() {
				callback();
			}.bind(this));
		},
		/**
		 * Gets a file as .tsv
		 */
		performTsvExport: function(callback) {
			SparqlUtil.getFile(this.query, 'text/tab-separated-values', function() {
				callback();
			}.bind(this));
		}
	}
};

module.exports = SearchResult;