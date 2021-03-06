'use strict';

// Vendor
var Vue = require('vue');
var $ = require('jquery');
var _assign = require('lodash/object/assign');
// Components
var SiteWrapper = require('components/SiteWrapper/SiteWrapper.js');
var SearchForm = require('components/SearchForm/SearchForm.js');
var SearchResult = require('components/SearchResult/SearchResult.js');
var QueryForm = require('components/QueryForm/QueryForm.js');
var QueryResult = require('components/QueryResult/QueryResult.js');
// Utils
require('utils/ConsoleUtil/ConsoleUtil.js');
// CSS-modules
var styles = _assign(
	require('!!style!css?modules!./bibliometrician.css'), 
	require('!!style!css?modules!less!css/modules/Colors.less')
);
// CSS
require('css/theme-bibliometrician.less');
require('css/transitions.css');

/**
 * Bibliometrician-view
 */
var Bibliometrician = {
	template: require('./bibliometrician.html'),
	data: function() {
		return {
			pendingScroll: false,
			// Data comming from the SearchForm component
			formData: {
				fields: [],
				formModel: {}
			},
			generatedQuery: '', // Query which is generated by SearchResult within the Form-tab, 
								// and sent to the textarea in the SPARQL-tab
			inputQuery: undefined, // Query which will be sent to SearchResult within the SPARQL-tab
			_styles: styles
		};
	},
	components: {
		'site-wrapper': SiteWrapper,
		'search-form': SearchForm,
		'search-result': SearchResult,
		'query-form': QueryForm,
		'query-result': QueryResult
	},
	methods: {
		/**
		 * Called when user clicks Search-button
		 * @param {Object} params
		 */
		onFormSearch: function(formData) {
			this.$set('pendingScroll', true);
			this.$set('formData', formData);
		},
		/**
		 *
		 */
		onQuerySearch: function(query) {
			this.$set('pendingScroll', true);
			this.$set('inputQuery', query);
		},
		/**
		 * Called when SearchResult has received a result. Scroll down to component if pendingScroll flag is true
		 */
		onResultReceived: function() {
			var y = $(document.getElementsByClassName('tab-pane active')[0].getElementsByClassName('result')[0]).offset().top;
			if(this.pendingScroll === true) {
				$('html, body').animate({
					scrollTop: y,
				}, 900);
				this.$set('pendingScroll', false);
			}
		},
		/**
		 * Sent as a callback to SearchResult in order to get generated query
		 * @param {String} query
		 */
		onGenerateQuery: function(query) {
			this.$set('generatedQuery', query);
		}
	}
};



Vue.component('view', Bibliometrician);

new Vue({
	el: '#app'
});