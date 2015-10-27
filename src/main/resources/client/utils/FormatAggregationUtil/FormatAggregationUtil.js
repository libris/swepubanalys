'use strict';

// Vendor
var d3 = require('d3');
var _sortBy = require('lodash/collection/sortBy');
var _sortByOrder = require('lodash/collection/sortByOrder');

/**
 * This util is used to format aggregations to C3-style input data
 */
var FormatAggregationUtil = {
	/**
	 * Turn aggregations in to number of docs per year
	 * @param {Object} aggregations
	 * @return {Object}
	 */
	toYearTimeSeries: function(aggregations) {
		var formattedData = []; // Data to be returned
		// If there are any buckets on yars
		if(aggregations.year && aggregations.year.buckets && aggregations.year.buckets.length > 0) {
			var xAxis = ['x'];
			var yColumn = ['Valda lärosäten'];
			// Sort by year
			aggregations.year.buckets = _sortBy(aggregations.year.buckets, function(p) {
				return p.key;
			});
			aggregations.year.buckets.map(function(bucket) {
				xAxis.push(bucket.key)
				yColumn.push(bucket.doc_count);
			});
			formattedData = [xAxis, yColumn];
		}
		return {
			axis: {
				x: { 
					label: 'År'
				},
				y: {
					label: 'Antal poster',
				}
			},
			columns: formattedData,
		}
	},
	/**
	 * Turn aggregations in to number of docs per org
	 * @param {Object} aggregations
	 * @return {Object}
	 */
	toOrgDistribution: function(aggregations) {
		var formattedData = []; // Data to be returned
		var colors = {}; // Colors to be returned
		var color = d3.scale.category20c(); // Color scale
		// If there are buckets on organisations
		if(aggregations.org && aggregations.org.buckets && aggregations.org.buckets.length > 0) {
			// Sort by n. of posts
			aggregations.org.buckets = _sortByOrder(aggregations.org.buckets, function(p) {
				return p.doc_count;
			}, ['desc']);
			// Show only top x
			var top = 5;
			aggregations.org.buckets.map(function(bucket, i) {
				if(i < top) {
					formattedData.push([bucket.key, bucket.doc_count]);
					colors[bucket.key] = color(i);
				} else if(i === top) {
					formattedData.push(['Övriga', bucket.doc_count]);
					colors['Övriga'] = color(i);
				} else {
					formattedData[top][1]++;
				}
			});
		}
		return {
			columns: formattedData,
			colors: colors
		}
	}
};

module.exports = FormatAggregationUtil;