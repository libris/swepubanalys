'use strict';

// Vendor
var _assign = require('lodash/object/assign');
// Components
var MailExport = require('components/MailExport/MailExport.js');
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
			pendingUpdate: false,
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
	components: {
		'mail-export': MailExport
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
			var articles = this.result.results.bindings;
			var index = articles.indexOf(article);
			if(!article.ambiguities) {
				article.loading = true;
				articles.$set(index, article);
				// Get ambiguities 
				SparqlUtil.getAmbiguity(article._id1.value, article._id2.value, function(ambiguities) {
					article.loading = false;
					article.ambiguities = ambiguities;
					articles.$set(index, article);
				}.bind(this));
			}
			this.$set('handleArticle', article === this.handleArticle ? null : article);
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
			this.$set('pendingUpdate', true);
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
				this.$set('pendingUpdate', false);
			}.bind(this));
		}
	}
};

module.exports = DuplicatesList;