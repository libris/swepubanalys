'use strict';

// Vendor
var Vue = require('vue');
var $ = require('jquery');
var _cloneDeep = require('lodash/lang/cloneDeep');
var _assign = require('lodash/object/assign');
// Components
var SiteWrapper = require('components/SiteWrapper/SiteWrapper.js');
var Chart = require('components/Chart/Chart.js');
var SearchForm = require('components/SearchForm/SearchForm.js');
var SearchResult = require('components/SearchResult/SearchResult.js');
var AmbiguitiesTool = require('components/AmbiguitiesTool/AmbiguitiesTool.js');
var DuplicatesTool = require('components/DuplicatesTool/DuplicatesTool.js');
var DuplicatesHelp = require('components/Helps/DuplicatesHelp/DuplicatesHelp.js');
var Carousel = require('components/Carousel/Carousel.js');
var ViolationsDropdown = require('components/ViolationsDropdown/ViolationsDropdown.js');
var AboutVialations = require('components/AboutVialations/AboutVialations.js');
var AboutDuplicates = require('components/AboutDuplicates/AboutDuplicates.js');
// Mxins
var FieldLabelMixin = require('mixins/FieldLabelMixin/FieldLabelMixin.js');
// Utils
var DataUtil = require('utils/DataUtil/DataUtil.js');
var SearchFormUtil = require('utils/SearchFormUtil/SearchFormUtil.js');
var FormatAggregationUtil = require('utils/FormatAggregationUtil/FormatAggregationUtil.js');
var getQueryVariable = require('utils/getQueryVariable.js');
// CSS-modules
var styles = _assign(require('!!style!css?modules!./inspector.css'), require('css/modules/Colors.less'));
// CSS
require('css/theme-inspector.less');

/**
 * Inspector-view
 */

var Inspector = {
	_t: null, // Timeout reference
	mixins: [FieldLabelMixin],
	template: require('./inspector.html'),
	data: function() {
		return initialData;
	},
	watch: {
		/**
		 * On formModel-change, get aggregations from server
		 */
		'formModel': function(value) {
			clearTimeout(this._t);
			console.log('fm:' + JSON.stringify(value))
			this._t = setTimeout(function() {


				DataUtil.getFilterAggregations(this.formModel, function(aggregations) {
					if(!aggregations.error) {
						SearchFormUtil.handleAggregations(aggregations);
						this.setAggregations(aggregations);
						this.$set('error', false);
					} else {
						this.$set('error', true);
					}
					this.$set('loadingData', false);
				}.bind(this));
			}.bind(this), 800);
		},
		'formData': function(value) {
			/*console.log('fd:'+JSON.stringify(value))*/
		},
		'activity': function(value) {
			/*console.log('activity:'+JSON.stringify(value))*/
		}

	},
	components: {
		'site-wrapper': SiteWrapper,
		'chart': Chart,
		'search-form': SearchForm,
		'search-result': SearchResult,
		'duplicates-help': DuplicatesHelp,
		'ambiguities-tool': AmbiguitiesTool,
		'duplicates-tool': DuplicatesTool,
		'carousel': Carousel,
		'violations-dropdown': ViolationsDropdown,
		'about-vialations': AboutVialations,
		'about-duplicates': AboutDuplicates
	},
	ready: function() {

		/**
		 * Broadcast events based on url-parameters
		 */
		Vue.nextTick(function() {
			// &org=
			var org = getQueryVariable('org');
			if(org) { this.$broadcast('set-org-value', org); }
			// &from= and &to=
			var from = getQueryVariable('from');
			var to = getQueryVariable('to');
			var time = {};
			if(from) {
				time.from = from;
			}
			if(to) {
				time.to = to;
			}
			this.$broadcast('set-time-values', time);
			// &activity=
			var activity = getQueryVariable('activity');
            if(activity && (org || to || time)) {
                // Wait for next tick as some form-elements are being set
                require('vue').nextTick(function() {
                    this.$emit('start-activity', activity);
                }.bind(this));
            } else if(activity) {
                this.$emit('start-activity', activity);
            }
		}.bind(this));
	},
	events: {
        /**
         * Start an activity
         */
        'start-activity': function(activity) {
        	switch(activity) {
        		case 'VIOLATIONS':
        			this.startActivity(activity);
        		case 'AMBIGUITIES':
        			this.startActivity(activity);
        		break;
        	}
		}
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
					scrollTop: $(this.$els.searchResult).offset().top,
				}, 900);
				this.$set('pendingScroll', false);
			}
		},
		/**
		 *
		 */
		onCarouselNavigate: function(status) {
			this.$set('visibleItems', status.visibleItems);
		},
		/**
		 * Callback sent to Chart for selecting a specific org within the Form
		 * @prop {Object} e the org
		 */
		onClickOrg: function(e) {
			if(e.id && this.formModel.org !== e.id) {
				this.$broadcast('set-org-value', e.id);
			} else {
				this.$broadcast('set-org-value', '');
			}
		},
		/**
		 * Callback sent to Chart for selecting a specific violation
		 * @prop {Object} e the violation
		 */
		onClickViolation: function(e) {
			$('html, body').animate({
				scrollTop: $(this.$els.searchForm).offset().top-25,
			}, 900);
			SearchFormUtil.getViolations(function(violations) {
				Object.keys(violations).map(function(v) {
					if(violations[v].text === e.id) {
						this.onClickViolationOption(v, violations[v]);
					}
				}.bind(this))
			}.bind(this));
		},
		/**
		 * Callback sent to ViolationDropdown
		 * @param {String} code
		 * @param {Object} violation
		 */
		onClickViolationOption: function(code, violation) {
			// Clear
			this.$set('formModel.violation', undefined);
			this.$set('fields', (this.fields || []).filter(function(field) {
				return field && field.fieldName && field.fieldName !== 'violation';
			}));
			//For sending selected violation to list
			/*
			if (violation.text !== undefined ) {
				ViolationsDropdown.methods.compareActive(violation.text);
			}
			*/
			// Add to formModel
			if(typeof code === 'string') {
				this.$set('formModel.violation', code);
				this.fields.push({
					fieldName: 'violation',
					value: code,
					labels: [{
						text: violation.text
					}]
				});
			}

			// Start error-activity

			this.$emit('start-activity', 'VIOLATIONS');
		},
		onClickViolationButton: function(violation) {
			// Clear
			//this.$set('formModel.violation', undefined);
			// Start error-activity
			$(".chooseViolationSection").show();
			this.$emit('start-activity', 'VIOLATIONS');

		},
		/**
		 * Gives site access to recieve the the state the user left
		 */
		onClickExternal: function() {
			localStorage.setItem('externalPass', true);
		},
		/**
		 * Starts an activity
		 * @param {String} activity
		 */
		startActivity: function(activity) {

			if (activity === 'LOCAL_DUPLICATES' || activity === 'AMBIGUITIES') {
				$(".chooseViolationSection").hide();
			}

			var formData = {
				formModel: _cloneDeep(this.formModel),
				fields: _cloneDeep(this.fields)
			}
			switch(activity) {
				case 'VIOLATIONS':
					formData.formModel.templateName = 'quality';
				break;
				case 'LOCAL_DUPLICATES':
					formData.formModel.templateName = 'duplicates';
				break;
				case 'AMBIGUITIES':
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
			this.setChartContent('grade3ViolationChart', FormatAggregationUtil.toGrade3ViolationRatioYearTimeSeries(aggregations, this.formModel.org.length === 0));
			// *** BAR CHART *** //
			this.setChartContent('orgViolations', FormatAggregationUtil.toOrgViolationRatio(aggregations, this.formModel.org.length === 0 ? 5 : 10000));
			// *** VIOLATION TYPE DISTRIBUTION CHART *** //
			var aggs = FormatAggregationUtil.toViolationTypeDistributions(aggregations, this.formModel.org);
			aggs.columns.forEach(function(column) {
				SearchFormUtil.getViolations(function(violations) {
					Object.keys(violations).forEach(function(v) {
						if(violations[v].name === column[0]) {
							column[0] = violations[v].text;
						}
					});
				});
			});
			this.setChartContent('violationTypeDistributionChart', aggs);
			// *** PIE CHART *** //
			this.setChartContent('violationDistributionChart', FormatAggregationUtil.toViolationDistribution(aggregations));
		},
		/**
		 * Sets .getContent function for a chart-object
		 * @param {String} chartPath
		 * @param {Object} aggregations
		 */
		setChartContent: function(chartPath, aggregations) {
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

/**
 * Should a slide be mounted in the carousel?
 * @ {Object} d
 * @ {String} index
 * @ {Array} visibleItems
 */
Vue.filter('visible', function(d, index, visibleItems) {
	index = Number(index)-1;
	var visible = visibleItems.filter(function(item) {
		return item === index;
	});
	if(visible.length === 1) {
		return d;
	}
});

// *** Define colors and categories for charts! *** //

var colorPattern = ['#FFC300','#FFCB20','#FFD240','#FFDA60','#FFE180','#FFE99F','#FFF0BF','#FFF8DF','#EE681B','#F07B38','#F28E54','#F4A171','#F6B38D','#F9C6AA','#FBD9C6','#FDECE3','#9E0634','#AA254D','#B64467','#C26380','#CF839A','#DBA2B3','#E7C1CC','#F3E0E6','#5B2285','#703E94','#8459A4','#9875B3','#AD91C2','#C1ACD1','#D6C8E1','#EAE3F0','#61B5BF','#75BEC7','#89C8CF','#9CD1D7','#B0DADF','#C4E3E7','#D7ECEF','#EBF6F7'];
var strongColorPattern = ['#FFC300', '#FFCB20', '#FFD240', '#FFDA60', '#EE681B', '#F07B38', '#F28E54', '#F4A171', '#9E0634', '#AA254D', '#B64467', '#C26380', '#5B2285', '#703E94', '#8459A4', '#9875B3', '#61B5BF', '#75BEC7', '#89C8CF', '#9CD1D7'];

var orgs = ['bth','cth','du','esh','fhs','gih','gu','hb','hh','hhs','hig','his','hj','hkr','hv','kau','ki','kkh','kmh','konstfack','kth','liu','lnu','ltu','lu','mah','mdh','miun','nai','nationalmuseum','naturvardsverket','nrm','norden','oru','rkh','ri','sh','shh','slu','smhi','su','umu','uniarts','uu','vti'];
var categories = orgs.concat(['Övriga','Alla lärosäten','Bristfälliga poster','Felfria poster']);

var colorCategories = {};

var l = strongColorPattern.length;
var offset = Math.floor(strongColorPattern.length/2);
offset = 7;
categories.forEach(function(category, i) {
	if(category === 'Felfria poster') {
		colorCategories[category] = '#FFDA60';
	} else if(category === 'Bristfälliga poster') {
		colorCategories[category] = '#FFC300';
	} else if(category === 'Alla lärosäten') {
		colorCategories[category] = '#8459A4';
	} else {
		colorCategories[category] = strongColorPattern[(i+offset)%l];
	}

});

var violationGrade3Color = '#F07B38';
var violationGrade2Color = '#FFDA60';
var violationGrade1Color = '#52bd34';

var violationTypeGrades;
SearchFormUtil.getViolationGrades(function(violations) {
	violationTypeGrades = violations;
});

var violationTypeColorCategories = {};
Object.keys(violationTypeGrades).map(function(type) {
	var color;
	switch(violationTypeGrades[type]) {
		case 1:
			color = violationGrade1Color;
		break;
		case 2:
			color = violationGrade2Color;
		break;
		case 3:
			color = violationGrade3Color;
		break;
	}
	violationTypeColorCategories[type] = color;
});
violationTypeColorCategories['_categories'] = violationTypeGrades;

// *** Initial data for this Vue component *** //

var initialData = {
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
	grade3ViolationChart: {
		getContent: null, // We use a function to give data to the chart to avoid "indexing" by Vue
	},
	orgViolations: {
		getContent: null,
	},
	violationDistributionChart: {
		getContent: null,
	},
	violationTypeDistributionChart: {
		getContent: null
	},
	// Misc
	orgs: orgs,
	// Colors
	colorCategories: colorCategories,
	colorPattern: colorPattern,
	violationTypeColorCategories: violationTypeColorCategories,
	violationGrade3Color: violationGrade3Color,
	violationGrade2Color: violationGrade2Color,
	violationGrade1Color: violationGrade1Color,
	// Carousel
	_carouselConf: {
		items: 2,
		itemsDesktop : [1300,2],
	    itemsDesktopSmall : [1050,1]
	},
	visibleItems: [],
};

// *** Render! *** //

Vue.component('view', Inspector);

new Vue({
	el: '#app'
});
