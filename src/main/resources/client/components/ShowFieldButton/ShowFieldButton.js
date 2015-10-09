'use strict';

// CSS
require('./ShowFieldButton.css');

/**
 * Show Field-button can be used to set field.show = true
 * @param {Object} field
 */
var ShowFieldButton = {
	props: ['field', 'onClickShowField'],
	template: require('./ShowFieldButton.html')
};

module.exports = ShowFieldButton;