'use strict';

// Components
var AutocompleteInput = require('components/AutocompleteInput/AutocompleteInput.js');
// Mixins
var HelpMixin = require('mixins/HelpMixin/HelpMixin.js');
var FormFieldLayoutMixin = require('mixins/FormFieldLayoutMixin/FormFieldLayoutMixin.js');
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
			this.$set('field.value', arrayToSparqlString(this.orgs.map(function(d) { return d.value; })));
			this.$set('field.labels', this.orgs);
		}
	},
	ready: function() {
		this.initHelp({
			title: 'ORGANISATION',
			content: require('docs/organisation.md'), 
			anchorToElement: this.$el.getElementsByClassName('FormFieldInput')[0],
		});
	},
	methods: {
		/**
		 * Directly select an option in the autocomplete-input
		 * @prop {String} value
		 */
		setValue: function(value) {
			this.$refs.orgAutocompleteInput.selectOption(value);
		}
	}
};

module.exports = OrgInput;