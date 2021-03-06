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

		'authenticate': function() {
			if(this.authenticated) {
				this.$broadcast('logged-in', this.userModel);

			}
		},

		'setTextTitle': function() {

		}

	},
	ready: function() {
		AuthenticationUtil.authenticate(function(authenticated) {
			if (authenticated.isLoggedIn) {
				this.$set('authenticated', true);
				this.$set('userModel', authenticated);
			}
		}.bind(this));
	},
	methods: {
		checkLoggedInStatus: function() {
			AuthenticationUtil.authenticate(function(authenticated) {
				if (!authenticated.isLoggedIn) {
					var path = '/secure?return=';
					var host = window.location.host;
					var protocol = 'https://';
					var href = window.location.href;
					$(location).attr('href', protocol+ host + path + href);
				}
			});
		}
	}
};


module.exports = SiteWrapperMixin;
