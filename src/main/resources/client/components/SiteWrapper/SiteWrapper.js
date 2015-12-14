'use strict';

// Vendor
var _assign = require('lodash/object/assign');
// CSS modules
var styles = _assign(
	require('./SiteWrapper.css'), 
	require('css/modules/Colors.less')
);
// CSS
require('css/theme.less');

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
		this.$els.githubImage1.src = this.$els.githubImage2.src = require('octicons/svg/mark-github.svg');
	}
};

module.exports = SiteWrapperMixin;