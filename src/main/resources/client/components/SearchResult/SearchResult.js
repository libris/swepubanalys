'use strict';

// Vendor
var Vue = require('vue');
var _cloneDeep = require('lodash/lang/cloneDeep');
var _findIndex = require('lodash/array/findIndex');
// Mixins
var ResultMixin = require('mixins/ResultMixin/ResultMixin.js');
var FieldLabelMixin = require('mixins/FieldLabelMixin/FieldLabelMixin.js');
// Utils
var SparqlUtil = require('utils/SparqlUtil/SparqlUtil.js');
var DataUtil = require('utils/DataUtil/DataUtil.js');
// CSS-modules
var styles = require('!!style!css?modules!./SearchResult.css');
// CSS
require('css/transitions.css');

/**
 * Search Result-component
 * @prop {Object} formModel
 * @prop {Object} fields
 * @prop {Boolean} selectAllFilterField
 * @prop {Function} onGenerateQuery
 */
var SearchResult = {
	mixins: [ResultMixin, FieldLabelMixin],
	template: require('./SearchResult.html'),
	props: ['formModel', 'fields', 'selectAllFilterFields', 'onGenerateQuery'],
	data: function() {
		return {
			// Flags
			formModelHasChanged: false, // To let methods.updateQuery() know that formModel has changed and that a POST should be performed
			// UI state
			pendingRefresh: true,
			// Data
			totalHits: false,
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
	methods: {
		/** 
		 * Should be called if props.formModel has been received or updated. Gets appropriate filterFields according
		 * to template name and updates data.filterFields accordingly
		 */
		formModelChanged: function() {
			if(this.formModel && this.formModel.templateName && this.formModel.templateName.length > 0) {
				var filterFields = SparqlUtil.getFilterFields(this.formModel.templateName);
				this.$set('formModelHasChanged', true);
				// Will in turn trigger updateQuery()
				this.$set('filterFields', _cloneDeep(filterFields).map(function(field, i) { 
					field.checked = (i === 0 || this.selectAllFilterFields); 
					return field; 
				}.bind(this))); 
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
									this.getResult(query, function() {
										this.$set('pendingUpdate', false);
										this.$set('pendingRefresh', false);
										// Get total hits 
										if(formModel.templateName === 'QfBibliometrics' || formModel.templateName === 'simple') {
											DataUtil.getFilterAggregations(formModel, function(aggregations) {
												if(aggregations && typeof aggregations.total_hits !== 'undefined') {
													this.$set('totalHits', aggregations.total_hits);
												} else {
													this.$set('totalHits', false);
												}
											}.bind(this));
										} else {
											this.$set('totalHits', false);
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
					limit: false,
					formModel: formModel
				}, function(query) {
					this.$set('query', query);
					if(this.onGenerateQuery) {
						this.onGenerateQuery(query);
					}
				}.bind(this));
			}
		}
	}
};

module.exports = SearchResult;