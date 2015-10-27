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
		}
	},
	watch: {
		'field.value': function() {
			this.$set('field.labels', [{ text: '\"' + this.field.value + '\"' }]);
		},
	},
	ready: function() {
		// Initialize help
		this.initHelp({
			title: 'UPPHOV',
			content: require('docs/author_label.md'), 
			anchorToElement: this.$el.getElementsByClassName('FormFieldInput')[0],
		});
	}
};

module.exports = AuthorLabelInput;