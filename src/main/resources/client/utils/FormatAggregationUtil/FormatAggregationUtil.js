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
	 *
	 */
	toOrgYearTimeSeries: function(aggregations) {
		var xs = {};
		var columns = [];
		// If there are any buckets on yars
		if(aggregations['org-per-year'] && aggregations['org-per-year'].buckets && aggregations['org-per-year'].buckets.length > 0) {
			var buckets = aggregations['org-per-year'].buckets;
			// For each org
			buckets.map(function(bucket, i) {
				if(bucket.orgs) {
					var X = ['x_' + bucket.key];
					var Y = [bucket.key];
					xs[bucket.key] = 'x_' + bucket.key;
					// For each year in org
					bucket.orgs.buckets.map(function(year, i) {
						X.push(year.key);
						Y.push(year.doc_count);
					});
					columns.push(X);
					columns.push(Y);
				}
			});
		}
		return {
			xs: xs,
			columns: columns,
		}
	},
	/**
	 * Turn aggregations in to number of docs per year
	 * @param {Object} aggregations
	 * @return {Object}
	 */
	toYearTimeSeries: function(aggregations) {
		var xs = {};
		var columns = [];
		// If there are any buckets on yars
		if(aggregations.year && aggregations.year.buckets && aggregations.year.buckets.length > 0) {
			var Y = ['Alla lärosäten'];
			var X = ['x_Alla lärosäten'];
			xs['Alla lärosäten'] = 'x_Alla lärosäten';
			// Sort by year
			aggregations.year.buckets = _sortBy(aggregations.year.buckets, function(p) {
				return p.key;
			});
			aggregations.year.buckets.map(function(bucket) {
				X.push(bucket.key);
				Y.push(bucket.doc_count);
			});
			columns.push(X);
			columns.push(Y);
		}
		return {
			xs: xs,
			columns: columns,
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