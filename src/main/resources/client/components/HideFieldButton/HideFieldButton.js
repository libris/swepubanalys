'use strict';

/** 
 * Button which can be used to set a field.show = false
 */
var HideFieldButton = {
	props: ['field', 'onClickHideField'],
	template: require('./HideFieldButton.html')
};

module.exports = HideFieldButton;