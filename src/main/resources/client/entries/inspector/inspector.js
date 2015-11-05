'use strict';

// Vendor
var Vue = require('vue');
var $ = require('jquery');
var _cloneDeep = require('lodash/lang/cloneDeep');
// Components
var SiteWrapper = require('components/SiteWrapper/SiteWrapper.js');
var Chart = require('components/Chart/Chart.js');
var SearchForm = require('components/SearchForm/SearchForm.js');
var SearchResult = require('components/SearchResult/SearchResult.js');
var DuplicatesList = require('components/DuplicatesList/DuplicatesList.js');
var WeightingHelp = require('components/WeightingHelp/WeightingHelp.js');
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
			pendingScroll: false,
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
			barChart: {
				getContent: null,
			},
			pieChart: {
				getContent: null,
			},
			violationTypeDistributionChart: {
				getContent: null
			},
			colorCategories: colorCategories,
			colorPattern: colorPattern
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
		'search-result': SearchResult,
		'weighting-help': WeightingHelp,
		'duplicates-list': DuplicatesList
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
		 * Called when SearchResult has received a result. Scroll down to component if pendingScroll flag is true
		 */
		onResultReceived: function() {
			if(this.pendingScroll === true) {
				$('html, body').animate({
					scrollTop: $(this.$el.getElementsByClassName('searchResult')[0]).offset().top,
				}, 900);
				this.$set('pendingScroll', false);
			}
		},
		/**
		 * Starts an activity
		 * @param {String} activity
		 */
		startActivity: function(activity) {
			var formData = {
				formModel: _cloneDeep(this.formModel),
				fields: _cloneDeep(this.fields)
			}
			switch(activity) {
				case 'ERROR_LIST':
					formData.formModel.templateName = 'quality';
				break;
				case 'LOCAL_DUPLICATES':
					formData.formModel.templateName = 'duplicates';
				break;
				case 'DUPLICATES':
					formData.formModel.templateName = 'AmbiguityListing';
				break;
			}
			this.$set('pendingScroll', true);
			this.$set('formData', formData);
			this.$set('activity', activity);
		},
		/**
		 * Format aggregations and pass them on to the respective charts
		 * @param {Object} aggregations
		 */
		setAggregations: function(aggregations) {
			// *** LINE CHART *** //
			this.setChartContent('lineChart', this.formModel.org.length === 0 ? FormatAggregationUtil.toYearTimeSeries(aggregations) : FormatAggregationUtil.toOrgYearTimeSeries(aggregations));
			// *** BAR CHART *** //
			if(this.formModel.org.indexOf(',') !== -1 || this.formModel.org.length === 0) {
				this.setChartContent('barChart', FormatAggregationUtil.toOrgViolationRatio(aggregations));
			}
			else {
				this.setChartContent('barChart', { columns: [] });
			}
			// *** PIE CHART *** //
			this.setChartContent('pieChart', FormatAggregationUtil.toViolationDistribution(aggregations));
			// *** VIOLATION TYPE DISTRIBUTION CHART *** //
			if(this.formModel.org && this.formModel.org.indexOf(',') === -1) {
				this.setChartContent('violationTypeDistributionChart', FormatAggregationUtil.toViolationTypeDistributionForOneOrg(aggregations, this.formModel.org));
			}
			else {
				this.setChartContent('violationTypeDistributionChart', { columns: [] });
			}
		},
		/**
		 * Sets .getContent function for a chart-object
		 * @param {String} chartPath
		 * @param {Object} aggregations
		 */
		setChartContent(chartPath, aggregations) {
			if(aggregations.columns && aggregations.columns.length > 0) {
				this.$set(chartPath + '.getContent', function() {
					return aggregations;
				});
			}
			else {
				this.$set(chartPath + '.getContent', null);
			}
		}
		
	}
};

// Based on d3.scale.category20c()
var colorPattern = [
	'#fd8d3c', 
	'#fdae6b', 
	'#fdd0a2', 
	'#31a354', 
	'#74c476', 
	'#a1d99b', 
	'#c7e9c0', 
	'#756bb1', 
	'#9e9ac8', 
	'#bcbddc', 
	'#dadaeb', 
	'#636363', 
	'#969696', 
	'#bdbdbd', 
	'#d9d9d9', 
	'#3182bd', 
	'#6baed6', 
	'#9ecae1', 
	'#c6dbef', 
	'#e6550d', 
	'#fd8d3c', 
	'#fdae6b', 
	'#fdd0a2', 
	'#31a354', 
	'#74c476', 
	'#a1d99b', 
	'#c7e9c0', 
	'#756bb1', 
	'#9e9ac8', 
	'#bcbddc', 
	'#dadaeb', 
	'#636363', 
	'#969696', 
	'#bdbdbd', 
	'#d9d9d9'
];
var colorCategories = {
	'bth': '#e6550d',
	'cth': '#fdd0a2',
	'du': '#d9d9d9',
	'esh': '#a1d99b',
	'fhs': '#31a354',
	'gih': '#c7e9c0',
	'gu': '#c6dbef',
	'hb': '#3182bd',
	'hh': '#6baed6',
	'hhs': '#9e9ac8',
	'hig': '#9ecae1',
	'his': '#fdae6b',
	'hj': '#bcbddc',
	'hkr': '#fd8d3c',
	'hv': '#fdd0a2',
	'kau': '#756bb1',
	'ki': '#9ecae1',
	'kmh': '#d9d9d9',
	'konstfack': '#969696',
	'kth': '#e6550d',
	'liu': '#fd8d3c',
	'lnu': '#c7e9c0',
	'ltu': '#a1d99b',
	'lu': '#6baed6',
	'mah': '#bdbdbd',
	'mdh': '#969696',
	'miun': '#dadaeb',
	'nai': '#756bb1',
	'nationalmuseum': '#bdbdbd',
	'naturvardsverket': '#74c476',
	'nrm': '#bcbddc',
	'oru': '#9e9ac8',
	'rkh': '#dadaeb',
	'sh': '#636363',
	'shh': '#636363',
	'slu': '#74c476',
	'su': '#fdae6b',
	'umu': '#31a354',
	'uu': '#3182bd',
	'vti': '#c6dbef',
	'Övriga': '#74c476',
	'Alla lärosäten': '#cfbede',
	'Felaktiga poster': '#eee8f3',
	'Felfria poster': '#bba3d0',
};

Vue.component('view', Inspector);

var View = new Vue({
	el: '#app'
});