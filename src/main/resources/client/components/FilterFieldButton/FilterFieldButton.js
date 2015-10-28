'use strict';

// Mixins
var FractionalMixin = require('mixins/FractionalMixin/FractionalMixin.js');

/**
 * Filter Field Button Component
 */
var FilterFieldButton = {
	mixins: [FractionalMixin],
	props: ['filterField'],
	template: require('./FilterFieldButton.html'),
	methods: {
		/**
		 * Toggle checked status
		 */
		onClick: function() {
			this.$set('filterField.checked', !this.filterField.checked);
		}
	}
}

module.exports = FilterFieldButton;