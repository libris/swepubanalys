'use strict';

// Globals
var Vue = require('vue');
// Components
var SearchForm = require('components/SearchForm/SearchForm.js');
var SearchResult = require('components/SearchResult/SearchResult.js');
var SiteWrapper = require('mixins/SiteWrapperMixin/SiteWrapperMixin.js');
// Utils
require('utils/console.js');
// CSS
require('css/transitions.css');

/**
 * Form-component
 */
var Form = {
	mixins: [SiteWrapper],
	template: require('./form.html'),
	data: function() {
		return {
			navigation: {
				key: 'form',
				url: '/form'
			},
			formModel: { }
		};
	},
	components: {
		'search-form': SearchForm,
		'search-result': SearchResult
	},
	methods: {
		/**
		 * Called when user clicks Search-button
		 * @param {Object} formModel
		 */
		onSearch: function(formModel) {
			this.$set('formModel', formModel);
		},
	}
};

Vue.component('view', Form);

var View = new Vue({
	el: '#app'
});