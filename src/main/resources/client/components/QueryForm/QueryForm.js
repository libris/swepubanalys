'use strict';

// Mixins
var HelpMixin = require('mixins/HelpMixin/HelpMixin.js');

/**
 * Query Form-component
 */
var QueryForm = {
	mixins: [HelpMixin],
	props: ['query', 'onSearch'],
	template: require('./QueryForm.html'),
	methods: {
		/**
		 * Called as clicks the search-button
		 */
		performSearch: function() {
			this.onSearch(this.query);
		}
	},
	ready: function() {
		this.initHelp({
			title: 'AVANCERAD UTSÖKNING',
			content: require('docs/advanced_query.md'), 
			anchorToElement: this.$els.queryInput,
		});
	}
};

module.exports = QueryForm;