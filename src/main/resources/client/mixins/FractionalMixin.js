'use strict'

var FractCircle = require('components/FractCircle/FractCircle.js');

/**
 * Fractional Mixin. Used to display fractional filterFields with "(*)" in a nicer way
 */
var FractionalMixin = {
	components: {
		'fract-circle': FractCircle,
	},
	methods: {
		/**
		 * Removes "(*)"
		 * @param {String} str
		 */
		stripAsterisk: function(str) {
			return str.replace(/\(\*\)/, '');
		},
		/**
		 * Deduces whether "(*)" is present in the string
		 * @param {String} str
		 */
		fractionalField: function(str) {
			return str.search(/\(\*\)/) !== -1;
		}
	}
};

module.exports = FractionalMixin;