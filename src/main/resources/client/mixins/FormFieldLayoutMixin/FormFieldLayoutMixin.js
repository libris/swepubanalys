'use strict';

// CSS-modules
var styles = require('!!style!css?modules!./FormFieldLayoutWrapper.css');

/**
 * This mixin makes a wrapper component available. The wrapper may be used to insert form-field elements
 */
var FormFieldLayoutMixin = {
	props: ['hideable'],
	components: {
		'form-field-wrapper': {
			template: require('./FormFieldLayoutWrapper.html'),
		}
	},
	data: function() {
		return {
			_formFieldStyles: styles,
		}
	}
};

module.exports = FormFieldLayoutMixin;