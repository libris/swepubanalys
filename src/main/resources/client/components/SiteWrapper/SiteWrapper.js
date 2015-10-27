'use strict';

// CSS modules
var styles = require('!!style!css?modules!./SiteWrapper.css');

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