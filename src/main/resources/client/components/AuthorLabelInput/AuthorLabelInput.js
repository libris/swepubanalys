'use strict';

// Components
var HideFieldButton = require('components/HideFieldButton/HideFieldButton.js');

/**
 * Author Label Input-component
 * @prop {Object} authorLabel
 */
var AuthorLabelInput = {
	props: ['authorLabel'],
	template: require('./AuthorLabelInput.html'),
	components: {
		'hide-field-button': HideFieldButton
	},
};

module.exports = AuthorLabelInput;