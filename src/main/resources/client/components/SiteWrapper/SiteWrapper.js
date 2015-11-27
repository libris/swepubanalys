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
	},
	ready: function() {
		// Set GitHub-image
		this.$els.githubImage1.src = require('octicons/svg/mark-github.svg');
		this.$els.githubImage2.src = require('octicons/svg/mark-github.svg');
	}
};

module.exports = SiteWrapperMixin;