'use strict'

var Vue = require('vue');

/**
 * This module may be used in unit tests do mount a component to <body> and perform tests upon execution
 * of ready-hook.
 * @props {Object} conf
 */
var ComponentTest = function(conf) {
	new Vue({
		el: document.body,
		replace: false,
		data: function() {
			return conf.inputProps;
		}, 
		template: '<test-component ' + conf.props + ' v-ref:test-component></test-component>',
		components: { 'test-component': conf.component },
		// Perform tests on ready-hook
		ready: function() {
			conf.testFunction.call(this, Vue, this.$refs.testComponent, this);
		}
	});
};

module.exports = ComponentTest;