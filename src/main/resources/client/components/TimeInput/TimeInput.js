'use strict';

// Mixins
var FieldValidationMixin = require('mixins/FieldValidationMixin.js');

/**
 * Time Input-component
 * @prop {Object} field
 * @prop {Object} test
 */
var TimeInput = {
	mixins: [FieldValidationMixin],
	props: ['field', 'test'],
	template: require('./TimeInput.html'),
	ready: function() {
		/**
		 * Since FieldValidationMixin.isValidAccordingToRegexp checks against props.field.value we have to define
		 * our own function to test against test.expression, since this component has a field.from and a field.to
		 * instead.
		 */
		var isTimeValidAccordingToRegexp = function() {
			var test = this.test;
			var field = this.field;
			if(test.expression && typeof test.expression === 'string') {
				var valid = RegExp(test.expression).test(field.from) && RegExp(test.expression).test(field.to);
				return valid || test.errorMessage || 'Error';
			}
			else {
				return true;
			}
		}.bind(this);
		/**
		 * Checks if from > to and vice versa
		 * @param {Object} time
		 */
		var isValidRange = function() {
			var field = this.field;
			var FromSmallerThanTo = Number(field.from) <= Number(field.to);
			var valid = (field.from.length === 0 || field.to.length === 0) || FromSmallerThanTo;
			return valid || 'Ogiltigt tidsintervall';
		}.bind(this);
		
		this.setValidationListeners([isTimeValidAccordingToRegexp, isValidRange]);
	}
};

module.exports = TimeInput;