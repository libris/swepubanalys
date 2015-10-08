'use strict';

// Components
var HideFieldButton = require('components/HideFieldButton/HideFieldButton.js');

/**
 * Author Label Input-component
 * @prop {Object} field
 */
var AuthorLabelInput = {
	props: ['field'],
	template: require('./AuthorLabelInput.html'),
	components: {
		'hide-field-button': HideFieldButton
	},
};

module.exports = AuthorLabelInput;