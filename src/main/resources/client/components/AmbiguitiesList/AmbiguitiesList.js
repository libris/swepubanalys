'use strict';

// Vendor
var Vue = require('vue');
var $ = require('jquery');
var _cloneDeep = require('lodash/lang/cloneDeep');
var _assign = require('lodash/object/assign');
// Mixins
var ResultMixin = require('mixins/ResultMixin/ResultMixin.js');
// Utils
var SparqlUtil = require('utils/SparqlUtil/SparqlUtil.js');
// CSS-modules
var styles = _assign(
	require('./AmbiguitiesList.css'),
	require('css/modules/StaticHeader.css')
);
// CSS
require('css/transitions.css');

var show = 20;

/**
 * Ambiguities List Component
 * @prop {Object} formModel
 * @prop {Object} fields
 * @prop {Function} onResultReceived
 * @prop {Function} onGenerateQuery
 */
var AmbiguitiesList = {
	mixins: [ResultMixin],
	props: ['formModel', 'fields', 'onResultReceived', 'onGenerateQuery'],
	template: require('./AmbiguitiesList.html'),
	data: function() {
		return {
			show: show,
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
			this.$set('show', show);
			this.$set('pendingUpdate', true);
			this.getResult(this.query, function() {
				this.$set('pendingUpdate', false);
			}.bind(this));
		}
	},
	computed: {
		/**
		 * Show only <this.show> amount of rows
		 */
		ambiguities: function() {
			var ambiguities = ((this.result && this.result.results && this.result.results.bindings) ? this.result.results.bindings : []);
			return ambiguities.slice(0, this.show);
		}
	},
	ready: function() {
		this.updateQuery();
	},
	methods: {
		/**
		 * For old browsers
		 */
		onScrollTable: function() {
			this.onScroll(this.$els.tableContainer);
		},
		/**
		 * If we reach the bottom of the <tbody>, load more rows
		 */
		onScrollTbody: function() {
			this.onScroll(this.$els.tBody);
			
		},
		/**
		 * Load more rows
		 */
		onScroll: function(el) {
			if($(el).scrollTop() + $(el).innerHeight() >= $(el)[0].scrollHeight) {
				this.$set('show', this.show+show);
			}
		},
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
				limit: false,
				formModel: formModel
			};
			SparqlUtil.generateQuery(conf, function(query) {
				this.$set('query', query);
				if(this.onGenerateQuery) {
					this.onGenerateQuery(query);
				}
			}.bind(this));
		}
	}
};

module.exports = AmbiguitiesList;