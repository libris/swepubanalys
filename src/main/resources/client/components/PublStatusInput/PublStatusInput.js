'use strict';

// Mixins
var HelpMixin = require('mixins/HelpMixin/HelpMixin.js');
var FormFieldLayoutMixin = require('mixins/FormFieldLayoutMixin/FormFieldLayoutMixin.js');

/**
 * Publication Status Input-component
 * @prop {Object} field
 */
var PublStatusInput = {
	mixins: [HelpMixin, FormFieldLayoutMixin],
	props: ['field'],
	template: require('./PublStatusInput.html'),
	ready: function() {
		// Initialize help
		this.initHelp({
			title: 'PUBLICERINGSSTATUS',
			content: require('docs/publication_status.md'), 
			anchorToElement: this.$el.getElementsByClassName('PublStatusInput')[0],
		});
	}
};

module.exports = PublStatusInput;