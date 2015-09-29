'use strict';

// Components
var AutocompleteInput = require('components/AutocompleteInput/AutocompleteInput.js');
var HelpMixin = require('mixins/HelpMixin.js');

/**
 * Subject Input-component
 * @prop {Array} subjects
 * @prop {Array} subjectSuggestions
 */
var SubjectInput = {
	mixins: [HelpMixin],
	props: ['subjects', 'subjectSuggestions'],
	template: require('./SubjectInput.html'),
	components: {
		'autocomplete-input': AutocompleteInput,
	},
	ready: function() {
		this.initHelp({
			title: 'ÄMNE',
			content: require('./SubjectInput.Help.html'),
		});
	}
};

module.exports = SubjectInput;