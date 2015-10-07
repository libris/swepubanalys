'use strict';

// Components
var HideFieldButton = require('components/HideFieldButton/HideFieldButton.js');

/**
 * Open Access Input-component
 * @prop {Object} openaccess
 */
var OAInput = {
	props: ['openaccess'],
	template: require('./OAInput.html'),
	components: {
		'hide-field-button': HideFieldButton
	}
};

module.exports = OAInput;
