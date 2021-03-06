'use strict';

// Components
var AutocompleteInput = require('components/AutocompleteInput/AutocompleteInput.js');
var HelpMixin = require('mixins/HelpMixin/HelpMixin.js');
// Mxins
var FormFieldLayoutMixin = require('mixins/FormFieldLayoutMixin/FormFieldLayoutMixin.js');
// Utils
var arrayToSparqlString = require('utils/arrayToSparqlString.js');

/**
 * Subject Input-component
 * @prop {Object} field
 */
var SubjectInput = {
	mixins: [HelpMixin, FormFieldLayoutMixin],
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
			this.$set('field.value', arrayToSparqlString(this.subjects.map(function(d) { return d.value; })));
			this.$set('field.labels', this.subjects);
		}
	},
	ready: function() {
		this.initHelp({
			title: 'FORSKNINGSÄMNE',
			content: require('docs/subject.md'), 
			anchorToElement: this.$els.formFieldInput,
		});
	}
};

module.exports = SubjectInput;