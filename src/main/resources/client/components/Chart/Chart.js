'use strict';

// Vendor
var c3 = require('c3-js');
require('c3-css');

/**
 * fyllpå
 */
var Chart = {
	props: ['type', 'data'],
	template: '<div></div>',
	ready: function() {
		var el = this.$el;
		this.create();
	},
	methods: {
		/**
		 *
		 */
		create: function() {
			if(this.type === 'bar') {
				var el = this.$el;
				var chart = c3.generate({
					bindto: el,
					data: {
						type: 'bar',
						json: this.data.buckets,
						keys: {
							x: 'key',
							value: ['doc_count']
						}
					},
					axis: {
						x: {
							type: 'category'
						},
						y: {
							type: 'category'
						}

					},
					bar: {
						width: {
							ratio: 0.5
						}
					}
				});
			}
			else if(this.type === 'pie') {
				var el = this.$el;
				var chart = c3.generate({
					bindto: el,
					data: {
						type: 'pie',
						columns: this.formatBuckets(this.data.buckets),
						color: function() {
							return '#1f77b4'
						},
						order: 'asc'
					}
				});
			}
		},
		formatBuckets: function(buckets) {
			var formattedData = buckets.map(function(bucket, i) {
				return [bucket.key, bucket.doc_count];
			});
			return formattedData;
		}
	}
}

module.exports = Chart;