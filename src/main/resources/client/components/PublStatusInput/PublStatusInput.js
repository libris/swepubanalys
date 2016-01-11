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
		this.updateLabels();
		// Initialize help
		this.initHelp({
			title: 'PUBLICERINGSSTATUS',
			content: require('docs/publication_status.md'), 
			anchorToElement: this.$els.formFieldInput,
		});
	},
	watch: {
		'field.value': function() {
			this.updateLabels();
		}
	},
	methods: {
		/**
		 * Set labels according to value
		 */
		updateLabels: function() {
			var text = '';
			switch(this.field.value) {
				case 'all':
					text = 'Publicerade- och opublicerade poster';
				break;
				case 'published':
					text = 'Publicerade poster';
				break;
				case 'unpublished':
					text = 'Opublicerade poster';
				break;
			}
			this.$set('field.labels', [{
				text: text
			}]);
		}	
	}
};

module.exports = PublStatusInput;