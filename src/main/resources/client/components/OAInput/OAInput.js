'use strict';

// Components
var HideFieldButton = require('components/HideFieldButton/HideFieldButton.js');
// Mixins
var HelpMixin = require('mixins/HelpMixin/HelpMixin.js');
var FormFieldLayoutMixin = require('mixins/FormFieldLayoutMixin/FormFieldLayoutMixin.js');

/**
 * Open Access Input-component
 * @prop {Object} field
 */
var OAInput = {
	mixins: [HelpMixin, FormFieldLayoutMixin],
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
	},
	ready: function() {
		// Initialize help
		this.initHelp({
			title: 'OPENACCESS',
			content: require('docs/openaccess.md'), 
			anchorToElement: this.$el.getElementsByClassName('checkbox')[0],
		});
	}
};

module.exports = OAInput;
