'use strict';

/**
 * Adds method which can convert array to string a la Sparql-query
 */
var arrayToSparqlString = function(arr) {
	var str = '';
	(arr || []).map(function(member, i) {
		str += member;
		if(i !== arr.length - 1) {
			str += ',';
		}
	}.bind(this));
	return str;
};

module.exports = arrayToSparqlString;