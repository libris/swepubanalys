'use strict';

/**
 * This mixin makes a wrapper component available. The wrapper may be used to insert form-field elements
 */
var FormFieldLayoutMixin = {
	props: ['hideable'],
	components: {
		'form-field-wrapper': {
			inherit: true,
			template: require('./FormFieldLayoutWrapper.html'),
		}
	}
};

module.exports = FormFieldLayoutMixin;