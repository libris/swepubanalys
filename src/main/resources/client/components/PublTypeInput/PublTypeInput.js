'use strict';

// Components
var AutocompleteInput = require('components/AutocompleteInput/AutocompleteInput.js');
var HelpMixin = require('mixins/HelpMixin.js');
var HideFieldButton = require('components/HideFieldButton/HideFieldButton.js');
// Utils
var arrayToSparqlString = require('utils/arrayToSparqlString.js');

/**
 * Publication Type Input-component
 * @prop {Object} field
 */
var PublTypeInput = {
	mixins: [HelpMixin],
	props: ['field'],
	template: require('./PubltypeInput.html'),
	components: {
		'autocomplete-input': AutocompleteInput,
		'hide-field-button': HideFieldButton
	},
	data: function() {
		return {
			publTypes: []
		}
	},
	watch: {
		'publTypes': function() {
			this.field.$set('value', arrayToSparqlString(this.publTypes));
		}
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
			this.hidePopover(this.$el);
			this.$.AutocompleteInputComponent.clear();
		}
	}
};

module.exports = PublTypeInput;