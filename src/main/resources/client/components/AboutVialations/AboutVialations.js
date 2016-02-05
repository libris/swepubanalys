'use strict';

/**
 * 
 * 
 */
var marked = require('marked');


var AboutVialation = {
		data: function() {
		return {
			about: '',
		}
	},
	props: ['field'],
	template: require('./AboutVialation.html'),
	ready: function() {
		this.$set('about', marked(require('docs/violation_type.md')));
	}
};

module.exports = AboutVialation;