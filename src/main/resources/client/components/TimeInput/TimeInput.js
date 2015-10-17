'use strict';

// Mixins
var FieldValidationMixin = require('mixins/FormFieldValidationMixin/FormFieldValidationMixin.js');
var FormFieldLayoutMixin = require('mixins/FormFieldLayoutMixin/FormFieldLayoutMixin.js');
// Utils
var SearchFormUtil = require('utils/SearchFormUtil');

/**
 * Time Input-component
 * @prop {Object} field
 * @prop {Object} test
 */
var TimeInput = {
	mixins: [FieldValidationMixin, FormFieldLayoutMixin],
	props: ['field', 'test'],
	template: require('./TimeInput.html'),
	data: function() {
		return {
			publicationYearSpan: {
				min: 1500,
				max: 2050
			}
		}
	},
	ready: function() {
		/**
		 * Since FieldValidationMixin.isValidAccordingToRegexp checks against props.field.value we have to define
		 * our own function to test against test.expression, since this component has a field.from and a field.to
		 * instead.
		 */
		var isTimeValidAccordingToRegexp = function(callback) {
			var test = this.test;
			var field = this.field;
			if(test.expression && typeof test.expression === 'string') {
				var valid = RegExp(test.expression).test(field.from) && RegExp(test.expression).test(field.to);
				callback(valid || test.errorMessage || 'Error');
			}
			else {
				callback(true);
			}
		}.bind(this);
		/**
		 * Checks if from > to and vice versa
		 * @param {Object} time
		 */
		var isValidRange = function(callback) {
			var field = this.field;
			var FromSmallerThanTo = Number(field.from) <= Number(field.to);
			var valid = (field.from.length === 0 || field.to.length === 0) || FromSmallerThanTo;
			callback(valid || 'Ogiltigt tidsintervall');
		}.bind(this);
		/**
		 * Checks user provided values against publication year span from server
		 */
		var isValidYearSpan = function(callback) {
			var field = this.field;
			var valid = (field.to.length === 0 || (field.to <= this.publicationYearSpan.max)) && (field.from.length === 0 || (field.from >= this.publicationYearSpan.min && field.from <= this.publicationYearSpan.max));
			callback(valid || 'Årtal skall anges mellan ' + this.publicationYearSpan.min + ' och ' + this.publicationYearSpan.max);			
		}.bind(this);
		// Get publication year span from server
		SearchFormUtil.getPublicationYearSpan(function(response) {
			if(response && response.max && response.min) {
				this.$set('publicationYearSpan', response);
			}
		}.bind(this));
		// Set validation listeners though the FieldValidationMixin
		this.setValidationListeners([isTimeValidAccordingToRegexp, isValidRange, isValidYearSpan]);
	}
};

module.exports = TimeInput;