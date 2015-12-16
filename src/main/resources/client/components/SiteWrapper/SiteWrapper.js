'use strict';

// Vendor
var _assign = require('lodash/object/assign');
// Utils
var Authenticationutil = require('utils/Authenticationutil/Authenticationutil.js');
// CSS modules
var styles = _assign(
	require('./SiteWrapper.css'), 
	require('css/modules/Colors.less')
);

/**
 * Site Wrapper Component
 */
var SiteWrapperMixin = {
	props: ['activity'],
	template: require('./SiteWrapper.html'),
	data: function() {
		return {
			authenticated: false,
			userModel: {},
			_styles: styles
		}
	},
	events: {
		'authenticate': function() {
			if(this.authenticated) {
				this.$broadcast('logged-in', this.userModel);
			}
		}
	},
	ready: function() {
		/*
		// Authenticate
		Authenticationutil.authenticate(function(authenticated, userModel) {
			if(authenticated) {
				this.$set('authenticated', true);
				this.$set('userModel', userModel);
				this.$broadcast('logged-in', userModel);
			}
		}.bind(this));
		*/
		// Set GitHub-image
		this.$els.githubImage1.src = this.$els.githubImage2.src = require('octicons/svg/mark-github.svg');
	}
};

module.exports = SiteWrapperMixin;