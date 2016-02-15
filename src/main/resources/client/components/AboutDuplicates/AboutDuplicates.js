'use strict';

/**
 * 
 * 
 */
 //Vendor
var marked = require('marked');

var AboutDuplicates = {
	data: function() {
		return {
			about: '',
		}
	},
	props: ['field'],
	template: require('./AboutDuplicates.html'),
	ready: function() {
		this.$set('about', marked(require('docs/duplicates.md')));
	}
};

module.exports = AboutDuplicates;