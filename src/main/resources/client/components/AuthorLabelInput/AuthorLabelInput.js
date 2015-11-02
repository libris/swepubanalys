'use strict';

// Components
var HideFieldButton = require('components/HideFieldButton/HideFieldButton.js');
// Mixins
var HelpMixin = require('mixins/HelpMixin/HelpMixin.js');
var FormFieldLayoutMixin = require('mixins/FormFieldLayoutMixin/FormFieldLayoutMixin.js');

/**
 * Author Label Input-component
 * @prop {Object} field
 */
var AuthorLabelInput = {
	mixins: [HelpMixin, FormFieldLayoutMixin],
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
			this.$set('field.show', false);
			this.$set('field.value', '');
		},
		/**
		 * Update text labels
		 */
		updateLabels: function() {
			if(this.field.value.length > 0) {
				this.$set('field.labels', [{ text: '\"' + this.field.value + '\"' }]);
			} else {
				this.$set('field.labels', []);
			}
		}
	},
	watch: {
		'field.value': function() {
			this.updateLabels();
		},
	},
	ready: function() {
		this.updateLabels();
		// Initialize help
		this.initHelp({
			title: 'UPPHOV',
			content: require('docs/author_name.md'), 
			anchorToElement: this.$el.getElementsByClassName('FormFieldInput')[0],
		});
	}
};

module.exports = AuthorLabelInput;