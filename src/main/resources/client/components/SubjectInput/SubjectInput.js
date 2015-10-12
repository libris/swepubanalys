'use strict';

// Components
var AutocompleteInput = require('components/AutocompleteInput/AutocompleteInput.js');
var HelpMixin = require('mixins/HelpMixin.js');
// Utils
var arrayToSparqlString = require('utils/arrayToSparqlString.js');

/**
 * Subject Input-component
 * @prop {Object} field
 */
var SubjectInput = {
	mixins: [HelpMixin],
	props: ['field'],
	template: require('./SubjectInput.html'),
	components: {
		'autocomplete-input': AutocompleteInput,
	},
	data: function() {
		return {
			subjects: []
		}
	},
	watch: {
		'subjects': function() {
			this.field.$set('value', arrayToSparqlString(this.subjects));
		}
	},
	ready: function() {
		this.initHelp({
			title: 'FORSKNINGSÄMNE',
			content: require('./SubjectInput.Help.html'),
			marginLeft: '15px',
			marginTop: '20px',
		});
	}
};

module.exports = SubjectInput;