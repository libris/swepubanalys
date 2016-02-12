'use strict';

//Utils
var FormFieldMemoryUtil = require('utils/FormFieldMemoryUtil/FormFieldMemoryUtil.js');

/**
 * Form field memory Mixin
 * Used to ask for- and maintain where in the form field the user was before leaving the page through a link
 */
var FormFieldMemoryMixin = {
	data: function() {
		return {
		}
	},
	events: {
	},
	ready: function() {
	}
};

module.exports = FormFieldMemoryMixin;