'use strict';

// CSS
require('./FormErrorLabel.css');
require('css/transitions.css');

/**
 * Form Error Label-component
 * @prop {Array} errorMessage
 */
var FormErrorLabel = {
	props: ['errors'],
	template: require('./FormErrorLabel.html'),
};

module.exports = FormErrorLabel;