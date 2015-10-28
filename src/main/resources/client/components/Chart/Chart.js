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
	props: ['type', 'getContent'],
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
		 * Create chart
		 */
		create: function() {
			var content = this.getContent();
			if(this.type === 'line' || this.type === 'bar') {
				var el = this.$el;
				this._chart = c3.generate({
					bindto: el,
					type: this.type,
					data: {
						columns: []
					}
				});
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
						colors: content.colors
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
			}
		}
	}
}

module.exports = Chart;