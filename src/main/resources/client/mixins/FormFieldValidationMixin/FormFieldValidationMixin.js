'use strict';

// Vendor
var Q = require('q');
// Components
var FormErrorLabel = require('components/FormErrorLabel/FormErrorLabel.js');

/**
 * Field Validation Mixin. Used to test $data.field.value against $data.field.test functions, or custom
 * test functions
 */
var FormFieldValidationMixin = {
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
		 * The function executes all provided validation functions and pushes possible errors to data.errors.
		 * Provided functions must use a callback, not return, to support async checks.
		 * @param {String} path
		 * @param {Array} funcs
		 */
		setValidationListeners: function(path, funcs) {		
			/**
			 * This function takes a (possibly async) test function and creates a promise. 
			 * If test failed, it adds corresponding error to data.errors
			 * @param {Function} func
			 * @param {Array} errors
			 */
			var testFuncFactory = function(func, errors) {
				var deferred = Q.defer();
				func(function(passed) {
					if(passed !== true) { 
						errors.push(passed); // Add error message
					}
					deferred.resolve();
				});
				return deferred.promise;
			}
			var t; // Timeout reference
			var dt = 800;
			// On field change
			this.$watch(path, function(val) {
				this.$set('errors', []); // Reset error messages
				clearTimeout(t); // Clear old timeout, if it exists
				// Perform tests after a while
				t = setTimeout(function() {
					if(funcs.length > 0) { // Check if there are any functions to test against
						var promise = testFuncFactory(funcs[0], this.errors); // Create a promise
						for (var i = 1; i < funcs.length; i++) {
							promise = promise.then(testFuncFactory(funcs[i], this.errors)); // Add function to promise chain
						}
					}
				}.bind(this), dt);
			}.bind(this), { deep: true });
		},
		/**
		 * Used to test props.field.value against props.test.expression
		 * @param {Function} callback
		 */
		isValidAccordingToRegexp: function(callback) {
			var test = this.test;
			var field = this.field;
			if(test && test.expression && typeof test.expression === 'string') {
				var valid = RegExp(test.expression).test(field.value);
				callback(valid || test.errorMessage || 'Error');
			}
			else {
				callback(true);
			}
		},
	}
};

module.exports = FormFieldValidationMixin;