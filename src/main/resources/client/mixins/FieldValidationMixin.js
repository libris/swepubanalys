'use strict';

// Components
var FormErrorLabel = require('components/FormErrorLabel/FormErrorLabel.js');

/*
 * Field Validation mixin. Is used to test props.field.value against props.field.test.expression.
 * @prop {Object} field
 * @prop {Object} test
 */
var FieldValidationMixin = {
	data: function() {
		return {
			errors: [],
		}
	},
	components: {
		'form-error-label': FormErrorLabel,
	},
	methods: {
		/**
		 * The function executes all provided validation functions and pushes possible errors to data.errors
		 * @param {Array} funcs
		 */
		setValidationListeners: function(funcs) {
			var t; // Timeout reference
			var dt = 1000;
			this.$watch('field', function(val) {
				this.$set('errors', []); // Reset error messages
				clearTimeout(t); // Clear old timeout, if it exists
				// Perform tests after a while
				t = setTimeout(function() {
					funcs.map(function(func) { // Iterate through validation functions
						// Test field value
						var test = func.call(this);
						// If failed
						if(test !== true) { 
							this.errors.push(test); // Add error message
						}
					}.bind(this));
				}.bind(this), dt);
			}.bind(this), { deep: true });
		},
		/**
		 * Used to test props.field.value against props.test.expression
		 */
		isValidAccordingToRegexp: function() {
			var test = this.test;
			var field = this.field;
			if(test && test.expression && typeof test.expression === 'string') {
				var valid = RegExp(test.expression).test(field.value);
				return valid || test.errorMessage || 'Error';
			}
			else {
				return true;
			}
		},
	}
};

module.exports = FieldValidationMixin;