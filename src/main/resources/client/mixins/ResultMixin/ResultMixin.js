'use strict';

// Vendor
var _assign = require('lodash/object/assign');
// Components
var ListPreview = require('components/ListPreview/ListPreview.js');
var FilterFields = require('components/FilterFields/FilterFields.js');
var MailExport = require('components/MailExport/MailExport.js');
// Utils
var SparqlUtil = require('utils/SparqlUtil/SparqlUtil.js');
var DataUtil = require('utils/DataUtil/DataUtil.js');
// CSS modules
var styles = _assign(require('./ResultMixin.css'), require('css/modules/Colors.less'));

/**
 * Result Mixin
 * @prop {Function} onResultReceived
 */
var ResultMixin = {
	props: ['onResultReceived'],
	data: function() {
		return {
			// UI state
			error: false,
			pendingUpdate: true,
			// Data
			query: '',
			filterFields: [], // Currently selected filterFields
			defaultFilterFields: [], // Default filter fields of current query
			result: {
				head: {
					vars: [],
				},
				results: {
					bindings: [],
				}
			},
			_resultStyles: styles
		};
	},
	components: {
		'list-preview': ListPreview,
		'filter-fields': FilterFields,
		'mail-export': MailExport
	},
	methods: {
		/**
		 * Posts a query to the server
		 * @param {String} query
		 * @param {Function} callback
		 */
		postQuery: function(query, callback) {
			if(!query) {
				console.error('*** ResultMixin.postQuery: No query argument provided');
				return false;
			}
			if(!callback) {
				console.warning('*** ResultMixin.postQuery: No callback provided');
			}
			SparqlUtil.postQuery(query, function(response) {
				// Validate response here
				if(callback) {
					callback(response);
				}
			}.bind(this));
		},
		/**
		 * Get result from server
		 * @param {String} query
		 * @param {Function} callback
		 */
		getResult: function(query, callback) {
			this.$set('error', false);
			this.postQuery(query, function(result) {
				if(!result.error) {
					// Set result
					this.$set('result', result);
				} else {
					console.error('*** ResultMixin.updateQuery: Failed to post query. Error:');
					console.log(result);
					this.$set('error', true);
				}
				if(this.onResultReceived) {
					this.onResultReceived();
				}
				if(callback) {
					callback();
				}
			}.bind(this));
		},
        /**
         * Returns true if the component either has no result, or if there is a result with .bindings.length > 0
         * @return {Boolean}
         */
        hasNonEmptyResult: function() {
            if(!this.error && !this.pendingUpdate && this.result && this.result.results && this.result.results.bindings) {
                return this.result.results.bindings.length > 0;
            } else {
                return true;
            }
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
		}
	}
};

module.exports = ResultMixin;