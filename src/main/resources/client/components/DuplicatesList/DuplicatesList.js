'use strict';

// Vendor
var _assign = require('lodash/object/assign');
// Utils
var SparqlUtil = require('utils/SparqlUtil/SparqlUtil.js');
// CSS-modules
var styles = _assign(require('!!style!css?modules!./DuplicatesList.css'), require('!!style!css?modules!css/StaticHeader.css'));
// CSS
require('css/transitions.css');

/**
 * Duplicates List Component
 * @prop {Object} formModel
 * @prop {Object} fields
 * @prop {Function} onResultReceived
 */
var DuplicatesList = {
	props: ['formModel', 'fields', 'onResultReceived'],
	template: require('./DuplicatesList.html'),
	data: function() {
		return {
			query: '',
			result: {},
			handleArticle: '',
			_styles: styles
		}
	},
	watch: {
		'formModel': function() {
			this.updateQuery();
		},
		'query': function() {
			this.postQuery();
		}
	},
	ready: function() {
		this.updateQuery();
	},
	methods: {
		/**
		 * Set currently handled article
		 * @param {Object} article
		 */
		setHandleArticle: function(article) {
			this.$set('handleArticle', article);
		},
		/**
		 * Update the query
		 */
		updateQuery: function() {
			var formModel = this.formModel;
			formModel.filterFields = SparqlUtil.getFilterFields(this.formModel.templateName);
			var conf = {
				limit: true,
				formModel: formModel
			};
			SparqlUtil.generateQuery(conf, function(query) {
				this.$set('query', query);
			}.bind(this));
		},
		/**
		 * Posts the query
		 */
		postQuery: function() {
			SparqlUtil.postQuery(this.query, function(result) {
				if(!result.error) {
					this.$set('result', result);
				} else {
					console.error('*** DuplicatesList.updateQuery: Failed to post query. Error:');
					console.log(result);
				}
				if(this.onResultReceived) {
					this.onResultReceived();
				}
			}.bind(this));
		}
	}
};

module.exports = DuplicatesList;