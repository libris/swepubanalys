'use strict'

/**
 * This utility module is used to ask set and recieve for field from and to localstorage
 */
var FormFieldMemoryUtil = {
	/**
	 */
	setMemory: function(formField) {
		localStorage.setItem('org', formField.org);		
		localStorage.setItem('from', formField.from);
		localStorage.setItem('to', formField.to);				
	},
	getMemory: function() {
		var org = localStorage.getItem('org');
		var from = localStorage.getItem('from');
		var to = localStorage.getItem('to');
		var memory = {
			'org': org,
			'from': from,
			'to': to
		}
		return memory;
	}
};

module.exports = FormFieldMemoryUtil;