'use strict';

// Components
var HideFieldButton = require('components/HideFieldButton/HideFieldButton.js');
// Mixins
var HelpMixin = require('mixins/HelpMixin/HelpMixin.js');
var FormFieldValidationMixin = require('mixins/FormFieldValidationMixin/FormFieldValidationMixin.js');
var FormFieldLayoutMixin = require('mixins/FormFieldLayoutMixin/FormFieldLayoutMixin.js');
// Utils
var SearchFormUtil = require('utils/SearchFormUtil/SearchFormUtil.js');

/**
 * Orcid Input-component
 * @prop {Object} field
 * @prop {Object} test
 */
var OrcidInput = {
	mixins: [HelpMixin, FormFieldValidationMixin, FormFieldLayoutMixin],
	props: ['field', 'test'],
	template: require('./OrcidInput.html'),
	components: {
		'hide-field-button': HideFieldButton
	},
	watch: {
		'field.value': function() {
			this.updateLabels();
		}
	},
	ready: function() {
		// Initialize help
		this.initHelp({
			title: 'ORCID',
			content: require('docs/orcid.md'), 
			anchorToElement: this.$el.getElementsByClassName('FormFieldInput')[0],
		});
		/**
		 * This test-function asks server to validate the user provided orcid (field.value)
		 * @param {Function} callback
		 */
		var isValidAccordingToServer = function(callback) {
			if(this.field.value.length > 0) {
				// If field.value is not an url, add http://orcid.org/
				var value = this.field.value;
				var Url = /^((http|https|ftp):\/\/[\dA-z.]*)\/*/;
				if(!Url.test(value)) { 
					value = 'http://orcid.org/' + value; // Add orcid-url
				}
				/**
				 * Ask server to validate value
				 */
				SearchFormUtil.validateOrcidUrl(value, function(response) {
					if(response && typeof response.result !== 'undefined') {
						if(response.result !== true) {
							callback(response.reason || 'Ogiltigt Orcid angivet' + ' (' + value + ')');
						}
						else {
							callback(true);
						}
					}
					else {
						callback('Orcid kan ej valideras');
					}
				});
			}
			else {
				callback(true);
			}
		}.bind(this);
		this.setValidationListeners('field.value', [this.isValidAccordingToRegexp, isValidAccordingToServer]);
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
	}
};

module.exports = OrcidInput;