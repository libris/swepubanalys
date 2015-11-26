'use strict';

// Vendor
var Vue = require('vue');
var _cloneDeep = require('lodash/lang/cloneDeep');
var _assign = require('lodash/object/assign');
// Mixins
var ResultMixin = require('mixins/ResultMixin/ResultMixin.js');
// Utils
var SparqlUtil = require('utils/SparqlUtil/SparqlUtil.js');
// CSS-modules
var styles = _assign(
	require('!!style!css?modules!./DuplicatesList.css'),
	require('!!style!css?modules!css/modules/Colors.css'),
	require('!!style!css?modules!css/modules/StaticHeader.css')
);
// CSS
require('css/transitions.css');

/**
 * Duplicates List Component
 * @prop {Object} formModel
 * @prop {Object} fields
 * @prop {Function} onResultReceived
 */
var DuplicatesList = {
	mixins: [ResultMixin],
	props: ['formModel', 'fields', 'onResultReceived'],
	template: require('./DuplicatesList.html'),
	data: function() {
		return {
			pendingUpdate: false,
			handleArticle: '',
			_styles: styles
		}
	},
	watch: {
		'formModel': function() {
			this.updateQuery();
		},
		'query': function() {
            this.$set('pendingUpdate', true);
			this.getResult(this.query, function() {
                this.$set('pendingUpdate', false);
            }.bind(this));
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
			// Show article
			var articles = this.result.results.bindings;
			var index = articles.indexOf(article);
			article = _cloneDeep(article);
			article.show = !article.show;
			articles.$set(index, article);
			// Fetch ambiguityCase
			if(!article.ambiguityCase && article.show === true) {
				article.loading = true;
				articles.$set(index, article);
				// Get ambiguities 
				SparqlUtil.getAmbiguityCase(article._orgCode1.value, article._id1.value, article._orgCode2.value, article._id2.value, function(ambiguityCase) {
					// Replace article object
					article = _cloneDeep(article);
					article.loading = false;
					article.ambiguityCase = ambiguityCase;
					articles.$set(index, article);
				}.bind(this));
			}
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
		}
	}
};

module.exports = DuplicatesList;