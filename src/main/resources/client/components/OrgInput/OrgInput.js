'use strict';

// Components
var AutocompleteInput = require('components/AutocompleteInput/AutocompleteInput.js');
// Mixins
var HelpMixin = require('mixins/HelpMixin.js');
var FormFieldLayoutMixin = require('mixins/FormFieldLayoutMixin');
// Utils
var arrayToSparqlString = require('utils/arrayToSparqlString.js');

/**
 * Organisation Input-component
 * @prop {Object} field
 */
var OrgInput = {
	mixins: [HelpMixin, FormFieldLayoutMixin],
	props: ['field'],
	template: require('./OrgInput.html'), 
	components: {
		'autocomplete-input': AutocompleteInput,
	},
	data: function() {
		return {
			orgs: []
		}
	},
	watch: {
		'orgs': function() {
			this.field.$set('value', arrayToSparqlString(this.orgs));
		}
	},
	ready: function() {
		this.initHelp({
			title: 'ORGANISATION',
			content: require('./OrgInput.Help.html'),
			marginTop: '12px'
		});
	}
};

module.exports = OrgInput;