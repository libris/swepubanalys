'use strict';

// Vendor
var Vue = require('vue');
var $ = require('jquery');
// Components
var SiteWrapper = require('components/SiteWrapper/SiteWrapper.js');
var SearchForm = require('components/SearchForm/SearchForm.js');
var SearchResult = require('components/SearchResult/SearchResult.js');
// Utils
require('utils/ConsoleUtil/ConsoleUtil.js');
// CSS
require('css/transitions.css');

/**
 * Bibliometrician-view
 */
var Bibliometrician = {
	template: require('./bibliometrician.html'),
	data: function() {
		return {
			pendingScroll: false,
			formData: {
				fields: [],
				formModel: {}
			}
		};
	},
	components: {
		'site-wrapper': SiteWrapper,
		'search-form': SearchForm,
		'search-result': SearchResult
	},
	methods: {
		/**
		 * Called when user clicks Search-button
		 * @param {Object} params
		 */
		onSearch: function(formData) {
			this.$set('pendingScroll', true);
			this.$set('formData', formData);
		},
		/**
		 * Called when SearchResult has received a result. Scroll down to component if pendingScroll flag is true
		 */
		onResultReceived: function() {
			if(this.pendingScroll === true) {
				$('html, body').animate({
					scrollTop: $(this.$el.getElementsByClassName('searchResult')[0]).offset().top,
				}, 900);
				this.$set('pendingScroll', false);
			}
		}
	}
};

Vue.component('view', Bibliometrician);

var View = new Vue({
	el: '#app'
});