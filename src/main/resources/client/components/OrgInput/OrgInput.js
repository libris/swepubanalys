'use strict';

// Components
var AutocompleteInput = require('components/AutocompleteInput/AutocompleteInput.js');

/**
 * Organisation Input-component
 * @prop {Array} orgs
 * @prop {Array} orgSuggestions
 */
var OrgInput = {
	props: ['orgs', 'orgSuggestions'],
	template: require('./OrgInput.html'),
	components: {
		'autocomplete-input': AutocompleteInput,
	}
};

module.exports = OrgInput;