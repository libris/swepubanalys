'use strict';

// Components
var HideFieldButton = require('components/HideFieldButton/HideFieldButton.js');

/**
 * Open Access Input-component
 * @prop {Object} field
 */
var OAInput = {
	props: ['field'],
	template: require('./OAInput.html'),
	components: {
		'hide-field-button': HideFieldButton
	},	
	methods: {
		/**
		 * Callback sent to click event of HideFieldButton
		 * @param {Object} field
		 */
		onClickHideField: function(field) {
			field.$set('show', false);
			field.$set('value', false);
		}
	}
};

module.exports = OAInput;
