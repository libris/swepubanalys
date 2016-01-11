'use strict';

// CSS-modules
var styles = require('./ShowFieldButton.css');

/**
 * Show Field-button can be used to set field.show = true
 * @prop {Object} field
 * @prop {Function} getFieldIndex
 */
var ShowFieldButton = {
	props: ['field', 'getFieldIndex'],
	template: require('./ShowFieldButton.html'),
	data: function() {
		return {
			_styles: styles
		}
	},
	methods: {
		/**
		 * On click
		 */
		onClick: function() {
			this.$set('field.show', true);
			this.$set('field.index', this.getFieldIndex());
		}
	}
};

module.exports = ShowFieldButton;