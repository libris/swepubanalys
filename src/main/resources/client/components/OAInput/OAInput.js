'use strict';

// Components
var HideFieldButton = require('components/HideFieldButton/HideFieldButton.js');

/**
 * Open Access Input-component
 * @prop {Object} field
 */
var OAInput = {
	props: ['field'],
	template: require('./OAInput.html'),
	components: {
		'hide-field-button': HideFieldButton
	}
};

module.exports = OAInput;
