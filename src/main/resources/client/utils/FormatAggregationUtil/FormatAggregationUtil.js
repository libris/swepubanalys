'use strict';

// Vendor
var d3 = require('d3');
var _sortBy = require('lodash/collection/sortBy');
var _sortByOrder = require('lodash/collection/sortByOrder');
var _sum = require('lodash/math/sum');
var firstBy = require('exports?firstBy!thenby/thenBy.module.js');
// Util
var SearchFormUtil = require('utils/SearchFormUtil/SearchFormUtil.js');

/**
 * This util is used to format aggregations to C3-style input data
 */
var FormatAggregationUtil = {
	/**
	 * Turn aggregations in to number of posts per year per org
	 * @param {Object} aggregations
	 * @return {Object}
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
	toOrgDistribution: function(aggregations, top) {
		var formattedData = []; // Data to be returned
		// If there are buckets on organisations
		if(aggregations.org && aggregations.org.buckets && aggregations.org.buckets.length > 0) {
			// Sort by n. of posts
			aggregations.org.buckets = _sortByOrder(aggregations.org.buckets, function(p) {
				return p.doc_count;
			}, ['desc']);
			// Show only top x
			top = top || 100000;
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
	 * @return {Object}
	 */
	toViolationDistribution: function(aggregations) {
		var formattedData = []; // Data to be returned
		// If there are buckets on organisations
		if(aggregations.org && aggregations.org.buckets && aggregations.org.buckets.length > 0 && aggregations.missingViolations) {
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
	 * Turn aggregations in to violation ratio per org
	 * @param {Object} aggregations
	 * @return {Object}
	 */
	toOrgViolationRatio: function(aggregations, top) {
		var columns = [];
		var filler = [];
		var groups = [];
		top = top || 100000;
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
				var val = 1.0 - (bucket.missingViolations.doc_count / bucket.doc_count);
				arr.push(val);
				columns.push(arr);
				groups.push(bucket.key);
			});
		}
		// Top 7
		columns = columns.slice(0, top);
		groups = groups.slice(0, top);
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
	},
	/**
	 * Turn aggregations into distribution over violation types 
	 * @param {Object} aggregations
	 * @param {String} orgKey
	 * @return {Object}
	 */
	toViolationTypeDistributions: function(aggregations, orgKey) {
		var columns = [];
		if(aggregations.violations_per_org_per_year && aggregations.violations_per_org_per_year.buckets) {
			var violationTypes = aggregations.violations_per_org_per_year.buckets;
			violationTypes.forEach(function(violationType) {
				var key = violationType.key;
				columns.push([key]);
				if(violationType.org && violationType.org.buckets) {
					var orgs = violationType.org.buckets;
					orgs.forEach(function(org) {
						if(orgKey.length === 0 || orgKey.indexOf(org.key) !== -1) {
							columns[columns.length-1].push(org.doc_count);
						}
					});					
				}
			});
		}
        // Sort the columns
        SearchFormUtil.getViolations(function(violations) { // Get grades
            var remap = {};
            Object.keys(violations).forEach(function(v) {
                remap[violations[v].name] = violations[v];
            });
            columns = columns.sort(
                firstBy(function(a, b) {
                    // Sort by grade
                    return remap[b[0]].grade - remap[a[0]].grade;
                })
                .thenBy(function(a, b) {
                    // Sort by sum
                    return _sum(b.slice(1,b.length-1)) - _sum(a.slice(1,a.length-1));
                })
            );
        });
        var chart = {
			columns: columns,
			donut: {
				label: {
					format: function (value, ratio) { return value; }
				}
			}
		};
		return chart;
	},
	/**
	 * Turn aggregations in to "Ratio of posts containing at least a grade 3 violation per org per year". If collapse is
	 * set to true, however, we collapse all org-curves in to one
	 * @param {Object} aggregations
	 * @param {Boolean} collapse
	 * @return {Object}
	 */
	toGrade3ViolationRatioYearTimeSeries: function(aggregations, collapse) {
		var xs = {};
		var columns = []; // One curve per org
		var collapsed = {}; // One curve for all orgs
		if(aggregations.violation_severity_per_org_per_year && aggregations.violation_severity_per_org_per_year.buckets) {
			var orgs = aggregations.violation_severity_per_org_per_year.buckets;
			// For every org
			orgs.forEach(function(org, i) {
				var X = ['x_' + org.key];
				var Y = [org.key];
				xs[org.key] = 'x_' + org.key;
				if(org.year && org.year.buckets) {
					var years = org.year.buckets;
					// For every year
					years.forEach(function(year) {
						if(year.severity && year.severity.buckets) {
							X.push(year.key);
							// Only look at severity == 3
							year.severity.buckets.forEach(function(severity) {
								if(severity.key === 3) {
									// Calc yearly ratio for one org
									if(!collapse) {
										Y.push(Math.round(severity.doc_count / year.doc_count * 100)/100);
									} else { // Sum values for all orgs
										if(collapsed[year.key]) {
											collapsed[year.key].docs += year.doc_count;
											collapsed[year.key].grade3s += severity.doc_count;
										} else {
											collapsed[year.key] = {
												docs: year.doc_count,
												grade3s: severity.doc_count
											}
										}
									}
								}
							});
							columns.push(X);
							columns.push(Y);
						}	
					});
				}
			});
		}
		if(collapse) {
			columns = [];
			var X = ['x_Alla lärosäten'];
			var Y = ['Alla lärosäten']
			xs['Alla lärosäten'] = 'x_Alla lärosäten';
			Object.keys(collapsed).map(function(key) {
				X.push(key);
				Y.push(Math.round(collapsed[key].grade3s / collapsed[key].docs * 100)/100);
			});
			columns.push(X);
			columns.push(Y);
		}
		var chart = {
			xs: xs,
			columns: columns
		};
		return chart;
	}
};

module.exports = FormatAggregationUtil;
