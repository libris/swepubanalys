'use strict';

// Vendor
var _assign = require('lodash/object/assign');
var Vue = require('vue');
var $ = require('jquery');
// Utils
var Authenticationutil = require('utils/AuthenticationUtil/AuthenticationUtil.js');
var TechnicalInfoUtil = require('utils/TechnicalInfoUtil/TechnicalInfoUtil.js');
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
			_styles: styles,
			latestRelease: ''
		}
	},
	events: {
		'authenticate': function() {
			if(this.authenticated) {
				this.$broadcast('logged-in', this.userModel);
			}
		},
		'setTextTitle': function() {
			
		}

	},
	ready: function() {
		this.init();
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
	},
	methods: { 
		init: function() {
			var thisVar = this;
			TechnicalInfoUtil.getTechInfo(function(techinfo) {
				thisVar.$set('latestRelease', 'v0.6.0');
			});
		}
	}
};


module.exports = SiteWrapperMixin;