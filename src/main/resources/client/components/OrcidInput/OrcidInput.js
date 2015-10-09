'use strict';

// Components
var HideFieldButton = require('components/HideFieldButton/HideFieldButton.js');
// Mixins
var FieldValidationMixin = require('mixins/FieldValidationMixin.js');

/**
 * Orcid Input-component
 * @prop {Object} field
 */
var OrcidInput = {
	mixins: [FieldValidationMixin],
	props: ['field', 'test'],
	template: require('./OrcidInput.html'),
	components: {
		'hide-field-button': HideFieldButton
	},
	ready: function() {
		this.setValidationListeners([this.isValidAccordingToRegexp]);
	},
	methods: {
		/**
		 * Callback sent to click event of HideFieldButton
		 * @param {Object} field
		 */
		onClickHideField: function(field) {
			field.$set('show', false);
			field.$set('value', '');
		}
	}
};

module.exports = OrcidInput;