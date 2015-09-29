'use strict';

// Components
var AutocompleteInput = require('components/AutocompleteInput/AutocompleteInput.js');

/**
 * Subject Input-component
 * @prop {Array} subjects
 * @prop {Array} subjectSuggestions
 */
var SubjectInput = {
	props: ['subjects', 'subjectSuggestions'],
	template: require('./SubjectInput.html'),
	components: {
		'autocomplete-input': AutocompleteInput,
	}
};

module.exports = SubjectInput;