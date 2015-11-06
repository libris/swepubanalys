'use strict';

// Vendor
var c3 = require('c3-js');
// CSS
require('c3-css');
require('./Chart.css');

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
		'getContent'
	],
	template: '<div></div>',
	ready: function() {
		var el = this.$el;
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
					colors: this.colorCategories
				},
				legend: {
					show: this.showLegend === false ? false : true,
					position: this.legendPosition
				},
				size: {
					height: this.height
				},
			};
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
			this._chart = c3.generate(config);
			this.update();
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

module.exports = Chart;