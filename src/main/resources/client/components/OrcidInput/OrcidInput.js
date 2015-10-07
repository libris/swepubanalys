'use strict';

// Components
var HideFieldButton = require('components/HideFieldButton/HideFieldButton.js');

/**
 * Orcid Input-component
 * @prop {Object} orcid
 */
var OrcidInput = {
	props: ['orcid'],
	template: require('./OrcidInput.html'),
	components: {
		'hide-field-button': HideFieldButton
	}
};

module.exports = OrcidInput;