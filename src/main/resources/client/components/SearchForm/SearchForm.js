'use strict';

// Vendor
var Vue = require('vue');
var _sortBy = require('lodash/collection/sortBy');
var _max = require('lodash/math/max');
// Utils
var SearchFormUtil = require('utils/SearchFormUtil.js');
// Components
var OrgInput = require('components/OrgInput/OrgInput.js');
var TimeInput = require('components/TimeInput/TimeInput.js');
var SubjectInput = require('components/SubjectInput/SubjectInput.js');
var PublTypeInput = require('components/PublTypeInput/PublTypeInput.js');
var AuthorLabelInput = require('components/AuthorLabelInput/AuthorLabelInput.js');
var OrcidInput = require('components/OrcidInput/OrcidInput.js');
var OAInput = require('components/OAInput/OAInput.js');
var PublStatusInput = require('components/PublStatusInput/PublStatusInput.js');
var ShowFieldButton = require('components/ShowFieldButton/ShowFieldButton.js');
// CSS
require('css/transitions.css');
require('./SearchForm.css');

/**
 * Search Form-component
 * @prop {Function} onSearch
 */
var SearchForm = {
	template: require('./SearchForm.html'),
	props: ['onSearch'],
	data: function() {
		return {
			formTests: {},
			// Data which will possibly be used onSearch
			templateName: 'QfBibliometrics',
			fields: defaultFields
		}
	},
	components: {
		'org-input': OrgInput,
		'time-input': TimeInput,
		'subject-input': SubjectInput,
		'publ-type-input': PublTypeInput,
		'author-label-input': AuthorLabelInput,
		'orcid-input': OrcidInput,
		'oa-input': OAInput,
		'publ-status-input': PublStatusInput,
		'show-field-button': ShowFieldButton,
		'org': {
			inherit: true,
			template: require('./org.html')
		},
		'time': {
			inherit: true,
			template: require('./time.html')
		},
		'subject': {
			inherit: true,
			template: require('./subject.html')
		},
		'publType': {
			inherit: true,
			template: require('./publType.html')
		},
		'authorLabel': {
			inherit: true,
			template: require('./authorLabel.html')
		},
		'orcid': {
			inherit: true,
			template: require('./orcid.html')
		},
		'openaccess': {
			inherit: true,
			template: require('./openaccess.html')
		},
		'publStatus': {
			inherit: true,
			template: require('./publStatus.html'),
		}
	},
	ready: function() {
		// Get and set form tests
		SearchFormUtil.getFormTests(function(formTests) {
			this.$set('formTests', formTests);
		}.bind(this));
		// Get and set form suggestions
		SearchFormUtil.getFormSuggestions(function(formSuggestions) {
			if(formSuggestions.orgs) {
				this.fields.org.$set('suggestions', formSuggestions.orgs);
			}
			if(formSuggestions.subjects) {
				this.fields.subject.$set('suggestions', formSuggestions.subjects);
			}
			if(formSuggestions.publTypes) {
				this.fields.publType.$set('suggestions', formSuggestions.publTypes);
			}
		}.bind(this));
	},
	methods: {
		/**
		 * Callback sent to click event of showFieldButton
		 * @param {Object} field
		 */
		onClickShowField: function(field) {
			field.$set('show', true);
			var max = _max(this.fields, function(field) { 
				return field.index;
			});
			max = max.index || 0;
			max++;
			field.$set('index', max);
		},
		/**
		 * Sets template name
		 * @param {String} templateName
		 */
		setTemplateName: function(templateName) {
			this.$set('templateName', templateName);
		},
		/**
		 * User clicks search-button
		 */
		performSearch: function() {
			if(this.onSearch) {
				this.onSearch(this.getFormModel());
			}
			else {
				console.error('*** SearchForm.performSearch: No onSearch prop provided');
			}
		},
		/**
		 * Generates formModel from $vm.data
		 * @return {Object} formModel
		 */
		getFormModel: function() {
			var models = {
				'simple': function() {
					var model = {
						templateName: 'simple',
						org: this.fields.org.value,
						from: this.fields.time.from,
						to: this.fields.time.to,
						subject: this.fields.subject.value,
						publtype: this.fields.publType.value,
						openaccess: this.fields.openaccess.value,
						status: this.fields.publStatus.value,
					}
					return model;
				},
				'duplicates': function() {
					var model = {
						templateName: 'duplicates',
						org: this.fields.org.value,
						from: this.fields.time.from,
						to: this.fields.time.to,
					}
					return model;
				},
				'QfBibliometrics': function() {
					var model = {
						templateName: 'QfBibliometrics',
						org: this.fields.org.value,
						from: this.fields.time.from,
						to: this.fields.time.to,
						subject: this.fields.subject.value,
						publtype: this.fields.publType.value,
						author: this.fields.authorLabel.value,
						orcid: this.fields.orcid.value,
						openaccess: this.fields.openaccess.value,
						status: this.fields.publStatus.value,
					}
					return model;
				}
			};
			var formModel = models[this.templateName].call(this);
			console.log('*** SearchForm.generateFormModel: formModel generated:');
			console.log(JSON.stringify(formModel));
			return formModel;
		},
		/**
		 * Determines if active template name is present in templateNames
		 * @return {Boolean}
		 */
		activeTemplate: function(templateNames) {
			for(var i = 0; i < templateNames.length; i++) {
				if(this.templateName === templateNames[i]) {
					return true;
				}
			}
		}
	}
};

/**
 * Used to order data.fields by index
 */
Vue.filter('orderFields', function(fields) {
	fields = _sortBy(fields, function(field) {
		return field.$value.index;
	});
	return fields;
});

var defaultFields = {
	org: {
		index: 1,
		value: '',
		suggestions: [],
		fieldName: 'org',
		name: 'Organisation'
	},
	time: {
		index: 2,
		from: '',
		to: '',
		fieldName: 'time',
		name: 'Publiceringsår'
	},
	subject: {
		index: 3,
		value: '',
		suggestions: [],
		fieldName: 'subject',
		name: 'Ämne'
	},
	publType: {
		index: 5,
		show: false, 
		value: '', 
		suggestions: [],
		fieldName: 'publType',
		name: 'Publikationstyp'
	},
	authorLabel: { 
		index: 5,
		show: false,
		value: '', 
		fieldName: 'authorLabel',
		name: 'Upphov'
	},
	orcid: { 
		fieldName: 'orcid',
		name: 'Orcid', 
		value: '',
		index: 5,					
		show: false 
	},
	openaccess: {
		fieldName: 'openaccess',
		name: 'Open access',
		value: false, 
		index: 5,
		show: false 
	},
	publStatus: {
		fieldName: 'publStatus',
		name: 'Publikationsstatus',
		value: 'published', 
	}
};

module.exports = SearchForm;