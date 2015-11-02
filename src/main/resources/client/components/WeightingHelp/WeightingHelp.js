'use strict';

// Mixins
var HelpMixin = require('mixins/HelpMixin/HelpMixin.js');

/**
 * Weighting Help-component
 */
var WeightingHelp = {
	mixins: [HelpMixin],
	template: require('./WeightingHelp.html'),
	ready: function() {
		this.initHelp({
			title: 'VIKTNING',
			content: require('docs/match_weight.md'),
			anchorToElement: this.$el
		});
	}
};

module.exports = WeightingHelp;