'use strict';

// Globals
var Vue = require('vue');
// Components
var SiteWrapper = require('mixins/SiteWrapperMixin/SiteWrapperMixin.js');
var SearchForm = require('components/SearchForm/SearchForm.js');
// Utils
require('utils/console.js');
// CSS
require('css/transitions.css');

/**
 * Inspector-view
 */
var Inspector = {
	mixins: [SiteWrapper],
	template: require('./inspector.html'),
	data: function() {
		return {
			navigation: {
				key: 'inspector',
				url: '/inspector'
			},
			formModel: { },
		};
	},
	components: {
		'search-form': SearchForm,
	},
	methods: {
		/**
		 * On submission of FormModel
		 */
		onSearch: function() {
			console.log('*** Inspector.onSearch: FormModel submitted');
		}
	}
};

Vue.component('view', Inspector);

var View = new Vue({
	el: '#app'
});