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
		if(aggregations.org_per_year && aggregations.org_per_year.buckets && aggregations.org_per_year.buckets.length > 0) {
			var buckets = aggregations.org_per_year.buckets;
			// For each org
			buckets.map(function(bucket, i) {
				if(bucket.year) {
					var X = ['x_' + bucket.key];
					var Y = [bucket.key];
					xs[bucket.key] = 'x_' + bucket.key;
					// For each year in org
					bucket.year.buckets.map(function(year, j) {
						X.push(year.key);
						Y.push(year.doc_count);
					});
					columns.push(X);
					columns.push(Y);
				}
			});
		}
		var chart = {
			xs: xs,
			columns: columns,
		}
		return chart;
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
				} else if(i === top) {
					formattedData.push(['Övriga', bucket.doc_count]);
				} else {
					formattedData[top][1]++;
				}
			});
		}
		return {
			columns: formattedData
		}
	},
	/**
	 * Turn aggregations in to overall distribution of violations
	 * @param {Object} aggregations
	 */
	toViolationDistribution: function(aggregations) {
		var formattedData = []; // Data to be returned
		// If there are buckets on organisations
		if(aggregations.org && aggregations.org.buckets && aggregations.org.buckets.length > 0 && aggregations.missingViolations && aggregations.missingViolations.doc_count) {
			formattedData.push(['Felaktiga poster']);
			aggregations.org.buckets.map(function(bucket, i) {
				formattedData[0].push(bucket.doc_count)
			});
			formattedData[0].push(-1*aggregations.missingViolations.doc_count);
			formattedData.push(['Felfria poster', aggregations.missingViolations.doc_count]);
		}
		return {
			columns: formattedData
		}
	},
	/**
	 * Turn aggregations in to missing violation ratio per org
	 * @param {Object} aggregations
	 */
	toOrgViolationRatio: function(aggregations) {
		var columns = [];
		var filler = [];
		var groups = [];
		var aggregate = aggregations.missing_violations_per_org;
		if(aggregate && aggregate.buckets) {
			aggregate.buckets = _sortByOrder(aggregate.buckets, function(bucket) {
				return bucket.missingViolations.doc_count / bucket.doc_count;
			}, ['desc']);
			aggregate.buckets.forEach(function(bucket) {
				var arr = [bucket.key];
				arr = arr.concat(filler);
				// Fill start with zeros
				filler.push(null);
				var val = bucket.missingViolations.doc_count / bucket.doc_count;
				arr.push(val);
				columns.push(arr);
				groups.push(bucket.key);
			});
		}
		// Top 7
		columns = columns.slice(0, 7);
		groups = groups.slice(0, 7);
		// Fill tail with zeros
		columns.forEach(function(column) {
			var desiredLength = columns.length + 1;
			for(var i = column.length; i < desiredLength; i++) {
				column.push(null);
			}
		});
		var chart = {
			columns: columns,
			groups: [groups],
			categories: groups
		};
		return chart;
	}
};

module.exports = FormatAggregationUtil;