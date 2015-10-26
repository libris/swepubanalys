'use strict';

// Vendor
var Vue = require('vue');
// Components
var SiteWrapper = require('mixins/SiteWrapperMixin/SiteWrapperMixin.js');
var SearchForm = require('components/SearchForm/SearchForm.js');
var Chart = require('components/Chart/Chart.js');
// Utils
var DataUtil = require('utils/DataUtil.js');
var FormatAggregationUtil = require('utils/FormatAggregationUtil/FormatAggregationUtil.js');
require('utils/console.js');
// CSS-modules
var styles = require('!!style!css?modules!./inspector.css');

/**
 * Inspector-view
 */
var Inspector = {
	_t: null, // Timeout reference
	mixins: [SiteWrapper],
	template: require('./inspector.html'),
	data: function() {
		return {
			// UI
			_styles: styles,
			loadingData: true,
			emptyAggregations: false,
			navigation: {
				key: 'inspector',
			},
			// Data from SearchForm component
			formModel: { },
			fields: [],
			// Function which returns a data-set
			lineChart: {
				getContent: null, // We use a function to give data to the chart to avoid "indexing" by Vue
			},
			pieChart: {
				getContent: null,
			}
		};
	},
	computed: {
		/**
		 * Compute a nice array of labels from the $data.fields object
		 */
		labels: function() {
			var labels = [];
			(this.fields || []).map(function(field) {
				(field.labels || []).map(function(d) {
					labels.push({
						$index: labels.length,
						$key: field.fieldName,
						$value: d.text
					});
				});
			});
			return labels;
		}
	},
	watch: {
		/**
		 * On formModel-change, get aggregations from server
		 */
		'formModel': function() {
			DataUtil.getFilterAggregations(this.formModel, function(aggregations) {
				this.setAggregations(aggregations);	
				this.$set('loadingData', false);
			}.bind(this));
		}
	},
	components: {
		'search-form': SearchForm,
		'chart': Chart
	},
	methods: {
		/**
		 * On submission of FormModel
		 */
		onChange: function(formData) {
			clearTimeout(this._t);
			this._t = setTimeout(function() {
				this.$set('fields', formData.fields);
				this.$set('formModel', formData.formModel);
			}.bind(this), 800);
		},
		/**
		 * Format aggregations and pass them on to the respective charts
		 * @param {Object} aggregations
		 */
		setAggregations: function(aggregations) {
			var lineAggregations = FormatAggregationUtil.toYearTimeSeries(aggregations);
			var pieAggregations = FormatAggregationUtil.toOrgDistribution(aggregations);
			if(lineAggregations.columns.length > 0) {
				this.$set('lineChart.getContent', function() {
					return lineAggregations;
				});	
			}
			if(pieAggregations.columns.length > 0) {
				this.$set('pieChart.getContent', function() {
					return pieAggregations;
				});
			}
			if(lineAggregations.columns.length === 0 || pieAggregations.columns.length === 0) {
				this.$set('emptyAggregations', true);
			} else {
				this.$set('emptyAggregations', false);
			}
		}
	}
};

Vue.component('view', Inspector);

var View = new Vue({
	el: '#app'
});