'use strict';

// Mixins
var FractionalMixin = require('mixins/FractionalMixin/FractionalMixin.js');
// CSS modules
var styles = require('./FilterFieldButton.less');

/**
 * Filter Field Button Component
 */
var FilterFieldButton = {
	mixins: [FractionalMixin],
	props: ['filterField'],
	template: require('./FilterFieldButton.html'),
	data: function() {
		return {
			_styles: styles
		}
	},
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
