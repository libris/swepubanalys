'use strict';

// Components
var HideFieldButton = require('components/HideFieldButton/HideFieldButton.js');

/**
 * Author Label Input-component
 * @prop {Object} field
 */
var AuthorLabelInput = {
	props: ['field'],
	template: require('./AuthorLabelInput.html'),
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
			field.$set('value', '');
		}
	}
};

module.exports = AuthorLabelInput;