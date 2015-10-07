'use strict';

// Components
var AutocompleteInput = require('components/AutocompleteInput/AutocompleteInput.js');
var HelpMixin = require('mixins/HelpMixin.js');
var HideFieldButton = require('components/HideFieldButton/HideFieldButton.js');

/**
 * Publication Type Input-component
 * @prop {Object} publType
 * @prop {Array} publTypes
 * @prop {Array} publTypeSuggestions
 */
var PublTypeInput = {
	mixins: [HelpMixin],
	props: ['publType', 'publTypes', 'publTypeSuggestions'],
	template: require('./PubltypeInput.html'),
	components: {
		'autocomplete-input': AutocompleteInput,
		'hide-field-button': HideFieldButton
	},
	ready: function() {
		this.initHelp({
			title: 'PUBLIKATIONSTYPER',
			content: require('./PublTypeInput.Help.html'),
			marginLeft: '15px',
			marginTop: '20px',
		});
	}
};

module.exports = PublTypeInput;