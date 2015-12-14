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
var MatchWeightHelp = require('components/Helps/MatchWeightHelp/MatchWeightHelp.js');
var DuplicatesHelp = require('components/Helps/DuplicatesHelp/DuplicatesHelp.js');
var Carousel = require('components/Carousel/Carousel.js');
var ViolationsDropdown = require('components/ViolationsDropdown/ViolationsDropdown.js');
// Mxins
var FieldLabelMixin = require('mixins/FieldLabelMixin/FieldLabelMixin.js');
// Utils
var DataUtil = require('utils/DataUtil/DataUtil.js');
var SearchFormUtil = require('utils/SearchFormUtil/SearchFormUtil.js');
var FormatAggregationUtil = require('utils/FormatAggregationUtil/FormatAggregationUtil.js');
var getQueryVariable = require('utils/getQueryVariable.js');
// CSS-modules
var styles = _assign(require('!!style!css?modules!./inspector.css'), require('css/modules/Colors.less'));

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
		'duplicates-help': DuplicatesHelp,
		'match-weight-help': MatchWeightHelp,
		'ambiguities-tool': AmbiguitiesTool,
		'carousel': Carousel,
		'violations-dropdown': ViolationsDropdown
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
					if(violations[v].name === e.id) {
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
			// Add to formModel
			if(typeof code === 'string') {
				this.$set('formModel.violation', code);
				this.fields.push({
					fieldName: 'violation',
					value: code,
					labels: [{
						text: violation.name
					}]
				});
			}
			// Start error-activity
			this.$emit('start-activity', 'VIOLATIONS');
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
			this.setChartContent('lineChart', FormatAggregationUtil.toGrade3ViolationRatioYearTimeSeries(aggregations, this.formModel.org.length === 0));	
			// *** BAR CHART *** //
			this.setChartContent('barChart', FormatAggregationUtil.toOrgViolationRatio(aggregations, this.formModel.org.length === 0 ? 5 : 10000));
			// *** VIOLATION TYPE DISTRIBUTION CHART *** //
			this.setChartContent('violationTypeDistributionChart', FormatAggregationUtil.toViolationTypeDistributions(aggregations, this.formModel.org));
			// *** PIE CHART *** //
			this.setChartContent('pieChart', FormatAggregationUtil.toViolationDistribution(aggregations));
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
var strongColorPattern = [
	'#FFC300',
	'#FFCB20',
	'#FFD240',
	'#FFDA60',
	'#EE681B',
	'#F07B38',
	'#F28E54',
	'#F4A171',
	'#9E0634',
	'#AA254D',
	'#B64467',
	'#C26380',
	'#5B2285',
	'#703E94',
	'#8459A4',
	'#9875B3',
	'#61B5BF',
	'#75BEC7',
	'#89C8CF',
	'#9CD1D7'
];

var orgs = ['bth','cth','du','esh','fhs','gih','gu','hb','hh','hhs','hig','his','hj','hkr','hv','kau','ki','kmh','konstfack','kth','liu','lnu','ltu','lu','mah','mdh','miun','nai','nationalmuseum','naturvardsverket','nrm','oru','rkh','sh','shh','slu','su','umu','uu','vti'];
var categories = orgs.concat(['Övriga','Alla lärosäten','Felaktiga poster','Felfria poster']);

var colorCategories = {};

var l = strongColorPattern.length;
var offset = Math.floor(strongColorPattern.length/2);
offset = 7;
categories.forEach(function(category, i) {
	if(category === 'Felfria poster') {
		colorCategories[category] = '#FFDA60';
	} else if(category === 'Felaktiga poster') {
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

var View = new Vue({
	el: '#app'
});