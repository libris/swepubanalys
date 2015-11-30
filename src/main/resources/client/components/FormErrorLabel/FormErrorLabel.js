'use strict';

// CSS-modules
var styles = require('!!style!css?modules!./FormErrorLabel.css');

/**
 * Form Error Label-component
 * @prop {Array} errorMessage
 */
var FormErrorLabel = {
	props: ['errors'],
	template: require('./FormErrorLabel.html'),
	data: function() {
		return {
			_styles: styles,
		}
	}
};

module.exports = FormErrorLabel;