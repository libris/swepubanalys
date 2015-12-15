'use strict';

// Components
var AutocompleteInput = require('components/AutocompleteInput/AutocompleteInput.js');
var HideFieldButton = require('components/HideFieldButton/HideFieldButton.js');
// Mxins
var FormFieldLayoutMixin = require('mixins/FormFieldLayoutMixin/FormFieldLayoutMixin.js');
// Utils
var arrayToSparqlString = require('utils/arrayToSparqlString.js');

/**
 * Publication Type Input-component
 * @prop {Object} field
 */
var PublTypeInput = {
	mixins: [FormFieldLayoutMixin],
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
			this.$set('field.value', arrayToSparqlString(this.publTypes.map(function(d) { return d.value; })));
			this.$set('field.labels', this.publTypes);
		}
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

module.exports = PublTypeInput;