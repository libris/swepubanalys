'use strict';

// Vendor
var Vue = require('vue');
var _cloneDeep = require('lodash/lang/cloneDeep');
// Components
var SiteWrapper = require('components/SiteWrapper/SiteWrapper.js');
var Chart = require('components/Chart/Chart.js');
var SearchForm = require('components/SearchForm/SearchForm.js');
var SearchResult = require('components/SearchResult/SearchResult.js');
// Mxins
var FieldLabelMixin = require('mixins/FieldLabelMixin/FieldLabelMixin.js');
// Utils
var DataUtil = require('utils/DataUtil/DataUtil.js');
var FormatAggregationUtil = require('utils/FormatAggregationUtil/FormatAggregationUtil.js');
require('utils/ConsoleUtil/ConsoleUtil.js');
// CSS-modules
var styles = require('!!style!css?modules!./inspector.css');

/**
 * Inspector-view
 */
var Inspector = {
	_t: null, // Timeout reference
	mixins: [FieldLabelMixin],
	template: require('./inspector.html'),
	data: function() {
		return {
			// UI
			_styles: styles,
			loadingData: true,
			emptyAggregations: false,
			error: false,
			activity: 0,
			// Data synced with SearchForm component
			formModel: { },
			fields: [],
			// Data which will be sent to searchResult
			formData: {
				formModel: {},
				fields: [],
			},
			// Function which returns a data-set
			lineChart: {
				getContent: null, // We use a function to give data to the chart to avoid "indexing" by Vue
			},
			pieChart: {
				getContent: null,
			}
		};
	},
	watch: {
		/**
		 * On formModel-change, get aggregations from server
		 */
		'formModel': function() {
			clearTimeout(this._t);
			this._t = setTimeout(function() {
				DataUtil.getFilterAggregations(this.formModel, function(aggregations) {
					if(!aggregations.error) {
						this.setAggregations(aggregations);	
						this.$set('error', false);
					} else {
						this.$set('error', true);
					}
					this.$set('loadingData', false);
				}.bind(this));
			}.bind(this), 800);
		}
	},
	components: {
		'site-wrapper': SiteWrapper,
		'chart': Chart,
		'search-form': SearchForm,
		'search-result': SearchResult
	},
	methods: {
		/**
		 * On submission of FormModel
		 * @param {Object} formData
		 */
		onChange: function(formData) {			
			this.$set('fields', formData.fields);
			formData.formModel.aggregate = 'inspector';
			this.$set('formModel', formData.formModel);
		},
		/**
		 * Starts an activity
		 * @param {Number} activity
		 */
		startActivity: function(activity) {
			switch(activity) {
				case 'ERROR_LIST':
					var formData = {
						formModel: _cloneDeep(this.formModel),
						fields: _cloneDeep(this.fields)
					}
					formData.formModel.templateName = 'quality';
					this.$set('formData', formData);
					this.$set('activity', activity);
				break;
			}
		},
		/**
		 * Format aggregations and pass them on to the respective charts
		 * @param {Object} aggregations
		 */
		setAggregations: function(aggregations) {
			var lineAggregations = this.formModel.org.length === 0 ? FormatAggregationUtil.toYearTimeSeries(aggregations) : FormatAggregationUtil.toOrgYearTimeSeries(aggregations);
			var pieAggregations = FormatAggregationUtil.toOrgDistribution(aggregations);
			if(lineAggregations.columns.length > 0) {
				this.$set('lineChart.getContent', function() {
					return lineAggregations;
				});	
			} else {
				this.$set('lineChart.getContent', false);
			}
			if(pieAggregations.columns.length > 0) {
				this.$set('pieChart.getContent', function() {
					return pieAggregations;
				});
			} else {
				this.$set('pieChart.getContent', false);
			}
			if(lineAggregations.columns.length === 0 && pieAggregations.columns.length === 0) {
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