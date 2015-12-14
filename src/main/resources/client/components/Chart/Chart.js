'use strict';

// Vendor
var c3 = require('c3-js');
// CSS
require('c3-css');
require('!!style!css!./Chart.css');

/**
 * Chart-component
 */
var Chart = {
	props: [
		'type', 
		'order', 
		'xAxisType', 
		'showLegend', 
		'legendPosition', 
		'colorCategories', 
		'colorPattern', 
		'height', 
		'tickFormat', 
		'min',
		'max',
		'getContent',
		'onClick'
	],
	template: '<div></div>',
	ready: function() {
		var el = this.$el;
		// Finish current call stack before creating chart
        this.create();
		// Update chart if new getContent prop
		this.$watch('getContent', function() {
			this.update();
		}, { deep: true });
	},
	methods: {
		/**
		 * Create a C3 Chart
		 */
		create: function() {
			var content = this.getContent();
			var el = this.$el; // Root element
			// Chart config
			var config = {
				bindto: el,
				data: {
					type: this.type,
					columns: [],
					order: this.order || '',
					colors: this.colorCategories,
					onclick: function(e) { 
						if(this.onClick) {
							this.onClick(e);
						}
					}.bind(this),
					selection: {
						enabled: !!this.onClick
					},
				},
				legend: {
					show: this.showLegend === false ? false : true,
					position: this.legendPosition,
				},
				size: {
					height: this.height
				}
			};
			if(this.onClick) {
				config.legend.item = {
					onclick: function(e) {
						this.onClick({ id: e });
					}.bind(this)
				}
			}
			// Tick format
			if(this.tickFormat) {
				config.axis = config.axis || {};
				config.axis = {
					y: {
						tick: {
							format: d3.format(this.tickFormat)
						}
					}
				};
			}
			// Set Y min/max
			if(typeof this.min !== 'undefined') {
				config.axis = config.axis || {};
				config.axis.y = config.axis.y || {};
				config.axis.y.min = this.min;
				config.axis.y.padding = { top: 0, bottom: 0 };
			}
			if(typeof this.max !== 'undefined') {
				config.axis = config.axis || {};
				config.axis.y = config.axis.y || {};
				config.axis.y.max = this.max;
			}
			// Set Y-padding
			config.axis = config.axis || {};
			config.axis.y = config.axis.y || {};
			config.axis.y.padding = { top: 0, bottom: 0 };
			// X axis
			if(this.xAxisType === 'category') { // X axis config
				config.axis = config.axis || {};
				config.axis.x = {
					type: 'category',
					categories: []
				};
			}
			if(this.colorPattern) {
				config.data.colors = undefined;
				config.color = {
					pattern: this.colorPattern
				}
			}
			if(this.type === 'donut' || this.type === 'pie') {
				overridePieSort(function() {
					// Before
				}, function() {
					// After
					this._chart = c3.generate(config);
					this.update();
				}.bind(this), function(a, b) { // Sort function
					if(this.colorCategories._categories) {
		    			return this.colorCategories._categories[b.id] - this.colorCategories._categories[a.id];
		    		}
		    	}.bind(this));	
			} else {
				this._chart = c3.generate(config);
				this.update();
			}
			
		},
		/**
		 * Update chart
		 */
		update: function() {
			if(this._chart) {
				var content = this.getContent();
				content.unload = true;
				this._chart.load(content);
				this._chart.groups(content.groups);
				if(content.categories) {
					this._chart.categories(content.categories);
				}
			}
		}
	},
	_chart: null, // Reference to chart
}

/**
 * Monkey patch the initPie function to be able to append a custom sort function
 */
var overridePieSort = function(before, after, sort) {
	before && before();
	var original = c3.chart.internal.fn.initPie;
	c3.chart.internal.fn.initPie = function() {
		c3.chart.internal.fn.d3 = require('d3');
		c3.chart.internal.fn.config = {};
		c3.chart.internal.fn.pie = d3.layout.pie().value(function (d) {
	        return d.values.reduce(function (a, b) { return a + b.value; }, 0);
	    }).sort(sort);
	    c3.chart.internal.fn.d3 = undefined;
		c3.chart.internal.fn.config = undefined;
	}
	after && after();
	c3.chart.internal.fn.initPie = original;
}

module.exports = Chart;