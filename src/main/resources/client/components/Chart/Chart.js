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
	_chart: null, // Reference to chart
	props: ['type', 'xAxisType', 'getContent'],
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
			// Line or Bar Chart
			if(this.type === 'line' || this.type === 'bar') {
				var el = this.$el; // Root element
				// Chart config
				var config = {
					bindto: el,
					data: {
						type: this.type,
						columns: [],
						colors: colors
					}
				};
				if(this.xAxisType === 'category') { // X axis config
					config.axis = {
						x: {
							type: 'category',
							categories: []
						}
					};
				}
				this._chart = c3.generate(config);
			// Pie or Donut Chart
			} else if(this.type === 'pie' || this.type === 'donut') {
				var el = this.$el;
				this._chart = c3.generate({
					bindto: el,
					size: {
						height: 290
					},
					data: {
						type: this.type,
						columns: [],
						order: 'asc',
						colors: colors,
					}
				});
			}
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
	}
}

// Based on d3.scale.category20c()
var colors = {
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
}

module.exports = Chart;