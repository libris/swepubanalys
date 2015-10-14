'use strict';

// Globals
var Vue = require('vue');
// Components
var SearchForm = require('components/SearchForm/SearchForm.js');
var SearchResult = require('components/SearchResult/SearchResult.js');
// Utils
require('utils/console.js');
// CSS
require('css/transitions.css');

/**
 * Form-component
 */
var Form = {
	template: require('./form.html'),
	data: function() {
		return {
			formModel: { }
		};
	},
	components: {
		'search-form': SearchForm,
		'search-result': SearchResult,
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