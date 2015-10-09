'use strict';

// Components
var AutocompleteInput = require('components/AutocompleteInput/AutocompleteInput.js');
var HelpMixin = require('mixins/HelpMixin.js');
var HideFieldButton = require('components/HideFieldButton/HideFieldButton.js');

/**
 * Publication Type Input-component
 * @prop {Object} field
 * @prop {Array} publTypes
 * @prop {Array} publTypeSuggestions
 */
var PublTypeInput = {
	mixins: [HelpMixin],
	props: ['field', 'publTypes', 'publTypeSuggestions'],
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
	},
	methods: {
		/**
		 * Callback sent to click event of HideFieldButton
		 * @param {Object} field
		 */
		onClickHideField: function(field) {
			field.$set('show', false);
			this.$.AutocompleteInputComponent.clear();
		}
	}
};

module.exports = PublTypeInput;