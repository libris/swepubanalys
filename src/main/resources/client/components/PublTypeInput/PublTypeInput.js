'use strict';

// Components
var AutocompleteInput = require('components/AutocompleteInput/AutocompleteInput.js');

/**
 * Publication Type Input-component
 * @prop {Array} publType
 * @prop {Array} publTypeSuggestions
 */
var PublTypeInput = {
	props: ['publTypes', 'publTypeSuggestions'],
	template: require('./PubltypeInput.html'),
	components: {
		'autocomplete-input': AutocompleteInput,
	}	
};

module.exports = PublTypeInput;