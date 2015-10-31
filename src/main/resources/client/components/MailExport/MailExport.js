'use strict';

// Mixins
var FormFieldValidationMixin = require('mixins/FormFieldValidationMixin/FormFieldValidationMixin.js');
// CSS-modules
var styles = require('!!style!css?modules!./MailExport.css');

/**
 * Mail Export Component
 */
var MailExport = {
	mixins: [FormFieldValidationMixin],
	props: ['query'],
	template: require('./MailExport.html'),
	data: function() {
		return {
			sent: false,
			format: 'application/json',
			field: {
				value: ''
			},
			_styles: styles
		}
	},
	watch: {
		/**
		 * Reset sent-status on new query
		 */
		'query': function() {
			this.$set('sent', false)
		}
	},
	ready: function() {
		/**
		 * Check if field.value is a valid email address
		 * source: http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
		 */
		var isValidEmail = function(callback) {
			var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
			callback(this.field.value.length === 0 || re.test(this.field.value) || 'Ogiltig e-mail angiven');
		}.bind(this);
		this.setValidationListeners([isValidEmail]);
	},
	methods: {
		/**
		 * Sends request with format, email and query to server
		 */
		performExport: function(e) {
			e.stopPropagation();
			var data = {
				email: this.field.value,
				format: this.format,
				query: this.query
			};
			this.$set('sent', true);
		}
	}
};

module.exports = MailExport;