'use strict';

// Vendor
var _assign = require('lodash/object/assign');
var Vue = require('vue');
var $ = require('jquery');
// Components
var TechInfoWindow = require('components/TechInfoWindow/TechInfoWindow.js');

// Utils
var AuthenticationUtil = require('utils/AuthenticationUtil/AuthenticationUtil.js');
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

		}
	},
	components: {
		'tech-info-window': TechInfoWindow
	},
	events: {
		/*
		'authenticate': function() {
			if(this.authenticated) {
				this.$broadcast('logged-in', this.userModel);
			}
		},
		*/
		'setTextTitle': function() {
			
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
		AuthenticationUtil.authenticate(function(authenticated) {
			if (authenticated.isLoggedIn) {
				this.$set('authenticated', true);
				this.$set('userModel', authenticated);
			}	
		}.bind(this));

		// Set GitHub-image
		this.$els.githubImage1.src = this.$els.githubImage2.src = require('octicons/svg/mark-github.svg');
	},
	methods: {
		init: function() {		
		},
		checkLoggedInStatus: function() {
			AuthenticationUtil.authenticate(function(authenticated) {
				if (!authenticated.isLoggedIn) {
					var url = '/secure?return=';
					$(location).attr('href', url + window.location.href);
				}
			});
		}
	}
};


module.exports = SiteWrapperMixin;
