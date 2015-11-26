'use strict';

// Vendor
var _assign = require('lodash/object/assign');
// CSS modules
var styles = _assign(require('!!style!css?modules!./SiteWrapper.css'), require('!!style!css?modules!css/modules/Colors.css'));
// CSS
require('css/theme.css');

/**
 * Site Wrapper Component
 */
var SiteWrapperMixin = {
	props: ['activity'],
	template: require('./SiteWrapper.html'),
	data: function() {
		return {
			_styles: styles
		}
	}
};

module.exports = SiteWrapperMixin;