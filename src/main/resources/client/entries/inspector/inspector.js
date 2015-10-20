'use strict';

// Globals
var Vue = require('vue');
// Components
var SiteWrapper = require('mixins/SiteWrapperMixin/SiteWrapperMixin.js');
var SearchForm = require('components/SearchForm/SearchForm.js');
var Chart = require('components/Chart/Chart.js');
// Utils
require('utils/console.js');
var DataUtil = require('utils/DataUtil.js');
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
			aggregations: {},
			loadingData: true,
		};
	},
	ready: function() {
		DataUtil.getAggregations(function(response) {
			this.$set('aggregations', response);
			this.$set('loadingData', false);
		}.bind(this));
	},
	components: {
		'search-form': SearchForm,
		'chart': Chart
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