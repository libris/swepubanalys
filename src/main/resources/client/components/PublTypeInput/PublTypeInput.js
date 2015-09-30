'use strict';

// Components
var AutocompleteInput = require('components/AutocompleteInput/AutocompleteInput.js');
var HelpMixin = require('mixins/HelpMixin.js');

/**
 * Publication Type Input-component
 * @prop {Array} publType
 * @prop {Array} publTypeSuggestions
 */
var PublTypeInput = {
	mixins: [HelpMixin],
	props: ['publTypes', 'publTypeSuggestions'],
	template: require('./PubltypeInput.html'),
	components: {
		'autocomplete-input': AutocompleteInput,
	},
	ready: function() {
		this.initHelp({
			title: 'PUBLIKATIONSTYPER',
			content: require('./PublTypeInput.Help.html'),
		});
	}
};

module.exports = PublTypeInput;