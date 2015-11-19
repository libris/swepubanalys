'use strict';

/**
 * Query Form-component
 */
var QueryForm = {
	props: ['query', 'onSearch'],
	template: require('./QueryForm.html'),
	methods: {
		/**
		 * Called as clicks the search-button
		 */
		performSearch: function() {
			this.onSearch(this.query);
		}
	}
};

module.exports = QueryForm;