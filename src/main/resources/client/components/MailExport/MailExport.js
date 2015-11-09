'use strict';

// Mixins
var FormFieldValidationMixin = require('mixins/FormFieldValidationMixin/FormFieldValidationMixin.js');
// Utils
var SparqlUtil = require('utils/SparqlUtil/SparqlUtil.js');
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
			format: 'text/csv',
			email: '',
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
		 * @param {Function} callback
		 */
		var isValidEmail = function(callback) {
			var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
			callback(this.email.length === 0 || re.test(this.email) || 'Ogiltig e-mail angiven');
		}.bind(this);
		this.setValidationListeners('email', [isValidEmail]);
	},
	methods: {
		/**
		 * Sends request with format, email and query to server
		 * @param {Object} e
		 */
		performExport: function(e) {
			e.stopPropagation();
			SparqlUtil.sendFileToEmail(this.email, this.format, false, this.query, function(response) {
			});
			this.$set('sent', true);
		}
	}
};

module.exports = MailExport;