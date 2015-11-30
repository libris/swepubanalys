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
	events: {
		/**
		 * Call on autocomplete-input to select an option. Will sync with props.orgs
		 */
		'set-org-value': function(value) {
			this.$broadcast('select-option', value);
		}
	},
	ready: function() {
		this.initHelp({
			title: 'ORGANISATION',
			content: require('docs/organisation.md'), 
			anchorToElement: this.$el.getElementsByClassName('FormFieldInput')[0],
		});
	}
};

module.exports = OrgInput;