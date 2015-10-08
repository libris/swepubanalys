'use strict';

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
			// GUI state
			orgs: [],
			orgSuggestions: [],
			subjects: [],
			subjectSuggestions: [],
			publTypes: [],
			publTypeSuggestions: [],
			formTests: {},
			// Data which will possibly be used onSearch
			templateName: 'QfBibliometrics',
			org: { 
				name: 'Organisation', 
				value: ''
			},
			subject: { 
				value: ''
			},
			publType: {	
				name: 'Publikationstyp', 
				value: '', 
				show: false 
			},
			time: {
				from: '',
				to: '',
				error: '',				
			},
			authorLabel: { 
				name: 'Upphov', 
				value: '', 
				show: false 
			},
			orcid: { 
				name: 'Orcid', 
				value: '', 
				show: false 
			},
			openaccess: { 
				name: 'Open access',
				value: false, 
				show: false 
			},
			publStatus: {
				value: 'published', 
			}
		};
	},
	watch: {
		/**
		 * On change of data.orgs we convert array to a string and set data.org
		 */
		'orgs': function() {
			this.org.$set('value', this.arrayToString(this.orgs));
		},
		/**
		 * Ditto for data.subjects
		 */
		'subjects': function() {
			this.subject.$set('value', this.arrayToString(this.subjects));
		},
		/**
		 * Ditto for data.publTypes
		 */
		'publTypes': function() {
			this.publType.$set('value', this.arrayToString(this.publTypes));
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
	},
	ready: function() {
		// Get and set form tests
		SearchFormUtil.getFormTests(function(formTests) {
			this.$set('formTests', formTests);
		}.bind(this));
		// Get and set form suggestions
		SearchFormUtil.getFormSuggestions(function(formSuggestions) {
			if(formSuggestions.orgs) {
				this.$set('orgSuggestions', formSuggestions.orgs);
			}
			if(formSuggestions.subjects) {
				this.$set('subjectSuggestions', formSuggestions.subjects);
			}
			if(formSuggestions.publTypes) {
				this.$set('publTypeSuggestions', formSuggestions.publTypes);
			}
		}.bind(this));
	},
	methods: {
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
				console.error('*** SearchForm.performSearch(): No onSearch prop provided');
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
						org: this.org.value,
						from: this.time.from,
						to: this.time.to,
						subject: this.subject.value,
						publtype: this.publType.value,
						openaccess: this.openaccess.value,
						status: this.publStatus.value,
					}
					return model;
				},
				'duplicates': function() {
					var model = {
						templateName: 'duplicates',
						org: this.org.value,
						from: this.time.from,
						to: this.time.to,
					}
					return model;
				},
				'QfBibliometrics': function() {
					var model = {
						templateName: 'QfBibliometrics',
						org: this.org.value,
						from: this.time.from,
						to: this.time.to,
						subject: this.subject.value,
						publtype: this.publType.value,
						author: this.authorLabel.value,
						orcid: this.orcid.value,
						openaccess: this.openaccess.value,
						status: this.publStatus.value,
					}
					return model;
				},
			}
			var formModel = models[this.templateName].call(this);
			console.log('*** SearchForm.generateFormModel(): formModel generated:');
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
		},
		/**
		 * ['liu', 'kth'] = 'liu,kth'
		 */
		arrayToString: function(arr) {
			var str = '';
			(arr || []).map(function(member, i) {
				str += member;
				if(i !== arr.length - 1) {
					str += ',';
				}
			}.bind(this));
			return str;
		},
	}
};

module.exports = SearchForm;