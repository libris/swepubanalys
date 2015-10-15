'use strict';

// Globals
var Vue = require('vue');
var $ = require('jquery');
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
			pendingScroll: false,
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
			this.$set('pendingScroll', true);
			this.$set('formModel', formModel);
		},
		/**
		 * Called when SearchResult has received a result. Scroll down to component if pendingScroll flag is true
		 */
		onResultReceived: function() {
			if(this.pendingScroll === true) {
				$('html, body').animate({
					scrollTop: $(this.$el.getElementsByClassName('searchResult')[0]).offset().top,
				}, 1500);
				this.$set('pendingScroll', false);
			}
		}
	}
};

Vue.component('view', Form);

var View = new Vue({
	el: '#app'
});