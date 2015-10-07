'use strict';

// Components
var AutocompleteInput = require('components/AutocompleteInput/AutocompleteInput.js');
var HelpMixin = require('mixins/HelpMixin.js');

/**
 * Organisation Input-component
 * @prop {Array} orgs
 * @prop {Array} orgSuggestions
 */
var OrgInput = {
	mixins: [HelpMixin],
	props: ['orgs', 'orgSuggestions'],
	template: require('./OrgInput.html'),
	components: {
		'autocomplete-input': AutocompleteInput,
	},
	ready: function() {
		this.initHelp({
			title: 'ORGANISATION',
			content: require('./OrgInput.Help.html'),
			marginLeft: '15px',
			marginTop: '15px',
		});
	}
};

module.exports = OrgInput;