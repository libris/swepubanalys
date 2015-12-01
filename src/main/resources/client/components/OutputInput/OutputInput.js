'use strict';

// Components
var AutocompleteInput = require('components/AutocompleteInput/AutocompleteInput.js');
var HideFieldButton = require('components/HideFieldButton/HideFieldButton.js');
// Mixins
var HelpMixin = require('mixins/HelpMixin/HelpMixin.js');
var FormFieldLayoutMixin = require('mixins/FormFieldLayoutMixin/FormFieldLayoutMixin.js');
// Utils
var arrayToSparqlString = require('utils/arrayToSparqlString.js');

/**
 * Output Input-component
 * @prop {Object} field
 */
var OutputInput = {
	mixins: [HelpMixin, FormFieldLayoutMixin],
	props: ['field'],
	template: require('./OutputInput.html'), 
	components: {
		'autocomplete-input': AutocompleteInput,
		'hide-field-button': HideFieldButton
	},
	data: function() {
		return {
			outputs: []
		}
	},
	watch: {
		'outputs': function() {
			this.$set('field.value', arrayToSparqlString(this.outputs.map(function(d) { return d.value; })));
			this.$set('field.labels', this.outputs);
		}
	},
	ready: function() {
		this.initHelp({
			title: 'OUTPUTTYP',
			content: require('docs/output.md'), 
			anchorToElement: this.$els.formFieldInput
		});
	},
	methods: {
		/**
		 * Callback sent to click event of HideFieldButton
		 * @param {Object} field
		 */
		onClickHideField: function(field) {
			this.$set('field.show', false);
			this.hidePopover(this.$el);
			this.$refs.input.clear();
		}
	}
};

module.exports = OutputInput;