'use strict';

var loggedIn = false;

/**
 * Authentication Mixin
 * Used to ask for- and maintain logged in/out status
 */
var AuthenticationMixin = {
	data: function() {
		return {
			isLoggedIn: loggedIn,
			userModel: {},
		}
	},
	events: {
		/**
		 *
		 */
		'logged-in': function(userModel) {
			loggedIn = true;
			this.$set('isLoggedIn', true);
			this.$set('userModel', userModel);
			return true;
		},
		/**
		 *
		 */
		'logged-out': function() {
			this.$set('isLoggedOut', false);
			this.$set('userModel', {});
			return true;
		},
	},
	ready: function() {
		this.$dispatch('authenticate');
	}
};

module.exports = AuthenticationMixin;