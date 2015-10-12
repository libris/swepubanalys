'use strict';

// Components
var AutocompleteInput = require('components/AutocompleteInput/AutocompleteInput.js');
var HelpMixin = require('mixins/HelpMixin.js');
// Utils
var arrayToSparqlString = require('utils/arrayToSparqlString.js');

/**
 * Organisation Input-component
 * @prop {Object} field
 */
var OrgInput = {
	mixins: [HelpMixin],
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
			marginLeft: '15px',
			marginTop: '20px',
		});
	}
};

module.exports = OrgInput;