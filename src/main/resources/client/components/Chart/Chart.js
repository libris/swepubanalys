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
	props: ['type', 'xAxisType', 'showLegend', 'legendPosition', 'colorCategories', 'colorPattern', 'height', 'tickFormat', 'getContent'],
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
					order: 'asc',
					colors: this.colorCategories
				},
				legend: {
					show: this.showLegend === false ? false : true,
					position: this.legendPosition
				},
				size: {
					height: this.height
				}
			};
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