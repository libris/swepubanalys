'use strict';

// CSS modules
var styles = require('!!style!css?modules!./SiteWrapper.css');

/**
 * Site Wrapper Mixin
 */
var SiteWrapperMixin = {
	components: {
		'site-wrapper': {
			inherit: true,
			template: require('./SiteWrapper.html'),
			data: function() {
				return {
					_styles: styles
				}
			}
		}
	}
};

module.exports = SiteWrapperMixin;