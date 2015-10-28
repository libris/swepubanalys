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
			this.$set('field.show', false);
			this.$set('field.value', false);
		},
		/**
		 * Set labels according to value
		 */
		updateLabels: function() {
			this.$set('field.labels', [{ text: this.field.value === true ? 'Endast Open access' : 'Poster med och utan Open access' }]);
		}
	},
	watch: {
		'field.value': function() {
			this.updateLabels();
		}
	},
	ready: function() {
		this.updateLabels();
		// Initialize help
		this.initHelp({
			title: 'OPENACCESS',
			content: require('docs/openaccess.md'), 
			anchorToElement: this.$el.getElementsByClassName('checkbox')[0],
		});
	}
};

module.exports = OAInput;
