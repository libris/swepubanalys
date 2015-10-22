'use strict';

// Components
var AutocompleteInput = require('components/AutocompleteInput/AutocompleteInput.js');
var HideFieldButton = require('components/HideFieldButton/HideFieldButton.js');
// Mxins
var FormFieldLayoutMixin = require('mixins/FormFieldLayoutMixin/FormFieldLayoutMixin.js');
var HelpMixin = require('mixins/HelpMixin/HelpMixin.js');
// Utils
var arrayToSparqlString = require('utils/arrayToSparqlString.js');

/**
 * Publication Type Input-component
 * @prop {Object} field
 */
var PublTypeInput = {
	mixins: [HelpMixin, FormFieldLayoutMixin],
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
			this.field.$set('value', arrayToSparqlString(this.publTypes.map(function(d) { return d.value; })));
			this.field.$set('labels', this.publTypes);
		}
	},
	ready: function() {
		this.initHelp({
			title: 'PUBLIKATIONSTYPER',
			content: require('docs/publication_type.md'), 
			anchorToElement: this.$el.getElementsByClassName('FormFieldInput')[0],
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