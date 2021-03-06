'use strict';

// Vendor
var Vue = require('vue');
var _cloneDeep = require('lodash/lang/cloneDeep');
var _sortBy = require('lodash/collection/sortBy');
var _max = require('lodash/math/max');
// Utils
var SearchFormUtil = require('utils/SearchFormUtil/SearchFormUtil.js');
var FormFieldMemoryUtil = require('utils/FormFieldMemoryUtil/FormFieldMemoryUtil.js');
// Components
var OrgInput = require('components/OrgInput/OrgInput.js');
var TimeInput = require('components/TimeInput/TimeInput.js');
var SubjectInput = require('components/SubjectInput/SubjectInput.js');
var PublTypeInput = require('components/PublTypeInput/PublTypeInput.js');
var OutputInput = require('components/OutputInput/OutputInput.js');
var AuthorLabelInput = require('components/AuthorLabelInput/AuthorLabelInput.js');
var OrcidInput = require('components/OrcidInput/OrcidInput.js');
var OAInput = require('components/OAInput/OAInput.js');
var PublStatusInput = require('components/PublStatusInput/PublStatusInput.js');
var ShowFieldButton = require('components/ShowFieldButton/ShowFieldButton.js');
// CSS-modules
var styles = require('./SearchForm.css');
// CSS
require('css/transitions.css');

/**
 * Search Form-component
 * @prop {Function} onSearch
 * @prop {Function} onChange
 * @prop {String} defaultTemplate
 * @prop {String} to
 * @prop {String} from
 */
var SearchForm = {
	template: require('./SearchForm.html'),
	props: ['onSearch', 'onChange', 'defaultTemplate', 'to', 'from'],
	data: function() {
		return {
			formTests: {},
			// Data which will possibly be used onSearch
			templateName: this.defaultTemplate || 'QfBibliometrics',
			fields: getDefaultFields.call(this),
			fieldMemory: {},
			// CSS-modules
			_styles: styles
		}
	},
	components: {
		'show-field-button': ShowFieldButton,
		'org': {
			components: { 'org-input': OrgInput },
			template: require('./inputs/org.html')
		},
		'time': {
			components: { 'time-input': TimeInput },
			template: require('./inputs/time.html')
		},
		'subject': {
			components: { 'subject-input': SubjectInput },
			template: require('./inputs/subject.html')
		},
		'publType': {
			components: { 'publ-type-input': PublTypeInput },
			template: require('./inputs/publType.html')
		},
		'output': {
			components: { 'output-input': OutputInput },
			template: require('./inputs/output.html')
		},
		'authorLabel': {
			components: { 'author-label-input': AuthorLabelInput },
			template: require('./inputs/authorLabel.html')
		},
		'orcid': {
			components: { 'orcid-input': OrcidInput },
			template: require('./inputs/orcid.html')
		},
		'openaccess': {
			components: { 'oa-input': OAInput },
			template: require('./inputs/openaccess.html')
		},
		'publStatus': {
			components: { 'publ-status-input': PublStatusInput },
			template: require('./inputs/publStatus.html'),
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
				this.$set('fields.org.suggestions', formSuggestions.orgs);
			}
			if(formSuggestions.subjects) {
				this.$set('fields.subject.suggestions', formSuggestions.subjects);
			}
			if(formSuggestions.publTypes) {
				this.$set('fields.publType.suggestions', formSuggestions.publTypes);
			}
			if(formSuggestions.output) {
				this.$set('fields.output.suggestions', formSuggestions.output);
			}

		}.bind(this));
		// Apply on-change listener and trigger on-change once
		if(this.onChange) {
			var formData = this.generateFormData();
			//check if the user has been to another site through a href

			this.onChange(formData);
			this.$watch('fields', function() {
				var formData = this.generateFormData();
				this.onChange(formData);
			}, { deep: true });
		}
	},
	methods: {
		/**
		 * Callback sent to click event of showFieldButton
		 * @param {Object} field
		 */
		getFieldIndex: function() {
			var max = _max(this.fields, function(field) { 
				return field.index;
			});
			max = max.index || 0;
			max++;
			return max;
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
				var formData = this.generateFormData();
				this.onSearch(formData);
			} else {
				console.error('*** SearchForm.performSearch: No onSearch prop provided');
			}
		},
		/**
		 * Generates formData
		 * @return {Object} formData
		 */
		generateFormData: function() {
			var formData = {
				fields: Object.keys(this.fields).map(function(key, i) {
					var field = this.fields[key];
					return {
						fieldName: key,
						value: field.value,
						labels: _cloneDeep(field.labels),
					}
				}.bind(this)),
				formModel: this.getFormModel(),
			};
			return formData;
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
						output: this.fields.output.value,
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
			
			this.$set('fieldMemory', formModel);
			
			//Setting memory of formfield
			var externalPass = localStorage.getItem('externalPass');
			if(externalPass === 'false') {
				FormFieldMemoryUtil.setMemory(formModel);
			}
			else {
				var schoolOrg = FormFieldMemoryUtil.getMemory().org;
				setTimeout(function() { this.$broadcast('set-org-value', schoolOrg); }.bind(this), 1000);
				localStorage.setItem('externalPass', false);
			}
			return formModel;
		},
		/**
		 * Used to determine if a field should be used as a template
		 * @param {Object} field
		 * @param {String} templateName
		 * @return {Boolean}
		 */
		isTemplateField: function(field, templateName) {
			var valid = false;
			var theTemplateFields = templateFields[templateName] || [];
			for(var i = 0; i < theTemplateFields.length; i++) {
				if(theTemplateFields[i] === field.fieldName) {
					valid = true;
				}
			}
			return valid;
		},
	}
};

/**
 * Used to order data.fields by index
 * @param {Object} fields
 * @return {Array}
 */
Vue.filter('orderFields', function(fields) {
	fields = _sortBy(fields, function(field) {
		return field.index;
	});
	return fields;
});

var templateFields = {
	'simple': 			['org', 'time', 'subject', 'publType', 'openaccess', 'publStatus'],
	'duplicates': 		['org', 'time'],
	'QfBibliometrics': 	['org', 'time', 'subject', 'output', 'authorLabel', 'orcid', 'openaccess', 'publStatus'],
};

/**
 * Return default fields
 */
var getDefaultFields = function() {
	return {
		org: {
			index: 1,
			value: '',
			labels: [],
			suggestions: [],
			fieldName: 'org',
			name: 'Organisation'
		},
		time: {
			index: 2,
			from: this.from || '',
			to: this.to || '',
			labels: [],
			fieldName: 'time',
			name: 'Publiceringsår'
		},
		subject: {
			index: 3,
			value: '',
			labels: [],
			suggestions: [],
			fieldName: 'subject',
			name: 'Forskningsämne'
		},
		publType: {
			index: 5,
			show: false, 
			value: '',
			labels: [], 
			suggestions: [],
			fieldName: 'publType',
			name: 'Publikationstyp'
		},
		output: {
			index: 5,
			show: false,
			value: '',
			labels: [],
			suggestions: [],
			fieldName: 'output',
			name: 'Outputtyp'
		},
		authorLabel: { 
			index: 5,
			show: false,
			value: '',
			labels: [], 
			fieldName: 'authorLabel',
			name: 'Upphov'
		},
		orcid: { 
			fieldName: 'orcid',
			name: 'ORCID', 
			value: '',
			labels: [],
			index: 5,					
			show: false 
		},
		openaccess: {
			fieldName: 'openaccess',
			name: 'Open access',
			value: false,
			labels: [], 
			index: 5,
			show: false 
		},
		publStatus: {
			fieldName: 'publStatus',
			name: 'Publiceringsstatus',
			value: 'published', 
			labels: [],
		}
	}
};

module.exports = SearchForm;