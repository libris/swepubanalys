'use strict';

// CSS modules
var styles = require('!!style!css?modules!css/BtnCircleLg.css');

/** 
 * Button which can be used to set a field.show = false
 */
var HideFieldButton = {
	props: ['field', 'onClickHideField'],
	template: require('./HideFieldButton.html'),
	data: function() {
		return {
			_styles: styles
		}
	}
};

module.exports = HideFieldButton;