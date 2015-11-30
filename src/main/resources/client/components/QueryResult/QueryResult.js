'use strict';

// Vendor
var _cloneDeep = require('lodash/lang/cloneDeep');
// Mixins
var ResultMixin = require('mixins/ResultMixin/ResultMixin.js');
// Utils
var SparqlUtil = require('utils/SparqlUtil/SparqlUtil.js');

/**
 * Query Result-component
 * @prop {String} inputQuery
 */
var QueryResult = {
	mixins: [ResultMixin],
	props: ['inputQuery'],
	template: require('./QueryResult.html'),
	data: function() {
		return {
			limitedQuery: ''	
		}
	},
	watch: {
		/**
		 * As inputQuery is changed, get new result
		 */
		'inputQuery': function() {
			// Get filter fields
			var filterFields = SparqlUtil.getFilterFieldsFromQuery(this.inputQuery);
			// Set filterFields and 
			this.$set('filterFields', _cloneDeep(filterFields));
			this.$set('defaultFilterFields', filterFields);
			this.$set('query', this.inputQuery);
			this.$set('pendingUpdate', true);
			// Create query which will be used to fetch preview list
			var limitedQuery = '';
			SparqlUtil.regenerateQuery(this.inputQuery, this.filterFields, function(query) {
				limitedQuery = query;
			}.bind(this), { limit: true });
			this.getResult(limitedQuery, function() {
				this.$set('pendingUpdate', false);
			}.bind(this));
		}
	},
	ready: function() {
		/**
		 * If filterFields is mutated, trigger filterFieldsChanged()
		 */
		this.$watch('filterFields', function() {
			this.filterFieldsChanged();
		}, { deep: true });
	},
	methods: {
		/**
		 * If filterFields is mutated, update query
		 */
		filterFieldsChanged: function() {
			this.updateQuery();
		},
		/**
		 * Regenerate query according to inputQuery and filterFields
		 */
		updateQuery: function() {
			SparqlUtil.regenerateQuery(this.inputQuery, this.filterFields, function(query) {
				this.$set('query', query);
			}.bind(this));
		},
		
	}
};

module.exports = QueryResult;