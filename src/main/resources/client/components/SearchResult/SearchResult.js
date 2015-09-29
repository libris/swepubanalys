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
				this.updateQuery();
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
		 *
		 */
		updateQuery: function() {
				if(this.formModel.templateName) {
					// *** Generate new query for query-window
					var formModel = _cloneDeep(this.formModel);
					formModel.filterFields = this.filterFields;
					SparqlUtil.generateQuery({
						limit: false,
						formModel: formModel
					}, function(query) {
						this.$set('query', query);
					}.bind(this));
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
								if(index === -1) {
									console.log('*** SearchResults.updateQuery(): New fields needed for preview. Posting query');
									this.postQuery(query, function(result) {
										this.$set('result', result);
									}.bind(this));
									return false;
								}
							}
						}
					}.bind(this));
				}
		},
		/**
		 *
		 */
		postQuery: function(query, callback) {
			//SparqlUtil.postQuery(this.query, function(response) {
				// Validate response here
				//this.$set('result', response);
			//}.bind(this));
			if(!query) {
				console.error('*** SearchResult.postQuery(): No query argument provided');
				return false;
			}
			if(!callback) {
				console.error('*** SearchResult.postQuery(): No callback provided');
				return false;
			}
			callback(dummyResponse);
		}
	}
};

module.exports = SearchResult;

var dummyResponse = 
{ "head": { "link": [], "vars": ["_recordID", "_orgCode", "_pubYear", "_publicatType", "_hsv3", "_creatorCount", "_numLocalCreator", "_isiValue", "_doiValue", "_scopusValue", "_pmidValue", "_isbnValue"] },
  "results": { "distinct": false, "ordered": true, "bindings": [
    { "_recordID": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "oai:DiVA.org:liu-110363" }	, "_orgCode": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "liu" }	, "_pubYear": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#integer", "value": "2014" }	, "_publicatType": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "lic" }	, "_hsv3": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "103" }	, "_creatorCount": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#integer", "value": "1" }	, "_numLocalCreator": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#integer", "value": "1" }	, "_doiValue": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "10.3384/lic.diva-110363" }	, "_isbnValue": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "978-91-7519-253-6 (print)" }},
    { "_recordID": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "oai:DiVA.org:liu-106936" }	, "_orgCode": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "liu" }	, "_pubYear": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#integer", "value": "2014" }	, "_publicatType": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "dok" }	, "_hsv3": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "501" }	, "_creatorCount": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#integer", "value": "1" }	, "_numLocalCreator": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#integer", "value": "1" }	, "_doiValue": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "10.3384/diss.diva-106936" }	, "_isbnValue": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "978-91-7519-344-1 (print)" }},
    { "_recordID": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "oai:DiVA.org:liu-114806" }	, "_orgCode": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "liu" }	, "_pubYear": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#integer", "value": "2015" }	, "_publicatType": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "dok" }	, "_hsv3": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "302" }	, "_creatorCount": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#integer", "value": "1" }	, "_numLocalCreator": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#integer", "value": "1" }	, "_doiValue": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "10.3384/diss.diva-114806" }	, "_isbnValue": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "978-91-7519-145-4 (print)" }},
    { "_recordID": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "oai:DiVA.org:liu-104110" }	, "_orgCode": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "liu" }	, "_pubYear": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#integer", "value": "2014" }	, "_publicatType": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "dok" }	, "_hsv3": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "101" }	, "_creatorCount": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#integer", "value": "1" }	, "_numLocalCreator": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#integer", "value": "1" }	, "_doiValue": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "10.3384/diss.diva-104110" }	, "_isbnValue": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "978-91-7519-388-5 (print)" }},
    { "_recordID": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "oai:DiVA.org:liu-18323" }	, "_orgCode": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "liu" }	, "_pubYear": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#integer", "value": "2009" }	, "_publicatType": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "dok" }	, "_hsv3": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "504" }	, "_creatorCount": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#integer", "value": "1" }	, "_numLocalCreator": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#integer", "value": "1" }	, "_isbnValue": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "978-91-7393-612-5" }},
    { "_recordID": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "oai:DiVA.org:liu-63021" }	, "_orgCode": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "liu" }	, "_pubYear": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#integer", "value": "2001" }	, "_publicatType": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "rap" }	, "_hsv3": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "105" }	, "_creatorCount": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#integer", "value": "2" }	, "_numLocalCreator": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#integer", "value": "2" }	, "_isbnValue": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "91-7219-926-1" }},
    { "_recordID": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "oai:DiVA.org:liu-77078" }	, "_orgCode": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "liu" }	, "_pubYear": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#integer", "value": "2012" }	, "_publicatType": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "dok" }	, "_hsv3": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "101" }	, "_creatorCount": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#integer", "value": "1" }	, "_numLocalCreator": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#integer", "value": "1" }	, "_isbnValue": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "978-91-7519-891-0" }},
    { "_recordID": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "oai:DiVA.org:liu-10519" }	, "_orgCode": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "liu" }	, "_pubYear": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#integer", "value": "2008" }	, "_publicatType": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "dok" }	, "_hsv3": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "503" }	, "_creatorCount": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#integer", "value": "1" }	, "_numLocalCreator": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#integer", "value": "1" }	, "_isbnValue": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "978-91-85895-03-8" }},
    { "_recordID": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "oai:DiVA.org:liu-89617" }	, "_orgCode": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "liu" }	, "_pubYear": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#integer", "value": "2013" }	, "_publicatType": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "lic" }	, "_hsv3": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "202" }	, "_creatorCount": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#integer", "value": "1" }	, "_numLocalCreator": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#integer", "value": "1" }	, "_isbnValue": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "978-91-7519-644-2" }},
    { "_recordID": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "oai:DiVA.org:liu-11797" }	, "_orgCode": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "liu" }	, "_pubYear": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#integer", "value": "2008" }	, "_publicatType": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "dok" }	, "_hsv3": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "302" }	, "_creatorCount": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#integer", "value": "1" }	, "_numLocalCreator": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#integer", "value": "1" }	, "_isbnValue": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "978-91-7393-903-4" }},
    { "_recordID": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "oai:DiVA.org:liu-5012" }	, "_orgCode": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "liu" }	, "_pubYear": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#integer", "value": "2004" }	, "_publicatType": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "dok" }	, "_hsv3": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "102" }	, "_creatorCount": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#integer", "value": "1" }	, "_numLocalCreator": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#integer", "value": "1" }	, "_isbnValue": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "91-7373-966-9" }},
 ] } }