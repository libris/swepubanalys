'use strict'

// CSS modules
var styles = require('!!style!css?modules!css/BtnCircle.css');

/**
 * A button which can be used to trigger a help-dialog or popover
 */
var HelpInitiatorButton = {
	template: require('./HelpInitiatorButton.html'),
	data: function() {
		return {
			_styles: styles
		}
	}
};

module.exports = HelpInitiatorButton;